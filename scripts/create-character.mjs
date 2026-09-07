import * as T from 'three';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import fs from 'node:fs';

globalThis.FileReader=class{readAsArrayBuffer(blob){blob.arrayBuffer().then(value=>{this.result=value;this.onloadend?.()})}readAsDataURL(blob){blob.arrayBuffer().then(value=>{this.result='data:'+blob.type+';base64,'+Buffer.from(value).toString('base64');this.onloadend?.()})}};

const root=new T.Group();
root.name='MercerResident';

const materials={
 skin:new T.MeshStandardMaterial({name:'skin',color:'#9b6546',roughness:.86}),
 jacket:new T.MeshStandardMaterial({name:'jacket',color:'#cd5c30',roughness:.8}),
 pants:new T.MeshStandardMaterial({name:'pants',color:'#283647',roughness:.88}),
 shoe:new T.MeshStandardMaterial({name:'shoe',color:'#e9e1d0',roughness:.73}),
 dark:new T.MeshStandardMaterial({name:'dark',color:'#171c22',roughness:.9}),
 white:new T.MeshStandardMaterial({name:'white',color:'#f1e7d0',roughness:.62}),
 metal:new T.MeshStandardMaterial({name:'metal',color:'#a7987f',roughness:.45,metalness:.35})
};

function mesh(geometry,material,position=[0,0,0],parent=root,name=''){
 const item=new T.Mesh(geometry,materials[material]);
 item.name=name;
 item.position.set(...position);
 item.castShadow=true;
 item.receiveShadow=true;
 parent.add(item);
 return item;
}

function rounded(material,position,scale,parent=root,name='',radius=.06){return mesh(new RoundedBoxGeometry(scale[0],scale[1],scale[2],3,radius),material,position,parent,name)}
function capsule(material,position,radius,length,parent=root,name=''){return mesh(new T.CapsuleGeometry(radius,length,5,10),material,position,parent,name)}
function ellipsoid(material,position,scale,parent=root,name=''){const item=mesh(new T.SphereGeometry(1,16,12),material,position,parent,name);item.scale.set(...scale);return item}
function rod(material,a,b,radius,parent=root,name=''){const start=new T.Vector3(...a),end=new T.Vector3(...b),delta=end.clone().sub(start),item=mesh(new T.CylinderGeometry(radius,radius,delta.length(),8),material,[0,0,0],parent,name);item.position.copy(start).add(end).multiplyScalar(.5);item.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),delta.normalize());return item}

// A compact adult body with deliberately broad shoulders. The animated limbs retain
// named pivots so gameplay animations keep working while the silhouette reads at distance.
ellipsoid('skin',[0,1.15,0],[.325,.36,.21],root,'CoreBody');
rounded('jacket',[0,1.31,0],[.64,.58,.36],root,'JacketTorso',.11);
rounded('jacket',[0,1.55,0],[.78,.18,.39],root,'ShoulderYoke',.075);
rounded('dark',[0,1.33,.196],[.13,.34,.02],root,'JacketZip',.01);
for(const side of [-1,1]){const pocket=rounded('jacket',[side*.19,1.19,.205],[.17,.12,.026],root,'JacketPocket',.014);pocket.rotation.z=-side*.16}
ellipsoid('skin',[0,1.69,0],[.12,.14,.11],root,'Neck');
ellipsoid('skin',[0,1.91,.006],[.205,.245,.182],root,'HeadSkin');
ellipsoid('skin',[0,1.78,.075],[.15,.09,.11],root,'Jawline');
ellipsoid('skin',[0,1.91,.187],[.035,.052,.04],root,'Nose');
for(const side of [-1,1]){ellipsoid('skin',[side*.205,1.91,.004],[.035,.07,.04],root,'Ear');ellipsoid('white',[side*.077,1.94,.174],[.034,.018,.012],root,'EyeWhite');ellipsoid('dark',[side*.077,1.94,.187],[.014,.014,.009],root,'Pupil');rounded('dark',[side*.083,1.984,.18],[.09,.014,.022],root,'Brow',.006)}
rounded('dark',[0,1.824,.186],[.112,.014,.014],root,'Mouth',.005);
ellipsoid('dark',[0,2.08,-.005],[.214,.105,.18],root,'HairBase');
rounded('dark',[0,2.005,.15],[.21,.026,.125],root,'Hairline',.022);

