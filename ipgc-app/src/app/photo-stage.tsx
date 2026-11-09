import Image from 'next/image'
import type {PublishedPhoto} from './ipgc-gallery'

type PhotoStageProps={photo:PublishedPhoto;variant?:'hero'|'thumb'|'viewer'}
/** PujoVerse-style presentation, without destructive crops. */
export default function PhotoStage({photo,variant='viewer'}:PhotoStageProps){
 const branded=variant!=='thumb'
 return <span className={'ipgc-photo-stage ipgc-photo-stage-'+variant}>
  <img className="ipgc-photo-blur" src={photo.displaySrc} alt="" aria-hidden="true" loading={variant==='viewer'?'eager':'lazy'}/>
  <img className="ipgc-photo-sharp" src={photo.displaySrc} alt={photo.alt} loading={variant==='viewer'?'eager':'lazy'}/>
  {branded&&<>
   <span className="ipgc-photo-brand-top" aria-hidden="true"><Image src="https://pujoverse.indianfestival.co.in/brand/pujoverse-unified-logo-v6.png" width={133} height={45} alt=""/></span>
   <span className="ipgc-photo-brand-bottom" aria-hidden="true">
    <Image src="/brand/indian-festival-official.jpg" width={62} height={50} alt=""/>
    <Image src="/brand/ipgc-shyama-samman-2026.jpg" width={62} height={50} alt=""/>
   </span>
  </>}
 </span>
}