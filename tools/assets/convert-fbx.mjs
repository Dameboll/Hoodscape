import fs from 'node:fs';
import path from 'node:path';
import * as T from 'three';
import {FBXLoader} from 'three/addons/loaders/FBXLoader.js';
import {GLTFExporter} from 'three/addons/exporters/GLTFExporter.js';

const transparentPixel='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLzJwAAAABJRU5ErkJggg==';
globalThis.window=globalThis;
globalThis.document={createElementNS(){const listeners={};return{width:1,height:1,addEventListener(type,listener){listeners[type]=listener},removeEventListener(){},set src(_value){queueMicrotask(()=>listeners.load?.())}}}};
globalThis.FileReader=class{readAsArrayBuffer(blob){blob.arrayBuffer().then(value=>{this.result=value;this.onloadend?.()})}readAsDataURL(blob){blob.arrayBuffer().then(value=>{this.result=`data:${blob.type};base64,${Buffer.from(value).toString('base64')}`;this.onloadend?.()})}};

const [kind,input,output]=process.argv.slice(2);
if(!kind||!input||!output)throw new Error('Usage: node tools/assets/convert-fbx.mjs KIND INPUT.fbx OUTPUT.glb');

const manager=new T.LoadingManager();
manager.setURLModifier(()=>transparentPixel);
const bytes=fs.readFileSync(input);
const source=new FBXLoader(manager).parse(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),path.dirname(input)+'/');
source.updateMatrixWorld(true);

const palettes={
 body:new T.MeshStandardMaterial({name:'vehicle_body',color:'#788d8c',roughness:.38,metalness:.3}),
 trim:new T.MeshStandardMaterial({name:'vehicle_trim',color:'#22292d',roughness:.68,metalness:.18}),
 glass:new T.MeshStandardMaterial({name:'vehicle_glass',color:'#53747c',roughness:.15,metalness:.24,transparent:true,opacity:.76}),
 rubber:new T.MeshStandardMaterial({name:'vehicle_rubber',color:'#111316',roughness:.94}),
 light:new T.MeshStandardMaterial({name:'vehicle_light',color:'#f3dbb1',roughness:.25,emissive:'#6d522d',emissiveIntensity:.45}),
 metal:new T.MeshStandardMaterial({name:'weapon_metal',color:'#20262a',roughness:.32,metalness:.78}),
 wood:new T.MeshStandardMaterial({name:'weapon_wood',color:'#75472c',roughness:.58,metalness:.02}),
 skin:new T.MeshStandardMaterial({name:'skin',color:'#9b6546',roughness:.82}),
 eye:new T.MeshStandardMaterial({name:'eyes',color:'#e8dfd2',roughness:.55}),
 jacket:new T.MeshStandardMaterial({name:'jacket',color:'#b8583f',roughness:.76}),
 pants:new T.MeshStandardMaterial({name:'pants',color:'#28384a',roughness:.86}),
 shoe:new T.MeshStandardMaterial({name:'shoe',color:'#e0d8c8',roughness:.7})
};

