"use client";
import {useEffect,useState} from "react";
import "../simple-screen.css";

const BASE=import.meta.env.BASE_URL||"/";
export default function AssistantStub(){const [eventId,setEventId]=useState("wedding");useEffect(()=>setEventId(new URLSearchParams(location.search).get("event")||"wedding"),[]);const back=()=>history.length>1?history.back():location.assign(`${BASE}#event=${eventId}`);return <main className="simple-screen"><section><button className="entry-back" onClick={back}>← Назад</button><span>EVENTER AI</span><h1>Ассистент</h1><p>Диалоговый помощник скоро появится здесь.</p><div className="simple-chat">Расскажите, какое событие вы планируете…</div><a href={`${BASE}#event=${eventId}`}>Вернуться на главную</a></section></main>}
