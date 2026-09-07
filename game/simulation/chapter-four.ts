import type {Save} from './state';
import type {Session,Action} from './session';
import {removeItem} from './state';
import {CHAPTER_FOUR,storyState,remember,record,addEvidence} from './story';

const fail={ok:false,text:'That conversation has moved on.',cash:0,xp:0};
const flag=(st:ReturnType<typeof storyState>,id:string)=>{if(!st.flags.includes(id))st.flags.push(id)};

// Chapter 4 — People Who Never Existed
// A resident named Theo Wells has been erased: apartment, records, and the
// memories of everyone but June and (dimly) Ruiz. Evidence routes depend on
// prior chapters: June's photograph (Chapter 1 favor), Ruiz's recorder
// (Chapter 2 favor), and Vale's account (Chapter 3 liaison choices).
const juneProof=(st:ReturnType<typeof storyState>)=>st.side.keepsake===3||st.evidence.includes('envelope');
const ruizProof=(st:ReturnType<typeof storyState>)=>st.side.recorder===2||st.evidence.includes('recording');
const valeAccess=(st:ReturnType<typeof storyState>)=>st.flags.includes('vale_role')||st.flags.includes('vale_infiltrate');

export function chapterFourChoice(s:Save,stage:number,choice:string):{ok:boolean;text:string;cash:number;xp:number}{
 const st=storyState(s);
 if(st.stage!==stage||st.choices[String(stage)])return fail;
 const options:Record<number,string[]>={19:['listen'],20:['photo','recordings','assembly'],21:['door','records','catalog'],22:['tell','quiet','steady'],23:['protect','publish','contact']};
 if(!options[stage]?.includes(choice))return fail;
 if(stage===23&&choice==='contact'&&!valeAccess(st))return fail;
 let text='',reward=0,xp=25;
 if(stage===19){
  flag(st,'vanishing_started');
  remember(st,'june','Refused to let Theo’s disappearance be treated as weather.',15,10);
  remember(st,'ruiz','Started checking the neighborhood’s paper trail after June’s report.',10,5);
  text='June has the photograph on the counter when you arrive. There should be two children beside her. The white space has widened overnight. “His name was Theo. The bus driver asks who I’m waving at. Don’t let them tell me I’m confused.”';
 }else if(stage===20){
  if(choice==='photo'){
   if(!juneProof(st)){addEvidence(st,'missing_person');remember(st,'june','Believed her memory without needing proof first.',20,10);text='June’s copy of the photograph is the only record. The white space between the two children is not worn paper; it is clean and precise. You keep a scan. It proves she remembers, not that Theo existed.'}
   else{addEvidence(st,'envelope_scan');remember(st,'june','Shared the recovered photograph and what she remembers of Theo.',25,10);reward=25;text='June’s envelope photograph survives the record change: a school picture from the 1998 evacuation with Theo’s face intact beside hers. “He hummed the four notes too,” she says. “Ask the machine that still plays them.”'}
  }else if(choice==='recordings'){
   if(!ruizProof(st)){addEvidence(st,'missing_person');remember(st,'ruiz','Worked the failing tape until it gave up one detail.',15,15);text='Ruiz’s recorder is too damaged to preserve the courier’s voice, but its index page survives: a 1998 pickup at the address of the empty apartment. The tape names a child in transit. It does not name Theo.'}
   else{addEvidence(st,'theo_recording');remember(st,'ruiz','Preserved the courier recording that proves Theo’s pickup.',25,15);text='The repaired recorder still holds a maintenance channel: “Subject 12 relocated, 1998. Effects disposition pending.” Ruiz keeps the original tape in a paper bag. “They logged a child like inventory.”'}
  }else{
   if(!valeAccess(st)){addEvidence(st,'missing_person');remember(st,'bishop','Confirmed the rent fund came from the Initiative without being asked twice.',10,15);text='Bishop collects quietly on your behalf: the empty apartment’s rent fund was opened the week of the hearing and closed the morning after. “Somebody paid to make a hole,” he says. It proves money moved, not who vanished.'}
   else{addEvidence(st,'resident_file');remember(st,'june','Used Vale’s access to pull the person, not the paperwork.',20,15);reward=40;text='Your Initiative account still opens personnel records. Theo Wells: enrolled at age six, relocated 1998, effect on surrounding subjects flagged as “contagious.” The file has a photograph. The photograph is June’s neighbor.'}
  }
 }else if(stage===21){
  if(choice==='door'){
   flag(st,'apartment_marked');remember(st,'june','Stayed with Theo’s door instead of letting it be repainted.',15,10);text='The mailbox label is gone, the notice is gone, the paint is fresh. There are no hinges on the inside of the door frame. The hallway remembers a hallway. June waits at the curb. “Whatever you do, don’t let me un-remember him.”';
  }else if(choice==='records'){
   flag(st,'records_compared');remember(st,'ruiz','Compared Theo’s paper trail against the Initiative’s clean copy.',20,15);text='The tenant line’s copies disagree with the Initiative’s archive. Your list has a Theo Wells on every page. Theirs has a gap with a clean scan of what the wall would look like. Ruiz circles the gap. “People don’t leave holes. Edits do.”';
  }else{
   flag(st,'unlisted_found');remember(st,'june','Read a catalog entry about someone she loved and kept her voice level.',10,5);text='Inside the unlisted 03:17 channel the radio picks up a catalog entry, read like a parts list: one displaced resident, asset value negligible, social graph retained for baseline calibration. The voice pauses on Theo’s name as if it recognizes it.';
  }
 }else if(stage===22){
  if(choice==='tell'){
   flag(st,'residents_told');remember(st,'malik','Told the tenants the truth about Theo before the paperwork finished.',20,10);remember(st,'june','Watched the neighborhood choose to remember together.',25,5);remember(st,'bishop','Saw the block organize without his permission.',-5,10);
   text='The tenant line carries Theo’s name before sunset. People bring photographs from their own drawers, and the copies disagree with the Initiative’s in the same places. By morning the block remembers one more person than the record allows.';
  }else if(choice==='quiet'){
   flag(st,'kept_quiet');remember(st,'june','Accepted help without becoming a public warning.',10);remember(st,'ruiz','Kept the strongest evidence out of the Initiative’s reach.',15,10);
   text='June asks to keep Theo between the people who already hold pieces of him. The tenant line carries nothing. What you have stays in drawers and tape bags: safer, smaller, and harder to erase twice.';
  }else{
   flag(st,'kept_steady');remember(st,'june','Kept her routine while her memory was being audited.',15,10);remember(st,'ruiz','Approved of a plan built on boring, repeatable steps.',10,10);
   text='June keeps the counter open and the laundry running. Neighbors start bringing their own mismatches: a birthday nobody attended, a name on a dust-covered jacket. Nothing is announced. The block quietly compares notes against the Initiative’s story.';
  }
 }else if(stage===23){
  reward=150;
  const strong=juneProof(st)||ruizProof(st);
  if(choice==='protect'){
   flag(st,'theo_protected');remember(st,'june','Chose to keep a remembered person safe over proving a point.',30,10);remember(st,'ruiz','Protected a witness the records say does not exist.',25,10);
   text=strong?'June keeps the photograph face-down on the counter while you agree on the story. Theo stays unlisted: no records request, no public name. As long as nobody asks the system to confirm him, nothing flags him for another relocation.':'Without the photograph or the recording, protection is a promise instead of a plan. You still make it. The tenant line agrees to treat Theo as a person the paperwork forgot.';
  }else if(choice==='publish'){
   flag(st,'theo_public');if(strong)s.heat=Math.max(s.heat,1);
   remember(st,'june','Let the neighborhood carry Theo’s name in public.',25,15);remember(st,'malik','Backed the announcement even with the Initiative watching.',20,10);remember(st,'bishop','Watched the Initiative’s quiet method become a public question.',-10,15,10);
   text=strong?'You publish the photograph and the pickup recording together. The tenant line prints Theo Wells on the emergency sheet. The Initiative cannot answer a missing person without admitting the method that made him missing.':'You publish what testimony you have. The Initiative calls it grief without paperwork, but tenants start checking their own records, and too many families find the same kind of gap.';
  }else{
   remember(st,'june','Trusted you to use Vale’s own channel to ask about Theo.',20,10);remember(st,'ruiz','Kept an analog copy before anything touched the Initiative’s systems.',20,15);
   if(strong){flag(st,'theo_request');text='You file a status request through your Initiative account: where is subject 12? The reply arrives in seconds, addressed to the wrong version of the truth: RELOCATED — INTEGRATION PENDING. Somewhere in the system, Theo is still being processed. Ruiz’s analog copy keeps the question alive even if the account goes dark.'}
   else{flag(st,'theo_probe');text='You query the account about a name the roster no longer contains. The system answers anyway: RELOCATED — INTEGRATION PENDING. It knows the name. Vale will know the query.'}
  }
  flag(st,'chapter_four_complete');
  text+=' Late that night every radio on the block plays four notes at once. Then a voice: “ATTENTION SAINT MERCER. BASELINE RECALIBRATION COMPLETE. RESIDENT 4429: THANK YOU FOR YOUR PARTICIPATION.”';
 }
 st.choices[String(stage)]=choice;
 st.stage++;
 s.cash+=reward;
 record(st,CHAPTER_FOUR[stage-19].title,text);
 return{ok:true,text,cash:reward,xp};
}

