import type {CharacterProfile} from './profile';
export type PvpMode='safe'|'ready';
export type OnlineStatus='loading'|'signed_out'|'setup'|'online'|'offline';
export type RemotePlayer={id:string;name:string;profile:CharacterProfile;x:number;z:number;yaw:number;pvpMode:PvpMode;zone:string|null;health:number;kills:number;deaths:number};
export const PVP_ZONES=[
 {id:'freight',name:'Freight Yard',x1:34,x2:66,z1:18,z2:52,level:'OPEN COMBAT'},
 {id:'south',name:'South Block',x1:-65,x2:-34,z1:-16,z2:23,level:'OPEN COMBAT'}
] as const;
export function pvpZoneAt(x:number,z:number){return PVP_ZONES.find(a=>x>=a.x1&&x<=a.x2&&z>=a.z1&&z<=a.z2)||null}
export const clampWorld=(n:unknown,min:number,max:number)=>Math.max(min,Math.min(max,typeof n==='number'&&Number.isFinite(n)?n:0));