for(const side of [-1,1]){
 const suffix=side<0?'L':'R',arm=new T.Group();arm.name='Arm'+suffix;arm.position.set(side*.405,1.52,0);root.add(arm);
 ellipsoid('jacket',[0,-.105,0],[.125,.16,.14],arm,'ShoulderPad');capsule('jacket',[0,-.275,0],.105,.29,arm,'UpperArm');
 const elbow=new T.Group();elbow.name='Forearm'+suffix;elbow.position.set(0,-.56,0);arm.add(elbow);
 ellipsoid('jacket',[0,.035,0],[.11,.10,.12],elbow,'Elbow');capsule('jacket',[0,-.19,0],.085,.24,elbow,'ForearmSleeve');ellipsoid('skin',[0,-.45,.015],[.09,.11,.072],elbow,'Hand');
 for(const offset of [-.038,0,.038])ellipsoid('skin',[offset,-.52,.04],[.018,.04,.028],elbow,'Finger');
 const leg=new T.Group();leg.name='Leg'+suffix;leg.position.set(side*.17,1.02,0);root.add(leg);
 ellipsoid('pants',[0,-.13,0],[.16,.18,.15],leg,'Hip');capsule('pants',[0,-.34,0],.13,.31,leg,'Thigh');
 const knee=new T.Group();knee.name='Calf'+suffix;knee.position.set(0,-.71,0);leg.add(knee);
 ellipsoid('pants',[0,.025,0],[.132,.11,.135],knee,'Knee');capsule('pants',[0,-.245,0],.102,.27,knee,'Calf');rounded('shoe',[0,-.56,.092],[.235,.14,.39],knee,'Sneaker',.065);rounded('dark',[0,-.55,.17],[.24,.035,.20],knee,'Sole',.012);
 for(const z of [.005,.065,.125])rounded('white',[0,-.49,z],[.13,.012,.023],knee,'Lace',.004);
}

// Small clothing hardware makes the resident feel authored without texture downloads.
for(const side of [-1,1]){rod('metal',[side*.33,1.48,.14],[side*.41,1.22,.14],.006,root,'Seam');ellipsoid('metal',[side*.14,1.64,.09],[.018,.018,.018],root,'CollarSnap')}

const clips=[];
function clip(name,duration,amplitude){
 const tracks=[];
 for(const part of ['ArmL','ArmR','LegL','LegR','ForearmL','ForearmR','CalfL','CalfR']){
  const times=[],values=[];
  for(let index=0;index<=10;index++){
   const phase=index/10,side=part.endsWith('L')?1:-1;
   let angle=Math.sin(phase*Math.PI*2)*amplitude*side*(part.startsWith('Arm')?-1:1);
   if(part.startsWith('Forearm'))angle=name==='Run'?-0.62-Math.max(0,Math.sin(phase*Math.PI*2)*side)*.46:name==='Attack'?(part==='ForearmR'?-1.05-Math.sin(phase*Math.PI)*.65:-.55):-.12-Math.max(0,Math.sin(phase*Math.PI*2)*side)*.12;
   if(part.startsWith('Calf'))angle=name==='Idle'?0:Math.max(0,-Math.sin(phase*Math.PI*2)*side)*(name==='Run'?.84:.52);
   if(name==='Attack'&&part==='ArmR')angle=-Math.sin(phase*Math.PI)*1.72;
   if(name==='Attack'&&part==='ArmL')angle=.22+Math.sin(phase*Math.PI)*.28;
   const q=new T.Quaternion().setFromEuler(new T.Euler(angle,0,0));times.push(phase*duration);values.push(...q.toArray());
  }
  tracks.push(new T.QuaternionKeyframeTrack(part+'.quaternion',times,values));
 }
 clips.push(new T.AnimationClip(name,duration,tracks));
}
clip('Idle',3,.025);clip('Walk',.86,.44);clip('Run',.57,.76);clip('Attack',.44,.08);

// Keep the authored mesh names intact. The resident is still small enough for web delivery,
// while these named pieces let the runtime apply facial, hair, outfit, and body variants.

const result=await new GLTFExporter().parseAsync(root,{binary:true,animations:clips,onlyVisible:true});
fs.writeFileSync('public/models/mercer-resident.glb',Buffer.from(result));
console.log('Authored Saint Mercer resident:',result.byteLength,'bytes; 4 animation clips');
