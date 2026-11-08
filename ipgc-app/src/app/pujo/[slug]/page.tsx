import Link from "next/link";
import {notFound} from "next/navigation";
import type {Metadata} from "next";
import {finalists,finalistAwards,mapHref} from "../../finalists";
import FinalistAlbum from "./finalist-album";
export const dynamicParams=false;
export function generateStaticParams(){return finalists.map(f=>({slug:f.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
 const {slug}=await params;const f=finalists.find(v=>v.slug===slug);
 return {title:f?`${f.name} | IPGC Shyama Samman 2026`:"Pujo profile | IPGC",description:f?`Meet ${f.name}, a Top 15 finalist of IPGC Shyama Samman 2026.`:"IPGC Shyama Samman finalists"};
}
export default async function PujoProfile({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;const f=finalists.find(v=>v.slug===slug);if(!f)notFound();
 const fromCommittee=f.registration==="IPGC-SS-2026-00046";
 const image=f.publishedPhotos.find(p=>p.alt.toLowerCase().includes("field visit"))||f.publishedPhotos[0];
 return <main className="ipgc-profile-page">
  <nav className="ipgc-profile-nav" aria-label="Profile navigation"><Link href="/">← All finalists</Link><span>SHYAMA SAMMAN · 2026</span></nav>
  <article className="ipgc-profile">
   <header className="ipgc-profile-identity">
    <div className="ipgc-profile-identity-copy">
     <p className="ipgc-profile-eyebrow">IPGC SHYAMA SAMMAN 2026 <span aria-hidden="true">·</span> TOP 15</p>
     <h1>{f.name}</h1>
     <p className="ipgc-profile-area"><span aria-hidden="true">⌖ </span>{f.area}</p>
     {finalistAwards[f.slug]&&<div className="ipgc-profile-award"><span className="ipgc-award-icon" aria-hidden="true">🏆</span><strong>{finalistAwards[f.slug]}</strong></div>}
     <div className="ipgc-profile-intro"><span>{f.established?"EST. "+f.established:"2026 FINALIST"}</span><span>{f.publishedPhotos.length} {f.publishedPhotos.length===1?"PHOTOGRAPH":"PHOTOGRAPHS"}</span></div>
    </div>
    {image?<a className="ipgc-profile-feature" href="#photo-album" aria-label="Browse field photographs"><img src={image.src} alt={image.alt}/><span>EXPLORE THE PHOTO ALBUM <b>↘</b></span></a>:
     <div className="ipgc-profile-feature ipgc-profile-feature-empty"><span>Photographs to follow</span></div>}
   </header>
   <section className="ipgc-profile-main" aria-label="2026 Pujo information">
    <div className="ipgc-profile-section-heading"><span>01 / THE PUJO</span><h2>Creative identity</h2></div>
    <dl className="ipgc-profile-details">
     <div className="ipgc-profile-theme"><dt>2026 theme</dt><dd>{f.theme||"Not provided at registration"}</dd></div>
     <div><dt>Theme artist</dt><dd>{f.artist||"Not provided"}</dd></div>
     <div><dt>Idol artist</dt><dd>{f.idolArtist||"Not provided"}</dd></div>
     <div><dt>Established</dt><dd>{f.established||"Not provided"}</dd></div>
    </dl>
   </section>
   <section className="ipgc-profile-location" aria-label="Location">
    <div className="ipgc-profile-section-heading"><span>02 / VISIT</span><h2>Find this Pujo</h2></div>
    <div className="ipgc-profile-location-row"><p>{f.address}</p><a className="ipgc-location-link" href={mapHref(f)} target="_blank" rel="noopener noreferrer" aria-label={f.maps?`Open registered map location for ${f.name}`:`Search registered address for ${f.name} on Google Maps`}>
     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>
     {f.maps?"View on Google Maps":"Find on Google Maps"} <span aria-hidden="true">↗</span>
    </a></div>
   </section>
   <section id="photo-album" className="ipgc-profile-album" aria-label="Photo album">
    <div className="ipgc-profile-section-heading"><span>03 / THROUGH THE LENS</span><h2>{fromCommittee?"Pujo photographs":"Field photography"}</h2><p>{fromCommittee?"Original photographs supplied by the Pujo committee.":`${f.publishedPhotos.length} original photographs from the judging and field visits.`} Tap to view full size.</p></div>
    <FinalistAlbum photos={f.publishedPhotos} name={f.name}/>
   </section>
   <p className="ipgc-profile-source">Registration reference {f.registration} · Information as supplied by the participating committee.</p>
  </article>
  <div className="ipgc-profile-return"><Link href="/">← Discover the other finalists</Link></div>
 </main>;
}