"use client";
import {useEffect,useState,type ChangeEvent} from "react";
const endpoint="https://rcfdlnbvnidlxwptcoky.supabase.co/functions/v1/ipgc-media-upload";
type Details={club:string;reference:string;limits:{photoMB:number;videoMB:number};allowed:string[]};
type UploadFile={file:File;state:"waiting"|"uploading"|"done"|"error";message?:string};
async function request(token:string,action:string,other:Record<string,unknown>={}){
 const response=await fetch(endpoint,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({token,action,...other}),cache:"no-store"});
 const data=await response.json();
 if(!response.ok)throw new Error(data.error||"Unable to process request");
 return data;
}
export default function MediaUpload({token}:{token:string}){
 const [details,setDetails]=useState<Details|null>(null),[error,setError]=useState(""),[loading,setLoading]=useState(true),[busy,setBusy]=useState(false),[files,setFiles]=useState<UploadFile[]>([]);
 useEffect(()=>{request(token,"details").then(setDetails).catch(e=>setError(e.message)).finally(()=>setLoading(false))},[token]);
 function choose(e:ChangeEvent<HTMLInputElement>){const incoming=Array.from(e.target.files||[]);setFiles(old=>[...old,...incoming.map(file=>({file,state:"waiting" as const}))]);e.target.value="";}
 async function upload(){
  if(!details||busy)return;
  setBusy(true);setError("");
  for(let i=0;i<files.length;i++){
   const item=files[i];if(item.state==="done")continue;
   const max=item.file.type.startsWith("video/")?details.limits.videoMB:details.limits.photoMB;
   if(!details.allowed.includes(item.file.type)||item.file.size>max*1024*1024||item.file.size===0){
    setFiles(old=>old.map((v,j)=>j===i?{...v,state:"error",message:"Unsupported format or file too large"}:v));continue;
   }
   try{
    setFiles(old=>old.map((v,j)=>j===i?{...v,state:"uploading"}:v));
    const prepared=await request(token,"prepare",{filename:item.file.name,type:item.file.type,size:item.file.size});
    const response=await fetch(prepared.uploadUrl,{method:"PUT",headers:{"content-type":item.file.type},body:item.file});
    if(!response.ok)throw new Error("Transfer failed — please retry");
    await request(token,"complete",{path:prepared.path});
    setFiles(old=>old.map((v,j)=>j===i?{...v,state:"done",message:"Received"}:v));
   }catch(e){setFiles(old=>old.map((v,j)=>j===i?{...v,state:"error",message:e instanceof Error?e.message:"Upload failed"}:v));}
  }
  setBusy(false);
 }
 const pending=files.some(f=>f.state!=="done");
 return <main style={{maxWidth:740,margin:"36px auto",padding:"0 18px 70px",fontFamily:"Arial,sans-serif"}}>
   <div style={{background:"#fff",border:"1px solid #ebdfd3",borderRadius:18,padding:"clamp(20px,5vw,40px)",boxShadow:"0 12px 45px #452a1812"}}>
    <div style={{color:"#9b3131",fontSize:12,letterSpacing:2,fontWeight:800}}>IPGC · SHYAMA SAMMAN 2026</div>
    <h1 style={{fontSize:"clamp(30px,5vw,45px)",margin:"14px 0"}}>Submit Puja Photos &amp; Videos</h1>
    {loading?<p>Verifying your submission link…</p>:error&&!details?<p role="alert" style={{color:"#a52625"}}>{error}</p>:details&&<>
     <section style={{background:"#fff7eb",padding:18,borderRadius:12,marginBottom:24}}>
      <div style={{fontSize:12,color:"#715f57"}}>REGISTERED COMMITTEE</div><strong>{details.club}</strong>
      <div style={{marginTop:8,fontSize:13}}>Registration number: <strong>{details.reference}</strong></div>
     </section>
     <p>Share photographs of your idol, theme, decorations and rituals, along with short videos of this year's celebration. You can return to this link to add more files.</p>
     <p style={{color:"#715f57",fontSize:13}}>Supported: JPG, PNG, WebP, HEIC, MP4, MOV and WebM. Maximum {details.limits.photoMB} MB per photograph and {details.limits.videoMB} MB per video. Please obtain permission before uploading images of individuals.</p>
     <label style={{display:"block",border:"2px dashed #bfaaa0",borderRadius:14,padding:"28px 12px",textAlign:"center",cursor:"pointer",background:"#fffaf5"}}>
      <strong>+ Choose photos or videos</strong><div style={{fontSize:13,color:"#715f57",marginTop:8}}>Select multiple files from your phone or computer</div>
      <input aria-label="Choose photos and videos" type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif,video/mp4,video/quicktime,video/webm" multiple onChange={choose} style={{display:"block",maxWidth:"100%",margin:"12px auto 0"}}/>
     </label>
     {files.length>0&&<div style={{marginTop:20}}>
      {files.map((item,i)=><div key={i} style={{borderBottom:"1px solid #eee",padding:"10px 0",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
       <span style={{overflowWrap:"anywhere",fontSize:13}}>{item.file.name} <small>({(item.file.size/1024/1024).toFixed(1)} MB)</small></span>
       <span style={{color:item.state==="error"?"#a52625":item.state==="done"?"#18794e":"#715f57",fontSize:12,flexShrink:0}}>{item.message||item.state}</span>
      </div>)}
      <button type="button" onClick={upload} disabled={busy||!pending} style={{background:"#9d2b2b",color:"white",border:0,borderRadius:10,padding:"14px 18px",fontWeight:700,width:"100%",marginTop:20,cursor:"pointer"}}>{busy?"Uploading…":pending?"Upload selected files":"All files received ✓"}</button>
      {files.some(f=>f.state==="done")&&<p role="status" style={{color:"#18794e",fontWeight:600}}>Successfully uploaded files are recorded against your registration.</p>}
     </div>}
    </>}
    <p style={{fontSize:13,marginTop:25,color:"#715f57"}}>Need another submission option? Email <a href="mailto:ifest.pujoonline@gmail.com">ifest.pujoonline@gmail.com</a> or WhatsApp <a href="https://wa.me/919830449955">+91 9830449955</a>. Mention your registration number.</p>
   </div>
  </main>;
}