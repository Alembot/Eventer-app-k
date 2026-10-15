"use client";
import "./wedding-bottom-nav.css";

const items=[
  {label:"Главная",href:"/discover?event=wedding"},
  {label:"Профи",href:"/discover?event=wedding#wedding-pros"},
  {label:"Ассистент",href:"/assistant"},
  {label:"Журнал",href:"/discover?event=wedding#wedding-journal"},
  {label:"Сохранено",href:"/discover?event=wedding#saved"}
];

export function WeddingBottomNav(){return <nav className="wedding-global-nav" aria-label="Навигация свадьбы">{items.map((item,i)=><a href={item.href} key={item.label}><i className={`wedding-nav-art wedding-nav-art-${i}`} aria-hidden="true"/><span>{item.label}</span></a>)}</nav>}
