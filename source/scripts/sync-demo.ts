import {cp, mkdir, writeFile} from "node:fs/promises";
import {fileURLToPath} from "node:url";
import path from "node:path";
import {showcaseEvents} from "../app/showcase-data.ts";

const here=path.dirname(fileURLToPath(import.meta.url));
const sourceRoot=path.resolve(here,"..");
const demoRoot=path.resolve(sourceRoot,"..","demo");

await mkdir(path.join(demoRoot,"api"),{recursive:true});

const summaries=showcaseEvents.map(({id,label,description,icon})=>({id,label,description,icon}));
await writeFile(path.join(demoRoot,"api","showcase.json"),JSON.stringify({version:"1.0",events:summaries}));
for(const event of showcaseEvents){
  await writeFile(path.join(demoRoot,"api",`showcase-${event.id}.json`),JSON.stringify({version:"1.0",event}));
}

// Every public asset is copied on every demo build. This makes missing photos
// impossible when a new image is added under source/public.
await cp(path.join(sourceRoot,"public"),demoRoot,{recursive:true,force:true});

console.log(`Demo data and public assets synced to ${demoRoot}`);
