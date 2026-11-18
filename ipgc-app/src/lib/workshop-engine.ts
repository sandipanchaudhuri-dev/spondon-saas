export type Workshop = {id:string;slug:string;title:string;subtitle:string|null;description:string|null;workshop_number:string|null;workshop_date:string|null;start_time:string|null;venue:string|null;city:string|null;mentor:string|null;model_name:string|null;fee_inr:number|null;includes_lunch:boolean;contact_phone:string|null;secondary_phone:string|null;poster_url:string|null;poster_path:string|null;status?:string;extraction_status?:string;created_at?:string};
export const fields=["title","slug","description","workshop_date","venue","contact_phone","poster_url"] as const;
export function missingMandatory(w:Partial<Workshop>){return fields.filter(k=>!String(w[k]??"").trim());}
export function posterUrl(w:Workshop){if(w.poster_url?.startsWith("/"))return w.poster_url;if(w.poster_url?.startsWith("https://"))return w.poster_url;return w.poster_path&&process.env.SUPABASE_URL?process.env.SUPABASE_URL+"/storage/v1/object/public/ipgc-workshop-posters/"+w.poster_path:"";}
export async function publishedWorkshops():Promise<Workshop[]>{
 const base=process.env.SUPABASE_URL,key=process.env.SUPABASE_PUBLISHABLE_KEY;
 if(!base||!key)return [];
 const response=await fetch(base+"/rest/v1/rpc/ipgc_workshop_public_list",{method:"POST",headers:{"content-type":"application/json",apikey:key,Authorization:"Bearer "+key},body:"{}",cache:"no-store"});
 if(!response.ok)throw new Error("Workshop catalogue temporarily unavailable");
 return await response.json() as Workshop[];
}
export function whatsappLink(w:Workshop){const phone=(w.contact_phone||"").replace(/\D/g,"");return phone?"https://wa.me/"+phone+"?text="+encodeURIComponent("Hello IPGC, I would like to enquire about "+w.title+" ("+(w.workshop_date||"upcoming workshop")+"). Please share availability and registration details."):"#";}
export function dateLabel(d:string|null){if(!d)return "Date to be announced";return new Date(d+"T12:00:00Z").toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric",timeZone:"UTC"});}
