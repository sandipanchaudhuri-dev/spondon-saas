import {NextResponse} from "next/server";
import {createClient} from "@supabase/supabase-js";
import {z} from "zod";

const input=z.object({pujo_name:z.string().trim().min(2).max(180),address:z.string().trim().min(8).max(1000),primary_contact_number:z.string().trim().min(8).max(30),theme:z.string().trim().max(240).optional().default(""),artist_name:z.string().trim().max(180).optional().default(""),contact_person_name:z.string().trim().min(2).max(180),email:z.string().email().max(254),whatsapp_number:z.string().trim().min(8).max(30),terms:z.literal(true)});

function escapeHtml(value:string){return value.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#039;");}

async function sendEmail(to:string,subject:string,html:string){
  const apiKey=process.env.RESEND_API_KEY;
  const from=process.env.SPONDON_EMAIL_FROM;
  if(!apiKey||!from){console.info("Spondon email notification skipped: mail provider is not configured");return;}
  const response=await fetch("https://api.resend.com/emails",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${apiKey}`},body:JSON.stringify({from,to,subject,html})});
  if(!response.ok)throw new Error(`Email provider returned ${response.status}`);
}

async function sendRegistrationEmails(payload:z.infer<typeof input>,reference:string){
  const safe={name:escapeHtml(payload.contact_person_name),pujo:escapeHtml(payload.pujo_name),email:escapeHtml(payload.email),phone:escapeHtml(payload.primary_contact_number),whatsapp:escapeHtml(payload.whatsapp_number),address:escapeHtml(payload.address),theme:escapeHtml(payload.theme||"—"),artist:escapeHtml(payload.artist_name||"—"),reference:escapeHtml(reference)};
  const participant=`<div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#222"><h2 style="margin-bottom:8px">Spondon Sharod Somman 2026</h2><p>Dear ${safe.name},</p><p>Thank you for registering <strong>${safe.pujo}</strong>. Your registration has been received successfully.</p><p><strong>Registration reference:</strong> ${safe.reference}</p><p>Please keep this reference for future communication.</p><hr style="border:0;border-top:1px solid #ddd;margin:24px 0"><p style="font-size:13px;color:#666">This is an automatic confirmation from Spondon Sharod Somman 2026.</p></div>`;
  const notification=`<div style="font-family:Arial,sans-serif;max-width:700px;margin:auto;color:#222"><h2>New Spondon Pujo Registration</h2><table cellpadding="7" cellspacing="0" style="border-collapse:collapse;width:100%"><tr><td><strong>Reference</strong></td><td>${safe.reference}</td></tr><tr><td><strong>Pujo</strong></td><td>${safe.pujo}</td></tr><tr><td><strong>Applicant</strong></td><td>${safe.name}</td></tr><tr><td><strong>Email</strong></td><td>${safe.email}</td></tr><tr><td><strong>Phone</strong></td><td>${safe.phone}</td></tr><tr><td><strong>WhatsApp</strong></td><td>${safe.whatsapp}</td></tr><tr><td><strong>Address</strong></td><td>${safe.address}</td></tr><tr><td><strong>Theme</strong></td><td>${safe.theme}</td></tr><tr><td><strong>Artist</strong></td><td>${safe.artist}</td></tr></table><p style="margin-top:20px">Open the Spondon admin dashboard to review the complete registration.</p></div>`;
  const admin=process.env.SPONDON_NOTIFICATION_EMAIL||"spondon2020official@gmail.com";
  const results=await Promise.allSettled([sendEmail(payload.email,`Registration received — ${payload.pujo_name} — ${reference}`,participant),sendEmail(admin,`New Pujo Registration — ${payload.pujo_name}`,notification)]);
  results.forEach((result)=>{if(result.status==="rejected")console.error("Spondon registration email failed",result.reason instanceof Error?result.reason.message:"unknown")});
}

export async function POST(request:Request){
  try{
    const parsed=input.safeParse(await request.json());
    if(!parsed.success)return NextResponse.json({error:"Please check the submitted details."},{status:400});
    const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,eventId=process.env.NEXT_PUBLIC_SPONDON_EVENT_ID,organisationId=process.env.NEXT_PUBLIC_SPONDON_ORGANISATION_ID;
    if(!url||!key||!eventId||!organisationId)return NextResponse.json({error:"Registration is not configured yet."},{status:503});
    const db=createClient(url,key,{auth:{persistSession:false}}).schema("spondon");
    const {terms,...payload}=parsed.data;void terms;
    const {data,error}=await db.rpc("submit_pujo_registration",{p_organisation_id:organisationId,p_event_id:eventId,p_pujo_name:payload.pujo_name,p_address:payload.address,p_primary_contact_number:payload.primary_contact_number,p_theme:payload.theme,p_artist_name:payload.artist_name,p_contact_person_name:payload.contact_person_name,p_email:payload.email,p_whatsapp_number:payload.whatsapp_number});
    if(error)throw error;
    const result=Array.isArray(data)?data[0]:data;
    const reference=String(result?.public_reference||"");
    await sendRegistrationEmails(parsed.data,reference);
    return NextResponse.json({reference_id:reference},{status:201});
  }catch(e){console.error("registration submission failed",e instanceof Error?e.message:"unknown");return NextResponse.json({error:"We could not submit your registration. Please try again."},{status:500})}
}
