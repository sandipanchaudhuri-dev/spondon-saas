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

export function WorkshopContent(){
 return <>
  <section className="ws-intro">
   <div className="ws-editorial">
    <span className="group-kicker">IPGC PHOTOGRAPHY WORKSHOPS · UPCOMING</span>
    <h1>The <em>Naughty Santa</em></h1>
    <p className="ws-subhead">A Photography Workshop</p>
    <p className="ws-description">A Christmas-themed fashion and portrait photography workshop with model Sanchita Bose, mentored by Sourav Mukherjee in Kolkata.</p>
    <div className="ws-eventline"><strong>06 DEC 2026</strong><span>Sunday · From 12 noon</span></div>
    <div className="ws-actions"><a className="group-button" href={whatsappEnquiryUrl} target="_blank" rel="noopener noreferrer" aria-label="Enquire on WhatsApp about The Naughty Santa workshop">Message on WhatsApp</a><a className="ws-secondary" href="tel:+919830775666">Call organiser</a><a className="ws-secondary" href="#workshop-information">Workshop details</a></div>
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
