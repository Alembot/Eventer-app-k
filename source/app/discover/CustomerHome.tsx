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
type Shelf={title:string;hint:string;share?:string;kind:"venue"|"vendor";cat?:string;sub?:string;tags?:string;chips?:TagChip[]};
// Фильтры технического обеспечения — по справочнику EVENTER Atlas v8 (аренда звука, света, экранов/проекторов, сцены/подиумов, спецэффекты/пиротехника, лазерное шоу, 3D mapping).
const TECH_CHIPS:TagChip[]=[{label:"Свет",re:"свет|light"},{label:"Звук",re:"звук|sound|аудио"},{label:"Видео и LED-экраны",re:"видео|LED|экран|проектор|мультимед|mapping"},{label:"Сценические конструкции",re:"сцен|подиум|конструкц|stage"},{label:"Риггинг",re:"ригг|rigging|подвес|ферм"},{label:"Спецэффекты",re:"спецэфф|пиротех|лазер|дым|конфетти|SFX"}];
type Territory={code:TypeCode;title:string;short:string;img:string;venueChips:VenueChip[];shelves:Shelf[];plan:[string,string][];tips:string[]};
// Общие полки (решение Кайрата 22.10): одна логика для всех направлений, различаются набор, порядок и названия.
const TECH="Техническое обеспечение";
const ARTISTS="Музыкальная программа|DJ/диджеи|Прочие специалисты";
const sh={
 venue:(share?:string):Shelf=>({title:"Площадки",hint:"Выберите тип площадки на полке",share,kind:"venue"}),
 catering:(title:string,share?:string):Shelf=>({title,hint:"Кейтеринг, бар, обслуживание",share,kind:"vendor",cat:"Кейтеринг",sub:"Кейтеринговые компании|Выездной кейтеринг|Событийный кейтеринг"}),
 tech:(share?:string,extra:TagChip[]=[]):Shelf=>({title:"Техническое обеспечение",hint:"Свет, звук, видео и LED-экраны, сцена, риггинг, спецэффекты",share,kind:"vendor",cat:TECH,chips:[...TECH_CHIPS,...extra]}),
 artists:(title:string,hint:string,share?:string):Shelf=>({title,hint,share,kind:"vendor",cat:ARTISTS}),
 organizers:(title:string,share?:string):Shelf=>({title,hint:"Организация под ключ",share,kind:"vendor",cat:"Ивент-агентства"}),
 decor:(title:string,share?:string):Shelf=>({title,hint:"Оформление, брендинг, фотозоны, навигация",share,kind:"vendor",cat:"Оформление/декор"}),
 specialists:(hint:string):Shelf=>({title:"Специалисты",hint,kind:"vendor"}),
 photo:():Shelf=>({title:"Фото и видео",hint:"Репортаж, видео, трансляция",kind:"vendor",cat:"Фото и видео"}),
 other:(title:string,hint:string,share?:string):Shelf=>({title,hint,share,kind:"vendor"}),
 logistics:(title:string,hint:string):Shelf=>({title,hint,kind:"vendor",cat:"Обслуживание/прокат",sub:"Трансфер/прокат авто"})
};
// Порядок — по значимости статей бюджета (мировые ориентиры: деловые — кейтеринг 20–40%, площадка 15–30%, техника 10–25%, спикеры 5–20%;
// корпоративы — площадка 25–35%, кейтеринг 35–45%, развлечения 15–25%; концерты — гонорар артиста главная статья, продакшн 30–40%, билетная комиссия 3–5%).
const territories:Territory[]=[
 {code:"business",title:"Деловые события",short:"Деловые",img:"business-tiles/biz-business.png",
  venueChips:[{label:"Конференц-залы и отели",cat:"Бизнес площадки"},{label:"Выставочные и креативные",cat:"Выставочные залы и галереи|Креативные площадки"}],
  shelves:[sh.venue("15–30% бюджета"),sh.catering("Кейтеринг и кофе-брейки","20–40% бюджета"),sh.tech("10–25% бюджета",[{label:"Конференц-системы и перевод",re:"конференц|синхрон|перевод"}]),
   {...sh.artists("Booking спикеров","Спикеры, модераторы, деловые ведущие","5–20% бюджета"),tags:"модератор|делов|конференц|форум|бизнес|корпоратив|презентац|выставк"},sh.organizers("Организаторы деловых событий","10–15% бюджета"),
      sh.decor("Оформление и брендинг","около 5% бюджета"),sh.specialists("Хостес, волонтёры, регистрация, переводчики, технические директора, стейдж-менеджеры"),sh.photo(),sh.logistics("Трансфер и проживание","Трансфер спикеров и гостей, отели")],
  plan:[["За 2–3 месяца","Дата, бюджет, площадка, спикеры"],["За 1 месяц","Техника, кейтеринг, модератор, приглашения"],["За 2 недели","Регистрация участников, брендинг"],["За 1–2 дня","Монтаж и технический прогон"]],
  tips:["Как посчитать бюджет конференции","5 ошибок в техническом райдере","Гибридный формат: когда он действительно нужен","Тренды деловых событий 2026"]},
 {code:"corporate",title:"Корпоративные события",short:"Корпоративные",img:"business-tiles/biz-corporate.png",
  venueChips:[{label:"Банкетные залы",sub:"Банкетные залы"},{label:"Рестораны",sub:"Рестораны"},{label:"Загородные и open air",cat:"Загородные площадки|Летние площадки"},{label:"Креативные",cat:"Креативные площадки"}],
  shelves:[sh.venue("25–35% бюджета"),sh.catering("Кейтеринг и банкет","35–45% бюджета"),sh.artists("Артисты и ведущие","Ведущие, музыканты, шоу, DJ, аниматоры","15–25% бюджета"),
   sh.organizers("Организаторы корпоративов"),sh.tech("вместе с декором 5–10%"),sh.decor("Оформление и декор"),sh.photo(),sh.specialists("Режиссёры, стейдж-менеджеры, координаторы"),sh.logistics("Логистика и транспорт","Развоз сотрудников, доставка")],
  plan:[["За 2–3 месяца","Дата, бюджет, площадка — на декабрь бронируют заранее"],["За 1–1,5 месяца","Ведущий, программа, DJ"],["За 2 недели","Меню, рассадка, трансфер"],["За 1 день","Монтаж и прогон"]],
  tips:["Новогодний корпоратив: что бронировать в октябре","Как удержать внимание 300 сотрудников","Тимбилдинг или банкет: что выбрать","Тренды корпоративов 2026"]},
 {code:"culture",title:"Концерты и фестивали",short:"Концерты и фестивали",img:"business-tiles/biz-concert.png",
  venueChips:[{label:"Концертные",sub:"Концертные залы"},{label:"Open air",cat:"Летние площадки|Загородные площадки"},{label:"Театральные",sub:"Театральные залы"},{label:"Спортивные и арены",cat:"Спортивные площадки"},{label:"Выставочные и креативные",cat:"Выставочные залы и галереи|Креативные площадки|Музеи"}],
  shelves:[{title:"Booking артистов",hint:"Промоутеры, букинг-агентства, менеджеры артистов",share:"гонорар артиста — главная статья концерта",kind:"vendor",cat:"Ивент-агентства"},sh.venue(),sh.tech("продакшн 30–40% бюджета"),
   sh.other("Билетный сервис","Билетные операторы, контроль входа","комиссия 3–5% с билета"),sh.other("Маркетинг и реклама","Наружная реклама, digital, СМИ, PR"),sh.other("Безопасность","Охрана, контроль толпы, медицина"),
   sh.specialists("Технические директора, стейдж-менеджеры, режиссёры"),sh.photo(),sh.logistics("Логистика и транспорт","Трансфер, отели, грузоперевозки, бытовой райдер")],
  plan:[["За 3–6 месяцев","Артист, площадка, бюджет"],["За 2 месяца","Технический райдер, билетный сервис"],["За 1 месяц","Промо и продажи"],["За 1–2 дня","Монтаж, саундчек, прогон"]],
  tips:["Что проверить в райдере артиста","Как считать вместимость зала под концерт","Билетный сервис: на что смотреть в договоре","Тренды концертов и фестивалей 2026"]},
 {code:"public",title:"Общественные события",short:"Общественные",img:"business-tiles/biz-public.png",
  venueChips:[{label:"Open air",cat:"Летние площадки"},{label:"Спортивные",cat:"Спортивные площадки"},{label:"Концертные и театральные",cat:"Концертные площадки"},{label:"Выставочные",cat:"Выставочные залы и галереи|Музеи"},{label:"Конференц-залы",cat:"Бизнес площадки"}],
  shelves:[sh.venue(),sh.tech("с инфраструктурой 30–40% бюджета"),sh.other("Безопасность и медицина","Охрана, стюарды, пункт первой помощи, скорая"),
   sh.artists("Артисты и ведущие","Ведущие, артисты, аниматоры"),sh.organizers("Организаторы общественных событий"),sh.catering("Кейтеринг и фуд-корт"),
   sh.decor("Навигация и брендинг"),sh.specialists("Технические директора, стейдж-менеджеры, координаторы волонтёров"),sh.photo(),sh.logistics("Логистика и транспорт","Подвоз гостей и команды, грузоперевозки")],
  plan:[["За 2–3 месяца","Площадка, бюджет, согласования с акиматом"],["За 1 месяц","Программа, техника, подрядчики"],["За 2 недели","Информирование, навигация"],["За 1–2 дня","Монтаж, безопасность, прогон"]],
  tips:["Какие согласования нужны для городского события","Безопасность массового мероприятия: чек-лист","Как работать с волонтёрами","Тренды городских событий 2026"]}
];
// Полки с фильтрами (площадки, техническое обеспечение) всегда сверху — решение Кайрата 22.10.
const orderShelves=(list:Shelf[])=>[...list.filter(x=>x.kind==="venue"),...list.filter(x=>x.kind!=="venue"&&x.chips),...list.filter(x=>x.kind!=="venue"&&!x.chips)];
const chipArgs=(chips:VenueChip[])=>({p_category:chips.map(c=>c.cat).filter(Boolean).join("|")||null,p_sub:chips.map(c=>c.sub).filter(Boolean).join("|")||null});
const byCode=(c:string)=>territories.find(t=>t.code===c);
const guestSteps=[0,50,100,200,500];

