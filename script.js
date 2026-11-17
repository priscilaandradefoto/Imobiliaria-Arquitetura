(() => {
  'use strict';

  /* ============ DATA ============ */
  const PROJECTS = [
    { id:'ambientacao-ia', name:'Ambientação com IA', tags:['Ambientação com IA','Antes e Depois'], groups:[
      { label:'Ambientação 01', before:'ambientacao-ia/ambientacao-ia-0125-antes.jpg', after:'ambientacao-ia/ambientacao-ia-0125-depois.jpg', video:'1216430609', videoRatio:'360/240' },
      { label:'Ambientação 02', before:'ambientacao-ia/ambientacao-ia-0126-antes.jpg', after:'ambientacao-ia/ambientacao-ia-0126-depois.jpg', video:'1216430745', videoRatio:'360/240' },
      { label:'Ambientação 03', before:'ambientacao-ia/ambientacao-ia-252-antes.jpg', after:'ambientacao-ia/ambientacao-ia-252-depois.jpg', video:'1216430974', videoRatio:'360/240' },
      { label:'Ambientação 04', before:'ambientacao-ia/ambientacao-ia-0377-antes.jpg', after:'ambientacao-ia/ambientacao-ia-0377-depois.jpg', video:'1216431147', videoRatio:'360/240' },
    ]},
    { id:'imoveis-ferrari', name:'Imóveis Ferrari', tags:['Imóveis','Still','Vídeo'], folder:'imoveis-ferrari', count:15, video:'1219621575', videoRatio:'240/426' },
    { id:'imovel-a', name:'Imóvel A', tags:['Residencial','Still','Vídeo'], folder:'imovel-a', count:16, video:'1215884469', videoRatio:'240/426', fillLastRow:true },
    { id:'kora', name:'Kora', tags:['Arquitetura','Residencial','Vídeo'], folder:'kora', count:13, video:'1222385358', videoRatio:'240/426', fillLastRow:true },
    { id:'lucia-haddad', name:'Lúcia Haddad', tags:['Imóveis de Luxo','Still'], folder:'lucia-haddad', count:7 },
    { id:'mavesol', name:'Mavesol', tags:['Imóveis','Residencial'], folder:'mavesol', count:4 },
    { id:'prateleira-dos-imoveis', name:'Prateleira dos Imóveis', tags:['Fotografia Imobiliária','Still','Vídeo'], folder:'prateleira-dos-imoveis', count:20, video:'1215877157', videoRatio:'240/426', video2:'1222387528', video2Ratio:'240/426', video2After:5 },
    { id:'prime-to-place', name:'Prime To Place', tags:['Real Estate','Still'], folder:'prime-to-place', count:10 },
    { id:'z1', name:'Z1 Boutique de Imóveis', tags:['Boutique Imobiliária','Still'], folder:'z1', count:11 },
  ];

  const CLIENTS = [
    { name:'Abyara Prontos', cat:'Imobiliária', file:'mono/abyara-prontos.png' },
    { name:'Casas Bacanas', cat:'Imobiliária', file:'mono/casas-bacanas.png', fit:.66 },
    { name:'Chaves Imobiliária', cat:'Serviços Imobiliários', file:'mono/chaves-imobiliaria.png' },
    { name:'Dicastanha', cat:'Fotografia Imobiliária', file:'mono/dicastanha.png', fit:.62 },
    { name:'Imóveis Ferrari', cat:'Imobiliária', file:'mono/imoveis-ferrari.png', project:'imoveis-ferrari', fit:.72 },
    { name:'Legacy Brokers', cat:'Brokers', file:'mono/legacy-brokers.png' },
    { name:'Lúcia Haddad', cat:'Imóveis de Luxo', file:'mono/lucia-haddad.png', project:'lucia-haddad' },
    { name:'Mavesol', cat:'Imóveis', file:'mono/mavesol.png', project:'mavesol' },
    { name:'Prateleira dos Imóveis', cat:'Imobiliária', file:'mono/prateleira-dos-imoveis.png', project:'prateleira-dos-imoveis' },
    { name:'Prime To Place', cat:'Real Estate & Co.', file:'mono/prime-to-place.png', project:'prime-to-place' },
    { name:'Z1', cat:'Boutique de Imóveis', file:'mono/z1.png', project:'z1' },
    { name:'Zero Onze', cat:'Imóveis', file:'zero-onze.svg', invert:true, fit:.6 },
  ];

  const pad = n => String(n).padStart(2,'0');
  const projectPhotos = p => p.groups
    ? p.groups.flatMap(g => [g.after, g.before])
    : Array.from({length:p.count}, (_,i) => `${p.folder}/${p.folder}-${pad(i+1)}.jpg`);

  /* ============ HEADER SCROLL STATE ============ */
  const header = document.getElementById('siteHeader');
  // menu some ao rolar pra baixo e volta ao rolar pra cima
  let lastY = window.scrollY;
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 40);
    if (document.body.classList.contains('nav-open') || y < 80) header.classList.remove('is-hidden');
    else if (y > lastY + 6) header.classList.add('is-hidden');
    else if (y < lastY - 6) header.classList.remove('is-hidden');
    if (Math.abs(y - lastY) > 6) lastY = y;
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive:true });

  /* ============ MOBILE NAV ============ */
  const navToggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');
  const closeMobileNav = () => {
    navToggle.setAttribute('aria-expanded','false');
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden','true');
    document.body.classList.remove('no-scroll', 'nav-open');
  };
  navToggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    mobileNav.setAttribute('aria-hidden', String(!isOpen));
    document.body.classList.toggle('no-scroll', isOpen);
    document.body.classList.toggle('nav-open', isOpen);
  });
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobileNav));

  /* ============ HERO -> SOBRE: um scroll troca a foto inteira (a página não se move) ============ */
  const stage = document.getElementById('stage');
  const sobreBand = document.getElementById('sobreBand');
  if (stage && sobreBand) {
    const top = () => stage.offsetTop;
    const end = () => stage.offsetTop + window.innerHeight;   // posição em que o Sobre está completo
    let busy = false;
    const setShown = on => document.body.classList.toggle('sobre-shown', on);
    const go = (toSobre) => {
      busy = true;
      setShown(toSobre);
      window.scrollTo({ top: toSobre ? end() : top(), behavior:'smooth' });
      setTimeout(() => { busy = false; }, 1000);
    };
    // dentro do "palco" (entre o hero e o Sobre completo) qualquer gesto vira a troca inteira
    const inStage = () => window.scrollY >= top() - 2 && window.scrollY < end() - 2;
    const atSobre = () => Math.abs(window.scrollY - end()) <= 2;
    const handle = (dir, e) => {
      if (busy) { if (inStage() || atSobre()) e.preventDefault(); return; }
      if (dir > 0 && inStage() && !document.body.classList.contains('sobre-shown')) { e.preventDefault(); go(true); }
      else if (dir < 0 && (inStage() || atSobre())) { e.preventDefault(); go(false); }
    };
    window.addEventListener('wheel', e => {
      if (document.body.classList.contains('no-scroll') || Math.abs(e.deltaY) < 2) return;
      handle(Math.sign(e.deltaY), e);
    }, { passive:false });
    let touchY = null;
    window.addEventListener('touchstart', e => { touchY = e.touches[0].clientY; }, { passive:true });
    window.addEventListener('touchmove', e => {
      if (touchY === null || document.body.classList.contains('no-scroll')) return;
      const d = touchY - e.touches[0].clientY;
      if (Math.abs(d) > 12) { handle(Math.sign(d), e); touchY = null; }
    }, { passive:false });
    window.addEventListener('keydown', e => {
      if (document.body.classList.contains('no-scroll')) return;
      const down = ['ArrowDown','PageDown',' '].includes(e.key), up = ['ArrowUp','PageUp'].includes(e.key);
      if (down || up) handle(down ? 1 : -1, e);
    });
    // barra de rolagem, link do menu, recarregar no meio etc.: mantém o estado coerente com a posição
    const sync = () => { if (!busy) setShown(window.scrollY >= top() + window.innerHeight * .5); };
    window.addEventListener('scroll', sync, { passive:true });
    sync();
  }

  /* ============ RODAPÉ: revelação por trás da página ============ */
  const footer = document.getElementById('contato');
  if (footer) {
    let fTicking = false;
    const reveal = () => {
      fTicking = false;
      const docH = document.documentElement.scrollHeight;
      const fh = footer.offsetHeight;
      const p = Math.min(1, Math.max(0, (window.scrollY + window.innerHeight - (docH - fh)) / fh));
      footer.style.setProperty('--p', p.toFixed(3));
      document.body.classList.toggle('at-footer', p > .25);
    };
    const onFooterScroll = () => { if (!fTicking) { fTicking = true; requestAnimationFrame(reveal); } };
    window.addEventListener('scroll', onFooterScroll, { passive:true });
    window.addEventListener('resize', onFooterScroll);
    reveal();

    // o rodapé é fixo, então o link "Contato" rola até o fim da página
    const toFooter = e => {
      e.preventDefault();
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior:'smooth' });
    };
    document.querySelectorAll('a[href="#contato"]').forEach(a => a.addEventListener('click', toFooter));
    if (location.hash === '#contato') setTimeout(() => window.scrollTo(0, document.documentElement.scrollHeight), 300);
  }

  /* ============ REVEAL ON SCROLL ============ */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); } });
  }, { threshold:.12, rootMargin:'0px 0px -60px 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ============ PORTFOLIO GRID ============ */
  // ritmo de proporções das capas (retrato / paisagem / quadrado) para a grade ter variação, como numa galeria
  const COVER_RHYTHM = ['4/5','3/2','3/2','4/5','1/1','4/5','3/2','1/1','3/2'];
  const gridEl = document.getElementById('portfolioList');
  const gridCols = [document.createElement('div'), document.createElement('div')];
  gridCols.forEach(c => { c.className = 'pf-col'; gridEl.appendChild(c); });
  PROJECTS.forEach((p, i) => {
    const photos = projectPhotos(p);
    const card = document.createElement('article');
    card.className = 'pf-card';
    card.dataset.id = p.id;
    card.style.setProperty('--i', i);
    card.innerHTML = `
      <div class="pf-img" style="aspect-ratio:${COVER_RHYTHM[i % COVER_RHYTHM.length]}">
        <img src="${photos[0]}" alt="${p.name}" loading="lazy" decoding="async">
      </div>
      <div class="pf-meta">
        <span class="pf-idx">${pad(i+1)}</span>
        <h3 class="pf-name">${p.name}</h3>
        <span class="pf-tags">${p.tags.join(' · ')}</span>
      </div>
    `;
    card.addEventListener('click', () => openCase(p.id));
    gridCols[i % 2].appendChild(card);
  });

  /* ============ CLIENTS GRID ============ */
  const clientsGrid = document.getElementById('clientsGrid');
  CLIENTS.forEach((c, i) => {
    const div = document.createElement('div');
    div.className = 'client-card' + (c.project ? ' client-card--linked' : '');
    const fit = c.fit || .9;
    const styles = [`max-width:${fit*100}%`, `max-height:${fit*100}%`];
    if (c.invert) styles.push('filter:invert(1)');
    div.innerHTML = `
      <span class="client-index">${pad(i+1)}</span>
      <div class="client-mark">
        <img src="logos-padronizados/${c.file}" alt="Logo ${c.name}" loading="lazy" decoding="async" style="${styles.join(';')}">
      </div>
      <div class="client-caption">
        <span class="client-name">${c.name}</span>
        <span class="client-cat">${c.cat}</span>
      </div>
    `;
    if (c.project) {
      div.addEventListener('click', () => openCase(c.project));
    }
    clientsGrid.appendChild(div);
  });

  /* ============ CASE OVERLAY ============ */
  const caseOverlay = document.getElementById('caseOverlay');
  const caseWatermark = document.getElementById('caseWatermark');
  const caseIndex = document.getElementById('caseIndex');
  const caseTitle = document.getElementById('caseTitle');
  const caseTags = document.getElementById('caseTags');
  const caseGallery = document.getElementById('caseGallery');
  const caseVideo = document.getElementById('caseVideo');
  const caseVideo2 = document.getElementById('caseVideo2');
  const caseMore = document.getElementById('caseMore');
  const caseClose = document.getElementById('caseClose');
  const caseInner = document.querySelector('.case-inner');

  let currentProject = null;
  let lastFocused = null;

  // Scales the translucent project-name watermark so its rendered width
  // matches the case content width (the same width as the photo grid).
  // Capped so very short names (e.g. "Kora") don't blow up absurdly large.
  function fitWatermark(text) {
    caseWatermark.textContent = text;
    caseWatermark.style.fontSize = '200px';
    const naturalWidth = caseWatermark.getBoundingClientRect().width;
    if (!naturalWidth) return;
    const cs = getComputedStyle(caseInner);
    const targetWidth = caseInner.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const fontSize = Math.min(208, Math.max(64, 200 * (targetWidth / naturalWidth)));
    caseWatermark.style.fontSize = fontSize + 'px';
  }
  window.addEventListener('resize', () => {
    if (currentProject && caseOverlay.classList.contains('open')) fitWatermark(currentProject.name);
  });

  function openCase(id, opts = {}) {
    const { updateUrl = true } = opts;
    const project = PROJECTS.find(p => p.id === id);
    if (!project) return;
    currentProject = project;
    lastFocused = document.activeElement;

    const idx = PROJECTS.indexOf(project) + 1;
    caseIndex.textContent = `Projeto ${pad(idx)} / ${pad(PROJECTS.length)}`;
    caseTitle.textContent = project.name;
    fitWatermark(project.name);
    caseTags.innerHTML = project.tags.map(t => `<span>${t}</span>`).join('');

    const photos = projectPhotos(project);

    if (project.groups) {
      caseVideo.innerHTML = '';
      caseGallery.innerHTML = project.groups.map((g, gi) => `
        <div class="amb-group">
          <span class="amb-group-label">${g.label}</span>
          <div class="amb-group-row">
            <figure class="amb-photo" data-index="${gi*2+1}">
              <img src="${g.before}" alt="${g.label} — antes" loading="lazy" decoding="async">
              <span class="amb-tag">Antes</span>
            </figure>
            <figure class="amb-photo" data-index="${gi*2}">
              <img src="${g.after}" alt="${g.label} — depois" loading="lazy" decoding="async">
              <span class="amb-tag">Depois</span>
            </figure>
            <div class="amb-video">
              <iframe src="https://player.vimeo.com/video/${g.video}?background=1&title=0&byline=0&portrait=0&autoplay=1&muted=1&loop=1"
                allow="autoplay; fullscreen; picture-in-picture" allowfullscreen loading="lazy"
                title="${g.label} — vídeo"></iframe>
            </div>
          </div>
        </div>
      `).join('');
      caseGallery.querySelectorAll('.amb-photo').forEach(fig => {
        fig.addEventListener('click', () => openLightbox(project, Number(fig.dataset.index)));
      });
    } else {
      caseVideo.innerHTML = project.video ? `
        <div class="case-video-row">
          <div class="case-video-side">
            <img src="${photos[0] || ''}" alt="" loading="lazy" decoding="async">
          </div>
          <div class="case-video-frame" style="--video-ratio:${project.videoRatio || '9/16'}">
            <iframe src="https://player.vimeo.com/video/${project.video}?background=1&title=0&byline=0&portrait=0&autoplay=1&muted=1&loop=1"
              allow="autoplay; fullscreen; picture-in-picture" allowfullscreen loading="lazy"
              title="${project.name} — vídeo"></iframe>
          </div>
          <div class="case-video-side">
            <img src="${photos[1] || ''}" alt="" loading="lazy" decoding="async">
          </div>
        </div>
      ` : '';
      const figuresHtml = photos.map((src, i) => `
        <figure data-index="${i}"${(project.fillLastRow && i === photos.length - 1) ? ' class="fill-row"' : ''}>
          <img src="${src}" alt="${project.name} — foto ${i+1}" loading="lazy" decoding="async">
        </figure>
      `);
      caseVideo2.innerHTML = '';
      if (project.video2) {
        const cut = Math.min(Math.max(project.video2After || photos.length, 2), photos.length);
        const videoRowHtml = `
          <div class="case-video-row">
            <div class="case-video-side">
              <img src="${photos[cut-2] || ''}" alt="" loading="lazy" decoding="async">
            </div>
            <div class="case-video-frame" style="--video-ratio:${project.video2Ratio || '9/16'}">
              <iframe src="https://player.vimeo.com/video/${project.video2}?background=1&title=0&byline=0&portrait=0&autoplay=1&muted=1&loop=1"
                allow="autoplay; fullscreen; picture-in-picture" allowfullscreen loading="lazy"
                title="${project.name} — vídeo"></iframe>
            </div>
            <div class="case-video-side">
              <img src="${photos[cut-1] || ''}" alt="" loading="lazy" decoding="async">
            </div>
          </div>
        `;
        figuresHtml.splice(cut, 0, videoRowHtml);
      }
      caseGallery.innerHTML = figuresHtml.join('');
      caseGallery.querySelectorAll('figure').forEach(fig => {
        fig.addEventListener('click', () => openLightbox(project, Number(fig.dataset.index)));
      });
    }

    const others = PROJECTS.filter(p => p.id !== project.id);
    caseMore.innerHTML = `
      <span class="case-more-label">Outros projetos</span>
      <div class="case-more-list">
        ${others.map(p => `
          <div class="case-more-item" data-id="${p.id}">
            <div class="case-more-thumb">
              <img src="${projectPhotos(p)[0]}" alt="" loading="lazy" decoding="async">
            </div>
            <span class="case-more-name">${p.name}</span>
            <span class="case-more-arrow">↗</span>
          </div>
        `).join('')}
      </div>
    `;
    caseMore.querySelectorAll('.case-more-item').forEach(item => {
      item.addEventListener('click', () => openCase(item.dataset.id));
    });

    caseOverlay.classList.add('open');
    caseOverlay.setAttribute('aria-hidden','false');
    document.body.classList.add('no-scroll');
    caseOverlay.scrollTop = 0;
    caseClose.focus();

    if (updateUrl && location.hash.slice(1) !== id) {
      history.pushState({ caseId: id }, '', '#' + id);
    }
  }

  function closeCase(opts = {}) {
    const { updateUrl = true } = opts;
    caseOverlay.classList.remove('open');
    caseOverlay.setAttribute('aria-hidden','true');
    document.body.classList.remove('no-scroll');
    if (lastFocused) lastFocused.focus();

    if (updateUrl && location.hash) {
      history.pushState({}, '', location.pathname + location.search);
    }
  }
  caseClose.addEventListener('click', () => closeCase());
  caseOverlay.addEventListener('click', e => { if (e.target === caseOverlay) closeCase(); });

  window.addEventListener('popstate', () => {
    const id = location.hash.slice(1);
    const project = PROJECTS.find(p => p.id === id);
    if (project) {
      openCase(id, { updateUrl:false });
    } else if (caseOverlay.classList.contains('open')) {
      closeCase({ updateUrl:false });
    }
  });

  const initialId = location.hash.slice(1);
  if (PROJECTS.find(p => p.id === initialId)) {
    openCase(initialId, { updateUrl:false });
  }

  /* ============ LIGHTBOX ============ */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let lbProject = null, lbIndex = 0;

  function renderLightbox() {
    const photos = projectPhotos(lbProject);
    lightboxImg.src = photos[lbIndex];
    lightboxImg.alt = `${lbProject.name} — foto ${lbIndex+1}`;
    lightboxCounter.textContent = `${pad(lbIndex+1)} / ${pad(photos.length)}`;
  }

  function openLightbox(project, index) {
    lbProject = project; lbIndex = index;
    renderLightbox();
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden','false');
  }
  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden','true');
  }
  function stepLightbox(dir) {
    const total = projectPhotos(lbProject).length;
    lbIndex = (lbIndex + dir + total) % total;
    renderLightbox();
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => stepLightbox(-1));
  lightboxNext.addEventListener('click', () => stepLightbox(1));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

  /* keyboard: arrows + escape, lightbox takes priority over case overlay */
  window.addEventListener('keydown', e => {
    if (lightbox.classList.contains('open')) {
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') stepLightbox(-1);
      else if (e.key === 'ArrowRight') stepLightbox(1);
    } else if (caseOverlay.classList.contains('open')) {
      if (e.key === 'Escape') closeCase();
    }
  });

  /* touch swipe for lightbox */
  let touchStartX = 0, touchStartY = 0;
  lightbox.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
    touchStartY = e.changedTouches[0].clientY;
  }, { passive:true });
  lightbox.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      stepLightbox(dx < 0 ? 1 : -1);
    } else if (Math.abs(dy) > 80 && Math.abs(dy) > Math.abs(dx)) {
      closeLightbox();
    }
  }, { passive:true });

  /* ============ FOOTER YEAR ============ */
  document.getElementById('year').textContent = new Date().getFullYear();

})();
