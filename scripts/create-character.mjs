import * as T from 'three';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import fs from 'node:fs';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
globalThis.FileReader=class{readAsArrayBuffer(b){b.arrayBuffer().then(v=>{this.result=v;this.onloadend?.()})}readAsDataURL(b){b.arrayBuffer().then(v=>{this.result='data:'+b.type+';base64,'+Buffer.from(v).toString('base64');this.onloadend?.()})}};
const root=new T.Group();root.name='MercerResident';
const materials={skin:new T.MeshStandardMaterial({name:'skin',color:'#9b6546',roughness:.85}),jacket:new T.MeshStandardMaterial({name:'jacket',color:'#cd5c30',roughness:.88}),pants:new T.MeshStandardMaterial({name:'pants',color:'#283647',roughness:.85}),shoe:new T.MeshStandardMaterial({name:'shoe',color:'#e9e1d0'}),dark:new T.MeshStandardMaterial({name:'dark',color:'#161c24'}),white:new T.MeshStandardMaterial({name:'white',color:'#f2dfba'})};
function mesh(g,m,p,s,parent=root,name=''){const o=new T.Mesh(g,materials[m]);o.name=name;o.position.set(...p);if(s)o.scale.set(...s);parent.add(o);return o}
const sphere=new T.SphereGeometry(1,12,8);
function ell(m,p,s,pa=root,n=''){return mesh(sphere,m,p,s,pa,n)}
function shape(m,points,p,parent=root,name=''){return mesh(new T.LatheGeometry(points.map(([x,y])=>new T.Vector2(x,y)),12),m,p,null,parent,name)}
// Adult proportions, flattened torso, separate elbow/knee pivots and fitted clothing.
const coat=shape('jacket',[[.19,0],[.205,.12],[.245,.36],[.25,.46],[.17,.53]], [0,.94,0],root,'Coat');coat.scale.z=.64;
ell('jacket',[0,1.43,-.055],[.18,.10,.10],root,'Hood');
shape('skin',[[.07,0],[.075,.13]],[0,1.45,0],root,'Neck');
ell('skin',[0,1.70,.005],[.126,.155,.115],root,'Head');
ell('skin',[0,1.615,.045],[.10,.065,.09],root,'Jaw');
ell('skin',[0,1.686,.12],[.023,.042,.037],root,'Nose');
for(const x of [-.128,.128])ell('skin',[x,1.7,0],[.024,.042,.025]);
ell('dark',[0,1.818,-.025],[.13,.062,.11],root,'Hair');
ell('dark',[0,1.804,.087],[.14,.014,.095],root,'CapBrim');
for(const x of [-.047,.047]){
 ell('white',[x,1.72,.109],[.023,.011,.006]);
 ell('dark',[x,1.72,.115],[.009,.010,.004]);
 ell('dark',[x,1.745,.103],[.029,.006,.008]);
}
ell('dark',[0,1.641,.119],[.035,.005,.003],root,'Mouth');
for(const side of [-1,1]){
 const suffix=side<0?'L':'R';
 const arm=new T.Group();arm.name='Arm'+suffix;arm.position.set(side*.255,1.43,0);root.add(arm);
 const sleeve=shape('jacket',[[.068,-.29],[.08,-.15],[.095,0]],[0,0,0],arm);sleeve.scale.z=.86;
 const elbow=new T.Group();elbow.name='Forearm'+suffix;elbow.position.set(0,-.29,0);arm.add(elbow);
 const lower=shape('jacket',[[.051,-.25],[.067,-.1],[.068,0]],[0,0,0],elbow);lower.scale.z=.88;
 shape('dark',[[.051,0],[.051,.035]],[0,-.265,0],elbow);
 ell('skin',[0,-.30,.015],[.045,.069,.032],elbow);
 ell('skin',[-side*.038,-.29,.033],[.019,.038,.021],elbow);
 const leg=new T.Group();leg.name='Leg'+suffix;leg.position.set(side*.115,.97,0);root.add(leg);
 const thigh=shape('pants',[[.075,-.44],[.10,-.17],[.115,0]],[0,0,0],leg);thigh.scale.z=.93;
 const knee=new T.Group();knee.name='Calf'+suffix;knee.position.set(0,-.44,0);leg.add(knee);
 shape('pants',[[.060,-.38],[.067,-.20],[.075,0]],[0,0,0],knee);
 ell('shoe',[0,-.437,.047],[.078,.06,.145],knee);
 ell('dark',[0,-.478,.05],[.080,.018,.147],knee);
 for(const z of [.05,.085,.12])mesh(new T.BoxGeometry(.085,.009,.013),'white',[0,-.394,z],null,knee);
}
mesh(new T.BoxGeometry(.015,.37,.012),'dark',[0,1.20,.151],null,root,'Zipper');
for(const side of [-1,1]){const pocket=mesh(new T.BoxGeometry(.085,.09,.012),'jacket',[side*.13,1.07,.131]);pocket.rotation.z=side*.1;}
const clips=[];
function clip(name,dur,amp){const tracks=[];for(const part of ['ArmL','ArmR','LegL','LegR','ForearmL','ForearmR','CalfL','CalfR']){const times=[],vals=[];for(let i=0;i<=8;i++){const t=i/8,sign=part.endsWith('L')?1:-1;let angle=Math.sin(t*Math.PI*2)*amp*sign*(part.startsWith('Arm')?-1:1);if(part.startsWith('Forearm'))angle=name==='Run'?-.9:name==='Attack'?(part==='ForearmR'?-.6-Math.sin(t*Math.PI)*.6:-1):-.13-Math.max(0,Math.sin(t*Math.PI*2)*sign)*.18;if(part.startsWith('Calf'))angle=name==='Idle'?0:Math.max(0,-Math.sin(t*Math.PI*2)*sign)*(name==='Run'?1:.5);if(name==='Attack'&&part==='ArmR')angle=-Math.sin(t*Math.PI)*1.8;const q=new T.Quaternion().setFromEuler(new T.Euler(angle,0,0));times.push(t*dur);vals.push(...q.toArray())}tracks.push(new T.QuaternionKeyframeTrack(part+'.quaternion',times,vals))}clips.push(new T.AnimationClip(name,dur,tracks))}
clip('Idle',3,.035);clip('Walk',.85,.38);clip('Run',.56,.7);clip('Attack',.42,.08);
// Batch clothing and facial geometry within each joint, preserving all animated pivots.
function batch(group){for(const c of [...group.children])if(c.isGroup)batch(c);const bins=new Map();for(const c of [...group.children])if(c.isMesh){c.updateMatrix();const g=c.geometry.clone().applyMatrix4(c.matrix);if(!bins.has(c.material))bins.set(c.material,[]);bins.get(c.material).push(g);group.remove(c)}for(const [m,gs] of bins){const merged=mergeGeometries(gs);if(merged){const o=new T.Mesh(merged,m);o.name=group.name+'_'+m.name;group.add(o)}}}batch(root);
const result=await new GLTFExporter().parseAsync(root,{binary:true,animations:clips,onlyVisible:true});fs.writeFileSync('public/models/mercer-resident.glb',Buffer.from(result));
console.log('Authored resident GLB:',result.byteLength,'bytes; 4 animation clips');
