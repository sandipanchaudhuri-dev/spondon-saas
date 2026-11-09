/** Live IPGC finalist media, sourced from one publication policy in Supabase.
 * The publishable key is used server-side only. Never expose private evidence URLs.
 * No cache: new public uploads appear without rebuilding or redeploying the app.
 */
export type PublishedPhoto = Readonly<{ src: string; alt: string }>;
type GalleryRow = {
  registration_ref: string;
  source_kind: string;
  source_id: string;
  src: string;
  alt: string;
  uploaded_at: string | null;
};
export async function loadPublishedAlbums(): Promise<Record<string, PublishedPhoto[]>> {
  const base = process.env.SUPABASE_URL;
  const apikey = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!base || !apikey) throw new Error("IPGC gallery database configuration is unavailable");
  const response = await fetch(new URL("/rest/v1/rpc/ipgc_public_gallery", base), {
    method: "POST",
    headers: {"apikey": apikey, "Content-Type": "application/json"},
    body: "{}",
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`IPGC gallery query failed: HTTP ${response.status}`);
  const payload: unknown = await response.json();
  if (!Array.isArray(payload)) throw new Error("IPGC gallery returned an invalid response");
  const albums: Record<string, PublishedPhoto[]> = Object.create(null);
  for (const item of payload as GalleryRow[]) {
    if (typeof item?.registration_ref !== "string" ||
        typeof item?.src !== "string" || typeof item?.alt !== "string") continue;
    // All media are selected by the DB's active-finalist/publication policy.
    const photos = albums[item.registration_ref] ?? (albums[item.registration_ref] = []);
    if (!photos.some((photo) => photo.src === item.src)) {
      photos.push({src: item.src, alt: item.alt});
    }
  }
  return albums;
}
