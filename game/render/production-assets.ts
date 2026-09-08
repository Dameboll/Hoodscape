import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {clone as cloneSkeleton} from 'three/addons/utils/SkeletonUtils.js';

export type VehicleAsset='carter'|'shvan'|'sedan'|'suv'|'pickup'|'coupe';
export type WeaponAsset='pistol'|'shotgun'|'carbine';
type Model={scene:T.Group;animations:T.AnimationClip[]};
export type ProductionAssets={male?:Model;vehicles:Partial<Record<VehicleAsset,Model>>;weapons:Partial<Record<WeaponAsset,Model>>;failed:string[]};

const URLS={
 male:'/assets/characters/male-base.glb',
 vehicles:{carter:'/assets/vehicles/carter-sedan.glb',shvan:'/assets/vehicles/shvan.glb',sedan:'/assets/vehicles/sedan.glb',suv:'/assets/vehicles/suv.glb',pickup:'/assets/vehicles/pickup.glb',coupe:'/assets/vehicles/coupe.glb'},
 weapons:{pistol:'/assets/weapons/pistol.glb',shotgun:'/assets/weapons/shotgun.glb',carbine:'/assets/weapons/carbine.glb'}
} as const;

let cache:Promise<ProductionAssets>|undefined;
export function loadProductionAssets(){
 if(cache)return cache;
 cache=(async()=>{const loader=new GLTFLoader(),assets:ProductionAssets={vehicles:{},weapons:{},failed:[]},entries:[string,string][]=[['male',URLS.male],...Object.entries(URLS.vehicles).map(([key,url]):[string,string]=>[`vehicle:${key}`,url]),...Object.entries(URLS.weapons).map(([key,url]):[string,string]=>[`weapon:${key}`,url])];await Promise.all(entries.map(async([key,url])=>{try{const gltf=await loader.loadAsync(url),model={scene:gltf.scene,animations:gltf.animations};if(key==='male')assets.male=model;else{const [kind,id]=key.split(':');if(kind==='vehicle')assets.vehicles[id as VehicleAsset]=model;else assets.weapons[id as WeaponAsset]=model}}catch{assets.failed.push(key)}}));return assets})();
 return cache;
}

export function cloneCharacter(model:Model){return {scene:cloneSkeleton(model.scene) as T.Group,animations:model.animations}}

function cloneMaterials(root:T.Object3D){root.traverse(object=>{if(!(object instanceof T.Mesh))return;object.castShadow=true;object.receiveShadow=true;object.material=Array.isArray(object.material)?object.material.map(material=>material.clone()):object.material.clone()})}

export function cloneVehicle(assets:ProductionAssets,key:VehicleAsset,color:string,fallback:()=>T.Group){
 const model=assets.vehicles[key];if(!model)return fallback();const root=model.scene.clone(true);cloneMaterials(root);root.traverse(object=>{if(!(object instanceof T.Mesh))return;const materials=Array.isArray(object.material)?object.material:[object.material];for(const material of materials)if(material instanceof T.MeshStandardMaterial&&material.name==='vehicle_body')material.color.set(color)});root.userData.productionAsset=key;return root;
}

export function cloneWeapon(assets:ProductionAssets,key:WeaponAsset){const model=assets.weapons[key];if(!model)return null;const root=model.scene.clone(true);cloneMaterials(root);root.name=`Production_${key}`;return root}
