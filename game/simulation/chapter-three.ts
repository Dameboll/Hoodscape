import type {Save} from './state';
import type {Session,Action} from './session';
import {removeItem} from './state';
import {CHAPTER_THREE,storyState,remember,record,addEvidence} from './story';

const fail={ok:false,text:'That conversation has moved on.',cash:0,xp:0};
const flag=(st:ReturnType<typeof storyState>,id:string)=>{if(!st.flags.includes(id))st.flags.push(id)};

export function chapterThreeChoice(s:Save,stage:number,choice:string):{ok:boolean;text:string;cash:number;xp:number}{
 const st=storyState(s);
 if(st.stage!==stage||st.choices[String(stage)])return fail;
 const options:Record<number,string[]>={14:['testify','observe'],15:['back','document'],16:['accept','infiltrate','refuse'],17:['compare','warn'],18:['save','preserve','expose']};
 if(!options[stage]?.includes(choice))return fail;
 const permitCost=st.side.merchant===2?0:st.flags.includes('merchant_backed')?20:40;
 if(stage===18&&choice==='save'&&s.cash<permitCost)return fail;
 let text='',reward=0,xp=25;
 if(stage===14){
  if(choice==='testify'){
   flag(st,'hearing_testimony');addEvidence(st,'hearing_notes');remember(st,'malik','Spoke for the tenants at the public hearing.',15,10);remember(st,'june','Used your own name instead of hiding behind her story.',20,5);
   text='You testify about the renewal calls, the missing shipment, and the pressure behind both. June hears her experience repeated without being turned into a rumor. Vale’s moderator thanks you a little too carefully.';
  }else{
   flag(st,'hearing_observed');addEvidence(st,'attendance');remember(st,'ruiz','Stayed quiet long enough to notice the hearing’s paper trail.',15,15);
   text='You stay near the back wall and watch the sign-in sheet. Three rows of names use the same handwriting, and several “tenants” repeat a phrase from the Initiative’s script. Ruiz will want the copy.';
  }
 }else if(stage===15){
  if(choice==='back'){
   flag(st,'merchant_backed');remember(st,'malik','Backed Nia when the Initiative threatened her storefront.',15,10);remember(st,'rosa','Chose a working neighborhood over a polished redevelopment pitch.',10,5);
   text='Nia’s permit is denied because her back room is “under review.” You ask Malik and Rosa to keep her pop-up supplied while she fights the paperwork. It is not a rescue yet, but it keeps her in business long enough to choose her own terms.';
  }else{
   flag(st,'permit_trace');addEvidence(st,'permit_order');remember(st,'ruiz','Photographed the hidden conditions on Nia’s permit.',10,15);
   text='You photograph the permit language before Vale’s staff can collect it. The city offers Nia a storefront, but only if the Assembly gets the back room. A favor with a lock on it is still a lock.';
  }
 }else if(stage===16){
  if(choice==='accept'){
   flag(st,'vale_role');flag(st,'permit_access');s.cash+=75;remember(st,'june','Accepted Vale’s badge before deciding what to do with its access.',-5,5);
   text='Vale offers you an official neighborhood liaison badge and a $75 stipend. “You already know how the block works,” she says. The badge opens records, but every signature will carry your name.';
  }else if(choice==='infiltrate'){
   flag(st,'vale_infiltrate');remember(st,'ruiz','Took Vale’s access without accepting her chain of command.',20,15);
   text='You accept a temporary appointment and keep the badge turned inward. Vale gives you a clean login. “Use it to fix things,” she says. The account can also show who has been rewritten out of the city.';
  }else{
   flag(st,'vale_refused');remember(st,'june','Refused an official role that required quiet approval.',15,10);remember(st,'bishop','Refused Vale’s badge instead of becoming her neighborhood face.',5,10);
   text='You refuse the badge. Vale does not threaten you; she simply removes your name from the appointment calendar. “Then you are not responsible for what happens next,” she says, as if responsibility were hers to assign.';
  }
 }else if(stage===17){
  if(choice==='compare'){
   flag(st,'duplicate_records');addEvidence(st,'citizen_files');remember(st,'ruiz','Compared the Initiative’s duplicate employee records.',20,15);
   text='The licensing archive lists the same workers under different names and start dates. People are moved between properties on paper whenever the Initiative needs a clean history. The duplicates are not clerical mistakes; they are an operating system.';
  }else{
   flag(st,'residents_warned');remember(st,'june','Warned residents before their names could be moved between files.',20,5);remember(st,'malik','Gave people a chance to check the paperwork attached to their own lives.',10);
   text='You do not copy every name. You warn the residents whose files are already changing and let them decide what to protect. The records stay incomplete, but the people are not blindsided.';
  }
 }else if(stage===18){
  if(choice==='save'){
   if(permitCost)s.cash-=permitCost;
   flag(st,'merchant_saved');remember(st,'malik','Spent neighborhood resources to keep Nia’s storefront open.',20,10);reward=120;
   text=permitCost?'You pay the hidden permit fee from the neighborhood fund and keep Nia’s storefront open. It costs $'+permitCost+', but the back room stays hers.':'Nia’s repaired storefront passes inspection without another payment. The paper trail shows the neighborhood solved the problem before the Initiative could claim it.';
  }else if(choice==='preserve'){
   flag(st,'records_preserved');addEvidence(st,'citizen_files');remember(st,'ruiz','Preserved the duplicate records instead of trading them for a permit.',25,15);remember(st,'june','Kept the names available for the people they belong to.',10);
   reward=145;text='You seal the incriminating records in Ruiz’s analog archive. The evidence can still expose the Initiative, but nobody gets to spend a resident’s identity as a bargaining chip.';
  }else{
   flag(st,'attendance_exposed');addEvidence(st,'attendance');s.heat=Math.max(s.heat,1);remember(st,'june','Exposed the hearing’s manufactured attendance.',25,15);remember(st,'bishop','Turned Vale’s public room into a public problem.',-5,15,10);
   reward=160;text='You publish the manufactured attendance list with the duplicate records. The hearing collapses into questions Vale cannot answer. The city will call it disruption; the tenants call it proof.';
  }
  flag(st,'chapter_three_complete');text+=' By morning, one apartment’s tenant list will be blank. Someone has already been removed from the paperwork.';
 }
 st.choices[String(stage)]=choice;st.stage++;s.cash+=reward;record(st,CHAPTER_THREE[stage-14].title,text);
 return{ok:true,text,cash:reward,xp};
}

