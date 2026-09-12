/* Help Cell — interações do header em JS próprio.
   -------------------------------------------------------------------------
   Por que isto existe: o site é um build de Next.js espelhado, e o chunk que
   controla o header (busca e menu mobile) não é carregado em todas as páginas.
   Sem hidratação, o onClick do React nunca é ligado e a lupa e o menu mobile
   ficam mortos. Estas funções não dependem de hidratação nenhuma.            */
(function () {
  'use strict';
  window.__helpcellUI = (window.__helpcellUI || 0) + 1;

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
  // O tema abre o menu com a classe .mobile-menu-visible num ancestral, mas o
  // React controla <html>, <body> e .page-wrapper e, ao reconciliar o DOM na
  // hidratação, apaga tanto a classe quanto o atributo style que aplicamos.
  // Por isso mantemos um estado próprio e reaplicamos enquanto estiver aberto.
  var menuAberto = false, obsMenu = null;
  var ABERTO = {visibility: 'visible', opacity: '1', transform: 'translateX(0)'};

  function aplicaMenu() {
    var w = document.querySelector('.mobile-nav__wrapper');
    if (!w) return;
    var c = w.querySelector('.mobile-nav__content');
    var alvos = c ? [w, c] : [w];
    for (var i = 0; i < alvos.length; i++) {
      var el = alvos[i];
      for (var k in ABERTO) {
        if (!menuAberto) { el.style.removeProperty(k); continue; }
        if (el.style.getPropertyValue(k) !== ABERTO[k]) {
          el.style.setProperty(k, ABERTO[k], 'important');
        }
      }
    }
    document.body.classList.toggle('mobile-menu-visible', menuAberto);
  }

  function menu(abrir) {
    menuAberto = !!abrir;
    aplicaMenu();
    if (menuAberto && !obsMenu) {
      var w = document.querySelector('.mobile-nav__wrapper');
      if (w) {
        obsMenu = new MutationObserver(aplicaMenu);
        obsMenu.observe(w, {attributes: true, attributeFilter: ['style', 'class'], subtree: true});
      }
    }
    if (!menuAberto && obsMenu) { obsMenu.disconnect(); obsMenu = null; }
  }
  function fechaMenu() { menu(false); }

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
    // menu mobile: o botão abre; o overlay e o X (que também têm a classe
    // mobile-nav__toggler, e só ficam clicáveis com o menu aberto) fecham.
    if (el.classList.contains('mobile-nav__toggler')) {
      e.preventDefault();
      menu(!(el.classList.contains('mobile-nav__close') ||
              el.classList.contains('mobile-nav__overlay')));
      return;
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

  // A hidratação do React troca o DOM do header logo depois do carregamento.
  // Um toque feito nesse instante se perde, porque o elemento tocado é
  // descartado entre o pointerdown e o click. Tratamos no pointerdown, que
  // dispara antes, e ignoramos o click seguinte para não desfazer a ação.
  var recem = 0;
  document.addEventListener('pointerdown', function (e) {
    var el = e.target.closest && e.target.closest('a,button,span,div');
    if (!el || !el.classList.contains('mobile-nav__toggler')) return;
    recem = Date.now();
    // Abrir/fechar explícito, nunca alternar: se pointerdown e click
    // dispararem para o mesmo toque, o estado final é o mesmo.
    menu(!(el.classList.contains('mobile-nav__close') ||
            el.classList.contains('mobile-nav__overlay')));
  }, true);

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

/* Botão flutuante de WhatsApp.
   -------------------------------------------------------------------------
   PARA TROCAR O NÚMERO, mexa só aqui. O ideal é um link wa.me direto
   (https://wa.me/5548NNNNNNNNN); o encurtador abaixo é o que consta no site
   antigo da loja e foi mantido por ser o único contato de WhatsApp conhecido. */
var HELPCELL_WHATSAPP = {
  link: 'http://bit.ly/whatssitehelpcellfloripa',
  texto: 'Falar no WhatsApp'
};
(function () {
  'use strict';
  function monta() {
    if (document.querySelector('.hc-zap')) return;
    var a = document.createElement('a');
    a.className = 'hc-zap';
    a.href = HELPCELL_WHATSAPP.link;
    a.target = '_blank';
    a.rel = 'noopener';
    a.setAttribute('aria-label', HELPCELL_WHATSAPP.texto);
    a.innerHTML =
      '<svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">' +
      '<path d="M16 3C8.8 3 3 8.8 3 16c0 2.3.6 4.5 1.7 6.4L3 29l6.8-1.8c1.9 1 4 1.6 6.2 1.6 7.2 0 13-5.8 13-13S23.2 3 16 3z" ' +
      'fill="currentColor"/><path d="M12.2 9.6c-.3-.6-.5-.6-.8-.6h-.7c-.2 0-.7.1-1 .5-.4.4-1.3 1.3-1.3 3.1 0 1.8 1.3 3.6 1.5 3.8.2.3 2.6 4.1 6.3 5.6 3.1 1.2 3.7 1 4.4.9.7-.1 2.2-.9 2.5-1.8.3-.9.3-1.6.2-1.8-.1-.2-.3-.2-.7-.4l-2.5-1.2c-.3-.2-.7-.1-1 .2l-1 1.2c-.2.2-.4.3-.8.1-.3-.2-1.4-.5-2.7-1.7-1-.9-1.7-2-1.9-2.4-.2-.3 0-.5.1-.7l.6-.8c.2-.2.2-.4.3-.7.1-.2 0-.5-.1-.7l-1.4-2.6z" ' +
      'fill="#fff"/></svg>' +
      '<span class="hc-zap__txt">' + HELPCELL_WHATSAPP.texto + '</span>';
    document.body.appendChild(a);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', monta);
  } else { monta(); }
  // o React pode refazer o body durante a hidratação
  new MutationObserver(function () { monta(); })
    .observe(document.documentElement, { childList: true, subtree: true });
})();

/* Header fixo ao rolar. O tema adicionava .stricky-fixed por JS; como o site
   é estático, fazemos aqui. */
(function () {
  'use strict';
  var LIMIAR = 160, tick = false;
  function ajusta() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    var hs = document.querySelectorAll('.stricky-header');
    for (var i = 0; i < hs.length; i++) {
      hs[i].classList.toggle('stricky-fixed', y > LIMIAR);
    }
    tick = false;
  }
  window.addEventListener('scroll', function () {
    if (tick) return;
    tick = true;
    window.requestAnimationFrame(ajusta);
  }, {passive: true});
  ajusta();
})();

/* Botão de voltar ao topo, que também era controlado por JS. */
(function () {
  'use strict';
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.scroll-to-top,.scroll-top');
    if (!b) return;
    e.preventDefault();
    window.scrollTo({top: 0, behavior: 'smooth'});
  }, false);
})();
