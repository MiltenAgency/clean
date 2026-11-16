'use client';
import {useEffect,useState} from 'react';
import {Dialog,useReveal} from './ui';
import {useHeroGallery,useHeroScatter} from './hero-interactions';
import AboutShowcase from './about-showcase';
import ProcessShowcase from './process-showcase';
import BenefitsStack from './benefits-stack';
import SiteFooter from './site-footer';

function Icon({name='arrow',size=22,...props}){const paths={arrow:<path d="M6 18 18 6M6 6h12v12"/>,home:<><path d="m3 11 9-8 9 8v9H3Z"/><path d="M9 20v-7h6v7"/></>,heart:<><path d="M12 12s-7-4-7-7c0-4 6-4 7 0 1-4 7-4 7 0 0 3-7 7-7 7Z"/><path d="m3 15 5 5h9l4-6c-2-1-3 1-4 2H9l-4-3-2 2Z"/></>,headset:<><path d="M4 13v-2a8 8 0 0 1 16 0v2M4 11H2v7h5v-7H4Zm16 0h2v7h-5v-7h3ZM20 18v3h-8"/></>,chat:<><rect x="3" y="3" width="18" height="7" rx="2"/><path d="M6 14h15v7H3v-4M6 6h12m-9 11h9"/></>,mic:<><rect x="9" y="2" width="6" height="13" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3m-4 0h8"/></>,users:<><circle cx="9" cy="7" r="3"/><path d="M2 21v-3a7 7 0 0 1 14 0v3M17 4a3 3 0 0 1 0 6m1 4a6 6 0 0 1 4 6"/></>,face:<><path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/><circle cx="12" cy="10" r="3"/><path d="M7 18a5 5 0 0 1 10 0"/></>,star:<path d="m12 2 3 6 7 1-5 5 1 8-6-4-6 4 1-8-5-5 7-1Z"/>,cube:<><path d="m12 2 9 5v10l-9 5-9-5V7Zm0 10v10M3 7l9 5 9-5M8 4l9 5"/></>,diamond:<><path d="m3 8 4-5h10l4 5-9 14L3 8Zm0 0h18M7 3l5 19 5-19"/></>,globe:<><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/></>,document:<><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 7h6m-6 5h6m-6 5h4"/></>,trend:<><path d="m3 17 6-6 4 4 8-10m-6 0h6v6"/></>,cart:<><path d="M2 3h3l3 13h11l3-10H6"/><circle cx="9" cy="21" r="1"/><circle cx="18" cy="21" r="1"/></>,plus:<><circle cx="12" cy="12" r="9"/><path d="M6 12h12m-6-6v12"/></>};return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]||paths.chat}</svg>}
function Brand(){return <span className="brand" role="img" aria-label="Clear & Gleam"><img src="/assets/cleaning/clear-and-gleam-logo.webp" width="384" height="384" alt="" aria-hidden="true"/></span>}
function Action({children,onClick,href,light=false}){const content=<>{children}<span><Icon size={20}/></span></>;return href?<a className={light?'action light':'action'} href={href}>{content}</a>:<button className={light?'action light':'action'} onClick={onClick}>{content}</button>}
function Heading({label,title,action,onClick}){return <div className="section-heading"><span className="eyebrow"><Icon name="document" size={14}/>{label}</span><h2>{title}</h2>{action&&<button onClick={onClick}>{action}<Icon size={16}/></button>}</div>}
const asset=name=>'/assets/cleaning/'+name+(name.startsWith('service-')||name==='cleaning-plan'||name==='cleaning-preview'?'.svg':'.webp');
const photos={
  'kitchen-clean':'A cleaner wearing yellow gloves wiping a kitchen counter',
  'floor-care':'A person mopping the floor of a bright kitchen',
  'detail-clean':'Gloved hands cleaning a kitchen surface',
  'cabinet-clean':'A cleaner wiping shelving in a bright kitchen',
  'surface-care':'A person using a cloth to clean a kitchen countertop'
};
const benefits=[
  ['heart','more room for living','Leave the dusting, wiping, and floors to us. Come home to a space you can enjoy, with more time for the people and plans that matter.','Get your free time back'],
  ['document','your home, your priorities','Tell us which rooms need attention and what matters most. We build the cleaning checklist around your space, surfaces, and preferences.','A clean that feels personal'],
  ['home','care in the details','From kitchen counters to bathroom fittings, a clear room checklist keeps the everyday essentials and the easy to miss details in focus.','Feel the difference in every room'],
  ['chat','a routine that works for you','Choose a one time refresh or ask about regular visits. We discuss the scope, access details, and your preferred schedule before you confirm.','Make room for a simpler week']
];
const services=[
  ['home','Home cleaning','Dusting, surface cleaning, bathrooms, kitchens, and floors for the spaces you use every day.'],
  ['deep','Deep cleaning','A more detailed reset, with extra attention to buildup, edges, and those often overlooked areas.'],
  ['office','Office cleaning','A practical cleaning plan for desks, shared areas, meeting rooms, and workplace washrooms.'],
  ['moving','Moving cleans','A room by room clean for an empty home, with the scope agreed around your moving plans.'],
  ['kitchen','Kitchen care','Worktops, sinks, cabinet fronts, and appliance exteriors, with optional extras discussed in your quote.']
];
const stories=[
  {name:'Everyday home care',role:'Home cleaning · A fresh start for your space',image:'kitchen-clean',quote:'Kitchen counters wiped. Bathrooms refreshed. Floors vacuumed and mopped. A regular clean takes care of the everyday tasks so home feels ready for whatever comes next.'},
  {name:'A deeper refresh',role:'Deep cleaning · Extra attention where it counts',image:'detail-clean',quote:'Give the corners, edges, and accumulated grime a little more attention. We discuss your priorities first, then plan a more detailed clean around the areas that need it.'},
  {name:'Ready for your next chapter',role:'Moving cleans · One less thing on your list',image:'floor-care',quote:'Whether you are settling in or handing back the keys, an empty space is the right moment for a thorough clean. Tell us about the property and we will help define the scope.'}
];
const checklist=['Wipe kitchen counters and clean the sink.','Clean bathroom sinks, fittings, and toilets.','Dust accessible surfaces and furniture.','Vacuum carpets and mop suitable hard floors.','Empty bins and leave shared spaces tidy.'];
const faqs=[
  ['What is included in a home clean?','A typical checklist covers accessible surfaces, kitchen counters and sink, bathrooms, vacuuming, and suitable hard floors. The exact tasks are agreed for your property before a visit.'],
  ['Can I request a one time clean?','Yes. Choose a one time refresh or ask about an ongoing schedule. Mention the size of your space and your priorities when preparing your quote request.'],
  ['How is the price calculated?','The quote depends on the property size, condition, service, frequency, and any extra tasks. There is no fixed price shown because every space needs a different scope.'],
  ['Do I need to be home?','You can discuss access arrangements when confirming a visit. Include any entry instructions and let us know about pets or areas that should be left alone.'],
  ['What about supplies and delicate surfaces?','Mention specialist finishes, product preferences, sensitivities, and any equipment requirements in your enquiry so these can be agreed before cleaning.'],
  ['Does this website confirm a booking?','This is a website concept. The quote form prepares a local request preview; it does not send an enquiry, take payment, or reserve a cleaning visit.']
];
function Tools({onClick}){return <div className="tools">{[['home','home cleaning'],['star','deep cleaning'],['chat','your cleaning priorities']].map(([icon,label])=><button key={icon} aria-label={'Explore '+label} onClick={onClick}><Icon name={icon}/></button>)}</div>}
function HeroHeadline(){
  let letterIndex=0;
  return <h1 aria-label="Less mess. More time. For you.">{['Less mess.','More time.','For you.'].map(line=><span className="hero-line" aria-hidden="true" key={line}>{Array.from(line).map((letter,i)=><span className="hero-letter" style={{'--letter-order':letterIndex++}} key={i}><span className="hero-glyph">{letter===' '? '\u00a0':letter}</span></span>)}</span>)}</h1>;
}
function HeroDescription(){return <p>{['Home and office cleaning that fits your life.','From an everyday refresh to a deeper clean.'].map(line=><span className="hero-description-line" key={line}>{line.split(' ').map((word,i)=><span className="hero-word" key={i}><span className="hero-glyph">{word}</span>{' '}</span>)}</span>)}</p>}
function CleaningCard({image,index,onQuote,onDetails,duplicate=false}){return <article className="call-card" style={{'--card-order':index}}><img src={asset(image)} alt={photos[image]} draggable={false}/><div className="call-controls"><button aria-label="View cleaning services" tabIndex={duplicate?-1:undefined} onClick={onDetails}><Icon name="star" size={16}/></button></div>{index%3===1?<div className="chat-overlay"><p>✓ Kitchen surfaces</p><p>✓ Fresh bathrooms</p><p>✓ Floors and finishing touches</p><button tabIndex={duplicate?-1:undefined} onClick={onDetails}>See the checklist<Icon name="document" size={17}/></button></div>:<button className="call-label" tabIndex={duplicate?-1:undefined} onClick={onQuote}>Make time for a clean<span><Icon size={18}/></span></button>}</article>}
function GalleryColumn({images,second=false,onQuote,onDetails}){return <div className={'call-column'+(second?' second':'')}>{[0,1,2].map(copy=><div className="gallery-sequence" aria-hidden={copy!==1?true:undefined} key={copy}>{images.map((image,i)=><CleaningCard key={i} image={image} index={i+(second?2:0)} duplicate={copy!==1} onQuote={onQuote} onDetails={onDetails}/>)}</div>)}</div>}
export default function Page(){
  useReveal();
  const galleryRef=useHeroGallery(),scatterRef=useHeroScatter();
  const[modal,setModal]=useState(null),[menu,setMenu]=useState(false),[headerHidden,setHeaderHidden]=useState(false),[review,setReview]=useState(0),[paused,setPaused]=useState(false);
useEffect(()=>{if(paused)return;const timer=setInterval(()=>setReview(r=>(r+1)%3),6500);return()=>clearInterval(timer)},[paused]);
useEffect(()=>{
  let lastY=Math.max(0,window.scrollY),frame=0;
  const update=()=>{
    frame=0;
    const y=Math.max(0,window.scrollY);
    if(y<=80){setHeaderHidden(false);lastY=y;return}
    if(Math.abs(y-lastY)>=8){setHeaderHidden(y>lastY);lastY=y}
  };
  const onScroll=()=>{if(!frame)frame=requestAnimationFrame(update)};
  window.addEventListener('scroll',onScroll,{passive:true});
  return()=>{window.removeEventListener('scroll',onScroll);cancelAnimationFrame(frame)};
},[]);
useEffect(()=>{
  if(!menu)return;
  const previous=document.body.style.overflow;
  document.body.style.overflow='hidden';
  const onKey=e=>{if(e.key==='Escape'){setMenu(false);document.querySelector('.menu-toggle')?.focus()}};
  document.addEventListener('keydown',onKey);
  return()=>{document.body.style.overflow=previous;document.removeEventListener('keydown',onKey)};
},[menu]);
  const open=title=>setModal(title);
  const quote=()=>{setMenu(false);open('Get a cleaning quote')};
  const story=stories[review];
  const service=services.find(([,label])=>modal===label);

  const previews={
    'Your cleaning checklist':<div><p>A starting point for a standard home clean. Your final checklist is agreed around your space.</p><ol>{checklist.map(item=><li key={item}>{item}</li>)}</ol><p>Inside appliances, interior windows, and specialist surfaces can be discussed separately.</p><Action onClick={quote}>Get a quote</Action></div>,
    'Your cleaning plan':<div><p>Tell us about your property, choose the type of clean, and highlight the rooms that matter most.</p><ol><li>Share your space and priorities.</li><li>Review the scope and tailored quote.</li><li>Agree your preferred date and access details.</li></ol><Action onClick={quote}>Get a quote</Action></div>,
    'Privacy preview':<div><p>Clear &amp; Gleam is a cleaning service website concept. Form entries stay on this page until you refresh it. No request is sent to a server.</p><p>All cleaning photos are stored locally. The development feedback toolbar can save annotations in your browser when you use it.</p></div>,
    'Demo terms':<div><p>This is a fictional cleaning service website. Photography illustrates cleaning tasks and does not identify employees, customers, or completed company projects.</p><p>The quote form is a local preview. It does not confirm availability, reserve a visit, send a request, or collect payment.</p></div>
  };
  return <>
    <a className="skip" href="#content">Skip to content</a>
    <main className="page" id="content">
      <section className="hero" id="home">
        <header className={headerHidden&&!menu&&!modal?'site-header is-hidden':'site-header'} inert={headerHidden&&!menu&&!modal} onFocusCapture={()=>setHeaderHidden(false)}>
          <a href="#home" aria-label="Clear & Gleam home"><Brand/></a>
          <nav id="main-navigation" aria-label="Main navigation" className={menu?'open':''}>
            {[['Home','home'],['About','about'],['Benefits','benefits'],['Services','services'],['Our process','process'],['FAQs','faqs'],['Plans','plans']].map(([label,id])=><a key={id} href={'#'+id} aria-label={label} onClick={()=>setMenu(false)}>{id==='home'?<Icon name="home" size={17}/>:label}</a>)}
          </nav>
          <button className="try-small" onClick={quote}>Get a quote <span><Icon/></span></button>
          <button className="menu-toggle" aria-label="Toggle navigation" aria-expanded={menu} aria-controls="main-navigation" onClick={()=>setMenu(!menu)}><span/><span/></button>
        </header>
        <div className="hero-copy" ref={scatterRef}><HeroHeadline/><HeroDescription/><div className="actions"><Action onClick={quote}>Get a quote</Action><Action href="#services" light>Our services</Action></div></div>
        <div className="vertical-tools"><Tools onClick={()=>open('Your cleaning checklist')}/><button className="more-tool" aria-label="Explore cleaning services" onClick={()=>document.querySelector('#services')?.scrollIntoView({behavior:'smooth'})}><Icon name="plus" size={18}/></button></div>
        <div className="call-wall" ref={galleryRef} role="region" aria-label="Cleaning photo gallery" aria-describedby="gallery-instructions" tabIndex={0}><span className="gallery-hint" aria-hidden="true">↕ Drag to explore</span><span className="gallery-instructions" id="gallery-instructions">Hover to pause. Drag up or down endlessly through the photos, or use the up and down arrow keys when this gallery is focused.</span><GalleryColumn images={['kitchen-clean','floor-care','cabinet-clean','surface-care','detail-clean','floor-care']} onQuote={quote} onDetails={()=>open('Your cleaning checklist')}/><GalleryColumn images={['detail-clean','surface-care','kitchen-clean','floor-care','cabinet-clean','surface-care']} second onQuote={quote} onDetails={()=>open('Your cleaning checklist')}/></div>
        <div className="hero-foot"><div><span>Home &amp; office</span><span className="gradient-pill">One time or regular</span><span>Your priorities</span></div><button onClick={quote}>Let’s make it shine <Icon size={15}/></button></div>
      </section>
      <AboutShowcase/>
      <ProcessShowcase onExplore={()=>open('Your cleaning plan')}/>
      <BenefitsStack benefits={benefits}/>
      <div className="marquee" aria-label="Refresh, relax, repeat"><div>{[0,1,2].map(i=><span key={i}>REFRESH <b>⟶</b> <strong>RELAX</strong> <b>⟶</b> REPEAT <b>⟶</b> </span>)}</div></div>
      <section className="review-growth reveal"><div><h2>Every room.<br/><mark>A little brighter.</mark></h2><p>A clean kitchen for your next meal. A refreshed bathroom. Floors that feel good underfoot. Our checklist starts with the everyday essentials and leaves room for the details that matter to you.</p><Tools onClick={()=>open('Your cleaning checklist')}/></div><div className="review-visual"><div className="review-phone"><img src={asset('cabinet-clean')} alt={photos['cabinet-clean']}/><button onClick={()=>open('Your cleaning checklist')}><span className="google-g"><Icon name="document"/></span>See what’s included</button></div><div className="review-stat stat"><span><Icon name="star"/></span><p><strong>5</strong><small>Core tasks in our<br/>home cleaning checklist</small></p></div><button className="review-card" onClick={()=>open('Your cleaning checklist')}><span><span className="google-g"><Icon name="home"/></span> <b className="stars">✓ ✓ ✓</b></span><strong>A fresh start at home</strong><p>Clean surfaces, fresh bathrooms,<br/>and the floors taken care of.</p><small>Open the cleaning checklist</small></button></div></section>
      <section className="channels" id="services">
        <div className="orbit reveal"><div className="orbit-ring ring-1"/><div className="orbit-ring ring-2"/><div className="orbit-ring ring-3"/><div className="orbit-brand"><Brand/></div><div className="orbit-track">{services.map(([id,label],i)=><div className="orbit-item" key={id} style={{'--angle':`${i*72-90}deg`}}><button className="social" aria-label={'Explore '+label.toLowerCase()} onClick={()=>open(label)}><img src={asset('service-'+id)} alt=""/></button></div>)}</div></div>
        <div className="channels-copy reveal"><h2><mark>Your space.</mark> Our specialty.</h2><p>Homes, offices, and fresh starts. Choose an everyday clean, a deeper refresh, or help around a move. We shape the service around your space and what needs attention.</p><div className="service-labels">{services.map(([,label])=><button key={label} onClick={()=>open(label)}>{label} ↗</button>)}</div><div className="actions"><Action onClick={quote}>Get a quote</Action><Action light href="#process">How it works</Action></div></div>
      </section>
      <section className="ai-section" id="checklist"><div className="reveal"><h2>A clear plan.<br/><mark>A fresher home.</mark><br/>Your way.</h2><p>Start with the rooms you use most. Tell us about any extras, delicate surfaces, or access instructions. A shared cleaning checklist keeps the scope clear before the visit begins.</p><Tools onClick={()=>open('Your cleaning plan')}/></div><button className="ai-visual reveal" aria-label="Explore a sample home cleaning plan" onClick={()=>open('Your cleaning plan')}><img src={asset('cleaning-plan')} alt="Clear and Gleam sample cleaning plan with kitchen, bathroom, and floor care tasks"/></button></section>
      <section className="testimonials" id="spotlight"><Heading label="find your kind of clean" title="Care for your space" action={<>Next <mark>service</mark></>} onClick={()=>{setPaused(true);setReview((review+1)%stories.length)}}/><div className="testimonial-card reveal" onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)}><div className="review-navigation">{stories.map((item,i)=><button key={item.name} aria-label={'View '+item.name.toLowerCase()} aria-pressed={review===i} onClick={()=>{setPaused(true);setReview(i)}}/>)}</div><div className="story-copy" key={story.name}><span className="story-label">Service spotlight</span><blockquote>{story.quote}</blockquote><strong>{story.name}</strong><p>{story.role}</p></div><div className="story-image" key={story.image}><img src={asset(story.image)} alt={photos[story.image]}/><button className="story-hit" aria-label={'Get a quote for '+story.name.toLowerCase()} onClick={quote}/></div></div></section>
      <section className="pricing" id="plans"><Heading label="a clean for your routine" title="Make it your clean"/><div className="plans">{[false,true].map(regular=><article className={'plan reveal '+(regular?'pro':'')} key={String(regular)}><Icon name={regular?'diamond':'home'} size={30}/><h3>{regular?'Regular care':'One time refresh'}</h3><p>{regular?'An ongoing routine, built around your space':'A fresh start, when you need it'}</p><div className="price">By quote <span>/ your space</span></div><dl>{[['Cleaning visits',regular?'Recurring':'One visit'],['Your priorities','Agreed together'],['Room checklist','Tailored to you'],['Extra tasks','On request']].map(([label,value],i)=><div key={label}><dt><Icon name={['home','chat','document','star'][i]} size={15}/>{label}</dt><dd>{value}</dd></div>)}</dl><button className="plan-select" aria-label={'Get a quote for '+(regular?'regular cleaning':'a one time clean')} onClick={quote}><Icon size={28}/></button></article>)}</div></section>
      <section className="cleaning-faq" id="faqs"><Heading label="before your first clean" title="A few helpful answers"/><div className="faq-list">{faqs.map(([question,answer])=><details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></section>
      <section className="final-cta reveal"><div className="closing-copy"><h2>A cleaner home. <span className="small-icons"><Icon name="home"/><Icon name="star"/></span><br/>A little more you time.<br/>Clear &amp; Gleam.</h2><div><p>Tell us about your space. We’ll help you plan the clean, so you can get back to the things you enjoy.</p><Action onClick={quote}>Get a quote</Action></div></div><div className="photo-montage">{[['floor-care'],['detail-clean'],['kitchen-clean'],['surface-care','cabinet-clean'],['cabinet-clean','floor-care']].map((names,i)=><div className={'montage-column montage-'+i} key={i}>{i===1&&<div className="montage-chip"><Icon name="star"/><span>Room by room.<br/>Detail by detail.</span></div>}{names.map(name=><button key={name} onClick={()=>open('Your cleaning checklist')}><img src={asset(name)} alt={photos[name]}/></button>)}</div>)}</div></section>
      <SiteFooter logo={<Brand/>} onContact={quote} onOpen={open}/>
    </main>
    {modal&&<Dialog key={modal} title={modal} onClose={()=>setModal(null)}>{previews[modal]||(service&&<div><p>{service[2]}</p><p>Share the size and condition of your space, your preferred timing, and any extra tasks so the scope can be agreed before a visit.</p><Action onClick={quote}>Get a quote</Action></div>)}</Dialog>}
  </>;
}
