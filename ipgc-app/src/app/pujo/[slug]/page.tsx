import Link from "next/link";
import {notFound} from "next/navigation";
import type {Metadata} from "next";
import {finalists,finalistAwards} from "../../finalists";
import {loadFinalistDetails,registeredMapHref} from "../../ipgc-finalist-details";
import {loadPublishedAlbums} from "../../ipgc-gallery";
import PhotoStage from "../../photo-stage";
import FinalistAlbum from "./finalist-album";
export const dynamicParams=false;
export const dynamic="force-dynamic";
export function generateStaticParams(){return finalists.map(f=>({slug:f.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
 const {slug}=await params;
 const finalist=finalists.find(v=>v.slug===slug);
 if(!finalist)return {title:"Pujo profile | IPGC"};
 const details=await loadFinalistDetails();
 const record=details[finalist.registration];
 if(!record)throw Error('Approved finalist not found in IPGC registrations');
 return {title:record.club_name+" | IPGC Shyama Samman 2026",description:"IPGC Shyama Samman 2026 — "+record.club_name};
}
export default async function PujoProfile({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;
 const finalist=finalists.find(v=>v.slug===slug);
 if(!finalist)notFound();
 const [details,albums]=await Promise.all([loadFinalistDetails(),loadPublishedAlbums()]);
 const info=details[finalist.registration];
 if(!info)throw Error("Missing approved IPGC registration "+finalist.registration);
 const name=info.club_name;
 const area=info.locality||info.district||"Location not recorded";
 const address=info.venue_address||[info.locality,info.district].filter(Boolean).join(", ")||"Location not recorded";
 const photoList=albums[finalist.registration]??[];
 const image=photoList.find(p=>p.alt.toLowerCase().includes("field visit"))||photoList[0];
 const hasCreative=Boolean(info.theme||info.theme_artist||info.idol_artist||info.established_year);
 const locationUrl=registeredMapHref(info);
 return <main className="ipgc-profile-page">
  <nav className="ipgc-profile-nav" aria-label="Profile navigation"><Link href="/">← All finalists</Link><span>SHYAMA SAMMAN · 2026</span></nav>
  <article className="ipgc-profile">
   <header className="ipgc-profile-identity">
    <div className="ipgc-profile-identity-copy">
     <p className="ipgc-profile-eyebrow">IPGC SHYAMA SAMMAN 2026 <span aria-hidden="true">·</span> TOP 15</p>
     <h1>{name}</h1>
     <p className="ipgc-profile-area"><span aria-hidden="true">⌖ </span>{area}</p>
     {finalistAwards[finalist.slug]&&<div className="ipgc-profile-award"><span className="ipgc-award-icon" aria-hidden="true">🏆</span><strong>{finalistAwards[finalist.slug]}</strong></div>}
     <div className="ipgc-profile-intro"><span>{info.established_year?"EST. "+info.established_year:"2026 FINALIST"}</span><span>{photoList.length} {photoList.length===1?"PHOTOGRAPH":"PHOTOGRAPHS"}</span></div>
    </div>
    {image?<a className="ipgc-profile-feature" href="#photo-album" aria-label="Browse photographs"><PhotoStage photo={image} variant="hero"/><span className="ipgc-feature-linklabel">EXPLORE THE PHOTO ALBUM <b>↘</b></span></a>:
     <div className="ipgc-profile-feature ipgc-profile-feature-empty"><span>Photographs to follow</span></div>}
   </header>
   {hasCreative&&<section className="ipgc-profile-main" aria-label="Registered creative information">
    <div className="ipgc-profile-section-heading"><span>01 / THE PUJO</span><h2>Creative identity</h2></div>
    <dl className="ipgc-profile-details">
     {info.theme&&<div className="ipgc-profile-theme"><dt>2026 theme</dt><dd>{info.theme}</dd></div>}
     {info.theme_artist&&<div><dt>Theme artist</dt><dd>{info.theme_artist}</dd></div>}
     {info.idol_artist&&<div><dt>Idol artist</dt><dd>{info.idol_artist}</dd></div>}
     {info.established_year&&<div><dt>Established</dt><dd>{info.established_year}</dd></div>}
    </dl>
   </section>}
   <section className="ipgc-profile-location" aria-label="Location">
    <div className="ipgc-profile-section-heading"><span>02 / VISIT</span><h2>Find this Pujo</h2></div>
    <div className="ipgc-profile-location-row"><p>{address}</p>{locationUrl&&<a className="ipgc-location-link" href={locationUrl} target="_blank" rel="noopener noreferrer" aria-label={"Search registered location for "+name+" on Google Maps"}>
     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>
     {info.maps_url?"Open registered Google Maps link":"Search registered location"} <span aria-hidden="true">↗</span>
    </a>}</div>
   </section>
   <section id="photo-album" className="ipgc-profile-album" aria-label="Photo album">
    <div className="ipgc-profile-section-heading"><span>03 / THROUGH THE LENS</span><h2>Pujo photographs</h2><p>{photoList.length} photographs from registered coverage and field visits. Tap to browse photographs.</p></div>
    <FinalistAlbum photos={photoList} name={name}/>
   </section>
   <p className="ipgc-profile-source">Registration reference {finalist.registration} · Information from the live IPGC registration database.{!hasCreative?" Theme, artist and establishment details were not recorded with this registration.":""}</p>
  </article>
  <div className="ipgc-profile-return"><Link href="/">← Discover the other finalists</Link></div>
 </main>;
}