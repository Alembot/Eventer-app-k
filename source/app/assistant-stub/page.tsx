import Link from "next/link";
import "../simple-screen.css";

export default function AssistantStub(){return <main className="simple-screen"><section><span>EVENTER AI</span><h1>Ассистент</h1><p>Диалоговый помощник скоро появится здесь.</p><div className="simple-chat">Расскажите, какое событие вы планируете…</div><Link href="/discover?event=wedding">Вернуться на главную</Link></section></main>}
