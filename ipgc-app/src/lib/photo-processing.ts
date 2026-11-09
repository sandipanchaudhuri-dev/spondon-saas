import sharp from 'sharp'

/** Delivery-only policy. The untouched original remains stored as evidence. */
export const PUBLIC_PHOTO_POLICY = Object.freeze({
  maxDeliveredBytes: 1_000_000,
  maxInputBytes: 25_000_000,
  maxInputPixels: 45_000_000,
  maxDimension: 2048,
})

const bound = (n: number, low: number, high: number) => Math.min(high, Math.max(low, n))
type ColourTuning = {gain: [number, number, number]; saturation: number}

/** Gentle scene-aware correction: preserve candlelight and deliberate colour casts. */
async function analyseLighting(input: Buffer): Promise<ColourTuning> {
  const {data, info} = await sharp(input, {limitInputPixels: PUBLIC_PHOTO_POLICY.maxInputPixels})
    .rotate().resize({width: 144, height: 144, fit: 'inside', withoutEnlargement: true})
    .flatten({background: '#18141a'}).removeAlpha().toColourspace('srgb')
    .raw().toBuffer({resolveWithObject: true})
  const luminances: number[] = []
  let nr = 0, ng = 0, nb = 0, neutral = 0, saturationSum = 0
  for (let i = 0; i < info.width * info.height; i++) {
    const p = i * info.channels
    const r = data[p], g = data[p+1], b = data[p+2]
    const hi = Math.max(r,g,b), lo = Math.min(r,g,b)
    const luma = .2126*r + .7152*g + .0722*b
    luminances.push(luma)
    saturationSum += hi > 0 ? (hi - lo)/hi : 0
    if (luma >= 65 && luma <= 205 && hi-lo <= 12) {
      nr += r; ng += g; nb += b; neutral++
    }
  }
  const count = luminances.length
  luminances.sort((a,b) => a-b)
  const q50 = luminances[Math.floor(count*.50)] ?? 100
  const q90 = luminances[Math.floor(count*.90)] ?? 200
  const lowKey = q50 < 48 && q90 > 155
  const exposure = !lowKey && q90 < 145 && q50 >= 25 ? 1.06
    : q50 > 185 && q90 > 244 ? .97 : 1
  let channels: [number,number,number] = [1,1,1]
  if (neutral >= Math.max(100, Math.ceil(count*.08))) {
    const avg = (nr+ng+nb)/(3*neutral)
    channels = [nr,ng,nb].map(x => bound(avg/(x/neutral), .97, 1.03)) as [number,number,number]
  }
  const satMean = saturationSum / Math.max(1,count)
  const saturation = satMean < .24 ? 1.02 : 1
  return {gain: channels.map(g => bound(g*exposure,.94,1.09)) as [number,number,number],saturation}
}

/** Progressive JPEG delivery preview, never more than 1,000,000 bytes. */
export async function processGalleryPhoto(original: Buffer): Promise<Buffer> {
  if (original.length===0 || original.length>PUBLIC_PHOTO_POLICY.maxInputBytes) {
    throw new Error('Source image exceeds processing limit')
  }
  const {gain,saturation}=await analyseLighting(original)
  for (const dimension of [2048,1800,1600,1400,1200,960,760,600,480]) {
    for (const quality of [82,72,62,50,38]) {
      const output=await sharp(original,{limitInputPixels:PUBLIC_PHOTO_POLICY.maxInputPixels})
        .rotate()
        .resize({width:dimension,height:dimension,fit:'inside',withoutEnlargement:true})
        .flatten({background:'#18141a'})
        .toColourspace('srgb')
        .linear(gain,[0,0,0])
        .modulate({saturation})
        .jpeg({quality,progressive:true,mozjpeg:false})
        .toBuffer()
      if(output.length<=PUBLIC_PHOTO_POLICY.maxDeliveredBytes)return output
    }
  }
  throw new Error('Could not produce a compliant gallery image')
}