const app = document.querySelector('#app');

const events = {
  private: [
    ['Свадьба', 'Соберите праздник, в котором всё — про вас.', 'wedding'],
    ['День рождения', 'Повод увидеть близких и запомнить этот вечер.', 'birthday'],
    ['Детский праздник', 'Приключение, которое ребёнок будет пересказывать.', 'kids'],
    ['Юбилей', 'Большой вечер для важной даты и любимых людей.', 'anniversary'],
  ],
  business: [
    ['Корпоратив', 'Команда, которая проживает общий момент.', 'corporate'],
    ['Запуск', 'Событие, с которого начинается новая история бренда.', 'launch'],
    ['Конференция', 'Содержание, люди и среда для сильного разговора.', 'conference'],
    ['Тимбилдинг', 'Вместе — вне привычного сценария рабочего дня.', 'teambuilding'],
  ],
};

const details = {
  wedding: ['Ваша свадьба. Ваша история.', 'Начните с простых вопросов — Eventer поможет собрать стиль, бюджет, площадку и профессионалов.', true],
  birthday: ['День, который хочется повторить', 'Идея, место, музыка и люди — соберём вечер вокруг вас.', false],
  kids: ['Праздник для маленького главного героя', 'Выберите тему, возраст и формат — остальное станет понятнее.', false],
  anniversary: ['Юбилей без обязательной программы', 'Тёплый сценарий, подходящая площадка и время для своих.', false],
  corporate: ['Корпоратив, который объединяет', 'Поможем найти формат, площадку и команду, которые работают на вашу задачу.', false],
  launch: ['Запуск, о котором говорят', 'Соберите впечатление о продукте в одном сильном событии.', false],
  conference: ['Конференция с ясным смыслом', 'От программы до логистики — создайте пространство для нужного разговора.', false],
  teambuilding: ['Команда вне офиса', 'Выберите динамику, место и сценарий для живого общего опыта.', false],
};

const card = ([name, text, id], index) => `
  <button class="event-card" type="button" data-go="#event/${id}">
    <span class="number">0${index + 1}</span><h3>${name}</h3><p>${text}</p>
  </button>`;

function home() {
  return `
    <section class="hero">
      <div class="eyebrow">События начинаются здесь</div>
      <h1>Создавайте события, которые запомнятся</h1>
      <p>Идеи, профессионалы и готовые решения для частных и деловых событий.</p>
      <div class="choice-grid">
        <button class="choice" type="button" data-go="#private"><b>Частное событие <span class="arrow">→</span></b><small>Для себя и близких</small></button>
        <button class="choice" type="button" data-go="#business"><b>Для бизнеса <span class="arrow">→</span></b><small>Для команды и бренда</small></button>
      </div>
    </section>
    <section class="spotlight">
      <div class="feature"><div class="eyebrow">От идеи к плану</div><h2>Не знаете, с чего начать?</h2><p>Ответьте на несколько вопросов — и соберём первую версию вашего события.</p><a class="button" href="../">Начать со свадьбы →</a></div>
      <div class="feature"><div class="eyebrow">Витрина</div><h2>События с характером</h2><p>Референсы, профессионалы и решения, из которых рождается ваш собственный сценарий.</p><button class="button secondary" type="button" data-go="#ideas">Смотреть идеи</button></div>
    </section>`;
}

function listing(type) {
  const isPrivate = type === 'private';
  return `
    <button class="back" type="button" data-go="#home">← На главную</button>
    <section class="section-head"><div><div class="eyebrow">${isPrivate ? 'Для себя и близких' : 'Для команды и бренда'}</div><h1>${isPrivate ? 'Какое событие создаём?' : 'Соберём бизнес-событие'}</h1></div><p>Выберите направление. Дальше покажем, с чего начать и какие решения могут подойти.</p></section>
    <section class="event-grid">${events[type].map(card).join('')}</section>
    <section class="spotlight"><div class="feature"><div class="eyebrow">Eventer</div><h2>Не нужно знать всё заранее</h2><p>Начните с того, что уже понятно: повод, люди, город или настроение.</p></div><div class="feature"><div class="eyebrow">Свадьба</div><h2>Готовый онбординг</h2><p>Первый полный сценарий Eventer уже доступен: семь коротких шагов до плана и подбора.</p><a class="button" href="../">Открыть →</a></div></section>`;
}