export function chapterFourPanel(host:Session){
 const st=storyState(host.s),stage=st.stage;
 if(stage<19||stage>23)return;
 const node=CHAPTER_FOUR[stage-19];
 const strong=juneProof(st)||ruizProof(st)||st.evidence.includes('resident_file');
 const scripts:Record<number,{text:string;choices:{id:string;label:string;disabled?:boolean}[]}>={
  19:{text:'June is at Spin Cycle holding a photograph that no longer matches itself. The white space where a neighbor should be has widened since yesterday. She is not confused, and she is not letting go of it.',choices:[{id:'listen',label:'Listen. Remember Theo with her.'}]},
  20:{text:`You have one day before the Initiative's cleanup crew reclassifies the block. ${juneProof(st)?'June’s recovered photograph survives the record change.':''} ${ruizProof(st)?'Ruiz’s repaired recorder still holds the maintenance channel.':''} ${valeAccess(st)?'Your Initiative account still opens personnel records.':''} ${strong||valeAccess(st)?'You can prove Theo existed.':'You can testify that June remembers, but the proof is thin.'}`,choices:[
   {id:'photo',label:'Take June’s photograph to Ruiz and preserve it.',disabled:!juneProof(st)},
   {id:'recordings',label:'Recover the pickup recording from Ruiz’s tape.',disabled:!ruizProof(st)},
   {id:'assembly',label:valeAccess(st)?'Use Vale’s account to pull Theo’s file.':'Ask Bishop to trace the rent fund quietly.'}]},
  21:{text:'The empty apartment sits on the third floor with fresh paint and no nameplate. The tenant line has its own copies of the old roster. The unlisted radio channel still runs at 03:17. Each source tells a different story about the same door.',choices:[
   {id:'door',label:'Stand with June at the apartment door.'},
   {id:'records',label:'Compare the tenant line’s roster with the Initiative’s archive.'},
   {id:'catalog',label:'Listen for the unlisted channel at 03:17.'}]},
  22:{text:'June’s neighborhood is deciding how to hold a person the record denies. The tenant line can carry Theo’s name before sunset, or the strongest evidence can stay quiet, or the block can simply keep comparing notes.',choices:[
   {id:'tell',label:'Tell the tenants. Make the block remember out loud.'},
   {id:'quiet',label:'Keep Theo quiet and the evidence safe.'},
   {id:'steady',label:'Keep the block steady and keep collecting mismatches.'}]},
  23:{text:`This closes Chapter 4. ${strong?'You hold physical or recorded proof that Theo Wells existed.':'Your proof is testimony only; the strongest records were never recovered.'} ${valeAccess(st)?'Your Initiative account remains open.':'The Initiative’s systems are closed to you.'} What happens to Theo’s name happens to the whole neighborhood next.`,choices:[
   {id:'protect',label:'Protect Theo. Keep him unlisted and safe.'},
   {id:'publish',label:'Publish Theo’s name. Make the block remember publicly.'},
   {id:'contact',label:valeAccess(st)?'File a status request through Vale’s account.':'Probe the Initiative about the relocation.',disabled:!valeAccess(st)}]}
 };
 const spec=scripts[stage];
 host.open({title:node.title,eyebrow:`CHAPTER 4 · MOVE ${stage-18} / 5`,text:spec.text,actions:spec.choices.map(c=>({label:c.label,disabled:c.disabled,run:()=>{
  const result=chapterFourChoice(host.s,stage,c.id);
  if(!result.ok)return;
  host.xp(stage===23?'Street Rep':'Hustling',stage===23?100:25);
  void host.save(false);
  host.open({title:stage===23?'CHAPTER 4 COMPLETE':node.title,eyebrow:'PEOPLE WHO NEVER EXISTED',text:result.text,actions:[{label:'Continue',run:()=>host.close()}]});
 }}))});
}

