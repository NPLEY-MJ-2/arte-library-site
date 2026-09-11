/* ==========================================================================
   arte 라이브러리 — 누리집 안내 · 공지/소식 상세 페이지 인터랙션
   기능 동작(스크랩 토글)만 처리한다. 화면 모션은 arte-motion.js 가 담당한다.
   ========================================================================== */
(function () {
  'use strict';

  var scrapBtn = document.querySelector('.ntv-scrap');
  if (!scrapBtn) return;

  scrapBtn.addEventListener('click', function () {
    var on = scrapBtn.getAttribute('aria-pressed') === 'true';
    scrapBtn.setAttribute('aria-pressed', String(!on));
  });
})();
