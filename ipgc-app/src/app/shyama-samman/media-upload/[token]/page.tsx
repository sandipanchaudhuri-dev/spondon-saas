import MediaUpload from "./media-upload";
export default async function Page({params}:{params:Promise<{token:string}>}){const {token}=await params;return <MediaUpload token={token}/>;}