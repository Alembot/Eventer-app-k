"use client";
import {useEffect,useRef,useState} from "react";
import "./entry.css";
import "./wedding-refresh.css";
import "./reel-clean.css";
import "./light-unified.css";
import type {ShowcaseEvent} from "../showcase-data";
import {WeddingBottomNav} from "../WeddingBottomNav";
type Summary=Pick<ShowcaseEvent,"id"|"label"|"description"|"icon">;
const BASE=import.meta.env.BASE_URL||"/";
const publicUrl=(path:string)=>`${BASE}${path.replace(/^\//,"")}`;
export function ShowcaseClient(){const [events,setEvents]=useState<Summary[]>([]),[selected,setSelected]=useState<ShowcaseEvent|null>(null),[mode,setMode]=useState<"entry"|"private"|"business">("entry"),[loading,setLoading]=useState(true),[error,setError]=useState(false);
useEffect(()=>{fetch(publicUrl("api/showcase.json")).then(r=>r.ok?r.json():Promise.reject()).then(d=>setEvents(d.events??[])).catch(()=>setError(true)).finally(()=>setLoading(false))},[]);
useEffect(()=>{const restore=()=>{const hash=decodeURIComponent(location.hash.slice(1));if(hash.startsWith("event=")){choose(hash.slice(6),false);return}setSelected(null);setMode(hash==="private"?"private":hash==="business"?"business":"entry")};restore();addEventListener("popstate",restore);return()=>removeEventListener("popstate",restore)},[]);
useEffect(()=>{if(!selected)return;const section=new URLSearchParams(location.search).get("section");if(section)setTimeout(()=>document.getElementById(selected.id==="wedding"?`wedding-${section}`:section)?.scrollIntoView(),50)},[selected]);
function route(hash:string){history.pushState({},"",`${location.pathname}#${hash}`);if(hash==="private"){setSelected(null);setMode("private")}else if(hash==="business"){setSelected(null);setMode("business")}else if(hash==="start"){setSelected(null);setMode("entry")}}
function back(fallback:string){if(history.length>1)history.back();else route(fallback)}
async function choose(id:string,push=true){setLoading(true);setError(false);try{const r=await fetch(publicUrl(`api/showcase-${encodeURIComponent(id)}.json`));if(!r.ok)throw new Error();setSelected((await r.json()).event);setMode("private");if(push)history.pushState({},"",`${location.pathname}#event=${encodeURIComponent(id)}`);window.scrollTo({top:0,behavior:"smooth"})}catch{setError(true)}finally{setLoading(false)}}
const nonStart=!!selected||mode!=="entry";
return <main className="showcase-app"><header className={`showcase-header${selected?.id==="wedding"?" wedding-header":""}${!selected?" entry-header":""}`}>{nonStart&&<button className="global-back" aria-label="Назад" onClick={()=>back("start")}>←</button>}<button className="showcase-logo" onClick={()=>route("start")}><img src={publicUrl("eventer-logo.svg")} alt="eventer"/></button><nav><button className="active" onClick={()=>route("start")}>Витрина</button><a href="#journal">Идеи</a><a href="#partners">Партнёры</a></nav><span className="wedding-city">Алматы⌄</span><a className="showcase-signin" aria-label="Личный кабинет" href={publicUrl(`vendor-mockup/?from=${selected?.id||mode}#profile`)}><LineIcon name="profile"/></a></header>
{!selected&&mode==="entry"&&<section className="eventer-entry"><div className="eventer-entry-copy"><span>СОБЫТИЯ НАЧИНАЮТСЯ ЗДЕСЬ</span><h1>Создавайте события, которые запомнятся</h1><p>Идеи, профессионалы и готовые решения для частных и деловых событий.</p></div><div className="eventer-entry-actions"><button onClick={()=>route("private")}><b>Частное событие</b><span>Для себя и близких</span></button><button onClick={()=>route("business")}><b>Для бизнеса</b><span>Для команды и бренда</span></button></div></section>}
{!selected&&mode==="private"&&<section className="event-select-screen"><button className="entry-back" onClick={()=>back("start")}>← Назад</button><div className="event-select-copy"><span>ЧАСТНОЕ СОБЫТИЕ</span><h1>Какой у вас повод?</h1><p>Выберите событие — EVENTER откроет тематическую витрину идей и предложений.</p></div>{loading&&<div className="showcase-state">Загружаем форматы…</div>}{error&&<div className="showcase-state error">Не удалось получить данные. Обновите страницу.</div>}{!loading&&!error&&<div className="event-type-grid private-four">{events.filter(e=>["wedding","kids","anniversary","party"].includes(e.id)).map(e=><button key={e.id} onClick={()=>choose(e.id)}><i>{e.icon}</i><b>{e.label}</b><small>{e.description}</small></button>)}</div>}</section>}
{!selected&&mode==="business"&&<BusinessSelect onBack={()=>back("start")}/>}
{selected?.id==="wedding"&&<WeddingPage onBack={()=>back("private")}/>}
{selected&&selected.id!=="wedding"&&<><section className="showcase-hero"><div><button className="change-event" onClick={()=>setSelected(null)}>← Выбрать другое событие</button><span>ВАШЕ СОБЫТИЕ</span><h1>{selected.hero}</h1><p>{selected.lead}</p></div><aside><span>EVENTER AI</span><h2>Расскажите, что уже известно</h2><div><button>Город</button><button>Дата</button><button>Гости</button><button>Бюджет</button></div><button className="assistant-start">✦ Начать диалог</button></aside></section><nav className="showcase-categories">{selected.categories.map(x=><a href="#catalog" key={x}>{x}</a>)}</nav>
<Shelf eyebrow="ВЫБОР EVENTER" title="Идеи, которые стоит посмотреть"><div className="showcase-reels">{selected.reels.map(x=><article className={`showcase-reel ${x.tone}`} style={{backgroundImage:`linear-gradient(transparent 35%,rgba(0,0,0,.78)),url(${x.image})`}} key={x.title}><span>▶</span><b>{x.title}</b><small>{x.meta}</small></article>)}</div></Shelf>
<Shelf id="journal" eyebrow="ПОПУЛЯРНО СЕЙЧАС" title="Что сохраняют чаще всего" alternate><div className="recommend-grid">{selected.recommendations.map((x,i)=><article key={x}><span>0{i+1}</span><h3>{x}</h3><p>Идеи и предложения партнёров</p></article>)}</div></Shelf>
<Shelf id="partners" eyebrow="ПАРТНЁРЫ EVENTER" title="Предложения для вашего события"><div className="professional-row">{selected.professionals.map(x=><button key={x}><b>{x}</b><small>Смотреть предложения →</small></button>)}</div></Shelf>
<section className="tailored-event"><div><span>ВАШ СТИЛЬ</span><h2>Получите витрину, собранную именно для вас</h2><p>Ответьте на пять коротких вопросов — мы подберём идеи, предложения партнёров и готовые решения.</p><button className="tailored-start">Настроить витрину</button></div><aside><b>5</b><small>коротких вопросов</small></aside></section>
<Shelf eyebrow="ГОТОВОЕ ПРЕДЛОЖЕНИЕ" title="Можно заказать целиком"><div className="ready-grid">{selected.ready.map(x=><article key={x.title}><span>{x.label}</span><h3>{x.title}</h3><p>{x.includes}</p><footer><b>{x.price}</b><a href="#">Открыть →</a></footer></article>)}</div></Shelf>
<Shelf eyebrow="ЖУРНАЛ" title="Как организовать событие"><div className="article-grid">{selected.articles.map((x,i)=><article key={x.title}><em>0{i+1}</em><h3>{x.title}</h3><p>{x.text}</p></article>)}</div></Shelf>
<Shelf id="catalog" eyebrow="ВСЕ КАТЕГОРИИ" title="Продолжить поиск" alternate><div className="professional-row">{selected.categories.filter(x=>x!=="Всё").map(x=><button key={x}><b>{x}</b><small>Открыть категорию →</small></button>)}</div></Shelf></>}{selected?.id==="wedding"?<WeddingBottomNav eventId="wedding"/>:selected&&<DynamicNav eventId={selected.id} onHome={()=>choose(selected.id)}/>}{loading&&selected&&<div className="showcase-loading">Обновляем витрину…</div>}</main>}
function Shelf({eyebrow,title,children,alternate=false,id}:{eyebrow:string;title:string;children:React.ReactNode;alternate?:boolean;id?:string}){return <section id={id} className={`showcase-shelf${alternate?" alternate":""}`}><header><div><span>{eyebrow}</span><h2>{title}</h2></div><button>Смотреть всё →</button></header>{children}</section>}

