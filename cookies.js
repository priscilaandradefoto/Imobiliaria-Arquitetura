/* Escolha de cookies (LGPD) + carregamento do Google Analytics.
   - Sem GA_ID preenchido: nenhum aviso aparece e nada é carregado.
   - Com GA_ID: o aviso aparece até a pessoa escolher; o Analytics só carrega depois de "Aceitar".
   A escolha fica só no navegador (localStorage, chave "pa-cookies"). */
(function () {
  'use strict';
  var GA_ID = '';            // ex.: 'G-XXXXXXXXXX' (preencher no item 6 do checklist)
  var KEY = 'pa-cookies';

  function ler() {
    try { var v = localStorage.getItem(KEY); return v === 'aceito' || v === 'recusado' ? v : null; }
    catch (e) { return null; }
  }
  function gravar(v) {
    try { if (v) localStorage.setItem(KEY, v); else localStorage.removeItem(KEY); } catch (e) {}
  }

  function carregarAnalytics() {
    if (!GA_ID || window.__paGaLoaded) return;
    window.__paGaLoaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, { anonymize_ip: true });
  }

  function fecharAviso() {
    var el = document.getElementById('paCookies');
    if (el) el.remove();
    delete document.documentElement.dataset.cookies;
  }

  function escolher(v) {
    gravar(v);
    fecharAviso();
    if (v === 'aceito') carregarAnalytics();
  }

  function mostrarAviso() {
    if (document.getElementById('paCookies')) return;
    var css = document.createElement('style');
    css.textContent =
      '.pa-cookies{position:fixed;z-index:400;left:1rem;right:1rem;bottom:1rem;background:#14120f;color:#F3EEE4;' +
      'padding:1.1rem 1.25rem 1.2rem;border:1px solid rgba(243,238,228,.14);border-radius:14px;' +
      'box-shadow:0 20px 50px rgba(0,0,0,.35);font-family:Inter,-apple-system,BlinkMacSystemFont,sans-serif}' +
      '.pa-cookies p{font-size:.84rem;line-height:1.55;color:rgba(243,238,228,.85);margin:0}' +
      '.pa-cookies-tag{font-size:.64rem!important;letter-spacing:.2em;text-transform:uppercase;color:#e6c99a!important;font-weight:600;margin-bottom:.5rem!important}' +
      '.pa-cookies a{color:inherit;text-decoration:underline;text-underline-offset:3px}.pa-cookies a:hover{color:#e6c99a}' +
      '.pa-cookies-btns{display:flex;gap:.6rem;margin-top:1rem}' +
      '.pa-cookies button{font:inherit;cursor:pointer;font-size:.68rem;letter-spacing:.14em;text-transform:uppercase;font-weight:600;padding:.8rem 1.2rem;border-radius:10px 4px 4px 10px;border:0}' +
      '.pa-cookies-ok{background:#F3EEE4;color:#1B1A18}.pa-cookies-ok:hover{background:#fff}' +
      '.pa-cookies-no{background:transparent;color:#F3EEE4;border:1px solid rgba(243,238,228,.35)!important;border-radius:4px 10px 10px 4px!important}' +
      '.pa-cookies-no:hover{border-color:#F3EEE4!important}' +
      '.pa-cookies button:focus-visible{outline:2px solid #e6c99a;outline-offset:2px}' +
      '@media (min-width:700px){.pa-cookies{right:auto;left:1.5rem;bottom:1.5rem;max-width:400px}}' +
      '@media (max-width:699px){html[data-cookies="pendente"] .whatsapp-float{opacity:0;visibility:hidden;pointer-events:none}}';
    document.head.appendChild(css);

    var box = document.createElement('div');
    box.id = 'paCookies';
    box.className = 'pa-cookies';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', 'Aviso de cookies');
    box.innerHTML =
      '<p class="pa-cookies-tag">Cookies</p>' +
      '<p>Uso cookies do Google Analytics para entender quantas pessoas visitam o site. Você decide se aceita. ' +
      '<a href="/privacidade/">Política de privacidade</a>.</p>' +
      '<div class="pa-cookies-btns">' +
      '<button type="button" class="pa-cookies-ok">Aceitar</button>' +
      '<button type="button" class="pa-cookies-no">Recusar</button></div>';
    box.querySelector('.pa-cookies-ok').addEventListener('click', function () { escolher('aceito'); });
    box.querySelector('.pa-cookies-no').addEventListener('click', function () { escolher('recusado'); });
    document.body.appendChild(box);
    document.documentElement.dataset.cookies = 'pendente';
  }

  // Usado pelo botão "Rever minha escolha" da página de privacidade.
  window.paCookies = {
    ativo: !!GA_ID,
    rever: function () { gravar(null); window.location.reload(); }
  };

  function iniciar() {
    if (!GA_ID) return;
    var e = ler();
    if (e === 'aceito') carregarAnalytics();
    else if (e === null) mostrarAviso();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
