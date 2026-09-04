/* ==========================================================================
   arte 라이브러리 — 지역별 정보 페이지 인터랙션
   tokens.md 모션 금지 준수: transition·animation 미사용. 상태 전환만 처리한다.
   ========================================================================== */
(function () {
  'use strict';

  /* ---- 분류 탭 (프로그램 / 운영단체 / 지역별 자료) ------------------------
     이 시안은 '프로그램' 데이터만 갖고 있어 목록 내용은 바뀌지 않는다.
     탭 선택 상태·타이틀·통계 강조만 함께 전환한다. */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.region-tabs [role="tab"]'));
  var introTitle = document.querySelector('.region-intro h2');
  var crumbCurrent = document.querySelector('.crumb strong');
  var stats = Array.prototype.slice.call(document.querySelectorAll('.region-stat'));

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.setAttribute('aria-selected', 'false'); });
      tab.setAttribute('aria-selected', 'true');

      var label = tab.textContent.trim();
      if (introTitle) introTitle.textContent = label;
      if (crumbCurrent) crumbCurrent.textContent = label;

      stats.forEach(function (s, si) { s.classList.toggle('region-stat--on', si === i); });
    });
  });

  /* ---- 필터 아코디언 ----------------------------------------------------- */
  document.querySelectorAll('.f-group-head').forEach(function (head) {
    head.addEventListener('click', function () {
      var open = head.getAttribute('aria-expanded') === 'true';
      head.setAttribute('aria-expanded', open ? 'false' : 'true');
      var icon = head.querySelector('svg');
      if (icon) icon.style.transform = open ? 'none' : 'rotate(180deg)';
    });
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

  /* ---- 정렬 (최신순 / 조회순) ------------------------------------------- */
  var sorts = document.querySelectorAll('.res-sort .s');
  sorts.forEach(function (btn) {
    btn.addEventListener('click', function () {
      sorts.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
      btn.setAttribute('aria-pressed', 'true');
    });
  });

  /* ---- 지도 핀 선택 상태 (시각 표시만, 실제 필터링 없음) ------------------ */
  document.querySelectorAll('.region-map [data-pin]').forEach(function (pin) {
    pin.addEventListener('click', function () {
      document.querySelectorAll('.region-map [data-pin]').forEach(function (p) {
        p.classList.remove('pin-active');
      });
      pin.classList.add('pin-active');
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
