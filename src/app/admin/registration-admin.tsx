"use client";

import Link from "next/link";
import {useMemo,useState} from "react";
import {createClient} from "@/lib/supabase/client";

type Registration={
  id:string;public_reference:string;organisation_id:string;event_id:string;applicant_name:string;email:string;phone:string|null;whatsapp_number:string|null;pujo_name:string;address:string|null;notes:string|null;status:string;submitted_by_user_id:string|null;reviewed_by_user_id:string|null;reviewed_at:string|null;created_at:string;updated_at:string;theme:string|null;artist_name:string|null;
};

const columns:[keyof Registration,string][]=[
  ["public_reference","Reference"],["pujo_name","Pujo name"],["applicant_name","Applicant"],["email","Email"],["phone","Phone"],["whatsapp_number","WhatsApp"],["address","Address"],["theme","Theme"],["artist_name","Artist"],["notes","Notes"],["status","Status"],["created_at","Created"],["updated_at","Updated"],["reviewed_at","Reviewed"],["id","ID"],["organisation_id","Organisation ID"],["event_id","Event ID"],["submitted_by_user_id","Submitted by"],["reviewed_by_user_id","Reviewed by"]
];

export function RegistrationAdmin({initial,email}:{initial:Registration[];email:string}){
  const [query,setQuery]=useState("");
  const filtered=useMemo(()=>{
    const q=query.trim().toLowerCase();
    if(!q)return initial;
    return initial.filter((row)=>columns.some(([key])=>String(row[key]??"").toLowerCase().includes(q)));
  },[initial,query]);

  async function logout(){await createClient().auth.signOut();location.href="/admin/login";}

  return <main className="admin">
    <aside className="sidebar"><Link className="brand" href="/">Spondon<small>Administration</small></Link><nav className="side-links"><a className="active" href="#registrations">Pujo registrations</a></nav></aside>
    <section className="admin-main">
      <div className="topline"><div><div className="eyebrow">Sharod Somman 2026</div><h1>Pujo registrations</h1><p className="muted">{initial.length} registration{initial.length===1?"":"s"} in the live Spondon database.</p></div><button className="button secondary" onClick={logout}>{email} · Sign out</button></div>
      <section className="card table-card" id="registrations">
        <div className="toolbar" style={{gap:12,flexWrap:"wrap"}}>
          <input className="input" style={{minWidth:280,flex:1}} placeholder="Search any registration field…" value={query} onChange={(e)=>setQuery(e.target.value)}/>
          <a className="button" href="/api/admin/registrations-export">Download Excel</a>
        </div>
        <div className="table-scroll"><table><thead><tr>{columns.map(([key,label])=><th key={key}>{label}</th>)}</tr></thead><tbody>{filtered.map((row)=><tr key={row.id}>{columns.map(([key])=><td key={key} style={{minWidth:key==="address"?320:key==="email"?220:140,verticalAlign:"top",whiteSpace:key==="address"||key==="notes"?"normal":"nowrap"}}>{row[key]?String(row[key]):"—"}</td>)}</tr>)}</tbody></table>{!filtered.length&&<p className="muted" style={{padding:30,textAlign:"center"}}>No registrations match this search.</p>}</div>
      </section>
    </section>
  </main>;
}
