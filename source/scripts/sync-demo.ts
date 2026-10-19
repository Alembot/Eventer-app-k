import {cp, mkdir, readFile, readdir, writeFile} from "node:fs/promises";
import {fileURLToPath} from "node:url";
import path from "node:path";
import {showcaseEvents} from "../app/showcase-data.ts";

const here=path.dirname(fileURLToPath(import.meta.url));
const sourceRoot=path.resolve(here,"..");
const demoRoot=path.resolve(sourceRoot,"..","demo");
const builtRoot=path.join(sourceRoot,"dist","client","Eventer-app-k","demo");

// Vinext writes fresh browser chunks below the configured base path. Copy them
// into the GitHub Pages demo before syncing public assets; otherwise demo/index.html
// keeps loading an older ShowcaseClient bundle even though /source was rebuilt.
await cp(path.join(builtRoot,"_next"),path.join(demoRoot,"_next"),{recursive:true,force:true});

const chunksDir=path.join(builtRoot,"_next","static","chunks");
const cssDir=path.join(builtRoot,"_next","static","css");
const chunkFiles=await readdir(chunksDir);
const cssFiles=await readdir(cssDir);
const latest=(files:string[],prefix:string)=>files.find((name)=>name.startsWith(prefix));
const replacements:[RegExp,string|undefined][]=[
  [/index-[\w-]+\.js/g,latest(chunkFiles,"index-")],
  [/rolldown-runtime-[\w-]+\.js/g,latest(chunkFiles,"rolldown-runtime-")],
  [/framework-[\w-]+\.js/g,latest(chunkFiles,"framework-")],
  [/layout-segment-context-[\w-]+\.js/g,latest(chunkFiles,"layout-segment-context-")],
  [/ShowcaseClient-[\w-]+\.js/g,latest(chunkFiles,"ShowcaseClient-")],
  [/WeddingBottomNav-[\w-]+\.js/g,latest(chunkFiles,"WeddingBottomNav-")],
  [/index\.[\w-]+\.css/g,latest(cssFiles,"index.")],
  [/ShowcaseClient\.[\w-]+\.css/g,latest(cssFiles,"ShowcaseClient.")],
  [/WeddingBottomNav\.[\w-]+\.css/g,latest(cssFiles,"WeddingBottomNav.")],
];

const demoIndex=path.join(demoRoot,"index.html");
let html=await readFile(demoIndex,"utf8");
for(const [pattern,replacement] of replacements){
  if(!replacement) throw new Error(`Missing built asset for ${pattern}`);
  html=html.replace(pattern,replacement);
}
await writeFile(demoIndex,html);

await mkdir(path.join(demoRoot,"api"),{recursive:true});

const summaries=showcaseEvents.map(({id,label,description,icon})=>({id,label,description,icon}));
await writeFile(path.join(demoRoot,"api","showcase.json"),JSON.stringify({version:"1.0",events:summaries}));
for(const event of showcaseEvents){
  await writeFile(path.join(demoRoot,"api",`showcase-${event.id}.json`),JSON.stringify({version:"1.0",event}));
}

// Every public asset is copied on every demo build. This makes missing photos
// impossible when a new image is added under source/public.
await cp(path.join(sourceRoot,"public"),demoRoot,{recursive:true,force:true});

// CSS assets are rebased by Vinext below /_next/static/. Keep the visual asset
// folders there as well as at the public root so the wedding hero, 3D category
// icons and entry tiles never disappear from the GitHub Pages build.
for(const folder of ["wedding-ui","wedding-references","business-tiles","fonts"]){
  await cp(
    path.join(sourceRoot,"public",folder),
    path.join(demoRoot,"_next","static",folder),
    {recursive:true,force:true},
  );
}

console.log(`Demo data and public assets synced to ${demoRoot}`);
