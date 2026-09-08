import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import {AdminDashboard} from "./admin-dashboard";

const ADMIN_EMAIL="spondon2020official@gmail.com";

export default async function AdminPage(){
  let supabase;
  try{supabase=await createClient()}catch{return <main className="login"><div className="alert error">Connect the Spondon Supabase project to enable the admin workspace.</div></main>}
  const {data:{user}}=await supabase.auth.getUser();
  if(!user)redirect("/admin/login");
  if((user.email||"").toLowerCase()!==ADMIN_EMAIL)redirect("/admin/login?unauthorized=1");

  const db=supabase.schema("spondon");
  const [registrations,banners,allocations,distributions]=await Promise.all([
    db.from("pujo_registrations").select("*").order("created_at",{ascending:false}),
    db.from("banners").select("*").order("created_at",{ascending:false}),
    db.from("banner_allocations").select("*").order("created_at",{ascending:false}),
    db.from("banner_distributions").select("*").order("created_at",{ascending:false})
  ]);
  if(registrations.error)return <main className="login"><div className="alert error">This account is not authorised to read Spondon registrations.</div></main>;
  return <AdminDashboard initial={registrations.data||[]} initialBanners={banners.data||[]} initialAllocations={allocations.data||[]} distributions={distributions.data||[]} email={user.email||"Admin"}/>;
}
