import type {Skill} from './data';

export const SKIN_TONES=[
 {id:'ebony',label:'Ebony',color:'#3d241c'},{id:'deep',label:'Deep',color:'#5b3425'},{id:'umber',label:'Umber',color:'#744934'},
 {id:'bronze',label:'Bronze',color:'#986348'},{id:'warm',label:'Warm',color:'#b77f5f'},
 {id:'golden',label:'Golden',color:'#c99570'},{id:'light',label:'Light',color:'#dfb293'},{id:'fair',label:'Fair',color:'#efc8ac'}
] as const;
export const HAIR_COLORS=[
 {id:'black',label:'Black',color:'#171b1d'},{id:'brown',label:'Dark brown',color:'#352520'},
 {id:'auburn',label:'Auburn',color:'#654032'},{id:'blonde',label:'Blonde',color:'#a58558'},
 {id:'silver',label:'Silver',color:'#85888a'},{id:'blueblack',label:'Blue black',color:'#171d29'}
] as const;
export const STYLES=[
 {id:'sunset',label:'Sunset',color:'#cf6940',pants:'#31434a',shoes:'#252c2d'},
 {id:'forest',label:'Forest',color:'#567b65',pants:'#313b38',shoes:'#41352f'},
 {id:'steel',label:'Steel blue',color:'#687b91',pants:'#3b3d49',shoes:'#24292d'},
 {id:'burgundy',label:'Burgundy',color:'#824f55',pants:'#363a41',shoes:'#4c382f'},
 {id:'midnight',label:'Midnight',color:'#303941',pants:'#242a31',shoes:'#1c2022'},
 {id:'cream',label:'Cream',color:'#b9aa88',pants:'#4b463e',shoes:'#2b2825'},
 {id:'royal',label:'Royal',color:'#4c588c',pants:'#282d3d',shoes:'#20242c'},
 {id:'rose',label:'Dusty rose',color:'#9a6268',pants:'#403a43',shoes:'#30272b'}
] as const;
export const BUILDS=[
 {id:'lean',label:'Lean',note:'Narrow frame',scale:[.94,1,.94]},
 {id:'balanced',label:'Balanced',note:'Natural frame',scale:[1,1,1]},
 {id:'solid',label:'Solid',note:'Broad frame',scale:[1.06,1.01,1.06]},
 {id:'tall',label:'Tall',note:'Long frame',scale:[.98,1.07,.98]},
 {id:'compact',label:'Compact',note:'Short strong frame',scale:[1.03,.94,1.03]},
 {id:'rangy',label:'Rangy',note:'Tall narrow frame',scale:[.93,1.09,.93]}
] as const;
export const FACE_SHAPES=[
 {id:'classic',label:'Classic',note:'Open expression'},
 {id:'sharp',label:'Sharp',note:'Defined features'},
 {id:'soft',label:'Soft',note:'Gentle features'},
 {id:'freckled',label:'Freckles',note:'Sun-kissed detail'},
 {id:'scarred',label:'Scarred',note:'Hard-earned history'},
 {id:'painted',label:'Painted',note:'Game-day stripe'}
] as const;
export const HEAD_STYLES=[
 {id:'fade',label:'Clean fade',note:'Tapered and neat'},
 {id:'curls',label:'Curls',note:'Full textured top'},
 {id:'locs',label:'Locs',note:'Long tied locs'},
 {id:'braids',label:'Braids',note:'Tight side braids'},
 {id:'buzz',label:'Buzz cut',note:'Low and sharp'},
 {id:'beanie',label:'Beanie',note:'Night-shift staple'}
] as const;
export const BODY_TYPES=[
 {id:'athletic',label:'Athletic',note:'Strong shoulders',scale:[1.05,1.01,1.02]},
 {id:'slender',label:'Slender',note:'Light silhouette',scale:[.96,1.02,.96]},
 {id:'stocky',label:'Stocky',note:'Low center of gravity',scale:[1.08,.97,1.08]},
 {id:'broad',label:'Broad',note:'Heavy upper frame',scale:[1.12,1,1.04]},
 {id:'willowy',label:'Willowy',note:'Long and loose',scale:[.96,1.07,.96]},
 {id:'compact',label:'Compact',note:'Short and quick',scale:[1.06,.93,1.06]}
] as const;
export const PRONOUNS=[{id:'he',label:'He / Him'},{id:'she',label:'She / Her'},{id:'they',label:'They / Them'}] as const;
export type Background={id:string;label:string;tag:string;description:string;effect:string;skill:Skill;xp:number;cash?:number;item?:string;qty?:number};
export const BACKGROUNDS=[
 {id:'local',label:'Born Here',tag:'THE BLOCK KNOWS YOUR FAMILY',description:'You grew up in The Towers. Old faces recognize the name before they trust the person.',effect:'Start with +55 Street Rep XP and $25.',skill:'Street Rep' as Skill,xp:55,cash:25},
 {id:'athlete',label:'Athlete',tag:'DISCIPLINE BEFORE GLORY',description:'Years on cracked courts taught you pace, recovery, and how to keep moving.',effect:'Start with +55 Fitness XP and 2 cold waters.',skill:'Fitness' as Skill,xp:55,item:'water',qty:2},
 {id:'mechanic',label:'Mechanic',tag:'EVERY MACHINE TELLS ON ITSELF',description:'You learned on old engines and borrowed tools. Ruiz has heard you can work.',effect:'Start with +55 Boosting XP and a basic toolkit.',skill:'Boosting' as Skill,xp:55,item:'tool',qty:1},
 {id:'fighter',label:'Fighter',tag:'YOU LEARNED TO STAY STANDING',description:'The court and the gym gave you timing, patience, and a reputation for finishing rounds.',effect:'Start with +55 Combat XP and a snack.',skill:'Combat' as Skill,xp:55,item:'snack',qty:1},
 {id:'hustler',label:'Hustler',tag:'YOU ALWAYS FIND THE ANGLE',description:'Odd jobs became introductions. Introductions became opportunity.',effect:'Start with +55 Hustling XP and $75.',skill:'Hustling' as Skill,xp:55,cash:75}
 ,{id:'racer',label:'Street Racer',tag:'EVERY LIGHT LOOKS LIKE A START LINE',description:'You learned the city by chasing taillights through it.',effect:'Start with +80 Boosting XP.',skill:'Boosting' as Skill,xp:80}
 ,{id:'courier',label:'Courier',tag:'THE CITY TAUGHT YOU SHORTCUTS',description:'You know which alleys connect and which doors stay open late.',effect:'Start with +70 Fitness XP and $30.',skill:'Fitness' as Skill,xp:70,cash:30}
 ,{id:'volunteer',label:'Community Volunteer',tag:'PEOPLE HAVE SEEN YOU SHOW UP',description:'You carried groceries, watched kids, and learned every family name.',effect:'Start with +80 Street Rep XP.',skill:'Street Rep' as Skill,xp:80}
 ,{id:'nightshift',label:'Night Shift',tag:'YOU KNOW THE CITY AFTER MIDNIGHT',description:'Long hours made you patient, alert, and hard to surprise.',effect:'Start with +70 Hustling XP and 2 snacks.',skill:'Hustling' as Skill,xp:70,item:'snack',qty:2}
 ,{id:'formercrew',label:'Former Crew',tag:'YOU LEFT, BUT HISTORY STAYED',description:'You walked away from an old circle. Some people respect it. Others remember.',effect:'Start with +80 Combat XP.',skill:'Combat' as Skill,xp:80}
] as const satisfies readonly Background[];
export const PERSONALITIES=[
 {id:'charismatic',label:'Charismatic',tag:'PEOPLE REMEMBER HOW YOU MADE THEM FEEL',description:'You can turn a first meeting into an opening.',effect:'+20% Street Rep XP from every source.'},
 {id:'calculating',label:'Calculating',tag:'YOU NOTICE THE NUMBER BEHIND THE NUMBER',description:'You listen, wait, and know when a price can move.',effect:'7% lower prices at every shop.'},
 {id:'fearless',label:'Fearless',tag:'PRESSURE MAKES YOU CLEARER',description:'When things turn physical, you commit.',effect:'+10% damage with fists, melee weapons, and firearms.'},
 {id:'quiet',label:'Quiet',tag:'THE LESS SAID, THE LESS REPEATED',description:'You move without announcing yourself.',effect:'Police exposure builds 0.25 stars slower.'},
 {id:'loyal',label:'Loyal',tag:'YOU SHOW UP TWICE',description:'You treat every small promise like it has your name on it.',effect:'+10% Hustling XP from jobs and street work.'}
] as const;

