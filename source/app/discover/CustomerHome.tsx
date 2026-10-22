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
type VenueChip={label:string;cat?:string;sub?:string};
type TagChip={label:string;re:string};
type Shelf={title:string;hint:string;share?:string;kind:"venue"|"vendor";cat?:string;chips?:TagChip[]};
// Фильтры технического обеспечения — по справочнику EVENTER Atlas v8 (аренда звука, света, экранов/проекторов, сцены/подиумов, спецэффекты/пиротехника, лазерное шоу, 3D mapping).
const TECH_CHIPS:TagChip[]=[{label:"Свет",re:"свет|light"},{label:"Звук",re:"звук|sound|аудио"},{label:"Видео и LED-экраны",re:"видео|LED|экран|проектор|мультимед|mapping"},{label:"Сценические конструкции",re:"сцен|подиум|конструкц|stage"},{label:"Риггинг",re:"ригг|rigging|подвес|ферм"},{label:"Спецэффекты",re:"спецэфф|пиротех|лазер|дым|конфетти|SFX"}];
type Territory={code:TypeCode;title:string;short:string;img:string;venueChips:VenueChip[];shelves:Shelf[];plan:[string,string][];tips:string[]};
// Общие полки (решение Кайрата 22.10): одна логика для всех направлений, различаются набор, порядок и названия.
const TECH="Техническое обеспечение|Обслуживание/прокат";
const ARTISTS="Музыкальная программа|DJ/диджеи|Прочие специалисты";
const sh={
 venue:(share?:string):Shelf=>({title:"Площадки",hint:"Выберите тип площадки на полке",share,kind:"venue"}),
 catering:(title:string,share?:string):Shelf=>({title,hint:"Кейтеринг, бар, обслуживание",share,kind:"vendor",cat:"Кейтеринг"}),
 tech:(share?:string):Shelf=>({title:"Техническое обеспечение",hint:"Свет, звук, видео и LED-экраны, сцена, риггинг, спецэффекты",share,kind:"vendor",cat:TECH,chips:TECH_CHIPS}),
 artists:(title:string,hint:string,share?:string):Shelf=>({title,hint,share,kind:"vendor",cat:ARTISTS}),
 organizers:(title:string,share?:string):Shelf=>({title,hint:"Организация под ключ",share,kind:"vendor",cat:"Ивент-агентства"}),
 decor:(title:string,share?:string):Shelf=>({title,hint:"Оформление, брендинг, фотозоны, навигация",share,kind:"vendor",cat:"Оформление/декор"}),
 specialists:(hint:string):Shelf=>({title:"Специалисты",hint,kind:"vendor"}),
 photo:():Shelf=>({title:"Фото и видео",hint:"Репортаж, видео, трансляция",kind:"vendor",cat:"Фото и видео"}),
 other:(title:string,hint:string,share?:string):Shelf=>({title,hint,share,kind:"vendor"})
};
// Порядок — по значимости статей бюджета (мировые ориентиры: деловые — кейтеринг 20–40%, площадка 15–30%, техника 10–25%, спикеры 5–20%;
// корпоративы — площадка 25–35%, кейтеринг 35–45%, развлечения 15–25%; концерты — гонорар артиста главная статья, продакшн 30–40%, билетная комиссия 3–5%).
const territories:Territory[]=[
 {code:"business",title:"Деловые события",short:"Деловые",img:"business-tiles/biz-business.png",
  venueChips:[{label:"Конференц-залы и отели",cat:"Бизнес площадки"},{label:"Выставочные и креативные",cat:"Выставочные залы и галереи|Креативные площадки"}],
  shelves:[sh.venue("15–30% бюджета"),sh.catering("Кейтеринг и кофе-брейки","20–40% бюджета"),sh.tech("10–25% бюджета"),
   sh.artists("Спикеры, модераторы и ведущие","Модераторы, ведущие, приглашённые спикеры","5–20% бюджета"),sh.organizers("Организаторы деловых событий","10–15% бюджета"),
   sh.other("Регистрация участников","Онлайн-регистрация, бейджи, стойки, сканеры"),sh.other("Синхронный перевод","Переводчики, кабины, приёмники"),
   sh.decor("Оформление и брендинг","около 5% бюджета"),sh.specialists("Технические директора, стейдж-менеджеры, координаторы"),sh.photo(),sh.other("Трансфер и проживание","Трансфер спикеров и гостей, отели")],
  plan:[["За 2–3 месяца","Дата, бюджет, площадка, спикеры"],["За 1 месяц","Техника, кейтеринг, модератор, приглашения"],["За 2 недели","Регистрация участников, брендинг"],["За 1–2 дня","Монтаж и технический прогон"]],
  tips:["Как посчитать бюджет конференции","5 ошибок в техническом райдере","Гибридный формат: когда он действительно нужен","Тренды деловых событий 2026"]},
 {code:"corporate",title:"Корпоративные события",short:"Корпоративные",img:"business-tiles/biz-corporate.png",
  venueChips:[{label:"Банкетные залы",sub:"Банкетные залы"},{label:"Рестораны",sub:"Рестораны"},{label:"Загородные и open air",cat:"Загородные площадки|Летние площадки"},{label:"Креативные",cat:"Креативные площадки"}],
  shelves:[sh.venue("25–35% бюджета"),sh.catering("Кейтеринг и банкет","35–45% бюджета"),sh.artists("Артисты и ведущие","Ведущие, музыканты, шоу, DJ, аниматоры","15–25% бюджета"),
   sh.organizers("Организаторы корпоративов"),sh.tech("вместе с декором 5–10%"),sh.decor("Оформление и декор"),sh.photo(),sh.specialists("Режиссёры, стейдж-менеджеры, координаторы"),sh.other("Логистика и транспорт","Развоз сотрудников, доставка")],
  plan:[["За 2–3 месяца","Дата, бюджет, площадка — на декабрь бронируют заранее"],["За 1–1,5 месяца","Ведущий, программа, DJ"],["За 2 недели","Меню, рассадка, трансфер"],["За 1 день","Монтаж и прогон"]],
  tips:["Новогодний корпоратив: что бронировать в октябре","Как удержать внимание 300 сотрудников","Тимбилдинг или банкет: что выбрать","Тренды корпоративов 2026"]},
 {code:"culture",title:"Концерты и фестивали",short:"Концерты и фестивали",img:"business-tiles/biz-concert.png",
  venueChips:[{label:"Концертные",sub:"Концертные залы"},{label:"Open air",cat:"Летние площадки|Загородные площадки"},{label:"Театральные",sub:"Театральные залы"},{label:"Спортивные и арены",cat:"Спортивные площадки"},{label:"Выставочные и креативные",cat:"Выставочные залы и галереи|Креативные площадки|Музеи"}],
  shelves:[{title:"Booking артистов",hint:"Промоутеры, букинг-агентства, менеджеры артистов",share:"гонорар артиста — главная статья концерта",kind:"vendor",cat:"Ивент-агентства"},sh.venue(),sh.tech("продакшн 30–40% бюджета"),
   sh.other("Билетный сервис","Билетные операторы, контроль входа","комиссия 3–5% с билета"),sh.other("Маркетинг и реклама","Наружная реклама, digital, СМИ, PR"),sh.other("Безопасность","Охрана, контроль толпы, медицина"),
   sh.specialists("Технические директора, стейдж-менеджеры, режиссёры"),sh.photo(),sh.other("Логистика и транспорт","Трансфер, отели, грузоперевозки, бытовой райдер")],
  plan:[["За 3–6 месяцев","Артист, площадка, бюджет"],["За 2 месяца","Технический райдер, билетный сервис"],["За 1 месяц","Промо и продажи"],["За 1–2 дня","Монтаж, саундчек, прогон"]],
  tips:["Что проверить в райдере артиста","Как считать вместимость зала под концерт","Билетный сервис: на что смотреть в договоре","Тренды концертов и фестивалей 2026"]},
 {code:"public",title:"Общественные события",short:"Общественные",img:"business-tiles/biz-public.png",
  venueChips:[{label:"Open air",cat:"Летние площадки"},{label:"Спортивные",cat:"Спортивные площадки"},{label:"Концертные и театральные",cat:"Концертные площадки"},{label:"Выставочные",cat:"Выставочные залы и галереи|Музеи"},{label:"Конференц-залы",cat:"Бизнес площадки"}],
  shelves:[sh.venue(),sh.tech("с инфраструктурой 30–40% бюджета"),sh.other("Безопасность и медицина","Охрана, стюарды, пункт первой помощи, скорая"),
   sh.artists("Артисты и ведущие","Ведущие, артисты, аниматоры"),sh.organizers("Организаторы общественных событий"),sh.catering("Кейтеринг и фуд-корт"),
   sh.decor("Навигация и брендинг"),sh.specialists("Технические директора, стейдж-менеджеры, координаторы волонтёров"),sh.photo(),sh.other("Логистика и транспорт","Подвоз гостей и команды, грузоперевозки")],
  plan:[["За 2–3 месяца","Площадка, бюджет, согласования с акиматом"],["За 1 месяц","Программа, техника, подрядчики"],["За 2 недели","Информирование, навигация"],["За 1–2 дня","Монтаж, безопасность, прогон"]],
  tips:["Какие согласования нужны для городского события","Безопасность массового мероприятия: чек-лист","Как работать с волонтёрами","Тренды городских событий 2026"]}
];
// Полки с фильтрами (площадки, техническое обеспечение) всегда сверху — решение Кайрата 22.10.
const orderShelves=(list:Shelf[])=>[...list.filter(x=>x.kind==="venue"),...list.filter(x=>x.kind!=="venue"&&x.chips),...list.filter(x=>x.kind!=="venue"&&!x.chips)];
const chipArgs=(chips:VenueChip[])=>({p_category:chips.map(c=>c.cat).filter(Boolean).join("|")||null,p_sub:chips.map(c=>c.sub).filter(Boolean).join("|")||null});
const byCode=(c:string)=>territories.find(t=>t.code===c);
const tools=[["Бриф","Ассистент задаст 5–7 вопросов и соберёт бриф проекта"],["Смета","По реальным ценам рынка из базы Eventer"],["Дорожная карта","Что и к какому сроку сделать до события"],["Креатив","2–3 идеи концепции под цель и бюджет"]];
const guestSteps=[0,50,100,200,500];

