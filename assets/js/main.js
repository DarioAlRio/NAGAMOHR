/* =========================================================================
   NAGAMOHR — Interacción del sitio
   Sin dependencias. Compatible con Safari 14+, Chrome, Firefox y Edge.
   ========================================================================= */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mqDesktop = window.matchMedia('(min-width: 61.25rem)');
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* ---------------------------------------------------------------- 1. HEADER */
  var header = $('.site-header');
  var progress = $('.progress');

  if (header) {
    var lastY = window.pageYOffset;
    var ticking = false;

    var onScroll = function () {
      var y = window.pageYOffset;
      var doc = document.documentElement;

      header.classList.toggle('is-stuck', y > 24);

      // Ocultar al bajar, mostrar al subir (solo si el menú móvil está cerrado)
      if (!document.body.classList.contains('nav-open')) {
        if (y > 320 && y > lastY + 6) header.classList.add('is-hidden');
        else if (y < lastY - 6 || y < 320) header.classList.remove('is-hidden');
      }
      lastY = y;

      if (progress) {
        var max = doc.scrollHeight - window.innerHeight;
        var p = max > 0 ? Math.min(y / max, 1) : 0;
        progress.style.transform = 'scaleX(' + p + ')';
      }

      var toTop = $('.to-top');
      if (toTop) toTop.classList.toggle('is-visible', y > 600);

      ticking = false;
    };

    var requestScroll = function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
    };
    window.addEventListener('scroll', requestScroll, { passive: true });
    onScroll();
  }

  /* -------------------------------------------------- 2. MEGA MENÚ (ESCRITORIO) */
  var navItems = $$('.nav-item.has-mega');
  var closeTimer = null;

  function closeAllMega(except) {
    navItems.forEach(function (item) {
      if (item === except) return;
      item.classList.remove('is-open');
      var t = $('.nav-link', item);
      if (t) t.setAttribute('aria-expanded', 'false');
    });
  }

  navItems.forEach(function (item) {
    var trigger = $('.nav-link', item);
    var panel = $('.mega', item);
    if (!trigger || !panel) return;

    var open = function () {
      window.clearTimeout(closeTimer);
      closeAllMega(item);
      item.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
    };
    var close = function (immediate) {
      window.clearTimeout(closeTimer);
      closeTimer = window.setTimeout(function () {
        item.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
      }, immediate ? 0 : 140);
    };

    item.addEventListener('mouseenter', function () { if (mqDesktop.matches) open(); });
    item.addEventListener('mouseleave', function () { if (mqDesktop.matches) close(); });

    trigger.addEventListener('click', function (e) {
      if (!mqDesktop.matches) return;
      e.preventDefault();
      if (item.classList.contains('is-open')) close(true); else open();
    });

    item.addEventListener('focusin', function () { if (mqDesktop.matches) open(); });
    item.addEventListener('focusout', function (e) {
      if (!mqDesktop.matches) return;
      if (!item.contains(e.relatedTarget)) close(true);
    });

    // Vista previa que cambia con el enlace enfocado
    var media = $$('.mega-media img', item);
    if (media.length) {
      $$('.mega-link', item).forEach(function (link) {
        var swap = function () {
          var key = link.getAttribute('data-preview');
          media.forEach(function (img) {
            img.classList.toggle('is-active', img.getAttribute('data-preview') === key);
          });
        };
        link.addEventListener('mouseenter', swap);
        link.addEventListener('focus', swap);
      });
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
      closeAllMega(null);
      closeLang();
      if (document.body.classList.contains('nav-open')) toggleMobile(false);
      closeLightbox();
    }
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-item.has-mega')) closeAllMega(null);
    if (!e.target.closest('.lang')) closeLang();
  });

  /* ------------------------------------------------------- 3. SELECTOR DE IDIOMA */
  var lang = $('.lang');
  var langBtn = lang ? $('.lang-btn', lang) : null;

  function closeLang() {
    if (lang) { lang.classList.remove('is-open'); if (langBtn) langBtn.setAttribute('aria-expanded', 'false'); }
  }
  if (lang && langBtn) {
    langBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = lang.classList.toggle('is-open');
      langBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* ------------------------------------------------------------ 4. MENÚ MÓVIL */
  var burger = $('.burger');
  var mobileNav = $('.mobile-nav');

  function toggleMobile(force) {
    var open = typeof force === 'boolean' ? force : !document.body.classList.contains('nav-open');
    document.body.classList.toggle('nav-open', open);
    if (burger) burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (mobileNav) mobileNav.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (open && header) header.classList.remove('is-hidden');
  }

  if (burger) burger.addEventListener('click', function () { toggleMobile(); });

  $$('.m-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.m-item');
      var open = !item.classList.contains('is-open');
      $$('.m-item.is-open').forEach(function (o) {
        if (o !== item) { o.classList.remove('is-open'); var b = $('.m-toggle', o); if (b) b.setAttribute('aria-expanded', 'false'); }
      });
      item.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  // Retardo escalonado de los ítems móviles
  $$('.mobile-nav .m-link, .mobile-nav .m-toggle').forEach(function (el, i) {
    el.style.setProperty('--d', (0.06 + i * 0.045).toFixed(3) + 's');
  });

  // Cerrar al navegar
  $$('.mobile-nav a').forEach(function (a) {
    a.addEventListener('click', function () { toggleMobile(false); });
  });

  mqDesktop.addEventListener
    ? mqDesktop.addEventListener('change', function (e) { if (e.matches) toggleMobile(false); })
    : mqDesktop.addListener(function (e) { if (e.matches) toggleMobile(false); });

  /* -------------------------------------------------------- 5. SLIDER DE PORTADA */
  var stage = $('.hero-stage');
  if (stage) {
    var slides = $$('.hero-slide', stage);
    var dots = $$('.hero-dot');
    var counter = $('.hero-count .now');
    var idx = 0;
    var timer = null;
    var DELAY = 6000;

    function show(n) {
      idx = (n + slides.length) % slides.length;
      slides.forEach(function (s, i) { s.classList.toggle('is-active', i === idx); });
      dots.forEach(function (d, i) {
        d.setAttribute('aria-selected', i === idx ? 'true' : 'false');
        // reinicia la animación de la barra
        if (i === idx) { d.style.animation = 'none'; void d.offsetWidth; d.style.animation = ''; }
      });
      if (counter) counter.textContent = String(idx + 1).padStart(2, '0');
    }
    function play() { if (reduced || slides.length < 2) return; stop(); timer = window.setInterval(function () { show(idx + 1); }, DELAY); }
    function stop() { if (timer) { window.clearInterval(timer); timer = null; } }

    dots.forEach(function (d, i) {
      d.addEventListener('click', function () { show(i); play(); });
    });

    stage.addEventListener('mouseenter', stop);
    stage.addEventListener('mouseleave', play);
    document.addEventListener('visibilitychange', function () { document.hidden ? stop() : play(); });

    // Deslizar en táctil
    var x0 = null;
    stage.addEventListener('touchstart', function (e) { x0 = e.changedTouches[0].clientX; stop(); }, { passive: true });
    stage.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 45) show(idx + (dx < 0 ? 1 : -1));
      x0 = null; play();
    }, { passive: true });

    show(0);
    play();
  }

  /* ------------------------------------------------------- 6. REVELADO AL SCROLL */
  var revealables = $$('[data-reveal]');
  if (revealables.length) {
    if (!('IntersectionObserver' in window) || reduced) {
      revealables.forEach(function (el) { el.classList.add('is-in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var delay = parseFloat(el.getAttribute('data-reveal')) || 0;
          el.style.transitionDelay = delay + 'ms';
          el.classList.add('is-in');
          io.unobserve(el);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      revealables.forEach(function (el) { io.observe(el); });
    }
  }

  /* ------------------------------------------------------------ 7. CONTADORES */
  var counters = $$('[data-count]');
  if (counters.length) {
    var run = function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var decimals = (el.getAttribute('data-decimals') | 0);
      if (reduced) { el.textContent = target.toLocaleString('es-ES', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }); return; }
      var dur = 1500, t0 = null;
      var step = function (ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min((ts - t0) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toLocaleString('es-ES', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
        if (p < 1) window.requestAnimationFrame(step);
      };
      window.requestAnimationFrame(step);
    };
    if (!('IntersectionObserver' in window)) {
      counters.forEach(run);
    } else {
      var co = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { run(en.target); co.unobserve(en.target); } });
      }, { threshold: 0.4 });
      counters.forEach(function (el) { co.observe(el); });
    }
  }

  /* -------------------------------------------------------------- 8. LIGHTBOX */
  var lb = $('.lightbox');
  var lbImg = lb ? $('.lightbox-img', lb) : null;
  var lbCap = lb ? $('.lightbox-cap', lb) : null;
  var group = [];
  var current = 0;
  var lastFocus = null;

  function openLightbox(items, i) {
    if (!lb) return;
    group = items; current = i; lastFocus = document.activeElement;
    render();
    lb.classList.add('is-open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    var c = $('.lb-close', lb); if (c) c.focus();
  }
  function render() {
    var it = group[current];
    if (!it || !lbImg) return;
    lbImg.src = it.src;
    lbImg.alt = it.alt || '';
    if (lbCap) lbCap.textContent = (it.alt || '') + '  ·  ' + (current + 1) + ' / ' + group.length;
  }
  function closeLightbox() {
    if (!lb || !lb.classList.contains('is-open')) return;
    lb.classList.remove('is-open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function step(n) { if (!group.length) return; current = (current + n + group.length) % group.length; render(); }

  $$('[data-gallery]').forEach(function (gal) {
    var shots = $$('.shot', gal);
    var items = shots.map(function (s) {
      var img = $('img', s);
      return { src: s.getAttribute('href') || (img && img.src), alt: (img && img.getAttribute('alt')) || '' };
    });
    shots.forEach(function (s, i) {
      s.addEventListener('click', function (e) { e.preventDefault(); openLightbox(items, i); });
    });
  });

  if (lb) {
    var cBtn = $('.lb-close', lb), pBtn = $('.lb-prev', lb), nBtn = $('.lb-next', lb);
    if (cBtn) cBtn.addEventListener('click', closeLightbox);
    if (pBtn) pBtn.addEventListener('click', function () { step(-1); });
    if (nBtn) nBtn.addEventListener('click', function () { step(1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLightbox(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });
    // Deslizar en el visor
    var lx = null;
    lb.addEventListener('touchstart', function (e) { lx = e.changedTouches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (lx === null) return;
      var dx = e.changedTouches[0].clientX - lx;
      if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
      lx = null;
    }, { passive: true });
  }

  /* ------------------------------------------------------- 9. AÑO EN EL PIE */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ------------------------------------------------ 10. FORMULARIO DE CONTACTO */
  var form = $('#form-contacto');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var lines = [];
      ['empresa', 'nombre', 'telefono', 'asunto', 'mensaje'].forEach(function (k) {
        var v = (data.get(k) || '').toString().trim();
        if (v) lines.push(k.charAt(0).toUpperCase() + k.slice(1) + ': ' + v);
      });
      var subject = 'Consulta web · ' + ((data.get('asunto') || 'Información general'));
      var body = lines.join('\n') + '\n\n— Enviado desde nagamohr.com';
      window.location.href = 'mailto:info@nagamohr.com?subject=' +
        encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      var note = $('.form-status', form);
      if (note) note.textContent = 'Abriendo tu gestor de correo con el mensaje preparado…';
    });
  }
})();