function applyMaterial(mesh,material){mesh.material=material;mesh.castShadow=true;mesh.receiveShadow=true}
function centerOf(object){return new T.Box3().setFromObject(object).getCenter(new T.Vector3())}
function nearestWheels(body,count=4){const center=centerOf(body);return source.children.filter(o=>o.isMesh&&/^wheel/i.test(o.name)).sort((a,b)=>centerOf(a).distanceToSquared(center)-centerOf(b).distanceToSquared(center)).slice(0,count)}
function semanticVehicleMaterial(label){label=label.toLowerCase();if(/glass|windshield/.test(label))return palettes.glass;if(/wheel|tire|rubber/.test(label))return palettes.rubber;if(/optic|headlight|taillight|reverse|blinker|light/.test(label))return palettes.light;if(/body|hood|door|bumper|trunk|paint/.test(label))return palettes.body;return palettes.trim}
function applyVehicleMaterials(mesh){const original=Array.isArray(mesh.material)?mesh.material:[mesh.material];mesh.material=original.map(material=>semanticVehicleMaterial(`${mesh.name} ${material?.name||''}`));if(!Array.isArray(mesh.material)||mesh.material.length===1)mesh.material=mesh.material[0];mesh.castShadow=true;mesh.receiveShadow=true}
function selectVehicle(){
 const bodyNames={carter:'Carter98_Body',shvan:'Shvan92_Body','generic-sedan':'Sedan_Body','generic-suv':'SUV_Body','generic-pickup':'Pickup_Body','generic-coupe':'Coupe_Body'};
 const body=source.getObjectByName(bodyNames[kind]);if(!body)throw new Error(`Missing body ${bodyNames[kind]}`);
 if(kind==='carter'||kind==='shvan')return source.children.filter(o=>o.isMesh);
 return [body,...nearestWheels(body)];
}
function selectWeapon(){return source.children.filter(o=>o.isMesh)}
function segmentMaleBody(mesh){
 const geometry=mesh.geometry,index=geometry.index,position=geometry.attributes.position,count=index?.count||position.count,categories=[[],[],[],[]],vertexAt=offset=>index?index.getX(offset):offset;
 for(let offset=0;offset<count;offset+=3){let x=0,y=0;for(let corner=0;corner<3;corner++){const vertex=vertexAt(offset+corner);x+=position.getX(vertex);y+=position.getY(vertex)}x/=3;y/=3;const material=y<14.5?3:y<82.5?2:(y>143||Math.abs(x)>42.5)?0:1;categories[material].push(vertexAt(offset),vertexAt(offset+1),vertexAt(offset+2))}
 const ordered=categories.flat(),ArrayType=ordered.some(i=>i>65535)?Uint32Array:Uint16Array;geometry.setIndex(new T.BufferAttribute(new ArrayType(ordered),1));geometry.clearGroups();let start=0;for(let material=0;material<categories.length;material++){geometry.addGroup(start,categories[material].length,material);start+=categories[material].length}mesh.material=[palettes.skin,palettes.jacket,palettes.pants,palettes.shoe];mesh.castShadow=true;mesh.receiveShadow=true;
}
function makeCharacterClips(body,eyes){
 const rigs=[body.skeleton,eyes?.skeleton].filter(Boolean);if(rigs[1])for(const bone of rigs[1].bones)bone.name+='_face';
 const definitions=[['Idle',2.8,.035],['Walk',.9,.48],['Run',.62,.78],['Attack',.48,.12]];const clips=[];
 for(const [name,duration,amplitude] of definitions){const tracks=[];for(const skeleton of rigs){const bones=new Map(skeleton.bones.map(b=>[b.name.replace('_face',''),b]));for(const key of ['LeftArm','RightArm','LeftForeArm','RightForeArm','LeftUpLeg','RightUpLeg','LeftLeg','RightLeg','Spine1']){const bone=bones.get(key);if(!bone)continue;const times=[],values=[];for(let step=0;step<=8;step++){const phase=step/8,wave=Math.sin(phase*Math.PI*2),left=key.startsWith('Left')?1:-1;let x=0,z=0;if(key==='LeftArm'||key==='RightArm'){z=left*-1.24;x=name==='Attack'&&key==='RightArm'?-Math.sin(phase*Math.PI)*1.3:wave*amplitude*left*-1}if(key.includes('ForeArm'))x=name==='Attack'&&key==='RightForeArm'?-1-Math.sin(phase*Math.PI)*.7:-.18-Math.max(0,wave*left)*.28;if(key.endsWith('UpLeg'))x=wave*amplitude*left;if(key==='LeftLeg'||key==='RightLeg')x=name==='Idle'?0:Math.max(0,-wave*left)*(name==='Run'?.85:.52);if(key==='Spine1'){x=name==='Attack'?-.18*Math.sin(phase*Math.PI):.025*Math.sin(phase*Math.PI*2);z=.018*wave}const delta=new T.Quaternion().setFromEuler(new T.Euler(x,0,z)),q=bone.quaternion.clone().multiply(delta);times.push(phase*duration);values.push(...q.toArray())}tracks.push(new T.QuaternionKeyframeTrack(`${bone.name}.quaternion`,times,values))}}
  clips.push(new T.AnimationClip(name,duration,tracks))}return clips;
}
function normalize(objects,targetLength,rotateY=0,byHeight=false){
 const content=new T.Group();content.name='content';source.updateMatrixWorld(true);for(const object of objects)content.attach(object);
 content.updateMatrixWorld(true);const initial=new T.Box3().setFromObject(content),center=initial.getCenter(new T.Vector3());content.position.x-=center.x;content.position.y-=initial.min.y;content.position.z-=center.z;
 const root=new T.Group();root.name='HoodscapeAsset';root.add(content);root.rotation.y=rotateY;root.updateMatrixWorld(true);const size=new T.Box3().setFromObject(root).getSize(new T.Vector3()),scale=targetLength/(byHeight?size.y:Math.max(size.x,size.z));root.scale.setScalar(scale);root.userData={hoodscapeAsset:true,kind,targetLength};return root;
}

