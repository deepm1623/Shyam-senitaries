(function () {
  'use strict';

  const NAV_PAGES = ['index.html', 'Catalogue.html', 'contact.html'];
  const MOTION = {
    spring: 'cubic-bezier(.22,1,.36,1)',
    pillDuration: 500,
    contentLeave: 220,
    contentEnter: 350,
  };

  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  const state = {
    currentPage: getCurrentPage(),
    pillEngines: [],
    navigating: false,
    scrollRaf: 0,
    dockScrollRaf: 0,
    resizeRaf: 0,
  };

  function prefersReducedMotion() {
    return reduceMotionQuery.matches;
  }

  function getCurrentPage() {
    const current = window.location.pathname.split('/').pop();
    return current || 'index.html';
  }

  function normalizeHref(href) {
    return (href || '').split('?')[0].split('#')[0];
  }

  function isNavPage(href) {
    return NAV_PAGES.includes(normalizeHref(href));
  }

  function isCurrentLink(link, page) {
    const href = normalizeHref(link.getAttribute('href'));
    if (!href || href.charAt(0) === '#') return false;
    return href === page || href === './' + page;
  }

  function getLinkByHref(container, href) {
    const normalized = normalizeHref(href);
    return Array.from(container.querySelectorAll('a')).find(
      (link) => normalizeHref(link.getAttribute('href')) === normalized
    ) || null;
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

  function primePrefetch() {
    if (sessionStorage.getItem('shyam-nav-prefetched')) return;

    NAV_PAGES.forEach((page) => {
      if (page === state.currentPage) return;
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.as = 'document';
      link.href = page;
      document.head.appendChild(link);
    });

    sessionStorage.setItem('shyam-nav-prefetched', 'true');
  }

  function createPillEngine(container, pill) {
    if (!container || !pill) return null;

    const engine = {
      container,
      pill,
      pendingRaf: 0,
      lastKey: '',
    };

    engine.moveTo = function moveTo(link, animate) {
      cancelAnimationFrame(engine.pendingRaf);

      engine.pendingRaf = requestAnimationFrame(() => {
        engine.pendingRaf = 0;

        if (!link || container.getClientRects().length === 0) {
          pill.style.opacity = '0';
          engine.lastKey = '';
          return;
        }

        const containerRect = container.getBoundingClientRect();
        const linkRect = link.getBoundingClientRect();
        const x = linkRect.left - containerRect.left;
        const y = linkRect.top - containerRect.top;
        const width = linkRect.width;
        const height = linkRect.height;
        const key = [Math.round(x), Math.round(y), Math.round(width), Math.round(height)].join('|');

        if (key === engine.lastKey) {
          pill.style.opacity = '1';
          return;
        }

        const shouldAnimate = animate && !prefersReducedMotion();

        pill.style.width = `${width}px`;
        pill.style.height = `${height}px`;

        if (shouldAnimate) {
          pill.style.transition = [
            `transform ${MOTION.pillDuration}ms ${MOTION.spring}`,
            'opacity 180ms ease',
          ].join(', ');
        } else {
          pill.style.transition = 'none';
        }

        pill.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        pill.style.opacity = '1';
        engine.lastKey = key;

        if (!shouldAnimate) {
          void pill.offsetWidth;
          pill.style.transition = [
            `transform ${MOTION.pillDuration}ms ${MOTION.spring}`,
            'opacity 180ms ease',
          ].join(', ');
        }
      });
    };

    engine.moveToActive = function moveToActive(animate) {
      engine.moveTo(container.querySelector('a.active'), animate);
    };

    return engine;
  }

  function syncPills(animate) {
    state.pillEngines.forEach((engine) => engine.moveToActive(animate));
  }

  function initPillEngines() {
    state.pillEngines = [];

    const desktopContainer = document.querySelector('.nav-center');
    const desktopPill = document.getElementById('navPill');
    const mobileContainer = document.getElementById('mobileDock');
    const mobilePill = document.getElementById('dockPill');

    const desktopEngine = createPillEngine(desktopContainer, desktopPill);
    const mobileEngine = createPillEngine(mobileContainer, mobilePill);

    if (desktopEngine) state.pillEngines.push(desktopEngine);
    if (mobileEngine) state.pillEngines.push(mobileEngine);
  }

  function initPillLayoutObservers() {
    const reposition = () => syncPills(false);

    const onResize = () => {
      if (state.resizeRaf) return;
      state.resizeRaf = requestAnimationFrame(() => {
        state.resizeRaf = 0;
        reposition();
      });
    };

    window.addEventListener('resize', onResize, { passive: true });

    if ('ResizeObserver' in window) {
      state.pillEngines.forEach((engine) => {
        const observer = new ResizeObserver(onResize);
        observer.observe(engine.container);
      });
    }

    window.addEventListener('orientationchange', onResize, { passive: true });
  }

  function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    const update = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 30);
      syncPills(false);
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

  function shouldPersistBodyNode(node) {
    if (!node || node.nodeType !== Node.ELEMENT_NODE) return false;
    if (node.id === 'navbar' || node.id === 'mobileDock') return true;
    if (node.tagName === 'FOOTER') return true;
    if (node.tagName === 'SCRIPT' && node.getAttribute('src')) {
      const src = node.getAttribute('src') || '';
      return src.includes('navbar.js') || src.includes('custom-popup.js') || src.includes('hero-video.js');
    }
    return false;
  }

  function swapHeadMeta(doc) {
    document.title = doc.title;

    const currentStyle = document.getElementById('page-styles');
    const nextStyle = doc.getElementById('page-styles');

    if (currentStyle && nextStyle) {
      currentStyle.textContent = nextStyle.textContent;
    }
  }

  function runInlineScripts(codeBlocks) {
    codeBlocks.forEach((code) => {
      if (!code || !code.trim()) return;
      const script = document.createElement('script');
      script.textContent = code;
      document.body.appendChild(script);
      script.remove();
    });
  }

  function initCatalogueOffline() {
    const offlineMessage = document.getElementById('offlineMessage');
    if (!offlineMessage) return;

    const checkConnection = () => {
      const offline = !navigator.onLine;
      offlineMessage.classList.toggle('show', offline);
      document.body.classList.toggle('offline', offline);
    };

    checkConnection();

    if (initCatalogueOffline.initialized) return;
    initCatalogueOffline.initialized = true;

    window.addEventListener('online', () => {
      checkConnection();
      if (typeof showSuccess !== 'undefined') {
        showSuccess('Internet connection restored!', 'Back Online');
      }
    });
    window.addEventListener('offline', checkConnection);
  }

  initCatalogueOffline.initialized = false;

  function initPageScripts(page, inlineScripts) {
    if (page === 'Catalogue.html') {
      initCatalogueOffline();
      return;
    }

    runInlineScripts(inlineScripts);
  }

  function swapBodyContent(doc) {
    const footer = document.querySelector('footer');
    if (!footer) return [];

    Array.from(document.body.children).forEach((node) => {
      if (shouldPersistBodyNode(node)) return;
      node.remove();
    });

    const inlineScripts = [];

    Array.from(doc.body.children).forEach((node) => {
      if (shouldPersistBodyNode(node)) return;

      if (node.tagName === 'SCRIPT') {
        if (!node.getAttribute('src')) {
          inlineScripts.push(node.textContent || '');
        }
        return;
      }

      footer.before(document.importNode(node, true));
    });

    return inlineScripts;
  }

  async function fetchPageDocument(href) {
    const response = await fetch(href, {
      credentials: 'same-origin',
      headers: { 'X-Requested-With': 'shyam-spa' },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${href}`);
    }

    const html = await response.text();
    return new DOMParser().parseFromString(html, 'text/html');
  }

  async function loadPage(href, options = {}) {
    const {
      push = false,
      animatePill = false,
      animateContent = true,
      repositionPill = true,
    } = options;
    const normalized = normalizeHref(href);

    if (!isNavPage(normalized)) {
      window.location.href = normalized;
      return;
    }

    if (state.navigating) return;
    state.navigating = true;

    try {
      if (animateContent && !prefersReducedMotion()) {
        setContentLeaving(true);
        await new Promise((resolve) => window.setTimeout(resolve, MOTION.contentLeave));
      }

      const doc = await fetchPageDocument(normalized);
      swapHeadMeta(doc);
      const inlineScripts = swapBodyContent(doc);

      setActiveByHref(normalized);
      state.currentPage = normalized;

      if (push) {
        history.pushState({ page: normalized }, '', normalized);
      }

      window.scrollTo(0, 0);
      initPageScripts(normalized, inlineScripts);

      if (normalized === 'index.html' && typeof window.initializeHeroVideo === 'function') {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            window.initializeHeroVideo({ reason: 'navigation' });
          });
        });
      }

      requestAnimationFrame(() => {
        if (repositionPill) {
          syncPills(animatePill);
        }
        if (animateContent && !prefersReducedMotion()) {
          requestAnimationFrame(() => {
            setContentLeaving(false);
          });
        } else {
          setContentLeaving(false);
        }
      });
    } catch {
      window.location.href = normalized;
    } finally {
      state.navigating = false;
    }
  }

  function bindNavTransitions() {
    const links = document.querySelectorAll('.nav-menu a, .mobile-dock .dock-item');

    links.forEach((link) => {
      link.addEventListener('click', (event) => {
        const targetHref = normalizeHref(link.getAttribute('href'));

        if (!targetHref || targetHref.charAt(0) === '#' || !isNavPage(targetHref)) {
          return;
        }

        if (targetHref === state.currentPage) {
          event.preventDefault();
          return;
        }

        event.preventDefault();

        if (prefersReducedMotion()) {
          window.location.href = targetHref;
          return;
        }

        setActiveByHref(targetHref);
        syncPills(true);
        loadPage(targetHref, { push: true, repositionPill: false, animateContent: true });
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

  function handlePopState() {
    const page = getCurrentPage();
    if (page === state.currentPage) return;
    loadPage(page, { push: false, animatePill: true, animateContent: false, repositionPill: true });
  }

  function handleReducedMotionChange() {
    if (prefersReducedMotion()) {
      document.body.classList.remove('nav-is-leaving');
      syncPills(false);
    }
  }

  function boot() {
    setActiveByHref(state.currentPage);
    primePrefetch();
    initPillEngines();
    initPillLayoutObservers();
    initNavbarScroll();
    initMobileDockScroll();
    bindNavTransitions();
    bindPressFeedback();

    history.replaceState({ page: state.currentPage }, '', state.currentPage);

    requestAnimationFrame(() => {
      syncPills(false);
    });

    window.addEventListener('popstate', handlePopState);

    if (typeof reduceMotionQuery.addEventListener === 'function') {
      reduceMotionQuery.addEventListener('change', handleReducedMotionChange);
    } else if (typeof reduceMotionQuery.addListener === 'function') {
      reduceMotionQuery.addListener(handleReducedMotionChange);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
