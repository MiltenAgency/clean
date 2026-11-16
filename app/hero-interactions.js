'use client';
import {useEffect,useRef} from 'react';

// Keep a bounded phase while allowing an unlimited number of turns either way.
const wrapPhase=(value,cycle)=>cycle>0?((value+cycle/2)%cycle+cycle)%cycle-cycle/2:0;

export function useHeroGallery(){
  const ref=useRef(null);
  useEffect(()=>{
    const gallery=ref.current;
    if(!gallery)return;
    const columns=Array.from(gallery.querySelectorAll('.call-column'));
    const motion=matchMedia('(prefers-reduced-motion: reduce)');
    const positions=columns.map((_,i)=>i===0?0:-620);
    const velocities=columns.map(()=>0),cycles=columns.map(()=>0);
    const directions=columns.map((_,i)=>i===0?-1:1);
    let frame=0,lastTime=0,hovered=false,focused=false,focusColumn=-1,drag=null,coasting=false,disposed=false;
    const paint=()=>columns.forEach((column,i)=>{
      const phase=focused&&focusColumn===i?positions[i]:wrapPhase(positions[i],cycles[i]);
      column.style.setProperty('--gallery-y',`${phase-cycles[i]}px`);
    });
    const normalize=()=>positions.forEach((position,i)=>positions[i]=wrapPhase(position,cycles[i]));
    const paused=()=>hovered||focused||motion.matches||document.hidden;
    const schedule=()=>{if(!frame&&!disposed&&!document.hidden)frame=requestAnimationFrame(tick)};
    function tick(time){
      frame=0;
      const elapsed=lastTime?Math.min((time-lastTime)/1000,.04):1/60;
      lastTime=time;
      let following=false;
      if(drag){
        const delta=drag.y-drag.startY,blend=motion.matches?1:1-Math.exp(-26*elapsed);
        columns.forEach((_,i)=>{
          const target=drag.positions[i]+delta,previous=positions[i];
          positions[i]+=(target-previous)*blend;
          const speed=(positions[i]-previous)/elapsed;
          velocities[i]=motion.matches?0:velocities[i]*.45+Math.max(-1800,Math.min(1800,speed))*.55;
          if(Math.abs(target-positions[i])>.05)following=true;
        });
      }else if(!motion.matches&&!focused){
        const blend=1-Math.exp(-(coasting?6:7)*elapsed);
        columns.forEach((_,i)=>{
          const target=paused()?0:directions[i]*16;
          velocities[i]+=(target-velocities[i])*blend;
          positions[i]+=velocities[i]*elapsed;
        });
        if(coasting&&velocities.every((v,i)=>Math.abs(v-(paused()?0:directions[i]*16))<.5)){
          coasting=false;if(paused())velocities.fill(0);
        }
      }
      paint();
      if(drag?following:(!paused()||coasting))schedule();
    }
    const resume=()=>{lastTime=0;schedule()};
    const stopMomentum=()=>{coasting=false;velocities.fill(0)};
    const measure=()=>{
      columns.forEach((column,i)=>{
        const groups=column.querySelectorAll('.gallery-sequence');
        if(groups.length<2)return;
        // Fractional geometry includes the seam gap without rounding to whole pixels.
        const cycle=groups[1].getBoundingClientRect().top-groups[0].getBoundingClientRect().top;
        if(cycle<=0)return;
        const previous=cycles[i];cycles[i]=cycle;
        if(previous>0){positions[i]=positions[i]/previous*cycle;velocities[i]=velocities[i]/previous*cycle}
        positions[i]=wrapPhase(positions[i],cycle);
      });
      if(drag){drag.positions=[...positions];drag.startY=drag.y}
      paint();
    };
    const enter=event=>{if(event.pointerType!=='touch'){hovered=true;if(!drag)stopMomentum()}};
    const leave=()=>{hovered=false;resume()};
    const focus=event=>{
      focused=event.target.matches(':focus-visible');focusColumn=-1;
      if(!focused){resume();return}
      stopMomentum();
      const i=columns.indexOf(event.target.closest('.call-column')),card=event.target.closest('.call-card');
      if(i<0||!card)return;
      focusColumn=i;
      const hero=gallery.closest('.hero'),area=hero.getBoundingClientRect(),wall=gallery.getBoundingClientRect(),box=card.getBoundingClientRect();
      const header=hero.querySelector('.site-header');
      const headerEdge=header&&!header.classList.contains('is-hidden')?header.getBoundingClientRect().bottom:0;
      const top=Math.max(area.top,wall.top,headerEdge)+16,bottom=Math.min(area.bottom,wall.bottom)-16;
      if(box.top<top)positions[i]+=top-box.top;
      else if(box.bottom>bottom)positions[i]+=bottom-box.bottom;
      paint();
    };
    const blur=event=>{if(!gallery.contains(event.relatedTarget)){focused=false;focusColumn=-1;normalize();paint();resume()}};
    const down=event=>{
      if(event.button!==0||event.isPrimary===false||event.target.closest('button,a,input,select,textarea'))return;
      event.preventDefault();measure();stopMomentum();
      drag={id:event.pointerId,startY:event.clientY,y:event.clientY,positions:[...positions],direction:0,lastMove:performance.now()};
      gallery.setPointerCapture(event.pointerId);gallery.classList.add('is-dragging');lastTime=0;
    };
    const move=event=>{
      if(drag?.id!==event.pointerId)return;
      const delta=event.clientY-drag.y;
      if(delta)drag.direction=Math.sign(delta);
      drag.y=event.clientY;drag.lastMove=performance.now();schedule();
    };
    const finish=event=>{
      if(drag?.id!==event.pointerId)return;
      const released=drag,up=event.type==='pointerup';
      if(up)released.y=event.clientY;
      const delta=released.y-released.startY;
      columns.forEach((_,i)=>{
        const remaining=released.positions[i]+delta-positions[i];
        if(motion.matches){positions[i]+=remaining;velocities[i]=0}
        else if(up){
          const recent=performance.now()-released.lastMove<100;
          velocities[i]=Math.max(-1800,Math.min(1800,(recent?velocities[i]:0)+remaining*12));
        }else velocities[i]=0;
        if(up&&released.direction)directions[i]=released.direction;
      });
      coasting=up&&!motion.matches&&!focused;if(!coasting)velocities.fill(0);drag=null;normalize();paint();gallery.classList.remove('is-dragging');
      if(gallery.hasPointerCapture(event.pointerId))gallery.releasePointerCapture(event.pointerId);
      resume();
    };
    const key=event=>{
      if(event.target!==gallery||!['ArrowUp','ArrowDown','PageUp','PageDown','Home'].includes(event.key))return;
      event.preventDefault();stopMomentum();
      columns.forEach((_,i)=>{
        const step=event.key.startsWith('Page')?gallery.clientHeight*.75:64;
        const delta=['ArrowDown','PageDown'].includes(event.key)?-step:step;
        positions[i]=event.key==='Home'?0:wrapPhase(positions[i]+delta,cycles[i]);
      });paint();
    };
    const reset=()=>{stopMomentum();resume()};
    const observer=new ResizeObserver(measure);
    observer.observe(gallery);columns.forEach(column=>{observer.observe(column);column.querySelectorAll('.gallery-sequence').forEach(group=>observer.observe(group))});
    const events={pointerenter:enter,pointerleave:leave,pointerdown:down,pointermove:move,pointerup:finish,pointercancel:finish,lostpointercapture:finish,focusin:focus,focusout:blur,keydown:key};
    Object.entries(events).forEach(([name,handler])=>gallery.addEventListener(name,handler));
    motion.addEventListener('change',reset);document.addEventListener('visibilitychange',reset);
    measure();resume();
    return()=>{
      disposed=true;cancelAnimationFrame(frame);observer.disconnect();
      Object.entries(events).forEach(([name,handler])=>gallery.removeEventListener(name,handler));
      motion.removeEventListener('change',reset);document.removeEventListener('visibilitychange',reset);
    };
  },[]);
  return ref;
}

