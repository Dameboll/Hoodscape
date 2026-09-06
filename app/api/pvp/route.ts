import {eq} from 'drizzle-orm';
import {getChatGPTUser} from '@/app/chatgpt-auth';
import {getDb} from '@/db';
import {players} from '@/db/schema';
import {pvpZoneAt} from '@/game/simulation/online';
import {levelFor,WEAPONS,type Weapon} from '@/game/simulation/data';
import {migrateSave,validSave} from '@/game/simulation/state';
export const dynamic='force-dynamic';
const parse=(raw:string)=>{try{const x=JSON.parse(raw);return validSave(x)?migrateSave(x):null}catch{return null}};
export async function POST(request:Request){
 const user=await getChatGPTUser();if(!user)return Response.json({error:'Sign in required.'},{status:401});
 try{
  const body=await request.json() as {targetId?:string;attack?:'light'|'heavy'|'shot';weapon?:Weapon};
  if(!body.targetId||!body.attack||!body.weapon||!WEAPONS[body.weapon])return Response.json({error:'Invalid attack.'},{status:400});
  const db=getDb(),rows=await Promise.all([db.select().from(players).where(eq(players.userId,user.id)).limit(1),db.select().from(players).where(eq(players.userId,body.targetId)).limit(1)]),attacker=rows[0][0],target=rows[1][0];
  if(!attacker||!target)return Response.json({error:'Player left the area.'},{status:404});
  const aZone=pvpZoneAt(attacker.x,attacker.z),tZone=pvpZoneAt(target.x,target.z);
  if(attacker.pvpMode!=='ready'||target.pvpMode!=='ready'||!aZone||aZone.id!==tZone?.id)return Response.json({error:'Both players must enable PvP inside the same combat zone.'},{status:409});
  const save=parse(attacker.saveJson),targetSave=parse(target.saveJson);
  if(!save||!targetSave||(save.weapon||'fists')!==body.weapon)return Response.json({error:'Loadout changed.'},{status:409});
  const weapon=WEAPONS[body.weapon],ranged=weapon.kind==='ranged',range=ranged?28:weapon.range+.7,distance=Math.hypot(attacker.x-target.x,attacker.z-target.z),now=Date.now(),cooldown=Math.max(130,weapon.cooldown*800);
  if(distance>range||now-attacker.lastAttackAt<cooldown)return Response.json({error:'Attack missed.'},{status:409});
  let damage:number=body.attack==='heavy'?weapon.heavy:weapon.damage;damage+=levelFor(save.xp.Combat)*(body.attack==='heavy'?1.5:.7);if(save.profile?.personality==='fearless')damage*=1.1;damage=Math.round(damage);
  const health=Math.max(0,target.health-damage),knockout=health<=0;targetSave.health=knockout?100:health;if(knockout){targetSave.x=-8;targetSave.z=22}
  await db.batch([db.update(players).set({lastAttackAt:now}).where(eq(players.userId,user.id)),db.update(players).set({health:knockout?100:health,deaths:knockout?target.deaths+1:target.deaths,x:knockout?-8:target.x,z:knockout?22:target.z,pvpMode:knockout?'safe':target.pvpMode,saveJson:JSON.stringify(targetSave),updatedAt:now}).where(eq(players.userId,target.userId))]);
  if(knockout)await db.update(players).set({kills:attacker.kills+1}).where(eq(players.userId,attacker.userId));
  return Response.json({ok:true,damage,knockout,targetHealth:knockout?100:health});
 }catch(error){console.error('pvp failed',error);return Response.json({error:'PvP action could not be verified.'},{status:503})}
}
