'use client';

function SprayCharacter(){return <svg viewBox="0 0 320 360" fill="none" aria-hidden="true"><g stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m126 103-12-59c-2-9 3-14 12-14h110v27h-42l-29 42" fill="var(--indigo)"/><path d="M181 55c-1 19 6 36 21 46l-6-33" fill="var(--cyan)"/><rect x="119" y="102" width="76" height="42" rx="8" fill="var(--cyan)"/><path d="M121 117h72m-72 13h72"/><path d="M120 144c-6 32-44 51-58 96-17 56 19 94 96 94s113-38 96-94c-14-45-52-64-58-96Z" fill="var(--cyan)"/><path d="M87 233c6-19 20-33 32-46" stroke="white" strokeWidth="7"/><ellipse cx="117" cy="248" rx="29" ry="34" fill="white"/><ellipse cx="195" cy="248" rx="29" ry="34" fill="white"/><ellipse cx="126" cy="251" rx="17" ry="25" fill="var(--indigo)" stroke="none"/><ellipse cx="203" cy="251" rx="17" ry="25" fill="var(--indigo)" stroke="none"/><circle cx="133" cy="241" r="5" fill="white" stroke="none"/><circle cx="210" cy="241" r="5" fill="white" stroke="none"/><path d="M139 291q19 16 38 0"/></g></svg>}
function SpongeCharacter({dark=false}){return <svg viewBox="0 0 160 180" fill="none" aria-hidden="true"><g stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M38 80 21 91l-5 20m109-31 14 13 6 19M62 134l-3 28H45m54-28 8 27h13"/><rect x="34" y="32" width="94" height="104" rx="24" fill={dark?'var(--indigo)':'var(--yellow)'}/><path d="m77 32 4-17"/><circle cx="49" cy="48" r="4" fill="var(--blue)" stroke="none" opacity=".6"/><circle cx="113" cy="116" r="6" fill="var(--blue)" stroke="none" opacity=".6"/><circle cx="47" cy="111" r="3" fill="var(--blue)" stroke="none" opacity=".6"/><ellipse cx="63" cy="72" rx="13" ry="17" fill="white"/><ellipse cx="101" cy="72" rx="13" ry="17" fill="white"/><ellipse cx="67" cy="74" rx="6" ry="11" fill="var(--indigo)" stroke="none"/><ellipse cx="105" cy="74" rx="6" ry="11" fill="var(--indigo)" stroke="none"/><path d="M65 103q17 15 33 0" stroke={dark?'white':'currentColor'}/><path d="m15 108 7-2m116 4 8-2"/></g></svg>}
function DropCharacter(){return <svg viewBox="0 0 160 190" fill="none" aria-hidden="true"><g stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m58 142-8 22 15 12m39-33 12 20-13 15M34 109l-19 13-4 12m114-25 20 10 6 15"/><path d="M80 18c-7 36-48 56-48 92a48 48 0 0 0 96 0c0-36-41-56-48-92Z" fill="var(--cyan)"/><path d="M54 77c-6 8-10 16-10 25" stroke="white" strokeWidth="6"/><ellipse cx="62" cy="108" rx="15" ry="19" fill="white"/><ellipse cx="101" cy="108" rx="15" ry="19" fill="white"/><ellipse cx="66" cy="110" rx="8" ry="13" fill="var(--indigo)" stroke="none"/><ellipse cx="105" cy="110" rx="8" ry="13" fill="var(--indigo)" stroke="none"/><path d="M72 139q10 7 20-1"/></g></svg>}

export default function SiteFooter({logo,onContact,onOpen}){
 return <footer className="site-footer reveal" aria-label="Clear and Gleam footer">
  <div className="footer-scenery" aria-hidden="true">
   <div className="footer-blue-sheet"/>
   <div className="footer-character footer-character-spray"><div className="footer-figure"><SprayCharacter/></div></div>
   <div className="footer-character footer-character-sponge"><div className="footer-figure"><SpongeCharacter/></div></div>
   <div className="footer-character footer-character-drop"><div className="footer-figure"><DropCharacter/></div></div>
   <span className="footer-scenery-spark footer-spark-one">✦</span><span className="footer-scenery-spark footer-spark-two">✦</span>
  </div>
  <div className="footer-panel">
   <div className="footer-top-grid">
    <div className="footer-brand-block"><a className="footer-brand-link" href="#home" aria-label="Clear and Gleam home">{logo}<span className="footer-wordmark">Clear &amp;<br/>Gleam.</span></a><p>A cleaner home.<br/>A little more you time.</p></div>
    <nav className="footer-link-column" aria-label="Cleaning services"><h3>Our services</h3>{['Home cleaning','Deep cleaning','Office cleaning','Moving cleans'].map(service=><button key={service} onClick={()=>onOpen(service)}>{service}</button>)}</nav>
    <nav className="footer-link-column" aria-label="Explore Clear and Gleam"><h3>Explore</h3>{[['About us','about'],['How it works','process'],['The benefits','benefits'],['Cleaning plans','plans']].map(([label,id])=><a key={id} href={'#'+id}>{label}</a>)}</nav>
    <nav className="footer-link-column" aria-label="Helpful information"><h3>Good to know</h3><button onClick={()=>onOpen('Your cleaning checklist')}>Our checklist</button><a href="#faqs">FAQs</a><button onClick={()=>onOpen('Privacy preview')}>Privacy</button><button onClick={()=>onOpen('Demo terms')}>Terms</button></nav>
    <div className="footer-contact-block"><button className="footer-contact" onClick={onContact}>Contact us <span aria-hidden="true">↗</span></button></div>
   </div>
   <div className="footer-bottom"><p>© 2026 Clear &amp; Gleam.<br/><span>Cleaning service concept.</span></p><div className="footer-bottom-links"><a href="#faqs">Help &amp; support</a><a href="#home">Back to top <span aria-hidden="true">↑</span></a></div></div>
   <div className="footer-corner-character" aria-hidden="true"><SpongeCharacter dark/></div>
  </div>
 </footer>;
}
