(function () {
  'use strict';

  function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function initActivePage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('.nav-menu a, .mobile-dock .dock-item');

    links.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  function initScrollToTop() {
    const btn = document.getElementById('scrollToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      btn.classList.toggle('show', window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function initScrollReveal() {
    const elements = document.querySelectorAll('.fade-in');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach((el) => observer.observe(el));
  }

  function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    if (sessionStorage.getItem('shyamLoaderShown')) {
      preloader.style.display = 'none';
      return;
    }

    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('hide');
        setTimeout(() => {
          preloader.style.display = 'none';
          sessionStorage.setItem('shyamLoaderShown', 'true');
        }, 500);
      }, 800);
    });
  }

  function initCatalogueLoader() {
    const loader = document.getElementById('catalogueLoading');
    if (!loader) return;

    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hide');
        setTimeout(() => { loader.style.display = 'none'; }, 400);
      }, 600);
    });
  }

  function initOfflineCheck() {
    const offlineMessage = document.getElementById('offlineMessage');
    if (!offlineMessage) return;

    const check = () => {
      const offline = !navigator.onLine;
      offlineMessage.classList.toggle('show', offline);
      document.body.classList.toggle('offline', offline);
    };

    window.addEventListener('load', check);
    window.addEventListener('online', () => {
      check();
      if (typeof showSuccess !== 'undefined') {
        showSuccess('Internet connection restored!', 'Back Online');
      }
    });
    window.addEventListener('offline', check);
    document.addEventListener('DOMContentLoaded', check);
  }

  document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initActivePage();
    initScrollToTop();
    initScrollReveal();
    initPreloader();
    initCatalogueLoader();
    initOfflineCheck();
  });
})();