export function chapterFourActions(host:Session,place:string):Action[]{
 const st=storyState(host.s),actions:Action[]=[];
 if(st.stage<19)return actions;
 if(place==='meeting'&&!st.side.poster){
  actions.push({label:'SIDE QUEST · Posters for a person who never was',run:()=>{if(st.side.poster)return;st.side.poster=1;record(st,'Posters for a person who never was','June wants the tenant line to carry Theo’s name on paper, in ink, before the Initiative can edit another wall.');host.notify('June needs posters','Bring the tenant line a marker.');void host.save(false);host.location(place)}});
 }
 if(place==='clothes'&&st.side.poster===1){
  actions.push({label:'Take the marker from Nia’s counter',run:()=>{if(st.side.poster!==1)return;st.side.poster=2;host.xp('Hustling',20);record(st,'Posters for a person who never was','Nia presses her good marker into your hand. Ink outlasts a screenshot.');host.notify('Marker collected','Bring it to the noticeboard.');void host.save(false);host.location(place)}});
 }
 if(place==='meeting'&&st.side.poster===2){
  actions.push({label:'Write Theo’s name on the tenant sheet',run:()=>{if(st.side.poster!==2)return;st.side.poster=3;flag(st,'name_on_sheet');remember(st,'june','Watched her neighbor’s name go up in ink on the tenant sheet.',25,10);host.s.cash+=30;host.xp('Street Rep',30);record(st,'Posters for a person who never was','The emergency sheet carries Theo Wells in Nia’s marker. Paper remembers what the archive won’t.');host.notify('NAME ON THE SHEET','+$30 · The tenant line remembers.','success');void host.save(false);host.location(place)}});
 }
 if(place==='garage'&&!st.side.eyewitness){
  actions.push({label:'SIDE QUEST · The witness who is not there',run:()=>{if(st.side.eyewitness)return;st.side.eyewitness=1;record(st,'The witness who is not there','Ruiz has a tape with a courier describing the van that took Theo. Get a written account from Jay on night shift.');host.notify('Ask Jay about the van','He works nights near the Towers.');void host.save(false);host.location(place)}});
 }
 if(place==='meeting'&&st.side.eyewitness===1){
  actions.push({label:'Ask Jay about the 1998 van',run:()=>{if(st.side.eyewitness!==1)return;st.side.eyewitness=2;flag(st,'night_witness');remember(st,'june','Collected a second account of the van from the night shift.',20,10);host.s.cash+=25;host.xp('Hustling',30);record(st,'The witness who is not there','Jay’s account matches the tape: a gray utility van, Initiative plates, a child’s seat already installed. Theo was not taken. He was collected.');host.notify('WITNESS ACCOUNT KEPT','+$25 · The stories match.','success');void host.save(false);host.location(place)}});
 }
 if(place==='bank'&&!st.side.memorywalk){
  actions.push({label:'SIDE QUEST · A street that remembers',run:()=>{if(st.side.memorywalk)return;st.side.memorywalk=1;record(st,'A street that remembers','June wants to walk the route she and Theo used to take before the Initiative re-paints another landmark.');host.notify('Walk June’s route','Start at the laundry.');void host.save(false);host.location(place)}});
 }
 if(place==='home'&&st.side.memorywalk===1){
  actions.push({label:'Walk June’s route with her',run:()=>{if(st.side.memorywalk!==1)return;st.side.memorywalk=2;flag(st,'route_walked');remember(st,'june','Walked the old route out loud, naming landmarks before they could be edited.',25,5);host.xp('Street Rep',30);record(st,'A street that remembers','You walk the whole route with June. The bus shelter, the alley, the stoop. The neighborhood keeps its landmarks by using them.');host.notify('ROUTE WALKED','The landmarks hold for now.','success');void host.save(false);host.location(place)}});
 }
 return actions;
}