type Item={id:string;name:string;category:string;subcategory?:string;capacity?:number;address?:string;description?:string};
type Page={total:number;subcats:{name:string;n:number}[];items:Item[]};
function readHash(){return decodeURIComponent(location.hash.slice(1))}
function safeGet(k:string){try{return localStorage.getItem(k)}catch{return null}}
function safeSet(k:string,v:string){try{localStorage.setItem(k,v)}catch{/* private mode */}}

export function CustomerHome(){
 const [hash,setHash]=useState(""),[role,setRole]=useState<string|null>("customer"),[q,setQ]=useState("");
 useEffect(()=>{setRole(safeGet(ROLE_KEY));const sync=()=>setHash(readHash());sync();addEventListener("popstate",sync);addEventListener("hashchange",sync);return()=>{removeEventListener("popstate",sync);removeEventListener("hashchange",sync)}},[]);
 const go=(h:string)=>{history.pushState({},"",`${location.pathname}#${h}`);setHash(h);scrollTo(0,0)};
 const swap=(h:string)=>{history.replaceState({},"",`${location.pathname}#${h}`);setHash(h)};
 const back=()=>{if(history.length>1)history.back();else go("home")};
 const chooseRole=(r:"customer"|"pro")=>{safeSet(ROLE_KEY,r);if(r==="pro"){location.href=pub("vendor-mockup/#profile");return}setRole(r)};
 // адрес вида #экран=значение|тип
 const i=hash.indexOf("=");const screen=i<0?(hash||"home"):hash.slice(0,i);const [arg,extra,extra2,extra3]=(i<0?"":hash.slice(i+1)).split("|");

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
   <div className="ch-tiles ch-tiles2">{territories.map(t=><button key={t.code} onClick={()=>go(`dir=${t.code}`)}><span className="ch-tile-img" style={{backgroundImage:`url(${pub(t.img)})`}}/><b>{t.title}</b></button>)}</div></section>
 </>}
 {screen==="dir"&&byCode(arg)&&<TerritoryScreen t={byCode(arg)!} go={go} swap={swap}/>}
 {screen==="venues"&&<CatalogList key={hash} kind="venue" type={arg} chip={Number(extra??-1)} go={go} title={byCode(arg)?`Площадки · ${byCode(arg)!.title}`:"Все площадки"}/>}
 {screen==="vendors"&&<CatalogList key={hash} kind="vendor" type={extra??""} category={extra2?.split("~").join("|")} tagChip={Number(extra3??-1)} go={go} title={`${arg}${byCode(extra??"")?` · ${byCode(extra!)!.title}`:""}`}/>}
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