const privateNav:[string,string,string,string,string]=["Главная","Каталог","Ассистент","Журнал","Мой план"];
const navByEvent:Record<string,[string,string,string,string,string]>= {
 wedding:privateNav,kids:privateNav,anniversary:privateNav,party:privateNav,other:privateNav
};
function LineIcon({name}:{name:"home"|"venue"|"ideas"|"dress"|"saved"|"pin"|"profile"}){const common={fill:"none",stroke:"currentColor",strokeWidth:1.8,strokeLinecap:"round" as const,strokeLinejoin:"round" as const};return <svg viewBox="0 0 24 24" aria-hidden="true">{name==="home"&&<><path {...common} d="M3.5 10.5 12 3.8l8.5 6.7"/><path {...common} d="M5.5 9.8v10.4h13V9.8M9.2 20.2v-6.4h5.6v6.4"/></>}{name==="venue"&&<><path {...common} d="M12 21s6-6.2 6-12a6 6 0 1 0-12 0c0 5.8 6 12 6 12Z"/><path {...common} d="M9 10.8V9.2a3 3 0 0 1 6 0v1.6M8.2 11h7.6"/></>}{name==="ideas"&&<><rect {...common} x="3.5" y="6" width="11" height="13" rx="2"/><rect {...common} x="9.5" y="3" width="11" height="13" rx="2"/><path {...common} d="m16.8 6 .5 1.2 1.2.5-1.2.5-.5 1.2-.5-1.2-1.2-.5 1.2-.5.5-1.2Z"/></>}{name==="dress"&&<><path {...common} d="M9.2 3.5h5.6l-1.1 5.2 4.8 11.8h-13l4.8-11.8-1.1-5.2Z"/><path {...common} d="M9.2 3.5c.8 1.5 4.8 1.5 5.6 0M8.2 13h7.6"/></>}{name==="saved"&&<path {...common} d="M6.5 3.5h11v17l-5.5-3.6-5.5 3.6v-17Z"/>}{name==="pin"&&<><path {...common} d="M12 21s6-6.2 6-12a6 6 0 1 0-12 0c0 5.8 6 12 6 12Z"/><circle {...common} cx="12" cy="9" r="2"/></>}{name==="profile"&&<><circle {...common} cx="12" cy="7.5" r="3.5"/><path {...common} d="M5.5 20.2v-2.3a6.5 6.5 0 0 1 13 0v2.3"/></>}</svg>}
function DynamicNav({eventId,onHome}:{eventId:string;onHome:()=>void}){const items=navByEvent[eventId]??navByEvent.other;const iconNames:["home","venue","ideas","dress","saved"]=["home","venue","ideas","dress","saved"];const anchors=[`${BASE}#event=${eventId}`,`${BASE}?section=catalog#event=${eventId}`,publicUrl(`assistant-stub/?event=${eventId}`),`${BASE}?section=journal#event=${eventId}`,publicUrl(`my-plan/?event=${eventId}`)];const icon=(i:number)=><i><LineIcon name={iconNames[i]}/></i>;return <nav className="dynamic-bottom-nav" aria-label="Навигация события">{items.map((x,i)=>i===0?<button key={x} onClick={onHome}>{icon(i)}<span>{x}</span></button>:<a key={x} href={anchors[i]}>{icon(i)}<span>{x}</span></a>)}</nav>}

