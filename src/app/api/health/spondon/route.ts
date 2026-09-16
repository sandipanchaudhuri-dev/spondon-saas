import {NextResponse} from "next/server";
import {createClient} from "@supabase/supabase-js";

export const dynamic="force-dynamic";

export async function GET(){
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if(!url||!key){
    console.error("Spondon healthcheck failed: Supabase configuration missing");
    return NextResponse.json({ok:false,service:"spondon",error:"configuration_missing"},{status:503});
  }

  try{
    const db=createClient(url,key,{auth:{persistSession:false}});
    const {data,error}=await db.rpc("spondon_healthcheck");
    if(error){
      console.error("Spondon healthcheck RPC failed",{code:error.code,message:error.message,details:error.details,hint:error.hint});
      return NextResponse.json({ok:false,service:"spondon",error:"database_unavailable"},{status:503});
    }

    const result=Array.isArray(data)?data[0]:data;
    if(!result?.ok){
      console.error("Spondon healthcheck returned unhealthy result");
      return NextResponse.json({ok:false,service:"spondon",error:"unhealthy"},{status:503});
    }

    return NextResponse.json({
      ok:true,
      service:"spondon",
      event_count:Number(result.event_count??0),
      checked_at:result.checked_at??new Date().toISOString()
    },{
      status:200,
      headers:{"cache-control":"no-store, max-age=0"}
    });
  }catch(error){
    console.error("Spondon healthcheck failed",error instanceof Error?error.message:String(error));
    return NextResponse.json({ok:false,service:"spondon",error:"unexpected_failure"},{status:503});
  }
}
