import {createHmac,timingSafeEqual} from "node:crypto";
import {NextResponse} from "next/server";
import {addIssueComment,getIssue,getIssueComments,replaceLifecycleLabel} from "@/lib/control-tower/github";
import {decideControlTower} from "@/lib/control-tower/openai";

export const dynamic="force-dynamic";
export const runtime="nodejs";

const TARGET_REPO=process.env.CONTROL_TOWER_TARGET_REPO||"sandipanchaudhuri-dev/indian-festival-apps";

function verifySignature(raw:string,signature:string|null){
  const secret=process.env.CONTROL_TOWER_GITHUB_WEBHOOK_SECRET;
  if(!secret||!signature?.startsWith("sha256=")) return false;
  const expected="sha256="+createHmac("sha256",secret).update(raw).digest("hex");
  const a=Buffer.from(expected);
  const b=Buffer.from(signature);
  return a.length===b.length&&timingSafeEqual(a,b);
}

function firstLine(body:string){
  return body.trim().split(/\r?\n/)[0]?.trim()||"";
}

function relevantBanner(line:string){
  return [
    "## CoS RESULT PACKET",
    "## CoS STAGE2 ACTIVE",
    "## CoS STAGE2 BLOCKED_SETUP",
    "## CoS BLOCKED_OWNER"
  ].some((x)=>line.startsWith(x));
}

export async function POST(req:Request){
  const raw=await req.text();

  if(!verifySignature(raw,req.headers.get("x-hub-signature-256"))){
    return NextResponse.json({ok:false,error:"invalid_signature"},{status:401});
  }

  const event=req.headers.get("x-github-event")||"";
  const delivery=req.headers.get("x-github-delivery")||"unknown";

  if(event!=="issue_comment"){
    return NextResponse.json({ok:true,ignored:"event"});
  }

  const payload=JSON.parse(raw);

  if(payload.action!=="created"){
    return NextResponse.json({ok:true,ignored:"action"});
  }

  if(payload.repository?.full_name!==TARGET_REPO){
    return NextResponse.json({ok:true,ignored:"repo"});
  }

  const line=firstLine(payload.comment?.body||"");
  if(!relevantBanner(line)){
    return NextResponse.json({ok:true,ignored:"banner"});
  }

  const issueNumber=Number(payload.issue?.number);
  const parts=TARGET_REPO.split("/");
  const owner=parts[0];
  const repo=parts[1];

  if(!owner||!repo||!issueNumber){
    return NextResponse.json({ok:false,error:"bad_target"},{status:400});
  }

  const comments=await getIssueComments(owner,repo,issueNumber);
  const sourceComment=String(payload.comment?.id||"unknown");
  const marker="<!-- ct:source-comment="+sourceComment+" -->";

  if(comments.some((c:any)=>String(c.body||"").includes(marker))){
    return NextResponse.json({ok:true,duplicate:true});
  }

  const issue=await getIssue(owner,repo,issueNumber);
  const compactComments=comments.slice(-40).map((c:any)=>({
    author:c.user?.login||"unknown",
    created_at:c.created_at,
    body:String(c.body||"").slice(0,12000)
  }));

  const context=JSON.stringify({
    repository:TARGET_REPO,
    issue_number:issueNumber,
    title:issue.title,
    body:issue.body,
    labels:(issue.labels||[]).map((x:any)=>typeof x==="string"?x:x.name),
    newest_event:{
      delivery,
      source_comment_id:sourceComment,
      banner:line,
      body:payload.comment?.body||""
    },
    recent_comments:compactComments
  });

  const decision=await decideControlTower(context);

  if(decision.action==="noop"){
    return NextResponse.json({ok:true,action:"noop"});
  }

  const body=decision.comment.trim()+"\n\n"+marker+"\n<!-- ct:webhook-delivery="+delivery+" -->";
  await addIssueComment(owner,repo,issueNumber,body);

  const labelMap:Record<string,string>={
    rework:"cos:rework",
    acceptance_ready:"cos:acceptance-ready",
    blocked_owner:"cos:blocked-owner"
  };

  if(labelMap[decision.action]){
    await replaceLifecycleLabel(owner,repo,issueNumber,labelMap[decision.action]);
  }

  return NextResponse.json({ok:true,action:decision.action,summary:decision.summary});
}

export async function GET(){
  return NextResponse.json({
    ok:true,
    service:"control-tower",
    configured:{
      webhook:Boolean(process.env.CONTROL_TOWER_GITHUB_WEBHOOK_SECRET),
      github_write:Boolean(process.env.CONTROL_TOWER_GITHUB_TOKEN),
      openai:Boolean(process.env.CONTROL_TOWER_OPENAI_API_KEY)
    },
    target_repo:TARGET_REPO
  },{
    headers:{"cache-control":"no-store, max-age=0"}
  });
}
