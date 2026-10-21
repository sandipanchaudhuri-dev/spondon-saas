import Link from "next/link";
export default function Home(){
 return <main className="ipgc-landing">
  <img className="ipgc-landing-hero" src="/shyama-samman-2026-hero.svg" alt="IPGC Shyama Samman 2026 — Kali Puja, Art, Culture and Community" />
  <Link className="ipgc-landing-action" href="/register">Register Now <span aria-hidden="true">→</span></Link>
 </main>
}