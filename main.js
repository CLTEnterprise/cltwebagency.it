// Titoli che entrano parola per parola.
document.querySelectorAll('[data-words]').forEach(function (el) {
  var testo = el.textContent.trim();
  el.setAttribute('aria-label', testo);
  el.innerHTML = testo.split(/\s+/).map(function (w, i) {
    return '<span class="w" aria-hidden="true" style="--i:' + i + '">' + w + '</span>';
  }).join(' ');
});

// Ingressi a cascata dentro ogni sezione, una volta sola.
(function () {
  var items = Array.prototype.slice.call(document.querySelectorAll('.reveal, [data-words]'));
  document.querySelectorAll('section, footer').forEach(function (s) {
    s.querySelectorAll('.reveal').forEach(function (el, i) { el.style.setProperty('--d', Math.min(i, 6) * 90 + 'ms'); });
  });
  function mostra(el) { el.classList.add('is-in'); }
  if (!('IntersectionObserver' in window)) { items.forEach(mostra); return; }
  var io = new IntersectionObserver(function (voci) {
    voci.forEach(function (v) { if (v.isIntersecting) { mostra(v.target); io.unobserve(v.target); } });
  }, { rootMargin: '0px 0px -8% 0px' });
  items.forEach(function (el) { io.observe(el); });
  // Rete di sicurezza per i salti con i link del menu.
  window.addEventListener('scroll', function () {
    items.forEach(function (el) { if (!el.classList.contains('is-in') && el.getBoundingClientRect().top < innerHeight) mostra(el); });
  }, { passive: true });
})();

// Barra di avanzamento e voce del menu attiva.
(function () {
  var top = document.getElementById('top');
  var link = Array.prototype.slice.call(document.querySelectorAll('.top__nav a'));
  var sezioni = link.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  var attesa = false;
  function aggiorna() {
    var y = window.scrollY, max = document.documentElement.scrollHeight - innerHeight;
    top.style.setProperty('--progress', max > 0 ? (y / max).toFixed(4) : 0);
    var attiva = -1;
    sezioni.forEach(function (s, i) { if (s && s.getBoundingClientRect().top < innerHeight * 0.4) attiva = i; });
    link.forEach(function (a, i) { a.classList.toggle('is-active', i === attiva); });
    attesa = false;
  }
  window.addEventListener('scroll', function () { if (!attesa) { attesa = true; requestAnimationFrame(aggiorna); } }, { passive: true });
  aggiorna();
})();

// WhatsApp flottante: compare solo quando il bottone verde della hero non si vede più.
(function () {
  var cta = document.getElementById('hero-cta');
  var fab = document.querySelector('.wa-float');
  if (!cta || !fab) return;
  var gr = document.querySelector('.gr-float');
  function mostra(si) {
    fab.classList.toggle('is-on', si); fab.tabIndex = si ? 0 : -1; document.body.classList.toggle('wa-on', si);
    if (gr) { gr.classList.toggle('is-on', si); gr.tabIndex = si ? 0 : -1; }
  }
  if (!('IntersectionObserver' in window)) { mostra(true); return; }
  new IntersectionObserver(function (voci) {
    var v = voci[0];
    mostra(!v.isIntersecting && v.boundingClientRect.top < 0);
  }).observe(cta);
})();

// Progetti: frecce avanti e indietro (col dito si scorre da soli).
(function () {
  var track = document.getElementById('proj-track');
  var frecce = document.querySelectorAll('.arrow');
  if (!track || !frecce.length) return;
  function passo() {
    var card = track.querySelector('.proj');
    return card ? card.getBoundingClientRect().width + 16 : track.clientWidth * .8;
  }
  function aggiorna() {
    var max = track.scrollWidth - track.clientWidth - 2;
    frecce[0].disabled = track.scrollLeft <= 2;
    frecce[1].disabled = track.scrollLeft >= max;
  }
  frecce.forEach(function (b) {
    b.addEventListener('click', function () {
      track.scrollBy({ left: passo() * Number(b.dataset.dir), behavior: 'smooth' });
    });
  });
  track.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); track.scrollBy({ left: passo() * (e.key === 'ArrowRight' ? 1 : -1), behavior: 'smooth' }); }
  });
  track.addEventListener('scroll', function () { requestAnimationFrame(aggiorna); }, { passive: true });
  window.addEventListener('resize', aggiorna);
  aggiorna();
})();

// Loghi sparsi: ognuno galleggia con un suo tempo.
document.querySelectorAll('.scatter--cloud .chip').forEach(function (c, i) { c.style.setProperty('--n', i); });

// Menu su tablet e telefono.
(function () {
  var btn = document.querySelector('.top__menu');
  var nav = document.getElementById('menu');
  function apri(si) { nav.classList.toggle('is-open', si); btn.setAttribute('aria-expanded', si); }
  btn.addEventListener('click', function () { apri(!nav.classList.contains('is-open')); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) apri(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') apri(false); });
})();
