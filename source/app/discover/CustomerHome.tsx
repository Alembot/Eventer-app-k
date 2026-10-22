"use client";
import {useEffect,useState} from "react";
import "./customer-home.css";

// Главная профессионального заказчика (решения Кайрата 22.10.2026):
// поиск · ассистент «Подготовить проект» · четыре «территории» направлений.
// В территории — только профильные площадки и исполнители этого типа событий. Нижнее меню на всех экранах.

const BASE=import.meta.env.BASE_URL||"/";
const pub=(p:string)=>`${BASE}${p.replace(/^\//,"")}`;
const ROLE_KEY="eventer_role";
const API="https://hgzxowfegmvxqtryphbd.supabase.co/rest/v1/rpc/";
const KEY="sb_publishable_LSSMoXyNchkWJ7c2gIdGxA_GRPdZcWX";
async function rpc<T>(name:string,body:unknown):Promise<T>{const r=await fetch(API+name,{method:"POST",headers:{apikey:KEY,"Content-Type":"application/json"},body:JSON.stringify(body)});if(!r.ok)throw new Error(String(r.status));return r.json()}

type TypeCode="business"|"culture"|"public"|"corporate";
type Territory={code:TypeCode;title:string;short:string;img:string;vendors:[string,string][];prices:[string,string][];plan:[string,string][];tips:string[]};
const territories:Territory[]=[
 {code:"business",title:"Деловое событие",short:"Деловые события",img:"business-tiles/biz-business.png",
  vendors:[["Техническое обеспечение","Звук, свет, экраны, конференц-техника"],["Кейтеринг","Кофе-брейк и фуршет"],["Ивент-агентства","Организация под ключ"],["Фото и видео","Съёмка и трансляция"],["Прочие специалисты","Модераторы, переводчики, регистрация"],["Обслуживание/прокат","Мебель, застройка, навигация"]],
  prices:[["Звук, свет, экраны","tech"],["Кейтеринг и кофе-брейк","catering"],["Модератор или ведущий","host"],["Фото","photo"],["Видео","video"],["Полиграфия и брендинг","print"]],
  plan:[["За 2–3 месяца","Дата, бюджет, площадка, спикеры"],["За 1 месяц","Техника, кейтеринг, модератор, приглашения"],["За 2 недели","Регистрация участников, брендинг, полиграфия"],["За 1–2 дня","Монтаж и технический прогон"]],
  tips:["Как посчитать бюджет конференции","5 ошибок в техническом райдере","Гибридный формат: когда он действительно нужен","Тренды деловых событий 2026"]},
 {code:"culture",title:"Концерт и культурное событие",short:"Концерты и культура",img:"business-tiles/biz-concert.png",
  vendors:[["Техническое обеспечение","Сцена, звук, свет"],["Ивент-агентства","Продюсирование и организация"],["Фото и видео","Съёмка и трансляция"],["Прочие специалисты","Ведущие, режиссёры, охрана"],["Обслуживание/прокат","Сцена, мебель, навигация"]],
  prices:[["Сцена, звук, свет","tech"],["Артисты и шоу","show"],["Ведущий","host"],["Фото","photo"],["Видео","video"],["Афиши и полиграфия","print"]],
  plan:[["За 3–6 месяцев","Артист, площадка, бюджет"],["За 2 месяца","Технический райдер, билеты или приглашения"],["За 1 месяц","Промо и информирование"],["За 1–2 дня","Монтаж, саундчек, прогон"]],
  tips:["Что проверить в райдере артиста","Как считать вместимость зала под концерт","Билеты или приглашения: что выбрать","Тренды культурных событий 2026"]},
 {code:"public",title:"Общественное событие",short:"Общественные события",img:"business-tiles/biz-public.png",
  vendors:[["Техническое обеспечение","Сцена, звук, экраны"],["Ивент-агентства","Организация и согласования"],["Фото и видео","Съёмка и трансляция"],["Прочие специалисты","Ведущие, волонтёры, охрана"],["Обслуживание/прокат","Шатры, мебель, ограждения"],["Кейтеринг","Питание гостей и команды"]],
  prices:[["Сцена, звук, экраны","tech"],["Ведущий","host"],["Артисты и шоу","show"],["Фото","photo"],["Видео","video"],["Транспорт","transport"]],
  plan:[["За 2–3 месяца","Площадка, бюджет, согласования с акиматом"],["За 1 месяц","Программа, техника, подрядчики"],["За 2 недели","Информирование, навигация"],["За 1–2 дня","Монтаж, безопасность, прогон"]],
  tips:["Какие согласования нужны для городского события","Безопасность массового мероприятия: чек-лист","Как работать с волонтёрами","Тренды городских событий 2026"]},
 {code:"corporate",title:"Корпоративное событие",short:"Корпоративные события",img:"business-tiles/biz-corporate.png",
  vendors:[["Ивент-агентства","Корпоративы под ключ"],["Кейтеринг","Банкет и фуршет"],["Прочие специалисты","Ведущие и артисты"],["DJ/диджеи","Музыка и танцы"],["Оформление/декор","Оформление зала"],["Фото и видео","Съёмка"],["Техническое обеспечение","Звук и свет"]],
  prices:[["Кейтеринг","catering"],["Ведущий","host"],["Шоу-программа","show"],["DJ","dj"],["Декор","decor"],["Фото","photo"]],
  plan:[["За 2–3 месяца","Дата, бюджет, площадка — на декабрь бронируют заранее"],["За 1–1,5 месяца","Ведущий, программа, DJ"],["За 2 недели","Меню, рассадка, трансфер"],["За 1 день","Монтаж и прогон"]],
  tips:["Новогодний корпоратив: что бронировать в октябре","Как удержать внимание 300 сотрудников","Тимбилдинг или банкет: что выбрать","Тренды корпоративов 2026"]}
];
const byCode=(c:string)=>territories.find(t=>t.code===c);
const tools=[["Бриф","Ассистент задаст 5–7 вопросов и соберёт бриф проекта"],["Смета","По реальным ценам рынка из базы Eventer"],["Дорожная карта","Что и к какому сроку сделать до события"],["Креатив","2–3 идеи концепции под цель и бюджет"]];
const guestSteps=[0,50,100,200,500];