type Item={id:string;name:string;category:string;subcategory?:string;capacity?:number;address?:string;description?:string;languages?:string[];event_types?:string[];experience_years?:number};
const LANG:Record<string,string>={"казахский":"каз","русский":"рус","английский":"англ","китайский":"кит","турецкий":"тур"};
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

 const navActive=screen==="home"||screen==="dir"?"home":["venues","vendors","search","catalog"].includes(screen)?"catalog":screen==="new"?"assistant":screen==="project"?"projects":screen;
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
 {screen==="vendors"&&byCode(arg)&&orderShelves(byCode(arg)!.shelves)[Number(extra)]&&<CatalogList key={hash} kind="vendor" type={arg} shelf={orderShelves(byCode(arg)!.shelves)[Number(extra)]} tagChip={Number(extra2??-1)} go={go} title={`${orderShelves(byCode(arg)!.shelves)[Number(extra)].title} · ${byCode(arg)!.title}`}/>}
 {screen==="search"&&<CatalogList key={hash} kind="any" type="" query={arg} go={go} title={`Поиск: «${arg}»`}/>}
 {screen==="new"&&<ProjectBuilder key={hash} preset={byCode(arg)?.code} go={go}/>}
 {screen==="assistant"&&<ProjectBuilder key={hash} go={go}/>}
 {screen==="project"&&<ProjectView id={arg} go={go}/>}
 {screen==="projects"&&<ProjectsList go={go}/>}
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
  {orderShelves(t.shelves).map((s,i)=>s.kind==="venue"?<VenueShelf key={t.code+s.title} t={t} s={s} go={go}/>:<ShelfRow key={t.code+s.title} sh={s} type={t.code} go={go} idx={i}/>)}
  <p className="ch-note">Полки — по значимости статей бюджета, резерв 10–15% закладывайте всегда. Исполнители — только с основным профилем «{t.short.toLowerCase()}».</p>
  <h2>С чего начать</h2>
  <div className="ch-plan">{t.plan.map(([w,x])=><div key={w}><b>{w}</b><span>{x}</span></div>)}</div>
  <h2>Советы и тренды</h2>
  <div className="ch-list">{t.tips.map(x=><div key={x} className="muted"><span>{x}</span><small>скоро</small></div>)}</div>
  <button className="ch-prepare" onClick={()=>go(`new=${t.code}`)}><span className="ch-eyebrow">АССИСТЕНТ</span><b>Подготовить проект за 15 минут</b><small>{t.title}: бриф, смета, дорожная карта и идеи</small><i>→</i></button>
 </section>}

