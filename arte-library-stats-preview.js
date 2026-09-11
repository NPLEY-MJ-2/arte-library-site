/* ==========================================================================
   arte 라이브러리 — 홈 "통계" 섹션 미리보기 차트
   Figma 'main'(20425:126638 PC / 20425:138866 모바일, 2026-09-11) 실측값 기반.
   arte-library-stats.js(통계 서브페이지)와는 별개 — 이 파일은 홈 미리보기 3종
   (행정통계 막대+꺾은선 / 조사통계 누적막대 / 자료통계 원그래프)만 그린다.
   ========================================================================== */

(function () {
  'use strict';

  var ADMIN = {
    color: '#173bff',
    max: 16000,
    steps: [16000, 14000, 12000, 10000, 8000, 6000, 4000, 2000, 0],
    points: [
      { year: '2010', value: 5087 },
      { year: '2011', value: 5412 },
      { year: '2012', value: 6116 },
      { year: '2013', value: 7484 },
      { year: '2014', value: 9882 },
      { year: '2015', value: 9032 },
      { year: '2016', value: 9527 },
      { year: '2017', value: 9422 },
      { year: '2018', value: 10196 },
      { year: '2019', value: 12164 },
      { year: '2020', value: 11666 },
      { year: '2021', value: 10681 },
      { year: '2022', value: 11098 },
      { year: '2023', value: 14049 },
      { year: '2024', value: 12577 },
      { year: '2025', value: 11994 },
      { year: "'26.2Q", value: 8487 }
    ]
  };

  var SURVEY = {
    colors: ['#173bff', '#007ade', '#39d1ff', '#80f4c2'],
    max: 100,
    steps: [100, 80, 60, 40, 20, 0],
    years: ['2021', '2022', '2023', '2024', '2025'],
    series: [
      [17, 10, 43, 15],
      [20, 12, 38, 18],
      [22, 14, 41, 16],
      [19, 11, 45, 14],
      [25, 13, 40, 17]
    ]
  };

  var PIE = [
    { label: '문서', value: 4793, color: '#007ade' },
    { label: '도서', value: 12374, color: '#eab308' },
    { label: '영상', value: 2063, color: '#16a34a' },
    { label: '추천', value: 6444, color: '#712eec' },
    { label: '지역별 정보', value: 6314, color: '#76aaff' }
  ];

  function el(tag, cls) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    return e;
  }

  function buildYAxis(steps) {
    var yaxis = el('div', 'pchart-yaxis');
    steps.forEach(function (s) {
      var d = el('div');
      d.textContent = s.toLocaleString();
      yaxis.appendChild(d);
    });
    return yaxis;
  }

  function buildGridlines(plot, steps, max) {
    steps.forEach(function (s) {
      var g = el('div', 'pchart-grid');
      g.style.top = (100 - (s / max) * 100) + '%';
      plot.appendChild(g);
    });
  }

  function buildXAxis(labels) {
    var xaxis = el('div', 'pchart-xaxis');
    labels.forEach(function (label) {
      var s = el('span');
      s.textContent = label;
      xaxis.appendChild(s);
    });
    return xaxis;
  }

  /* x축 라벨은 y축 폭만큼 왼쪽에 여백을 줘야 막대와 정렬된다(y축은 텍스트 길이에 따라
     폭이 가변적이라 고정 px로 맞출 수 없음) — .pchart-body의 gap도 함께 보정한다. */
  function alignXAxis(yaxis, xaxis) {
    var gap = 8;
    xaxis.style.paddingLeft = yaxis.getBoundingClientRect().width + gap + 'px';
  }

  function renderAdmin(root) {
    var chart = el('div', 'pchart');
    var body = el('div', 'pchart-body');
    var plot = el('div', 'pchart-plot');
    buildGridlines(plot, ADMIN.steps, ADMIN.max);

    var bars = el('div', 'pchart-bars');
    ADMIN.points.forEach(function (p) {
      var col = el('div', 'pchart-col');
      var bar = el('div', 'pchart-bar');
      bar.style.height = (p.value / ADMIN.max) * 100 + '%';
      col.appendChild(bar);
      bars.appendChild(col);
    });
    plot.appendChild(bars);

    var yaxis = buildYAxis(ADMIN.steps);
    var xaxis = buildXAxis(ADMIN.points.map(function (p) { return p.year; }));
    body.appendChild(yaxis);
    body.appendChild(plot);
    chart.appendChild(body);
    chart.appendChild(xaxis);
    root.appendChild(chart);
    alignXAxis(yaxis, xaxis);

    /* 선/점 오버레이는 레이아웃이 끝난 뒤 실제 픽셀 크기로 계산한다 — 퍼센트 viewBox로
       그리면 좁고 넓은 카드에서 선이 비율에 안 맞게 늘어나는 문제가 arte-library-stats.js
       개발 중 이미 한 번 발견됐다(같은 원인 재발 방지). */
    requestAnimationFrame(function () {
      var rect = bars.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      var n = ADMIN.points.length;
      var colW = rect.width / n;
      var svgNS = 'http://www.w3.org/2000/svg';
      var svg = document.createElementNS(svgNS, 'svg');
      svg.setAttribute('class', 'pchart-line');
      svg.setAttribute('width', rect.width);
      svg.setAttribute('height', rect.height);
      var d = '';
      var points = [];
      ADMIN.points.forEach(function (p, i) {
        var x = colW * (i + 0.5);
        var y = rect.height - (p.value / ADMIN.max) * rect.height;
        d += (i === 0 ? 'M' : 'L') + x + ',' + y + ' ';
        points.push({ x: x, y: y, value: p.value });
      });
      var path = document.createElementNS(svgNS, 'path');
      path.setAttribute('d', d.trim());
      svg.appendChild(path);
      points.forEach(function (pt) {
        var circle = document.createElementNS(svgNS, 'circle');
        circle.setAttribute('class', 'pchart-point');
        circle.setAttribute('cx', pt.x);
        circle.setAttribute('cy', pt.y);
        circle.setAttribute('r', 2);
        svg.appendChild(circle);
      });
      plot.appendChild(svg);

      /* 값 라벨은 겹치기 쉬워서(17개년) 3개마다 하나만 표시 — 실제 통계 페이지도
         카드 폭이 좁을 땐 값 표시를 생략하는 것과 같은 판단 */
      points.forEach(function (pt, i) {
        if (i % 3 !== 0 && i !== points.length - 1) return;
        var label = el('span', 'pchart-value');
        label.textContent = pt.value.toLocaleString();
        label.style.left = pt.x + 'px';
        label.style.top = pt.y + 'px';
        plot.appendChild(label);
      });
    });
  }

  function renderSurvey(root) {
    var chart = el('div', 'pchart');
    var body = el('div', 'pchart-body');
    var plot = el('div', 'pchart-plot');
    buildGridlines(plot, SURVEY.steps, SURVEY.max);

    var bars = el('div', 'pchart-bars');
    SURVEY.series.forEach(function (row) {
      var col = el('div', 'pchart-col');
      row.forEach(function (value, i) {
        var seg = el('div', 'pchart-seg');
        seg.style.height = (value / SURVEY.max) * 100 + '%';
        seg.style.background = SURVEY.colors[i];
        if (value >= 12) {
          var span = el('span');
          span.textContent = value;
          seg.appendChild(span);
        }
        col.appendChild(seg);
      });
      bars.appendChild(col);
    });
    plot.appendChild(bars);

    var yaxis = buildYAxis(SURVEY.steps);
    var xaxis = buildXAxis(SURVEY.years);
    body.appendChild(yaxis);
    body.appendChild(plot);
    chart.appendChild(body);
    chart.appendChild(xaxis);
    root.appendChild(chart);
    alignXAxis(yaxis, xaxis);
  }

  function renderPie(root) {
    var wrap = el('div', 'pchart-pie-wrap');
    var total = PIE.reduce(function (sum, d) { return sum + d.value; }, 0);
    var acc = 0;
    var stops = PIE.map(function (d) {
      var start = (acc / total) * 360;
      acc += d.value;
      var end = (acc / total) * 360;
      return d.color + ' ' + start + 'deg ' + end + 'deg';
    }).join(', ');

    var pie = el('div', 'pchart-pie');
    pie.style.background = 'conic-gradient(' + stops + ')';
    wrap.appendChild(pie);

    var legend = el('ul', 'pchart-legend');
    PIE.forEach(function (d) {
      var li = el('li');
      var dot = el('span', 'pchart-dot');
      dot.style.background = d.color;
      var b = el('b');
      b.textContent = d.label;
      li.appendChild(dot);
      li.appendChild(b);
      li.appendChild(document.createTextNode(' ' + d.value.toLocaleString()));
      legend.appendChild(li);
    });
    wrap.appendChild(legend);
    root.appendChild(wrap);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var renderers = { admin: renderAdmin, survey: renderSurvey, data: renderPie };
    document.querySelectorAll('[data-chart]').forEach(function (root) {
      var render = renderers[root.getAttribute('data-chart')];
      if (render) render(root);
    });
  });
})();