type Tier={min:number;max:number;tier:number;unit:string};
type Item={id:string;name:string;category:string;subcategory?:string;capacity?:number;address?:string;description?:string};
type Page={total:number;subcats:{name:string;n:number}[];items:Item[]};
const unitLabel=(u:string)=>u==="per_guest"?"за гостя":u==="per_show"?"за выступление":u==="per_item"?"за единицу":"за проект";
const tg=(n:number)=>n>=1e6?`${(n/1e6).toLocaleString("ru-RU",{maximumFractionDigits:1})} млн`:`${Math.round(n/1000).toLocaleString("ru-RU")} тыс.`;
function readHash(){return decodeURIComponent(location.hash.slice(1))}
function safeGet(k:string){try{return localStorage.getItem(k)}catch{return null}}
function safeSet(k:string,v:string){try{localStorage.setItem(k,v)}catch{/* private mode */}}

export function CustomerHome(){
 const [hash,setHash]=useState(""),[role,setRole]=useState<string|null>("customer"),[q,setQ]=useState("");
 useEffect(()=>{setRole(safeGet(ROLE_KEY));const sync=()=>setHash(readHash());sync();addEventListener("popstate",sync);addEventListener("hashchange",sync);return()=>{removeEventListener("popstate",sync);removeEventListener("hashchange",sync)}},[]);
 const go=(h:string)=>{history.pushState({},"",`${location.pathname}#${h}`);setHash(h);scrollTo(0,0)};
 const back=()=>{if(history.length>1)history.back();else go("home")};
 const chooseRole=(r:"customer"|"pro")=>{safeSet(ROLE_KEY,r);if(r==="pro"){location.href=pub("vendor-mockup/#profile");return}setRole(r)};
 // адрес вида #экран=значение|тип
 const i=hash.indexOf("=");const screen=i<0?(hash||"home"):hash.slice(0,i);const [arg,extra]=(i<0?"":hash.slice(i+1)).split("|");

 if(!role)return <div className="ch-app"><Header/><section className="ch-role"><span className="ch-eyebrow">EVENTER</span><h1>Вы заказываете или вы исполнитель?</h1><p>Спросим один раз — чтобы сразу открыть нужные инструменты.</p>
  <button onClick={()=>chooseRole("customer")}><b>Я заказываю события</b><small>Маркетинг, HR, агентство, госзаказчик</small></button>
  <button onClick={()=>chooseRole("pro")}><b>Я исполнитель</b><small>Площадка, агентство, rental, артист, специалист</small></button></section></div>;

 const navActive=screen==="home"||screen==="dir"?"home":["venues","vendors","search","catalog"].includes(screen)?"catalog":screen==="new"?"assistant":screen;
 return <div className="ch-app"><Header onLogo={()=>go("home")}/>
 {screen!=="home"&&<button className="ch-back" onClick={back}>← Назад</button>}
 {screen==="home"&&<>
  <section className="ch-search"><h1>Что нужно найти?</h1>
   <form onSubmit={e=>{e.preventDefault();if(q.trim().length>=2)go(`search=${q.trim()}`)}}><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Название, зал, услуга" aria-label="Что нужно найти"/><button type="submit" aria-label="Найти">→</button></form></section>
  <button className="ch-prepare" onClick={()=>go("assistant")}><span className="ch-eyebrow">АССИСТЕНТ</span><b>Подготовить проект за 15 минут</b><small>Бриф, смета, дорожная карта и идеи — готово для руководителя</small><i>→</i></button>
  <section className="ch-block"><h2>Направления</h2>
   <div className="ch-tiles">{territories.map(t=><button key={t.code} style={{backgroundImage:`url(${pub(t.img)})`}} onClick={()=>go(`dir=${t.code}`)}><b>{t.title}</b><i>→</i></button>)}</div></section>
 </>}
 {screen==="dir"&&byCode(arg)&&<TerritoryScreen t={byCode(arg)!} go={go}/>}
 {screen==="venues"&&<CatalogList key={hash} kind="venue" type={arg} go={go} title={byCode(arg)?`Площадки · ${byCode(arg)!.short}`:"Все площадки"}/>}
 {screen==="vendors"&&<CatalogList key={hash} kind="vendor" type={extra??""} category={arg} go={go} title={`${arg}${byCode(extra??"")?` · ${byCode(extra!)!.short}`:""}`}/>}
 {screen==="search"&&<CatalogList key={hash} kind="any" type="" query={arg} go={go} title={`Поиск: «${arg}»`}/>}
 {screen==="new"&&<Prepare title={byCode(arg)?.title??""}/>}
 {screen==="assistant"&&<Prepare title=""/>}
 {screen==="projects"&&<Empty title="Проекты" text="Здесь появятся ваши проекты: заявки, ответы и смета по каждому событию." cta="Подготовить проект" onCta={()=>go("assistant")}/>}
 {screen==="requests"&&<Empty title="Заявки" text="Здесь будут все отправленные заявки и ответы исполнителей. Напомним, если кто-то не ответил." cta="На главную" onCta={()=>go("home")}/>}
 {screen==="catalog"&&<CatalogHome go={go}/>}
 <nav className="ch-nav" aria-label="Меню заказчика">
  {[["home","Главная","nav-home"],["projects","Проекты","nav-pros"],["assistant","Ассистент","nav-assistant"],["catalog","Каталог","nav-journal"],["requests","Заявки","nav-plan"]].map(([id,l,icon])=>
   <button key={id} className={navActive===id?"active":""} onClick={()=>go(id)}><img src={pub(`wedding-ui/${icon}.png`)} alt=""/><span>{l}</span></button>)}
 </nav></div>;
}