function VenueShelf({t,s,go,minGuests}:{t:Territory;s:Shelf;go:(h:string)=>void;minGuests?:number}){
 const [chip,setChip]=useState(-1),[page,setPage]=useState<Page|null>(null),[err,setErr]=useState(false);
 useEffect(()=>{setPage(null);setErr(false);rpc<Page>("pub_catalog_v2",{p_kind:"venue",...chipArgs(chip<0?t.venueChips:[t.venueChips[chip]]),p_min_guests:minGuests??null,p_limit:8}).then(setPage).catch(()=>setErr(true))},[t.code,chip]);
 return <div className="ch-shelfrow">
  <div className="ch-sec"><div><h2>{s.title}</h2>{s.share&&<small>{s.share}</small>}</div>{page&&page.total>0&&<button onClick={()=>go(`venues=${t.code}|${chip}`)}>Все {page.total} →</button>}</div>
  <div className="ch-chips ch-mini"><button className={chip<0?"on":""} onClick={()=>setChip(-1)}>Все</button>{t.venueChips.map((c,i)=><button key={c.label} className={chip===i?"on":""} onClick={()=>setChip(i)}>{c.label}</button>)}</div>
  <div className="ch-shelf">{!page&&!err&&<div className="ch-card ghost"/>}{page?.items.map(v=><VenueCard key={v.id} v={v}/>)}
   {(err||(page&&page.total===0))&&<article className="ch-card ch-card-empty"><b>{err?"Не удалось загрузить":"Собираем площадки этого типа"}</b></article>}</div></div>}

