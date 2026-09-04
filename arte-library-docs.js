/* ==========================================================================
   arte 라이브러리 — 아카이브·도서 목록 페이지 인터랙션
   기능 동작(필터 칩·아코디언·정렬·페이지네이션 상태)만 처리한다.
   화면 모션은 arte-motion.js 가 사이트 공통으로 담당한다.
   ========================================================================== */
(function () {
  'use strict';

  /* ---- 필터 아코디언 (장르 / 교육대상 / 자료유형 / 저작권자) -------------- */
  document.querySelectorAll('.fil-acc').forEach(function (head) {
    head.addEventListener('click', function () {
      var open = head.getAttribute('aria-expanded') === 'true';
      head.setAttribute('aria-expanded', open ? 'false' : 'true');
      var icon = head.querySelector('img');
      if (icon) icon.style.transform = open ? 'rotate(90deg)' : 'rotate(-90deg)';
    });
  });

  /* ---- 필터 칩 (중복 선택 가능 / '전체'는 배타) -------------------------- */
  document.querySelectorAll('.fil-chips').forEach(function (group) {
    var chips = Array.prototype.slice.call(group.querySelectorAll('button'));
    var all = chips[0];

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var on = chip.getAttribute('aria-pressed') === 'true';

        if (chip === all) {
          chips.forEach(function (c) { c.setAttribute('aria-pressed', c === all ? 'true' : 'false'); });
          return;
        }

        chip.setAttribute('aria-pressed', on ? 'false' : 'true');

        var anyOn = chips.slice(1).some(function (c) { return c.getAttribute('aria-pressed') === 'true'; });
        all.setAttribute('aria-pressed', anyOn ? 'false' : 'true');
      });
    });
  });

  /* ---- 주제 탭 (단일 선택) ----------------------------------------------- */
  document.querySelectorAll('[role="tablist"]').forEach(function (list) {
    var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
    if (!tabs.length) return;

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.setAttribute('aria-selected', 'false'); });
        tab.setAttribute('aria-selected', 'true');
      });
    });

    list.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      var i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      e.preventDefault();
      var n = e.key === 'ArrowRight' ? (i + 1) % tabs.length : (i - 1 + tabs.length) % tabs.length;
      tabs[n].focus();
      tabs[n].click();
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
