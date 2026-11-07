import Link from "next/link";
import {RegistrationCountdown} from "./registration-countdown";
export default function Home(){
 return <main className="ipgc-landing">
  <RegistrationCountdown/>
  <img className="ipgc-landing-hero" src="/ipgc-shyama-samman-2026-top15.jpg" alt="IPGC Shyama Samman 2026 — official Top 15 selected clubs and mandaps, updated alphabetical list including Jubak Brinda" width={1122} height={1402} fetchPriority="high" />
  <nav className="ipgc-home-links" aria-label="IPGC pages">
   <Link className="ipgc-landing-action" href="/register">Register Now <span aria-hidden="true">→</span></Link>
  </nav>
 </main>
}