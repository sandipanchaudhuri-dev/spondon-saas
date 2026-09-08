"use client";

import {useMemo,useState} from "react";

type Row={reference:string;pujo:string;applicant:string;email:string;phone:string;whatsapp:string;address:string;theme:string;artist:string;status:string;created:string;updated:string;id:string;organisationId:string;eventId:string};

const sample:Row[]=[
{reference:"SPN-2026-0004",pujo:"CHAWKBAZAR SARBOJANIN DURGA PUJA SAMITY",applicant:"ASHIM SIL",email:"ashim.sil1989@gmail.com",phone:"7003765770",whatsapp:"7003765770",address:"Kolkata, West Bengal",theme:"JAL JONGAL JOMI JIBAN",artist:"SURAJIT & SUBHAJIT",status:"submitted",created:"2026-09-07 19:31",updated:"2026-09-07 19:31",id:"sample-0004",organisationId:"sample-org",eventId:"sample-event"},
{reference:"SPN-2026-0003",pujo:"Anandadhara Cultural Committe, The Soul",applicant:"Shiladitya Ghosh",email:"shiladityaster@gmail.com",phone:"8904050020",whatsapp:"8904050020",address:"Kolkata, West Bengal",theme:"—",artist:"—",status:"submitted",created:"2026-09-06 20:14",updated:"2026-09-06 20:14",id:"sample-0003",organisationId:"sample-org",eventId:"sample-event"},
{reference:"SPN-2026-0002",pujo:"Kalikapur Sarbojanin Durgo Utshav Committe",applicant:"9830357662",email:"prinklepritu@gmail.com",phone:"9073361090",whatsapp:"9830357662",address:"Kalikapur, Kolkata",theme:"Mayajal",artist:"Partha Biswas",status:"submitted",created:"2026-09-04 17:42",updated:"2026-09-04 17:42",id:"sample-0002",organisationId:"sample-org",eventId:"sample-event"}
];

const columns:[keyof Row,string][]=[["reference","Reference"],["pujo","Pujo name"],["applicant","Applicant"],["email","Email"],["phone","Phone"],["whatsapp","WhatsApp"],["address","Address"],["theme","Theme"],["artist","Artist"],["status","Status"],["created","Created"],["updated","Updated"],["id","ID"],["organisationId","Organisation ID"],["eventId","Event ID"]];

export default function AdminUiTest(){
 const [query,setQuery]=useState("");
 const filtered=useMemo(()=>sample.filter(r=>Object.values(r).join(" ").toLowerCase().includes(query.toLowerCase())),[query]);
 function download(){const head=columns.map(([,l])=>l).join(",");const body=filtered.map(r=>columns.map(([k])=>`"${String(r[k]).replace(/"/g,'""')}"`).join(",")).join("\n");const blob=new Blob([head+"\n"+body],{type:"text/csv;charset=utf-8"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="spondon-admin-ui-test.csv";a.click();URL.revokeObjectURL(a.href);}
 return <main className="admin"><aside className="sidebar"><div className="brand">Spondon<small>Administration Preview</small></div><nav className="side-links"><a className="active" href="#registrations">Pujo registrations</a></nav></aside><section className="admin-main"><div className="topline"><div><div className="eyebrow">TEST PREVIEW · NO LIVE DATA</div><h1>Pujo registrations</h1><p className="muted">Use this page to test the admin UI without authentication.</p></div><div className="button secondary">Preview mode</div></div><section className="card table-card" id="registrations"><div className="toolbar" style={{gap:12,flexWrap:"wrap"}}><input className="input" style={{minWidth:280,flex:1}} placeholder="Search any registration field…" value={query} onChange={e=>setQuery(e.target.value)}/><button className="button" onClick={download}>Download test export</button></div><div className="table-scroll"><table><thead><tr>{columns.map(([k,l])=><th key={k}>{l}</th>)}</tr></thead><tbody>{filtered.map(r=><tr key={r.id}>{columns.map(([k])=><td key={k}>{r[k]}</td>)}</tr>)}</tbody></table></div></section></section></main>;
}
