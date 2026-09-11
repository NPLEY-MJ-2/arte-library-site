/* ==========================================================================
   arte 라이브러리 — 사이트 공통 모션 (GSAP)
   범위: 사용자 승인 — 페이지 전환 + 스크롤 리빌까지 (tokens.md의 "모션 없음" 규칙에 대한
   이 프로젝트 한정 예외. 승인 근거는 projects/arte/CLAUDE.md 참조)

   모든 페이지 공통 로드: gsap.min.js, ScrollTrigger.min.js 다음에 이 파일을 defer로 로드.
   prefers-reduced-motion: reduce 인 경우 전 구간 모션을 끄고 최종 상태만 즉시 렌더한다.
   ========================================================================== */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (typeof gsap === 'undefined') return;
  if (!reduceMotion && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);

  /* --------------------------------------------------------------------
     1. 히어로 KV 등장 모션
     Figma get_motion_context 원본값(노드 19388:792 "Main KV - Search"):
       opacity 0→1, translateY 60px→0, 2s 타임라인 중 0~7.5% 홀드 후 42.5%까지
       cubic-bezier(0.16, 1, 0.3, 1) 로 도달 = 지연 0.15s + 지속 0.7s.
     GSAP 코어에는 커스텀 베지어 이징이 없어 가장 가까운 내장 이징(expo.out)으로 근사했다.
     -------------------------------------------------------------------- */
  function heroReveal() {
    var hero = document.querySelector('.hero');
    if (!hero) return;
    var targets = hero.querySelectorAll('.eyebrow, .display, .concept-copy, .search, .prompts');
    if (!targets.length) return;

    if (reduceMotion) {
      gsap.set(targets, { opacity: 1, y: 0 });
      return;
    }
    gsap.fromTo(
      targets,
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 0.7, delay: 0.15, ease: 'expo.out', stagger: 0.08 }
    );
  }

  /* --------------------------------------------------------------------
     2. 서브페이지 타이틀 등장 모션 (영상 · 추천)
     .title-reveal 스코프: 브레드크럼 + h1이 하→상 페이드로 등장하고,
     (있다면) 상단 분류 탭(.sub-tabs a)이 왼쪽부터 순차로 이어서 등장한 뒤,
     본문 영역(.sub-content)이 페이드인한다.
     -------------------------------------------------------------------- */
  function titleReveal() {
    var scopes = document.querySelectorAll('.title-reveal');
    if (!scopes.length) return;

    scopes.forEach(function (scope) {
      var titleTargets = [scope.querySelector('.crumb'), scope.querySelector('.sub-h1')].filter(Boolean);
      var tabs = scope.querySelectorAll('.sub-tabs a');
      var content = scope.nextElementSibling;

      if (reduceMotion) {
        gsap.set(titleTargets, { opacity: 1, y: 0 });
        if (tabs.length) gsap.set(tabs, { opacity: 1, y: 0 });
        if (content) gsap.set(content, { opacity: 1 });
        return;
      }

      var tl = gsap.timeline({ delay: 0.1 });
      tl.fromTo(titleTargets, { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out', stagger: 0.08 });

      if (tabs.length) {
        tl.fromTo(tabs, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out', stagger: 0.06 }, '-=0.25');
      }

      if (content) {
        gsap.set(content, { opacity: 0 });
        tl.to(content, { opacity: 1, duration: 0.5, ease: 'power1.out' }, '-=0.1');
      }
    });
  }

  /* --------------------------------------------------------------------
     3. 스크롤 리빌 — 섹션 헤드 + 카드형 컴포넌트
     -------------------------------------------------------------------- */
  function scrollReveal() {
    if (reduceMotion || typeof ScrollTrigger === 'undefined') return;

    var groupSelectors = [
      '.sec-head',
      '.rail .doc',
      '.books .book',
      '.region-row',
      '.reco-left > a',
      '.bookcur',
      '.bookcur-list > a',
      '.ev-card',
      '.notices li',
      '.linebox.grid-3 > .cell',
      '.stats-grid > .cell',
      '.res-card',
      '.filters > *'
    ];

    groupSelectors.forEach(function (sel) {
      var els = document.querySelectorAll(sel);
      if (!els.length) return;
      gsap.set(els, { opacity: 0, y: 24 });
      ScrollTrigger.batch(els, {
        start: 'top 88%',
        once: true,
        onEnter: function (batch) {
          gsap.to(batch, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.08 });
        }
      });
    });
  }

  /* --------------------------------------------------------------------
     4. 페이지 전환 — 사이트 내부 링크 클릭 시 페이드 아웃 후 이동, 도착 시 페이드 인
     -------------------------------------------------------------------- */
  function pageTransitions() {
    var overlay = document.createElement('div');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.style.cssText = [
      'position:fixed', 'inset:0', 'z-index:9999', 'background:#ffffff',
      'pointer-events:none', 'opacity:0'
    ].join(';');
    document.body.appendChild(overlay);

    if (reduceMotion) return;

    gsap.fromTo(overlay, { opacity: 1 }, { opacity: 0, duration: 0.3, ease: 'power1.out' });

    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href]');
      if (!a) return;
      var href = a.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      if (a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey) return;
      if (!href.endsWith('.html') && href.indexOf('.html#') === -1) return;

      e.preventDefault();
      overlay.style.pointerEvents = 'auto';
      gsap.fromTo(
        overlay,
        { opacity: 0 },
        {
          opacity: 1, duration: 0.28, ease: 'power1.in',
          onComplete: function () { window.location.href = href; }
        }
      );
    });

    window.addEventListener('pageshow', function (evt) {
      if (evt.persisted) {
        gsap.set(overlay, { opacity: 0, pointerEvents: 'none' });
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    heroReveal();
    titleReveal();
    scrollReveal();
    pageTransitions();
  });
})();
