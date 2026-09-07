export const CREWS=[
 {id:'ember',name:'Ember Court',color:'#c65c52',district:'Cinder Cut',recruiter:'zuri',place:'ember_contact',tag:'THE COURT REMEMBERS',description:'A loose neighborhood crew built around the south court, mutual aid, and a reputation for never letting a debt disappear.',territory:{x1:-66,x2:-18,z1:-71,z2:-18}},
 {id:'copper',name:'Copperline',color:'#d49a56',district:'Northline',recruiter:'benji',place:'copper_contact',tag:'KEEP THE BLOCK MOVING',description:'Northside runners who know every back stair, side door, and late-night delivery route.',territory:{x1:-66,x2:-18,z1:7,z2:71}},
 {id:'jade',name:'Jade Relay',color:'#56a28a',district:'Freight Row',recruiter:'simone',place:'jade_contact',tag:'EVERYTHING HAS A ROUTE',description:'A freight-yard network that treats information, tools, and favors like currency.',territory:{x1:18,x2:66,z1:-5,z2:71}},
 {id:'iron',name:'Iron North',color:'#74899c',district:'Mercer Records',recruiter:'voss',place:'iron_contact',tag:'THEY KEEP THEIR OWN SCORE',description:'A disciplined south-east crew with old industrial ties and very little patience for trespassers.',territory:{x1:18,x2:66,z1:-71,z2:-17}}
] as const;

export type CrewId=typeof CREWS[number]['id'];
export type Crew=typeof CREWS[number];

export const isCrewId=(value:unknown):value is CrewId=>typeof value==='string'&&CREWS.some(crew=>crew.id===value);
export const crewById=(id:unknown)=>CREWS.find(crew=>crew.id===id);
export const crewForPlace=(place:string)=>CREWS.find(crew=>crew.place===place);
export const crewForPoint=(x:number,z:number)=>CREWS.find(crew=>x>=crew.territory.x1&&x<=crew.territory.x2&&z>=crew.territory.z1&&z<=crew.territory.z2);
export const defaultCrewRep=()=>Object.fromEntries(CREWS.map(crew=>[crew.id,0])) as Record<CrewId,number>;
