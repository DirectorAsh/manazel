(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const WA = '966920014659';
  const wa = (msg) => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;

  /* opening veil */
  const veil = $('.veil'), slats = $('.veil__slats');
  if (veil && slats) {
    const n = 14, step = (innerWidth + innerHeight * 1.6) / n;
    for (let i = 0; i < n; i++) {
      const s = document.createElement('i');
      s.style.cssText = `left:${-innerHeight * 0.8 + i * step}px;width:${step + 2}px;--i:${i}`;
      slats.appendChild(s);
    }
    setTimeout(() => veil.classList.add('is-done'), 3200);
  }

  /* nav + whatsapp button */
  const nav = $('#nav'), waBtn = $('#wa');
  waBtn.href = wa('السلام عليكم، أرغب في الاستفسار عن مشروع زرقاء اليمامة.');

  /* window scene */
  const win = $('.window');
  let ticking = false;
  const onScroll = () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => {
      const y = scrollY;
      nav.classList.toggle('is-solid', y > 60);
      const ct = $('#contact').getBoundingClientRect().top;
      waBtn.classList.toggle('is-on', y > innerHeight * 0.7 && ct > innerHeight * 0.6);
      if (win) {
        const r = win.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));
        win.style.setProperty('--p', p.toFixed(4));
      }
      ticking = false;
    });
  };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  /* reveal heads and warranty bars */
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  }), { threshold: 0.35 });
  $$('[data-reveal]').forEach((el) => io.observe(el));
  const bars = $('#bars');
  if (bars) { $$('li', bars).forEach((li, k) => li.style.setProperty('--k', k)); io.observe(bars); }

  /* units */
  const T = { townhouse: 'تاون هاوس', penthouse: 'بنتهاوس', ground: 'دور أرضي', first: 'دور أول', second: 'دور ثانٍ' };
  // [no, type, area m2, price SAR | 0 = reserved]  source: rakez.sa listing 71697, 20 Nov 2026
  const U = [
    [1,'townhouse',506,1600000],[2,'penthouse',640,1250000],[3,'townhouse',398,1300000],[4,'penthouse',379,1300000],[5,'townhouse',528,1150000],[6,'penthouse',528,1150000],
    [7,'ground',355,1050000],[8,'ground',355,1050000],[9,'first',276,890000],[10,'first',216,890000],[11,'second',229,690000],[12,'second',229,690000],
    [13,'ground',295,1050000],[14,'ground',295,1050000],[15,'first',216,890000],[16,'first',216,890000],[17,'second',229,690000],[18,'second',229,690000],
    [19,'ground',295,1050000],[20,'ground',295,1050000],[21,'first',216,890000],[22,'first',216,0],[23,'second',229,0],[24,'second',229,690000],
    [25,'ground',295,1050000],[26,'ground',295,1050000],[27,'first',216,890000],[28,'first',216,890000],[29,'second',229,690000],[30,'second',229,690000],
    [31,'townhouse',446,1600000],[32,'penthouse',580,1250000],[33,'townhouse',338,1300000],[34,'penthouse',338,1300000],[35,'townhouse',487,1150000],[36,'penthouse',487,1150000],
  ];
  const board = $('#board');
  U.forEach(([no, type, area, price]) => {
    const el = document.createElement(price ? 'a' : 'div');
    el.className = 'unit' + (price ? '' : ' is-held');
    el.dataset.type = type;
    if (price) {
      el.href = wa(`السلام عليكم، أرغب في الاستفسار عن الوحدة رقم ${no} (${T[type]}، ${area} م²) في مشروع زرقاء اليمامة.`);
      el.target = '_blank'; el.rel = 'noopener';
    }
    el.innerHTML = `<span class="unit__no">${no}</span><span class="unit__type">${T[type]}</span><span class="unit__area"><span class="num">${area}</span> م²</span><span class="unit__price">${price ? price.toLocaleString('en-US') + ' <small>ريال</small>' : 'محجوزة'}</span>`;
    board.appendChild(el);
  });
  const count = $('#availCount');
  const setFilter = (f) => {
    const match = (t) => f === 'all' || t === f || (f === 'floors' && ['ground', 'first', 'second'].includes(t));
    let n = 0;
    $$('.unit', board).forEach((u) => {
      const ok = match(u.dataset.type);
      u.classList.toggle('is-off', !ok);
      if (ok && !u.classList.contains('is-held')) n++;
    });
    count.textContent = n;
    $$('.chip').forEach((c) => c.classList.toggle('is-on', c.dataset.f === f));
  };
  $$('.chip').forEach((c) => c.addEventListener('click', () => setFilter(c.dataset.f)));
  $$('[data-filter]').forEach((b) => b.addEventListener('click', () => {
    setFilter(b.dataset.filter);
    $('#units').scrollIntoView({ behavior: 'smooth' });
  }));

  /* gallery */
  const strip = $('#strip');
  const stepBy = () => Math.min(strip.clientWidth * 0.8, 720);
  $('#next').addEventListener('click', () => strip.scrollBy({ left: -stepBy(), behavior: 'smooth' }));
  $('#prev').addEventListener('click', () => strip.scrollBy({ left: stepBy(), behavior: 'smooth' }));
  let down = false, sx = 0, sl = 0, moved = 0;
  strip.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; down = true; moved = 0; sx = e.clientX; sl = strip.scrollLeft; });
  addEventListener('pointermove', (e) => {
    if (!down) return;
    moved = Math.abs(e.clientX - sx);
    if (moved > 6) { strip.classList.add('is-drag'); strip.scrollLeft = sl - (e.clientX - sx); }
  });
  addEventListener('pointerup', () => { down = false; setTimeout(() => strip.classList.remove('is-drag'), 0); });
  const lb = $('#lightbox'), lbImg = $('#lbImg');
  $$('.shot', strip).forEach((b) => b.addEventListener('click', () => {
    if (moved > 6) return;
    const im = $('img', b); lbImg.src = im.src; lbImg.alt = im.alt; lb.showModal();
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