export function chapterThreePanel(host:Session){
 const st=storyState(host.s),stage=st.stage;
 if(stage<14||stage>18)return;
 const node=CHAPTER_THREE[stage-14];
 const permitCost=st.side.merchant===2?0:st.flags.includes('merchant_backed')?20:40;
 const scripts:Record<number,{text:string;choices:{id:string;label:string;disabled?:boolean}[]}>={
  14:{text:'Director Vale’s Saint Mercer Initiative hearing is open to the public. The room is full, but the sign-in sheet looks more organized than the crowd. You can put your name on the record or study who else was written into it.',choices:[{id:'testify',label:'Testify for the tenants. Put your name on the record.'},{id:'observe',label:'Observe the attendance sheet and listen for the script.'}]},
  15:{text:'Nia’s BLOCK 09 storefront is marked UNLICENSED. The Initiative offers a better location if it can claim her back room. Malik says the neighborhood can help, but only if somebody makes the cost visible.',choices:[{id:'back',label:'Back Nia and keep her pop-up supplied.'},{id:'document',label:'Document the permit’s hidden conditions.'}]},
  16:{text:'Vale asks you to meet privately after the hearing. She offers access, money, and a title that would make every later conversation easier. It would also put your signature inside the Initiative.',choices:[{id:'accept',label:'Accept the liaison badge and its obligations.'},{id:'infiltrate',label:'Take the access. Keep your own agenda.'},{id:'refuse',label:'Refuse the badge and stay independent.'}]},
  17:{text:'The licensing archive is open for one hour. Names duplicate across properties, then vanish from the next page. You can compare the pattern or warn residents before the file changes again.',choices:[{id:'compare',label:'Compare the duplicate records and preserve the pattern.'},{id:'warn',label:'Warn the residents before copying every name.'}]},
  18:{text:'Nia’s permit has a price the public hearing never mentioned. '+(st.side.merchant===2?'Your repairs give her a clean storefront.':st.flags.includes('merchant_backed')?'The neighborhood can cover part of the fee.':'The full hidden fee comes out of your pocket.')+' Choose what this chapter leaves behind.',choices:[{id:'save',label:permitCost?'Save Nia’s storefront · $'+permitCost:'Save Nia’s storefront · merchant favor',disabled:host.s.cash<permitCost},{id:'preserve',label:'Preserve the incriminating records.'},{id:'expose',label:'Expose the manufactured attendance. Raise the Heat.'}]}
 };
 const spec=scripts[stage];
 host.open({title:node.title,eyebrow:'CHAPTER 3 · MOVE '+(stage-13)+' / 5',text:spec.text,actions:spec.choices.map(c=>({label:c.label,disabled:c.disabled,run:()=>{const result=chapterThreeChoice(host.s,stage,c.id);if(!result.ok)return;host.xp(stage===18?'Street Rep':'Hustling',stage===18?100:25);void host.save(false);host.open({title:stage===18?'CHAPTER 3 COMPLETE':node.title,eyebrow:'THE SAINT MERCER INITIATIVE',text:result.text,actions:[{label:'Continue',run:()=>host.close()}]})}}))});
}

