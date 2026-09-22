export type ControlTowerDecision={
  action:"rework"|"acceptance_ready"|"blocked_owner"|"note"|"noop";
  summary:string;
  comment:string;
};

function extractText(data:any){
  if(typeof data?.output_text==="string") return data.output_text;
  const parts:Array<string>=[];
  for(const item of data?.output??[]){
    for(const content of item?.content??[]){
      if(typeof content?.text==="string") parts.push(content.text);
    }
  }
  return parts.join("\n");
}

function parseDecision(text:string):ControlTowerDecision{
  const start=text.indexOf("{");
  const end=text.lastIndexOf("}");
  if(start<0||end<start) throw new Error("invalid_json_output");
  const parsed=JSON.parse(text.slice(start,end+1));
  if(!["rework","acceptance_ready","blocked_owner","note","noop"].includes(parsed.action)) throw new Error("invalid_action");
  return {action:parsed.action,summary:String(parsed.summary??""),comment:String(parsed.comment??"")};
}

export async function decideControlTower(input:string):Promise<ControlTowerDecision>{
  const key=process.env.CONTROL_TOWER_OPENAI_API_KEY;
  if(!key) throw new Error("openai_key_missing");
  const model=process.env.CONTROL_TOWER_MODEL||"gpt-5.6-terra";
  const instructions="You are the automated Control Tower for Grok Chief-of-Staff work packages.\n"+
    "GitHub is the canonical state store. Evaluate the newest CoS message against the issue objective, acceptance criteria, prior CT instructions, and evidence in the thread.\n"+
    "Do not approve production mutation, outreach, spend, Play upload, DB/config mutation, credentials, or irreversible actions unless explicit owner authorization exists in the issue.\n"+
    "Return JSON only in this exact shape: {\"action\":\"rework|acceptance_ready|blocked_owner|note|noop\",\"summary\":\"short internal summary\",\"comment\":\"complete GitHub comment body\"}.\n"+
    "Rules: rework comments start ## CT REWORK. acceptance_ready comments start ## CT ACCEPTANCE_READY. blocked_owner comments start ## CT BLOCKED_OWNER and state exactly what the owner must do. note comments start ## CT STATUS. noop must have an empty comment. Keep owner instructions explicit and concise.";
  const res=await fetch("https://api.openai.com/v1/responses",{
    method:"POST",
    headers:{"authorization":"Bearer "+key,"content-type":"application/json"},
    body:JSON.stringify({model,instructions,input,reasoning:{effort:"medium"},max_output_tokens:2200})
  });
  if(!res.ok) throw new Error("openai_response_"+res.status);
  const data=await res.json();
  return parseDecision(extractText(data));
}