function TerritoryScreen({t,go,swap}:{t:Territory;go:(h:string)=>void;swap:(h:string)=>void}){
 return <section className="ch-block ch-dir"><span className="ch-eyebrow">НАПРАВЛЕНИЕ · АЛМАТЫ</span><h1>{t.title}</h1>
  {orderShelves(t.shelves).map(s=>s.kind==="venue"?<VenueShelf key={t.code+s.title} t={t} s={s} go={go}/>:<ShelfRow key={t.code+s.title} sh={s} type={t.code} go={go}/>)}
  <p className="ch-note">Полки — по значимости статей бюджета, резерв 10–15% закладывайте всегда. Исполнители — только с основным профилем «{t.short.toLowerCase()}».</p>
  <h2>С чего начать</h2>
  <div className="ch-plan">{t.plan.map(([w,x])=><div key={w}><b>{w}</b><span>{x}</span></div>)}</div>
  <h2>Советы и тренды</h2>
  <div className="ch-list">{t.tips.map(x=><div key={x} className="muted"><span>{x}</span><small>скоро</small></div>)}</div>
  <button className="ch-prepare" onClick={()=>go(`new=${t.code}`)}><span className="ch-eyebrow">АССИСТЕНТ</span><b>Подготовить проект за 15 минут</b><small>{t.title}: бриф, смета, дорожная карта и идеи</small><i>→</i></button>
 </section>}

