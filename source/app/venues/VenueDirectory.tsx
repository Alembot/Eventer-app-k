"use client";
import {useState} from "react";
import "./venues.css";
import {WeddingBottomNav} from "../WeddingBottomNav";

const venues=[
  {name:"Oi-Qaragai",place:"Бескайнар · 35 км",rating:"4,8",reviews:"52 отзыва",capacity:"до 180 гостей",price:"по запросу",image:"/wedding-references/venues/drive-4533.jpg",count:"1 / 24",tags:["Банкет","Выездная церемония","Парковка"],available:"Свободна 14 сентября"},
  {name:"Свадебный двор",place:"Алматы · Медеуский район",rating:"4,7",reviews:"31 отзыв",capacity:"до 120 гостей",price:"от 35 000 ₸",image:"/wedding-references/venues/drive-4534.jpg",count:"1 / 18",tags:["Церемония","Открытая площадка"],available:"Дату уточнит площадка"}
];

function Icon({name}:{name:"pin"|"user"|"search"|"sparkle"|"calendar"|"users"|"filter"|"heart"|"send"|"home"|"ideas"|"dress"|"saved"}){
  const paths:Record<string,React.ReactNode>={
    pin:<><path d="M12 21s6-6.2 6-12a6 6 0 1 0-12 0c0 5.8 6 12 6 12Z"/><circle cx="12" cy="9" r="2"/></>,
    user:<><circle cx="12" cy="7.5" r="3.5"/><path d="M5.5 20.2v-2.3a6.5 6.5 0 0 1 13 0v2.3"/></>,
    search:<><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/></>,sparkle:<path d="m12 3 1.3 5.7L19 10l-5.7 1.3L12 17l-1.3-5.7L5 10l5.7-1.3L12 3Z"/>,
    calendar:<><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4m8-4v4M4 10h16"/></>,users:<><circle cx="9" cy="9" r="3"/><circle cx="17" cy="10" r="2.5"/><path d="M3.5 20a5.5 5.5 0 0 1 11 0m0-4a4.5 4.5 0 0 1 6 4"/></>,filter:<><path d="M4 6h16M7 12h10M10 18h4"/></>,heart:<path d="M20.8 5.8c-2.2-2.2-5.7-1.8-7.6.6L12 8l-1.2-1.6c-1.9-2.4-5.4-2.8-7.6-.6-2.3 2.3-2.3 6 0 8.3L12 22l8.8-7.9c2.3-2.3 2.3-6 0-8.3Z"/>,send:<path d="m4 4 17 8-17 8 3-8-3-8Zm3 8h14"/>,home:<><path d="M3.5 10.5 12 3.8l8.5 6.7"/><path d="M5.5 9.8v10.4h13V9.8"/></>,ideas:<><rect x="4" y="5" width="16" height="15" rx="2"/><path d="m15 8 .7 1.6 1.8.4-1.8.5L15 12l-.7-1.5-1.8-.5 1.8-.4L15 8Z"/></>,dress:<path d="M9.2 3.5h5.6l-1.1 5.2 4.8 11.8h-13l4.8-11.8-1.1-5.2Z"/>,saved:<path d="M6.5 3.5h11v17L12 16.9l-5.5 3.6v-17Z"/>
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

export function VenueDirectory(){
  const [active,setActive]=useState("Все");
  const [saved,setSaved]=useState<string[]>([]);
  const [notice,setNotice]=useState("");
  const save=(name:string)=>setSaved(x=>x.includes(name)?x.filter(v=>v!==name):[...x,name]);
  return <main className="venue-page">
    <header className="venue-head"><a href="/">eventer</a><span><Icon name="pin"/> Алматы</span><a href="/" aria-label="Личный кабинет"><Icon name="user"/></a></header>
    <section className="venue-title"><span>СВАДЬБА · ПЛОЩАДКИ</span><h1>Площадки для<br/>вашей свадьбы</h1><p>Банкетные залы, загородные пространства и необычные локации.</p></section>
    <button className="venue-search"><Icon name="search"/><span>Название или район</span><b><Icon name="sparkle"/></b></button>
    <div className="venue-quick"><button><Icon name="calendar"/>Дата</button><button><Icon name="users"/>Гостей</button><button><Icon name="filter"/>Фильтры<i>2</i></button></div>
    <nav className="venue-types">{["Все","Банкетные залы","За городом","Отели"].map(x=><button className={active===x?"active":""} onClick={()=>setActive(x)} key={x}>{x}</button>)}</nav>
    <div className="venue-results"><b>128 площадок</b><button>Рекомендуемые⌄</button></div>
    {venues.map((venue,index)=><article className="venue-card" key={venue.name}>
      <div className="venue-photo"><img src={venue.image} alt={venue.name}/><button className={saved.includes(venue.name)?"saved":""} onClick={()=>save(venue.name)} aria-label="Сохранить"><Icon name="heart"/></button><span>{venue.count}</span></div>
      <div className="venue-info"><div className="venue-name"><div><h2>{venue.name}</h2><p><Icon name="pin"/>{venue.place}</p></div><span><b>{venue.rating}</b>{venue.reviews}</span></div>
      {index===0&&<div className="venue-tags">{venue.tags.map(x=><span key={x}>{x}</span>)}</div>}
      <div className="venue-facts"><div><small>Вместимость</small><b>{venue.capacity}</b></div><div><small>Стоимость</small><b>{venue.price}</b></div></div>
      {index===0&&<div className="availability"><i/><span>{venue.available}</span><small>Отвечает около 2 часов</small></div>}
      <button className={index===0?"venue-action":"venue-action secondary"} onClick={()=>setNotice(index===0?`Заявка для ${venue.name} добавлена`:`Запрос даты для ${venue.name} создан`)}>{index===0?"Запросить предложение":"Проверить дату"}</button></div>
    </article>)}
    {notice&&<div className="venue-toast" role="status" onClick={()=>setNotice("")}>{notice}</div>}
    <WeddingBottomNav/>
  </main>;
}
