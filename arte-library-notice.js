/* ==========================================================================
   arte 라이브러리 — 누리집 안내 · 공지/소식 목록 페이지 인터랙션
   기능 동작(검색조건 드롭다운·정렬·페이지네이션 상태)만 처리한다.
   화면 모션은 arte-motion.js 가 사이트 공통으로 담당한다.
   ========================================================================== */
(function () {
  'use strict';

  /* ---- 검색 조건 드롭다운 (전체 ▸ 하위 목록) ------------------------------ */
  document.querySelectorAll('.fil-dropdown').forEach(function (wrap) {
    var trigger = wrap.querySelector('.fil-select');
    var list = wrap.querySelector('.fil-dropdown-list');
    if (!trigger || !list) return;

    trigger.addEventListener('click', function () {
      var open = wrap.classList.contains('is-open');
      document.querySelectorAll('.fil-dropdown.is-open').forEach(function (w) {
        if (w !== wrap) { w.classList.remove('is-open'); w.querySelector('.fil-select').setAttribute('aria-expanded', 'false'); }
      });
      wrap.classList.toggle('is-open', !open);
      trigger.setAttribute('aria-expanded', String(!open));
    });

    list.querySelectorAll('.fil-dropdown-item').forEach(function (item) {
      item.addEventListener('click', function () {
        list.querySelectorAll('.fil-dropdown-item').forEach(function (i) {
          i.classList.remove('is-active');
          i.setAttribute('aria-selected', 'false');
        });
        item.classList.add('is-active');
        item.setAttribute('aria-selected', 'true');
        var label = trigger.querySelector('span');
        if (label) label.textContent = item.textContent;
        wrap.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', function (e) {
      if (wrap.classList.contains('is-open') && !wrap.contains(e.target)) {
        wrap.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
      }
    });
  });

  /* ---- 정렬 (최신순 / 조회순) -------------------------------------------- */
  var sortBtns = Array.prototype.slice.call(document.querySelectorAll('.lst-sort > button'));
  sortBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      sortBtns.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
      btn.setAttribute('aria-pressed', 'true');
    });
  });

  /* ---- 페이지네이션 ------------------------------------------------------ */
  var pages = Array.prototype.slice.call(document.querySelectorAll('.pager-nums button'));
  pages.forEach(function (btn) {
    btn.addEventListener('click', function () {
      pages.forEach(function (b) { b.removeAttribute('aria-current'); });
      btn.setAttribute('aria-current', 'page');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
})();
