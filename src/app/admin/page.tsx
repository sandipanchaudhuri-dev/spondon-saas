import {createClient} from "@/lib/supabase/server";
import {RegistrationAdmin} from "./registration-admin";

export default async function AdminPage(){
  let supabase;
  try{supabase=await createClient()}catch{return <main className="login"><div className="alert error">Connect the Spondon Supabase project to enable the admin workspace.</div></main>}

  const {data,error}=await supabase.schema("spondon").from("pujo_registrations").select("*").order("created_at",{ascending:false});
  if(error)return <main className="login"><div className="alert error">Could not load Spondon registrations.</div></main>;
  return <RegistrationAdmin initial={data||[]}/>;
}
