/* ==========================================================================
   arte 라이브러리 — AI 검색 인터랙션
   main[data-state="initial|result"] 토글만 처리한다 (실제 검색/AI 로직 없음).
   화면 모션은 arte-motion.js 가 사이트 공통으로 담당한다.
   ========================================================================== */
(function () {
  'use strict';

  var main = document.getElementById('main');
  var form = document.getElementById('aiForm');
  var input = document.getElementById('aiInput');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (input && !input.value.trim()) input.value = '예술강사의 역할은 무엇인가요?';
      main.setAttribute('data-state', 'result');
    });
  }

  /* 홈 검색창에서 ?q= 로 넘어온 경우 바로 결과 상태로 */
  var q = new URLSearchParams(window.location.search).get('q');
  if (q && q.trim()) {
    if (input) input.value = q.trim();
    main.setAttribute('data-state', 'result');
  }

  /* 다시 생성 버튼 — 초기 상태로 되돌린다 */
  var action = document.querySelector('.ais-action');
  if (action) {
    action.addEventListener('click', function () {
      main.setAttribute('data-state', 'result');
    });
  }

  /* 탭 그룹 (AI 결과 분류 / 키워드 결과 분류) */
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
})();
