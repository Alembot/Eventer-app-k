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

type Need=[string,string|null];
const directions:Record<string,{needs:Need[];plan:[string,string][]}>={
 "Деловое событие":{needs:[["Площадка","venue"],["Кейтеринг и кофе-брейк","catering"],["Звук, свет, экраны","tech"],["Ведущий или модератор","host"],["Фотограф","photo"],["Видеограф","video"],["Полиграфия и брендинг","print"],["Трансфер","transport"],["Синхронный перевод",null],["Регистрация участников",null]],
  plan:[["За 2–3 месяца","Дата, бюджет, площадка, спикеры"],["За 1 месяц","Техника, кейтеринг, ведущий, приглашения"],["За 2 недели","Регистрация участников, брендинг, полиграфия"],["За 1–2 дня","Монтаж и технический прогон"]]},
 "Концерт и культурное событие":{needs:[["Площадка","venue"],["Кейтеринг и фуршет","catering"],["Сцена, звук, свет","tech"],["Артисты и шоу","show"],["Ведущий","host"],["Фотограф","photo"],["Видеограф","video"],["Афиши и полиграфия","print"],["Трансфер артистов","transport"],["Билеты и продажи",null],["Охрана",null]],
  plan:[["За 3–6 месяцев","Артист, площадка, бюджет"],["За 2 месяца","Технический райдер, билеты или приглашения"],["За 1 месяц","Промо и информирование"],["За 1–2 дня","Монтаж, саундчек, прогон"]]},
 "Общественное событие":{needs:[["Площадка","venue"],["Кейтеринг и фуршет","catering"],["Сцена, звук, экраны","tech"],["Ведущий","host"],["Артисты и шоу","show"],["Фотограф","photo"],["Видеограф","video"],["Полиграфия и навигация","print"],["Транспорт","transport"],["Охрана и медики",null],["Согласования с акиматом",null]],
  plan:[["За 2–3 месяца","Площадка, бюджет, согласования"],["За 1 месяц","Программа, техника, подрядчики"],["За 2 недели","Информирование, навигация"],["За 1–2 дня","Монтаж, безопасность, прогон"]]},
 "Корпоративное событие":{needs:[["Площадка","venue"],["Кейтеринг","catering"],["Ведущий","host"],["Шоу-программа","show"],["DJ","dj"],["Декор","decor"],["Фотограф","photo"],["Видеограф","video"],["Трансфер","transport"]],
  plan:[["За 2–3 месяца","Дата, бюджет, площадка — на декабрь бронируют заранее"],["За 1–1,5 месяца","Ведущий, программа, DJ"],["За 2 недели","Меню, рассадка, трансфер"],["За 1 день","Монтаж и прогон"]]}
};
const PRICE_API="https://hgzxowfegmvxqtryphbd.supabase.co/rest/v1/rpc/pub_price_tiers";
const PRICE_KEY="sb_publishable_LSSMoXyNchkWJ7c2gIdGxA_GRPdZcWX";
type Tier={min:number;max:number;tier:number;unit:string;source:string};
const unitLabel=(u:string)=>u==="per_guest"?"за гостя":u==="per_show"?"за выступление":u==="per_item"?"за единицу":"за проект";
const tg=(n:number)=>n>=1e6?`${(n/1e6).toLocaleString("ru-RU",{maximumFractionDigits:1})} млн`:`${Math.round(n/1000).toLocaleString("ru-RU")} тыс.`;

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
 const screen=hash.startsWith("dir=")?"dir":hash.startsWith("new=")?"new":["projects","requests","assistant"].includes(hash)?hash:"home";

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
  <section className="ch-block"><h2>Найти по типу события</h2><p>Кто нужен, сколько стоит и с чего начать — разберитесь сами.</p>
   <div className="ch-tiles">{projectTypes.map(([t,img])=><button key={t} style={{backgroundImage:`url(${pub(img)})`}} onClick={()=>go(`dir=${t}`)}><b>{t}</b><i>→</i></button>)}</div></section>
  <section className="ch-how"><div><b>1</b>Опишите задачу</div><div><b>2</b>Получите ответы исполнителей</div><div><b>3</b>Сравните и выберите</div></section>
 </>}
 {screen==="dir"&&<Direction title={hash.slice(4)} onAssistant={()=>go(`new=${hash.slice(4)}`)}/>}
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

function Direction({title,onAssistant}:{title:string;onAssistant:()=>void}){
 const d=directions[title]??directions["Деловое событие"];
 const [prices,setPrices]=useState<Record<string,Tier[]>|null>(null),[failed,setFailed]=useState(false);
 useEffect(()=>{fetch(PRICE_API,{method:"POST",headers:{apikey:PRICE_KEY,"Content-Type":"application/json"},body:JSON.stringify({p_city:"Алматы"})}).then(r=>r.ok?r.json():Promise.reject()).then(setPrices).catch(()=>setFailed(true))},[]);
 const priced=d.needs.filter(([,c])=>c&&c!=="venue"&&prices?.[c]?.length);
 return <section className="ch-block ch-dir"><span className="ch-eyebrow">ПО ТИПУ СОБЫТИЯ · АЛМАТЫ</span><h1>{title}</h1>
  <h2>Кто нужен</h2>
  <div className="ch-list">{d.needs.map(([l,c])=>c?<a key={l} href={pub(`catalog/?category=${c}`)}><span>{l}</span><i>›</i></a>:<div key={l} className="muted"><span>{l}</span><small>скоро в каталоге</small></div>)}</div>
  <h2>Сколько стоит</h2>
  {!prices&&!failed&&<p className="ch-note">Загружаем цены рынка…</p>}
  {failed&&<p className="ch-note">Не удалось загрузить цены. Попробуйте позже.</p>}
  {prices&&<div className="ch-list">{priced.map(([l,c])=>{const t=[...prices[c!]].sort((a,b)=>a.tier-b.tier);return <div key={l}><span>{l}</span><b>{tg(t[0].min)} – {tg(t[t.length-1].max)} ₸<small>{unitLabel(t[0].unit)}</small></b></div>})}</div>}
  {prices&&<p className="ch-note">Аренда площадки пока «по запросу» — собираем реальные цены залов. Ориентир Eventer по рынку Алматы, от эконом до премиум. Цены уточняются по мере поступления реальных предложений.</p>}
  <h2>С чего начать</h2>
  <div className="ch-plan">{d.plan.map(([w,t])=><div key={w}><b>{w}</b><span>{t}</span></div>)}</div>
  <button className="ch-prepare" onClick={onAssistant}><span className="ch-eyebrow">АССИСТЕНТ</span><b>Подготовить этот проект за 15 минут</b><small>Бриф, смета, дорожная карта и идеи</small><i>→</i></button>
 </section>}
