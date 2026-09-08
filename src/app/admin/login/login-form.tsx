"use client";

import {useState} from "react";
import {createClient} from "@/lib/supabase/client";

const ADMIN_EMAIL="spondon2020official@gmail.com";

export function LoginForm(){
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const [sent,setSent]=useState(false);

  async function submit(){
    setBusy(true);setError("");
    try{
      const supabase=createClient();
      const redirectTo=`${window.location.origin}/auth/callback?next=/admin`;
      const {error}=await supabase.auth.signInWithOtp({email:ADMIN_EMAIL,options:{emailRedirectTo:redirectTo,shouldCreateUser:true}});
      if(error)throw error;
      setSent(true);
    }catch(e){setError(e instanceof Error?e.message:"Sign-in failed")}finally{setBusy(false)}
  }

  return <div className="stack" style={{marginTop:26}}>
    <div className="field"><label>Authorised administrator</label><input className="input" value={ADMIN_EMAIL} readOnly/></div>
    {sent?<div className="alert success">A secure sign-in link has been sent to the authorised Spondon mailbox. Open that link to enter the admin dashboard.</div>:<button className="button" onClick={submit} disabled={busy}>{busy?"Sending secure link…":"Email me a secure sign-in link"}</button>}
    {error&&<div className="alert error">{error}</div>}
  </div>;
}