function ShelfRow({sh,type,go,idx}:{sh:Shelf;type:TypeCode;go:(h:string)=>void;idx:number}){
 const [page,setPage]=useState<Page|null>(null),[err,setErr]=useState(false),[chip,setChip]=useState(-1);
 const has=!!(sh.cat||sh.tags),tags=chip<0?sh.tags??null:sh.chips![chip].re;
 useEffect(()=>{if(!has)return;setPage(null);setErr(false);rpc<Page>("pub_catalog_v2",{p_type:type,p_kind:"vendor",p_category:sh.cat??null,p_sub:sh.sub??null,p_tags:tags,p_limit:8}).then(setPage).catch(()=>setErr(true))},[type,sh.title,chip]);
 return <div className="ch-shelfrow">
  <div className="ch-sec"><div><h2>{sh.title}</h2><small>{sh.share??sh.hint}</small></div>{page&&page.total>0&&<button onClick={()=>go(`vendors=${type}|${idx}|${chip}`)}>Все {page.total} →</button>}</div>
  {sh.chips&&<div className="ch-chips ch-mini"><button className={chip<0?"on":""} onClick={()=>setChip(-1)}>Все</button>{sh.chips.map((c,i)=><button key={c.label} className={chip===i?"on":""} onClick={()=>setChip(i)}>{c.label}</button>)}</div>}
  <div className="ch-shelf">
   {has&&!page&&!err&&<div className="ch-card ghost"/>}
   {page?.items.map(v=><VenueCard key={v.id} v={v}/>)}
   {(!has||(page&&page.total===0)||err)&&<article className="ch-card ch-card-empty"><b>{err?"Не удалось загрузить":"Пока нет в базе — добавляем"}</b><small>{sh.hint}</small></article>}
  </div></div>}

