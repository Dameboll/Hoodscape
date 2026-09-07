import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
export type Solid={x:number;y:number;z:number;w:number;h:number;d:number};
export function createWorld(scene:T.Scene){
 const solids:Solid[]=[];const buckets=new Map<string,T.BufferGeometry[]>();const mats=new Map<string,T.MeshStandardMaterial>();const camWalls:T.Mesh[]=[];
 const mat=(color:string)=>{if(!mats.has(color))mats.set(color,new T.MeshStandardMaterial({color,roughness:.87}));return mats.get(color)!};
 function shape(g:T.BufferGeometry,color:string,x:number,y:number,z:number,rx=0,ry=0,rz=0){g.rotateX(rx);g.rotateY(ry);g.rotateZ(rz);g.translate(x,y,z);if(!buckets.has(color))buckets.set(color,[]);buckets.get(color)!.push(g)}
 function box(x:number,y:number,z:number,w:number,h:number,d:number,color:string,solid=false){shape(new T.BoxGeometry(w,h,d),color,x,y,z);if(solid)solids.push({x,y,z,w,h,d})}
 function cylinder(x:number,y:number,z:number,r:number,h:number,color:string){shape(new T.CylinderGeometry(r,r,h,8),color,x,y,z)}
 function sign(text:string,x:number,y:number,z:number,w:number,h:number,bg='#273d3d',fg='#f8e8c3',ry=0){const c=document.createElement('canvas');c.width=1024;c.height=Math.round(1024*h/w);const ctx=c.getContext('2d')!;ctx.fillStyle=bg;ctx.fillRect(0,0,c.width,c.height);ctx.strokeStyle=fg;ctx.lineWidth=7;ctx.strokeRect(15,15,c.width-30,c.height-30);ctx.fillStyle=fg;ctx.font=`900 ${Math.min(c.height*.54,1024/text.length*1.55)}px Arial`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,512,c.height*.52,960);const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;const m=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map:tex,toneMapped:false}));m.position.set(x,y,z);m.rotation.y=ry;scene.add(m);return m}
 box(0,-.3,0,144,.6,160,'#48474b',true);
 box(0,.005,0,16,.015,146,'#363b44');box(0,.01,-9,140,.02,13,'#363b44');
 for(const x of [-10.6,10.6])box(x,.09,0,5,.18,140,'#a29b90');
 for(const z of [-17,0])box(0,.09,z,132,.18,3.5,'#a29b90');
 for(const x of [-8.12,8.12])box(x,.1,0,.18,.22,140,'#c7bba3');
 for(let z=-65;z<69;z+=7){if(z>-22&&z<7)continue;box(-.22,.03,z,.13,.015,3,'#c2a363');box(.22,.03,z,.13,.015,3,'#c2a363');for(const x of [-6.8,6.8])box(x,.03,z,.12,.015,4,'#c3bca4')}
 for(const z of [-20,3])for(let x=-6.5;x<8;x+=2)box(x,.035,z,1.15,.02,3.5,'#e0d5b7');
 for(let z=-65;z<70;z+=3)for(const x of [-10.7,10.7])box(x,.185,z,4.7,.007,.026,'#827e79');
 for(const x of [-12.8,12.8])for(let z=-60;z<67;z+=3)box(x,.3,z,.18,.32,.7,'#bcb29e');
 function building(x:number,z:number,w:number,d:number,h:number,color:string,name?:string,accent='#405d58'){
  box(x,h/2+.18,z,w,h,d,color,true);box(x,h+.3,z,w+.5,.42,d+.5,'#59595c');box(x,.58,z,w+.1,.8,d+.1,'#6c6560');
  const side=x<0?1:-1,face=x+side*(w/2+.025),rot=side*Math.PI/2;
  for(let y=4.8;y<h-1;y+=3.2){box(face,y-1.3,z,.17,.17,d,'#b19a82');for(let dz=-d/2+1.6;dz<d/2-1;dz+=2.8){box(face,y,z+dz,.15,1.8,1.5,'#554f52');box(face+side*.11,y,z+dz,.09,1.52,1.22,Math.sin(dz*y)>0?'#caa26d':'#53616c');box(face+side*.2,y,z+dz,.09,1.6,.07,'#c1af92');box(face+side*.2,y,z+dz,.09,.07,1.3,'#c1af92');box(face+side*.3,y-.95,z+dz,.5,.14,1.8,'#b9a38b')}}
  // Small-scale masonry and facade detailing, merged into a handful of materials.
  for(let y=1;y<h;y+=.55)for(let dz=-d/2+.7;dz<d/2;dz+=1.4){if(y<3.9&&name)continue;const zz=dz+(Math.round(y/.55)%2)*.6;if(zz>d/2-.2)continue;box(face+side*.015,y,z+zz,.018,.022,1.15,'#8d7669')}
  if(name){box(face+side*.05,1.9,z,.15,2.7,d-1.2,'#253c42');for(let dz=-d/2+1;dz<d/2;dz+=2.5)box(face+side*.15,1.9,z+dz,.18,2.8,.12,'#a6a997');box(face+side*.3,3.75,z,.6,.45,d+.3,accent);sign(name,face+side*.62,3.8,z,d-1,.85,accent,'#f5dfae',rot);box(face+side*.65,3.25,z,1.5,.12,d+.4,accent);for(let dz=-d/2+.5;dz<d/2;dz+=1.2)box(face+side*.74,3.22,z+dz,1.5,.04,.36,'#d5c6a4');box(face+side*.3,2,z-d*.3,.15,2.4,1.1,'#17262a');box(face+side*.4,2,z-d*.3,.1,.05,.8,'#c4b082')}
  else{box(face+side*.1,1.65,z,.2,2.8,2,'#23383e');box(face+side*.45,3.1,z,1.2,.2,3,'#968572')}
  // Roof vents and water tank.
  box(x,h+.9,z-2,2.5,1,2,'#797b7a');if(h>14){cylinder(x,h+2.4,z+3,1.6,3,'#746957');shape(new T.ConeGeometry(1.8,.9,12),'#414a50',x,h+4.3,z+3);for(const dx of [-1,1])for(const dz of [-1,1])box(x+dx,h+.8,z+3+dz,.12,1.8,.12,'#393f43')}
 }
 building(-25,27,23,15,12,'#967061','MERCER MARKET','#426a5a');
 building(-24,46,21,15,9,'#9b7462','BLOCK 09','#484853');
 building(25,23,23,13,10,'#b08d70','GOLDLINE PAWN','#79613e');
 building(25,7,23,12,7.8,'#b28267',"SUNDAY’S",'#914e37');
 building(26,49,25,18,6.5,'#8b8f8b','RUIZ AUTO','#3e5963');
 building(-27,-22,24,10,8,'#a19b8a','SPIN CYCLE','#426f74');
 building(-30,-42,28,24,22,'#8c6e62');sign('THE TOWERS',-15.8,4.4,-42,8,1.1,'#564c48','#dfcda8',Math.PI/2);
 building(-52,25,16,23,29,'#857772');building(-51,-27,16,22,25,'#9b8271');building(53,15,15,22,23,'#8f8276');building(51,-57,22,14,28,'#9c8e84');
	building(26,-61,24,11,19,'#97857c');building(-25,64,22,12,19,'#9c7d6c');
	// East service lane and infill turn the outer blocks into a second lived-in route.
	box(43,.012,5,9,.025,41,'#3c4147');for(let z=-13;z<25;z+=5)box(43,.03,z,.14,.02,2.2,'#c2a363');
	for(const x of [37.8,48.2])box(x,.09,5,1.5,.18,41,'#a29b90');
	building(-52,52,15,12,13,'#88766b');building(-51,1,16,13,11,'#917c70');building(55,57,15,12,14,'#847b76');
	sign('EAST SERVICE',48.9,2.7,24,5,.7,'#405d58','#f5dfae',-Math.PI/2);
	// District 09 now reads as a city rather than a single block: secondary streets,
	// storefronts, service yards, and north/south infill extend the playable silhouette.
	for(const [x,z,w,d] of [[-48,-63,24,7],[-48,65,25,7],[48,-8,25,7],[48,39,25,7],[24,65,24,7],[-24,-63,24,7]] as [number,number,number,number][]) {box(x,.012,z,w,.025,d,'#393f45');for(let dx=-w/2+2;dx<w/2;dx+=4)box(x+dx,.03,z,.18,.014,2.1,'#c2a363')}
	building(-50,-57,13,10,11,'#795e5b','CINDER ROW','#8c4b46');
	building(-49,64,14,10,12,'#78807c','NORTHLINE MART','#566b62');
	building(52,-6,13,12,10,'#777e82','MERCER RECORDS','#4f6871');
	building(54,38,15,10,12,'#806e61','FREIGHT SOCIAL','#4e8178');
	building(28,67,17,9,10,'#887e75','GRAND AVE','#705a48');
	building(-23,-62,18,10,13,'#7d7467','CARVER HALL','#455965');
	for(const [x,z,c] of [[-40,-60,'#8c4b46'],[-39,64,'#c98d58'],[40,-10,'#789398'],[39,36,'#4e8178']] as [number,number,string][]) {cylinder(x,2.1,z,.065,4.2,'#33494d');box(x,4.08,z,.82,.16,.82,c);box(x,3.96,z,.48,.035,.48,'#f3d39a')}
	for(const [x,z] of [[-38,-57],[-40,61],[38,-11],[39,36],[19,64],[-17,-61]] as [number,number][]) {box(x,.58,z,1.25,1.15,.8,'#4d6864',true);box(x,1.2,z,1.36,.12,.9,'#35484a');for(const dx of [-.42,.42])cylinder(x+dx,.16,z,.11,.28,'#202b32')}
	for(const [x,z] of [[-41,-51],[-41,58],[41,-2],[41,43],[18,61],[-17,-56]] as [number,number][]) {box(x,.28,z,1.5,.38,1.2,'#b9a38b');box(x,.56,z,.9,.13,1,'#8d6c50');}
	sign('CINDER CUT',-38,2.7,-63,5,.7,'#8c4b46','#f5dfae',Math.PI/2);sign('NORTHLINE',-38,2.7,65,5,.7,'#566b62','#f5dfae',Math.PI/2);sign('RECORDS',39,2.7,-8,4.6,.7,'#4f6871','#f5dfae',-Math.PI/2);sign('FREIGHT ROW',39,2.7,38,5,.7,'#4e8178','#f5dfae',-Math.PI/2);
 // A restrained distant skyline encloses the district.
 for(let i=0;i<14;i++){const x=-90+i*14,h=15+((i*17)%28);box(x,h/2,-86,10,h,13,'#807e86');box(x,h/2,87,11,h+5,12,'#827d83')}
 // Basketball court, lines, hoops, fence.
 box(35,.1,-36,28,.2,32,'#577d78');box(35,.22,-36,25,.03,29,'#bd8266');box(35,.245,-36,24,.02,.1,'#eddfb8');
 for(const x of [23,47])box(x,.25,-36,.1,.02,29,'#eddfb8');for(const z of [-21.5,-50.5])box(35,.25,z,24,.02,.1,'#eddfb8');
 shape(new T.TorusGeometry(3,.06,4,48),'#eddfb8',35,.26,-36,Math.PI/2);
 for(const z of [-23,-49]){box(35,1.65,z,.15,3.3,.15,'#59666b');box(35,3.4,z,2.1,1.3,.12,'#c6c1ad');box(35,3.4,z+(z<-36?.08:-.08),.75,.55,.03,'#ac6851');shape(new T.TorusGeometry(.38,.045,6,20),'#c4613d',35,3.05,z+(z<-36?.7:-.7),Math.PI/2);box(35,.26,z+(z<-36?2.5:-2.5),7,.02,.09,'#eddfb8')}
 for(let z=-52;z<=-20;z+=4){cylinder(49,1.8,z,.055,3.6,'#52696a');cylinder(21,1.8,z,.055,3.6,'#52696a')}
 for(const x of [21,49]){for(const y of [.5,1.2,1.9,2.6,3.3])box(x,y,-36,.025,.025,32,'#78908a');for(let z=-52;z<-20;z+=.6)box(x,1.8,z,.015,3.4,.015,'#78908a')}
 // Street lighting, trees, benches, utility poles.
 for(const x of [-11.7,11.7])for(const z of [-57,-5,18,40,61]){cylinder(x,2.8,z,.085,5.6,'#34494c');box(x+(x<0?1:-1)*.7,5.5,z,1.5,.09,.09,'#34494c');box(x+(x<0?1:-1)*1.4,5.42,z,.8,.15,.35,'#e1b972');const bulb=new T.Mesh(new T.SphereGeometry(.1,5,4),new T.MeshBasicMaterial({color:'#ffd193'}));bulb.position.set(x+(x<0?1:-1)*1.4,5.3,z);scene.add(bulb)}
 function tree(x:number,z:number){cylinder(x,1.6,z,.18,3.2,'#6d6654');for(let i=0;i<4;i++)shape(new T.IcosahedronGeometry(1.8,1),i%2?'#697866':'#7e8866',x+Math.sin(i*2)*.6,3.6+i*.4,z+Math.cos(i*2)*.6);box(x,.28,z,2,.3,2,'#69695a');solids.push({x,y:1.5,z,w:.6,h:3,d:.6})}
 for(const p of [[16,-52],[16,-19],[-12,56],[-11,-60],[53,-28],[53,-40],[42,65]])tree(p[0],p[1]);
 function bench(x:number,z:number,rot=0){box(x,.7,z,2.2,.16,.65,'#8d6c50');box(x,1.12,z+.3,2.2,.7,.12,'#8d6c50');for(const dx of [-.8,.8])box(x+dx,.36,z,.12,.65,.5,'#3c4c4b')}
 bench(18,-28);bench(-11,-32);bench(18,58);
 for(const x of [-12.5,12.5])for(const z of [10,32,-26]){cylinder(x,.65,z,.32,1.3,'#4d6864');cylinder(x,1.32,z,.35,.08,'#35484a')}
 for(const z of [-62,8,58]){cylinder(-13,4.5,z,.15,9,'#766959');box(-13,8.3,z,2.8,.14,.14,'#786e60')}
 const wireMat=new T.LineBasicMaterial({color:'#42494c'});for(const x of [-14,-12]){const pts=[];for(let z=-62;z<=58;z+=2)pts.push(new T.Vector3(x,8.3-Math.sin((z+62)/120*Math.PI)*1.5,z));scene.add(new T.Line(new T.BufferGeometry().setFromPoints(pts),wireMat))}
 sign('MERCER AVE',9,3,-3,3,.55,'#3b645c','#f6e4bc',Math.PI);cylinder(9,1.5,-3,.055,3,'#65716a');
 sign('SAINT MERCER',0,9,-72,13,1.5,'#716965','#e4ccb0',0);
 sign('09',-15.8,13,-47,3,4,'#8c6e62','#d7b58c',Math.PI/2);
 // ATM, salvage pieces, loading bay, apartment entry.
 box(-11,.75,10,.7,1.5,.8,'#517c78',true);sign('UTILITY 09',-10.63,1,10,.6,.3,'#334e49','#d6cfb2',Math.PI/2);box(-12,1.15,14,.6,2,1.1,'#517c78',true);sign('ATM',-11.68,1.5,14,.8,.5,'#263d40','#a0d0c0',Math.PI/2);
 for(let i=0;i<6;i++){box(45+(i%3)*2,.45,42+Math.floor(i/3)*3,1.4,.9,1.5,i%2?'#847e70':'#746558',true)}
 for(const x of [42,56])for(let z=35;z<54;z+=3)box(x,1.3,z,.15,2.6,.15,'#777568');
 // Chapter 2: loading yard, bus shelter, courtyard, and lived-in street edges.
 box(47,.11,31,13,.22,7,'#a29b90');
 for(const z of [28,34])box(47,.25,z,12,.025,.12,'#c2a363');
 for(const x of [44,49,54])box(x,1.2,34,.12,2.4,.12,'#52696a');
 for(const y of [.4,1,1.6,2.2])box(49,y,34,10,.025,.025,'#78908a');
 for(let i=0;i<6;i++){const x=46+i%3*2,z=29+Math.floor(i/3)*2;box(x,.65,z,1.5,1.1,1.4,'#847e70',true);box(x,1.23,z,1.55,.06,1.45,'#b9a38b');for(const dx of [-.55,.55])box(x+dx,.65,z, .08,1.12,1.43,'#746558');}
 sign('MERCER FREIGHT',47,3,34,7,.85,'#3e5963','#f5dfae',Math.PI);
 // Bus shelter occupies the outer sidewalk rather than the delivery route.
 for(const z of [-3,1])box(15,1.25,z,.09,2.5,.09,'#34494c');
 box(15,2.55,-1,2.8,.15,5,'#34494c');box(16.1,1.3,-1,.07,2.2,4.7,'#53616c');bench(15,-1);
 sign('09 / MERCER',14.9,2.9,-1,3,.6,'#3b645c','#f6e4bc',-Math.PI/2);
 // Tenant board with benches and planters outside the Towers.
 for(const z of [-34.9,-33.1])box(-12,1.1,z,.09,2.2,.09,'#6d6654');
 box(-12,1.7,-34,.13,1.1,2.4,'#8d6c50');sign('TENANTS MEET HERE',-11.91,1.85,-34,2.2,.7,'#79613e','#f5dfae',Math.PI/2);
 bench(-11,-45);bench(-11,-48);
 // Side-alley refuse, stoops, HVAC and storefront goods use existing materials.
 for(const [x,z] of [[-39,24],[-38,48],[40,18],[39,53]]){box(x,.65,z,1.5,1.3,2.2,'#4d6864',true);box(x,1.33,z,1.6,.15,2.3,'#35484a');for(const dz of [-.7,.7])cylinder(x,.17,z+dz,.12,.3,'#202b32');}
 for(const z of [21,34,41,52]){box(-13,.28,z,1,.4,1.2,'#b9a38b');box(-13,.55,z,.8,.16,1,'#8d6c50');}
 for(const [x,z] of [[16,13],[16,19],[-12,-28]]){box(x,.35,z,1.5,.6,1.5,'#6c6560');for(let i=0;i<3;i++)shape(new T.IcosahedronGeometry(.48,1),'#697866',x+(i-1)*.35,.92,z);}
 for(const x of [-39,39])for(const z of [12,32,50]){box(x,3.5,z,.8,.65,1,'#797b7a');for(let i=0;i<4;i++)box(x,3.28+i*.12,z,.83,.025,.85,'#59595c');}
 const marketStock=new T.Group();marketStock.name='MarketDelivery';
 for(let i=0;i<4;i++){const crate=new T.Mesh(new T.BoxGeometry(.7,.65,.7),mat('#847e70'));crate.position.set(-12,.5,23+i*.85);crate.castShadow=true;marketStock.add(crate);}scene.add(marketStock);
 // District boundaries invisible to the camera, solid to the player.
 solids.push({x:0,y:2,z:-72,w:140,h:4,d:1},{x:0,y:2,z:72,w:140,h:4,d:1},{x:-67,y:2,z:0,w:1,h:4,d:145},{x:67,y:2,z:0,w:1,h:4,d:145});
 for(const [color,gs] of buckets){const g=mergeGeometries(gs);if(!g)continue;const m=new T.Mesh(g,mat(color));m.castShadow=true;m.receiveShadow=true;scene.add(m);for(const a of gs)a.dispose()}
 // Dedicated camera occluders keep camera tests cheap.
 for(const b of solids.filter(b=>b.h>4)){const m=new T.Mesh(new T.BoxGeometry(b.w,b.h,b.d),new T.MeshBasicMaterial({visible:false}));m.position.set(b.x,b.y,b.z);camWalls.push(m);m.updateMatrixWorld()}
 return {solids,camWalls,sign,marketStock};
}
export function makeVehicle(type:string,color:string){const root=new T.Group();const mats={body:new T.MeshStandardMaterial({color,roughness:.46,metalness:.22}),dark:new T.MeshStandardMaterial({color:'#202b32',roughness:.7}),glass:new T.MeshStandardMaterial({color:'#657e87',roughness:.22,metalness:.35}),chrome:new T.MeshStandardMaterial({color:'#a4afa9',metalness:.65,roughness:.3}),light:new T.MeshBasicMaterial({color:'#ffdda3'}),red:new T.MeshBasicMaterial({color:'#d7573f'})};
 function mesh(g:T.BufferGeometry,m:keyof typeof mats,x:number,y:number,z:number,rz=0){const o=new T.Mesh(g,mats[m]);o.position.set(x,y,z);o.rotation.z=rz;o.castShadow=true;root.add(o);return o}
 if(type==='car'){
 mesh(new RoundedBoxGeometry(1.85,.65,4.1,2,.14),'body',0,.65,0);mesh(new RoundedBoxGeometry(1.65,.75,1.95,2,.16),'glass',0,1.25,-.05);mesh(new RoundedBoxGeometry(1.69,.12,1.55,2,.06),'body',0,1.66,-.13);mesh(new T.BoxGeometry(1.7,.1,.12),'body',0,1.31,.89);for(const x of [-.78,.78])mesh(new T.BoxGeometry(.08,.75,.1),'body',x,1.26,.01);
 for(const z of [-1.3,1.3])for(const x of [-.93,.93]){mesh(new T.CylinderGeometry(.39,.39,.22,16),'dark',x,.44,z,Math.PI/2);mesh(new T.CylinderGeometry(.23,.23,.235,12),'chrome',x,.44,z,Math.PI/2)}
 mesh(new RoundedBoxGeometry(1.84,.17,.2,1,.04),'chrome',0,.43,2.06);mesh(new RoundedBoxGeometry(1.84,.17,.2,1,.04),'chrome',0,.43,-2.06);for(const x of [-.59,.59]){mesh(new T.BoxGeometry(.48,.22,.04),'light',x,.79,2.06);mesh(new T.BoxGeometry(.45,.2,.04),'red',x,.79,-2.06)}for(const x of [-1,1])mesh(new RoundedBoxGeometry(.2,.12,.28,1,.04),'body',x,1.15,.5);
 }else{
 for(const z of [-.72,.72]){mesh(new T.TorusGeometry(.4,.045,8,24),'dark',0,.45,z,Math.PI/2);const hub=mesh(new T.CylinderGeometry(.07,.07,.16,8),'chrome',0,.45,z,Math.PI/2);for(let a=0;a<8;a++){const spoke=new T.Mesh(new T.CylinderGeometry(.008,.008,.78,4),mats.chrome);spoke.position.set(0,.45,z);spoke.rotation.x=a*Math.PI/4;root.add(spoke)}}
 const rod=(a:T.Vector3,b:T.Vector3,m:keyof typeof mats='body')=>{const o=new T.Mesh(new T.CylinderGeometry(.035,.035,a.distanceTo(b),8),mats[m]);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),b.clone().sub(a).normalize());root.add(o)};
 const p=(y:number,z:number)=>new T.Vector3(0,y,z);for(const [a,b] of [[p(.45,-.72),p(.5,0)],[p(.5,0),p(1.05,-.3)],[p(1.05,-.3),p(.45,-.72)],[p(1.05,-.3),p(1.08,.53)],[p(1.08,.53),p(.5,0)],[p(1.08,.53),p(.45,.72)]])rod(a,b);
 mesh(new RoundedBoxGeometry(.24,.09,.4,1,.03),'dark',0,1.16,-.32);rod(p(1.08,.53),p(1.38,.53),'chrome');mesh(new T.CylinderGeometry(.025,.025,.65,8),'dark',0,1.38,.53,Math.PI/2);
 }
 return root;
}

