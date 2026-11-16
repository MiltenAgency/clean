'use client';
import {useEffect,useRef} from 'react';

const clamp=value=>Math.max(0,Math.min(1,value));
export function processReveal(progress,index){
 const value=clamp((progress-(.08+index*.17))/.22);
 return value*value*(3-2*value);
}
function ProcessIcon({name}){return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{name==='home'?<><path d="m3 11 9-8 9 8v9H3Z"/><path d="M9 20v-7h6v7"/></>:name==='sparkle'?<path d="m12 2 2.8 7.2L22 12l-7.2 2.8L12 22l-2.8-7.2L2 12l7.2-2.8Z"/>:<><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 7h6m-6 5h6m-6 5h4"/></>}</svg>}
const cards=[
 {title:'Your space',copy:'Tell us what you need.',icon:'home'},
 {title:'Our care',copy:'Your personal checklist.',icon:'document'},
 {title:'3 simple steps',copy:'Tell us. Plan it. Enjoy.',icon:'document'},
 {title:'Room by room.',copy:'Care in every detail.',icon:'sparkle'}
];

export default function ProcessShowcase({onExplore}){
 const ref=useRef(null);
 useEffect(()=>{
  const section=ref.current,stage=section.querySelector('.process-pin'),image=section.querySelector('.process-main');
  const panels=Array.from(section.querySelectorAll('.process-bar'));
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  let frame=0,lastTime=0,current=0,target=0,dirty=true,disposed=false,geometry=null;
  const measure=()=>{
   geometry={width:stage.clientWidth,height:stage.clientHeight,imageWidth:image.offsetWidth,anchor:image.offsetTop,bars:panels.map(panel=>({width:panel.offsetWidth,height:panel.offsetHeight}))};
  };
  const readProgress=()=>{
   const range=section.offsetHeight-stage.offsetHeight;
   return motion.matches?1:range>0?clamp(-section.getBoundingClientRect().top/range):0;
  };
  const paint=()=>{
   const compact=geometry.width<=900;
   panels.forEach((panel,i)=>{
    const amount=processReveal(current,i),size=geometry.bars[i],side=i%2===0?-1:1;
    let x,y;
    if(compact){
     x=side*(geometry.width-32)/4;
     y=geometry.height*(i<2?.72:.86)-geometry.anchor;
    }else{
     x=side*Math.min((geometry.imageWidth+size.width)/2+24,geometry.width/2-size.width/2-32);
     y=geometry.height*[-.17,-.12,.17,.22][i];
    }
    panel.style.transform=`translate(-50%,-50%) translate3d(${(x*amount).toFixed(3)}px,${(y*amount).toFixed(3)}px,0) rotate(${(side*5*(1-amount)).toFixed(3)}deg) scale(${(.8+.2*amount).toFixed(4)})`;
    panel.style.opacity=String(Math.min(1,amount*4));
   });
  };
  const schedule=()=>{if(!frame&&!disposed)frame=requestAnimationFrame(tick)};
  function tick(time){
   frame=0;
   if(dirty){measure();target=readProgress();dirty=false}
   const elapsed=lastTime?Math.min((time-lastTime)/1000,.05):1/60;lastTime=time;
   current=motion.matches?1:current+(target-current)*(1-Math.exp(-22*elapsed));
   if(Math.abs(target-current)<.0001)current=target;
   paint();
   if(current!==target)schedule();else lastTime=0;
  }
  const update=()=>{dirty=true;schedule()};
  const resize=new ResizeObserver(update);
  resize.observe(section);resize.observe(stage);resize.observe(image);panels.forEach(panel=>resize.observe(panel));
  window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);motion.addEventListener('change',update);
  measure();current=target=readProgress();paint();
  return()=>{disposed=true;cancelAnimationFrame(frame);resize.disconnect();window.removeEventListener('scroll',update);window.removeEventListener('resize',update);motion.removeEventListener('change',update)};
 },[]);
 return <section className="smart process-scene" id="process" ref={ref} aria-labelledby="process-title">
  <h2 className="process-sr-only" id="process-title">A simple path to a cleaner space</h2>
  <div className="process-pin">
   {cards.map((card,i)=><article className="process-bar" key={card.title} data-process-card={i}>
    <span className="process-bar-icon"><ProcessIcon name={card.icon}/></span>
    <div><h3>{card.title}</h3><p>{card.copy}</p>{i===2&&<div className="process-mini-photos" aria-hidden="true">{['kitchen-clean','floor-care','detail-clean'].map(name=><img key={name} src={'/assets/cleaning/'+name+'.webp'} alt="" loading="lazy"/>)}</div>}</div>
   </article>)}
   <button className="process-main" onClick={onExplore} aria-label="Explore your cleaning plan"><img src="/assets/cleaning/cleaning-preview.svg" alt="A kitchen cleaning preview with a home cleaning checklist"/></button>
  </div>
 </section>;
}