function VenueCard({v}:{v:Item}){
 const isVenue=v.category.includes("площадк")||v.capacity!=null;
 if(isVenue)return <article className="ch-card"><b className="ch-card-name">{v.name}</b><small>{v.capacity?`до ${v.capacity} гостей`:"вместимость не указана"}</small>{v.address&&<small className="addr">{v.address.replace(/^Алматы,\s*/,"")}</small>}</article>;
 // Карточка исполнителя — коротко: кто он, опыт, языки, какие события ведёт (без описаний).
 const langs=(v.languages??[]).filter(Boolean).map(l=>LANG[l.toLowerCase()]??l).join(" · ");
 const types=(v.event_types??[]).slice(0,3).join(", ")+((v.event_types?.length??0)>3?" …":"");
 return <article className="ch-card"><b className="ch-card-name">{v.name}</b><small className="ch-card-role">{v.subcategory??v.category}</small>
  {(v.experience_years||langs)&&<small>{[v.experience_years?`опыт ${v.experience_years} лет`:null,langs||null].filter(Boolean).join(" · ")}</small>}
  {types&&<small className="addr">{types}</small>}</article>}

function CatalogList({kind,type,shelf,query,go,title,chip:chip0=-1,tagChip:tag0=-1}:{kind:"venue"|"vendor"|"any";type:string;shelf?:Shelf;query?:string;go:(h:string)=>void;title:string;chip?:number;tagChip?:number}){
 const category=shelf?.cat,tagChips=shelf?.chips??null,[tc,setTc]=useState(isNaN(tag0)?-1:tag0);
 const terr=byCode(type),[chip,setChip]=useState(isNaN(chip0)?-1:chip0);
 const [sub,setSub]=useState<string|null>(null),[guests,setGuests]=useState(0),[page,setPage]=useState<Page|null>(null),[more,setMore]=useState<Item[]>([]),[err,setErr]=useState(false),[loading,setLoading]=useState(false);
 const vc=kind==="venue"&&terr?chipArgs(chip<0?terr.venueChips:[terr.venueChips[chip]]):null;
 const args=(offset:number)=>({p_type:type||null,p_kind:kind,p_category:vc?vc.p_category:category??null,p_sub:vc?vc.p_sub:(shelf?.sub??sub),p_min_guests:guests||null,p_q:query??null,p_tags:tagChips&&tc>=0?tagChips[tc].re:(shelf?.tags??null),p_limit:30,p_offset:offset});
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
  <div className="ch-rows">{items.map(v=><article key={v.id} className="ch-row">{kind!=="venue"&&v.subcategory&&<span className="ch-card-sub">{v.subcategory}</span>}<b>{v.name}</b><small>{[v.capacity?`до ${v.capacity} гостей`:null,v.address?.replace(/^Алматы,\s*/,"")].filter(Boolean).join(" · ")||"Карточка дозаполняется"}</small></article>)}</div>
  {page&&items.length<page.total&&<button className="ch-cta" disabled={loading} onClick={loadMore}>{loading?"Загружаем…":"Показать ещё"}</button>}
 </section>}

