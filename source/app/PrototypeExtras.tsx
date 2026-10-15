"use client";

import { useState } from "react";

type Open = (value: string) => void;

const projectData: Record<string, { date: string; place: string; readiness: number; tasks: [string,string,string][] }> = {
  "Наурыз": { date: "22 марта 2027", place: "Площадь Астана", readiness: 64, tasks: [["Утвердить техническое задание","Сегодня, 18:00","В работе"],["Выбрать сценическое оборудование","Завтра, 12:00","В работе"],["Проверить план безопасности","24 октября","Отложена"],["Закрыть договор с подрядчиком","28 октября","В работе"]] },
  "День города": { date: "20 сентября 2027", place: "Алматы", readiness: 38, tasks: [["Подготовить закупочную документацию","Сегодня, 17:00","В работе"],["Согласовать программу площадок","25 октября","В работе"],["Назначить ответственных","28 октября","Отложена"],["Проверить бюджет проекта","30 октября","В работе"]] },
  "Новый год": { date: "20 декабря 2026", place: "Allur Auto", readiness: 22, tasks: [["Сформировать бриф","Сегодня, 16:00","В работе"],["Выбрать формат события","Завтра, 11:00","В работе"],["Запросить предложения агентств","26 октября","Отложена"],["Утвердить предварительную смету","30 октября","В работе"]] },
};

export function ProjectEventHome({ open }: { open: Open }) {
  const [event, setEvent] = useState("Наурыз");
  const info = projectData[event];
  const upcoming=[["Сегодня","Рабочая встреча по Наурызу","15:00"],["24 окт","Приём заявок подрядчиков","18:00"],["28 окт","Защита концепции Дня города","11:00"],["30 окт","Согласование бюджета","16:30"]];
  return <section className="customer-dashboard">
    <header className="customer-dashboard-head"><div><p>ГЛАВНАЯ · ЗАКАЗЧИК</p><h1>Проекты и задачи</h1></div><details className="create-dropdown"><summary>＋ Создать</summary><div>{[["Встреча","◷"],["Напоминание","!"],["Звонок","☎"],["Задачу","✓"],["Проект","◈"]].map(([title,icon])=><button key={title} onClick={()=>open(`Создать: ${title}`)}><span>{icon}</span>{title}</button>)}</div></details></header>
    <div className="customer-layout"><main className="customer-work"><div className="project-picker"><label><span>ВЫБРАТЬ ПРОЕКТ</span><select value={event} onChange={e=>setEvent(e.target.value)}>{Object.keys(projectData).map(name=><option key={name}>{name}</option>)}</select></label><div><strong>{info.readiness}%</strong><span>готовность</span></div></div><section className="task-board"><header><div><small>ОСНОВНАЯ РАБОТА</small><h2>Задачи проекта</h2></div><button onClick={()=>open("Все задачи")}>Все задачи</button></header>{info.tasks.map(([title,date,status],index)=><button className="task-row" key={title} onClick={()=>open(title)}><span className={index===0?"task-check urgent":"task-check"}>{index+1}</span><div><strong>{title}</strong><small>{date}</small></div><em>{status}</em><b>›</b></button>)}</section></main><aside className="upcoming-events"><header><div><small>КАЛЕНДАРЬ</small><h2>Ближайшие события</h2></div><button onClick={()=>open("Календарь")}>Все</button></header>{upcoming.map(([date,title,time],index)=><button key={title} onClick={()=>open(title)}><span className={index===0?"today":""}>{date}</span><div><strong>{title}</strong><small>{time}</small></div></button>)}</aside></div>
  </section>;
}

const conversations = [
  { id: "ai", initials: "✦", name: "EVENTER AI", role: "Ассистент", preview: "Я обновил дорожную карту события", time: "10:42", unread: 2 },
  { id: "team", initials: "FM", name: "Freedom Music Fest", role: "Команда события", preview: "Айдана: концепция сцены готова", time: "10:18", unread: 4 },
  { id: "sound", initials: "TS", name: "TechSound", role: "Подрядчик · ваш бриф", preview: "Отправили уточнённую смету", time: "09:56", unread: 1 },
  { id: "arena", initials: "AA", name: "Almaty Arena", role: "Площадка · бронирование", preview: "Держим резерв до 18:00", time: "Вчера", unread: 0 },
  { id: "artist", initials: "АС", name: "Айгерим Садыкова", role: "Менеджер артиста", preview: "Подтверждаем доступность даты", time: "Вчера", unread: 0 },
];

