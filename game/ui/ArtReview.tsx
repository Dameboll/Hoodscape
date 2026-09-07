'use client';
import type {Game} from '../render/runtime';

/** Local development only. All positions are repeatable visual test fixtures. */
export function ArtReview({game,onCreator,onTitle}:{game:Game;onCreator:()=>void;onTitle:()=>void}) {
 const shot=(x:number,z:number,camera:[number,number,number],target:[number,number,number])=>{
  game.setCreator(false);game.warp(x,z);game.start();game.externalMenu=true;
  game.reviewCamera={camera,target};game.input.clear();game.setInput();
 };
 const stats=game.reviewFrames.slice().sort((a,b)=>a-b);
 const median=stats[Math.floor(stats.length*.5)]||0,p95=stats[Math.floor(stats.length*.95)]||0;
 return <aside aria-label="Local art review" style={{position:'fixed',bottom:0,left:0,right:0,zIndex:200,background:'#161616',color:'#eee9df',padding:'7px 12px',display:'flex',gap:10,alignItems:'center',flexWrap:'wrap',font:'12px sans-serif'}}>
  <b>LOCAL ART REVIEW · NO SAVES</b>
  <button onClick={()=>{game.reviewCamera=null;onTitle()}}>Title</button>
  <button onClick={()=>shot(-10,25,[-1,3.2,37],[-14,4,24])}>Market</button>
  <button onClick={()=>shot(-10,25,[-7,1.8,30],[-13.3,2.5,26])}>Street detail</button>
  <button onClick={()=>{game.reviewCamera=null;onCreator()}}>Creator</button>
  <button onClick={()=>{game.reviewCamera=null;game.setCreator(false);game.start()}}>Walk</button>
  <button onClick={()=>game.quality('high')}>High quality</button>
  <button onClick={()=>game.quality('low')}>Low quality</button>
  <output aria-label="Render measurements">{median?Math.round(1000/median):0} FPS · p95 {p95.toFixed(1)} ms · {game.renderer.info.render.calls} draws · {game.renderer.info.render.triangles.toLocaleString()} triangles · {game.renderer.domElement.width}×{game.renderer.domElement.height}</output>
 </aside>;
}