function CatalogHome({go}:{go:(h:string)=>void}){return <section className="ch-block"><h1>Каталог</h1><p>Выберите направление — покажем профильные площадки и исполнителей.</p>
 <div className="ch-list">{territories.map(t=><button key={t.code} onClick={()=>go(`dir=${t.code}`)}><span><b>{t.title}</b></span><em>→</em></button>)}
 <button onClick={()=>go("venues=")}><span><b>Все площадки</b><small>Без привязки к типу события</small></span><em>→</em></button></div></section>}

function Empty({title,text,cta,onCta}:{title:string;text:string;cta:string;onCta:()=>void}){return <section className="ch-block ch-empty"><h1>{title}</h1><p>{text}</p><button className="ch-cta" onClick={onCta}>{cta}</button></section>}

// ───────── Сборка проекта (ассистент): тип → параметры → что нужно → смета, дорожная карта, исполнители ─────────
type Tier={min:number;max:number;tier:number;unit:string};
type Line={title:string;code:string|null;qty:number;unit:string;est:number|null;share:number};
type Project={id:string;type:TypeCode;date:string;guests:number;budget:number|null;level:number;picked:string[];lines:Line[];created:string};
const PKEY="eventer_projects";
const loadProjects=():Project[]=>{try{return JSON.parse(localStorage.getItem(PKEY)||"[]")}catch{return []}};
const saveProject=(p:Project)=>{try{localStorage.setItem(PKEY,JSON.stringify([p,...loadProjects().filter(x=>x.id!==p.id)].slice(0,30)))}catch{/* private mode */}};
const LEVELS=["Эконом","Стандарт","Премиум"];
const money=(n:number)=>n>=1e6?`${(n/1e6).toLocaleString("ru-RU",{maximumFractionDigits:1})} млн ₸`:`${Math.round(n/1000).toLocaleString("ru-RU")} тыс. ₸`;
function priceCode(sh:Shelf,type:TypeCode):string|null{
 if(sh.kind==="venue")return null;
 if(sh.cat===TECH)return "tech";
 if(sh.cat==="Кейтеринг")return "catering";
 if(sh.cat===ARTISTS)return type==="business"?"host":"show";
 if(sh.cat==="Ивент-агентства")return sh.title.startsWith("Booking")?"show":"organizer";
 if(sh.cat==="Оформление/декор")return type==="business"?"print":"decor";
 if(sh.cat==="Фото и видео")return "photo";
 if(sh.sub==="Трансфер/прокат авто")return "transport";
 return null;
}
const shareMid=(s?:string)=>{const m=s?.match(/(\d+)(?:–(\d+))?%/);return m?(Number(m[1])+Number(m[2]??m[1]))/2:3};
function planDate(label:string,date:string){const m=label.match(/(\d+)(?:[–,](\d+))?\s*(месяц|недел|дн|день)/);if(!m||!date)return "";const n=Number(m[2]??m[1]);const days=m[3].startsWith("месяц")?n*30:m[3].startsWith("недел")?n*7:n;const d=new Date(date);d.setDate(d.getDate()-days);return d<new Date()?"срок прошёл — сделать сейчас":"до "+d.toLocaleDateString("ru-RU",{day:"numeric",month:"long"})}