export function MessagesView({ open }: { open: Open }) {
  const [mode, setMode] = useState("Лента");
  const [selected, setSelected] = useState("team");
  const active = conversations.find((item) => item.id === selected)!;
  return <section className="messages-page">
    <header className="messages-heading"><div><p>КОМАНДА И ПРОЕКТЫ</p><h1>Рабочая лента</h1><span>Важные обновления событий, решения команды и диалоги — без лишнего шума.</span></div><button onClick={() => open(mode === "Лента" ? "Добавить обновление" : "Новый диалог")}>＋ {mode === "Лента" ? "Обновление" : "Новый диалог"}</button></header>
    <nav className="feed-mode"><button className={mode === "Лента" ? "active" : ""} onClick={() => setMode("Лента")}>Лента</button><button className={mode === "Чаты" ? "active" : ""} onClick={() => setMode("Чаты")}>Чаты <b>7</b></button></nav>
    {mode === "Лента" ? <ProjectFeed open={open} /> : <div className="message-shell">
      <aside className="conversation-pane"><label>⌕ <input placeholder="Найти сообщение или контакт" /></label><div className="message-filters"><button className="active">Все</button><button>События</button><button>Запросы</button></div>{conversations.map((item) => <button className={selected === item.id ? "active" : ""} key={item.id} onClick={() => setSelected(item.id)}><i className={`conversation-avatar ${item.id}`}>{item.initials}</i><span><strong>{item.name}</strong><small>{item.role}</small><em>{item.preview}</em></span><time>{item.time}</time>{item.unread > 0 && <b>{item.unread}</b>}</button>)}</aside>
      <article className="chat-pane"><header><i className={`conversation-avatar ${active.id}`}>{active.initials}</i><div><strong>{active.name}</strong><small>{active.role} · онлайн</small></div><button onClick={() => open(`Информация: ${active.name}`)}>•••</button></header><div className="chat-context"><span>Freedom Music Fest</span><strong>Диалог связан с событием</strong><button onClick={() => open("Freedom Music Fest")}>Открыть событие →</button></div><div className="chat-history"><time>СЕГОДНЯ</time><div className="incoming"><small>{active.name} · 10:18</small><p>{active.id === "ai" ? "Я обновил дорожную карту и собрал три решения, которые требуют вашего внимания." : "Добрый день! Обновили материалы по событию. Посмотрите, пожалуйста, последнюю версию — всё отмеченное уже учтено."}</p></div><div className="attachment" onClick={() => open("Материал из диалога")}><i>▤</i><span><strong>Обновление по проекту.pdf</strong><small>PDF · 2,4 МБ</small></span><button>Открыть</button></div><div className="outgoing"><small>Вы · 10:31</small><p>Спасибо. Добавьте это в общий план и отметьте, какое решение нужно принять сегодня.</p></div><div className="incoming"><small>{active.name} · 10:36</small><p>Готово. Главное решение закреплено в штабе события, срок — сегодня до 18:00.</p></div></div><footer><button>＋</button><input placeholder="Написать сообщение…" /><button className="send" onClick={() => open("Сообщение отправлено")}>↑</button></footer></article>
    </div>}
  </section>;
}

