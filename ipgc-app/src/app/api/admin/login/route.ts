import {NextRequest,NextResponse} from "next/server";
const allowed=(process.env.IPGC_ADMIN_ALLOWED_EMAILS||"sandipan.chaudhuri@gmail.com").toLowerCase().split(",").map(x=>x.trim()).filter(Boolean);
export async function POST(request:NextRequest){
 const base=process.env.SUPABASE_URL,key=process.env.SUPABASE_PUBLISHABLE_KEY;
 if(!base||!key)return NextResponse.json({error:"Authentication unavailable"},{status:503});
 let body:unknown;try{body=await request.json()}catch{return NextResponse.json({error:"Invalid request"},{status:400})}
 if(!body||typeof body!=="object")return NextResponse.json({error:"Invalid request"},{status:400});
 const d=body as Record<string,unknown>,email=String(d.email||"").trim().toLowerCase();
 if(!allowed.includes(email))return NextResponse.json({error:"This email is not authorised for IPGC administration"},{status:403});
 const headers={"content-type":"application/json",apikey:key};
 try{
  if(d.action==="request"){
   const r=await fetch(base+"/auth/v1/otp",{method:"POST",headers,body:JSON.stringify({email,create_user:false}),cache:"no-store"});
   if(!r.ok)return NextResponse.json({error:"Unable to send code. Check Supabase email OTP configuration."},{status:400});
   return NextResponse.json({sent:true},{headers:{"cache-control":"no-store"}});
  }
  if(d.action==="verify"){
   if(typeof d.code!=="string"||!/^[0-9]{6,8}$/.test(d.code))return NextResponse.json({error:"Enter the numeric email code"},{status:400});
   const r=await fetch(base+"/auth/v1/verify",{method:"POST",headers,body:JSON.stringify({email,token:d.code,type:"email"}),cache:"no-store"});
   const auth=await r.json();
   if(!r.ok||!auth.access_token)return NextResponse.json({error:"Code expired or invalid"},{status:401});
   const claim=await fetch(base+"/rest/v1/rpc/ipgc_claim_admin_email",{method:"POST",headers:{...headers,Authorization:"Bearer "+auth.access_token},body:"{}",cache:"no-store"});
   if(!claim.ok||await claim.json()!==true)return NextResponse.json({error:"Email not authorised for admin access"},{status:403});
   return NextResponse.json({token:auth.access_token},{headers:{"cache-control":"no-store"}});
  }
  return NextResponse.json({error:"Unsupported request"},{status:400});
 }catch{return NextResponse.json({error:"Authentication service unavailable"},{status:503})}
}