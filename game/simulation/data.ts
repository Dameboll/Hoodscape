export const SKILLS=['Combat','Fitness','Hustling','Boosting','Street Rep'] as const;
export type Skill=typeof SKILLS[number];
export const xpFor=(level:number)=>Math.round(55*(level-1)**1.7);
export const levelFor=(xp:number)=>{let level=1;while(level<99&&xp>=xpFor(level+1))level++;return level};
export const UNLOCKS:Partial<Record<Skill,Record<number,string>>>={Boosting:{2:'Back-alley bike runs',5:'Scooter contracts',10:'Old sedan boosting',20:'Motorcycle contracts'},Hustling:{2:'Corner seller · weed and pills',3:'The long route',4:'Block dealer · cocaine and heroin',7:'Supplier · meth and fentanyl',10:'Kingpin · bank scores'},Combat:{2:'Wood bat access at Goldline Pawn',4:'Steel pipe access at Goldline Pawn',5:'9mm pistol access',7:'Pump shotgun access',10:'Carbine access'},Fitness:{2:'More efficient sprinting',5:'Long-distance runner'},'Street Rep':{2:'Known around The Towers',5:'Neighborhood regular',10:'Block name',20:'Citywide name'}};
export const STREET_RANKS=[{name:'Street Runner',level:1},{name:'Corner Seller',level:2},{name:'Block Dealer',level:4},{name:'Supplier',level:7},{name:'Kingpin',level:10}] as const;
export const streetRank=(xp:number)=>{const level=levelFor(xp);let rank=0;for(let i=0;i<STREET_RANKS.length;i++)if(level>=STREET_RANKS[i].level)rank=i;return rank};
export const WEAPONS={
 fists:{name:'Fists',kind:'melee',damage:12,heavy:25,range:2.25,cost:8,cooldown:.35},
 bat:{name:'Wood bat',kind:'melee',damage:19,heavy:34,range:3,cost:10,cooldown:.44},
 pipe:{name:'Steel pipe',kind:'melee',damage:25,heavy:43,range:2.75,cost:12,cooldown:.5},
 pistol:{name:'Saint 9mm',kind:'ranged',damage:34,heavy:34,range:70,cost:0,cooldown:.28,ammo:'ammo9',speed:62},
 shotgun:{name:'Marlow pump',kind:'ranged',damage:72,heavy:72,range:38,cost:0,cooldown:.9,ammo:'shells',speed:54},
 carbine:{name:'Mercer carbine',kind:'ranged',damage:27,heavy:27,range:90,cost:0,cooldown:.13,ammo:'ammo556',speed:78}
} as const;
export type Weapon=keyof typeof WEAPONS;
export type ItemDef={name:string;icon:string;price:number;stack:boolean;desc:string;heal?:number;equip?:boolean;weapon?:Weapon;requiresCombat?:number;drug?:boolean};
export const ITEMS:Record<string,ItemDef>={
water:{name:'Cold water',icon:'◈',price:4,stack:true,desc:'Recover 20 stamina.'},meal:{name:'Chicken & rice',icon:'▱',price:12,stack:true,heal:40,desc:'A hot plate. Restores 40 health.'},snack:{name:'Chips',icon:'▤',price:5,stack:true,heal:12,desc:'Restores 12 health.'},phone:{name:'Your phone',icon:'▯',price:0,stack:false,desc:'Your contacts, your connections. A key item.'},hoodie:{name:'Mercer hoodie',icon:'♜',price:85,stack:false,equip:true,desc:'Forest green. A fresh start.'},jacket:{name:'Sunset jacket',icon:'♜',price:0,stack:false,equip:true,desc:'Your original orange jacket.'},scrap:{name:'Salvaged parts',icon:'⚙',price:18,stack:true,desc:'The mechanic pays for usable parts.'},watch:{name:'Vintage watch',icon:'◷',price:65,stack:false,desc:'A pawn-shop find.'},parcel:{name:'Delivery parcel',icon:'▣',price:0,stack:false,desc:'Deliver this to the marked contact.'},tool:{name:'Basic toolkit',icon:'⚒',price:45,stack:false,desc:'Repair an owned vehicle for $10.'},cap:{name:'Mercer cap',icon:'⌁',price:25,stack:false,equip:true,desc:'A little neighborhood pride.'},bat:{name:'Wood bat',icon:'╱',price:95,stack:false,weapon:'bat',requiresCombat:2,desc:'Long reach and solid impact. Unlocks at Combat 2.'},pipe:{name:'Steel pipe',icon:'⌿',price:180,stack:false,weapon:'pipe',requiresCombat:4,desc:'Heavy street steel. Unlocks at Combat 4.'},
pistol:{name:'Saint 9mm',icon:'⌐',price:420,stack:false,weapon:'pistol',requiresCombat:5,desc:'Semi-automatic sidearm. Aim manually and place every shot.'},shotgun:{name:'Marlow pump',icon:'═',price:850,stack:false,weapon:'shotgun',requiresCombat:7,desc:'Hard-hitting close-range shotgun. One projectile, no spread lottery.'},carbine:{name:'Mercer carbine',icon:'≡',price:1600,stack:false,weapon:'carbine',requiresCombat:10,desc:'Fast, accurate rifle. Recoil is deterministic and player-controlled.'},
ammo9:{name:'9mm round',icon:'•',price:3,stack:true,desc:'One pistol round.'},shells:{name:'12-gauge shell',icon:'▪',price:9,stack:true,desc:'One shotgun shell.'},ammo556:{name:'5.56 round',icon:'·',price:4,stack:true,desc:'One carbine round.'},lockpick:{name:'Lockpick set',icon:'⌁',price:80,stack:false,desc:'Required for residential break-ins.'},
weed:{name:'Cannabis bag',icon:'♧',price:18,stack:true,drug:true,desc:'Low-tier street inventory.'},pills:{name:'Street pills',icon:'●',price:28,stack:true,drug:true,desc:'Pressed-pill street inventory.'},cocaine:{name:'Cocaine pack',icon:'◇',price:60,stack:true,drug:true,desc:'High-value street inventory.'},heroin:{name:'Heroin bundle',icon:'◆',price:72,stack:true,drug:true,desc:'High-risk street inventory.'},meth:{name:'Meth bag',icon:'✦',price:90,stack:true,drug:true,desc:'Supplier-tier street inventory.'},fentanyl:{name:'Fentanyl bundle',icon:'⬡',price:120,stack:true,drug:true,desc:'Maximum-risk supplier inventory.'}
};
export const DRUGS=[{id:'weed',rank:1,buy:18,sell:38,heat:.35},{id:'pills',rank:1,buy:28,sell:55,heat:.45},{id:'cocaine',rank:2,buy:60,sell:125,heat:.7},{id:'heroin',rank:2,buy:72,sell:150,heat:.85},{id:'meth',rank:3,buy:90,sell:195,heat:1},{id:'fentanyl',rank:3,buy:120,sell:260,heat:1.25}] as const;
export type Place={id:string;name:string;x:number;z:number;kind:string;color:string;hint:string};
export const PLACES:Place[]=[
{id:"loading",name:"East Loading Bay",x:42,z:31,kind:"story",color:"#e4b875",hint:"A locked cargo cage behind Ruiz Auto"},
{id:"meeting",name:"Tenant Noticeboard",x:-11,z:-34,kind:"story",color:"#e4b875",hint:"The Towers courtyard meeting point"},
{id:"relay",name:"Street Relay",x:-11,z:10,kind:"story",color:"#a4bc9a",hint:"A locked maintenance panel beside the ATM"},
{id:"bishop",name:"Bishop",x:18,z:-25,kind:"story",color:"#d49b78",hint:"A man who knows everybody’s business"},
{id:'deli',name:'Mercer Market',x:-13,z:28,kind:'shop',color:'#f2b661',hint:'Food, drinks & neighborhood work'},
{id:'pawn',name:'Goldline Pawn',x:13,z:23,kind:'pawn',color:'#d8aa56',hint:'Buy & sell your finds'},
{id:'home',name:"Mom’s Couch",x:-15,z:-38,kind:'home',color:'#f1c477',hint:'Rest, storage & save'},
{id:'bank',name:'Mercer ATM',x:-12,z:14,kind:'bank',color:'#83bab6',hint:'Keep your money safe'},
{id:'court',name:'Tower Court',x:23,z:-30,kind:'fight',color:'#ee905c',hint:'Find Dre. Earn your respect.'},
{id:'garage',name:'Ruiz Auto',x:14,z:49,kind:'garage',color:'#a7babf',hint:'Repairs & vehicle storage'},
{id:'food',name:'Sunday’s Kitchen',x:14,z:7,kind:'food',color:'#e18c69',hint:'Hot food. Honest work.'},
{id:'clothes',name:'BLOCK 09',x:-13,z:46,kind:'clothes',color:'#afb885',hint:'Dress like you belong'},
{id:'laundry',name:'Spin Cycle',x:-15,z:-19,kind:'job',color:'#8ebdbb',hint:'Help Ms. June with an errand'},
{id:'salvage',name:'Salvage Yard',x:47,z:45,kind:'salvage',color:'#adb878',hint:'Find something worth keeping'}
,{id:'plug',name:'Freight Contact',x:55,z:29,kind:'crime',color:'#d17869',hint:'Wholesale street inventory. Reputation opens stronger supply.'}
,{id:'cornerwest',name:'West Corner',x:-46,z:12,kind:'crime',color:'#d17869',hint:'Work the corner while keeping police out of sight.'}
,{id:'cornereast',name:'East Corner',x:44,z:13,kind:'crime',color:'#d17869',hint:'A busier corner with more exposure.'}
,{id:'rowhouse',name:'Vacant Rowhouse',x:-44,z:51,kind:'crime',color:'#d17869',hint:'A locked residence with valuables inside.'}
,{id:'dice',name:'Alley Dice',x:-44,z:-3,kind:'activity',color:'#d8aa56',hint:'Timed street dice games. Choose before the clock runs out.'}
];
export const NPCS=[
{id:'malik',name:'Malik',x:-10.5,z:27,color:'#668a77',role:'Market owner'},
{id:'june',name:'Ms. June',x:-12,z:-19,color:'#c08a88',role:'The neighborhood knows her'},
{id:'dre',name:'Dre',x:26,z:-30,color:'#e9c581',role:'Court regular'},
{id:'rosa',name:'Rosa',x:10.5,z:7,color:'#b96344',role:'Sunday’s Kitchen'},
{id:'ruiz',name:'Ruiz',x:11,z:49,color:'#5e8190',role:'Mechanic'},
{id:'eli',name:'Eli',x:10,z:23,color:'#8a769b',role:'Goldline Pawn'},
{id:'nia',name:'Nia',x:-10.5,z:46,color:'#90a488',role:'BLOCK 09'},
{id:'jay',name:'Jay',x:-9,z:-49,color:'#977862',role:'Night shift'},
{id:'tasha',name:'Tasha',x:10,z:-16,color:'#c69770',role:'Heading home'},
{id:'luis',name:'Luis',x:-10,z:6,color:'#b4b5a0',role:'Courier'},
{id:'dev',name:'Dev',x:10,z:37,color:'#6d8596',role:'Mercer local'},
{id:'imani',name:'Imani',x:-10,z:-3,color:'#c8a1a0',role:'Student'},
{id:'bishop',name:'Bishop',x:18,z:-25,color:'#563e48',role:'The neighborhood’s self-appointed broker',routine:'stand'},
{id:'vale',name:'Director Vale',x:-5,z:-34,color:'#5d657e',role:'Saint Mercer Initiative administrator',routine:'stand'},
{id:'marco',name:'Marco',x:-3,z:-10,color:'#8d6f7a',role:'Cross-town courier',routine:'cross'},
{id:'shea',name:'Shea',x:5,z:-8,color:'#507c79',role:'Always on the phone',routine:'phone'},
{id:'toni',name:'Toni',x:-15,z:19,color:'#b07a60',role:'Street vendor',routine:'work'},
{id:'kira',name:'Kira',x:16,z:26,color:'#787c9a',role:'Pawn runner',routine:'walk'},
{id:'omari',name:'Omari',x:2,z:44,color:'#ad875e',role:'Mechanic apprentice',routine:'work'},
{id:'lex',name:'Lex',x:42,z:-13,color:'#6d8596',role:'Late-shift courier',routine:'cross'},
{id:'riley',name:'Riley',x:-4,z:-52,color:'#a78362',role:'Apartment neighbor',routine:'stand'},
{id:'miles',name:'Miles',x:3,z:56,color:'#826f91',role:'Waiting on the bus',routine:'wait'},
{id:'andre',name:'Andre',x:-45,z:43,color:'#667f72',role:'Walking his dog',routine:'walk'},
{id:'maya',name:'Maya',x:45,z:21,color:'#9a6f63',role:'Coming off shift',routine:'cross'},
{id:'noelle',name:'Noelle',x:-44,z:-3,color:'#8b7594',role:'Sketching the block',routine:'stand'},
{id:'darnell',name:'Darnell',x:43,z:61,color:'#647f91',role:'Bus route regular',routine:'wait'},
{id:'rico',name:'Rico',x:-48,z:5,color:'#754f47',role:'Southside rival',routine:'rival'},
{id:'shay',name:'Shay',x:56,z:37,color:'#805663',role:'Freight-yard rival',routine:'rival'},
{id:'knox',name:'Knox',x:43,z:-59,color:'#4b586b',role:'Court rival',routine:'rival'}
];
export const JOBS=[
{id:'first',name:'A little trust',giver:'deli',target:'laundry',description:'Malik needs this parcel brought to Ms. June at Spin Cycle.',reward:35,xp:65,skill:'Hustling' as Skill,rep:12,requires:1},
{id:'dinner',name:'Dinner on the block',giver:'food',target:'home',description:'Bring a hot meal from Sunday’s Kitchen to the Towers.',reward:45,xp:80,skill:'Hustling' as Skill,rep:15,requires:2},
{id:'parts',name:'Special delivery',giver:'garage',target:'pawn',description:'Take Ruiz’s refurbished parts to Goldline Pawn.',reward:55,xp:90,skill:'Hustling' as Skill,rep:18,requires:2},
{id:'laundryrun',name:'Clean start',giver:'laundry',target:'home',description:'Help Ms. June deliver a bag of clean laundry to the Towers.',reward:30,xp:55,skill:'Hustling' as Skill,rep:12,requires:1},
{id:'threads',name:'Fresh shipment',giver:'clothes',target:'deli',description:'Drop Nia’s neighborhood pop-up flyers at Mercer Market.',reward:35,xp:65,skill:'Hustling' as Skill,rep:15,requires:1},
{id:'longrun',name:'Across the neighborhood',giver:'pawn',target:'laundry',description:'Walk an insured package across The Towers for Eli.',reward:70,xp:120,skill:'Hustling' as Skill,rep:25,requires:3}
];
export const VEHICLE_DEFS=[{id:'bike1',name:'Mercer BMX',type:'bike',x:-10,z:36,color:'#d8914e',value:80,require:1},{id:'bike2',name:'City bicycle',type:'bike',x:19,z:-23,color:'#708f84',value:90,require:1},{id:'sedan1',name:'1998 Regent',type:'car',x:6,z:39,color:'#91a8a1',value:650,require:10},{id:'sedan2',name:'1996 Marlow',type:'car',x:-6,z:-27,color:'#ac6c55',value:550,require:10}];
