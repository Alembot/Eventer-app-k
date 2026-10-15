import {getShowcaseEvent,showcaseEvents} from "../../showcase-data";
const headers={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET, OPTIONS","Access-Control-Allow-Headers":"Content-Type","Cache-Control":"public, max-age=300"};
export async function GET(request:Request){const event=new URL(request.url).searchParams.get("event");if(!event)return Response.json({version:"1.0",events:showcaseEvents.map(({id,label,description,icon})=>({id,label,description,icon}))},{headers});const result=getShowcaseEvent(event);if(!result)return Response.json({error:"unknown_event",available:showcaseEvents.map(x=>x.id)},{status:404,headers});return Response.json({version:"1.0",event:result},{headers})}
export async function OPTIONS(){return new Response(null,{status:204,headers})}
