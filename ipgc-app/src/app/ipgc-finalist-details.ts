/** Public, current registration-sourced finalist metadata.
 * Database lookup failures must never masquerade as "Not provided".
 */
export type RegisteredFinalist=Readonly<{
 registration_ref:string;club_name:string;puja_name:string|null;
 locality:string|null;district:string|null;venue_address:string|null;
 established_year:number|null;theme:string|null;theme_artist:string|null;
 idol_artist:string|null;maps_url:string|null;
}>;
export async function loadFinalistDetails():Promise<Record<string,RegisteredFinalist>>{
 const base=process.env.SUPABASE_URL;
 const key=process.env.SUPABASE_PUBLISHABLE_KEY;
 if(!base||!key)throw Error('IPGC registration data configuration unavailable');
 const response=await fetch(new URL('/rest/v1/rpc/ipgc_public_finalist_details',base),{
  method:'POST',headers:{apikey:key,'Content-Type':'application/json'},body:'{}',cache:'no-store'
 });
 if(!response.ok)throw Error('IPGC registration lookup failed: HTTP '+response.status);
 const rows:unknown=await response.json();
 if(!Array.isArray(rows))throw Error('Unexpected IPGC registration lookup response');
 const out:Record<string,RegisteredFinalist>=Object.create(null);
 for(const row of rows as RegisteredFinalist[]){
  if(typeof row?.registration_ref!=='string'||!row.registration_ref.trim()||
     typeof row?.club_name!=='string'||!row.club_name.trim())throw Error('Incomplete mandatory finalist identity');
  if(out[row.registration_ref])throw Error('Duplicate approved finalist registration: '+row.registration_ref);
  out[row.registration_ref]=row;
 }
 if(Object.keys(out).length!==15)throw Error('Finalist registration mismatch: '+Object.keys(out).length+' of 15');
 return out;
}
export function registeredMapHref(info:RegisteredFinalist):string|null{
 const link=info.maps_url;
 if(link&&/^https:\/\/(?:maps\.app\.goo\.gl|www\.google\.com\/maps|share\.google)\//.test(link))return link;
 const query=info.venue_address||[info.locality,info.district].filter(Boolean).join(', ');
 return query?'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(query):null;
}