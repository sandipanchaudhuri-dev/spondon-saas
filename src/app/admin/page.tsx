import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import {RegistrationAdmin} from "./registration-admin";

const ADMIN_EMAIL="spondon2020official@gmail.com";

export default async function AdminPage(){
  let supabase;
  try{supabase=await createClient()}catch{return <main className="login"><div className="alert error">Connect the Spondon Supabase project to enable the admin workspace.</div></main>}
  const {data:{user}}=await supabase.auth.getUser();
  if(!user)redirect("/admin/login");
  if((user.email||"").toLowerCase()!==ADMIN_EMAIL)redirect("/admin/login?unauthorized=1");

  const {data,error}=await supabase.schema("spondon").from("pujo_registrations").select("*").order("created_at",{ascending:false});
  if(error)return <main className="login"><div className="alert error">This account is not authorised to read Spondon registrations.</div></main>;
  return <RegistrationAdmin initial={data||[]} email={user.email||ADMIN_EMAIL}/>;
}
