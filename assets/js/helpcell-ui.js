/* Help Cell — interações do header em JS próprio.
   -------------------------------------------------------------------------
   Por que isto existe: o site é um build de Next.js espelhado, e o chunk que
   controla o header (busca e menu mobile) não é carregado em todas as páginas.
   Sem hidratação, o onClick do React nunca é ligado e a lupa e o menu mobile
   ficam mortos. Estas funções não dependem de hidratação nenhuma.            */
(function () {
  'use strict';

  function fechaBusca() {
    var p = document.querySelector('.search-popup');
    if (p) p.classList.remove('active');
  }
  function abreBusca() {
    var p = document.querySelector('.search-popup');
    if (!p) return;
    p.classList.add('active');
    var i = p.querySelector('input');
    if (i) setTimeout(function () { i.focus(); }, 120);
  }
  function fechaMenu() {
    var w = document.querySelector('.mobile-nav__wrapper');
    if (w) w.classList.remove('expanded');
  }

  document.addEventListener('click', function (e) {
    var el = e.target.closest ? e.target.closest('a,button,div') : null;
    if (!el) return;

    // lupa: abre; overlay e botão de fechar: fecha
    if (el.classList.contains('search-toggler')) {
      e.preventDefault();
      var p = document.querySelector('.search-popup');
      if (el.classList.contains('search-popup__overlay')) return fechaBusca();
      return p && p.classList.contains('active') ? fechaBusca() : abreBusca();
    }
    // menu mobile
    if (el.classList.contains('mobile-nav__toggler')) {
      e.preventDefault();
      var w = document.querySelector('.mobile-nav__wrapper');
      if (w) w.classList.toggle('expanded');
      return;
    }
    if (el.classList.contains('mobile-nav__close') ||
        el.classList.contains('mobile-nav__overlay')) {
      e.preventDefault();
      return fechaMenu();
    }
    // acordeão dos submenus dentro do menu mobile
    if (el.tagName === 'BUTTON' && el.parentElement &&
        el.parentElement.classList.contains('dropdown') &&
        el.closest('.mobile-nav__content')) {
      e.preventDefault();
      var ul = el.parentElement.querySelector('ul');
      if (!ul) return;
      var aberto = ul.style.display === 'block';
      ul.style.display = aberto ? 'none' : 'block';
      el.classList.toggle('expanded', !aberto);
      el.classList.toggle('open', !aberto);
      return;
    }
  }, false);

  // Esc fecha busca e menu
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { fechaBusca(); fechaMenu(); }
  });

  // a busca é estática: manda para o Google restrito a este domínio
  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (!form.closest || !form.closest('.search-popup')) return;
    e.preventDefault();
    var i = form.querySelector('input');
    var q = (i && i.value || '').trim();
    if (!q) return;
    window.open('https://www.google.com/search?q=' +
      encodeURIComponent('site:' + location.hostname + ' ' + q), '_blank', 'noopener');
  });
})();

/* Cartão de serviço inteiro clicável: no tema só o título é link, e quem
   clica no ícone ou no texto tem a impressão de que o link não funciona. */
(function () {
  'use strict';
  var CAIXAS = '.services-two__single, .services-one__single, .services-three__single,' +
               '.fixing-one__points li, .why-choose-one__single';
  document.addEventListener('click', function (e) {
    if (e.target.closest('a,button')) return;          // link real tem prioridade
    var caixa = e.target.closest(CAIXAS);
    if (!caixa) return;
    var link = caixa.querySelector('a[href]:not([href="#"])');
    if (link) { e.preventDefault(); window.location.href = link.href; }
  }, false);
  var css = document.createElement('style');
  css.textContent = CAIXAS.split(',').map(function (s) { return s.trim(); })
    .filter(Boolean).map(function (s) { return s + '{cursor:pointer}'; }).join('');
  document.head.appendChild(css);
})();

/* Acordeão do FAQ das páginas de serviço (HTML estático, sem React). */
(function () {
  'use strict';
  document.addEventListener('click', function (e) {
    var q = e.target.closest && e.target.closest('.hc-faq__q');
    if (!q) return;
    e.preventDefault();
    var item = q.parentElement, aberto = item.classList.contains('aberto');
    var todos = item.parentElement.querySelectorAll('.hc-faq__item');
    for (var i = 0; i < todos.length; i++) todos[i].classList.remove('aberto');
    if (!aberto) item.classList.add('aberto');
  }, false);
})();
