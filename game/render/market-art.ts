import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

/** First approved-area candidate: Mercer Market frontage only. No collision changes. */
export function createMarketArt(parent:T.Object3D){
 const root=new T.Group();root.name='MercerMarketArt';parent.add(root);
 const material=new T.MeshStandardMaterial({color:'#ffffff',roughness:.96});
 const canvas=document.createElement('canvas');canvas.width=512;canvas.height=512;
 const ctx=canvas.getContext('2d')!;
 let seed=911;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
 ctx.fillStyle='#706760';ctx.fillRect(0,0,512,512);
 for(let row=0;row<16;row++)for(let column=-1;column<9;column++){
  const x=column*64+(row%2)*32,y=row*32,shade=Math.floor(random()*29);
  ctx.fillStyle=`rgb(${115+shade},${65+shade},${48+shade})`;ctx.fillRect(x+2,y+2,60,28);
  ctx.fillStyle='rgba(28,22,18,.19)';ctx.fillRect(x+2,y+27,60,3);
 }
 for(let i=0;i<16000;i++){ctx.fillStyle=random()>.5?'rgba(230,205,181,.10)':'rgba(17,12,10,.12)';ctx.fillRect(random()*512,random()*512,1+random()*3,1)}
 const brick=new T.CanvasTexture(canvas);brick.colorSpace=T.SRGBColorSpace;brick.wrapS=brick.wrapT=T.RepeatWrapping;brick.repeat.set(5,2.6);brick.anisotropy=4;
 material.map=brick;
 const wall=new T.Mesh(new T.PlaneGeometry(15,8),material);wall.rotation.y=Math.PI/2;wall.position.set(-13.43,8.1,27);wall.receiveShadow=true;root.add(wall);
 // Deep returns on the side wall keep the facade from reading like a pasted image.
 const sideMap=brick.clone();sideMap.repeat.set(7.5,3.8);const sideMat=material.clone();sideMat.map=sideMap;
 const side=new T.Mesh(new T.PlaneGeometry(23,11.8),sideMat);side.position.set(-25,6.1,34.53);side.receiveShadow=true;root.add(side);
 const batches=new Map<string,T.BufferGeometry[]>();
 const box=(x:number,y:number,z:number,w:number,h:number,d:number,color:string)=>{const geometry=new T.BoxGeometry(w,h,d);geometry.translate(x,y,z);const list=batches.get(color)||[];list.push(geometry);batches.set(color,list)};
 // A copper-black cornice, rainwater pipe, lintels and a deliberately worn lower plinth.
 for(const y of [4.18,7.32,10.52,12.12])box(-13.26,y,27,.32,.12,15.15,'#72695f');
 for(const z of [19.8,34.15]){box(-13.1,6.3,z,.10,11.7,.12,'#393735');for(const y of [1,3.2,6.5,9.5])box(-13.03,y,z,.17,.07,.19,'#56534e')}
 for(let z=20;z<34.4;z+=.82)box(-13.31,.65,z,.16,.76,.78,z%2>1?'#685c51':'#75675b');
 // Store panes: opaque low-cost reflections with inset goods and transom lettering.
 for(const z of [21,23.5,26,28.5,31,33]){
  box(-13.17,1.9,z,.035,2.5,2.2,'#232a2b');
  box(-13.10,2.62,z,.02,.18,2.12,'#797971');
  box(-13.10,1.05,z,.02,.08,2.12,'#6b6257');
  for(let i=0;i<5;i++)box(-13.07,1.22+(i%2)*.04,z-.8+i*.36,.035,.26,.18,i%2?'#a99c74':'#89734f');
 }
 // Side-wall fire escape: geometry is merged into one material/draw, outside all routes.
 for(const y of [4.4,7.6,10.8]){
  box(-24,y,34.95,5.5,.10,1,'#363532');
  for(let x=-26.6;x<-21.3;x+=.48){box(x,y+.52,35.39,.035,1,.035,'#363532');box(x,y,34.95,.055,.08,1.1,'#56534e')}
  box(-24,y+1,35.4,5.5,.035,.035,'#363532');
 }
 for(let y=1;y<11.9;y+=.28)box(-21.8,y,35.45,.65,.035,.05,'#363532');
 for(const x of [-22.15,-21.45])box(x,6.4,35.45,.045,11,.07,'#363532');
 // Patches remain flush to the sidewalk so existing traversal stays exact.
 for(const [x,z,w,d] of [[-4,25,2.2,4],[-6.1,32,1.5,2.4],[-2,19,1.8,3.2]])box(x,.026,z,w,.002,d,'#343333');
 for(const [color,parts] of batches){const geometry=mergeGeometries(parts);if(geometry){const mesh=new T.Mesh(geometry,new T.MeshStandardMaterial({color,roughness:.83,metalness:color==='#363532'?.45:0}));mesh.castShadow=true;mesh.receiveShadow=true;root.add(mesh)}parts.forEach(p=>p.dispose())}
 // Separate sign art from stock template borders: a painted shop fascia.
 const signCanvas=document.createElement('canvas');signCanvas.width=1024;signCanvas.height=160;const text=signCanvas.getContext('2d')!;
 text.fillStyle='#282622';text.fillRect(0,0,1024,160);text.fillStyle='#c54f38';text.fillRect(0,0,18,160);
 text.fillStyle='#e8dfcd';text.font='700 76px "Barlow Condensed", sans-serif';text.textAlign='left';text.fillText('MERCER MARKET',48,97);
 text.font='22px "Source Sans 3", sans-serif';text.fillStyle='#bcb1a0';text.fillText('GROCERIES  /  HOUSEHOLD  /  OPEN DAILY',51,136);
 const signMap=new T.CanvasTexture(signCanvas);signMap.colorSpace=T.SRGBColorSpace;
 const sign=new T.Mesh(new T.PlaneGeometry(14,.95),new T.MeshBasicMaterial({map:signMap,toneMapped:false}));sign.rotation.y=Math.PI/2;sign.position.set(-12.83,3.81,27);root.add(sign);
 root.userData.assetBudget={area:'Mercer Market',textureBytes:512*512*4+1024*160*4,collisionChanges:0};
 return root;
}
