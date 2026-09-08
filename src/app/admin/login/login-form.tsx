"use client";

import {useState} from "react";
import {createClient} from "@/lib/supabase/client";

const ADMIN_EMAILS=["spondon2020official@gmail.com","sandipan.chaudhuri@gmail.com"] as const;
const SITE_URL=(process.env.NEXT_PUBLIC_SITE_URL||"https://spondon.pujoonline.com").replace(/\/$/,"");

export function LoginForm(){
  const [email,setEmail]=useState<string>(ADMIN_EMAILS[0]);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const [sent,setSent]=useState(false);

  async function submit(){
    setBusy(true);setError("");setSent(false);
    try{
      const normalised=email.trim().toLowerCase();
      if(!ADMIN_EMAILS.includes(normalised as typeof ADMIN_EMAILS[number]))throw new Error("This email is not authorised for Spondon admin access.");
      const supabase=createClient();
      const redirectTo=`${SITE_URL}/auth/callback?next=/admin`;
      const {error}=await supabase.auth.signInWithOtp({email:normalised,options:{emailRedirectTo:redirectTo,shouldCreateUser:true}});
      if(error)throw error;
      setSent(true);
    }catch(e){setError(e instanceof Error?e.message:"Sign-in failed")}finally{setBusy(false)}
  }

  return <div className="stack" style={{marginTop:26}}>
    <div className="field"><label>Authorised administrator</label><select className="input" value={email} onChange={(e)=>setEmail(e.target.value)}>{ADMIN_EMAILS.map((item)=><option key={item} value={item}>{item}</option>)}</select></div>
    {sent?<div className="alert success">A secure sign-in link has been sent to {email}. Open that link to enter the admin dashboard.</div>:<button className="button" onClick={submit} disabled={busy}>{busy?"Sending secure link…":"Email me a secure sign-in link"}</button>}
    {error&&<div className="alert error">{error}</div>}
  </div>;
}
