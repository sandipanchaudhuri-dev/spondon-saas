import { createClient } from "npm:@supabase/supabase-js@2.57.4";

// The SQL publication policy is authoritative for both listing and private-image access.
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
  let storagePath: string | undefined;
  let mimeType: string | undefined;
  if (source === "field") {
    const { data: photo, error } = await db.from("sera_field_media")
      .select("id,storage_path,mime_type").eq("id", photoId).maybeSingle();
    if (error || !photo || !photo.storage_path ||
        !["image/jpeg", "image/png", "image/webp"].includes(photo.mime_type)) return deny(404);
    storagePath = photo.storage_path;
    mimeType = photo.mime_type;
  } else {
    const { data: photo, error } = await db.from("sera_jury_visit_media")
      .select("id,storage_path,media_type").eq("id", photoId).maybeSingle();
    if (error || !photo || !photo.storage_path ||
        !(photo.media_type === "photo" || /^image\/(jpeg|png|webp)$/.test(photo.media_type ?? ""))) return deny(404);
    storagePath = photo.storage_path;
  }
  // SQL checks exact competition, active finalist, correct parent Pujo, and exclusion policy.
  const { data: allowed, error: permissionError } = await db.rpc("ipgc_gallery_photo_allowed", {
    p_photo_id: photoId,
    p_source_kind: source,
  });
  if (permissionError || allowed !== true) return deny(404);
  // Private buckets remain private. Only the image bytes are served after DB authorisation.
  const buckets = source === "field" ? ["sera-field-evidence"] :
    ["sera-field-evidence", "pujo-visit-photos"];
  for (const bucket of buckets) {
    const { data: blob, error } = await db.storage.from(bucket).download(storagePath!);
    if (error || !blob) continue;
    const type = mimeType ?? blob.type;
    if (!["image/jpeg", "image/png", "image/webp"].includes(type)) return deny(404);
    return new Response(blob.stream(), {
      status: 200,
      headers: {
        "Content-Type": type,
        "Content-Disposition": "inline",
        "Cache-Control": "public, max-age=300, s-maxage=300",
        "X-Content-Type-Options": "nosniff",
        "Access-Control-Allow-Origin": "https://ipgc.in",
      },
    });
  }
  return deny(404);
});
