type MiniMapSolid={x:number;z:number;w:number;d:number;h:number};
type MiniMapPlace={x:number;z:number;kind?:string};
type MiniMapMarker={x:number;z:number};

type MiniMapView={
  x:number;
  z:number;
  yaw:number;
  solids:MiniMapSolid[];
  places:MiniMapPlace[];
  objective?:MiniMapMarker;
  police?:MiniMapMarker[];
  heat:number;
};

/** Paints the compact district map. It is presentation-only; world state remains the source of truth. */
export function drawMiniMap(canvas:HTMLCanvasElement,view:MiniMapView){
  const ctx=canvas.getContext('2d');
  if(!ctx)return;
  const size=canvas.width;
  const scale=1.85;
  ctx.clearRect(0,0,size,size);
  ctx.fillStyle='#242727';
  ctx.fillRect(0,0,size,size);
  ctx.save();
  ctx.translate(size/2,size/2);
  ctx.scale(scale,scale);
  ctx.translate(-view.x,-view.z);

  // District blocks and arterial roads establish a readable city shape at a glance.
  ctx.fillStyle='#4f5553';
  ctx.fillRect(-8,-75,16,150);
  ctx.fillRect(-70,-15,140,13);
  ctx.save();
  ctx.rotate(.55);
  ctx.fillRect(-4,-110,8,220);
  ctx.restore();
  ctx.save();
  ctx.rotate(-.55);
  ctx.fillRect(-3,-110,6,220);
  ctx.restore();
  ctx.strokeStyle='#9d947f';
  ctx.lineWidth=.7;
  ctx.setLineDash([3,4]);
  ctx.beginPath();ctx.moveTo(-8,-75);ctx.lineTo(-8,75);ctx.moveTo(8,-75);ctx.lineTo(8,75);ctx.moveTo(-70,-15);ctx.lineTo(70,-15);ctx.moveTo(-70,-2);ctx.lineTo(70,-2);ctx.stroke();
  ctx.setLineDash([]);

  for(const b of view.solids){
    if(b.h<4||b.w<1||b.d<1)continue;
    ctx.fillStyle=b.h>7?'#76695f':'#5e625e';
    ctx.strokeStyle='#9a8978';
    ctx.lineWidth=.45;
    ctx.fillRect(b.x-b.w/2,b.z-b.d/2,b.w,b.d);
    ctx.strokeRect(b.x-b.w/2,b.z-b.d/2,b.w,b.d);
  }
  // Small civic and park shapes keep the overview from reading as an empty grid.
  ctx.fillStyle='#7d8068';
  ctx.fillRect(21,-52,28,32);
  ctx.fillStyle='#9a795f';
  ctx.fillRect(-54,33,18,11);
  ctx.fillStyle='#8f6d5b';
  ctx.fillRect(39,39,14,18);

  for(const p of view.places){
    ctx.fillStyle=p.kind==='job'?'#d45138':p.kind==='rival'?'#bc6c5d':'#d0c2a7';
    ctx.beginPath();ctx.arc(p.x,p.z,1.35,0,Math.PI*2);ctx.fill();
  }
  if(view.objective){
    ctx.fillStyle='#e3b55e';
    ctx.beginPath();ctx.arc(view.objective.x,view.objective.z,2.6,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#f5e8c8';ctx.lineWidth=.65;ctx.stroke();
  }
  if(view.heat>0)for(const p of view.police||[]){
    ctx.fillStyle='#df6d5e';
    ctx.beginPath();ctx.arc(p.x,p.z,1.8,0,Math.PI*2);ctx.fill();
  }
  ctx.restore();

  ctx.save();
  ctx.translate(size/2,size/2);
  ctx.rotate(-view.yaw);
  ctx.fillStyle='#f0e9dc';
  ctx.strokeStyle='#171716';
  ctx.lineWidth=1.4;
  ctx.beginPath();ctx.moveTo(0,-9);ctx.lineTo(-5.5,6);ctx.lineTo(0,3.2);ctx.lineTo(5.5,6);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.restore();
}
