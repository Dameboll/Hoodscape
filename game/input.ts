export class Input{
 keys=new Set<string>();pressed=new Set<string>();yaw=0;pitch=.29;zoom=6;sensitivity=1;stick={x:0,y:0};touchRun=false;lookId:number|null=null;last={x:0,y:0};active=false;dispose:()=>void;
 constructor(public canvas:HTMLCanvasElement){const clean:(()=>void)[]=[];const on=(target:EventTarget,type:string,fn:EventListener,options?:AddEventListenerOptions)=>{target.addEventListener(type,fn,options);clean.push(()=>target.removeEventListener(type,fn,options))};
 on(window,'keydown',((e:KeyboardEvent)=>{if(e.target instanceof HTMLInputElement||e.target instanceof HTMLTextAreaElement)return;if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Tab'].includes(e.code))e.preventDefault();if(!this.keys.has(e.code))this.pressed.add(e.code);this.keys.add(e.code)}) as EventListener);
 on(window,'keyup',((e:KeyboardEvent)=>{this.keys.delete(e.code)}) as EventListener);on(window,'blur',(()=>{this.keys.clear();this.stick={x:0,y:0}}) as EventListener);
 on(canvas,'click',(()=>{if(this.active&&!matchMedia('(pointer:coarse)').matches&&document.pointerLockElement!==canvas)canvas.requestPointerLock()?.catch(()=>{})}) as EventListener);
 on(document,'mousemove',((e:MouseEvent)=>{if(this.active&&document.pointerLockElement===canvas){this.yaw-=e.movementX*.0025*this.sensitivity;this.pitch=Math.max(-.12,Math.min(.9,this.pitch+e.movementY*.002*this.sensitivity))}}) as EventListener);
 on(canvas,'mousedown',((e:MouseEvent)=>{if(this.active&&document.pointerLockElement===canvas){if(e.button===2)this.keys.add('Aim');else if(e.button===0){this.keys.add('Fire');this.pressed.add('Attack')}}}) as EventListener);
 on(window,'mouseup',((e:MouseEvent)=>{if(e.button===2)this.keys.delete('Aim');if(e.button===0)this.keys.delete('Fire')}) as EventListener);
 on(canvas,'contextmenu',((e:Event)=>e.preventDefault()) as EventListener);
 on(canvas,'wheel',((e:WheelEvent)=>{if(this.active){e.preventDefault();this.zoom=Math.max(3,Math.min(10,this.zoom+e.deltaY*.008))}}) as EventListener,{passive:false});
 on(canvas,'pointerdown',((e:PointerEvent)=>{if(e.pointerType==='touch'&&this.active){this.lookId=e.pointerId;this.last={x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId)}}) as EventListener);
 on(canvas,'pointermove',((e:PointerEvent)=>{if(e.pointerId===this.lookId){this.yaw-=(e.clientX-this.last.x)*.006;this.pitch=Math.max(-.12,Math.min(.9,this.pitch+(e.clientY-this.last.y)*.004));this.last={x:e.clientX,y:e.clientY}}}) as EventListener);
 on(canvas,'pointerup',(()=>this.lookId=null) as EventListener);on(canvas,'pointercancel',(()=>this.lookId=null) as EventListener);
 this.dispose=()=>clean.forEach(f=>f());
 }
 consume(key:string){const has=this.pressed.has(key);this.pressed.delete(key);return has}
 clear(){this.keys.clear();this.pressed.clear();this.stick={x:0,y:0};this.touchRun=false}
 move(){let x=(this.keys.has('KeyD')?1:0)-(this.keys.has('KeyA')?1:0)+this.stick.x;let y=(this.keys.has('KeyW')?1:0)-(this.keys.has('KeyS')?1:0)-this.stick.y;const l=Math.hypot(x,y);if(l>1){x/=l;y/=l}return {x,y}}
}