export type CharacterProfile={
 complete:true;name:string;pronouns:typeof PRONOUNS[number]['id'];skin:typeof SKIN_TONES[number]['id'];
 hair:typeof HAIR_COLORS[number]['id'];style:typeof STYLES[number]['id'];build:typeof BUILDS[number]['id'];
 background:typeof BACKGROUNDS[number]['id'];personality:typeof PERSONALITIES[number]['id'];
 face?:typeof FACE_SHAPES[number]['id'];head?:typeof HEAD_STYLES[number]['id'];body?:typeof BODY_TYPES[number]['id'];
};
export const DEFAULT_PROFILE:CharacterProfile={complete:true,name:'Mercer',pronouns:'they',skin:'bronze',hair:'black',style:'sunset',build:'balanced',background:'local',personality:'charismatic',face:'classic',head:'fade',body:'athletic'};
const has=(list:readonly {id:string}[],id:unknown)=>typeof id==='string'&&list.some(x=>x.id===id);
export function validProfile(p:unknown):p is CharacterProfile{if(!p||typeof p!=='object')return false;const v=p as CharacterProfile;return v.complete===true&&typeof v.name==='string'&&v.name.trim().length>=2&&v.name.length<=18&&has(PRONOUNS,v.pronouns)&&has(SKIN_TONES,v.skin)&&has(HAIR_COLORS,v.hair)&&has(STYLES,v.style)&&has(BUILDS,v.build)&&has(BACKGROUNDS,v.background)&&has(PERSONALITIES,v.personality)&&(v.face===undefined||has(FACE_SHAPES,v.face))&&(v.head===undefined||has(HEAD_STYLES,v.head))&&(v.body===undefined||has(BODY_TYPES,v.body))}
export function choice<T extends {id:string}>(list:readonly T[],id:string):T{return list.find(x=>x.id===id)!}