export function chapterThreeActions(host:Session,place:string):Action[]{
 const st=storyState(host.s),actions:Action[]=[];
 if(st.stage<14||st.stage>18)return actions;
 if(place==='clothes'){
  if(!st.side.merchant)actions.push({label:'SIDE QUEST · Open sign, closed file',run:()=>{if(st.side.merchant)return;st.side.merchant=1;record(st,'Open sign, closed file','Nia needs one salvaged part to repair the storefront the Initiative marked for removal.');host.notify('Nia needs one salvaged part','Bring it back to BLOCK 09.');void host.save(false);host.location(place)}});
  if(st.side.merchant===1)actions.push({label:'Repair Nia’s storefront · 1 salvaged part',disabled:!host.s.inventory.some(i=>i.id==='scrap'),run:()=>{if(st.side.merchant!==1||!removeItem(host.s,'scrap'))return;st.side.merchant=2;flag(st,'merchant_reopened');host.s.cash+=25;host.xp('Hustling',30);record(st,'Open sign, closed file','Nia’s storefront opens under its own name. The Initiative cannot call an empty shop a failed business.');host.notify('NIA’S SHOP IS OPEN','+$25 · Her storefront stays independent.','success');void host.save(false);host.location(place)}});
 }
 if(place==='bank'&&!st.side.records)actions.push({label:'SIDE QUEST · Paper names',run:()=>{if(st.side.records)return;st.side.records=1;record(st,'Paper names','Start comparing the duplicate employee records before the Initiative edits them again.');host.notify('Ask Ruiz to compare the paper trail','Meet him at Ruiz Auto.');void host.save(false);host.location(place)}});
 if(place==='garage'&&st.side.records===1)actions.push({label:'Compare records with Ruiz',run:()=>{if(st.side.records!==1)return;st.side.records=2;flag(st,'independent_records');addEvidence(st,'citizen_files');remember(st,'ruiz','Built an independent copy of the duplicate employee records.',20,15);host.xp('Hustling',35);record(st,'Paper names','Ruiz’s paper copy proves the duplicate records existed before the hearing.');host.notify('PAPER TRAIL PRESERVED','Ruiz has an independent copy.','success');void host.save(false);host.location(place)}});
 if(place==='meeting'&&!st.side.tenantline)actions.push({label:'SIDE QUEST · Build the tenant line',run:()=>{if(st.side.tenantline)return;st.side.tenantline=1;record(st,'Build the tenant line','Set up an independent tenant contact list before the Initiative can rewrite the noticeboard.');host.notify('Build the tenant line','Print the emergency contact list at home.');void host.save(false);host.location(place)}});
 if(place==='home'&&st.side.tenantline===1)actions.push({label:'Print the independent tenant list',run:()=>{if(st.side.tenantline!==1)return;st.side.tenantline=2;flag(st,'tenant_network');remember(st,'june','Built a tenant line the Initiative does not control.',20,10);host.xp('Street Rep',35);record(st,'Build the tenant line','The tenants now have an independent contact list. The noticeboard is no longer the only way to find one another.');host.notify('TENANT LINE ACTIVE','Independent contacts are in circulation.','success');void host.save(false);host.location(place)}});
 return actions;
}
