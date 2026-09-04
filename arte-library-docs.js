/* ==========================================================================
   arte 라이브러리 — 문서·도서 목록 페이지 인터랙션
   tokens.md 모션 금지 준수: transition·animation 미사용. 상태 전환만 처리한다.
   ========================================================================== */
(function () {
  'use strict';

  /* ---- 필터 아코디언 ----------------------------------------------------- */
  document.querySelectorAll('.f-group-head').forEach(function (head) {
    head.addEventListener('click', function () {
      var open = head.getAttribute('aria-expanded') === 'true';
      head.setAttribute('aria-expanded', open ? 'false' : 'true');
      var icon = head.querySelector('svg');
      if (icon) icon.style.transform = open ? 'none' : 'rotate(180deg)';
    });

    /* 초기 상태의 아이콘 방향 맞추기 */
    var icon = head.querySelector('svg');
    if (icon && head.getAttribute('aria-expanded') === 'true') {
      icon.style.transform = 'rotate(180deg)';
    }
  });

  /* ---- 필터 칩 (중복 선택 가능 / '전체'는 배타) -------------------------- */
  document.querySelectorAll('.f-chips').forEach(function (group) {
    var chips = Array.prototype.slice.call(group.querySelectorAll('.chip'));
    var all = chips[0];

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        if (chip === all) {
          chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c === all)); });
          return;
        }

        var on = chip.getAttribute('aria-pressed') === 'true';
        chip.setAttribute('aria-pressed', on ? 'false' : 'true');

        var anySelected = chips.some(function (c) {
          return c !== all && c.getAttribute('aria-pressed') === 'true';
        });
        all.setAttribute('aria-pressed', anySelected ? 'false' : 'true');
      });
    });
  });

  /* ---- 결과 상단 주제 탭 ------------------------------------------------- */
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
      var next = e.key === 'ArrowRight' ? (i + 1) % tabs.length : (i - 1 + tabs.length) % tabs.length;
      tabs[next].focus();
      tabs[next].click();
    });
  });

  /* ---- 정렬 (최신순 / 조회순) ------------------------------------------- */
  var sorts = document.querySelectorAll('.res-sort .s');
  sorts.forEach(function (btn) {
    btn.addEventListener('click', function () {
      sorts.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
      btn.setAttribute('aria-pressed', 'true');
    });
  });

  /* ---- 페이지네이션 ------------------------------------------------------ */
  var pager = document.querySelector('.pager');
  if (pager) {
    var pages = Array.prototype.slice.call(pager.querySelectorAll('button:not(.edge)'));
    pages.forEach(function (btn) {
      btn.addEventListener('click', function () {
        pages.forEach(function (b) { b.removeAttribute('aria-current'); });
        btn.setAttribute('aria-current', 'page');
        syncEdges();
      });
    });

    function currentIndex() {
      return pages.findIndex(function (b) { return b.getAttribute('aria-current') === 'page'; });
    }

    function syncEdges() {
      var i = currentIndex();
      var edges = pager.querySelectorAll('.edge');
      edges[0].disabled = edges[1].disabled = i <= 0;
      edges[2].disabled = edges[3].disabled = i >= pages.length - 1;
    }

    var edgeBtns = Array.prototype.slice.call(pager.querySelectorAll('.edge'));
    edgeBtns.forEach(function (btn, idx) {
      btn.addEventListener('click', function () {
        var i = currentIndex();
        var target = idx === 0 ? 0
          : idx === 1 ? Math.max(0, i - 1)
          : idx === 2 ? Math.min(pages.length - 1, i + 1)
          : pages.length - 1;
        pages[target].click();
      });
    });

    syncEdges();
  }
})();
