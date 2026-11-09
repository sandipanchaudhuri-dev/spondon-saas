import {NextRequest} from 'next/server'
import {loadPublishedAlbums} from '../../ipgc-gallery'
import {processGalleryPhoto,PUBLIC_PHOTO_POLICY} from '../../../lib/photo-processing'

export const runtime='nodejs'
export const dynamic='force-dynamic'
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const kinds=new Set(['official','field','jury','curated'])
function error(code:number,message:string){return Response.json({error:message},{status:code,headers:{'Cache-Control':'no-store'}})}

export async function GET(request:NextRequest){
  const id=request.nextUrl.searchParams.get('id')||''
  const kind=request.nextUrl.searchParams.get('kind')||''
  if (!uuid.test(id)||!kinds.has(kind))return error(404,'Not found')
  try {
    const albums=await loadPublishedAlbums()
    const record=Object.values(albums).flat().find(p=>p.id===id&&p.kind===kind)
    if(!record)return error(404,'Not published')
    const url=new URL(record.src)
    const base=new URL(process.env.SUPABASE_URL||'https://rcfdlnbvnidlxwptcoky.supabase.co')
    if(url.origin!==base.origin||(!url.pathname.startsWith('/storage/v1/object/public/')&&url.pathname!=='/functions/v1/ipgc-finalist-photo'))return error(404,'Invalid media origin')
    const upstream=await fetch(url,{cache:'no-store',signal:AbortSignal.timeout(20000)})
    if(!upstream.ok||!upstream.headers.get('content-type')?.startsWith('image/'))return error(502,'Source unavailable')
    const statedSize=Number(upstream.headers.get('content-length')||0)
    if(statedSize>PUBLIC_PHOTO_POLICY.maxInputBytes)return error(413,'Source too large')
    const bytes=Buffer.from(await upstream.arrayBuffer())
    const output=await processGalleryPhoto(bytes)
    return new Response(new Uint8Array(output),{status:200,headers:{
      'Content-Type':'image/jpeg',
      'Content-Length':String(output.length),
      'Content-Disposition':'inline',
      'X-Content-Type-Options':'nosniff',
      'Cache-Control':'public, max-age=60, s-maxage=300',
    }})
  }catch(e){
    console.error('IPGC gallery image processing failed',e instanceof Error?e.message:'Unknown error')
    return error(502,'Image processing unavailable')
  }
}