import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const RUN_ID = "5dfe6e8a-304e-428d-b521-3441edd9cb18";
const FINALIST_REGISTRATIONS = new Set([
"6d4c6985-c35b-4e71-a0d0-54cc694defa7","4b79c793-cd74-4857-a6c8-71f3bcf2709a",
"ff1790b0-a739-49c5-88a6-c6bde161c4ee","60d30dfb-b3a7-4a1f-8144-aad272de7b58",
"fee27bfa-031e-4a91-aaea-4acb25774a21","d2fe65f1-3ec4-4b33-88b6-c56289d1bfea",
"745cc9cf-43e3-44f8-8cc4-287f0b5d5ff4","a9681936-5471-485b-a9c9-21d14ac32dfc",
"26944f33-14c3-4b83-bc08-97004e7c3055","f191a626-460b-4703-8b86-2478af364a0f",
"0540857c-2c56-4a6e-9750-feaab8f08ad6","993f7946-c6b5-4f71-98e8-cd5f754319f9",
"628c6f91-14c9-4b2c-ba6f-e3432ad003be","9a6bdfc7-63cc-47b0-95e0-86bae77ca3a7",
"79f0d909-cd5f-4c4b-9211-0b556178ef39"
]);
const headers = {"Content-Type":"text/plain; charset=utf-8","Cache-Control":"no-store","X-Content-Type-Options":"nosniff"};
function error(status:number){return new Response(status===404?"Not found":"Unavailable",{status,headers});}
Deno.serve(async request=>{
 if(request.method!=="GET")return error(405);
 const id=new URL(request.url).searchParams.get("photo_id")||"";
 if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id))return error(404);
 const url=Deno.env.get("SUPABASE_URL"), key=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
 if(!url||!key)return error(503);
 const db=createClient(url,key,{auth:{autoRefreshToken:false,persistSession:false}});
 const {data:photo,error:pe}=await db.from("sera_field_media").select("id,visit_id,storage_path,mime_type").eq("id",id).maybeSingle();
 if(pe||!photo||!["image/jpeg","image/png","image/webp"].includes(photo.mime_type)||!photo.storage_path)return error(404);
 const {data:visit,error:ve}=await db.from("sera_field_visits").select("judgment_pujo_id").eq("id",photo.visit_id).maybeSingle();
 if(ve||!visit)return error(404);
 const {data:pujo,error:je}=await db.from("sera_judgment_pujos").select("judgment_run_id,source_row_id").eq("id",visit.judgment_pujo_id).maybeSingle();
 if(je||!pujo||pujo.judgment_run_id!==RUN_ID||!FINALIST_REGISTRATIONS.has(pujo.source_row_id))return error(404);
 const {data:blob,error:se}=await db.storage.from("sera-field-evidence").download(photo.storage_path);
 if(se||!blob)return error(404);
 return new Response(blob.stream(),{status:200,headers:{
  "Content-Type":photo.mime_type,
  "Cache-Control":"public, max-age=900, s-maxage=3600",
  "X-Content-Type-Options":"nosniff",
  "Content-Disposition":"inline",
  "Access-Control-Allow-Origin":"https://ipgc.in"
 }});
});