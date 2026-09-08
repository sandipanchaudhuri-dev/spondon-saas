import {NextResponse} from "next/server";
import {createClient} from "@/lib/supabase/server";

const ADMIN_EMAIL="spondon2020official@gmail.com";
const fields=["id","public_reference","organisation_id","event_id","applicant_name","email","phone","whatsapp_number","pujo_name","address","notes","status","submitted_by_user_id","reviewed_by_user_id","reviewed_at","created_at","updated_at","theme","artist_name"] as const;

function xmlEscape(value:unknown){return String(value??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&apos;");}

export async function GET(){
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user||((user.email||"").toLowerCase()!==ADMIN_EMAIL))return NextResponse.json({error:"Unauthorised"},{status:401});
  const {data,error}=await supabase.schema("spondon").from("pujo_registrations").select("*").order("created_at",{ascending:false});
  if(error)return NextResponse.json({error:"Could not export registrations"},{status:500});
  const header=fields.map((field)=>`<Cell><Data ss:Type="String">${xmlEscape(field)}</Data></Cell>`).join("");
  const rows=(data||[]).map((row:any)=>`<Row>${fields.map((field)=>`<Cell><Data ss:Type="String">${xmlEscape(row[field])}</Data></Cell>`).join("")}</Row>`).join("");
  const workbook=`<?xml version="1.0"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Worksheet ss:Name="Registrations"><Table><Row>${header}</Row>${rows}</Table></Worksheet></Workbook>`;
  const stamp=new Date().toISOString().slice(0,10);
  return new NextResponse(workbook,{status:200,headers:{"Content-Type":"application/vnd.ms-excel; charset=utf-8","Content-Disposition":`attachment; filename="spondon-pujo-registrations-${stamp}.xls"`,`Cache-Control":"no-store"}});
}
