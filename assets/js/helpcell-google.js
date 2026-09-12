/* Help Cell — bloco de avaliações do Google na seção "O Que Dizem Nossos Clientes".
   Sem widget de terceiros: usa o iframe oficial do Google Maps Embed + resumo da nota.
   -------------------------------------------------------------------------------
   PARA ATUALIZAR, mexa só aqui:                                                  */
var HELPCELL_GOOGLE = {
  nota: 4.4,
  avaliacoes: 684,   // valor manual — a ficha do Google ao lado mostra o número ao vivo
  // Ideal: cole aqui o link de Compartilhar da ficha. Este link por endereço foi testado e cai na ficha certa.
  ficha: 'https://www.google.com/maps/search/?api=1&query=Help+Cell+-+Floripa+Shopping%2C+Rod.+Virg%C3%ADlio+V%C3%A1rzea%2C+587%2C+Florian%C3%B3polis',
  busca: 'Help Cell - Floripa Shopping, Rod. Virgílio Várzea, 587, Florianópolis'
};
/* ----------------------------------------------------------------------------- */
(function () {
  'use strict';
  var G = HELPCELL_GOOGLE, MARCA = 'data-helpcell-google';
  // o tema tem duas variantes de seção de depoimentos ('testimonal-two' é typo do tema)
  var SECOES = '.testimonial-one, .testimonal-two, .testimonial-two';

  function estrelas(n) {
    var h = '', i;
    for (i = 1; i <= 5; i++) {
      h += '<i class="fa fa-star' + (n >= i ? '' : (n >= i - 0.5 ? '-half-alt' : '-o')) + '"></i>';
    }
    return h;
  }

  function bloco() {
    var el = document.createElement('div');
    el.className = 'helpcell-google';
    el.setAttribute(MARCA, '1');
    el.innerHTML =
      '<div class="helpcell-google__resumo">' +
        '<span class="helpcell-google__marca">Google</span>' +
        '<div class="helpcell-google__nota">' + G.nota.toString().replace('.', ',') + '</div>' +
        '<div class="helpcell-google__estrelas">' + estrelas(G.nota) + '</div>' +
        '<p class="helpcell-google__total">' + G.avaliacoes.toLocaleString('pt-BR') +
          ' avaliações no Google</p>' +
        '<a class="thm-btn helpcell-google__btn" href="' + G.ficha +
          '" target="_blank" rel="noopener">Ver todas as avaliações</a>' +
      '</div>' +
      '<div class="helpcell-google__mapa">' +
        '<iframe title="Help Cell no Google Maps" loading="lazy" ' +
          'referrerpolicy="no-referrer-when-downgrade" allowfullscreen ' +
          'src="https://www.google.com/maps?q=' + encodeURIComponent(G.busca) +
          '&output=embed"></iframe>' +
      '</div>';
    return el;
  }

  function aplica() {
    var sec = document.querySelector(SECOES);
    if (!sec || sec.querySelector('[' + MARCA + ']')) return;
    var alvo = sec.querySelector('.col-xl-12') || sec.querySelector('.container') || sec;
    alvo.appendChild(bloco());
  }

  var pendente = false;
  function reaplica() {
    if (pendente) return;
    pendente = true;
    setTimeout(function () { pendente = false; aplica(); }, 60);
  }

  function inicia() {
    aplica();
    // O React (App Router) refaz o nó da seção durante a hidratação, então observar
    // a própria seção não serve: o observer fica preso no nó descartado.
    // Observamos o body e reaplicamos — aplica() é idempotente pelo marcador.
    new MutationObserver(reaplica).observe(document.body, { childList: true, subtree: true });
    window.addEventListener('load', reaplica);
    [150, 500, 1200, 3000].forEach(function (t) { setTimeout(reaplica, t); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicia);
  } else {
    inicia();
  }
})();
