"use client";
import {useCallback,useEffect,useRef,useState} from "react";
type Photo={src:string;alt:string};
export default function FinalistAlbum({photos,name}:{photos:readonly Photo[];name:string}){
 const [selected,setSelected]=useState<number|null>(null);
 const dialog=useRef<HTMLDialogElement>(null);
 const touch=useRef<number|null>(null);
 const change=useCallback((offset:number)=>setSelected(i=>i===null?null:(i+offset+photos.length)%photos.length),[photos.length]);
 useEffect(()=>{const d=dialog.current;if(!d)return;if(selected!==null&&!d.open)d.showModal();else if(selected===null&&d.open)d.close()},[selected]);
 useEffect(()=>{
  if(selected===null)return;
  function onKey(e:KeyboardEvent){if(e.key==="ArrowRight"){e.preventDefault();change(1)}else if(e.key==="ArrowLeft"){e.preventDefault();change(-1)}}
  window.addEventListener("keydown",onKey);
  return()=>window.removeEventListener("keydown",onKey);
 },[selected,change]);
 if(!photos.length)return <div className="ipgc-album-empty">No photographs uploaded for this finalist yet.</div>;
 const current=selected!==null?photos[selected]:null;
 return <>
  <div className="ipgc-album-grid" aria-label={name+" photo gallery"}>
   {photos.map((photo,index)=><button className="ipgc-album-thumb" key={photo.src} type="button" onClick={()=>setSelected(index)} aria-label={`Open photograph ${index+1} of ${photos.length}`}>
    <img src={photo.src} alt={photo.alt} loading={index<2?"eager":"lazy"}/>
    <span className="ipgc-album-zoom" aria-hidden="true">↗</span>
   </button>)}
  </div>
  <dialog ref={dialog} className="ipgc-lightbox" aria-label={name+" photo viewer"} onClose={()=>setSelected(null)} onClick={e=>{if(e.currentTarget===e.target)setSelected(null)}}>
   {current&&<div className="ipgc-lightbox-inner">
    <div className="ipgc-lightbox-top"><span>{name}</span><span className="ipgc-lightbox-count">{selected!+1} / {photos.length}</span><button type="button" className="ipgc-lightbox-close" onClick={()=>setSelected(null)} aria-label="Close viewer">✕</button></div>
    <div className="ipgc-lightbox-stage" onTouchStart={e=>touch.current=e.touches[0]?.clientX??null} onTouchEnd={e=>{if(touch.current===null)return;const dx=(e.changedTouches[0]?.clientX??touch.current)-touch.current;touch.current=null;if(Math.abs(dx)>55)change(dx<0?1:-1)}}>
     <button type="button" className="ipgc-lightbox-nav ipgc-lightbox-prev" onClick={()=>change(-1)} aria-label="Previous photograph">‹</button>
     <img src={current.src} alt={current.alt}/>
     <button type="button" className="ipgc-lightbox-nav ipgc-lightbox-next" onClick={()=>change(1)} aria-label="Next photograph">›</button>
    </div>
    <div className="ipgc-lightbox-bottom"><span>{current.alt}</span><span>Use arrows or swipe to browse</span></div>
   </div>}
  </dialog>
 </>;
}