function ProjectFeed({ open }: { open: Open }) {
  const posts = [
    { avatar: "АМ", person: "Айдана М.", time: "10:18", event: "Freedom Music Fest", type: "КОНЦЕПЦИЯ", title: "Концепция сцены готова к согласованию", text: "Команда собрала финальное направление: центральная сцена, световой контур и две зоны взаимодействия с гостями.", action: "Открыть концепцию", color: "violet" },
    { avatar: "TS", person: "TechSound", time: "09:56", event: "Freedom Music Fest", type: "НОВАЯ СМЕТА", title: "Подрядчик ответил на технический бриф", text: "Получена уточнённая смета. Стоимость снижена на ₸1,2 млн без изменения ключевой комплектации.", action: "Сравнить сметы", color: "green" },
    { avatar: "✦", person: "EVENTER AI", time: "09:40", event: "Digital Almaty 2026", type: "РЕЗУЛЬТАТ АССИСТЕНТА", title: "Дорожная карта пересобрана", text: "Я учёл перенос даты монтажа и подготовил три действия, чтобы сохранить общий срок проекта.", action: "Посмотреть результат", color: "dark" },
  ];
  return <div className="project-feed-layout"><main><section className="feed-composer"><i>КК</i><button onClick={() => open("Добавить обновление")}>Написать команде или добавить обновление…</button><span><button onClick={() => open("Добавить файл")}>▤ Файл</button><button onClick={() => open("Выбрать событие")}>⌄ Freedom Music Fest</button></span></section><div className="feed-filter"><strong>Последние обновления</strong><button>Все события ⌄</button></div>{posts.map((post) => <article className="feed-card" key={post.title}><header><i className={`feed-avatar ${post.color}`}>{post.avatar}</i><div><strong>{post.person}</strong><small>{post.event} · {post.time}</small></div><button>•••</button></header><section><span className={post.color}>{post.type}</span><h2>{post.title}</h2><p>{post.text}</p><button className="feed-result" onClick={() => open(post.title)}>{post.action} →</button></section><footer><button onClick={() => open(`Ответ: ${post.title}`)}>Ответить</button><button onClick={() => open(`Обсуждение: ${post.title}`)}>Обсудить</button><button onClick={() => open(`Закреплено: ${post.title}`)}>Закрепить</button><button onClick={() => open(`Поручить ассистенту: ${post.title}`)}>✦ Поручить AI</button></footer></article>)}</main><aside className="feed-attention"><header><span>✦</span><div><small>EVENTER AI</small><strong>Требует внимания</strong></div><b>3</b></header><button onClick={() => open("Подтвердить Almaty Arena")}><small>ДО 18:00 · FREEDOM MUSIC FEST</small><strong>Подтвердить резерв Almaty Arena</strong><span>Открыть решение →</span></button><button onClick={() => open("Согласовать концепцию сцены")}><small>СЕГОДНЯ · FREEDOM MUSIC FEST</small><strong>Согласовать концепцию сцены</strong><span>Посмотреть →</span></button><button onClick={() => open("Назначить ответственного")}><small>DIGITAL ALMATY 2026</small><strong>Назначить ответственного за кейтеринг</strong><span>Назначить →</span></button><footer><strong>Я слежу за 4 событиями</strong><p>Сообщу только о том, что требует решения или влияет на срок.</p></footer></aside></div>;
}

const events = [
  ["Freedom Music Fest", "12 сентября", "Almaty Arena", "72%", "В подготовке"],
  ["Digital Almaty 2026", "6–7 ноября", "Atakent", "38%", "В подготовке"],
  ["Новогодний корпоратив", "20 декабря", "Площадка не выбрана", "16%", "Планируется"],
  ["Leadership Conference", "18 октября", "Rixos Almaty", "54%", "В подготовке"],
  ["Alem Partner Day", "3 сентября", "The Ritz-Carlton", "88%", "Скоро"],
  ["Весенний форум 2027", "14 марта", "Черновик", "8%", "Идея"],
  ["Qazaq Creative Awards", "22 августа", "Дворец Республики", "100%", "Завершено"],
];

export function AllEventsView({ close, open }: { close: () => void; open: Open }) {
  const [filter, setFilter] = useState("Все");
  return <section className="all-events-page"><header><button className="events-back" onClick={close}>← На главную</button><div><p>МОИ СОБЫТИЯ</p><h1>Все события <span>7</span></h1></div><button className="primary" onClick={() => open("Создать")}>＋ Создать</button></header><div className="all-events-toolbar"><label>⌕ <input placeholder="Найти событие" /></label><div>{["Все", "Текущие", "Планируемые", "Завершённые"].map((item) => <button className={filter === item ? "active" : ""} key={item} onClick={() => setFilter(item)}>{item}</button>)}</div><button>По дате ↓</button></div><div className="all-event-grid">{events.map((event, index) => <button key={event[0]} onClick={() => open(event[0])}><div className={`event-cover ec-${index}`}><span>{event[4]}</span><strong>{event[3]}</strong><small>готовность</small></div><section><small>{event[1]} · {event[2]}</small><h2>{event[0]}</h2><div><span>Команда {index % 3 + 5}</span><b>Открыть штаб →</b></div></section></button>)}</div></section>;
}
