/* ==========================================================================
   arte 라이브러리 — AI 검색 페이지 인터랙션
   tokens.md 모션 금지 준수: transition·animation 미사용. 상태 전환만 처리한다.
   실제 검색/AI 로직은 없다 — 제출 시 결과 상태(data-state="result")를 보여주는
   데모 수준의 상태 토글만 구현한다.
   ========================================================================== */
(function () {
  'use strict';

  var main = document.getElementById('main');
  var form = document.getElementById('aiForm');
  var input = document.getElementById('aiInput');

  function showResult(query) {
    if (query) input.value = query;
    if (!input.value.trim()) input.value = input.placeholder;
    main.setAttribute('data-state', 'result');
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      showResult();
    });
  }

  /* 예시 질문 칩 — 클릭 시 입력값 채우고 바로 결과 상태로 전환 */
  document.querySelectorAll('.prompts .chip[data-example]').forEach(function (chip) {
    chip.addEventListener('click', function () {
      showResult(chip.getAttribute('data-example'));
    });
  });

  /* ---- 탭 그룹 (AI 결과 분류 / 키워드 결과 분류) — 다른 페이지와 동일 패턴 ---- */
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
})();
