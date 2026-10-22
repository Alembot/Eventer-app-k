"use client";
import {useEffect,useState} from "react";
import "./customer-home.css";

const BASE=import.meta.env.BASE_URL||"/";
const pub=(p:string)=>`${BASE}${p.replace(/^\//,"")}`;
const ROLE_KEY="eventer_role";

const projectTypes:[string,string][]=[
 ["Деловое событие","business-tiles/biz-business.png"],
 ["Концерт и культурное событие","business-tiles/biz-concert.png"],
 ["Общественное событие","business-tiles/biz-public.png"],
 ["Корпоративное событие","business-tiles/biz-corporate.png"]
];
const quick:[string,string][]=[["Площадки","venue"],["Ведущие","host"],["Организаторы","organizer"],["Фото","photo"],["Видео","video"]];
const tools=[
 ["Бриф","Ассистент задаст 5–7 вопросов и соберёт бриф проекта"],
 ["Смета","По реальным ценам рынка из базы Eventer"],
 ["Дорожная карта","Что и к какому сроку сделать до события"],
 ["Креатив","2–3 идеи концепции под цель и бюджет"]
];

function guessCategory(q:string){const s=q.toLowerCase();if(/ведущ|тамад|host/.test(s))return"host";if(/видео/.test(s))return"video";if(/фото/.test(s))return"photo";if(/агент|организ/.test(s))return"organizer";return"venue"}
function readHash(){return decodeURIComponent(location.hash.slice(1))}
function safeGet(k:string){try{return localStorage.getItem(k)}catch{return null}}
function safeSet(k:string,v:string){try{localStorage.setItem(k,v)}catch{/* private mode */}}

export function CustomerHome(){
 const [hash,setHash]=useState(""),[role,setRole]=useState<string|null>("customer"),[q,setQ]=useState("");
 useEffect(()=>{setRole(safeGet(ROLE_KEY));const sync=()=>setHash(readHash());sync();addEventListener("popstate",sync);addEventListener("hashchange",sync);return()=>{removeEventListener("popstate",sync);removeEventListener("hashchange",sync)}},[]);
 const go=(h:string)=>{history.pushState({},"",`${location.pathname}#${h}`);setHash(h);scrollTo(0,0)};
 const back=()=>{if(history.length>1)history.back();else go("home")};
 const chooseRole=(r:"customer"|"pro")=>{safeSet(ROLE_KEY,r);if(r==="pro"){location.href=pub("vendor-mockup/#profile");return}setRole(r)};
 const search=(e?:React.FormEvent)=>{e?.preventDefault();location.href=pub(`catalog/?category=${guessCategory(q)}`)};
 const screen=hash.startsWith("new=")?"new":["projects","requests","assistant"].includes(hash)?hash:"home";

 if(!role)return <div className="ch-app"><Header/><section className="ch-role"><span className="ch-eyebrow">EVENTER</span><h1>Вы заказываете или вы исполнитель?</h1><p>Спросим один раз — чтобы сразу открыть нужные инструменты.</p>
  <button onClick={()=>chooseRole("customer")}><b>Я заказываю события</b><small>Маркетинг, HR, агентство, госзаказчик</small></button>
  <button onClick={()=>chooseRole("pro")}><b>Я исполнитель</b><small>Площадка, агентство, rental, артист, специалист</small></button></section></div>;

 return <div className="ch-app"><Header onLogo={()=>go("home")}/>
 {screen!=="home"&&<button className="ch-back" onClick={back}>← Назад</button>}
 {screen==="home"&&<>
  <section className="ch-search"><h1>Что нужно найти?</h1>
   <form onSubmit={search}><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Например: зал на 200 человек" aria-label="Что нужно найти"/><button type="submit" aria-label="Найти">→</button></form>
   <div className="ch-chips">{quick.map(([l,c])=><a key={c} href={pub(`catalog/?category=${c}`)}>{l}</a>)}</div></section>
  <button className="ch-prepare" onClick={()=>go("assistant")}><span className="ch-eyebrow">АССИСТЕНТ</span><b>Подготовить проект за 15 минут</b><small>Бриф, смета, дорожная карта и идеи — готово для руководителя</small><i>→</i></button>
  <section className="ch-block"><h2>Создать первый проект</h2><p>Выберите тип события — подберём чек-лист и исполнителей.</p>
   <div className="ch-tiles">{projectTypes.map(([t,img])=><button key={t} style={{backgroundImage:`url(${pub(img)})`}} onClick={()=>go(`new=${t}`)}><b>{t}</b><i>→</i></button>)}</div></section>
  <section className="ch-how"><div><b>1</b>Опишите задачу</div><div><b>2</b>Получите ответы исполнителей</div><div><b>3</b>Сравните и выберите</div></section>
 </>}
 {screen==="new"&&<Prepare title={hash.slice(4)}/>}
 {screen==="assistant"&&<Prepare title=""/>}
 {screen==="projects"&&<Empty title="Проекты" text="Здесь появятся ваши проекты: заявки, ответы и смета по каждому событию." cta="Создать проект" onCta={()=>go("home")}/>}
 {screen==="requests"&&<Empty title="Заявки" text="Здесь будут все отправленные заявки и ответы исполнителей. Напомним, если кто-то не ответил." cta="Найти исполнителей" onCta={()=>{location.href=pub("catalog/")}}/>}
 <nav className="ch-nav" aria-label="Меню заказчика">
  {[["home","Главная","nav-home"],["projects","Проекты","nav-pros"],["assistant","Ассистент","nav-assistant"],["catalog","Каталог","nav-journal"],["requests","Заявки","nav-plan"]].map(([id,l,icon])=>
   <button key={id} className={screen===id?"active":""} onClick={()=>id==="catalog"?location.href=pub("catalog/"):go(id)}><img src={pub(`wedding-ui/${icon}.png`)} alt=""/><span>{l}</span></button>)}
 </nav></div>;
}

function Header({onLogo}:{onLogo?:()=>void}){return <header className="ch-header"><button className="ch-logo" onClick={onLogo}><img src={pub("eventer-logo.svg")} alt="eventer"/></button><a className="ch-profile" aria-label="Профиль" href={pub("vendor-mockup/#profile")}><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7.5" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.8"/><path d="M5.5 20.2v-2.3a6.5 6.5 0 0 1 13 0v2.3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg></a></header>}

function Prepare({title}:{title:string}){return <section className="ch-block"><span className="ch-eyebrow">{title?"НОВЫЙ ПРОЕКТ":"АССИСТЕНТ"}</span><h1>{title||"Подготовить проект"}</h1><p>Ассистент соберёт всё, что нужно для согласования с руководителем.</p>
 <div className="ch-tools">{tools.map(([t,d])=><div key={t}><b>{t}</b><small>{d}</small><span>скоро</span></div>)}</div>
 <a className="ch-cta" href={pub("catalog/")}>Пока — найти исполнителей в каталоге</a></section>}

function Empty({title,text,cta,onCta}:{title:string;text:string;cta:string;onCta:()=>void}){return <section className="ch-block ch-empty"><h1>{title}</h1><p>{text}</p><button className="ch-cta" onClick={onCta}>{cta}</button></section>}
