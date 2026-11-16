'use client';
import {useEffect,useRef,useState} from 'react';

const clamp=value=>Math.max(0,Math.min(1,value));
const ease=value=>{const p=clamp((value-.12)/.8);return p*p*(3-2*p)};
export function benefitCardPose(progress,index,count,height){
 const step=clamp(progress)*Math.max(0,count-1);
 const entered=index===0?1:ease(step-index+1);
 const covered=ease(step-index);
 return {y:(1-entered)*(height+96)+covered*40,scale:1-covered*.12,rotation:(index%2===0?-1:1)*covered*4,opacity:1-covered*.45};
}
const pictures=[
 ['floor-care','A person mopping the floor of a bright kitchen','50% 35%'],
 ['kitchen-clean','A cleaner wearing yellow gloves wiping a kitchen counter','50% 50%'],
 ['detail-clean','Gloved hands cleaning a kitchen surface','50% 45%'],
 ['surface-care','A person using a cloth to clean a kitchen countertop','65% 50%']
];
const themes=['yellow','cyan','blue','indigo'];
const pad=value=>String(value).padStart(2,'0');

export default function BenefitsStack({benefits}){
 const root=useRef(null),navigate=useRef(null);
 const [active,setActive]=useState(0),[reduced,setReduced]=useState(false);
 useEffect(()=>{
  const section=root.current,stage=section.querySelector('.benefits-stack-pin'),frameEl=section.querySelector('.benefits-frame');
  const cards=Array.from(section.querySelectorAll('.benefits-stack-card'));
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  let frame=0,lastTime=0,current=0,target=0,dirty=true,disposed=false,activeIndex=-1,cardHeight=0;
  const activate=index=>{if(index!==activeIndex){activeIndex=index;setActive(index)}};
  const readProgress=()=>{
   const range=section.offsetHeight-stage.offsetHeight;
   return range>0?clamp(-section.getBoundingClientRect().top/range):0;
  };
  const paint=()=>{
   if(motion.matches){
    let closest=0,distance=Infinity;
    cards.forEach((card,i)=>{
     card.style.transform='none';card.style.opacity='1';
     const box=card.getBoundingClientRect(),d=Math.abs(box.top+box.height/2-window.innerHeight/2);
     if(d<distance){distance=d;closest=i}
    });
    activate(closest);return;
   }
   cards.forEach((card,i)=>{
    const pose=benefitCardPose(current,i,cards.length,cardHeight);
    card.style.transform=`translate3d(0,${pose.y.toFixed(3)}px,0) rotate(${pose.rotation.toFixed(3)}deg) scale(${pose.scale.toFixed(4)})`;
    card.style.opacity=String(pose.opacity);
   });
   activate(Math.min(cards.length-1,Math.floor(current*(cards.length-1)+.5)));
  };
  const schedule=()=>{if(!frame&&!disposed)frame=requestAnimationFrame(tick)};
  function tick(time){
   frame=0;
   if(dirty){cardHeight=frameEl.clientHeight;target=readProgress();dirty=false}
   const elapsed=lastTime?Math.min((time-lastTime)/1000,.05):1/60;lastTime=time;
   current=motion.matches?target:current+(target-current)*(1-Math.exp(-20*elapsed));
   if(Math.abs(target-current)<.0001)current=target;
   paint();
   if(!motion.matches&&current!==target)schedule();else lastTime=0;
  }
  const update=()=>{dirty=true;schedule()};
  const syncMotion=()=>{setReduced(motion.matches);update()};
  navigate.current=index=>{
   const chosen=Math.max(0,Math.min(cards.length-1,index));
   if(motion.matches){cards[chosen].scrollIntoView({behavior:'auto',block:'center'});activate(chosen);return}
   const start=window.scrollY+section.getBoundingClientRect().top;
   const range=section.offsetHeight-stage.offsetHeight;
   window.scrollTo({top:start+chosen/Math.max(1,cards.length-1)*range,behavior:'smooth'});
  };
  const observer=new ResizeObserver(update);
  observer.observe(section);observer.observe(stage);observer.observe(frameEl);
  window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);motion.addEventListener('change',syncMotion);
  setReduced(motion.matches);cardHeight=frameEl.clientHeight;current=target=readProgress();paint();
  return()=>{disposed=true;cancelAnimationFrame(frame);observer.disconnect();window.removeEventListener('scroll',update);window.removeEventListener('resize',update);motion.removeEventListener('change',syncMotion);navigate.current=null};
 },[benefits.length]);
 const jump=index=>navigate.current?.(index);
 const key=event=>{
  const focused=event.target.closest('[data-card-jump]');
  const base=focused?Number(focused.dataset.cardJump):active;
  let index;
  if(event.key==='ArrowRight')index=Math.min(benefits.length-1,base+1);
  else if(event.key==='ArrowLeft')index=Math.max(0,base-1);
  else if(event.key==='Home')index=0;
  else if(event.key==='End')index=benefits.length-1;
  else return;
  event.preventDefault();root.current.querySelectorAll('[data-card-jump]')[index]?.focus({preventScroll:true});jump(index);
 };
 return <section className="benefit-list benefits-stack" id="benefits" ref={root} aria-labelledby="benefits-stack-title">
  <div className="benefits-stack-pin">
   <div className="benefits-stack-heading"><div><p>Why make time for a clean</p><h2 id="benefits-stack-title">Room to relax</h2></div><span>Scroll through the benefits <span aria-hidden="true">↓</span></span></div>
   <div className="benefits-frame">
    {benefits.map(([,label,copy,title],i)=>{
     const [image,alt,position]=pictures[i%pictures.length];
     return <article className="benefits-stack-card" id={'benefit-'+i} key={title} data-theme={themes[i%themes.length]} style={{'--stack-index':i,zIndex:i+1}} aria-hidden={reduced?undefined:active!==i} aria-labelledby={'benefit-title-'+i}>
      <div className="benefits-stack-text"><span className="benefits-card-label"><span aria-hidden="true">✦</span>{label}</span><h3 id={'benefit-title-'+i}>{title}</h3><p>{copy}</p></div>
      <div className="benefits-stack-photo"><img src={'/assets/cleaning/'+image+'.webp'} alt={alt} style={{objectPosition:position}} loading="lazy" draggable={false}/><span className="benefits-photo-index" aria-hidden="true">{pad(i+1)}</span></div>
     </article>;
    })}
   </div>
   <nav className="benefits-counter" aria-label="Choose a benefit card" onKeyDown={key}>
    <span className="benefits-count" aria-live="polite" aria-atomic="true"><strong>{pad(active+1)}</strong><span>/ {pad(benefits.length)}</span></span>
    <div className="benefits-counter-steps">{benefits.map((benefit,i)=><button key={benefit[3]} type="button" data-card-jump={i} aria-label={'Go to benefit '+(i+1)+': '+benefit[3]} aria-controls={'benefit-'+i} aria-current={active===i?'step':undefined} onClick={()=>jump(i)}><span/></button>)}</div>
   </nav>
  </div>
 </section>;
}