function VenueShelf({t,s,go}:{t:Territory;s:Shelf;go:(h:string)=>void}){
 const [chip,setChip]=useState(-1),[page,setPage]=useState<Page|null>(null),[err,setErr]=useState(false);
 useEffect(()=>{setPage(null);setErr(false);rpc<Page>("pub_catalog_v2",{p_kind:"venue",...chipArgs(chip<0?t.venueChips:[t.venueChips[chip]]),p_limit:8}).then(setPage).catch(()=>setErr(true))},[t.code,chip]);
 return <div className="ch-shelfrow">
  <div className="ch-sec"><div><h2>{s.title}</h2>{s.share&&<small>{s.share}</small>}</div>{page&&page.total>0&&<button onClick={()=>go(`venues=${t.code}|${chip}`)}>Все {page.total} →</button>}</div>
  <div className="ch-chips ch-mini"><button className={chip<0?"on":""} onClick={()=>setChip(-1)}>Все</button>{t.venueChips.map((c,i)=><button key={c.label} className={chip===i?"on":""} onClick={()=>setChip(i)}>{c.label}</button>)}</div>
  <div className="ch-shelf">{!page&&!err&&<div className="ch-card ghost"/>}{page?.items.map(v=><VenueCard key={v.id} v={v}/>)}
   {(err||(page&&page.total===0))&&<article className="ch-card ch-card-empty"><b>{err?"Не удалось загрузить":"Собираем площадки этого типа"}</b></article>}</div></div>}

