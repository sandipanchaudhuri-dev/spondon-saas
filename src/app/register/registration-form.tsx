"use client";

import {FormEvent, useState} from "react";
import Link from "next/link";
import {z} from "zod";

const schema=z.object({
  pujo_name:z.string().trim().min(2,"Enter the organisation / Pujo name."),
  address:z.string().trim().min(8,"Enter the Pujo address."),
  primary_contact_number:z.string().trim().min(8,"Enter a valid primary contact number."),
  theme:z.string().trim().optional(),
  artist_name:z.string().trim().optional(),
  contact_person_name:z.string().trim().min(2,"Enter the contact person's name."),
  email:z.string().trim().email("Enter a valid email address."),
  whatsapp_number:z.string().trim().max(30,"WhatsApp number is too long.").optional(),
  terms:z.boolean().refine(Boolean,"Please confirm the information and programme rules.")
});

type FieldErrors=Record<string,string>;

export function RegistrationForm(){
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const [fieldErrors,setFieldErrors]=useState<FieldErrors>({});
  const [reference,setReference]=useState("");

  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    setError("");
    setFieldErrors({});

    const form=event.currentTarget;
    const raw=Object.fromEntries(new FormData(form));
    const parsed=schema.safeParse({...raw,terms:raw.terms==="on"});

    if(!parsed.success){
      const nextErrors:FieldErrors={};
      for(const issue of parsed.error.issues){
        const field=String(issue.path[0]??"");
        if(field&&!nextErrors[field])nextErrors[field]=issue.message;
      }
      setFieldErrors(nextErrors);
      setError("Please check the highlighted field(s). Your entries have been kept.");
      const firstField=Object.keys(nextErrors)[0];
      if(firstField){
        requestAnimationFrame(()=>{
          const element=form.elements.namedItem(firstField);
          if(element instanceof HTMLElement){
            element.scrollIntoView({behavior:"smooth",block:"center"});
            element.focus();
          }
        });
      }
      return;
    }

    setBusy(true);
    try{
      const res=await fetch("/api/registrations",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(parsed.data)});
      const body=await res.json();
      if(!res.ok)throw new Error(body.error||"Registration could not be submitted.");
      setReference(body.reference_id);
    }catch(e){
      setError(e instanceof Error?e.message:"Something went wrong.");
    }finally{
      setBusy(false);
    }
  }

  const invalid=(name:string)=>Boolean(fieldErrors[name]);
  const fieldError=(name:string)=>fieldErrors[name]?<span className="field-error">{fieldErrors[name]}</span>:null;

  if(reference)return <section className="card form-card" style={{textAlign:"center"}}><div style={{fontSize:50}}>✓</div><h2>Registration received</h2><p className="muted">Keep this reference for your records.</p><div className="alert success" style={{fontSize:20,fontWeight:800}}>{reference}</div><Link className="button secondary" href="/">Return home</Link></section>;

  return <form className="card form-card" onSubmit={submit} noValidate>
    <div className="fields">
      <div className="field full"><label>Organisation / Pujo name *</label><input className={`input${invalid("pujo_name")?" invalid":""}`} name="pujo_name" autoComplete="organization" aria-invalid={invalid("pujo_name")}/>{fieldError("pujo_name")}</div>
      <div className="field full"><label>Address *</label><textarea className={invalid("address")?"invalid":""} name="address" aria-invalid={invalid("address")}/>{fieldError("address")}</div>
      <div className="field"><label>Contact person *</label><input className={`input${invalid("contact_person_name")?" invalid":""}`} name="contact_person_name" autoComplete="name" aria-invalid={invalid("contact_person_name")}/>{fieldError("contact_person_name")}</div>
      <div className="field"><label>Primary contact number *</label><input className={`input${invalid("primary_contact_number")?" invalid":""}`} name="primary_contact_number" inputMode="tel" aria-invalid={invalid("primary_contact_number")}/>{fieldError("primary_contact_number")}</div>
      <div className="field"><label>Email *</label><input className={`input${invalid("email")?" invalid":""}`} name="email" type="email" autoComplete="email" aria-invalid={invalid("email")}/>{fieldError("email")}</div>
      <div className="field"><label>WhatsApp number <span className="optional">(optional)</span></label><input className={`input${invalid("whatsapp_number")?" invalid":""}`} name="whatsapp_number" inputMode="tel" aria-invalid={invalid("whatsapp_number")}/>{fieldError("whatsapp_number")}</div>
      <div className="field"><label>Theme <span className="optional">(optional)</span></label><input className="input" name="theme"/></div>
      <div className="field"><label>Artist name <span className="optional">(optional)</span></label><input className="input" name="artist_name"/></div>
      <div className={`field full terms${invalid("terms")?" invalid-box":""}`}><label style={{display:"flex",gap:10,alignItems:"flex-start"}}><input name="terms" type="checkbox" style={{marginTop:3}}/><span>I confirm the information is correct and accept the programme rules. Selection decisions are final, and participating committees must follow applicable government and safety protocols.</span></label>{fieldError("terms")}</div>
    </div>
    {error&&<div className="alert error">{error}</div>}
    <button className="button" disabled={busy} style={{width:"100%",marginTop:22}}>{busy?"Submitting…":"Submit registration"}</button>
  </form>;
}
