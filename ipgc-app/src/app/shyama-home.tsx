import Link from "next/link";
import {finalists,finalistAwards} from "./finalists";
import {loadFinalistDetails} from "./ipgc-finalist-details";
import {loadPublishedAlbums} from "./ipgc-gallery";
import PhotoStage from "./photo-stage";

export default async function ShyamaHome(){
 const [albums,details]=await Promise.all([loadPublishedAlbums(),loadFinalistDetails()]);
 return <main className="ipgc-landing"><nav className="ipgc-profile-nav" aria-label="Festival navigation"><Link href="/festival-awards">← Festival Awards</Link><Link href="/">IPGC Home</Link></nav>
  <img className="ipgc-landing-hero" src="/ipgc-shyama-samman-2026-top15.jpg" alt="IPGC Shyama Samman 2026 — official Top 15 selected clubs and mandaps" width={1122} height={1402} fetchPriority="high" />
  <section className="ipgc-top15-announcement" aria-label="Top 15 announcement">
   <h1>🪔 The Top 15 are here!</h1>
   <p>Meet the 15 clubs and mandaps shortlisted for the final round of IPGC Shyama Samman 2026.</p>
   <p>🚗 The final round jury convoy took place on <strong>7 November 2026.</strong></p>
   <p>Thank you to every participating club for bringing Shyama Puja to life in your neighbourhood. শুভ শ‍্যামা পুজা॥</p>
  </section>
  <section className="ipgc-finalists" aria-label="Individual Top 15 Pujo profiles">
   <div className="ipgc-finalists-heading"><span>IPGC SHYAMA SAMMAN 2026</span><h2>Meet the Top 15</h2><p>Explore each finalist's registered information, location and field photography updates.</p></div>
   <div className="ipgc-finalists-grid">
    {finalists.map((f,i)=>{const detail=details[f.registration];if(!detail)throw Error('Missing approved registration: '+f.registration);const photos=albums[f.registration]??[];const cover=photos[0];return <Link className={`ipgc-finalist-tile${finalistAwards[f.slug]?" ipgc-finalist-awarded":""}`} href={`/pujo/${f.slug}`} key={f.slug}>
     <span className="ipgc-finalist-visual">{cover?<PhotoStage photo={cover} variant="thumb"/>:<span className="placeholder">{String(i+1).padStart(2,"0")}</span>}</span>
     <span className="ipgc-finalist-content"><small>TOP 15 FINALIST · {String(i+1).padStart(2,"0")}</small><h3>{detail.club_name}</h3><p>{detail.locality||detail.district||'Location not recorded'}</p>{finalistAwards[f.slug]&&<span className="ipgc-finalist-award"><span className="ipgc-award-icon" aria-hidden="true">🏆</span><strong>{finalistAwards[f.slug]}</strong></span>}</span>
     <span aria-hidden="true" className="ipgc-finalist-arrow">↗</span>
    </Link>})}
   </div>
  </section>
 </main>
}