export function useHeroScatter(){
  const ref=useRef(null);
  useEffect(()=>{
    const root=ref.current;
    if(!root)return;
    const glyphs=Array.from(root.querySelectorAll('.hero-glyph'));
    const motion=matchMedia('(prefers-reduced-motion: reduce)');
    let frame=0,pointer=null;
    const reset=()=>{
      pointer=null;cancelAnimationFrame(frame);frame=0;
      glyphs.forEach(glyph=>{glyph.style.removeProperty('--scatter-x');glyph.style.removeProperty('--scatter-y');glyph.style.removeProperty('--scatter-rotation')});
    };
    const paint=()=>{
      frame=0;if(!pointer||motion.matches)return;
      // Measure the stationary outer letters, so displaced glyphs never chase themselves.
      const boxes=glyphs.map(glyph=>glyph.parentElement.getBoundingClientRect());
      glyphs.forEach((glyph,i)=>{
        const box=boxes[i],dx=box.left+box.width/2-pointer.x,dy=box.top+box.height/2-pointer.y;
        const distance=Math.hypot(dx,dy),radius=Math.max(120,box.height*1.8);
        const strength=glyph.parentElement.classList.contains('hero-word')?.35:1;
        const force=Math.pow(Math.max(0,1-distance/radius),2)*strength;
        const angle=distance>1?Math.atan2(dy,dx):i*2.4;
        glyph.style.setProperty('--scatter-x',`${(Math.cos(angle)*48+Math.sin(i*2.4)*16)*force}px`);
        glyph.style.setProperty('--scatter-y',`${(Math.sin(angle)*64+Math.cos(i*1.7)*24)*force}px`);
        glyph.style.setProperty('--scatter-rotation',`${Math.sin(i*1.9+angle)*28*force}deg`);
      });
    };
    const move=event=>{
      if(motion.matches||event.pointerType==='touch')return;
      pointer={x:event.clientX,y:event.clientY};if(!frame)frame=requestAnimationFrame(paint);
    };
    root.addEventListener('pointermove',move,{passive:true});root.addEventListener('pointerleave',reset);root.addEventListener('pointercancel',reset);
    motion.addEventListener('change',reset);
    return()=>{reset();root.removeEventListener('pointermove',move);root.removeEventListener('pointerleave',reset);root.removeEventListener('pointercancel',reset);motion.removeEventListener('change',reset)};
  },[]);
  return ref;
}