const businessTypes=[
 ["Деловое событие","business-tiles/biz-business.png"],
 ["Концерт и культурное событие","business-tiles/biz-concert.png"],
 ["Общественное событие","business-tiles/biz-public.png"],
 ["Корпоративное событие","business-tiles/biz-corporate.png"]
];
function BusinessSelect({onBack}:{onBack:()=>void}){return <section className="business-select"><button className="entry-back" onClick={onBack}>← Для бизнеса</button><h1>Какое событие вы организуете?</h1><div className="business-tile-grid">{businessTypes.map(([title,image])=><button key={title} style={{backgroundImage:`url(${publicUrl(image)})`}} onClick={()=>window.location.href=publicUrl("nav-mockup/")}><b>{title}</b><i>→</i></button>)}</div></section>}

const planning=[
 {label:"Площадки",code:"venue"},{label:"Декор",code:"decor"},{label:"Платья",code:"dress"},{label:"Идеи",code:"organizer"},
 {label:"Оборудование",code:"tech"},{label:"Love Story",code:"photo"},{label:"Регистрация",code:"ceremony"},{label:"Видеографы",code:"video"},
 {label:"Фотографы",code:"photo"},{label:"Лимузины",code:"transport"},{label:"Организатор",code:"organizer"},{label:"Свадебный торт",code:"cake"}
];
const realWeddings=[
 ["Данияр и Сауле","15 фото","https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=86"],
 ["Алина и Арман","28 фото","https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=900&q=86"],
 ["Диана и Тимур","21 фото","https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=86"],
 ["Аяулым и Алихан","34 фото","https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=900&q=86"],
 ["Мадина и Адиль","18 фото","https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=86"]
];
const ideas=["Основы планирования","Как спланировать бюджет","Церемония и регистрация","Выбор платья","Причёска и макияж","Приглашения и рассадка","Свадебный торт","Развлекательная программа"];
const weddingReels=[1,2,3,4,5].map(i=>publicUrl(`wedding-reels/reel-${i}.mp4`));
const siteDesigns=["Нежная ботаника","Современная классика","Белый минимализм","Казахские мотивы","Романтика в горах","Тёмная элегантность"].map((name,i)=>({name,image:publicUrl(`wedding-references/sites/${i+1}.jpg`)}));
const referenceShelves=[
 {id:"venues",title:"Площадки для вашей свадьбы",text:"Банкетные залы, загородные пространства и необычные локации.",folder:"venues",names:["Торжественный зал","Свадьба за городом","Современное пространство","Камерный ресторан","Летняя площадка","Большой банкет"]},
 {id:"decor",title:"Декор и атмосфера",text:"Цветы, свет, сервировка и детали, которые создают настроение.",folder:"decor",names:["Воздушная флористика","Современная классика","Свет и цветы","Камерный декор","Нежная палитра","Вечерняя атмосфера"]},
 {id:"ceremony",title:"Выездная регистрация",text:"Красивые церемонии, арки и пространства для главного момента.",folder:"ceremony",names:["Церемония в саду","Классическая арка","Регистрация у воды","Современная церемония","Горная локация","Вечерняя регистрация"]},
 {id:"cakes",title:"Свадебные торты",text:"От лаконичной классики до авторских кондитерских решений.",folder:"cakes",names:["Белая классика","Цветочная композиция","Минималистичный торт","Авторский дизайн","Романтический декор","Современная подача"]},
 {id:"videographers",title:"Свадебное видео",text:"Команды, которые сохранят атмосферу и живые эмоции вашего дня.",folder:"videographers",names:["История пары","Свадебный фильм","Утро невесты","Церемония","Эмоции гостей","Главные моменты"]},
 {id:"limos",title:"Свадебный транспорт",text:"Автомобили для пары, гостей и эффектного появления.",folder:"limos",names:["Белый лимузин","Автомобиль для пары","Классический кортеж","Современный седан","Трансфер гостей","Ретроавтомобиль"]}
];
const dresses=[
 ["Современная классика","/wedding-dresses/dress-1.jpg"],
 ["Этнический образ","/wedding-dresses/dress-2.jpg"],
 ["Дворцовая коллекция","/wedding-dresses/dress-3.jpg"],
 ["Романтическое кружево","/wedding-dresses/dress-4.jpg"],
 ["Национальный образ","/wedding-dresses/dress-5.jpg"],
 ["Чистый силуэт","/wedding-dresses/dress-6.webp"],
 ["Воздушная классика","/wedding-dresses/dress-7.jpg"],
 ["Современная невеста","/wedding-dresses/dress-8.jpg"],
 ["Торжественный образ","/wedding-dresses/dress-9.jpg"],
 ["Лаконичное платье","/wedding-dresses/dress-10.jpg"]
];
const destinations=[
 ["Бали","Церемония у океана","https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?auto=format&fit=crop&w=900&q=86"],
 ["Мальдивы","Свадьба на белом песке","https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=900&q=86"],
 ["Каппадокия","Рассвет среди воздушных шаров","https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=900&q=86"],
 ["Санторини","Белые террасы над морем","https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=86"],
 ["Таиланд","Тропический вечер","https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=86"]
];
function Row({children}:{children:React.ReactNode}){return <div className="ww-mobile-row">{children}</div>}
function SectionTitle({title,text}:{title:string;text:string}){return <header className="ww-mobile-title"><h2>{title}</h2><p>{text}</p></header>}
function ReferenceShelf({item,index}:{item:typeof referenceShelves[number];index:number}){return <section className={`ww-mobile-section${index%2?" sea":""}`} id={`wedding-${item.id}`}><SectionTitle title={item.title} text={item.text}/><Row>{item.names.map((name,i)=><article className="ww-ref-card" key={name}><img src={publicUrl(`wedding-references/${item.folder}/${i+1}.jpg`)} alt=""/><h3>{name}</h3><p>Смотреть предложения →</p></article>)}</Row></section>}
function AutoReel({src,index}:{src:string;index:number}){const ref=useRef<HTMLVideoElement>(null);useEffect(()=>{const video=ref.current;if(!video)return;const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;if(reduced){video.controls=true;video.pause();return}const observer=new IntersectionObserver(([entry])=>{if(entry.isIntersecting&&entry.intersectionRatio>=.25)video.play().catch(()=>{video.controls=true});else video.pause()},{threshold:[0,.25,.6]});observer.observe(video);return()=>observer.disconnect()},[]);return <video ref={ref} src={src} aria-label={`Свадебное видео ${index+1}`} muted autoPlay loop playsInline preload={index<2?"auto":"metadata"}/>}
function ReelShelf({videos,eyebrow,title}:{videos:string[];eyebrow:string;title:string}){return <section className="ww-reel-shelf"><div className="ww-reel-eyebrow">{eyebrow}</div><h2>{title}</h2><div className="ww-reel-track">{videos.map((src,i)=><article className="ww-reel-card" key={`${title}-${src}`}><div className="ww-reel-frame"><AutoReel src={src} index={i}/></div></article>)}</div><p className="ww-reel-hint">Листайте → Видео воспроизводятся автоматически.</p></section>}
function WeddingPage({onBack}:{onBack:()=>void}){return <div className="ww-page ww-mobile">
 <button className="ww-back" onClick={onBack}>← Выбрать повод</button>
 <div className="wedding-heading"><span>СВАДЬБА</span><h1>Ваша свадьба.<br/>Ваша история.</h1></div>
 <div className="ww-cover"><a className="find-style" href="#wedding-style">Найти свой стиль ↗</a></div>
 <section className="ww-mobile-section ww-category-section" id="wedding-pros"><SectionTitle title="Свадебные профи" text="Соберите команду для своей свадьбы."/><div className="ww-category-strip">{planning.map((x,i)=><a className="ww-round-category" key={x.label} href={publicUrl(x.code==="venue"?"venue-shelves/?v=2":`catalog/?category=${x.code}&event=wedding`)}><i className={`category-art art-${i+1}`}/><b>{x.label}</b></a>)}</div></section>
 <div id="wedding-love-story"><ReelShelf videos={weddingReels} eyebrow="Вдохновение в движении" title="Почувствуйте атмосферу"/></div>
 <section className="ww-detail-pause" id="wedding-style"><div className="ww-reel-eyebrow">Найдите своё настроение</div><h2>Выберите стиль свадьбы</h2><div className="ww-style-track"><article><img src={publicUrl("wedding-references/decor/1.jpg")} alt="Современная свадьба"/><b>Современная классика</b></article><article><img src={publicUrl("wedding-references/ceremony/2.jpg")} alt="Свадьба на природе"/><b>Свадьба на природе</b></article><article><img src={publicUrl("wedding-references/venues/3.jpg")} alt="Городская свадьба"/><b>Городской шик</b></article><article><img src={publicUrl("wedding-references/decor/5.jpg")} alt="Романтическая свадьба"/><b>Нежная романтика</b></article><article><img src={publicUrl("wedding-references/ceremony/5.jpg")} alt="Свадьба в горах"/><b>Свадьба в горах</b></article></div></section>
 <section className="ww-feel-banner" id="wedding-assistant"><div className="ww-reel-eyebrow">СВАДЕБНЫЙ ПЛАНИРОВЩИК</div><h2>Не знаете, с чего начать?</h2><p>Eventer рассчитает бюджет и подберёт исполнителей.</p><button className="ww-assistant-button" onClick={()=>window.location.href=publicUrl("brief-mockup/?from=wedding#event")}>Начать →</button></section>
 <section className="ww-mobile-section sea"><SectionTitle title="Свадьбы известных пар" text="Образы, церемонии и решения, которые обсуждали и сохраняли."/><Row>{realWeddings.map((x,i)=><article className="ww-real-card" key={x[0]}><img src={x[2]} alt=""/><h3>{["Торжество у воды","Современная классика","Камерная церемония","Свадьба в горах","Большой семейный вечер"][i]}</h3><p>История · {x[1]}</p></article>)}</Row><button className="ww-vote">Смотреть все истории →</button></section>
 {referenceShelves.map((item,i)=><ReferenceShelf item={item} index={i} key={item.id}/>)}
 <section className="ww-mobile-section" id="wedding-journal"><SectionTitle title="Журнал" text="Свежие тренды и практические советы наших свадебных экспертов."/><Row>{ideas.map((x,i)=><button className="ww-idea-chip" key={x}><i>0{i+1}</i><b>{x}</b><small>Читать →</small></button>)}</Row></section>
 <section className="ww-mobile-section sea"><SectionTitle title="Создайте свой свадебный сайт" text="Быстро создайте свой сайт и поделитесь важной информацией с гостями."/><Row>{siteDesigns.map((x,i)=><article className={`ww-site-card s${i}`} key={x.name} style={{backgroundImage:`linear-gradient(rgba(255,255,255,.06),rgba(5,45,43,.42)),url(${x.image})`}}><b>{x.name}</b><small>Открыть дизайн</small></article>)}</Row></section>
 <section className="ww-mobile-section" id="wedding-dresses"><SectionTitle title="Каталог свадебных платьев" text="Откройте последние тенденции от лучших дизайнеров и образы для подружек невесты."/><Row>{dresses.map(x=><article className="ww-image-card" key={x[0]}><img src={publicUrl(x[1])} alt=""/><h3>{x[0]}</h3><p>Смотреть коллекцию →</p></article>)}</Row></section>
 <section className="ww-mobile-section sea"><SectionTitle title="Свадьба в экзотических странах" text="Выберите необычное направление — мы поможем учесть местные традиции и особенности."/><Row>{destinations.map(x=><article className="ww-destination" key={x[0]} style={{backgroundImage:`linear-gradient(transparent 45%,rgba(0,0,0,.74)),url(${x[2]})`}}><h3>{x[0]}</h3><p>{x[1]}</p></article>)}</Row></section>
 <section className="ww-mobile-section"><SectionTitle title="Ваше свадебное путешествие" text="Лучшие направления, романтические отели и готовые предложения для медового месяца."/><Row>{destinations.slice().reverse().map((x,i)=><article className="ww-honeymoon" key={x[0]}><img src={x[2]} alt=""/><span>HONEYMOON</span><h3>{x[0]}</h3><p>{["7 ночей · для двоих","Островной отдых","Романтический маршрут","Отель у моря","Персональное путешествие"][i]}</p></article>)}</Row></section>
 </div>}