function ShelfRow({sh,type,go}:{sh:Shelf;type:TypeCode;go:(h:string)=>void}){
 const [page,setPage]=useState<Page|null>(null),[err,setErr]=useState(false),[chip,setChip]=useState(-1);
 const has=!!sh.cat,tags=chip<0?null:sh.chips![chip].re;
 useEffect(()=>{if(!has)return;setPage(null);setErr(false);rpc<Page>("pub_catalog_v2",{p_type:type,p_kind:"vendor",p_category:sh.cat,p_tags:tags,p_limit:8}).then(setPage).catch(()=>setErr(true))},[type,sh.title,chip]);
 return <div className="ch-shelfrow">
  <div className="ch-sec"><div><h2>{sh.title}</h2><small>{sh.share??sh.hint}</small></div>{page&&page.total>0&&<button onClick={()=>go(`vendors=${sh.title}|${type}|${sh.cat!.split("|").join("~")}|${chip}`)}>Все {page.total} →</button>}</div>
  {sh.chips&&<div className="ch-chips ch-mini"><button className={chip<0?"on":""} onClick={()=>setChip(-1)}>Все</button>{sh.chips.map((c,i)=><button key={c.label} className={chip===i?"on":""} onClick={()=>setChip(i)}>{c.label}</button>)}</div>}
  <div className="ch-shelf">
   {has&&!page&&!err&&<div className="ch-card ghost"/>}
   {page?.items.map(v=><VenueCard key={v.id} v={v}/>)}
   {(!has||(page&&page.total===0)||err)&&<article className="ch-card ch-card-empty"><b>Собираем профильных исполнителей</b><small>{sh.hint}</small></article>}
  </div></div>}

function VenueCard({v}:{v:Item}){return <article className="ch-card"><span className="ch-card-sub">{v.subcategory??v.category}</span><b>{v.name}</b><small>{v.capacity?`до ${v.capacity} гостей`:v.category.includes("площадк")?"вместимость не указана":(v.description??"")}</small>{v.address&&<small className="addr">{v.address.replace(/^Алматы,\s*/,"")}</small>}</article>}