function detail(id) {
  const [title, description, wedding] = details[id] || details.wedding;
  return `
    <button class="back" type="button" data-go="#${['corporate','launch','conference','teambuilding'].includes(id) ? 'business' : 'private'}">← Выбрать другое событие</button>
    <section class="detail-hero"><div class="eyebrow">Eventer · сценарий события</div><h1>${title}</h1><p>${description}</p>${wedding ? '<a class="button" href="../">Открыть свадебный онбординг →</a>' : '<button class="button" type="button" data-go="#ideas">Посмотреть идеи →</button>'}</section>
    <section class="steps"><article class="step"><b>01 · ЗАМЫСЕЛ</b><h3>Поймём повод</h3><p>Кому посвящено событие, кого зовёте и какое впечатление хотите оставить.</p></article><article class="step"><b>02 · СЦЕНАРИЙ</b><h3>Соберём формат</h3><p>Место, настроение, программа и детали складываются в один маршрут.</p></article><article class="step"><b>03 · ЛЮДИ</b><h3>Найдём своих профи</h3><p>Площадки и специалисты появляются тогда, когда понятна ваша задача.</p></article></section>`;
}

function ideas() {
  const ideas = [['Свадьба на один длинный стол','Ужин, музыка и свет без лишней церемонии.'],['Городской день рождения','Маршрут по любимым местам вместо одного застолья.'],['Командный день вне офиса','Не «активность», а общий опыт, который хочется обсудить.'],['Тихий запуск','Небольшой круг, точный формат, много внимания к гостям.'],['Детский праздник как квест','Герой дня ведёт друзей через собственную историю.'],['Юбилей в формате дома','Близкие люди, разговор и несколько хороших сюрпризов.']];
  return `<section class="section-head"><div><div class="eyebrow">Журнал Eventer</div><h1>Идеи для будущих событий</h1></div><p>Не шаблоны, а отправные точки для вашего собственного сценария.</p></section><section class="ideas-grid">${ideas.map((x,i)=>`<article class="idea-card"><span class="tag">ИДЕЯ 0${i+1}</span><h3>${x[0]}</h3><p>${x[1]}</p></article>`).join('')}</section>`;
}

function partners() {
  const groups = [['Площадки','Пространства, которые задают тон событию.'],['Организаторы','Команды, умеющие собрать сложное в целое.'],['Профессионалы','Люди, которые создают содержание и атмосферу.']];
  return `<section class="section-head"><div><div class="eyebrow">Eventer</div><h1>Партнёры и профессионалы</h1></div><p>В демо показана структура раздела. Подбор из базы подключается отдельным этапом.</p></section><section class="partners-grid">${groups.map(x=>`<article class="partner-card"><b>Скоро в витрине</b><h3>${x[0]}</h3><p>${x[1]}</p></article>`).join('')}</section><section class="empty"><div class="eyebrow">Начните с себя</div><h1>Расскажите о событии</h1><p>Для свадебного сценария уже работает онбординг, подключённый к публичным функциям Eventer Data Base.</p><a class="button" href="../">Открыть онбординг →</a></section>`;
}

function render() {
  const route = (location.hash || '#home').slice(1);
  const [page, id] = route.split('/');
  app.innerHTML = page === 'private' ? listing('private')
    : page === 'business' ? listing('business')
    : page === 'event' ? detail(id)
    : page === 'ideas' ? ideas()
    : page === 'partners' ? partners()
    : home();
  document.querySelectorAll('[data-go]').forEach(el => el.addEventListener('click', () => location.hash = el.dataset.go));
  document.querySelectorAll('.nav a').forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${page}` || (page === 'home' && link.getAttribute('href') === '#showcase')));
  app.focus();
}
window.addEventListener('hashchange', render);
render();
