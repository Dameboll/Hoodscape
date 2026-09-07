export type ArcadeVehicleState={speed:number;yaw:number;steer:number;lateralSpeed:number};
export type ArcadeVehicleInput={throttle:number;steer:number;brake:boolean;dt:number;maxSpeed:number;reverseMax:number;acceleration:number;turnRate:number;grip:number};

/** Deterministic, approachable vehicle step. It models weight transfer cues and tire grip without adding new game systems. */
export function stepArcadeVehicle(state:ArcadeVehicleState,input:ArcadeVehicleInput){
 const dt=Math.min(.05,Math.max(.001,input.dt));
 const steerTarget=Math.max(-1,Math.min(1,input.steer));
 state.steer+=(steerTarget-state.steer)*(1-Math.exp(-dt*9));
 const throttle=Math.max(-1,Math.min(1,input.throttle));
 const sameDirection=state.speed===0||Math.sign(throttle)===Math.sign(state.speed);
 const braking=input.brake||(!sameDirection&&Math.abs(throttle)>.05);
 if(braking)state.speed*=Math.exp(-8.5*dt);
 state.speed+=throttle*input.acceleration*dt;
 state.speed*=Math.exp(-(Math.abs(throttle)>.05?.42:2.6)*dt);
 state.speed=Math.max(-input.reverseMax,Math.min(input.maxSpeed,state.speed));
 const travel=Math.min(1,Math.abs(state.speed)/3);
 state.yaw-=state.steer*input.turnRate*travel*dt*(state.speed<0?-1:1);
 const lateralTarget=state.steer*state.speed*(1-input.grip)*.16;
 state.lateralSpeed+=(lateralTarget-state.lateralSpeed)*(1-Math.exp(-dt*(5+input.grip*16)));
 const forwardX=Math.sin(state.yaw),forwardZ=Math.cos(state.yaw),rightX=Math.cos(state.yaw),rightZ=-Math.sin(state.yaw);
 return {x:(forwardX*state.speed+rightX*state.lateralSpeed)*dt,z:(forwardZ*state.speed+rightZ*state.lateralSpeed)*dt};
}