function CatalogList({kind,type,category,query,go,title,chip:chip0=-1,tagChip:tag0=-1}:{kind:"venue"|"vendor"|"any";type:string;category?:string;query?:string;go:(h:string)=>void;title:string;chip?:number;tagChip?:number}){
 const tagChips=category===TECH?TECH_CHIPS:null,[tc,setTc]=useState(isNaN(tag0)?-1:tag0);
 const terr=byCode(type),[chip,setChip]=useState(isNaN(chip0)?-1:chip0);
 const [sub,setSub]=useState<string|null>(null),[guests,setGuests]=useState(0),[page,setPage]=useState<Page|null>(null),[more,setMore]=useState<Item[]>([]),[err,setErr]=useState(false),[loading,setLoading]=useState(false);
 const vc=kind==="venue"&&terr?chipArgs(chip<0?terr.venueChips:[terr.venueChips[chip]]):null;
 const args=(offset:number)=>({p_type:type||null,p_kind:kind,p_category:vc?vc.p_category:category??null,p_sub:vc?vc.p_sub:sub,p_min_guests:guests||null,p_q:query??null,p_tags:tagChips&&tc>=0?tagChips[tc].re:null,p_limit:30,p_offset:offset});
 useEffect(()=>{setPage(null);setMore([]);setErr(false);rpc<Page>("pub_catalog_v2",args(0)).then(setPage).catch(()=>setErr(true))},[sub,guests,chip,tc]);
 const loadMore=()=>{if(!page)return;setLoading(true);rpc<Page>("pub_catalog_v2",args(30+more.length)).then(p=>setMore(m=>[...m,...p.items])).catch(()=>setErr(true)).finally(()=>setLoading(false))};
 const items=[...(page?.items??[]),...more];
 return <section className="ch-block"><h1 className="ch-h1s">{title}</h1>
  {page&&<p className="ch-count">Найдено: {page.total}</p>}
  {kind==="venue"&&terr&&<div className="ch-chips"><button className={chip<0?"on":""} onClick={()=>setChip(-1)}>Все</button>{terr.venueChips.map((c,i)=><button key={c.label} className={chip===i?"on":""} onClick={()=>setChip(i)}>{c.label}</button>)}</div>}
  {tagChips&&<div className="ch-chips"><button className={tc<0?"on":""} onClick={()=>setTc(-1)}>Все</button>{tagChips.map((c,i)=><button key={c.label} className={tc===i?"on":""} onClick={()=>setTc(i)}>{c.label}</button>)}</div>}
  {kind==="venue"&&!terr&&page&&(page.subcats.length>1||sub)&&<div className="ch-chips"><button className={!sub?"on":""} onClick={()=>setSub(null)}>Все типы</button>{page.subcats.map(s=><button key={s.name} className={sub===s.name?"on":""} onClick={()=>setSub(s.name)}>{s.name} · {s.n}</button>)}</div>}
  {kind==="venue"&&<div className="ch-chips">{guestSteps.map(g=><button key={g} className={guests===g?"on":""} onClick={()=>setGuests(g)}>{g?`от ${g} гостей`:"Любое число гостей"}</button>)}</div>}
  {guests>0&&<p className="ch-note">Показываем только площадки с указанной вместимостью — она заполнена пока не у всех.</p>}
  {err&&<p className="ch-note">Не удалось загрузить. Проверьте интернет и попробуйте ещё раз.</p>}
  {!page&&!err&&<p className="ch-note">Загружаем…</p>}
  {page&&page.total===0&&<div className="ch-empty"><p>Пока никого не нашли по этим условиям.</p><button className="ch-cta" onClick={()=>go("home")}>На главную</button></div>}
  <div className="ch-rows">{items.map(v=><article key={v.id} className="ch-row"><span className="ch-card-sub">{v.subcategory??v.category}</span><b>{v.name}</b><small>{[v.capacity?`до ${v.capacity} гостей`:null,v.address?.replace(/^Алматы,\s*/,"")].filter(Boolean).join(" · ")||"Карточка дозаполняется"}</small></article>)}</div>
  {page&&items.length<page.total&&<button className="ch-cta" disabled={loading} onClick={loadMore}>{loading?"Загружаем…":"Показать ещё"}</button>}
 </section>}

function CatalogHome({go}:{go:(h:string)=>void}){return <section className="ch-block"><h1>Каталог</h1><p>Выберите направление — покажем профильные площадки и исполнителей.</p>
 <div className="ch-list">{territories.map(t=><button key={t.code} onClick={()=>go(`dir=${t.code}`)}><span><b>{t.title}</b></span><em>→</em></button>)}
 <button onClick={()=>go("venues=")}><span><b>Все площадки</b><small>Без привязки к типу события</small></span><em>→</em></button></div></section>}

function Prepare({title}:{title:string}){return <section className="ch-block"><span className="ch-eyebrow">{title?"НОВЫЙ ПРОЕКТ":"АССИСТЕНТ"}</span><h1>{title||"Подготовить проект"}</h1><p>Ассистент соберёт всё, что нужно для согласования с руководителем.</p>
 <div className="ch-tools">{tools.map(([t,d])=><div key={t}><b>{t}</b><small>{d}</small><span>скоро</span></div>)}</div></section>}

function Empty({title,text,cta,onCta}:{title:string;text:string;cta:string;onCta:()=>void}){return <section className="ch-block ch-empty"><h1>{title}</h1><p>{text}</p><button className="ch-cta" onClick={onCta}>{cta}</button></section>}
