(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const WA = '966920014659';
  const wa = (msg) => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* opening: never let the veil outstay its welcome */
  const veil = $('.veil');
  if (veil) setTimeout(() => veil.remove(), 3600);

  /* scroll: nav, hero drift, window scene, parallax */
  const nav = $('#nav'), win = $('.window'), hero = $('.hero'), pars = $$('[data-par]');
  let lastY = 0, ticking = false;
  const frame = () => {
    const y = scrollY, vh = innerHeight;
    nav.classList.toggle('is-solid', y > 60);
    nav.classList.toggle('is-away', y > vh && y > lastY + 2);
    if (y < lastY - 2) nav.classList.remove('is-away');
    lastY = y;
    if (!calm) {
      if (y < vh) hero.style.setProperty('--s', (y / vh).toFixed(4));
      pars.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        el.style.translate = `0 ${((r.top + r.height / 2 - vh / 2) * -parseFloat(el.dataset.par)).toFixed(1)}px`;
      });
    }
    if (win) {
      const r = win.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / (r.height - vh)));
      const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      win.style.setProperty('--p', e.toFixed(4));
    }
    ticking = false;
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  frame();

  /* unveil images, warranty lines */
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  }), { threshold: 0.25 });
  $$('[data-unveil]').forEach((el) => io.observe(el));
  const rows = $('#rows');
  if (rows) { $$('li', rows).forEach((li, k) => li.style.setProperty('--k', k)); io.observe(rows); }

  /* types index */
  const tl = $('#typesList'), tm = $$('#typesMedia img');
  const setType = (i) => {
    const cur = $('li.is-on', tl);
    if (cur && +cur.dataset.i === i) return;
    $$('li', tl).forEach((li) => li.classList.toggle('is-on', +li.dataset.i === i));
    tm.forEach((im, k) => {
      im.classList.toggle('is-out', im.classList.contains('is-on') && k !== i);
      im.classList.toggle('is-on', k === i);
    });
    setTimeout(() => tm.forEach((im, k) => { if (k !== i) im.classList.remove('is-out'); }), 1150);
  };
  $$('li', tl).forEach((li) => {
    const i = +li.dataset.i, b = $('.types__name', li);
    b.addEventListener('click', () => setType(i));
    b.addEventListener('focus', () => setType(i));
    if (matchMedia('(hover:hover)').matches) li.addEventListener('mouseenter', () => setType(i));
  });

  /* ledger. source: rakez.sa listing 71697 as read on 20 Nov 2026. [no, type, m2, SAR | 0 = reserved] */
  const T = { townhouse: 'تاون هاوس', penthouse: 'بنتهاوس', ground: 'دور أرضي', first: 'دور أول', second: 'دور ثانٍ' };
  const U = [
    [1,'townhouse',506,1600000],[2,'penthouse',640,1250000],[3,'townhouse',398,1300000],[4,'penthouse',379,1300000],[5,'townhouse',528,1150000],[6,'penthouse',528,1150000],
    [7,'ground',355,1050000],[8,'ground',355,1050000],[9,'first',276,890000],[10,'first',216,890000],[11,'second',229,690000],[12,'second',229,690000],
    [13,'ground',295,1050000],[14,'ground',295,1050000],[15,'first',216,890000],[16,'first',216,890000],[17,'second',229,690000],[18,'second',229,690000],
    [19,'ground',295,1050000],[20,'ground',295,1050000],[21,'first',216,890000],[22,'first',216,0],[23,'second',229,0],[24,'second',229,690000],
    [25,'ground',295,1050000],[26,'ground',295,1050000],[27,'first',216,890000],[28,'first',216,890000],[29,'second',229,690000],[30,'second',229,690000],
    [31,'townhouse',446,1600000],[32,'penthouse',580,1250000],[33,'townhouse',338,1300000],[34,'penthouse',338,1300000],[35,'townhouse',487,1150000],[36,'penthouse',487,1150000],
  ];
  const ledger = $('#ledger');
  U.forEach(([no, type, area, price]) => {
    const el = document.createElement(price ? 'a' : 'div');
    el.className = 'row' + (price ? '' : ' is-held');
    el.dataset.type = type;
    if (price) {
      el.href = wa(`السلام عليكم، أرغب في الاستفسار عن الوحدة رقم ${no} (${T[type]}، ${area} م²) في مشروع زرقاء اليمامة.`);
      el.target = '_blank'; el.rel = 'noopener';
      el.setAttribute('aria-label', `الوحدة ${no}، ${T[type]}، ${area} متر مربع، ${price.toLocaleString('en-US')} ريال. اسأل عنها عبر واتساب`);
    }
    el.innerHTML = `<span class="row__no">${String(no).padStart(2, '0')}</span><span>${T[type]}</span><span class="row__area"><span class="num">${area}</span> م²</span><span class="row__price">${price ? price.toLocaleString('en-US') : 'محجوزة'}</span><span class="row__go"></span>`;
    ledger.appendChild(el);
  });
  const count = $('#availCount');
  const setFilter = (f) => {
    const match = (t) => f === 'all' || t === f || (f === 'floors' && ['ground', 'first', 'second'].includes(t));
    let n = 0;
    $$('.row', ledger).forEach((u) => {
      const ok = match(u.dataset.type);
      u.classList.toggle('is-off', !ok);
      if (ok && !u.classList.contains('is-held')) n++;
    });
    count.textContent = n;
    $$('.tab').forEach((c) => c.classList.toggle('is-on', c.dataset.f === f));
  };
  $$('.tab').forEach((c) => c.addEventListener('click', () => setFilter(c.dataset.f)));
  $$('[data-filter]').forEach((b) => b.addEventListener('click', () => setFilter(b.dataset.filter)));

  /* gallery */
  const strip = $('#strip'), shots = $$('.shot', strip), gCount = $('#gCount'), cursor = $('#cursor');
  const stepBy = () => Math.min(strip.clientWidth * 0.8, 760);
  $('#next').addEventListener('click', () => strip.scrollBy({ left: -stepBy(), behavior: 'smooth' }));
  $('#prev').addEventListener('click', () => strip.scrollBy({ left: stepBy(), behavior: 'smooth' }));
  strip.addEventListener('scroll', () => {
    const max = strip.scrollWidth - strip.clientWidth;
    const i = Math.round(Math.abs(strip.scrollLeft) / max * (shots.length - 1)) + 1;
    gCount.textContent = `${i} / ${shots.length}`;
  }, { passive: true });
  let down = false, sx = 0, sl = 0, moved = 0;
  strip.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; down = true; moved = 0; sx = e.clientX; sl = strip.scrollLeft; });
  addEventListener('pointermove', (e) => {
    cursor.style.setProperty('--x', e.clientX + 'px'); cursor.style.setProperty('--y', e.clientY + 'px');
    if (!down) return;
    moved = Math.abs(e.clientX - sx);
    if (moved > 6) strip.scrollLeft = sl - (e.clientX - sx);
  });
  addEventListener('pointerup', () => { down = false; });
  strip.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') cursor.classList.add('is-on'); });
  strip.addEventListener('pointerleave', () => cursor.classList.remove('is-on'));
  const lb = $('#lightbox'), lbImg = document.createElement('img');
  shots.forEach((b) => b.addEventListener('click', () => {
    if (moved > 6) return;
    const im = $('img', b); lbImg.src = im.src; lbImg.alt = im.alt;
    if (!lbImg.isConnected) lb.appendChild(lbImg);
    lb.showModal();
  }));
  $('#lbClose').addEventListener('click', () => lb.close());
  lb.addEventListener('click', (e) => { if (e.target === lb) lb.close(); });

  /* contact form: opens WhatsApp with the request written out */
  const form = $('#form'), err = $('#formErr');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const d = new FormData(form);
    const name = (d.get('name') || '').trim(), phone = (d.get('phone') || '').trim();
    if (!name || phone.replace(/\D/g, '').length < 9) { err.hidden = false; return; }
    err.hidden = true;
    open(wa(`السلام عليكم، أرغب في حجز زيارة لمشروع زرقاء اليمامة.\nالاسم: ${name}\nالجوال: ${phone}\nنوع الوحدة: ${d.get('type')}`), '_blank', 'noopener');
  });
})();
