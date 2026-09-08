import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

globalThis.self=globalThis;
globalThis.createImageBitmap=async()=>({width:1,height:1,close(){}});
globalThis.document={createElementNS(){const listeners={};return{addEventListener(type,listener){listeners[type]=listener},removeEventListener(){},set src(_value){queueMicrotask(()=>listeners.load?.())}}}};

const files={male:'public/assets/characters/male-base.glb',carter:'public/assets/vehicles/carter-sedan.glb',shvan:'public/assets/vehicles/shvan.glb',sedan:'public/assets/vehicles/sedan.glb',suv:'public/assets/vehicles/suv.glb',pickup:'public/assets/vehicles/pickup.glb',coupe:'public/assets/vehicles/coupe.glb',pistol:'public/assets/weapons/pistol.glb',shotgun:'public/assets/weapons/shotgun.glb',carbine:'public/assets/weapons/carbine.glb'};
const loader=new GLTFLoader(),reports=[];
for(const [id,file] of Object.entries(files)){
 assert.ok(fs.existsSync(file),`${file} is missing`);const bytes=fs.readFileSync(file),gltf=await loader.parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'');gltf.scene.updateMatrixWorld(true);const size=new T.Box3().setFromObject(gltf.scene).getSize(new T.Vector3());let triangles=0,skinned=0,bones=0;gltf.scene.traverse(object=>{if(object instanceof T.Bone)bones++;if(!(object instanceof T.Mesh))return;if(object instanceof T.SkinnedMesh)skinned++;triangles+=(object.geometry.index?.count||object.geometry.attributes.position.count)/3});
 if(id==='male'){assert.deepEqual(gltf.animations.map(clip=>clip.name),['Idle','Walk','Run','Attack']);assert.ok(skinned>=1&&bones>=20,'male foundation must remain rigged');assert.ok(size.y>1.7&&size.y<2,'male height must be normalized');assert.ok(triangles<35000,'male foundation exceeds triangle budget')}
 if(['carter','shvan','sedan','suv','pickup','coupe'].includes(id)){assert.ok(size.x>1.6&&size.x<2.4,`${id} width is out of range`);assert.ok(size.z>3.7&&size.z<5.4,`${id} length is out of range`);assert.ok(triangles<30000,`${id} exceeds triangle budget`)}
 if(['pistol','shotgun','carbine'].includes(id))assert.ok(triangles<12000,`${id} exceeds triangle budget`);
 reports.push({id,file:path.relative(process.cwd(),file),bytes:bytes.length,size:size.toArray().map(value=>Number(value.toFixed(2))),triangles:Math.round(triangles),skinned,bones,animations:gltf.animations.map(clip=>clip.name)});
}
console.log(JSON.stringify(reports,null,2));
