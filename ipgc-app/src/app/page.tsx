import Link from "next/link";
import {RegistrationCountdown} from "./registration-countdown";
export default function Home(){
 return <main className="ipgc-landing">
  <RegistrationCountdown/>
  <img className="ipgc-landing-hero" src="/shyama-samman-2026-hero.svg" alt="IPGC Shyama Samman 2026 — Kali Puja, Art, Culture and Community" />
  <nav className="ipgc-home-links" aria-label="IPGC pages">
   <Link className="ipgc-landing-action" href="/register">Register Now <span aria-hidden="true">→</span></Link>
  </nav>
 </main>
}