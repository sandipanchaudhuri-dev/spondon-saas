import Link from "next/link";
import {RegistrationCountdown} from "./registration-countdown";
export default function Home(){
 return <main className="ipgc-landing">
  <RegistrationCountdown/>
  <img className="ipgc-landing-hero" src="/shyama-samman-2026-hero.svg" alt="IPGC Shyama Samman 2026 — Kali Puja, Art, Culture and Community" />
  <section className="ipgc-top15-section" aria-labelledby="ipgc-top15-heading">
   <h2 id="ipgc-top15-heading">IPGC Shyama Samman 2026 — Top 15</h2>
   <img className="ipgc-top15-poster" src="/ipgc-shyama-samman-2026-top15.jpg" alt="Official IPGC Shyama Samman 2026 Top 15 clubs and mandaps alphabetical list, with fifteen selected clubs and their localities" width={1056} height={1408} loading="lazy" />
  </section>
  <nav className="ipgc-home-links" aria-label="IPGC pages">
   <Link className="ipgc-landing-action" href="/register">Register Now <span aria-hidden="true">→</span></Link>
  </nav>
 </main>
}