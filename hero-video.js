(function () {
  'use strict';

  var HERO_VIDEO_SRC = 'video.mp4';
  var MAX_PLAY_RETRIES = 6;
  var lifecycleBound = false;
  var activeInitToken = 0;
  var pendingRetryTimer = 0;

  function isHomeActive() {
    var page = window.location.pathname.split('/').pop();
    return !page || page === 'index.html';
  }

  function getVideo() {
    return document.querySelector('.hero-video');
  }

  function clearPendingRetry() {
    if (pendingRetryTimer) {
      window.clearTimeout(pendingRetryTimer);
      pendingRetryTimer = 0;
    }
  }

  function ensureVideoAttributes(video) {
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('preload', 'auto');
  }

  function ensureVideoSource(video) {
    var dataSrc = video.getAttribute('data-src') || HERO_VIDEO_SRC;
    var source = video.querySelector('source');
    var changed = false;

    if (!source) {
      source = document.createElement('source');
      source.type = 'video/mp4';
      video.appendChild(source);
      changed = true;
    }

    if (source.getAttribute('src') !== dataSrc) {
      source.setAttribute('src', dataSrc);
      changed = true;
    }

    ensureVideoAttributes(video);
    return changed;
  }

  function tryPlay(video, token, attempt) {
    if (token !== activeInitToken || !document.contains(video)) return;

    var playAttempt = video.play();
    if (!playAttempt || typeof playAttempt.then !== 'function') return;

    playAttempt.then(function () {
      if (token !== activeInitToken) return;
      video.classList.remove('hero-video--failed');
    }).catch(function () {
      if (token !== activeInitToken || !document.contains(video)) return;

      if (attempt >= MAX_PLAY_RETRIES) {
        video.classList.add('hero-video--failed');
        return;
      }

      clearPendingRetry();
      pendingRetryTimer = window.setTimeout(function () {
        pendingRetryTimer = 0;
        if (token !== activeInitToken || !document.contains(video)) return;

        if (video.error) {
          window.initializeHeroVideo({ forceReload: true });
          return;
        }

        if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
          video.addEventListener('canplay', function onCanPlay() {
            video.removeEventListener('canplay', onCanPlay);
            tryPlay(video, token, attempt + 1);
          }, { once: true });
          return;
        }

        tryPlay(video, token, attempt + 1);
      }, Math.min(150 * Math.pow(1.5, attempt), 1200));
    });
  }

  function bindLifecycleEvents() {
    if (lifecycleBound) return;
    lifecycleBound = true;

    window.addEventListener('pageshow', function (event) {
      if (!isHomeActive()) return;

      var video = getVideo();
      if (!video) return;

      if (event.persisted || video.paused || video.readyState === 0 || video.classList.contains('hero-video--failed')) {
        window.initializeHeroVideo({ reason: 'pageshow' });
        return;
      }

      tryPlay(video, activeInitToken, 0);
    });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden || !isHomeActive()) return;

      var video = getVideo();
      if (!video) return;

      if (video.paused || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
        window.initializeHeroVideo({ reason: 'visibility' });
        return;
      }

      tryPlay(video, activeInitToken, 0);
    });
  }

  window.initializeHeroVideo = function initializeHeroVideo(options) {
    options = options || {};

    if (!isHomeActive()) return;

    var video = getVideo();
    if (!video) return;

    bindLifecycleEvents();
    clearPendingRetry();

    var token = ++activeInitToken;
    var forceReload = options.forceReload === true;
    var sourceChanged = ensureVideoSource(video);
    var needsLoad = forceReload || sourceChanged || !!video.error || video.readyState === 0;

    video.classList.remove('hero-video--failed');

    function startPlayback() {
      if (token !== activeInitToken || !document.contains(video)) return;
      tryPlay(video, token, 0);
    }

    function onVideoReady() {
      if (token !== activeInitToken) return;
      startPlayback();
    }

    if (needsLoad) {
      video.addEventListener('canplay', onVideoReady, { once: true });
      video.addEventListener('loadeddata', onVideoReady, { once: true });
      video.load();
      return;
    }

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      startPlayback();
      return;
    }

    video.addEventListener('canplay', onVideoReady, { once: true });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      if (isHomeActive()) {
        window.initializeHeroVideo({ reason: 'domready' });
      }
    });
  } else if (isHomeActive()) {
    window.initializeHeroVideo({ reason: 'domready' });
  }
})();
