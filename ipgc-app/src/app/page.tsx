import Link from "next/link";
import {finalists} from "./finalists";
export default function Home(){
 return <main className="ipgc-landing">
  <img className="ipgc-landing-hero" src="/ipgc-shyama-samman-2026-top15.jpg" alt="IPGC Shyama Samman 2026 — official Top 15 selected clubs and mandaps" width={1122} height={1402} fetchPriority="high" />
  <section className="ipgc-top15-announcement" aria-label="Top 15 announcement">
   <h1>🪔 The Top 15 are here!</h1>
   <p>Congratulations to the 15 clubs and mandaps advancing to Phase 3 of IPGC Shyama Samman 2026. The list is in alphabetical order.</p>
   <p>🚗 Our Jury Convoy will visit the shortlisted mandaps from <strong>2:00 PM IST on 7 November.</strong></p>
   <p>Thank you to every participating club for bringing Shyama Puja to life in your neighbourhood. শুভ শ‍্যামা পুজা॥</p>
  </section>
  <section className="ipgc-finalists" aria-label="Individual Top 15 Pujo profiles">
   <div className="ipgc-finalists-heading"><span>IPGC SHYAMA SAMMAN 2026</span><h2>Meet the Top 15</h2><p>Explore each finalist's registered information, location and field photography updates.</p></div>
   <div className="ipgc-finalists-grid">
    {finalists.map((f,i)=><Link className="ipgc-finalist-tile" href={`/pujo/${f.slug}`} key={f.slug}>
     <span className="ipgc-finalist-no">{String(i+1).padStart(2,"0")}</span>
     <div><h3>{f.name}</h3><p>{f.area}</p></div>
     <span aria-hidden="true" className="ipgc-finalist-arrow">↗</span>
    </Link>)}
   </div>
  </section>
 </main>
}