import "./workshop.css";

const details = [
 {label:"Workshop",value:"894th Photography Workshop"},
 {label:"Model",value:"Ms. Sanchita Bose"},
 {label:"Mentor",value:"Mr. Sourav Mukherjee"},
 {label:"Date",value:"Sunday, 6 December 2026"},
 {label:"Time",value:"12 noon onwards"},
 {label:"Venue",value:"A P Studio, Floor 2, Kolkata"},
 {label:"Fee",value:"₹3,500 · Lunch included"}
] as const;

const whatsappEnquiryUrl = "https://wa.me/919830775666?text=" + encodeURIComponent("Hello IPGC, I would like to enquire about The Naughty Santa — 894th Photography Workshop on 6 December 2026 in Kolkata. Please share availability and registration details.");

function WhatsAppIcon(){return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M20.1 11.6a8.1 8.1 0 0 1-11.9 7.2L4 20l1.3-4a8.1 8.1 0 1 1 14.8-4.4Z"/><path d="M9.1 8.5c-.3-.4-.6-.4-.9-.1-.4.4-.6 1-.4 1.7.4 1.7 2.7 4.4 4.6 5.1.7.3 1.5.2 2-.3.3-.3.5-.8.2-1.1l-1.6-.8c-.3-.1-.5.2-.8.5-.2.2-.3.3-.6.1a7 7 0 0 1-2.5-2.4c-.2-.3-.1-.5.2-.8.3-.3.4-.5.2-.8Z"/></svg>}
function CallIcon(){return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M21 16.2v2.6a2 2 0 0 1-2.2 2 18 18 0 0 1-15.6-15.6A2 2 0 0 1 5.2 3h2.6a2 2 0 0 1 2 1.7l.5 2.4a2 2 0 0 1-.6 1.8L8.2 10a14 14 0 0 0 5.8 5.8l1.1-1.5a2 2 0 0 1 1.8-.6l2.4.5a2 2 0 0 1 1.7 2Z"/></svg>}

export function WorkshopContent(){
 return <>
  <section className="ws-intro">
   <div className="ws-editorial">
    <span className="group-kicker">IPGC PHOTOGRAPHY WORKSHOPS · UPCOMING</span>
    <h1>The <em>Naughty Santa</em></h1>
    <p className="ws-subhead">A Photography Workshop</p>
    <p className="ws-description">A Christmas-themed fashion and portrait photography workshop with model Sanchita Bose, mentored by Sourav Mukherjee in Kolkata.</p>
    <div className="ws-eventline"><strong>06 DEC 2026</strong><span>Sunday · From 12 noon</span></div>
    <div className="ws-action-area"><div className="ws-actions" aria-label="Workshop enquiries"><a className="ws-action ws-action-whatsapp" href={whatsappEnquiryUrl} target="_blank" rel="noopener noreferrer" aria-label="Enquire on WhatsApp about The Naughty Santa workshop"><span className="ws-action-icon"><WhatsAppIcon/></span><span>WhatsApp</span></a><a className="ws-action ws-action-call" href="tel:+919830775666" aria-label="Call workshop organiser"><span className="ws-action-icon"><CallIcon/></span><span>Call</span></a></div><a className="ws-details-link" href="#workshop-information">View workshop details</a></div>
   </div>
   <div className="ws-poster">
    <img src="/brand/ipgc-naughty-santa-workshop-2026.jpg" width={1086} height={1448} fetchPriority="high" alt="Original IPGC Incluséa The Naughty Santa workshop artwork, featuring model Sanchita Bose, mentor Sourav Mukherjee, event details and fee"/>
   </div>
  </section>
  <section className="ws-details" id="workshop-information">
   <div className="ws-heading"><span className="group-kicker">THE UPCOMING SESSION</span><h2>Workshop information</h2><p>All event information below follows the supplied official workshop announcement.</p></div>
   <dl className="ws-facts">{details.map(d=><div key={d.label}><dt>{d.label}</dt><dd>{d.value}</dd></div>)}</dl>
  </section>
  <section className="ws-enquiry">
   <div><span className="group-kicker">PARTICIPATION & ENQUIRIES</span><h2>Join the workshop</h2><p>For availability, registration and payment arrangements, contact the organisers directly.</p></div>
   <div className="ws-contacts"><a className="ws-whatsapp-contact" href={whatsappEnquiryUrl} target="_blank" rel="noopener noreferrer">Message on WhatsApp (+91 98307 75666)</a><a href="tel:+919830775666">Call +91 98307 75666</a><a href="tel:+919830449955">Call +91 98304 49955</a><p>WhatsApp opens with an enquiry message ready to send. Workshop fee: ₹3,500, including lunch.</p></div>
  </section>
 </>;
}
