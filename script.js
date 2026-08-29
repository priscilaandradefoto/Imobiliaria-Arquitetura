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
    { id:'kora', name:'Kora', tags:['Arquitetura','Residencial','Vídeo'], folder:'kora', count:13, video:'1222385358', videoRatio:'240/426' },
    { id:'lucia-haddad', name:'Lúcia Haddad', tags:['Imóveis de Luxo','Still'], folder:'lucia-haddad', count:7 },
    { id:'mavesol', name:'Mavesol', tags:['Imóveis','Residencial'], folder:'mavesol', count:4 },
    { id:'prateleira-dos-imoveis', name:'Prateleira dos Imóveis', tags:['Fotografia Imobiliária','Still','Vídeo'], folder:'prateleira-dos-imoveis', count:11, video:'1215877157', videoRatio:'240/426' },
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
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
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

  /* ============ REVEAL ON SCROLL ============ */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); } });
  }, { threshold:.12, rootMargin:'0px 0px -60px 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ============ PORTFOLIO LIST ============ */
  const listEl = document.getElementById('portfolioList');
  PROJECTS.forEach((p, i) => {
    const photos = projectPhotos(p);
    const li = document.createElement('li');
    li.className = 'portfolio-row';
    li.dataset.id = p.id;
    li.innerHTML = `
      <div class="portfolio-row-inner">
        <span class="portfolio-index">${pad(i+1)}</span>
        <div class="portfolio-thumb-mobile">
          <img src="${photos[0]}" alt="" loading="lazy" decoding="async">
        </div>
        <h3 class="portfolio-name">${p.name}</h3>
        <div class="portfolio-tags">${p.tags.map(t=>`<span>${t}</span>`).join('')}</div>
        <span class="portfolio-arrow">↗</span>
      </div>
    `;
    li.addEventListener('click', () => openCase(p.id));
    listEl.appendChild(li);
  });

  /* ============ FLOATING PHOTO (desktop hover-follow) ============ */
  const canHoverFine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  if (canHoverFine) {
    const floatEl = document.getElementById('portfolioFloat');
    const floatImg = document.getElementById('portfolioFloatImg');
    const portfolioSection = document.getElementById('portfolio');
    let targetX = 0, targetY = 0, curX = 0, curY = 0, raf = null, active = false;

    const loop = () => {
      curX += (targetX - curX) * 0.16;
      curY += (targetY - curY) * 0.16;
      floatEl.style.left = curX + 'px';
      floatEl.style.top = curY + 'px';
      if (active || Math.abs(targetX-curX) > .5 || Math.abs(targetY-curY) > .5) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = null;
      }
    };
    const ensureLoop = () => { if (!raf) raf = requestAnimationFrame(loop); };

    portfolioSection.addEventListener('mousemove', e => {
      targetX = e.clientX; targetY = e.clientY;
      ensureLoop();
    });

    listEl.querySelectorAll('.portfolio-row').forEach(row => {
      const project = PROJECTS.find(p => p.id === row.dataset.id);
      const cover = projectPhotos(project)[0];
      row.addEventListener('mouseenter', () => {
        floatImg.src = cover;
        floatEl.classList.add('active');
        active = true;
        ensureLoop();
      });
      row.addEventListener('mouseleave', () => {
        floatEl.classList.remove('active');
        active = false;
        ensureLoop();
      });
    });
  }

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
  const caseMore = document.getElementById('caseMore');
  const caseClose = document.getElementById('caseClose');

  let currentProject = null;
  let lastFocused = null;

  function openCase(id, opts = {}) {
    const { updateUrl = true } = opts;
    const project = PROJECTS.find(p => p.id === id);
    if (!project) return;
    currentProject = project;
    lastFocused = document.activeElement;

    const idx = PROJECTS.indexOf(project) + 1;
    caseIndex.textContent = `Projeto ${pad(idx)} / ${pad(PROJECTS.length)}`;
    caseTitle.textContent = project.name;
    caseWatermark.textContent = project.name;
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
      caseGallery.innerHTML = photos.map((src, i) => `
        <figure data-index="${i}"${(project.fillLastRow && i === photos.length - 1) ? ' class="fill-row"' : ''}>
          <img src="${src}" alt="${project.name} — foto ${i+1}" loading="lazy" decoding="async">
        </figure>
      `).join('');
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