function ProjectBuilder({preset,go}:{preset?:TypeCode;go:(h:string)=>void}){
 const [type,setType]=useState<TypeCode|undefined>(preset),[date,setDate]=useState(""),[guests,setGuests]=useState(100),[budget,setBudget]=useState(""),[level,setLevel]=useState(1),[picked,setPicked]=useState<string[]|null>(null),[busy,setBusy]=useState(false),[err,setErr]=useState(false);
 const t=type?byCode(type)!:null;
 useEffect(()=>{if(t)setPicked(t.shelves.filter(x=>x.share||x.kind==="venue").map(x=>x.title))},[type]);
 const build=async()=>{if(!t||!picked)return;setBusy(true);setErr(false);
  let tiers:Record<string,Tier[]>={};try{tiers=await rpc("pub_price_tiers",{p_city:"Алматы"})}catch{setErr(true)}
  const lines:Line[]=t.shelves.filter(x=>picked.includes(x.title)).map(x=>{const code=priceCode(x,t.code);const tr=code?tiers[code]?.find(q=>q.tier===level):undefined;const qty=tr?.unit==="per_guest"?guests:1;return {title:x.title,code,qty,unit:tr?.unit??"",est:tr?Math.round((tr.min+tr.max)/2*qty):null,share:shareMid(x.share)}});
  const p:Project={id:String(Date.now()),type:t.code,date,guests,budget:budget?Number(budget.replace(/\D/g,""))||null:null,level,picked,lines,created:new Date().toISOString()};
  saveProject(p);setBusy(false);go(`project=${p.id}`)};
 return <section className="ch-block"><span className="ch-eyebrow">АССИСТЕНТ</span><h1>Собрать проект</h1><p>Три шага — и у вас смета, дорожная карта и подбор исполнителей.</p>
  <h2>1. Какое событие?</h2>
  <div className="ch-chips ch-wrap">{territories.map(x=><button key={x.code} className={type===x.code?"on":""} onClick={()=>setType(x.code)}>{x.title}</button>)}</div>
  {t&&<>
   <h2>2. Параметры</h2>
   <div className="ch-form">
    <label>Дата события<input type="date" value={date} onChange={e=>setDate(e.target.value)}/></label>
    <label>Гостей<input inputMode="numeric" value={guests} onChange={e=>setGuests(Number(e.target.value.replace(/\D/g,""))||0)}/></label>
    <label>Бюджет, ₸ (если известен)<input inputMode="numeric" placeholder="например, 15 000 000" value={budget} onChange={e=>setBudget(e.target.value.replace(/[^\d ]/g,""))}/></label>
   </div>
   <div className="ch-chips">{LEVELS.map((l,i)=><button key={l} className={level===i?"on":""} onClick={()=>setLevel(i)}>{l}</button>)}</div>
   <h2>3. Что нужно</h2>
   <div className="ch-checks">{t.shelves.map(x=>{const on=!!picked?.includes(x.title);return <button key={x.title} className={on?"on":""} onClick={()=>setPicked(p=>on?(p??[]).filter(y=>y!==x.title):[...(p??[]),x.title])}><i>{on?"✓":""}</i><span>{x.title}</span></button>})}</div>
   {err&&<p className="ch-note">Цены рынка не загрузились — смета будет без оценки.</p>}
   <button className="ch-prepare ch-go" disabled={busy||!guests||!picked?.length} onClick={build}><b>{busy?"Собираем…":"Собрать проект"}</b><i>→</i></button>
  </>}
 </section>}

