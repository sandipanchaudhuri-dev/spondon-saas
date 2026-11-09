import { createClient } from "npm:@supabase/supabase-js@2.57.4";

// Public image access is derived from live active finalist records, never code-side club IDs.
const RUN_CODE = "ipgc-shyama-samman-2026-kolkata";
const headers = {
  "Cache-Control": "no-store",
  "Content-Type": "text/plain; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
  "Access-Control-Allow-Origin": "https://ipgc.in",
};
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function deny(status: number): Response {
  return new Response(status === 404 ? "Not found" : "Unavailable", { status, headers });
}
Deno.serve(async (request) => {
  if (request.method !== "GET") return deny(405);
  const url = new URL(request.url);
  const photoId = url.searchParams.get("photo_id") ?? "";
  const source = url.searchParams.get("source") === "jury" ? "jury" : "field";
  if (!uuid.test(photoId)) return deny(404);
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) return deny(503);
  const db = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  let judgmentPujoId: string | undefined;
  let storagePath: string | undefined;
  let mimeType: string | undefined;
  if (source === "field") {
    const { data: photo, error } = await db.from("sera_field_media")
      .select("id,visit_id,storage_path,mime_type,purpose,saved_at,review_status")
      .eq("id", photoId).maybeSingle();
    if (error || !photo || !photo.saved_at || photo.purpose !== "visit" ||
        photo.review_status === "rejected" || !["image/jpeg", "image/png", "image/webp"].includes(photo.mime_type) ||
        !photo.storage_path) return deny(404);
    const { data: visit, error: ve } = await db.from("sera_field_visits")
      .select("judgment_pujo_id,status").eq("id", photo.visit_id).maybeSingle();
    if (ve || !visit || visit.status !== "complete") return deny(404);
    judgmentPujoId = visit.judgment_pujo_id;
    storagePath = photo.storage_path;
    mimeType = photo.mime_type;
  } else {
    const { data: photo, error } = await db.from("sera_jury_visit_media")
      .select("id,visit_id,storage_path,media_type,status")
      .eq("id", photoId).maybeSingle();
    if (error || !photo || !photo.storage_path ||
        ["rejected", "failed", "deleted", "removed"].includes(photo.status ?? "") ||
        !(photo.media_type === "photo" || /^image\/(jpeg|png|webp)$/.test(photo.media_type ?? ""))) return deny(404);
    const { data: visit, error: ve } = await db.from("sera_jury_visits")
      .select("judgment_pujo_id").eq("id", photo.visit_id).maybeSingle();
    if (ve || !visit) return deny(404);
    judgmentPujoId = visit.judgment_pujo_id;
    storagePath = photo.storage_path;
  }
  const { data: j, error: je } = await db.from("sera_judgment_pujos")
    .select("id,judgment_run_id,pujo_id,source_row_id,pool_status")
    .eq("id", judgmentPujoId!).maybeSingle();
  if (je || !j || j.pool_status !== "active" || !uuid.test(j.source_row_id ?? "")) return deny(404);
  const [
    { data: run }, { data: finalist },
    { data: registration }, { data: pujo }, { data: excluded },
  ] = await Promise.all([
    db.from("sera_judgment_runs").select("code").eq("id", j.judgment_run_id).maybeSingle(),
    db.from("sera_final_round_entries").select("id").eq("judgment_pujo_id", j.id).eq("judgment_run_id", j.judgment_run_id).eq("status", "active").limit(1).maybeSingle(),
    db.schema("ipgc").from("registrations").select("id").eq("id", j.source_row_id).maybeSingle(),
    db.from("pujos").select("active").eq("id", j.pujo_id).maybeSingle(),
    db.from("competition_gallery_exclusions").select("source_id").eq("judgment_run_id", j.judgment_run_id).eq("source_kind", source).eq("source_id", photoId).maybeSingle(),
  ]);
  if (run?.code !== RUN_CODE || !finalist || !registration || !pujo?.active || excluded) return deny(404);
  // The upload pipelines use private evidence buckets. Never publish a storage path directly.
  const candidates = source === "field" ? ["sera-field-evidence"] : ["sera-field-evidence", "pujo-visit-photos"];
  for (const bucket of candidates) {
    const { data: blob, error } = await db.storage.from(bucket).download(storagePath!);
    if (error || !blob) continue;
    const verifiedType = mimeType ?? blob.type;
    if (!["image/jpeg", "image/png", "image/webp"].includes(verifiedType)) return deny(404);
    return new Response(blob.stream(), {
      status: 200,
      headers: {
        "Content-Type": verifiedType,
        "Content-Disposition": "inline",
        "Cache-Control": "public, max-age=300, s-maxage=300",
        "X-Content-Type-Options": "nosniff",
        "Access-Control-Allow-Origin": "https://ipgc.in",
      },
    });
  }
  return deny(404);
});
