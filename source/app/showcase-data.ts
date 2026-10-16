export type ShowcaseEvent = {
  id:string; label:string; description:string; icon:string; hero:string; lead:string;
  categories:string[];
  reels:{title:string;meta:string;tone:string;image:string}[];
  ready:{label:string;title:string;includes:string;price:string}[];
  recommendations:string[];
  articles:{title:string;text:string}[];
  professionals:string[];
};

const articles=[
  {title:"С чего начать",text:"Короткий маршрут от первой идеи до понятного плана."},
  {title:"Как определить бюджет",text:"Что действительно влияет на стоимость события."},
  {title:"Как выбрать исполнителя",text:"На что смотреть кроме красивых фотографий."},
];
const make=(event:ShowcaseEvent)=>event;

export const showcaseEvents:ShowcaseEvent[]=[
make({id:"wedding",label:"Свадьба",description:"Образы, атмосфера и готовые решения для вашего дня",icon:"♡",hero:"Свадьба, которую хочется прожить",lead:"Смотрите реальные истории, сохраняйте детали и собирайте собственную свадьбу.",categories:["Всё","Платья","Торты","Регистрация","Love Story","Декор","Ведущие","Сценарии"],reels:[
  {title:"Красивые регистрации",meta:"Клятвы · декор · момент",tone:"rose",image:"https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=85"},
  {title:"Платья и образы",meta:"Невеста · жених · детали",tone:"gold",image:"https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=900&q=85"},
  {title:"Love Story",meta:"Фото · фильм · история пары",tone:"green",image:"https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=900&q=85"},
  {title:"Декор и атмосфера",meta:"Цветы · свет · сервировка",tone:"blue",image:"https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=900&q=85"}],ready:[
  {label:"КАМЕРНАЯ",title:"Ужин для самых близких",includes:"Площадка, меню, декор и фотограф",price:"от 2,8 млн ₸"},
  {label:"КЛАССИКА",title:"Свадьба на 80 гостей",includes:"Организация, банкет, ведущий и программа",price:"от 6 млн ₸"},
  {label:"ЗА ГОРОДОМ",title:"Выездная церемония",includes:"Локация, регистрация, трансфер и продакшн",price:"от 8,5 млн ₸"}],recommendations:["Торты, которые хочется запомнить","Музыка и первый танец","Необычные площадки"],articles,professionals:["Свадебные агентства","Свадебные салоны","Площадки","Студии декора","Кондитерские","Фото- и видеостудии"]}),

make({id:"kids",label:"Детский праздник",description:"Герои, приключения, шоу и детские мечты",icon:"✦",hero:"Праздник глазами ребёнка",lead:"Сначала — восторг и мечта. Затем — готовая программа, команда и понятная стоимость.",categories:["Всё","Герои","Шоу","Квесты","Торты","Декор","Площадки","Выпускной"],reels:[
  {title:"Любимый герой приходит в гости",meta:"Персонажи и игровые программы",tone:"purple",image:"https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=900&q=85"},
  {title:"Шоу, от которых не отрываются",meta:"Наука · магия · пузыри",tone:"blue",image:"https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=900&q=85"},
  {title:"Квесты и приключения",meta:"Команда · задания · финальный сюрприз",tone:"green",image:"https://images.unsplash.com/photo-1472162072942-cd5147eb3902?auto=format&fit=crop&w=900&q=85"},
  {title:"Торт — главный герой стола",meta:"Торты · candy bar · подача",tone:"gold",image:"https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=900&q=85"}],ready:[
  {label:"ДОМА",title:"Праздник без хлопот",includes:"Герой, программа, реквизит и торт",price:"от 180 000 ₸"},
  {label:"ПРИКЛЮЧЕНИЕ",title:"Квест для 20 детей",includes:"Площадка, сценарий, ведущие и питание",price:"от 650 000 ₸"},
  {label:"ШОУ",title:"Лаборатория чудес",includes:"Шоу, мастер-класс и подарки",price:"от 420 000 ₸"}],recommendations:["Праздник по возрасту","Новый год и выпускной","Мир праздника: декор и фотозоны"],articles,professionals:["Агентства детских праздников","Игровые площадки","Шоу-студии","Кондитерские","Студии декора","Фото- и видеостудии"]}),

make({id:"anniversary",label:"Юбилей",description:"Тёплый вечер, который объединяет близких",icon:"♢",hero:"История жизни становится праздником",lead:"Музыка, семейные воспоминания, красивый стол и люди, которых хочется собрать вместе.",categories:["Всё","Сценарии","Рестораны","Музыка","Ведущие","Торты","Декор","Сюрпризы"],reels:[
  {title:"Вечер для всей семьи",meta:"Близкие · музыка · тёплые слова",tone:"green",image:"https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=900&q=85"},
  {title:"История жизни в одном фильме",meta:"Архив · интервью · премьера",tone:"rose",image:"https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=85"},
  {title:"Музыка его времени",meta:"Живой звук и любимые песни",tone:"purple",image:"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=85"},
  {title:"Красивый стол",meta:"Меню · сервировка · торт",tone:"gold",image:"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=85"}],ready:[
  {label:"КАМЕРНО",title:"Семейный ужин",includes:"Отдельный зал, меню, декор и музыка",price:"от 650 000 ₸"},
  {label:"ИСТОРИЯ",title:"Юбилей с семейным фильмом",includes:"Сценарий, съёмка, ведущий и программа",price:"от 1,6 млн ₸"},
  {label:"БОЛЬШОЙ ВЕЧЕР",title:"Праздник на 80 гостей",includes:"Площадка, банкет, музыка и организация",price:"от 3,8 млн ₸"}],recommendations:["Сюрпризы от близких","Ведущие без неловких конкурсов","Декор с личной историей"],articles,professionals:["Event-агентства","Рестораны и площадки","Музыкальные проекты","Студии декора","Кондитерские","Фото- и видеостудии"]}),

make({id:"party",label:"Вечеринка",description:"Повод собрать друзей и провести яркий вечер",icon:"◎",hero:"Вечеринка в вашем стиле",lead:"Идеи, пространства и команды для дня рождения, девичника, мальчишника или домашнего праздника.",categories:["Всё","День рождения","Девичник / мальчишник","Тематическая вечеринка","Домашняя вечеринка"],reels:[
  {title:"День рождения с друзьями",meta:"Музыка · общение · сюрпризы",tone:"green",image:"https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=85"},
  {title:"Девичник и мальчишник",meta:"Своя компания · свой сценарий",tone:"gold",image:"https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=85"},
  {title:"Тематический вечер",meta:"Образы · музыка · декор",tone:"blue",image:"https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=900&q=85"},
  {title:"Домашняя вечеринка",meta:"Уют · еда · близкие",tone:"purple",image:"https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=85"}],ready:[
  {label:"ДЕНЬ РОЖДЕНИЯ",title:"Вечер для друзей",includes:"Площадка, музыка, еда и оформление",price:"от 600 000 ₸"},
  {label:"ТЕМАТИЧЕСКАЯ",title:"Вечеринка с идеей",includes:"Сценарий, декор, музыка и фотограф",price:"от 900 000 ₸"},
  {label:"ДОМА",title:"Праздник без хлопот",includes:"Кейтеринг, оформление и программа",price:"от 450 000 ₸"}],recommendations:["Идеи для дня рождения","Сценарии для своей компании","Пространства для вечеринки"],articles,professionals:["Организаторы вечеринок","Площадки","Кейтеринг","Диджеи","Фотографы","Студии декора"]}),

make({id:"other",label:"Другое событие",description:"Расскажите о замысле — мы соберём витрину под него",icon:"+",hero:"У события ещё нет названия, но уже есть настроение",lead:"Опишите повод несколькими словами — Event Chat покажет идеи, похожие события и готовые решения.",categories:["Идеи","Необычные места","Готовые решения","Организаторы","Артисты","Детали"],reels:[
  {title:"Ужин в оранжерее",meta:"Зелень · свечи · музыка",tone:"green",image:"https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=85"},
  {title:"Вечер на крыше",meta:"Город · закат · друзья",tone:"blue",image:"https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=900&q=85"},
  {title:"Иммерсивная история",meta:"Гости становятся участниками",tone:"purple",image:"https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=900&q=85"},
  {title:"Ночь в музее",meta:"Искусство после закрытия",tone:"gold",image:"https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=900&q=85"}],ready:[
  {label:"КАМЕРНО",title:"Событие до 30 гостей",includes:"Место, программа и атмосфера",price:"от 600 000 ₸"},
  {label:"СВОЯ ИДЕЯ",title:"Персональный сценарий",includes:"Концепция, расчёт и подбор команды",price:"от 1,2 млн ₸"},
  {label:"БОЛЬШОЕ СОБЫТИЕ",title:"Формат от 150 гостей",includes:"Концепция и полный цикл организации",price:"по расчёту"}],recommendations:["Необычные пространства","Идеи, которых ещё не было","Команды для нестандартных задач"],articles,professionals:["Event-агентства","Необычные площадки","Продакшн-компании","Студии декора","Шоу-проекты","Кейтеринг"]})
];

export const getShowcaseEvent=(id:string|null)=>showcaseEvents.find(event=>event.id===id)??null;
