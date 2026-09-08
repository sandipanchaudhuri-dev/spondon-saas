import {NextResponse} from "next/server";
import {createClient} from "@supabase/supabase-js";
import {z} from "zod";

const input=z.object({pujo_name:z.string().trim().min(2).max(180),address:z.string().trim().min(8).max(1000),primary_contact_number:z.string().trim().min(8).max(30),theme:z.string().trim().max(240).optional().default(""),artist_name:z.string().trim().max(180).optional().default(""),contact_person_name:z.string().trim().min(2).max(180),email:z.string().email().max(254),whatsapp_number:z.string().trim().min(8).max(30),terms:z.literal(true)});

async function sendRegistrationMail(payload:z.infer<typeof input>,reference:string){
  const endpoint=process.env.SPONDON_APPS_SCRIPT_URL;
  const secret=process.env.SPONDON_APPS_SCRIPT_SECRET;
  if(!endpoint||!secret){console.info("Spondon registration mail skipped: Apps Script endpoint is not configured");return false;}
  try{
    const response=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({
      secret,
      registration_ref:reference,
      submitted_at:new Date().toISOString(),
      pujo_name:payload.pujo_name,
      contact_person_name:payload.contact_person_name,
      email:payload.email,
      phone:payload.primary_contact_number,
      whatsapp_number:payload.whatsapp_number,
      address:payload.address,
      theme:payload.theme,
      artist_name:payload.artist_name,
      admin_email:"spondon2020official@gmail.com"
    }),cache:"no-store"});
    if(!response.ok)throw new Error(`Apps Script returned HTTP ${response.status}`);
    const result=await response.json().catch(()=>({success:false,error:"Invalid Apps Script response"}));
    if(!result?.success)throw new Error(String(result?.error||"Apps Script mail delivery failed"));
    return true;
  }catch(error){console.error("Spondon registration mail failed",error instanceof Error?error.message:"unknown");return false;}
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
    const emailSent=await sendRegistrationMail(parsed.data,reference);
    return NextResponse.json({reference_id:reference,email_sent:emailSent},{status:201});
  }catch(e){console.error("registration submission failed",e instanceof Error?e.message:"unknown");return NextResponse.json({error:"We could not submit your registration. Please try again."},{status:500})}
}
