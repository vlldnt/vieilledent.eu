/* ============================================
   PORTFOLIO — No-scroll, click-based navigation
   with directional slide transitions (GSAP)
   + nav bubble "hole" animation
   ============================================ */

(() => {
  'use strict';

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
  }

  // Reposition bubble on resize
  window.addEventListener('resize', () => moveBubble(currentIndex, false));

  if (document.readyState === 'complete') {
    init();
  } else {
    window.addEventListener('load', init);
  }
})();
