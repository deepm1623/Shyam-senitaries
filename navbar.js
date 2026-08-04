(function () {
  'use strict';

  const TRANSITION_KEY = 'shyam-nav-transition';
  const PREFETCH_KEY = 'shyam-nav-prefetched';
  const MOTION = {
    spring: 'cubic-bezier(.22,1,.36,1)',
    pillDuration: 500,
    leaveDuration: 220,
    enterDuration: 350,
  };

  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');

  const state = {
    pillControllers: [],
    currentPage: getCurrentPage(),
    leaving: false,
    scrollRaf: 0,
    dockScrollRaf: 0,
  };

  function prefersReducedMotion() {
    return reduceMotionQuery.matches;
  }

  function canHover() {
    return hoverQuery.matches;
  }

  function getCurrentPage() {
    const current = window.location.pathname.split('/').pop();
    return current || 'index.html';
  }

  function normalizeHref(href) {
    return (href || '').split('?')[0].split('#')[0];
  }

  function isCurrentLink(link, currentPage) {
    const href = normalizeHref(link.getAttribute('href'));
    if (!href || href.charAt(0) === '#') return false;
    if (href === currentPage) return true;
    if (!currentPage && href === 'index.html') return true;
    return href === './' + currentPage;
  }

  function getLinkByHref(menu, href) {
    const normalized = normalizeHref(href);
    return Array.from(menu.querySelectorAll('a')).find((link) => normalizeHref(link.getAttribute('href')) === normalized) || null;
  }

  function setActiveByHref(href) {
    const current = normalizeHref(href) || state.currentPage;
    const links = document.querySelectorAll('.nav-menu a, .mobile-dock .dock-item');

    links.forEach((link) => {
      const isActive = normalizeHref(link.getAttribute('href')) === current;
      link.classList.toggle('active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  function setContentLeaving(isLeaving) {
    document.body.classList.toggle('nav-is-leaving', isLeaving);
  }

  function consumeTransitionState() {
    try {
      const raw = sessionStorage.getItem(TRANSITION_KEY);
      if (!raw) return null;
      sessionStorage.removeItem(TRANSITION_KEY);
      return JSON.parse(raw);
    } catch {
      sessionStorage.removeItem(TRANSITION_KEY);
      return null;
    }
  }

  function primePrefetch() {
    if (sessionStorage.getItem(PREFETCH_KEY)) return;

    const pages = ['index.html', 'Catalogue.html', 'contact.html'];
    pages.forEach((page) => {
      if (page === state.currentPage) return;
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.as = 'document';
      link.href = page;
      document.head.appendChild(link);
    });

    sessionStorage.setItem(PREFETCH_KEY, 'true');
  }

  function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    const update = () => {
      const shouldShrink = window.scrollY > 30;
      navbar.classList.toggle('scrolled', shouldShrink);
    };

    const onScroll = () => {
      if (state.scrollRaf) return;
      state.scrollRaf = requestAnimationFrame(() => {
        state.scrollRaf = 0;
        update();
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();
  }

  function createLiquidPill(menuSelector, pillSelector, transitionState) {
    const menu = document.querySelector(menuSelector);
    const pill = document.querySelector(pillSelector);
    if (!menu || !pill) return null;

    const controller = {
      menu,
      pill,
      scheduled: false,
      lastSignature: '',
    };

    function placeOnLink(link, animate = true) {
      if (!link || menu.getClientRects().length === 0) {
        pill.style.opacity = '0';
        return;
      }

      const menuRect = menu.getBoundingClientRect();
      const linkRect = link.getBoundingClientRect();
      const x = linkRect.left - menuRect.left;
      const y = linkRect.top - menuRect.top;
      const signature = [Math.round(x), Math.round(y), Math.round(linkRect.width), Math.round(linkRect.height)].join('|');

      if (signature === controller.lastSignature && animate) {
        pill.style.opacity = '1';
        return;
      }

      controller.lastSignature = signature;

      if (prefersReducedMotion()) {
        pill.style.transition = 'none';
      } else if (animate) {
        pill.style.transition = [
          `transform ${MOTION.pillDuration}ms ${MOTION.spring}`,
          `width ${MOTION.pillDuration}ms ${MOTION.spring}`,
          `height ${MOTION.pillDuration}ms ${MOTION.spring}`,
          'opacity 180ms ease',
        ].join(', ');
      }

      pill.style.width = `${linkRect.width}px`;
      pill.style.height = `${linkRect.height}px`;
      pill.style.opacity = '1';
      pill.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }

    function schedule(targetLink, animate = true) {
      if (controller.scheduled) return;
      controller.scheduled = true;

      requestAnimationFrame(() => {
        controller.scheduled = false;
        placeOnLink(targetLink, animate);
      });
    }

    controller.placeOnLink = placeOnLink;
    controller.schedule = schedule;

    const activeLink = menu.querySelector('a.active');
    if (transitionState && transitionState.from) {
      const sourceLink = getLinkByHref(menu, transitionState.from) || activeLink;
      placeOnLink(sourceLink, false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => schedule(activeLink, true));
      });
    } else {
      placeOnLink(activeLink, false);
      requestAnimationFrame(() => schedule(activeLink, true));
    }

    if ('ResizeObserver' in window) {
      const observer = new ResizeObserver(() => schedule(menu.querySelector('a.active'), true));
      observer.observe(menu);
    } else {
      window.addEventListener('resize', () => schedule(menu.querySelector('a.active'), true), { passive: true });
    }

    window.addEventListener('load', () => schedule(menu.querySelector('a.active'), true));

    state.pillControllers.push(controller);
    return controller;
  }

  function syncPills(href, animate = true) {
    const target = normalizeHref(href || state.currentPage);
    state.pillControllers.forEach((controller) => {
      const link = getLinkByHref(controller.menu, target) || controller.menu.querySelector('a.active');
      if (link) {
        controller.schedule(link, animate);
      }
    });
  }

  function initMobileDockScroll() {
    const dock = document.getElementById('mobileDock');
    if (!dock) return;

    let lastY = window.scrollY;

    window.addEventListener('scroll', () => {
      if (state.dockScrollRaf) return;

      state.dockScrollRaf = requestAnimationFrame(() => {
        state.dockScrollRaf = 0;
        const currentY = window.scrollY;

        if (currentY > lastY && currentY > 80) {
          dock.classList.add('dock-hidden');
        } else {
          dock.classList.remove('dock-hidden');
        }

        lastY = currentY;
      });
    }, { passive: true });
  }

  function bindNavTransitions() {
    const links = document.querySelectorAll('.nav-menu a, .mobile-dock .dock-item');

    links.forEach((link) => {
      link.addEventListener('click', (event) => {
        const targetHref = normalizeHref(link.getAttribute('href'));

        if (!targetHref || targetHref.charAt(0) === '#') {
          return;
        }

        if (targetHref === state.currentPage) {
          return;
        }

        event.preventDefault();

        const sourceLink = document.querySelector('.nav-menu a.active, .mobile-dock .dock-item.active');
        const fromHref = sourceLink ? normalizeHref(sourceLink.getAttribute('href')) : state.currentPage;

        setActiveByHref(targetHref);
        syncPills(targetHref, true);

        if (prefersReducedMotion()) {
          window.location.href = targetHref;
          return;
        }

        sessionStorage.setItem(TRANSITION_KEY, JSON.stringify({ from: fromHref, to: targetHref }));
        setContentLeaving(true);

        window.setTimeout(() => {
          window.location.href = targetHref;
        }, MOTION.leaveDuration);
      });
    });
  }

  function bindPressFeedback() {
    const targets = document.querySelectorAll('.nav-menu a, .mobile-dock .dock-item, .nav-call-btn');

    targets.forEach((target) => {
      const release = () => target.classList.remove('is-pressed');

      target.addEventListener('pointerdown', () => {
        target.classList.add('is-pressed');
      }, { passive: true });

      target.addEventListener('pointerup', () => {
        window.setTimeout(release, prefersReducedMotion() ? 0 : 120);
      }, { passive: true });

      target.addEventListener('pointercancel', release, { passive: true });
      target.addEventListener('pointerleave', release, { passive: true });
    });
  }

  function initPageEntry(transitionState) {
    const html = document.documentElement;

    if (!transitionState) {
      return;
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        html.classList.remove('nav-transition-pending');
      });
    });
  }

  function handleReducedMotionChange() {
    if (prefersReducedMotion()) {
      document.body.classList.remove('nav-is-leaving');
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const transitionState = consumeTransitionState();

    setActiveByHref(state.currentPage);
    primePrefetch();
    initNavbarScroll();
    initMobileDockScroll();
    bindNavTransitions();
    bindPressFeedback();
    initPageEntry(transitionState);
    createLiquidPill('.nav-center', '#navPill', transitionState);
    createLiquidPill('.mobile-dock', '#dockPill', transitionState);
    syncPills(state.currentPage, true);

    if (typeof reduceMotionQuery.addEventListener === 'function') {
      reduceMotionQuery.addEventListener('change', handleReducedMotionChange);
    } else if (typeof reduceMotionQuery.addListener === 'function') {
      reduceMotionQuery.addListener(handleReducedMotionChange);
    }
  });
})();