function Header({onLogo}:{onLogo?:()=>void}){return <header className="ch-header"><button className="ch-logo" onClick={onLogo}><img src={pub("eventer-logo.svg")} alt="eventer"/></button><a className="ch-profile" aria-label="Профиль" href={pub("vendor-mockup/#profile")}><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7.5" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.8"/><path d="M5.5 20.2v-2.3a6.5 6.5 0 0 1 13 0v2.3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg></a></header>}

function TerritoryScreen({t,go}:{t:Territory;go:(h:string)=>void}){
 const [sum,setSum]=useState<{venues:number;vendors:Record<string,number>}|null>(null),[venues,setVenues]=useState<Item[]|null>(null),[prices,setPrices]=useState<Record<string,Tier[]>|null>(null),[err,setErr]=useState(false);
 useEffect(()=>{setSum(null);setVenues(null);setErr(false);
  rpc<{venues:number;vendors:Record<string,number>}>("pub_territory",{p_type:t.code}).then(setSum).catch(()=>setErr(true));
  rpc<Page>("pub_catalog",{p_type:t.code,p_kind:"venue",p_limit:8}).then(p=>setVenues(p.items)).catch(()=>setErr(true));
  rpc<Record<string,Tier[]>>("pub_price_tiers",{p_city:"Алматы"}).then(setPrices).catch(()=>setErr(true));
 },[t.code]);
 const priced=t.prices.filter(([,c])=>prices?.[c]?.length);
 return <section className="ch-block ch-dir"><span className="ch-eyebrow">НАПРАВЛЕНИЕ · АЛМАТЫ</span><h1>{t.short}</h1>
  {err&&<p className="ch-note">Часть данных не загрузилась. Проверьте интернет и обновите страницу.</p>}
  <div className="ch-sec"><h2>Площадки</h2>{sum&&<button onClick={()=>go(`venues=${t.code}`)}>Все {sum.venues} →</button>}</div>
  <div className="ch-shelf">{!venues&&!err&&<div className="ch-card ghost"/>}{venues?.map(v=><VenueCard key={v.id} v={v}/>)}</div>
  <h2>Подрядчики</h2>
  <div className="ch-list">{t.vendors.map(([cat,hint])=>{const n=sum?.vendors?.[cat]??0;return n>0
   ?<button key={cat} onClick={()=>go(`vendors=${cat}|${t.code}`)}><span><b>{cat}</b><small>{hint}</small></span><em>{n}</em></button>
   :<div key={cat} className="muted"><span><b>{cat}</b><small>{hint}</small></span><small>собираем профильных</small></div>})}</div>
  <p className="ch-note">Здесь только исполнители, у которых {t.short.toLowerCase()} — основной профиль. Базу размечает робот, список будет расти.</p>
  <h2>Сколько стоит</h2>
  {!prices&&!err&&<p className="ch-note">Загружаем цены рынка…</p>}
  {prices&&<div className="ch-list">{priced.map(([l,c])=>{const s=[...prices[c]].sort((a,b)=>a.tier-b.tier);return <div key={l}><span>{l}</span><b>{tg(s[0].min)} – {tg(s[s.length-1].max)} ₸<small>{unitLabel(s[0].unit)}</small></b></div>})}</div>}
  {prices&&<p className="ch-note">Ориентир Eventer по рынку Алматы, от эконом до премиум. Аренда площадок — по запросу, собираем реальные цены.</p>}
  <h2>С чего начать</h2>
  <div className="ch-plan">{t.plan.map(([w,s])=><div key={w}><b>{w}</b><span>{s}</span></div>)}</div>
  <h2>Советы и тренды</h2>
  <div className="ch-list">{t.tips.map(x=><div key={x} className="muted"><span>{x}</span><small>скоро</small></div>)}</div>
  <button className="ch-prepare" onClick={()=>go(`new=${t.code}`)}><span className="ch-eyebrow">АССИСТЕНТ</span><b>Подготовить проект за 15 минут</b><small>{t.title}: бриф, смета, дорожная карта и идеи</small><i>→</i></button>
 </section>}

function VenueCard({v}:{v:Item}){return <article className="ch-card"><span className="ch-card-sub">{v.subcategory??v.category}</span><b>{v.name}</b><small>{v.capacity?`до ${v.capacity} гостей`:"вместимость не указана"}</small>{v.address&&<small className="addr">{v.address.replace(/^Алматы,\s*/,"")}</small>}</article>}

function CatalogList({kind,type,category,query,go,title}:{kind:"venue"|"vendor"|"any";type:string;category?:string;query?:string;go:(h:string)=>void;title:string}){
 const [sub,setSub]=useState<string|null>(null),[guests,setGuests]=useState(0),[page,setPage]=useState<Page|null>(null),[more,setMore]=useState<Item[]>([]),[err,setErr]=useState(false),[loading,setLoading]=useState(false);
 const args=(offset:number)=>({p_type:type||null,p_kind:kind,p_category:category??null,p_sub:sub,p_min_guests:guests||null,p_q:query??null,p_limit:30,p_offset:offset});
 useEffect(()=>{setPage(null);setMore([]);setErr(false);rpc<Page>("pub_catalog",args(0)).then(setPage).catch(()=>setErr(true))},[sub,guests]);
 const loadMore=()=>{if(!page)return;setLoading(true);rpc<Page>("pub_catalog",args(30+more.length)).then(p=>setMore(m=>[...m,...p.items])).catch(()=>setErr(true)).finally(()=>setLoading(false))};
 const items=[...(page?.items??[]),...more];
 return <section className="ch-block"><h1 className="ch-h1s">{title}</h1>
  {page&&<p className="ch-count">Найдено: {page.total}</p>}
  {kind==="venue"&&page&&(page.subcats.length>1||sub)&&<div className="ch-chips"><button className={!sub?"on":""} onClick={()=>setSub(null)}>Все типы</button>{page.subcats.map(s=><button key={s.name} className={sub===s.name?"on":""} onClick={()=>setSub(s.name)}>{s.name} · {s.n}</button>)}</div>}
  {kind==="venue"&&<div className="ch-chips">{guestSteps.map(g=><button key={g} className={guests===g?"on":""} onClick={()=>setGuests(g)}>{g?`от ${g} гостей`:"Любое число гостей"}</button>)}</div>}
  {guests>0&&<p className="ch-note">Показываем только площадки с указанной вместимостью — она заполнена пока не у всех.</p>}
  {err&&<p className="ch-note">Не удалось загрузить. Проверьте интернет и попробуйте ещё раз.</p>}
  {!page&&!err&&<p className="ch-note">Загружаем…</p>}
  {page&&page.total===0&&<div className="ch-empty"><p>Пока никого не нашли по этим условиям.</p><button className="ch-cta" onClick={()=>go("home")}>На главную</button></div>}
  <div className="ch-rows">{items.map(v=><article key={v.id} className="ch-row"><span className="ch-card-sub">{v.subcategory??v.category}</span><b>{v.name}</b><small>{[v.capacity?`до ${v.capacity} гостей`:null,v.address?.replace(/^Алматы,\s*/,"")].filter(Boolean).join(" · ")||"Карточка дозаполняется"}</small></article>)}</div>
  {page&&items.length<page.total&&<button className="ch-cta" disabled={loading} onClick={loadMore}>{loading?"Загружаем…":"Показать ещё"}</button>}
 </section>}

function CatalogHome({go}:{go:(h:string)=>void}){return <section className="ch-block"><h1>Каталог</h1><p>Выберите направление — покажем профильные площадки и исполнителей.</p>
 <div className="ch-list">{territories.map(t=><button key={t.code} onClick={()=>go(`dir=${t.code}`)}><span><b>{t.short}</b></span><em>→</em></button>)}
 <button onClick={()=>go("venues=")}><span><b>Все площадки</b><small>Без привязки к типу события</small></span><em>→</em></button></div></section>}

function Prepare({title}:{title:string}){return <section className="ch-block"><span className="ch-eyebrow">{title?"НОВЫЙ ПРОЕКТ":"АССИСТЕНТ"}</span><h1>{title||"Подготовить проект"}</h1><p>Ассистент соберёт всё, что нужно для согласования с руководителем.</p>
 <div className="ch-tools">{tools.map(([t,d])=><div key={t}><b>{t}</b><small>{d}</small><span>скоро</span></div>)}</div></section>}

function Empty({title,text,cta,onCta}:{title:string;text:string;cta:string;onCta:()=>void}){return <section className="ch-block ch-empty"><h1>{title}</h1><p>{text}</p><button className="ch-cta" onClick={onCta}>{cta}</button></section>}
