import Link from "next/link";
import {notFound} from "next/navigation";
import type {Metadata} from "next";
import {finalists,mapHref} from "../../finalists";
export const dynamicParams=false;
export function generateStaticParams(){return finalists.map(f=>({slug:f.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
 const {slug}=await params;const f=finalists.find(v=>v.slug===slug);
 return {title:f?`${f.name} | IPGC Shyama Samman 2026`:"Pujo profile | IPGC",description:f?`Meet ${f.name}, a Top 15 finalist of IPGC Shyama Samman 2026.`:"IPGC Shyama Samman finalists"};
}
export default async function PujoProfile({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;const f=finalists.find(v=>v.slug===slug);if(!f)notFound();
 const info=[["Established",f.established?String(f.established):null],["2026 theme",f.theme],["Theme artist",f.artist],["Idol artist",f.idolArtist]] as const;
 return <main className="ipgc-profile-page">
  <nav className="ipgc-profile-nav"><Link href="/">← Back to Top 15</Link><span>IPGC · SHYAMA SAMMAN 2026</span></nav>
  <article className="ipgc-profile">
   <div className="ipgc-profile-head"><p className="ipgc-profile-eyebrow">OFFICIAL TOP 15 FINALIST</p><h1>{f.name}</h1><p className="ipgc-profile-area">{f.area}</p></div>
   <dl className="ipgc-profile-details">
    {info.map(([label,value])=><div className="ipgc-profile-detail" key={label}><dt>{label}</dt><dd>{value||"Information not provided"}</dd></div>)}
   </dl>
   <section className="ipgc-profile-location" aria-label="Location">
    <div><h2>Find this Pujo</h2><p>{f.address}</p></div>
    <a className="ipgc-location-link" href={mapHref(f)} target="_blank" rel="noopener noreferrer" aria-label={f.maps?`Open registered map location for ${f.name}`:`Search registered address for ${f.name} on Google Maps`}>
     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>
     {f.maps?"Open location":"Find area on Maps"} ↗
    </a>
   </section>
   <section className="ipgc-profile-album" aria-label="Photo album">
    <div className="ipgc-profile-album-heading"><h2>Field Visit &amp; Judging Album</h2><p>Original photographs from on-site documentation</p></div>
    {f.publishedPhotos.length>0?
     <div className="ipgc-profile-gallery">{f.publishedPhotos.map(p=><a href={p.src} key={p.src} target="_blank" rel="noopener noreferrer"><img src={p.src} alt={p.alt} loading="lazy"/></a>)}</div>
     :<div className="ipgc-profile-album-pending"><strong>Album being prepared</strong><p>{f.submittedPhotos>0?`${f.submittedPhotos} photograph${f.submittedPhotos===1?" has":"s have"} been submitted during field visits. Publication review is pending.`:"No field photographs have been uploaded for this finalist yet."}</p></div>}
   </section>
   <p className="ipgc-profile-source">Information supplied at registration · {f.registration}. Missing details are shown as unavailable rather than estimated.</p>
  </article>
  <div className="ipgc-profile-return"><Link href="/">View all 15 finalists →</Link></div>
 </main>;
}