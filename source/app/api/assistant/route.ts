const instructions = `Ты — EVENTER AI, профессиональный свадебный ассистент в Казахстане.
Помогай организовать свадьбу, Ұзату, Құдалық и Сырға салу с учётом местных традиций и реальной последовательности подготовки.

Рабочая последовательность: формат и дата → число гостей и город → бюджет → организатор → площадка → концепция и оформление → программа → команда → логистика → договоры, оплаты и финальный тайминг.
Справочник команды: организатор или продюсер, площадка, ведущий, режиссёр и сценарист, декоратор и флорист, фотограф, видеограф, стилист и визажист, артисты и музыканты, DJ, технический подрядчик, кейтеринг и кондитер, транспорт, полиграфия и координаторы.

Правила ответа:
1. Сначала дай прямой и законченный ответ на вопрос пользователя.
2. Затем, если полезно, перечисли 3–7 конкретных шагов в правильном порядке.
3. Отдельно обозначь риски, зависимости или данные, которых не хватает.
4. Заверши только одним действительно необходимым вопросом. Если уточнение не нужно — не задавай вопрос.
5. Не обрывай предложение или список. Не обещай продолжение без содержания.
6. Не выдумывай цены, наличие площадок, отзывы и поставщиков. Если точных данных нет, прямо скажи об этом и объясни, от чего зависит ориентир.
7. Отвечай по-русски, понятно, профессионально и без лишней воды. Обычно 150–350 слов; для простого вопроса короче.`;

export async function POST(request: Request) {
  try {
    const body = await request.json() as {messages?: Array<{role:string;content:string}>; context?: string};
    const messages = (body.messages ?? []).slice(-12);
    const key = process.env.OPENAI_API_KEY;
    if (!key) return Response.json({error:"Ассистент пока не подключён"}, {status:503});
    const input = [
      ...(body.context ? [{role:"developer",content:[{type:"input_text",text:`Контекст опроса: ${body.context}`}]}] : []),
      ...messages.map(message => ({role:message.role==="assistant"?"assistant":"user",content:[{type:message.role==="assistant"?"output_text":"input_text",text:message.content}]}))
    ];
    const response = await fetch("https://api.openai.com/v1/responses", {
      method:"POST",
      headers:{"Authorization":`Bearer ${key}`,"Content-Type":"application/json"},
      body:JSON.stringify({model:"gpt-5-mini",instructions,input,max_output_tokens:1600,reasoning:{effort:"low"}})
    });
    const data = await response.json() as {output_text?:string;output?:Array<{content?:Array<{type?:string;text?:string}>}>;error?:{message?:string}};
    if (!response.ok) return Response.json({error:data.error?.message || "Не удалось получить ответ"}, {status:response.status});
    const text = data.output_text || data.output
      ?.flatMap(item=>item.content??[])
      .filter(item=>item.type==="output_text" && item.text)
      .map(item=>item.text)
      .join("\n\n");
    return Response.json({text:text || "Уточните, пожалуйста, чем вам помочь со свадьбой?"});
  } catch {
    return Response.json({error:"Не удалось обработать сообщение"}, {status:500});
  }
}
