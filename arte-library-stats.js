/* ==========================================================================
   arte 라이브러리 — 통계 페이지 전용
   Figma 통계 확정본(fileKey MggyO8qQHuiYJRDenEWqlL, Section 1/2, 2026-09-08 확정) 기반 재구현.
   행정통계(4항목) · 조사통계(6항목) · 자료통계 3개 탭, 항목 클릭 시 콘텐츠 전환 + GSAP 스택 리빌.
   ========================================================================== */

(function () {
  'use strict';

  var PALETTE = ['#007ade', '#ff2268', '#eab308', '#22c55e', '#8b5cf6'];
  var BLUE_ONLY = ['#007ade'];
  var YEAR_LEGEND = ['2021년', '2022년', '2023년', '2024년', '2025년'];
  var CAT_COLOR = { 강사수: '#007ade', 수혜자수: '#ed1a3c', 예산: '#eab308', 지원기관수: '#22c55e' };

  /* --------------------------------------------------------------------
     1. 데이터 — Figma에서 실측 추출한 값(강사수/수혜자수/예산/지원기관수, 자료통계 KPI·차트)과
        PDF 예시값 기반 데이터(조사통계 5개 항목)를 함께 둔다.
        실측이 아닌 항목은 각 데이터 객체에 approximate:true 로 표시한다.
     -------------------------------------------------------------------- */

  var ADMIN_YEARS = ['2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026 1분기'];

  var ADMIN = {
    items: [
      {
        id: 'lecturers', label: '강사 수', icon: 'person', kpiUnit: '(명)', kpiValue: '169,635', color: CAT_COLOR.강사수, unit: '(단위: 명)', scaleMax: 16000,
        values: [3086, 4091, 5087, 5412, 6116, 7494, 9883, 9032, 9527, 9422, 10194, 12164, 11666, 10681, 11093, 14049, 12577, 11994, 6071]
      },
      {
        id: 'beneficiaries', label: '수혜자 수', icon: 'heart', kpiUnit: '(명)', kpiValue: '44,017,237', color: CAT_COLOR.수혜자수, unit: '(단위: 명)', scaleMax: 3500000,
        values: [1202514, 1574022, 1798883, 1916201, 1984637, 2317039, 2698324, 2805866, 3079609, 2620112, 2698324, 2727654, 2561453, 2874302, 2678771, 3108939, 2424581, 1867318, 1065642]
      },
      {
        id: 'budget', label: '예산', icon: 'piggy', kpiUnit: '(백만원)', kpiValue: '2,178,013', color: CAT_COLOR.예산, unit: '(단위: 백만원)', scaleMax: 160000,
        values: [37542, 67486, 75978, 77765, 88939, 117989, 135866, 132737, 147933, 146592, 150168, 147039, 136760, 132291, 125140, 121564, 91173, 98324, 146592]
      },
      {
        id: 'orgs', label: '지원기관 수', icon: 'building', kpiUnit: '(개)', kpiValue: '190,986', color: CAT_COLOR.지원기관수, unit: '(단위: 개)', scaleMax: 14000,
        values: [4419, 5592, 6687, 6765, 7939, 9659, 10676, 11223, 12788, 12201, 11849, 12749, 12592, 13179, 11419, 11966, 10128, 10089, 8994]
      }
    ]
  };

  var SURVEY = {
    items: [
      {
        id: 'rate', label: '문화예술교육 참여율', approximate: true,
        charts: [
          { title: '문화예술교육 참여율', subtitle: '전체', unit: '(단위:%)', cats: ['2021', '2022', '2023', '2024', '2025'], series: [[22], [16], [28], [28], [28]], colors: BLUE_ONLY, scaleMax: 40 },
          { title: '참여율', subtitle: '성별', unit: '(단위:%)', cats: ['남성', '여성'], series: [[15.4, 22.9], [13, 22.5], [15.8, 26.1], [16.2, 26.3], [16.2, 26.3]], legend: YEAR_LEGEND, colors: PALETTE, scaleMax: 30 },
          { title: '참여율', subtitle: '생애주기별', unit: '(단위:%)', cats: ['아동', '청소년', '성인', '중장년', '노년'], series: [[63.6, 9.3, 6.9, 9.1, 9], [70.9, 25.6, 8.9, 6.7, 9.5], [72.1, 27.6, 10.8, 8.2, 9.9], [65.1, 29.1, 12, 8.7, 11.6], [65.1, 29.1, 12, 8.7, 11.6]], legend: YEAR_LEGEND, colors: PALETTE, scaleMax: 80 },
          { title: '참여율', subtitle: '분야별', unit: '(단위:%)', cats: ['음악', '미술', '문학', '연극/뮤지컬', '무용', '영화', '공예', '사진/디자인', '전통예술', '기타'], series: [[38.3, 24.5, 4.3, 2.5, 2.1, 1, 1.3, 2.3, 1, 2], [39.7, 26.5, 8.9, 3.7, 1.9, 3.9, 1.9, 1.1, 1.1, 2.5], [35.9, 29.1, 7.5, 4.5, 4.5, 2.8, 2.7, 2.5, 1.9, 1.2], [37.3, 27.8, 6.7, 4.2, 2.3, 1.5, 2.5, 1.9, 0.5, 1], [37.3, 27.8, 6.7, 4.2, 2.3, 1.5, 2.5, 1.9, 0.5, 1]], legend: YEAR_LEGEND, colors: PALETTE, scaleMax: 60 }
        ]
      },
      {
        id: 'time-cost', label: '문화예술교육 참여 시간 및 비용',
        charts: [
          { title: '연간 참여 시간', unit: '(단위:시간)', cats: ['2021년', '2022년', '2023년', '2024년', '2025년'], series: [[78.5], [89.8], [64.5], [61.6], [61.6]], colors: BLUE_ONLY, scaleMax: 100, showValues: true },
          { title: '연간 참여 비용', unit: '(단위:만원)', cats: ['2021년', '2022년', '2023년', '2024년', '2025년'], series: [[61.4], [53.5], [46.2], [44.7], [44.7]], colors: BLUE_ONLY, scaleMax: 100, showValues: true }
        ]
      },
      {
        id: 'interest-satisfaction', label: '문화예술교육 관심도 및 만족도',
        charts: [
          { title: '관심도', subtitle: '참여자', unit: '(단위:%)', cats: ['매우 그렇다', '대체로 그렇다', '보통', '대체로 아니다', '전혀 아니다'], series: [[35, 40, 15, 6, 4], [33, 39, 15, 6, 4], [32, 38, 15, 6, 4], [31, 37, 15, 6, 4], [30, 36, 15, 6, 4]], legend: YEAR_LEGEND, colors: PALETTE, scaleMax: 100 },
          { title: '만족도', unit: '(단위:%)', cats: ['매우 만족', '대체로 만족', '보통', '대체로 불만족', '매우 불만족'], series: [[38, 42, 13, 5, 2], [36, 41, 13, 5, 2], [35, 40, 14, 5, 2], [34, 39, 15, 5, 2], [33, 38, 16, 5, 2]], legend: YEAR_LEGEND, colors: PALETTE, scaleMax: 100 }
        ]
      },
      {
        id: 'motivation', label: '문화예술교육 참여 동기',
        charts: [
          { title: '학교문화예술교육(정규교과/전공과정 외) 참여동기', subtitle: '복수응답', unit: '(단위:%)', cats: ['개인의 즐거움', '교양함양및지식습득', '진로직업직무능력개발', '친목도모', '추천혹은독려'], series: [[78, 65, 35, 42, 25], [75, 63, 33, 40, 24], [72, 60, 31, 38, 23], [70, 58, 30, 37, 22], [68, 56, 28, 36, 21]], legend: YEAR_LEGEND, colors: PALETTE, scaleMax: 100 },
          { title: '사회문화예술교육 참여동기', subtitle: '복수응답', unit: '(단위:%)', cats: ['개인의 즐거움', '교양함양및지식습득', '건강관리', '친목도모', '추천혹은독려', '진로직업직무능력개발'], series: [[80, 60, 55, 48, 22, 20], [78, 58, 54, 47, 21, 19], [76, 57, 52, 46, 20, 18], [74, 56, 51, 45, 19, 17], [73, 55, 50, 44, 18, 16]], legend: YEAR_LEGEND, colors: PALETTE, scaleMax: 100 }
        ]
      },
      {
        id: 'non-participation', label: '문화예술교육 미참여 이유',
        charts: [
          { title: '문화예술교육 미참여 이유', subtitle: '복수응답', unit: '(단위:%)', cats: ['시간이 없어서', '프로그램이 없어서', '정보가 부족해서', '동기,자신감 부족', '시설이 없어서'], series: [[72, 58, 45, 38, 30], [70, 57, 44, 37, 29], [68, 56, 43, 36, 28], [67, 55, 42, 35, 27], [66, 54, 41, 34, 26]], legend: YEAR_LEGEND, colors: PALETTE, scaleMax: 100 }
        ]
      },
      {
        id: 'future', label: '향후 문화예술교육 참여 관련',
        charts: [
          { title: '향후 문화예술교육 참여 의향률 및 비용지불 의향률', unit: '(단위:%)', cats: ['향후 참여 의향률', '향후 비용지불 의향률'], series: [[22.8, 18.2], [24.5, 19.5], [26.1, 20.8], [27.8, 22.1], [29.4, 23.4]], legend: YEAR_LEGEND, colors: PALETTE, scaleMax: 40, transpose: true },
          { title: '향후 참여 희망 분야', subtitle: '복수응답', unit: '(단위:%)', cats: ['생활문화예술', '전통예술', '시각예술', '공연예술', '디자인·공예', '문학'], series: [[38, 22, 18, 15, 12, 8], [36, 21, 17, 15, 12, 8], [35, 20, 17, 14, 11, 7], [34, 20, 16, 14, 11, 7], [33, 19, 16, 13, 10, 7]], legend: YEAR_LEGEND, colors: PALETTE, scaleMax: 60 },
          { title: '향후 문화예술교육 활성화를 위해 정부가 노력해야 할 사항', subtitle: '복수응답', unit: '(단위:%)', cats: ['교육비 지원 확대', '프로그램 다양화', '접근성 개선(장소,시간)', '정보제공 확대', '강사 전문성 강화'], series: [[52, 45, 38, 30, 25], [50, 44, 37, 29, 24], [49, 43, 36, 28, 24], [48, 42, 35, 28, 23], [46, 41, 34, 27, 22]], legend: YEAR_LEGEND, colors: PALETTE, scaleMax: 60 }
        ]
      }
    ]
  };

  var ICONS = {
    file: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
    video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 8a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z"/><path d="M15 10l6-3v10l-6-3"/></svg>',
    thumb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88z"/></svg>',
    globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
    person: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 21s-7.5-4.6-10-9C.5 8.5 2 4 6.2 4c2.1 0 3.5 1.2 4.3 2.4C11.3 5.2 12.7 4 14.8 4 19 4 20.5 8.5 22 12c-2.5 4.4-10 9-10 9z"/></svg>',
    piggy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 10a4 4 0 0 1 4-4h6a5 5 0 0 1 5 5v1l2 2-2 1v2a2 2 0 0 1-2 2h-1v2h-2v-2H9v2H7v-2a4 4 0 0 1-4-4v-2z"/><circle cx="8" cy="12" r=".8" fill="currentColor" stroke="none"/></svg>',
    building: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="3" width="12" height="18"/><path d="M16 8h4v13h-4"/><path d="M8 7h1M11 7h1M8 11h1M11 11h1M8 15h1M11 15h1"/></svg>'
  };

  var DATA = {
    kpi: [
      { icon: 'file', label: '문서', unit: '', value: '4,793' },
      { icon: 'book', label: '도서', unit: '', value: '12,374' },
      { icon: 'video', label: '영상', unit: '', value: '2,063' },
      { icon: 'thumb', label: '추천', unit: '', value: '6,444' },
      { icon: 'globe', label: '지역별 정보', unit: '', value: '6,314' }
    ],
    charts: [
      { title: '추천 전체', unit: '(단위: 건)', color: '#8b5cf6', cats: ['주제별큐레이션', '프로그램아카이브', '최신인기자료', '북큐레이션', '추천도서'], values: [137, 137, 137, 137, 137], scaleMax: 200 },
      { title: '지역별 정보 전체', unit: '(단위: 건)', color: '#ff2268', cats: ['프로그램', '운영단체', '지역별자료'], values: [3095, 1441, 1778], scaleMax: 4000 }
    ]
  };

  /* --------------------------------------------------------------------
     2. DOM 빌더
     -------------------------------------------------------------------- */

  function el(tag, cls) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    return e;
  }
  function txt(tag, cls, text) {
    var e = el(tag, cls);
    e.textContent = text;
    return e;
  }

  function buildBarChart(cfg) {
    var cats = cfg.cats;
    var seriesData = cfg.series ? (cfg.transpose ? transpose(cfg.series) : cfg.series) : cats.map(function (_, i) { return [cfg.values[i]]; });
    var colors = cfg.colors || [cfg.color || PALETTE[0]];
    var scaleMax = cfg.scaleMax;

    var card = el('div', 'chart-card');

    var head = el('div', 'chart-head');
    var titleWrap = el('span', 'chart-title-wrap');
    titleWrap.appendChild(txt('span', 'chart-title', cfg.title));
    if (cfg.subtitle) titleWrap.appendChild(txt('span', 'chart-subtitle', cfg.subtitle));
    head.appendChild(titleWrap);
    head.appendChild(txt('span', 'chart-unit', cfg.unit));
    card.appendChild(head);

    if (cfg.legend) {
      var legendRow = el('div', 'chart-legend');
      cfg.legend.forEach(function (lb, i) {
        var chip = el('span', 'legend-chip');
        var dot = el('i', 'legend-dot');
        dot.style.background = colors[i % colors.length];
        chip.appendChild(dot);
        chip.appendChild(document.createTextNode(lb));
        legendRow.appendChild(chip);
      });
      card.appendChild(legendRow);
    }

    var body = el('div', cfg.wide ? 'chart-body chart-body--wide' : 'chart-body');

    var yAxis = el('div', 'chart-yaxis');
    var steps = 4;
    for (var i = steps; i >= 0; i--) {
      yAxis.appendChild(txt('span', 'yaxis-label', i === 0 ? '0' : String(Math.round((scaleMax * i) / steps))));
    }
    body.appendChild(yAxis);

    var plotWrap = el('div', 'chart-plot-wrap');
    var plot = el('div', 'chart-plot');
    for (var g = 0; g <= steps; g++) {
      var gl = el('div', 'gridline');
      gl.style.bottom = (g / steps) * 100 + '%';
      plot.appendChild(gl);
    }
    var barsRow = el('div', 'chart-bars');
    cats.forEach(function (cat, ci) {
      var cluster = el('div', 'bar-cluster');
      (seriesData[ci] || []).forEach(function (val, si) {
        var col = el('div', 'bar-col');
        if (cfg.showValues) col.appendChild(txt('span', 'bar-value', formatNum(val)));
        var bar = el('div', 'bar');
        bar.style.height = Math.max((val / scaleMax) * 100, 0) + '%';
        bar.style.background = colors[si % colors.length];
        col.appendChild(bar);
        cluster.appendChild(col);
      });
      barsRow.appendChild(cluster);
    });
    plot.appendChild(barsRow);
    plotWrap.appendChild(plot);
    body.appendChild(plotWrap);
    card.appendChild(body);

    var xRow = el('div', 'chart-xaxis');
    xRow.appendChild(el('span', 'xaxis-spacer'));
    var xCells = el('div', 'xaxis-cells');
    cats.forEach(function (cat) {
      xCells.appendChild(txt('span', 'xaxis-label', cat));
    });
    xRow.appendChild(xCells);
    card.appendChild(xRow);

    return card;
  }

  function transpose(matrix) {
    var out = [];
    var cols = matrix[0].length;
    for (var c = 0; c < cols; c++) {
      out.push(matrix.map(function (row) { return row[c]; }));
    }
    return out;
  }
  function formatNum(v) {
    return (Math.round(v * 10) / 10).toString();
  }

  function buildKpiCard(item, activeId) {
    var isActive = item.id === activeId;
    var card = el('a', 'kpi-card' + (isActive ? ' is-active' : ''));
    card.href = '#' + item.id;
    if (isActive) card.style.background = item.color;
    else card.style.setProperty('--kpi-color', item.color);

    var icon = el('span', 'kpi-icon');
    icon.innerHTML = ICONS[item.icon] || '';
    card.appendChild(icon);

    var stack = el('span', 'kpi-stack');
    stack.appendChild(txt('span', 'kpi-label', item.label + ' ' + item.unit));
    stack.appendChild(txt('strong', 'kpi-value', item.value));
    card.appendChild(stack);
    return card;
  }

  function buildDataKpiCard(d, i) {
    var card = el('div', 'data-kpi-card' + (i === 0 ? ' is-active' : ''));
    var icon = el('span', 'data-kpi-icon');
    icon.innerHTML = ICONS[d.icon] || '';
    card.appendChild(icon);
    var body = el('div', 'data-kpi-body');
    body.appendChild(txt('span', 'data-kpi-label', d.label));
    body.appendChild(txt('strong', 'data-kpi-value', d.value));
    card.appendChild(body);
    return card;
  }

  /* --------------------------------------------------------------------
     3. 탭/항목 전환 렌더링
     -------------------------------------------------------------------- */

  var root = document.getElementById('stats-root');
  if (!root) return;

  var state = { tab: 'admin', adminItem: 'lecturers', surveyItem: 'rate' };

  function renderShell() {
    root.innerHTML = '';

    var tabRow = el('div', 'stat-tabs');
    [['admin', '행정통계'], ['survey', '조사통계'], ['data', '자료통계']].forEach(function (t) {
      var b = txt('button', 'stat-tab' + (state.tab === t[0] ? ' is-active' : ''), t[1]);
      b.type = 'button';
      b.addEventListener('click', function () {
        if (state.tab === t[0]) return;
        state.tab = t[0];
        renderShell();
      });
      tabRow.appendChild(b);
    });
    root.appendChild(tabRow);

    var descEl = txt('p', 'stat-desc', descFor(state.tab));
    root.appendChild(descEl);
    root.appendChild(el('div', 'stat-divider'));

    var main = el('div', 'stat-main' + (state.tab === 'data' ? ' stat-main--full' : ''));

    if (state.tab !== 'data') {
      main.appendChild(buildNav());
    }
    main.appendChild(buildContent());
    root.appendChild(main);

    revealStack(root.querySelectorAll('.chart-card, .kpi-card, .data-kpi-card'));
  }

  function descFor(tab) {
    if (tab === 'admin') return '연도별 문화예술교육 강사수, 수혜자수, 예산, 지원기관 수 통계 정보를 제공합니다.';
    if (tab === 'survey') return '우리나라 국민의 문화예술교육에 대한 수요, 인식, 참여 현황을 조사한 통계 정보를 제공합니다.';
    return '한국문화예술교육진흥원의 사업단위별 통계 정보를 제공합니다.';
  }

  function buildNav() {
    var nav = el('aside', 'stat-nav');
    var items = state.tab === 'admin' ? ADMIN.items : SURVEY.items;
    var activeId = state.tab === 'admin' ? state.adminItem : state.surveyItem;
    var activeItem = items.filter(function (it) { return it.id === activeId; })[0] || items[0];

    nav.appendChild(txt('p', 'stat-nav-label', '항목'));

    var dropdown = el('div', 'stat-nav-dropdown');

    var current = el('button', 'stat-nav-current');
    current.type = 'button';
    current.appendChild(txt('span', '', activeItem.label));
    current.appendChild(chevronSvg());
    current.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
    dropdown.appendChild(current);

    var list = el('div', 'stat-nav-list');
    items.forEach(function (it) {
      var b = txt('button', 'stat-nav-item' + (it.id === activeId ? ' is-active' : ''), it.label);
      b.type = 'button';
      b.addEventListener('click', function () {
        if (state.tab === 'admin') state.adminItem = it.id; else state.surveyItem = it.id;
        nav.classList.remove('is-open');
        renderShell();
      });
      list.appendChild(b);
    });
    dropdown.appendChild(list);
    nav.appendChild(dropdown);

    nav.appendChild(txt('p', 'stat-nav-label', '기간'));
    var periodRow = el('div', 'stat-period-row');
    ['2021년', '2025년'].forEach(function (v, i) {
      if (i === 1) periodRow.appendChild(el('span', 'stat-period-divider'));
      var f = el('button', 'stat-field');
      f.type = 'button';
      f.appendChild(txt('span', '', v));
      f.appendChild(chevronSvg());
      periodRow.appendChild(f);
    });
    nav.appendChild(periodRow);

    if (state.tab === 'admin') {
      var qtr = el('button', 'stat-field stat-field--full');
      qtr.type = 'button';
      qtr.appendChild(txt('span', '', '1분기'));
      qtr.appendChild(chevronSvg());
      nav.appendChild(qtr);
    }

    var btn = txt('button', 'stat-search-btn', '조회하기');
    btn.type = 'button';
    nav.appendChild(btn);

    return nav;
  }

  function chevronSvg() {
    var span = el('span', 'chevron-icon');
    span.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    return span;
  }

  function buildContent() {
    if (state.tab === 'admin') {
      var col = el('div', 'stat-content-col');
      var kpiRow = el('div', 'kpi-row');
      ADMIN.items.forEach(function (it) {
        kpiRow.appendChild(buildKpiCard({ id: it.id, label: it.label, unit: it.kpiUnit, value: it.kpiValue, color: it.color, icon: it.icon }, state.adminItem));
      });
      col.appendChild(kpiRow);
      var active = ADMIN.items.filter(function (it) { return it.id === state.adminItem; })[0];
      col.appendChild(buildAdminChart(active));
      return col;
    }
    if (state.tab === 'survey') {
      var col2 = el('div', 'stat-content-col');
      var active2 = SURVEY.items.filter(function (it) { return it.id === state.surveyItem; })[0];
      active2.charts.forEach(function (c) { col2.appendChild(buildBarChart(c)); });
      return col2;
    }
    // data tab
    var wrap = el('div', 'stat-content-col stat-content-col--full');
    var kpiRow2 = el('div', 'data-kpi-row');
    DATA.kpi.forEach(function (d, i) { kpiRow2.appendChild(buildDataKpiCard(d, i)); });
    wrap.appendChild(kpiRow2);
    var chartsRow = el('div', 'data-charts-row');
    DATA.charts.forEach(function (c) {
      chartsRow.appendChild(buildBarChart({ title: c.title, unit: c.unit, cats: c.cats, values: c.values, color: c.color, scaleMax: c.scaleMax, showValues: true }));
    });
    wrap.appendChild(chartsRow);
    return wrap;
  }

  function buildAdminChart(item) {
    var wrap = el('div', 'admin-chart-scroll');
    var chart = buildBarChart({
      title: item.label, unit: item.unit, cats: ADMIN_YEARS,
      values: item.values, color: item.color, scaleMax: item.scaleMax
    });
    chart.classList.add('chart-card--admin');
    wrap.appendChild(chart);
    return wrap;
  }

  /* --------------------------------------------------------------------
     4. GSAP 스택 리빌 — 위에서부터 순서대로 착착 나타남
     -------------------------------------------------------------------- */

  function revealStack(nodeList) {
    var nodes = Array.prototype.slice.call(nodeList);
    if (!nodes.length) return;
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || typeof gsap === 'undefined') {
      nodes.forEach(function (n) { n.style.opacity = 1; n.style.transform = 'none'; });
      return;
    }
    gsap.killTweensOf(nodes);
    gsap.fromTo(
      nodes,
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out', stagger: 0.09, clearProps: 'transform' }
    );
  }

  document.addEventListener('DOMContentLoaded', renderShell);
})();