let root;
if(kind.startsWith('generic-')||kind==='carter'||kind==='shvan'){
 const objects=selectVehicle();for(const mesh of objects)applyVehicleMaterials(mesh);
 const target=kind==='shvan'?4.9:kind==='generic-pickup'?5.15:kind==='generic-suv'?4.85:kind==='generic-coupe'?4.15:4.55;
 const rotate=(kind==='carter'||kind==='shvan'||kind==='generic-suv'||kind==='generic-coupe')?Math.PI/2:0;
 root=normalize(objects,target,rotate);root.name=`vehicle_${kind.replace('generic-','')}`;
 if(kind==='generic-suv')root.scale.z*=.64;
 if(kind==='generic-coupe')root.scale.z*=.8;
 if(kind==='shvan')root.scale.z*=.88;
 root.updateMatrixWorld(true);
 root.traverse(o=>{if(!o.isMesh||!/wheel/i.test(o.name))return;o.userData.hsWheel=true;o.userData.hsBaseY=o.position.y;o.userData.hsFront=/(fl|fr|front)/i.test(o.name)});
}else if(kind==='ak'||kind==='pistol'){
 const objects=selectWeapon();for(const mesh of objects){const label=mesh.name.toLowerCase();applyMaterial(mesh,kind==='ak'&&/(handguard|buttstock|grip(?!_metal))/.test(label)?palettes.wood:palettes.metal)}
 root=normalize(objects,kind==='ak'?.88:.22,kind==='ak'?Math.PI/2:0);root.name=kind==='ak'?'weapon_carbine':'weapon_pistol';
}else if(kind==='male'){
 const nonRender=[];source.traverse(o=>{if(o.isLight||o.isCamera)nonRender.push(o)});for(const object of nonRender)object.removeFromParent();const body=source.getObjectByName('male_muscle_13290Mesh'),eyes=source.getObjectByName('low-polyMesh');if(!body)throw new Error('Male body mesh missing');segmentMaleBody(body);if(eyes)applyMaterial(eyes,palettes.eye);
 root=normalize([body,eyes,source.getObjectByName('CMU_compliant_skeleton')].filter(Boolean),1.82,0,true);root.name='character_male_base';
 root.animations=makeCharacterClips(body,eyes);root.userData.hoodscapeCharacter=true;
}else throw new Error(`Unknown kind ${kind}`);

fs.mkdirSync(path.dirname(output),{recursive:true});
const glb=await new GLTFExporter().parseAsync(root,{binary:true,animations:root.animations||[],onlyVisible:true});
fs.writeFileSync(output,Buffer.from(glb));
console.log(JSON.stringify({kind,output,bytes:glb.byteLength}));
