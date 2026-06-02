/* VAGOGLASS — Mobile nav toggler
 * @alex — mobile lead
 * Hamburger pentru viewport <768px. Toggles `.nav-open` on <body>.
 */
(function () {
  'use strict';

  function init() {
    var btn = document.querySelector('.nav-toggle');
    var links = document.querySelector('.nav-links');
    if (!btn || !links) return;

    // Ensure ARIA basics
    btn.setAttribute('aria-controls', 'primary-nav');
    btn.setAttribute('aria-expanded', 'false');
    links.setAttribute('id', 'primary-nav');

    function close() {
      document.body.classList.remove('nav-open');
      btn.setAttribute('aria-expanded', 'false');
    }
    function open() {
      document.body.classList.add('nav-open');
      btn.setAttribute('aria-expanded', 'true');
    }
    function toggle() {
      if (document.body.classList.contains('nav-open')) close();
      else open();
    }

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      toggle();
    });

    // Close on link click (in-page anchors)
    links.addEventListener('click', function (e) {
      var t = e.target;
      if (t && t.tagName === 'A') close();
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });

    // Close on resize back to desktop
    var mq = window.matchMedia('(min-width: 768px)');
    if (mq.addEventListener) {
      mq.addEventListener('change', function (e) { if (e.matches) close(); });
    } else if (mq.addListener) {
      mq.addListener(function (e) { if (e.matches) close(); });
    }

    // Click outside to close
    document.addEventListener('click', function (e) {
      if (!document.body.classList.contains('nav-open')) return;
      if (links.contains(e.target) || btn.contains(e.target)) return;
      close();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
