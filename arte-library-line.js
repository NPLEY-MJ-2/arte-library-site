/* ==========================================================================
   arte 라이브러리 — 방향 E 인터랙션
   tokens.md 모션 금지 준수: transition·animation 미사용, 스크롤도 instant 처리.
   기능 동작(캐러셀 이동·탭 전환·드래그)만 구현한다.
   ========================================================================== */
(function () {
  'use strict';

  /* ---- 캐러셀: 화살표 + 도트 -------------------------------------------- */
  document.querySelectorAll('[data-rail]').forEach(function (rail) {
    var track = rail.querySelector('[data-track]');
    if (!track) return;

    var prev = rail.querySelector('[data-prev]');
    var next = rail.querySelector('[data-next]');
    var dots = rail.querySelector('[data-dots]');

    function page() {
      return track.clientWidth;
    }

    function pageCount() {
      return Math.max(1, Math.ceil(track.scrollWidth / page()));
    }

    function currentPage() {
      return Math.round(track.scrollLeft / page());
    }

    function go(index) {
      track.scrollTo({ left: index * page(), behavior: 'instant' });
    }

    function syncArrows() {
      var max = track.scrollWidth - track.clientWidth - 1;
      if (prev) prev.disabled = track.scrollLeft <= 0;
      if (next) next.disabled = track.scrollLeft >= max;
    }

    function syncDots() {
      if (!dots) return;
      var active = currentPage();
      Array.prototype.forEach.call(dots.children, function (btn, i) {
        btn.setAttribute('aria-current', i === active ? 'true' : 'false');
      });
    }

    function buildDots() {
      if (!dots) return;
      dots.textContent = '';
      var total = pageCount();
      for (var i = 0; i < total; i++) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-label', total + '페이지 중 ' + (i + 1) + '페이지');
        btn.dataset.page = String(i);
        btn.addEventListener('click', function () {
          go(Number(this.dataset.page));
        });
        dots.appendChild(btn);
      }
      syncDots();
    }

    if (prev) prev.addEventListener('click', function () { go(currentPage() - 1); });
    if (next) next.addEventListener('click', function () { go(currentPage() + 1); });

    track.addEventListener('scroll', function () {
      syncArrows();
      syncDots();
    });

    window.addEventListener('resize', function () {
      buildDots();
      syncArrows();
    });

    buildDots();
    syncArrows();

    /* ---- 포인터 드래그 스크롤 ------------------------------------------- */
    var dragging = false;
    var startX = 0;
    var startLeft = 0;

    track.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      dragging = true;
      startX = e.clientX;
      startLeft = track.scrollLeft;
      track.setPointerCapture(e.pointerId);
    });

    track.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      track.scrollLeft = startLeft - (e.clientX - startX);
    });

    ['pointerup', 'pointercancel'].forEach(function (type) {
      track.addEventListener(type, function () { dragging = false; });
    });

    /* 드래그 직후의 의도치 않은 링크 클릭 차단 */
    track.addEventListener('click', function (e) {
      if (Math.abs(track.scrollLeft - startLeft) > 6) e.preventDefault();
    }, true);
  });

  /* ---- 탭 그룹 (문서 분류 / 북 큐레이션 월) ------------------------------ */
  document.querySelectorAll('[role="tablist"]').forEach(function (list) {
    var tabs = list.querySelectorAll('[role="tab"]');
    if (!tabs.length) return;

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.setAttribute('aria-selected', 'false'); });
        tab.setAttribute('aria-selected', 'true');
      });
    });

    /* 좌우 방향키 이동 (WCAG 키보드 접근성) */
    list.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      var arr = Array.prototype.slice.call(tabs);
      var i = arr.indexOf(document.activeElement);
      if (i < 0) return;
      e.preventDefault();
      var nextIndex = e.key === 'ArrowRight' ? (i + 1) % arr.length : (i - 1 + arr.length) % arr.length;
      arr[nextIndex].focus();
      arr[nextIndex].click();
    });
  });
})();
