'use client';
import {useEffect,useRef,useState} from 'react';
export function useReveal(){useEffect(()=>{const o=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('shown');o.unobserve(e.target)}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(e=>o.observe(e));return()=>o.disconnect()},[])}
export function Dialog({title,onClose,children}){
  const ref=useRef(null),closeRef=useRef(onClose);
  closeRef.current=onClose;
  const[done,setDone]=useState(false),[request,setRequest]=useState(null);
  useEffect(()=>{
    const before=document.activeElement,prior=document.body.style.overflow;
    ref.current?.showModal();document.body.style.overflow='hidden';
    const onKey=e=>{if(e.key==='Escape'){e.preventDefault();closeRef.current()}};
    document.addEventListener('keydown',onKey);
    return()=>{document.body.style.overflow=prior;document.removeEventListener('keydown',onKey);before?.focus()};
  },[]);
  return <dialog ref={ref} className="dialog" aria-labelledby="dialog-title" onClick={e=>{if(e.target===ref.current)onClose()}}>
    <button className="dialog-close" aria-label="Close dialog" onClick={onClose}>×</button><h2 id="dialog-title">{title}</h2>
    {children||(done?<div role="status"><p>Your cleaning request is ready to review.</p><dl className="quote-review"><dt>Service</dt><dd>{request.service}</dd><dt>Location</dt><dd>{request.location}</dd><dt>Your priorities</dt><dd>{request.message}</dd></dl><p>This is a local preview. No enquiry was sent and no visit is booked.</p><button className="primary" onClick={onClose}>Back to the website ↗</button></div>:<form onSubmit={e=>{e.preventDefault();setRequest(Object.fromEntries(new FormData(e.currentTarget)));setDone(true)}}>
      <label>Your name<input name="name" required autoComplete="name" maxLength={100}/></label>
      <label>Email address<input type="email" name="email" required autoComplete="email" maxLength={254}/></label>
      <label>Type of cleaning<select name="service" required defaultValue=""><option value="" disabled>Choose a service</option><option>Home cleaning</option><option>Deep cleaning</option><option>Office cleaning</option><option>Moving clean</option><option>Regular cleaning</option></select></label>
      <label>City or area<input name="location" required autoComplete="address-level2" maxLength={150}/></label>
      <label>Tell us about your space<textarea name="message" rows="3" placeholder="Property size, rooms, preferred timing, and any extra tasks" required maxLength={2000}/></label>
      <button className="primary">Preview my quote request ↗</button><small>Website concept. This form prepares a local preview and does not send a request.</small>
    </form>)}
  </dialog>;
}