function ProjectView({id,go}:{id:string;go:(h:string)=>void}){
 const p=loadProjects().find(x=>x.id===id);
 const [copied,setCopied]=useState(false);
 if(!p)return <Empty title="Проект не найден" text="Возможно, он был создан на другом устройстве." cta="Собрать проект" onCta={()=>go("assistant")}/>;
 const t=byCode(p.type)!;const total=p.lines.reduce((a,l)=>a+(l.est??0),0);const shareSum=p.lines.reduce((a,l)=>a+l.share,0)||1;const reserve=p.budget?Math.round(p.budget*0.1):Math.round(total*0.1);
 const dateTxt=p.date?new Date(p.date).toLocaleDateString("ru-RU",{day:"numeric",month:"long",year:"numeric"}):"дата не указана";
 const summary=[`${t.title} · ${dateTxt} · ${p.guests} гостей · ${LEVELS[p.level]}`,p.budget?`Бюджет: ${money(p.budget)}`:"",``,"Смета:",...p.lines.map(l=>`— ${l.title}: ${l.est?money(l.est):"по запросу"}${p.budget?` (по доле бюджета ${money(p.budget*0.9*l.share/shareSum)})`:""}`),`Итого по оценке рынка: ${money(total)} + резерв ${money(reserve)}`,``,"Дорожная карта:",...t.plan.map(([w,x])=>`— ${w}${p.date?` (${planDate(w,p.date)})`:""}: ${x}`)].filter(x=>x!==undefined).join("\n");
 return <section className="ch-block"><span className="ch-eyebrow">ПРОЕКТ</span><h1 className="ch-h1s">{t.title}</h1><p className="ch-count">{dateTxt} · {p.guests} гостей · {LEVELS[p.level]}{p.budget?` · бюджет ${money(p.budget)}`:""}</p>
  <h2>Смета</h2>
  <div className="ch-list">{p.lines.map(l=><div key={l.title}><span><b>{l.title}</b>{p.budget&&<small>по доле бюджета ≈ {money(p.budget*0.9*l.share/shareSum)}</small>}</span><b>{l.est?money(l.est):<small>по запросу</small>}{l.unit==="per_guest"&&<small>{p.guests} гостей</small>}</b></div>)}
   <div><span><b>Итого по рынку</b><small>резерв 10% — {money(reserve)}</small></span><b>{money(total)}</b></div></div>
  {p.budget&&total>0&&<p className="ch-note">{total+reserve<=p.budget?`Укладываетесь в бюджет: остаётся ${money(p.budget-total-reserve)}.`:`Оценка рынка выше бюджета на ${money(total+reserve-p.budget)} — уберите позиции или выберите уровень ниже.`} Площадка и позиции «по запросу» не входят в итог.</p>}
  <p className="ch-note">Оценка — ориентир Eventer по рынку Алматы, уровень «{LEVELS[p.level]}». Точные цены — в ответах исполнителей.</p>
  <h2>Дорожная карта</h2>
  <div className="ch-plan">{t.plan.map(([w,x])=><div key={w}><b>{w}{p.date?` · ${planDate(w,p.date)}`:""}</b><span>{x}</span></div>)}</div>
  <h2>Исполнители</h2>
  {orderShelves(t.shelves).filter(x=>p.picked.includes(x.title)).map((x,i)=>x.kind==="venue"?<VenueShelf key={x.title} t={t} s={x} go={go} minGuests={p.guests}/>:<ShelfRow key={x.title} sh={x} type={t.code} go={go} idx={orderShelves(t.shelves).indexOf(x)}/>)}
  <h2>Креатив</h2>
  <div className="ch-list"><div className="muted"><span>2–3 идеи концепции под цель и бюджет</span><small>скоро</small></div></div>
  <div className="ch-actions"><button className="ch-cta" onClick={()=>{navigator.clipboard?.writeText(summary).then(()=>setCopied(true)).catch(()=>setCopied(false))}}>{copied?"Скопировано":"Скопировать для руководителя"}</button><button className="ch-cta" onClick={()=>window.print()}>Сохранить в PDF</button></div>
 </section>}

function ProjectsList({go}:{go:(h:string)=>void}){
 const [list,setList]=useState<Project[]>([]);useEffect(()=>setList(loadProjects()),[]);
 if(!list.length)return <Empty title="Проекты" text="Здесь появятся ваши проекты: смета, дорожная карта и исполнители по каждому событию." cta="Собрать проект" onCta={()=>go("assistant")}/>;
 return <section className="ch-block"><h1>Проекты</h1><div className="ch-rows">{list.map(p=><button key={p.id} className="ch-row ch-rowbtn" onClick={()=>go(`project=${p.id}`)}><span className="ch-card-sub">{byCode(p.type)?.title}</span><b>{p.date?new Date(p.date).toLocaleDateString("ru-RU",{day:"numeric",month:"long"}):"Без даты"} · {p.guests} гостей</b><small>{p.lines.length} позиций · {LEVELS[p.level]}{p.budget?` · ${money(p.budget)}`:""}</small></button>)}</div>
 <button className="ch-cta" onClick={()=>go("assistant")}>Собрать новый проект</button></section>}
