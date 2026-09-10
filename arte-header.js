/* ==========================================================================
   arte 라이브러리 — 모바일 헤더 전체메뉴 토글 (5개 페이지 공통, GSAP 비의존)
   ========================================================================== */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var header = document.querySelector('.hd');
    if (!header) return;
    var btn = header.querySelector('.hd-btn > button.hd-icon');
    if (!btn) return;

    btn.setAttribute('aria-expanded', 'false');

    function closeMenu() {
      header.classList.remove('is-menu-open');
      btn.setAttribute('aria-expanded', 'false');
    }
    function openMenu() {
      header.classList.add('is-menu-open');
      btn.setAttribute('aria-expanded', 'true');
    }

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (header.classList.contains('is-menu-open')) closeMenu();
      else openMenu();
    });

    document.addEventListener('click', function (e) {
      if (!header.classList.contains('is-menu-open')) return;
      if (header.contains(e.target)) return;
      closeMenu();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });

    header.querySelectorAll('.gnb a, .hd-account a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 768) closeMenu();
    });
  });
})();
