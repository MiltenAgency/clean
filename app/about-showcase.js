'use client';
import {useEffect,useRef,useState} from 'react';

const slides=[
 {image:'floor-care',title:'Everyday home care',label:'The everyday refresh',copy:'Floors, surfaces, and the rooms you live in. A little care makes room for a lighter day.',alt:'A person mopping the floor of a bright kitchen',position:'50% 42%'},
 {image:'detail-clean',title:'Care in the details',label:'A deeper kind of clean',copy:'The corners, edges, and easy to miss places. Extra attention where your space needs it.',alt:'Gloved hands cleaning a kitchen surface',position:'50% 50%'},
 {image:'kitchen-clean',title:'A fresh start at home',label:'Your priorities come first',copy:'A cleaning checklist shaped around your home, your surfaces, and the things that matter to you.',alt:'A cleaner wearing yellow gloves wiping a kitchen counter',position:'50% 50%'}
];
function Arrow({back=false}){return <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={back?'m14 6-6 6 6 6':'m10 6 6 6-6 6'}/></svg>}
function Words({children,start=0}){return children.split(' ').map((word,i)=><span className="about-word" style={{'--word-delay':`${100+(start+i)*70}ms`}} key={word}>{word}{' '}</span>)}

export default function AboutShowcase(){
 const root=useRef(null);
 const [current,setCurrent]=useState(0),[visible,setVisible]=useState(false),[paused,setPaused]=useState(false),[hovered,setHovered]=useState(false),[focused,setFocused]=useState(false),[reduced,setReduced]=useState(false);
 const running=visible&&!paused&&!hovered&&!focused&&!reduced;
 useEffect(()=>{
  const motion=matchMedia('(prefers-reduced-motion: reduce)'),sync=()=>setReduced(motion.matches);
  sync();motion.addEventListener('change',sync);
  const observer=new IntersectionObserver(entries=>setVisible(entries[0].isIntersecting),{threshold:.2});
  observer.observe(root.current);
  return()=>{motion.removeEventListener('change',sync);observer.disconnect()};
 },[]);
 useEffect(()=>{
  if(!running)return;
  const timer=setTimeout(()=>setCurrent(index=>(index+1)%slides.length),6500);
  return()=>clearTimeout(timer);
 },[running,current]);
 useEffect(()=>{
  const section=root.current;
  let frame=0,pointer=null;
  const reset=()=>{
   pointer=null;cancelAnimationFrame(frame);frame=0;
   ['--deck-x','--deck-y','--deck-rx','--deck-ry'].forEach(name=>section.style.removeProperty(name));
  };
  const paint=()=>{
   frame=0;if(!pointer)return;
   const box=section.getBoundingClientRect();
   const x=Math.max(-1,Math.min(1,(pointer.x-box.left)/box.width*2-1));
   const y=Math.max(-1,Math.min(1,(pointer.y-box.top)/box.height*2-1));
   section.style.setProperty('--deck-x',`${x*12}px`);section.style.setProperty('--deck-y',`${y*8}px`);
   section.style.setProperty('--deck-rx',`${-y*5}deg`);section.style.setProperty('--deck-ry',`${x*7}deg`);
  };
  const move=event=>{
   if(paused||reduced||event.pointerType==='touch')return;
   pointer={x:event.clientX,y:event.clientY};if(!frame)frame=requestAnimationFrame(paint);
  };
  section.addEventListener('pointermove',move,{passive:true});section.addEventListener('pointerleave',reset);reset();
  return()=>{reset();section.removeEventListener('pointermove',move);section.removeEventListener('pointerleave',reset)};
 },[paused,reduced]);
 const select=index=>{setPaused(true);setCurrent((index+slides.length)%slides.length)};
 const slide=slides[current];
 return <section className="manifesto about-showcase reveal" id="about" ref={root} aria-labelledby="about-title" aria-roledescription="carousel" data-motion={running?'playing':'paused'} onPointerLeave={()=>setHovered(false)} onFocusCapture={event=>setFocused(event.target.matches(':focus-visible'))} onBlurCapture={event=>{if(!event.currentTarget.contains(event.relatedTarget))setFocused(false)}} onKeyDown={event=>{if(event.key==='ArrowRight'){event.preventDefault();select(current+1)}else if(event.key==='ArrowLeft'){event.preventDefault();select(current-1)}}}>
  <div className="about-topline">
   <div className="about-detail"><span className="about-detail-index" aria-hidden="true">0{current+1}</span><div><h3>{slide.label}</h3><p>{slide.copy}</p></div></div>
  </div>
  <h2 className="about-display" id="about-title" aria-label="Thoughtful cleaning. Care in every corner.">
   <span className="about-display-row" aria-hidden="true"><span className="about-muted"><Words>Thoughtful</Words></span><span><Words start={1}>cleaning.</Words></span></span>
   <span className="about-display-row" aria-hidden="true"><span><Words start={2}>Care in</Words></span><span className="about-muted"><Words start={4}>every corner.</Words></span></span>
  </h2>
  <div className="about-deck" onPointerEnter={event=>{if(event.pointerType!=='touch')setHovered(true)}} onPointerLeave={()=>setHovered(false)}><div className="about-parallax"><div className="about-stack">
   {slides.map((item,i)=>{const slot=(i-current+slides.length)%slides.length;return <figure className="about-photo" data-slot={slot} key={item.image} aria-hidden={slot!==0?true:undefined}>
    <img src={'/assets/cleaning/'+item.image+'.webp'} alt={slot===0?item.alt:''} style={{objectPosition:item.position}} loading="lazy" draggable={false}/>
    <figcaption><strong>{item.title}</strong><span>Clear &amp; Gleam · Home care</span></figcaption>
   </figure>})}
  </div></div></div>
  <p className="about-note">Less time on chores.<br/>More room for living.</p>
  <div className="about-controls" onPointerEnter={event=>{if(event.pointerType!=='touch')setHovered(true)}} onPointerLeave={()=>setHovered(false)} role="group" aria-label="Cleaning photo controls">
   <button className="about-arrow about-previous" aria-label="Previous cleaning photo" onClick={()=>select(current-1)}><Arrow back/></button>
   <button className="about-arrow about-next" aria-label="Next cleaning photo" onClick={()=>select(current+1)}><Arrow/></button>
  </div>
  <a className="about-services-link" href="#services">Explore our services <span aria-hidden="true">↗</span></a>
  <p className="about-carousel-status" aria-live={running?'off':'polite'} aria-atomic="true">{current+1} of {slides.length}: {slide.title}</p>
 </section>;
}
