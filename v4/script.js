/* ============================================
   PORTFOLIO — No-scroll, click-based navigation
   with directional slide transitions (GSAP)
   + nav bubble "hole" animation
   ============================================ */

(() => {
  'use strict';

  // ── Translations ──
  const TRANSLATIONS = {
    en: {
      nav_home: 'Home', nav_projects: 'Projects', nav_about: 'About', nav_contact: 'Contact',
      badge_available: 'Available for opportunities',
      hero_subtitle: 'Building elegant &amp; functional digital experiences.<br>Junior developer, constantly learning and growing.',
      btn_view_projects: 'View Projects', btn_download_cv: 'Download CV', btn_get_in_touch: 'Get in Touch',
      projects_desc: "A selection of personal projects I've built.",
      card_iakoa_ios_title: 'IAKOA — iOS App',
      card_iakoa_ios_desc: 'Discover local events with geolocation and community features.',
      card_iakoa_fs_title: 'IAKOA — Full Stack',
      card_iakoa_fs_desc: 'Backend API and web interface for the IAKOA event platform.',
      card_synapses_title: 'Synapses — ESMS',
      card_synapses_desc: 'Social-impact project developing an AI-assisted web app for social and medico-social sector professionals.',
      card_gpxtooth_desc: 'Personal website to track my .gpx bike and running sessions.',
      view_project: 'View Project', see_also: 'See also',
      desc_shell: 'Shell replica in C', desc_hbnb: 'Airbnb clone — Flask', desc_xptracker: 'WoW addon in Lua',
      about_desc: 'A little more about who I am and what I do.',
      about_heading: 'Get to know me',
      about_p1: "I'm a junior web developer focused on creating clean, functional, and user-friendly interfaces. Passionate about the intersection of design and code.",
      about_p2: "I enjoy sharing what I learn along the way, hoping it helps others starting their journey in tech.",
      about_p3: "Open to internship or junior-level opportunities where I can contribute to real projects and grow as a developer.",
      skills_heading: 'Skills & Tools',
      contact_desc: "Have a project in mind? Let's talk.",
      label_name: 'Name', placeholder_name: 'Your name',
      label_email: 'Email', placeholder_email: 'your@email.com',
      label_message: 'Message', placeholder_message: 'Tell me about your project...',
      btn_send: 'Send Message',
      form_sending: 'Sending…',
      form_success: 'Message sent! I\'ll get back to you soon.',
      form_error: 'Something went wrong. Please try again.',
      form_ratelimit: 'Please wait 5 minutes before sending again.',
    },
    fr: {
      nav_home: 'Accueil', nav_projects: 'Projets', nav_about: 'À propos', nav_contact: 'Contact',
      badge_available: 'Disponible pour des opportunités',
      hero_subtitle: 'Je conçois des expériences digitales élégantes &amp; fonctionnelles.<br>Développeur junior, en apprentissage constant.',
      btn_view_projects: 'Voir les projets', btn_download_cv: 'Télécharger le CV', btn_get_in_touch: 'Me contacter',
      projects_desc: "Une sélection de projets personnels que j'ai réalisés.",
      card_iakoa_ios_title: 'IAKOA — App iOS',
      card_iakoa_ios_desc: 'Découvrez des événements locaux avec géolocalisation et fonctionnalités communautaires.',
      card_iakoa_fs_title: 'IAKOA — Full Stack',
      card_iakoa_fs_desc: "API backend et interface web pour la plateforme d'événements IAKOA.",
      card_synapses_title: 'Synapses — ESMS',
      card_synapses_desc: "Projet à impact social développant une application web assistée par IA pour les professionnels du secteur social et médico-social (ESMS).",
      card_gpxtooth_desc: 'Site personnel pour suivre mes sessions vélo et course à pied en .gpx.',
      view_project: 'Voir le projet', see_also: 'Voir aussi',
      desc_shell: 'Réplique de shell en C', desc_hbnb: 'Clone Airbnb — Flask', desc_xptracker: 'Addon WoW en Lua',
      about_desc: 'Un peu plus sur qui je suis et ce que je fais.',
      about_heading: 'Mieux me connaître',
      about_p1: "Je suis un développeur web junior axé sur la création d'interfaces propres, fonctionnelles et conviviales. Passionné par l'intersection entre design et code.",
      about_p2: "J'aime partager ce que j'apprends en chemin, en espérant aider ceux qui débutent leur parcours dans la tech.",
      about_p3: "Ouvert aux opportunités de stage ou de poste junior où je peux contribuer à de vrais projets et évoluer en tant que développeur.",
      skills_heading: 'Compétences & Outils',
      contact_desc: 'Un projet en tête ? Parlons-en.',
      label_name: 'Nom', placeholder_name: 'Votre nom',
      label_email: 'Email', placeholder_email: 'votre@email.com',
      label_message: 'Message', placeholder_message: 'Parlez-moi de votre projet...',
      btn_send: 'Envoyer',
      form_sending: 'Envoi…',
      form_success: 'Message envoyé ! Je vous réponds très vite.',
      form_error: 'Une erreur est survenue. Veuillez réessayer.',
      form_ratelimit: 'Merci de patienter 5 minutes avant de renvoyer.',
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
    if (targetIndex === currentIndex || isAnimating) return;
    isAnimating = true;

    const direction = targetIndex > currentIndex ? 1 : -1;
    const currentSection = sections[currentIndex];
    const targetSection = sections[targetIndex];

    // Move bubble immediately
    updateNav(targetIndex, true);

    // Prepare target: content hidden, section off-screen
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

  // Wheel scroll navigation
  let lastWheelTime = 0;
  const WHEEL_COOLDOWN = DURATION * 1000 + 200;

  function getScrollableAncestor(section) {
    const candidates = [section, section.querySelector('.section-inner')];
    for (const el of candidates) {
      if (!el) continue;
      const style = getComputedStyle(el);
      const isScrollable = style.overflowY === 'auto' || style.overflowY === 'scroll';
      if (isScrollable && el.scrollHeight > el.clientHeight) return el;
    }
    return null;
  }

  document.addEventListener('wheel', (e) => {
    e.preventDefault();

    const now = Date.now();
    if (isAnimating || now - lastWheelTime < WHEEL_COOLDOWN) return;

    const activeSection = sections[currentIndex];
    const scrollable = getScrollableAncestor(activeSection);

    if (e.deltaY > 0) {
      if (scrollable && scrollable.scrollTop + scrollable.clientHeight < scrollable.scrollHeight - 5) return;
      if (currentIndex < sections.length - 1) {
        lastWheelTime = now;
        navigateTo(currentIndex + 1);
      }
    } else if (e.deltaY < 0) {
      if (scrollable && scrollable.scrollTop > 5) return;
      if (currentIndex > 0) {
        lastWheelTime = now;
        navigateTo(currentIndex - 1);
      }
    }
  }, { passive: false });

  // Touch swipe
  let touchStartX = 0,
    touchStartY = 0;
  const SWIPE_THRESHOLD = 60;

  document.addEventListener(
    'touchstart',
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    },
    { passive: true },
  );

  document.addEventListener(
    'touchend',
    (e) => {
      const dx = e.changedTouches[0].screenX - touchStartX;
      const dy = e.changedTouches[0].screenY - touchStartY;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD) {
        if (dx < 0 && currentIndex < sections.length - 1)
          navigateTo(currentIndex + 1);
        else if (dx > 0 && currentIndex > 0) navigateTo(currentIndex - 1);
      }
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
        'a, button, .btn, .project-card, .skill-item, .nav-item, .nav-mob-item, input, textarea',
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
  function init() {
    // All sections start hidden except hero
    sections.forEach((section, i) => {
      if (i === 0) {
        gsap.set(section, {
          opacity: 1,
          visibility: 'visible',
          xPercent: 0,
          zIndex: 1,
        });
        section.classList.add('active');
      } else {
        gsap.set(section, {
          opacity: 0,
          visibility: 'hidden',
          xPercent: 0,
          zIndex: 0,
        });
        section.classList.remove('active');
      }
    });

    // Position bubble without animation
    updateNav(0, false);

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
