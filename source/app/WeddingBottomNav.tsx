"use client";
import "./wedding-bottom-nav.css";

const BASE=import.meta.env.BASE_URL||"/";

export function WeddingBottomNav({eventId="wedding"}:{eventId?:string}){const items=[{label:"Главная",href:`${BASE}#event=${eventId}`},{label:"Каталог",href:`${BASE}?section=catalog#event=${eventId}`},{label:"Ассистент",href:`${BASE}assistant-stub/?event=${eventId}`},{label:"Журнал",href:`${BASE}?section=journal#event=${eventId}`},{label:"Мой план",href:`${BASE}my-plan/?event=${eventId}`}];return <nav className="wedding-global-nav" aria-label="Навигация события">{items.map((item,i)=><a href={item.href} key={item.label}><i className={`wedding-nav-art wedding-nav-art-${i}`} aria-hidden="true"/><span>{item.label}</span></a>)}</nav>}
