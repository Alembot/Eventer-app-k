const venueCardBase = card;

card = x => venueCardBase(x)
  .replace('<article class="card">', `<button class="card" type="button" data-venue-id="${esc(x.id)}">`)
  .replace('</article>', '</button>');

const venueDetailStyle = document.createElement('style');
venueDetailStyle.textContent = `
  .card{cursor:pointer;font:inherit;color:inherit}
  .venue-detail{padding:24px 17px 44px}
  .venue-detail__back{border:0;background:none;padding:0 0 20px;font:700 12px Onest;color:#c34d22}
  .venue-detail__status{display:inline-block;margin-bottom:10px;padding:7px 10px;border-radius:999px;background:#e9f4ea;color:#28713b;font-size:10px;font-weight:700}
  .venue-detail h1{margin:0 0 8px;font-size:32px;line-height:1.05}
  .venue-detail__meta{margin:0 0 22px;color:#777;font-size:12px}
  .venue-detail__block{margin:10px 0;padding:18px;border-radius:20px;background:#fff;box-shadow:0 8px 24px #34271c0d}
  .venue-detail__block h2{margin:0 0 8px;font-size:15px}
  .venue-detail__block p{margin:0;color:#666;font-size:12px;line-height:1.55}
  .venue-detail__action{width:100%;margin-top:18px;border:0;border-radius:16px;background:#e86830;color:#fff;padding:15px;font:700 13px Onest}
`;
document.head.appendChild(venueDetailStyle);

const venueValue = value => value === null || value === undefined || value === '' ? 'Пока нет данных' : esc(value);
const venueList = value => Array.isArray(value) && value.length ? value.map(esc).join(' · ') : 'Пока нет данных';

async function openVenueCard(id) {
  const hero = document.querySelector('.hero');
  const shelves = document.querySelector('#shelves');
  hero.hidden = true;
  shelves.innerHTML = '<section class="venue-detail"><p>Загружаем карточку площадки…</p></section>';
  try {
    const d = await rpc('pub_vendor_card', {p_id:id});
    shelves.innerHTML = `<section class="venue-detail">
      <button class="venue-detail__back" type="button">← К площадкам</button><br>
      ${d.verified ? '<span class="venue-detail__status">✓ Проверено</span>' : ''}
      <h1>${venueValue(d.name)}</h1>
      <p class="venue-detail__meta">${venueValue(d.category)} · ${venueValue(d.city)}</p>
      <article class="venue-detail__block"><h2>О площадке</h2><p>${venueValue(d.description)}</p></article>
      <article class="venue-detail__block"><h2>Вместимость</h2><p>${d.capacity ? `До ${esc(d.capacity)} гостей` : venueValue(d.capacity_note)}</p></article>
      <article class="venue-detail__block"><h2>Стоимость</h2><p>${d.price_from || d.price_to ? `${venueValue(d.price_from)}–${venueValue(d.price_to)} ₸ · ${venueValue(d.price_unit)}` : 'Пока нет данных'}</p></article>
      <article class="venue-detail__block"><h2>Подходит для</h2><p>${venueList(d.event_types)}</p></article>
      <article class="venue-detail__block"><h2>Контакты</h2><p>Instagram: ${venueValue(d.instagram)}<br>Сайт: ${venueValue(d.website)}</p></article>
      <button class="venue-detail__action" type="button">Узнать, свободна ли дата</button>
    </section>`;
    shelves.querySelector('.venue-detail__back').onclick = () => history.back();
  } catch {
    shelves.innerHTML = `<section class="venue-detail"><button class="venue-detail__back" type="button">← К площадкам</button><div class="venue-detail__block"><h2>Не удалось загрузить</h2><p>Попробуйте открыть карточку ещё раз.</p></div></section>`;
    shelves.querySelector('.venue-detail__back').onclick = () => history.back();
  }
}

document.querySelector('#shelves').addEventListener('click', event => {
  const target = event.target.closest('[data-venue-id]');
  if (!target) return;
  history.pushState({venueId:target.dataset.venueId}, '', `?venue=${encodeURIComponent(target.dataset.venueId)}`);
  openVenueCard(target.dataset.venueId);
});

window.addEventListener('popstate', () => {
  document.querySelector('.hero').hidden = false;
  load();
});
