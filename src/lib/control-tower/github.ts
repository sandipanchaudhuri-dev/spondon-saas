const API="https://api.github.com";

function headers(){
  const token=process.env.CONTROL_TOWER_GITHUB_TOKEN;
  return {
    "accept":"application/vnd.github+json",
    "x-github-api-version":"2022-11-28",
    ...(token?{"authorization":"Bearer "+token}:{}),
    "user-agent":"spondon-control-tower"
  };
}

export async function getIssue(owner:string,repo:string,number:number){
  const res=await fetch(API+"/repos/"+owner+"/"+repo+"/issues/"+number,{headers:headers(),cache:"no-store"});
  if(!res.ok) throw new Error("github_issue_"+res.status);
  return res.json();
}

export async function getIssueComments(owner:string,repo:string,number:number){
  const res=await fetch(API+"/repos/"+owner+"/"+repo+"/issues/"+number+"/comments?per_page=100",{headers:headers(),cache:"no-store"});
  if(!res.ok) throw new Error("github_comments_"+res.status);
  return res.json();
}

export async function addIssueComment(owner:string,repo:string,number:number,body:string){
  const token=process.env.CONTROL_TOWER_GITHUB_TOKEN;
  if(!token) throw new Error("github_write_token_missing");
  const res=await fetch(API+"/repos/"+owner+"/"+repo+"/issues/"+number+"/comments",{
    method:"POST",headers:{...headers(),"content-type":"application/json"},body:JSON.stringify({body})
  });
  if(!res.ok) throw new Error("github_comment_write_"+res.status);
  return res.json();
}

export async function replaceLifecycleLabel(owner:string,repo:string,number:number,nextLabel:string){
  const token=process.env.CONTROL_TOWER_GITHUB_TOKEN;
  if(!token) throw new Error("github_write_token_missing");
  const issue=await getIssue(owner,repo,number);
  const labels=(issue.labels??[]).map((x:any)=>typeof x==="string"?x:x.name).filter(Boolean);
  const next=[...labels.filter((x:string)=>!x.startsWith("cos:")),nextLabel];
  const res=await fetch(API+"/repos/"+owner+"/"+repo+"/issues/"+number,{
    method:"PATCH",headers:{...headers(),"content-type":"application/json"},body:JSON.stringify({labels:next})
  });
  if(!res.ok) throw new Error("github_label_write_"+res.status);
}
