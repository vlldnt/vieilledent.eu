/* ============================================
   PORTFOLIO
   Desktop/tablet: no-scroll panels with directional slide
   transitions (GSAP), wheel / keyboard / swipe navigation.
   Mobile: sections stacked, native scroll, nav = scroll-spy.
   + nav bubble "hole" animation
   ============================================ */

(() => {
  'use strict';

  // ── Translations ──
  const TRANSLATIONS = {
    en: {
      nav_home: 'Home', nav_projects: 'Projects', nav_about: 'About', nav_contact: 'Contact',
      badge_available: 'Available for opportunities',
      hero_subtitle: 'Full-stack developer — I build web and mobile apps end to end, from the database to the interface.',
      btn_view_projects: 'View Projects', btn_download_cv: 'Download CV', btn_get_in_touch: 'Get in Touch',
      projects_desc: "A selection of personal projects I've built.",
      card_synapses_desc: 'AI-assisted professional writing for the social and medico-social sector. Personal data is anonymized before anything reaches the AI.',
      card_eurocoins_desc: 'Interactive map of Europe to explore the national sides of euro coins from 25 countries, with a personal collection tracker. ECB data, 22 languages.',
      card_oak_desc: 'Interactive tracker for the Professor Oak Challenge: one checklist per game version, evolutions unlocking in order, progress saved in the browser.',
      card_gpxtooth_desc: 'GPS dashboard: import GPX files and explore routes, altitude, speed and heart rate on OSM, Topo and Satellite maps.',
      view_project: 'View Project', see_also: 'See also',
      desc_iakoa: 'Local event discovery platform: find, create and manage events in your city — NestJS, TypeScript, PostgreSQL, Prisma.',
      desc_planea: 'Weekly staff scheduling for aquatic centers: pools, qualifications, availability, PDF export — Rust / Axum, React 19, PostgreSQL.',
      desc_baguette: 'Bakery management: online shop, production planning, recipe-based ingredient needs, real-time stock — NestJS, Next.js, Prisma, PostgreSQL.',
      desc_jobkokpit: 'Personal job-search CRM driven by 5 AI agents (search, analysis, applications, interview prep, quality control) — Next.js 16, Prisma, PostgreSQL.',
      status_onhold: 'On hold', status_wip: 'In progress', status_private: 'In progress · private',
      about_desc: 'A little more about who I am and what I do.',
      about_heading: 'Get to know me',
      about_p1: "I'm a full-stack developer: I build web and mobile applications end to end, from the database to the interface, with clean architecture and modern tools.",
      about_p2: "I enjoy sharing what I learn along the way, hoping it helps others starting their journey in tech.",
      about_p3: "Open to opportunities where I can contribute to real projects and keep growing as a developer.",
      skills_heading: 'Skills & Tools',
      skills_web: 'Web', skills_backend: 'Backend', skills_tools: 'IDE & tools', skills_env: 'Environments',
      contact_desc: "Have a project in mind? Let's talk.",
      label_name: 'Name', placeholder_name: 'Your name',
      label_email: 'Email', placeholder_email: 'your@email.com',
      label_message: 'Message', placeholder_message: 'Tell me about your project...',
      btn_send: 'Send Message',
      form_sending: 'Sending…',
      form_success: 'Message sent! I\'ll get back to you soon.',
      form_error: 'Something went wrong. Please try again.',
      form_ratelimit: 'Please wait 5 minutes before sending again.',
      scroll_hint: 'Scroll',
    },
    fr: {
      nav_home: 'Accueil', nav_projects: 'Projets', nav_about: 'À propos', nav_contact: 'Contact',
      badge_available: 'Disponible pour des opportunités',
      hero_subtitle: 'Développeur full-stack — je conçois des applications web et mobiles de A à Z, de la base de données à l\'interface.',
      btn_view_projects: 'Voir les projets', btn_download_cv: 'Télécharger le CV', btn_get_in_touch: 'Me contacter',
      projects_desc: "Une sélection de projets personnels que j'ai réalisés.",
      card_synapses_desc: "Rédaction professionnelle assistée par IA pour le secteur social et médico-social. Les données personnelles sont anonymisées avant tout envoi à l'IA.",
      card_eurocoins_desc: "Carte d'Europe interactive des faces nationales des pièces en euros de 25 pays, avec suivi de collection personnelle. Données BCE, 22 langues.",
      card_oak_desc: "Tracker interactif du Professor Oak Challenge : une checklist par version du jeu, évolutions débloquées dans l'ordre, progression sauvegardée dans le navigateur.",
      card_gpxtooth_desc: 'Tableau de bord GPS : importez vos fichiers GPX et explorez parcours, altitude, vitesse et fréquence cardiaque sur cartes OSM, Topo et Satellite.',
      view_project: 'Voir le projet', see_also: 'Voir aussi',
      desc_iakoa: "Plateforme de découverte d'événements locaux : trouver, créer et gérer des événements dans sa ville — NestJS, TypeScript, PostgreSQL, Prisma.",
      desc_planea: 'Planning hebdomadaire du personnel pour centres aquatiques : bassins, qualifications, disponibilités, export PDF — Rust / Axum, React 19, PostgreSQL.',
      desc_baguette: 'Gestion de boulangerie : boutique en ligne, planning de production, besoins en ingrédients par recette, stock en temps réel — NestJS, Next.js, Prisma, PostgreSQL.',
      desc_jobkokpit: "CRM personnel de recherche d'emploi piloté par 5 agents IA (recherche, analyse, candidatures, préparation d'entretien, contrôle qualité) — Next.js 16, Prisma, PostgreSQL.",
      status_onhold: 'En pause', status_wip: 'En cours', status_private: 'En cours · privé',
      about_desc: 'Un peu plus sur qui je suis et ce que je fais.',
      about_heading: 'Mieux me connaître',
      about_p1: "Je suis développeur full-stack : je conçois des applications web et mobiles de A à Z, de la base de données à l'interface, avec une architecture propre et des outils modernes.",
      about_p2: "J'aime partager ce que j'apprends en chemin, en espérant aider ceux qui débutent leur parcours dans la tech.",
      about_p3: "Ouvert aux opportunités où je peux contribuer à de vrais projets et continuer à progresser en tant que développeur.",
      skills_heading: 'Compétences & Outils',
      skills_web: 'Web', skills_backend: 'Backend', skills_tools: 'IDE & outils', skills_env: 'Environnements',
      contact_desc: 'Un projet en tête ? Parlons-en.',
      label_name: 'Nom', placeholder_name: 'Votre nom',
      label_email: 'Email', placeholder_email: 'votre@email.com',
      label_message: 'Message', placeholder_message: 'Parlez-moi de votre projet...',
      btn_send: 'Envoyer',
      form_sending: 'Envoi…',
      form_success: 'Message envoyé ! Je vous réponds très vite.',
      form_error: 'Une erreur est survenue. Veuillez réessayer.',
      form_ratelimit: 'Merci de patienter 5 minutes avant de renvoyer.',
      scroll_hint: 'Défiler',
    },
  };

  const browserLang = navigator.language?.startsWith('fr') ? 'fr' : 'en';
  let currentLang = localStorage.getItem('lang') || browserLang;

  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    const t = TRANSLATIONS[lang];
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.dataset.i18n;
      if (t[key] !== undefined) el.textContent = t[key];
    });
    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const key = el.dataset.i18nHtml;
      if (t[key] !== undefined) el.innerHTML = t[key];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.dataset.i18nPlaceholder;
      if (t[key] !== undefined) el.placeholder = t[key];
    });
    document.querySelectorAll('.lang-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
  }

  // ── State ──
  let currentIndex = 0;
  let isAnimating = false;

  // ── Config ──
  const DURATION = 0.75;
  const EASE = 'power3.inOut';
  const SLIDE_DISTANCE = 100;

  // ── DOM refs ──
  const sections = gsap.utils.toArray('.section');
  const navDesktop = document.querySelectorAll('.nav-item');
  const navMobile = document.querySelectorAll('.nav-mob-item');
  const navBubble = document.getElementById('nav-bubble');
  const navMobBubble = document.getElementById('nav-mob-bubble');
  const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

  // Layout mode. Mobile (≤768px) = sections stacked, native vertical scroll,
  // bottom nav acts as scroll-spy. Otherwise = slide mode (one panel at a time).
  const mobileMQ = window.matchMedia('(max-width: 768px)');
  let mobileMode = mobileMQ.matches;
  // Sections whose content has already been revealed (anim-item visible)
  const revealed = new Set();

  /* ============================================
       NAV BUBBLE: Compute position & move
       ============================================ */
  function getBubbleX(item, bubble, nav) {
    // Use offsetLeft for reliable positioning relative to nav
    const itemW = item.offsetWidth;
    const bubbleW = bubble.offsetWidth;
    return item.offsetLeft + (itemW - bubbleW) / 2;
  }

  function moveBubble(index, animate) {
    // Desktop
    const dItem = navDesktop[index];
    if (dItem && navBubble) {
      const nav = dItem.closest('nav');
      const x = getBubbleX(dItem, navBubble, nav);
      if (animate) {
        gsap.to(navBubble, {
          left: x,
          duration: 0.55,
          ease: 'power3.out',
        });
      } else {
        gsap.set(navBubble, { left: x });
      }
    }

    // Mobile
    const mItem = navMobile[index];
    if (mItem && navMobBubble) {
      const nav = mItem.closest('nav');
      const x = getBubbleX(mItem, navMobBubble, nav);
      if (animate) {
        gsap.to(navMobBubble, {
          left: x,
          duration: 0.55,
          ease: 'power3.out',
        });
      } else {
        gsap.set(navMobBubble, { left: x });
      }
    }
  }

  /* ============================================
       NAV: Update active states + move bubble
       ============================================ */
  function updateNav(index, animate) {
    navDesktop.forEach((item, i) =>
      item.classList.toggle('active', i === index),
    );
    navMobile.forEach((item, i) =>
      item.classList.toggle('active', i === index),
    );
    moveBubble(index, animate !== false);
    updateScrollHint(index);
  }

  /* ============================================
       SCROLL HINT: animated chevrons pointing to the next section
       (down), or back up on the last one. Hidden during transitions.
       ============================================ */
  const scrollHint = document.getElementById('scroll-hint');

  function updateScrollHint(index) {
    if (!scrollHint) return;
    const isLast = index === sections.length - 1;
    scrollHint.classList.toggle('up', isLast);
    scrollHint.setAttribute('aria-label', isLast ? 'Back to top' : 'Next section');
  }

  function setScrollHintHidden(hidden) {
    if (scrollHint) scrollHint.classList.toggle('is-hidden', hidden);
  }

  if (scrollHint) {
    scrollHint.addEventListener('click', () => {
      if (mobileMode) return;
      const isLast = currentIndex === sections.length - 1;
      navigateTo(isLast ? 0 : currentIndex + 1);
    });
  }

  /* ============================================
       CONTENT: Staggered entrance for .anim-item
       (single pass — items start hidden via CSS)
       ============================================ */
  function animateSectionContent(section) {
    const items = section.querySelectorAll('.anim-item');
    if (!items.length) return;

    // Reset to hidden state (in case revisiting)
    gsap.set(items, { opacity: 0, y: 25 });

    // Single fade-in
    gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.55,
      stagger: 0.07,
      ease: 'power2.out',
      delay: 0.05,
    });
  }

  /* ============================================
       CORE: Navigate to a section
       ============================================ */
  function navigateTo(targetIndex) {
    if (mobileMode) {
      // Stacked layout: smooth-scroll to the section; scroll-spy updates the nav
      const target = sections[targetIndex];
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    if (targetIndex === currentIndex || isAnimating) return;
    isAnimating = true;
    setScrollHintHidden(true);

    const direction = targetIndex > currentIndex ? 1 : -1;
    const currentSection = sections[currentIndex];
    const targetSection = sections[targetIndex];

    // Move bubble immediately
    updateNav(targetIndex, true);

    // Prepare target: content hidden, section off-screen, scrolled to top
    targetSection.scrollTop = 0;
    revealed.add(targetSection);
    const targetItems = targetSection.querySelectorAll('.anim-item');
    gsap.set(targetItems, { opacity: 0, y: 25 });
    gsap.set(targetSection, {
      xPercent: direction * SLIDE_DISTANCE,
      opacity: 0,
      visibility: 'visible',
      zIndex: 2,
    });
    targetSection.classList.add('active');

    // Timeline: exit + enter simultaneously
    const tl = gsap.timeline({
      defaults: { duration: DURATION, ease: EASE },
      onComplete: () => {
        currentSection.classList.remove('active');
        gsap.set(currentSection, {
          xPercent: 0,
          opacity: 0,
          visibility: 'hidden',
          zIndex: 0,
          clearProps: 'transform',
        });
        gsap.set(targetSection, { zIndex: 1 });

        currentIndex = targetIndex;
        isAnimating = false;
        setScrollHintHidden(false);

        // Content entrance (only animation pass)
        animateSectionContent(targetSection);
      },
    });

    tl.to(
      currentSection,
      {
        xPercent: -direction * (SLIDE_DISTANCE * 0.4),
        opacity: 0,
      },
      0,
    );

    tl.to(
      targetSection,
      {
        xPercent: 0,
        opacity: 1,
      },
      0,
    );
  }

  /* ============================================
       INIT: Hero entrance on load (single pass)
       ============================================ */
  function initHeroAnimation() {
    const hero = sections[0];
    const items = hero.querySelectorAll('.anim-item');
    const socialLinks = hero.querySelectorAll('.social-link');
    const socialLine = hero.querySelector('.social-line');

    // Items already hidden via CSS (.anim-item { opacity:0; transform:translateY(25px) })
    // Social elements hidden via JS
    gsap.set(socialLinks, { opacity: 0, x: -15 });
    if (socialLine) gsap.set(socialLine, { scaleY: 0, transformOrigin: 'top' });

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      delay: 0.4,
    });

    // Single entrance — no flash
    tl.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.1,
    })
      .to(
        socialLinks,
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.07,
        },
        '-=0.4',
      )
      .to(
        socialLine,
        {
          scaleY: 1,
          duration: 0.4,
        },
        '-=0.2',
      );
  }

  /* ============================================
       EVENT LISTENERS
       ============================================ */
  navDesktop.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(parseInt(item.dataset.section, 10));
    });
  });

  navMobile.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(parseInt(item.dataset.section, 10));
    });
  });

  document.querySelectorAll('[data-goto]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(parseInt(btn.dataset.goto, 10));
    });
  });

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (mobileMode || e.metaKey || e.ctrlKey || e.altKey) return;
    // Never hijack typing in the contact form
    const tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.target.isContentEditable) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      if (currentIndex < sections.length - 1) navigateTo(currentIndex + 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (currentIndex > 0) navigateTo(currentIndex - 1);
    } else if (e.key >= '1' && e.key <= '4') {
      e.preventDefault();
      navigateTo(parseInt(e.key, 10) - 1);
    }
  });

  /* ============================================
       WHEEL NAVIGATION (slide mode)
       Gesture-based, not time-based. A navigation locks the wheel until
       the current gesture is over (no wheel event for WHEEL_IDLE ms).
       Trackpad inertia keeps firing events after the fingers lift, so a
       fixed cooldown let the tail of one swipe trigger a second navigation.
       ============================================ */
  const WHEEL_THRESHOLD = 40; // accumulated deltaY (px) needed to trigger
  const WHEEL_IDLE = 250; // ms without wheel events = gesture ended
  let wheelLocked = false;
  let wheelAccum = 0;
  let wheelIdleTimer = null;

  function armWheelIdle() {
    clearTimeout(wheelIdleTimer);
    wheelIdleTimer = setTimeout(() => {
      wheelLocked = false;
      wheelAccum = 0;
    }, WHEEL_IDLE);
  }

  function normalizeDelta(e) {
    if (e.deltaMode === 1) return e.deltaY * 16; // lines (Firefox)
    if (e.deltaMode === 2) return e.deltaY * window.innerHeight; // pages
    return e.deltaY;
  }

  // Can `el` still scroll natively in direction `dir` (1 = down, -1 = up)?
  function canScroll(el, dir) {
    if (!el || el.scrollHeight - el.clientHeight < 2) return false;
    if (dir > 0) return el.scrollTop + el.clientHeight < el.scrollHeight - 1;
    return el.scrollTop > 1;
  }

  document.addEventListener(
    'wheel',
    (e) => {
      if (mobileMode) return; // native page scroll

      // Horizontal-dominant gesture: swallow it (avoids browser back/forward swipe)
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        return;
      }

      const delta = normalizeDelta(e);
      const dir = Math.sign(delta);
      if (dir === 0) return;

      const section = sections[currentIndex];
      if (canScroll(section, dir)) {
        // Let the section scroll natively. Lock so that reaching the edge
        // mid-gesture doesn't immediately flip to the next section: the user
        // has to lift and swipe again.
        wheelLocked = true;
        wheelAccum = 0;
        armWheelIdle();
        return;
      }

      e.preventDefault();
      armWheelIdle();
      if (wheelLocked || isAnimating) return;

      if (Math.sign(wheelAccum) !== dir) wheelAccum = 0; // direction change
      wheelAccum += delta;
      if (Math.abs(wheelAccum) < WHEEL_THRESHOLD) return;

      wheelAccum = 0;
      wheelLocked = true; // stays locked until this gesture (incl. inertia) ends
      const target = currentIndex + dir;
      if (target >= 0 && target < sections.length) navigateTo(target);
    },
    { passive: false },
  );

  /* ============================================
       TOUCH SWIPE between sections (slide mode only, e.g. tablets)
       Mobile scrolls natively, so no swipe handling there.
       ============================================ */
  const SWIPE_THRESHOLD = 60;
  let touchStartX = 0,
    touchStartY = 0,
    touchFromField = false;

  document.addEventListener(
    'touchstart',
    (e) => {
      const t = e.changedTouches[0];
      touchStartX = t.clientX;
      touchStartY = t.clientY;
      const tag = e.target.tagName;
      touchFromField = tag === 'INPUT' || tag === 'TEXTAREA';
    },
    { passive: true },
  );

  document.addEventListener(
    'touchend',
    (e) => {
      if (mobileMode || touchFromField) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - touchStartX;
      const dy = t.clientY - touchStartY;
      // Clearly horizontal swipe only
      if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy) * 1.5) return;
      if (dx < 0 && currentIndex < sections.length - 1) navigateTo(currentIndex + 1);
      else if (dx > 0 && currentIndex > 0) navigateTo(currentIndex - 1);
    },
    { passive: true },
  );

  /* ============================================
       CUSTOM CURSOR (desktop only)
       ============================================ */
  if (!isMobile()) {
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');

    if (cursor && follower) {
      let mx = 0,
        my = 0;
      let fx = 0,
        fy = 0;

      document.addEventListener('mousemove', (e) => {
        mx = e.clientX;
        my = e.clientY;
        // xPercent/yPercent -50 keeps the dot centered regardless of size
        gsap.to(cursor, {
          left: mx,
          top: my,
          xPercent: -50,
          yPercent: -50,
          duration: 0.12,
          ease: 'power2.out',
        });
      });

      (function tick() {
        fx += (mx - fx) * 0.08;
        fy += (my - fy) * 0.08;
        // Dynamically read current size so centering adapts on hover
        const fw = follower.offsetWidth / 2;
        const fh = follower.offsetHeight / 2;
        follower.style.transform = `translate(${fx - fw}px, ${fy - fh}px)`;
        requestAnimationFrame(tick);
      })();

      const hoverEls = document.querySelectorAll(
        'a, button, .btn, .project-card, .see-also-item, .skill-chip, .nav-item, .nav-mob-item, input, textarea',
      );
      hoverEls.forEach((el) => {
        el.addEventListener('mouseenter', () => {
          cursor.classList.add('hover');
          follower.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
          cursor.classList.remove('hover');
          follower.classList.remove('hover');
        });
      });

      // Magnetic effect on nav
      navDesktop.forEach((icon) => {
        icon.addEventListener('mousemove', (e) => {
          const rect = icon.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          gsap.to(icon, {
            x: x * 0.2,
            y: y * 0.2,
            duration: 0.3,
            ease: 'power2.out',
          });
        });
        icon.addEventListener('mouseleave', () => {
          gsap.to(icon, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: 'elastic.out(1, 0.5)',
          });
        });
      });
    }
  }

  /* ============================================
       INIT
       ============================================ */
  /* ============================================
       LAYOUT MODE
       ============================================ */
  let revealObserver = null;
  let spyObserver = null;

  function teardownMobileObservers() {
    if (revealObserver) revealObserver.disconnect();
    if (spyObserver) spyObserver.disconnect();
    revealObserver = spyObserver = null;
  }

  function setupMobileObservers() {
    teardownMobileObservers();

    // Reveal each section's content once, when it scrolls into view
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const section = entry.target;
          if (!revealed.has(section)) {
            revealed.add(section);
            animateSectionContent(section);
          }
          revealObserver.unobserve(section);
        });
      },
      { threshold: 0.15 },
    );

    // Scroll-spy: the section crossing the middle of the screen is active
    spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setActiveIndex(sections.indexOf(entry.target));
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );

    sections.forEach((section) => {
      if (!revealed.has(section)) revealObserver.observe(section);
      spyObserver.observe(section);
    });
  }

  function setActiveIndex(index) {
    if (index === -1 || index === currentIndex) return;
    currentIndex = index;
    updateNav(index, true);
  }

  // Scrolled to the very bottom → last section is active even if it is short
  window.addEventListener(
    'scroll',
    () => {
      if (!mobileMode) return;
      const doc = document.documentElement;
      if (window.innerHeight + window.scrollY >= doc.scrollHeight - 2) {
        setActiveIndex(sections.length - 1);
      }
    },
    { passive: true },
  );

  function applyMode(initial) {
    mobileMode = mobileMQ.matches;
    document.documentElement.classList.toggle('mode-scroll', mobileMode);
    isAnimating = false;

    if (mobileMode) {
      // CSS lays the sections out vertically; drop GSAP inline state
      gsap.set(sections, { clearProps: 'all' });
      sections.forEach((section) => {
        section.classList.add('active');
        if (!initial && revealed.has(section)) {
          gsap.set(section.querySelectorAll('.anim-item'), { opacity: 1, y: 0 });
        }
      });
      setupMobileObservers();
      // Land on the section that was active in slide mode
      if (!initial && currentIndex > 0) {
        sections[currentIndex].scrollIntoView({ block: 'start' });
      }
    } else {
      teardownMobileObservers();
      window.scrollTo(0, 0);
      sections.forEach((section, i) => {
        const active = i === currentIndex;
        section.classList.toggle('active', active);
        gsap.set(section, {
          opacity: active ? 1 : 0,
          visibility: active ? 'visible' : 'hidden',
          xPercent: 0,
          zIndex: active ? 1 : 0,
        });
      });
      if (!initial) {
        revealed.add(sections[currentIndex]);
        gsap.set(sections[currentIndex].querySelectorAll('.anim-item'), { opacity: 1, y: 0 });
      }
    }

    updateNav(currentIndex, false);
  }

  mobileMQ.addEventListener('change', () => applyMode(false));

  /* ============================================
       INIT
       ============================================ */
  function init() {
    // Hero content is animated on load in both modes
    revealed.add(sections[0]);
    applyMode(true);

    // Nav entrance
    gsap.from('.nav-desktop', {
      opacity: 0,
      y: -30,
      duration: 0.7,
      ease: 'power2.out',
      delay: 0.15,
    });
    gsap.from('.nav-mobile', {
      opacity: 0,
      y: 30,
      duration: 0.7,
      ease: 'power2.out',
      delay: 0.15,
    });

    // Hero content entrance (single pass, no flash)
    initHeroAnimation();
    setScrollHintHidden(true);
    gsap.delayedCall(1.6, () => setScrollHintHidden(false));

    // Apply saved language
    setLanguage(currentLang);
  }

  // Reposition bubble on resize
  window.addEventListener('resize', () => moveBubble(currentIndex, false));

  /* ============================================
       CONTACT FORM
       ============================================ */
  const contactForm = document.getElementById('contact-form');
  // Record when the form section becomes visible (timing anti-bot)
  let formReadyAt = null;
  const formObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !formReadyAt) formReadyAt = Date.now();
  });
  if (contactForm) formObserver.observe(contactForm);

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const t = TRANSLATIONS[currentLang];
      const submitBtn = contactForm.querySelector('.btn-submit');
      const submitSpan = submitBtn.querySelector('span');
      const data = Object.fromEntries(new FormData(contactForm));
      data._t = formReadyAt || 0;

      submitBtn.disabled = true;
      submitSpan.textContent = t.form_sending;

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (res.ok) {
          contactForm.reset();
          submitSpan.textContent = t.form_success;
          submitBtn.style.background = '#16a34a';
          setTimeout(() => {
            submitSpan.textContent = t.btn_send;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
          }, 4000);
        } else if (res.status === 429) {
          submitSpan.textContent = t.form_ratelimit;
          submitBtn.style.background = '#d97706';
          setTimeout(() => {
            submitSpan.textContent = t.btn_send;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
          }, 5000);
        } else {
          throw new Error('non-ok');
        }
      } catch {
        submitSpan.textContent = t.form_error;
        submitBtn.style.background = '#dc2626';
        setTimeout(() => {
          submitSpan.textContent = t.btn_send;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
        }, 4000);
      }
    });
  }

  /* ============================================
       THEME TOGGLE — light/dark mode
       ============================================ */
  function toggleTheme() {
    const isDark =
      document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
  }

  // Language buttons
  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
  });

  // Restore saved preference
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  // Desktop toggle
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);

  // Mobile toggle (inside nav bar)
  const themeToggleMob = document.getElementById('theme-toggle-mob');
  if (themeToggleMob) themeToggleMob.addEventListener('click', toggleTheme);

  if (document.readyState === 'complete') {
    init();
  } else {
    window.addEventListener('load', init);
  }
})();
