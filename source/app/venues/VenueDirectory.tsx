import "./venues.css";
import {WeddingBottomNav} from "../WeddingBottomNav";

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
  return <main className="venue-page">
    <header className="venue-head"><a href="../discover">eventer</a><span><Icon name="pin"/> Алматы</span><a href="../vendor-mockup/" aria-label="Личный кабинет"><Icon name="user"/></a></header>
    <section className="venue-title"><span>КАТАЛОГ EVENTER</span><h1>Скоро: каталог площадок</h1><p>Здесь появятся площадки из базы Eventer с проверенными параметрами, фотографиями и фильтрами.</p><a className="venue-action" href="../discover">Вернуться на главную</a></section>
    <WeddingBottomNav/>
  </main>;
}
