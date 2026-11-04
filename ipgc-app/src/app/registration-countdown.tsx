"use client";
import {useEffect,useState} from "react";
export const IPGC_CLOSING_AT = Date.parse("2026-11-04T19:00:00+05:30");
export function RegistrationCountdown(){
 const [remaining,setRemaining]=useState<number|null>(null);
 useEffect(()=>{const refresh=()=>setRemaining(Math.max(0,IPGC_CLOSING_AT-Date.now()));refresh();const id=setInterval(refresh,1000);return()=>clearInterval(id)},[]);
 const closed=remaining!==null&&remaining<=0;
 const hours=Math.floor((remaining??0)/3600000);
 const minutes=Math.floor(((remaining??0)%3600000)/60000);
 const seconds=Math.floor(((remaining??0)%60000)/1000);
 return <section className="ipgc-countdown" role="status" aria-live="off">
   <strong>{closed?"Registration closed":"Registration closes at 7 PM IST today"}</strong>
   <span>{closed?"Closed at 7:00 PM IST · 4 November 2026":remaining===null?"4 November 2026 · 7:00 PM IST":`${String(hours).padStart(2,"0")}h : ${String(minutes).padStart(2,"0")}m : ${String(seconds).padStart(2,"0")}s remaining`}</span>
 </section>
}