export function makeDetailedVehicle(type:string,color:string,style='sedan'){
 const root=new T.Group();
 const mats={body:new T.MeshStandardMaterial({color,roughness:.42,metalness:.24}),dark:new T.MeshStandardMaterial({color:'#182027',roughness:.68}),glass:new T.MeshStandardMaterial({color:'#6f96a1',roughness:.16,metalness:.42,transparent:true,opacity:.82}),chrome:new T.MeshStandardMaterial({color:'#b8c0bd',metalness:.75,roughness:.24}),light:new T.MeshBasicMaterial({color:'#ffdda3'}),red:new T.MeshBasicMaterial({color:'#d95743'}),rubber:new T.MeshStandardMaterial({color:'#111419',roughness:.92}),trim:new T.MeshStandardMaterial({color:'#4d5860',roughness:.54,metalness:.3})};
 const mesh=(geometry:T.BufferGeometry,material:keyof typeof mats,x=0,y=0,z=0,rotation=0)=>{const item=new T.Mesh(geometry,mats[material]);item.position.set(x,y,z);item.rotation.z=rotation;item.castShadow=true;item.receiveShadow=true;root.add(item);return item};
 const rod=(a:T.Vector3,b:T.Vector3,radius=.035,material:keyof typeof mats='body')=>{const item=new T.Mesh(new T.CylinderGeometry(radius,radius,a.distanceTo(b),8),mats[material]);item.position.copy(a).add(b).multiplyScalar(.5);item.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),b.clone().sub(a).normalize());item.castShadow=true;root.add(item);return item};
 const wheel=(x:number,z:number,r=.42)=>{const tire=mesh(new T.CylinderGeometry(r,r,.26,18),'rubber',x,r+.02,z,Math.PI/2),hub=mesh(new T.CylinderGeometry(r*.58,r*.58,.275,12),'chrome',x,r+.02,z,Math.PI/2);for(const item of [tire,hub]){item.userData.hsWheel=true;item.userData.hsFront=z>0;item.userData.hsBaseY=r+.02}for(let i=0;i<5;i++){const spoke=new T.Mesh(new T.BoxGeometry(.035,.025,r*1.04),mats.chrome);spoke.position.set(x,r+.02,z);spoke.rotation.y=i*Math.PI/5;root.add(spoke)}};
 if(type==='car'){
  const isVan=style==='van',isCoupe=style==='coupe',isHatch=style==='hatch';
  const length=isVan?4.65:isCoupe?3.78:isHatch?3.92:4.28,bodyHeight=isVan?.86:isCoupe?.56:.66,roofHeight=isVan?1.68:isCoupe?1.42:1.5,wheelZ=length*.315,wheelR=isVan?.44:isCoupe?.39:.42;
  mesh(new RoundedBoxGeometry(isVan?1.98:1.9,bodyHeight,length,3,.13),'body',0,.66,0);
  mesh(new RoundedBoxGeometry(isVan?1.74:1.72,.22,length*.72,2,.06),'trim',0,.49,0);
  const greenhouseLength=isVan?2.35:isCoupe?1.76:isHatch?1.92:2.08;
  mesh(new RoundedBoxGeometry(isVan?1.72:1.62,isVan?1.0:.74,greenhouseLength,2,.13),'glass',0,roofHeight-.34,isVan?-.05:-.15);
  mesh(new RoundedBoxGeometry(isVan?1.77:1.68,.13,greenhouseLength+.12,2,.05),'body',0,roofHeight+.17,isVan?-.05:-.15);
  mesh(new RoundedBoxGeometry(isVan?1.81:1.75,.13,.48,2,.04),'body',0,1.08,length*.30);
  mesh(new RoundedBoxGeometry(isVan?1.81:1.75,.13,.54,2,.04),'body',0,1.04,-length*.34);
  for(const x of [-.86,.86]){mesh(new T.BoxGeometry(.06,isVan?.78:.55,.08),'trim',x,roofHeight-.45,-.16);mesh(new RoundedBoxGeometry(.22,.13,.28,2,.04),'body',x*1.04,1.09,.36)}
  for(const z of [-wheelZ,wheelZ])for(const x of [-.98,.98])wheel(x,z,wheelR);
  mesh(new RoundedBoxGeometry(1.9,.15,.19,1,.035),'chrome',0,.46,length*.505);mesh(new RoundedBoxGeometry(1.9,.15,.19,1,.035),'chrome',0,.46,-length*.505);
  for(const x of [-.6,.6]){mesh(new RoundedBoxGeometry(.43,.20,.045,1,.01),'light',x,.81,length*.505);mesh(new RoundedBoxGeometry(.42,.18,.045,1,.01),'red',x,.79,-length*.505)}
  mesh(new T.BoxGeometry(isVan?1.08:.78,.22,.035),'dark',0,.67,length*.51);mesh(new T.BoxGeometry(isVan?1.12:.86,.035),'chrome',0,.85,length*.512);
  if(isCoupe){mesh(new RoundedBoxGeometry(1.28,.06,.38,1,.025),'body',0,1.12,-length*.47);mesh(new T.BoxGeometry(1.2,.04,.2),'dark',0,1.23,-length*.47)}
  if(isHatch){mesh(new RoundedBoxGeometry(1.6,.62,.1,1,.03),'glass',0,1.15,-length*.47);mesh(new RoundedBoxGeometry(1.72,.08,.24,1,.025),'body',0,1.57,-length*.43)}
  if(isVan){for(const z of [-.64,.52])for(const x of [-.9,.9])mesh(new T.BoxGeometry(.04,.45,.62),'glass',x,1.26,z);mesh(new RoundedBoxGeometry(.9,.11,.18,1,.04),'body',0,1.62,-1.72)}
 }else{
  const mountain=style==='mountain',road=style==='road',radius=mountain?.48:road?.43:.41;
  const p=(x:number,y:number,z:number)=>new T.Vector3(x,y,z);
  for(const z of [-.83,.83]){mesh(new T.TorusGeometry(radius,.035,8,28),'rubber',0,radius+.04,z,Math.PI/2);mesh(new T.TorusGeometry(radius*.78,.015,8,28),'chrome',0,radius+.04,z,Math.PI/2);for(let i=0;i<10;i++){const spoke=new T.Mesh(new T.CylinderGeometry(.006,.006,radius*1.55,4),mats.chrome);spoke.position.set(0,radius+.04,z);spoke.rotation.x=i*Math.PI/5;root.add(spoke)}}
  const rear=p(0,radius+.04,-.83),bottom=p(0,.56,-.08),seat=p(0,1.1,-.36),head=p(0,1.05,.48),front=p(0,radius+.04,.83);
  for(const [a,b] of [[rear,bottom],[bottom,seat],[seat,rear],[seat,head],[head,bottom],[head,front]])rod(a,b,mountain?.045:.034,'body');
  rod(head,p(0,1.42,.54),.028,'chrome');rod(p(0,1.42,.54),p(0,1.42,.78),.026,'dark');mesh(new RoundedBoxGeometry(.26,.08,.44,1,.025),'dark',0,1.15,-.38);
  rod(bottom,p(.23,.56,-.08),.02,'chrome');rod(bottom,p(-.23,.56,-.08),.02,'chrome');for(const x of [-.26,.26])mesh(new T.BoxGeometry(.18,.035,.07),'dark',x,.56,-.08);
  if(mountain){mesh(new T.CylinderGeometry(.035,.035,.74,8),'chrome',.12,.75,.52);mesh(new T.CylinderGeometry(.035,.035,.74,8),'chrome',-.12,.75,.52);mesh(new RoundedBoxGeometry(.18,.08,.36,1,.03),'body',0,1.28,.33)}
  if(road){mesh(new RoundedBoxGeometry(.18,.07,.42,1,.025),'dark',0,1.16,-.38);mesh(new T.TorusGeometry(.14,.018,6,16),'chrome',0,1.44,.54,Math.PI/2)}
 }
 root.userData.vehicleStyle=style;
 return root;
}
