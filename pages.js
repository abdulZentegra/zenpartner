// ═══════════════════════════════════════════════════════════════════════════
// ZenPartner — page renderers  (window.ZPPages)
// Every page below is rendered from live Creator records (or the demo store)
// through ZPData, so no screen keeps hard-coded sample values.
// ═══════════════════════════════════════════════════════════════════════════

(function (global) {
  'use strict';

  const $ = function (sel, root) { return (root || document).querySelector(sel); };
  const $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  function Z() { return global.ZohoAPI; }
  function D() { return global.ZPData; }
  function UI() { return (global.ZPApp && global.ZPApp.ui) || {}; }
  function esc(s) { return Z().esc(s); }
  function field(r, n, f) { return Z().field(r, n, f); }
  function pill(s) { return UI().pill ? UI().pill(s) : esc(s); }
  function empty(t, b) { return UI().emptyState ? UI().emptyState(t, b) : '<div class="text-muted small">' + esc(t) + '</div>'; }

  function card(inner, cls) { return '<div class="zp-card ' + (cls || 'p-4') + '">' + inner + '</div>'; }

  function head(title, right) {
    return '<div class="zp-card-head"><h3 class="zp-card-title">' + title + '</h3>' + (right || '') + '</div>';
  }

  function statCard(label, value, sub, tint, icon) {
    return '<div class="col"><div class="zp-card zp-card--hover zp-stat">' +
      '<div class="zp-stat-top"><div class="zp-stat-label">' + esc(label) + '</div>' +
      '<span class="zp-stat-icon ' + tint + '"><i class="fa-solid ' + icon + '"></i></span></div>' +
      '<div class="zp-stat-value">' + value + '</div>' +
      '<div class="zp-stat-delta"><span class="muted">' + sub + '</span></div></div></div>';
  }

  function miniStat(label, value, sub) {
    return '<div class="col"><div class="zp-card zp-card--hover p-3"><div class="text-muted fw-semibold" style="font-size:.7rem">' + esc(label) + '</div>' +
      '<div class="fs-4 fw-bold mt-1">' + value + '</div>' +
      '<div class="text-muted" style="font-size:.68rem">' + sub + '</div></div></div>';
  }

  function sourceNote(text) {
    return '<div class="text-muted d-flex align-items-center gap-2 mt-2" style="font-size:.66rem">' +
      '<i class="fa-solid fa-database"></i><span>' + text + '</span></div>';
  }

  function lineChart(series, colors, height, labels) {
    const d = D();
    const w = 700;
    const h = height || 160;
    const grid = [0.25, 0.5, 0.75, 1].map(function (g) {
      return '<line x1="0" y1="' + (h * g).toFixed(0) + '" x2="' + w + '" y2="' + (h * g).toFixed(0) + '" stroke="#f1f5f9"/>';
    }).join('');
    const lines = series.map(function (vals, i) {
      return '<polyline fill="none" stroke="' + colors[i % colors.length] + '" stroke-width="1.8" stroke-linejoin="round" points="' + d.linePoints(vals, w, h, 8) + '"/>';
    }).join('');
    const axis = labels ? '<div class="d-flex justify-content-between text-muted mt-1" style="font-size:.6rem">' +
      labels.map(function (l) { return '<span>' + esc(l) + '</span>'; }).join('') + '</div>' : '';
    return '<div class="zp-chart mt-3" style="height:' + h + 'px"><svg viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" style="height:100%;width:100%">' +
      grid + lines + '</svg></div>' + axis;
  }

  function barRow(label, count, total, color, valueText) {
    const w = total ? Math.round((count / total) * 100) : 0;
    return '<div class="d-flex align-items-center gap-2" style="font-size:.76rem">' +
      '<span class="fw-semibold flex-shrink-0 text-secondary text-truncate" style="width:130px">' + esc(label) + '</span>' +
      '<div class="zp-progress flex-grow-1" style="background:#eef2ff"><span style="width:' + w + '%;background:' + color + '"></span></div>' +
      '<b class="flex-shrink-0 text-end" style="width:80px">' + (valueText != null ? valueText : count) + '</b></div>';
  }

  function donut(parts, colors, centerTop, centerSub, size) {
    const d = D();
    const s = size || 130;
    return '<div class="position-relative flex-shrink-0" style="width:' + s + 'px;height:' + s + 'px">' +
      '<div class="zp-donut position-absolute inset-0 rounded-circle" style="background:' + d.conicGradient(parts, colors) + '"></div>' +
      '<div class="zp-donut-hole d-grid"><div class="text-center"><div class="fw-bold" style="font-size:.8rem">' + centerTop + '</div>' +
      '<div class="text-muted" style="font-size:.66rem">' + esc(centerSub) + '</div></div></div></div>';
  }

  const PALETTE = ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#7c3aed', '#f43f5e', '#14b8a6', '#64748b'];

  function page() { return $('.zp-page'); }

  function needPartner(session) {
    if (session.partner) return false;
    const p = page();
    if (p && UI().registerCard) {
      p.innerHTML = UI().registerCard();
      UI().bindRegister(function () { location.reload(); });
    }
    return true;
  }

  /* ══════════════════════ Leads & Projects ══════════════════════ */
  function leadsPage(session) {
    if (needPartner(session)) return;
    const d = D();
    const list = d.leads(session.referrals, session.partner);
    const wrap = page();
    if (!wrap) return;

    const selected = pickLead(list);
    const pipe = d.pipeline(list);
    const totalValue = list.reduce(function (a, l) { return a + l.value; }, 0);
    const weighted = list.reduce(function (a, l) { return a + l.value * l.probability / 100; }, 0);

    wrap.innerHTML =
      '<div class="row row-cols-2 row-cols-md-3 row-cols-xl-5 g-3">' +
        statCard('Total Leads', String(list.length), 'Add_Referrals records', 'tint-indigo', 'fa-users') +
        statCard('Open Leads', String(list.filter(function (l) { return !l.won; }).length), 'not yet Closed Won', 'tint-sky', 'fa-bullseye') +
        statCard('Closed Won', String(list.filter(function (l) { return l.won; }).length), 'age ≥ ' + d.CONFIG.stages[4].minAgeDays + ' days', 'tint-emerald', 'fa-trophy') +
        statCard('Pipeline Value', d.moneyShort(totalValue), 'rate card × service', 'tint-violet', 'fa-sack-dollar') +
        statCard('Weighted Value', d.moneyShort(weighted), 'value × probability', 'tint-teal', 'fa-arrow-trend-up') +
      '</div>' +
      (selected ? leadDetailCard(selected, session) : card(empty('No referrals yet', 'Submit a referral to create the first lead.'))) +
      '<div class="row g-3">' +
        '<div class="col-xl-8">' + card(
          head('All Leads <span class="fw-normal text-muted" style="font-size:.66rem">(' + list.length + ')</span>',
            '<div class="zp-input-icon"><i class="fa-solid fa-magnifying-glass"></i><input id="lead-search" class="form-control form-control-sm" placeholder="Search leads..." style="padding-left:2.1rem"></div>') +
          '<div class="zp-table-wrap mt-3"><table class="zp-table"><thead><tr><th>Lead</th><th>Service</th><th>Stage</th><th class="text-end">Value</th><th class="text-end">Commission</th><th>Created</th><th class="text-end">Action</th></tr></thead>' +
          '<tbody id="lead-tbody"></tbody></table></div>' + sourceNote('Live from All_Referrals · stage & value derived by ZPData.CONFIG')) + '</div>' +
        '<div class="col-xl-4">' + card(
          head('Pipeline by Stage') +
          '<div class="d-flex flex-column gap-2 mt-3">' +
          pipe.map(function (s) { return barRow(s.key, s.count, list.length || 1, s.color, s.count + ' · ' + d.moneyShort(s.value)); }).join('') +
          '</div>') +
        card(head('Leads by Service') + '<div class="d-flex align-items-center gap-3 mt-3 flex-wrap">' +
          donut(d.groupSum(list, function (l) { return l.service; }, function (l) { return l.value; }).map(function (g) { return g.value; }), PALETTE, String(list.length), 'Leads', 120) +
          '<div class="flex-grow-1 d-flex flex-column gap-1" style="font-size:.72rem">' +
          (d.groupSum(list, function (l) { return l.service; }, function (l) { return l.value; }).map(function (g, i) {
            return '<div class="d-flex justify-content-between gap-2"><span class="d-flex align-items-center gap-1 text-truncate"><span style="width:8px;height:8px;border-radius:99px;background:' + PALETTE[i % PALETTE.length] + '"></span>' + esc(g.key) + '</span><span class="text-muted">' + g.count + '</span></div>';
          }).join('') || '<span class="text-muted">No data</span>') +
          '</div></div>', 'p-4 mt-3') + '</div>' +
      '</div>';

    function renderRows() {
      const q = (($('#lead-search') || {}).value || '').toLowerCase();
      const vis = list.filter(function (l) {
        return (l.company + ' ' + l.contact + ' ' + l.email + ' ' + l.service + ' ' + l.code).toLowerCase().indexOf(q) >= 0;
      });
      const tb = $('#lead-tbody');
      if (!tb) return;
      tb.innerHTML = vis.length ? vis.map(function (l) {
        return '<tr><td><div class="fw-bold">' + esc(l.company) + '</div><div class="text-muted" style="font-size:.68rem">' + esc(l.code) + ' · ' + esc(l.contact || l.email || '—') + '</div></td>' +
          '<td><span class="zp-pill no-dot zp-pill--violet">' + esc(l.service) + '</span></td>' +
          '<td><span class="zp-pill no-dot ' + l.tint + '">' + esc(l.stage) + '</span></td>' +
          '<td class="text-end fw-semibold">' + d.money(l.value) + '</td>' +
          '<td class="text-end text-success fw-semibold">' + d.money(l.commission) + '</td>' +
          '<td class="text-secondary">' + d.fmtDate(l.created) + '</td>' +
          '<td class="text-end"><button class="row-action" data-zp data-lead="' + esc(l.id) + '" title="Open"><i class="fa-solid fa-eye"></i></button></td></tr>';
      }).join('') : '<tr><td colspan="7">' + empty('No matching leads', 'Try a different search.') + '</td></tr>';
    }
    renderRows();
    $('#lead-search')?.addEventListener('input', renderRows);
    wrap.addEventListener('click', function (e) {
      const btn = e.target.closest('[data-lead]');
      if (!btn) return;
      e.preventDefault();
      try { sessionStorage.setItem('zp_lead', btn.getAttribute('data-lead')); } catch (err) { /* ignore */ }
      leadsPage(session);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function pickLead(list) {
    if (!list.length) return null;
    let id = '';
    try { id = Z().queryParam('lead') || sessionStorage.getItem('zp_lead') || ''; } catch (e) { /* ignore */ }
    return list.find(function (l) { return l.id === id; }) || list[0];
  }

  function leadDetailCard(l, session) {
    const d = D();
    const stages = d.CONFIG.stages;
    const stepper = stages.map(function (s, i) {
      const done = i < l.stageIdx;
      const active = i === l.stageIdx;
      const when = i <= l.stageIdx ? d.fmtDate(d.addDays(l.created, s.minAgeDays)) : '—';
      return '<div class="zp-step ' + (done ? 'done' : active ? 'active' : '') + '"><span class="zp-step-dot"><i class="fa-solid ' + (done ? 'fa-check' : active ? 'fa-spinner' : 'fa-circle') + '"></i></span>' +
        '<div class="zp-step-title">' + esc(s.key) + '</div><div class="zp-step-sub">' + esc(when) + '</div></div>';
    }).join('');
    const facts = [
      ['Company', esc(l.company)],
      ['Contact', esc(l.contact || '—')],
      ['Email', esc(l.email || '—')],
      ['Source', esc(l.source)],
      ['Referred By', esc(session.name)]
    ].map(function (f) {
      return '<div class="col"><div class="border rounded-3 p-3 h-100" style="background:#f8fafc">' +
        '<div class="text-uppercase text-muted fw-semibold" style="font-size:.62rem">' + f[0] + '</div>' +
        '<div class="fw-semibold mt-1 text-truncate" style="font-size:.74rem">' + f[1] + '</div></div></div>';
    }).join('');
    const money = [
      ['Lead Value', d.money(l.value)],
      ['Commission @ ' + Math.round(l.rate * 100) + '%', d.money(l.commission)],
      ['Probability', l.probability + '%'],
      ['Expected Close', d.fmtDate(l.expectedClose)]
    ].map(function (f) {
      return '<div class="col"><div class="border rounded-3 p-2"><div class="text-muted" style="font-size:.64rem">' + f[0] + '</div><div class="fw-bold mt-1">' + f[1] + '</div></div></div>';
    }).join('');
    return card(
      '<div class="d-flex flex-column flex-lg-row justify-content-between gap-3">' +
        '<div><div class="d-flex flex-wrap align-items-center gap-2"><h1 class="jakarta fs-5 fw-bold mb-0">' + esc(l.company) + ' – ' + esc(l.service) + '</h1>' +
        '<span class="zp-pill no-dot ' + l.tint + '">' + esc(l.stage) + '</span></div>' +
        '<div class="d-flex flex-wrap gap-3 mt-1 text-muted" style="font-size:.72rem">' +
        '<span>Lead ID: <b class="text-secondary">' + esc(l.code) + '</b></span>' +
        '<span>Referred on: <b class="text-secondary">' + d.fmtDate(l.created) + '</b></span>' +
        '<span>Age: <b class="text-secondary">' + l.ageDays + ' days</b></span></div></div>' +
        '<div class="d-flex align-items-center gap-2 flex-shrink-0">' +
        '<a href="referral.html" class="btn btn-outline-secondary btn-sm">Add Referral</a>' +
        '<a href="activities.html" class="btn btn-primary btn-sm"><i class="fa-solid fa-book-open"></i> Activity</a></div></div>' +
      '<div class="zp-stepper mt-4">' + stepper + '</div>' +
      '<div class="row row-cols-2 row-cols-md-3 row-cols-xl-5 g-2 mt-3">' + facts + '</div>' +
      '<div class="row g-3 mt-1"><div class="col-lg-5"><h4 class="zp-card-title">Lead Summary</h4>' +
      '<p class="text-muted" style="font-size:.72rem">' + esc(l.description || 'No project description captured on the referral record.') + '</p>' +
      '<div class="row row-cols-2 g-2">' + money + '</div></div>' +
      '<div class="col-lg-7"><h4 class="zp-card-title">Commission Forecast</h4>' +
      '<div class="border rounded-3 p-3"><div class="d-flex justify-content-between" style="font-size:.74rem"><span class="fw-semibold">Deal value (' + esc(l.service) + ')</span><b>' + d.money(l.value) + '</b></div>' +
      '<div class="d-flex justify-content-between mt-2" style="font-size:.74rem"><span class="fw-semibold">Partner rate (' + esc(session.type || 'Partner') + ')</span><b>' + Math.round(l.rate * 100) + '%</b></div>' +
      '<div class="d-flex justify-content-between mt-2" style="font-size:.74rem"><span class="fw-semibold">Payable on win</span><b class="text-success">' + d.money(l.commission) + '</b></div>' +
      '<div class="zp-progress mt-3"><span style="width:' + l.probability + '%;background:' + l.color + '"></span></div>' +
      '<div class="text-muted mt-1" style="font-size:.66rem">' + l.probability + '% probability at stage ' + esc(l.stage) + (l.paid ? ' · commission paid ' + d.fmtDate(l.paidOn) : l.won ? ' · payout pending' : '') + '</div></div></div></div>' +
      sourceNote('Referral ' + esc(l.code) + ' from Add_Referrals')
    );
  }

  /* ══════════════════════ Activities ══════════════════════ */
  function activitiesPage(session) {
    if (needPartner(session)) return;
    const d = D();
    const items = d.activities({
      tasks: (session.steps || []).map(function (s) { return s.record; }).filter(Boolean).concat(session.extraTasks || []),
      referrals: session.referrals,
      taken: session.taken,
      documents: session.documents
    });
    const wrap = page();
    if (!wrap) return;
    const now = new Date();
    const today = items.filter(function (i) { return d.fmtDate(i.when) === d.fmtDate(now); });
    const month = items.filter(function (i) {
      const dt = d.parseDate(i.when);
      return dt.getMonth() === now.getMonth() && dt.getFullYear() === now.getFullYear();
    });
    const completed = items.filter(function (i) { return i.status === 'Completed'; });
    const byType = d.groupSum(items, function (i) { return i.type; });
    const days = d.groupByDay(items).slice(0, 8);

    wrap.innerHTML =
      '<div class="d-flex flex-wrap align-items-center justify-content-end gap-2">' +
      '<span class="btn btn-sm btn-outline-secondary disabled d-inline-flex align-items-center gap-2"><i class="fa-solid fa-calendar-days"></i> ' + esc(d.monthRangeLabel(now)) + '</span></div>' +
      '<div class="row row-cols-2 row-cols-lg-4 g-3">' +
        miniStat('Total Activities', String(items.length), 'Tasks + Referrals + Courses + Documents') +
        miniStat('This Month', String(month.length), esc(d.MONTHS[now.getMonth()] + ' ' + now.getFullYear())) +
        miniStat('Today', String(today.length), esc(d.fmtDate(now))) +
        miniStat('Completed', String(completed.length), d.pct(completed.length, items.length) + '% of all activity') +
      '</div>' +
      '<div class="row g-3"><div class="col-xl-8">' +
        card(head('Activity Timeline') + '<div class="mt-3">' + (days.length ? days.map(function (g) {
          return '<div class="d-flex align-items-center gap-2 mb-2 mt-3"><span class="rounded-circle" style="width:8px;height:8px;background:' + (d.fmtDate(g.date) === d.fmtDate(now) ? '#10b981' : '#94a3b8') + '"></span>' +
            '<span class="fw-bold" style="font-size:.76rem">' + esc(d.dayLabel(g.date)) + '</span>' +
            '<span class="ms-auto text-muted" style="font-size:.68rem">' + g.items.length + ' event' + (g.items.length === 1 ? '' : 's') + '</span></div>' +
            '<div class="zp-timeline">' + g.items.map(function (it) {
              return '<div class="zp-timeline-item"><div class="zp-card p-2 px-3"><div class="d-flex justify-content-between gap-2">' +
                '<div class="d-flex gap-2"><span class="zp-stat-icon ' + it.tint + ' flex-shrink-0" style="width:26px;height:26px;font-size:.72rem"><i class="fa-solid ' + it.icon + '"></i></span>' +
                '<div><div class="fw-bold" style="font-size:.74rem">' + esc(it.title) + '</div>' +
                '<div class="text-secondary" style="font-size:.7rem">' + esc(it.detail) + '</div></div></div>' +
                '<span class="text-muted flex-shrink-0" style="font-size:.66rem">' + esc(d.fmtTime(it.when)) + '</span></div></div></div>';
            }).join('') + '</div>';
        }).join('') : empty('No activity yet', 'Activity appears as tasks, referrals, courses and documents are created.')) + '</div>' +
        sourceNote('All_Tasks · All_Referrals · Partner_Course_Taken_Report · All_Partner_Documents')) +
      '</div><div class="col-xl-4">' +
        card(head('Activity by Type') + '<div class="d-flex flex-wrap gap-3 mt-3 align-items-center">' +
          donut(byType.map(function (b) { return b.count; }), PALETTE, String(items.length), 'Total', 110) +
          '<div class="flex-grow-1 d-flex flex-column gap-1" style="font-size:.72rem">' +
          (byType.map(function (b, i) {
            return '<div class="d-flex align-items-center gap-2"><span class="rounded-circle" style="width:8px;height:8px;background:' + PALETTE[i % PALETTE.length] + '"></span>' +
              '<span class="flex-grow-1">' + esc(b.key) + '</span><span class="text-muted">' + b.count + '</span></div>';
          }).join('') || '<span class="text-muted">No data</span>') + '</div></div>') +
        card(head('Top Activities') + '<div class="d-flex flex-column gap-2 mt-3">' +
          (d.groupSum(items, function (i) { return i.title; }).slice(0, 5).map(function (g) {
            return '<div class="d-flex align-items-center gap-2 p-2 rounded-3 border" style="background:#f8fafc">' +
              '<span class="zp-stat-icon tint-indigo" style="width:28px;height:28px;font-size:.8rem"><i class="fa-solid fa-bolt"></i></span>' +
              '<span class="flex-grow-1" style="font-size:.74rem">' + esc(g.key) + '</span><span class="fw-bold">' + g.count + '</span></div>';
          }).join('') || '<span class="text-muted small">No data</span>') + '</div>', 'p-4 mt-3') +
        card(head('Recent Activity') + '<div class="d-flex flex-column gap-3 mt-3">' +
          (items.slice(0, 5).map(function (it) {
            return '<div class="d-flex gap-2"><img src="' + esc(session.avatar) + '" class="rounded-circle" style="width:28px;height:28px;object-fit:cover" alt="">' +
              '<div style="font-size:.72rem"><b>' + esc(session.name) + '</b> · ' + esc(it.title) +
              '<div class="text-muted" style="font-size:.66rem">' + esc(d.fmtDate(it.when) + ' ' + d.fmtTime(it.when)) + '</div></div></div>';
          }).join('') || '<span class="text-muted small">No data</span>') + '</div>', 'p-4 mt-3') +
      '</div></div>';
  }

  /* ══════════════════════ Earnings & Payouts (partner) ══════════════════════ */
  function earningsPage(session) {
    if (needPartner(session)) return;
    const d = D();
    const list = d.leads(session.referrals, session.partner);
    const e = d.earnings(list);
    const wrap = page();
    if (!wrap) return;
    const rate = Math.round(d.commissionRate(session.partner) * 100);
    const txns = list.filter(function (l) { return l.won; });

    wrap.innerHTML =
      '<div class="row row-cols-2 row-cols-md-3 row-cols-xxl-5 g-3">' +
        miniStat('Commission Earned', d.money(e.commission), e.wonCount + ' of ' + e.leads + ' referrals won') +
        miniStat('Paid to Date', d.money(e.paid), e.paidRows.length + ' settled payouts') +
        miniStat('Pending Payout', d.money(e.pending), e.pendingRows.length + ' awaiting cycle') +
        miniStat('This Month', d.money(e.thisMonth), esc(d.MONTHS[new Date().getMonth()] + ' ' + new Date().getFullYear())) +
        '<div class="col"><div class="p-3 rounded-3 border" style="background:#f0fdf4;border-color:#a7f3d0!important">' +
        '<div class="text-muted fw-semibold" style="font-size:.7rem">Available Balance</div>' +
        '<div class="fs-4 fw-bold mt-1 text-success">' + d.money(e.available) + '</div>' +
        '<div class="text-muted" style="font-size:.68rem">Minimum ' + d.money(d.CONFIG.payout.minimum) + '</div></div></div>' +
      '</div>' +
      '<div class="row g-3"><div class="col-xl-8">' +
        card(head('Earnings Overview <span class="fw-normal text-muted" style="font-size:.66rem">(' + new Date().getFullYear() + ')</span>',
          '<div class="d-flex gap-3" style="font-size:.68rem"><span class="d-flex align-items-center gap-1"><span style="width:8px;height:8px;border-radius:99px;background:#4f46e5"></span>Commission</span>' +
          '<span class="d-flex align-items-center gap-1"><span style="width:8px;height:8px;border-radius:99px;background:#10b981"></span>Paid</span></div>') +
          lineChart([
            e.byMonth.map(function (m) { return m.value; }),
            d.monthlySeries(e.paidRows, function (l) { return l.commission; }).map(function (m) { return m.value; })
          ], ['#4f46e5', '#10b981'], 200, d.MONTHS) +
          sourceNote('Commission = rate card value × ' + rate + '% partner rate, on won referrals')) +
      '</div><div class="col-xl-4">' +
        card(head('Earnings by Service') + '<div class="d-flex flex-wrap gap-3 mt-3 align-items-center">' +
          donut(e.bySource.map(function (s) { return s.value; }), PALETTE, d.moneyShort(e.commission), 'Total', 130) +
          '<div class="flex-grow-1 d-flex flex-column gap-2" style="font-size:.72rem">' +
          (e.bySource.map(function (s, i) {
            return '<div class="d-flex justify-content-between gap-2"><span class="d-flex align-items-center gap-1 text-truncate"><span style="width:8px;height:8px;border-radius:99px;background:' + PALETTE[i % PALETTE.length] + '"></span>' + esc(s.key) + '</span>' +
              '<span class="text-muted">' + d.moneyShort(s.value) + '</span></div>';
          }).join('') || '<span class="text-muted">No won deals yet</span>') + '</div></div>', 'p-4 h-100') +
      '</div></div>' +
      '<div class="row g-3"><div class="col-xl-8">' +
        card(head('Transactions') + '<div class="table-responsive mt-3"><table class="zp-table">' +
          '<thead><tr><th>Date</th><th>Description</th><th>Source</th><th class="text-end">Amount</th><th>Type</th><th>Status</th></tr></thead><tbody>' +
          (txns.length ? txns.map(function (l) {
            return '<tr><td class="text-secondary">' + d.fmtDate(l.wonOn) + '</td>' +
              '<td>Commission — ' + esc(l.company) + ' (' + esc(l.service) + ')</td>' +
              '<td class="text-secondary">' + esc(l.code) + '</td>' +
              '<td class="text-end fw-bold text-success">+' + d.money(l.commission) + '</td>' +
              '<td>Commission</td><td>' + pill(l.paid ? 'Paid' : 'Pending') + '</td></tr>';
          }).join('') : '<tr><td colspan="6">' + empty('No commission yet', 'Commission appears once a referral reaches Closed Won.') + '</td></tr>') +
          '</tbody></table></div>') +
      '</div><div class="col-xl-4">' +
        card(head('Payout Summary') + '<div class="d-flex flex-column gap-2 mt-3" style="font-size:.76rem">' +
          '<div class="d-flex justify-content-between"><span class="text-muted">Won deals</span><span class="fw-bold">' + e.wonCount + '</span></div>' +
          '<div class="d-flex justify-content-between"><span class="text-muted">Paid to date</span><span class="fw-bold">' + d.money(e.paid) + '</span></div>' +
          '<div class="d-flex justify-content-between"><span class="text-muted">Pending payout</span><span class="fw-bold">' + d.money(e.pending) + '</span></div>' +
          '<div class="d-flex justify-content-between"><span class="text-muted">Next payout run</span><span class="fw-medium">' + d.fmtDate(e.nextPayout) + '</span></div>' +
          '<div class="zp-progress d-flex mt-2" style="height:8px"><span style="width:' + d.pct(e.paid, e.commission) + '%;background:#10b981"></span><span style="width:' + d.pct(e.pending, e.commission) + '%;background:#fbbf24"></span></div>' +
          '<button class="btn btn-primary w-100 mt-2" id="req-payout"' + (e.available >= d.CONFIG.payout.minimum ? '' : ' disabled') + '>Request Payout</button>' +
          '<p class="text-center text-muted mb-0" style="font-size:.66rem">Minimum ' + d.money(d.CONFIG.payout.minimum) + ' • paid ' + d.CONFIG.payout.lagDays + ' days after win</p></div>') +
      '</div></div>';

    $('#req-payout')?.addEventListener('click', function () {
      UI().showToast && UI().showToast('Payout request noted for ' + d.money(e.available) + ' — add a Payout form in Creator to persist it.', 'info', 3200);
    });
  }

  /* ══════════════════════ Reports & Analytics ══════════════════════ */
  function reportsPage(session) {
    if (needPartner(session)) return;
    const d = D();
    const list = d.leads(session.referrals, session.partner);
    const e = d.earnings(list);
    const pipe = d.pipeline(list);
    const wrap = page();
    if (!wrap) return;
    const qualified = list.filter(function (l) { return l.stageIdx >= 1; }).length;
    const byService = d.groupSum(list, function (l) { return l.service; }, function (l) { return l.earned; });
    const leadsMonthly = d.monthlySeries(list, function () { return 1; }).map(function (m) { return m.count; });
    const wonMonthly = d.monthlySeries(list.filter(function (l) { return l.won; }), function () { return 1; }).map(function (m) { return m.count; });

    wrap.innerHTML =
      '<div class="d-flex flex-wrap align-items-center justify-content-between gap-2">' +
      '<span class="zp-pill no-dot zp-pill--indigo">Report window: ' + new Date().getFullYear() + '</span>' +
      '<button class="btn btn-sm btn-primary" id="rep-export"><i class="fa-solid fa-download"></i> Export CSV</button></div>' +
      '<div class="row row-cols-2 row-cols-md-3 row-cols-xxl-6 g-3">' +
        miniStat('Total Leads', String(list.length), 'All_Referrals') +
        miniStat('Qualified+', String(qualified), 'past New stage') +
        miniStat('Deals Won', String(e.wonCount), 'Closed Won') +
        miniStat('Conversion', e.conversion + '%', 'won ÷ total leads') +
        miniStat('Commission', d.money(e.commission), 'earned this year') +
        miniStat('Paid Out', d.money(e.paid), e.paidRows.length + ' payouts') +
      '</div>' +
      '<div class="row g-3"><div class="col-xl-5">' +
        card(head('Leads vs Won vs Commission') +
          '<div class="d-flex gap-3 mt-2" style="font-size:.68rem">' +
          '<span class="d-flex align-items-center gap-1"><span style="width:8px;height:8px;border-radius:99px;background:#4f46e5"></span>Leads</span>' +
          '<span class="d-flex align-items-center gap-1"><span style="width:8px;height:8px;border-radius:99px;background:#10b981"></span>Won</span>' +
          '<span class="d-flex align-items-center gap-1"><span style="width:8px;height:8px;border-radius:99px;background:#f97316"></span>Commission</span></div>' +
          lineChart([leadsMonthly, wonMonthly, e.byMonth.map(function (m) { return m.value; })], ['#4f46e5', '#10b981', '#f97316'], 190, d.MONTHS)) +
      '</div><div class="col-xl-3">' +
        card(head('Leads by Stage') + '<div class="d-flex flex-wrap gap-3 mt-3 align-items-center">' +
          donut(pipe.map(function (p) { return p.count; }), pipe.map(function (p) { return p.color; }), String(list.length), 'Total', 120) +
          '<div class="flex-grow-1 d-flex flex-column gap-1" style="font-size:.7rem">' +
          pipe.map(function (p) {
            return '<div class="d-flex justify-content-between"><span class="d-flex align-items-center gap-1"><span style="width:8px;height:8px;border-radius:99px;background:' + p.color + '"></span>' + esc(p.key) + '</span><span class="text-muted">' + p.count + '</span></div>';
          }).join('') + '</div></div>') +
      '</div><div class="col-xl-4">' +
        card(head('Top Performing Services') + '<div class="table-responsive mt-2"><table class="zp-table">' +
          '<thead><tr><th>Service</th><th class="text-end">Leads</th><th class="text-end">Commission</th></tr></thead><tbody>' +
          (byService.length ? byService.map(function (s) {
            return '<tr><td>' + esc(s.key) + '</td><td class="text-end fw-semibold">' + s.count + '</td><td class="text-end fw-semibold">' + d.money(s.value) + '</td></tr>';
          }).join('') + '<tr class="fw-bold" style="background:#f0f0ff"><td>Total</td><td class="text-end">' + list.length + '</td><td class="text-end">' + d.money(e.commission) + '</td></tr>'
            : '<tr><td colspan="3">' + empty('No referrals yet', '') + '</td></tr>') +
          '</tbody></table></div>') +
        card(head('Commission Trend (Monthly)') + lineChart([e.byMonth.map(function (m) { return m.value; })], ['#4f46e5'], 120, null), 'p-4 mt-3') +
      '</div></div>' +
      card(head('Reports Library') + '<div class="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-6 g-3 mt-2">' +
        [['Leads Report', 'fa-file-lines', 'tint-sky', list.length + ' leads', 'leads'],
         ['Pipeline Report', 'fa-sitemap', 'tint-violet', pipe[0].count + ' new', 'pipeline'],
         ['Earnings Report', 'fa-coins', 'tint-emerald', d.moneyShort(e.commission), 'earnings'],
         ['Payouts Report', 'fa-download', 'tint-indigo', d.moneyShort(e.paid), 'payouts'],
         ['Conversion Report', 'fa-chart-line', 'tint-sky', e.conversion + '%', 'conversion'],
         ['Onboarding Report', 'fa-chart-column', 'tint-violet', session.onboard.pct + '% complete', 'onboarding']].map(function (r) {
          return '<div class="col"><a href="#" data-report="' + r[4] + '" class="border rounded-3 p-3 d-block text-decoration-none hover-lift">' +
            '<span class="zp-stat-icon ' + r[2] + '" style="width:32px;height:32px"><i class="fa-solid ' + r[1] + '"></i></span>' +
            '<div class="fw-bold mt-2" style="font-size:.72rem">' + r[0] + '</div>' +
            '<div class="text-muted" style="font-size:.64rem">' + esc(r[3]) + '</div>' +
            '<div class="text-primary fw-bold mt-2" style="font-size:.66rem">Download CSV</div></a></div>';
        }).join('') + '</div>' + sourceNote('Every figure recomputed from Creator records at page load'));

    function csv() {
      const rows = [['Lead ID', 'Company', 'Contact', 'Email', 'Service', 'Stage', 'Created', 'Value', 'Commission', 'Paid']];
      list.forEach(function (l) {
        rows.push([l.code, l.company, l.contact, l.email, l.service, l.stage, d.fmtDate(l.created), l.value, Math.round(l.commission), l.paid ? 'Yes' : 'No']);
      });
      const blob = new Blob([rows.map(function (r) { return r.map(function (c) { return '"' + String(c).replace(/"/g, '""') + '"'; }).join(','); }).join('\n')], { type: 'text/csv' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'zenpartner-report.csv';
      a.click();
      URL.revokeObjectURL(a.href);
    }
    $('#rep-export')?.addEventListener('click', function (ev) { ev.preventDefault(); csv(); });
    $$('[data-report]').forEach(function (a) { a.addEventListener('click', function (ev) { ev.preventDefault(); csv(); }); });
  }

  /* ══════════════════════ Admin — Earnings & Payouts ══════════════════════ */
  async function adminPayoutsPage(session) {
    const d = D();
    const zp = Z();
    const [partners, referrals] = await Promise.all([
      zp.getRecords(zp.REPORTS.partners),
      zp.getRecords(zp.REPORTS.referrals)
    ]);
    const all = d.leadsForAll(referrals, partners);
    const rows = d.payoutRequests(partners, all);
    const e = d.earnings(all);
    const wrap = page();
    if (!wrap) return;
    const pendingRows = rows.filter(function (r) { return r.status !== 'Paid'; });
    const paidRows = rows.filter(function (r) { return r.status === 'Paid'; });

    wrap.innerHTML =
      '<div class="d-flex flex-wrap align-items-center justify-content-between gap-2">' +
      '<span class="zp-pill no-dot zp-pill--indigo">' + partners.length + ' partners · ' + all.length + ' referrals</span>' +
      '<button id="payout-export" class="btn btn-sm btn-outline-secondary"><i class="fa-solid fa-download"></i> Export</button></div>' +
      '<div class="row row-cols-2 row-cols-md-3 row-cols-xxl-6 g-3">' +
        statCard('Total Commission', d.moneyShort(e.commission), 'across all partners', 'tint-indigo', 'fa-money-bills') +
        statCard('Paid to Date', d.moneyShort(e.paid), paidRows.length + ' transactions', 'tint-emerald', 'fa-circle-check') +
        statCard('Pending Payouts', d.moneyShort(e.pending), pendingRows.length + ' requests', 'tint-amber', 'fa-hourglass-half') +
        statCard('This Month', d.moneyShort(e.thisMonth), 'commission won', 'tint-sky', 'fa-calendar-days') +
        statCard('Won Deals', String(e.wonCount), 'of ' + all.length + ' referrals', 'tint-violet', 'fa-trophy') +
        statCard('Conversion', e.conversion + '%', 'referral → won', 'tint-teal', 'fa-arrow-trend-up') +
      '</div>' +
      '<div class="row g-3"><div class="col-xl-7">' +
        card(head('Payout Requests <span class="badge bg-warning-subtle text-warning rounded-pill">' + pendingRows.length + '</span>',
          '<div class="d-flex gap-2 flex-wrap"><div class="zp-input-icon"><i class="fa-solid fa-magnifying-glass"></i><input id="payout-search" class="form-control form-control-sm" placeholder="Search partner..." style="padding-left:2.1rem"></div>' +
          '<select id="payout-status" class="form-select form-select-sm w-auto"><option value="all">Status: All</option><option>Pending</option><option>Paid</option><option>Below Minimum</option></select></div>') +
          '<div class="zp-table-wrap mt-3"><table class="zp-table"><thead><tr><th>Request ID</th><th>Partner</th><th class="text-end">Amount</th><th>Method</th><th>Status</th><th>Period</th></tr></thead>' +
          '<tbody id="payout-tbody"></tbody></table></div>' +
          '<div class="d-flex align-items-center gap-2 mt-2"><span id="payout-count" class="text-muted" style="font-size:.72rem"></span></div>' +
          sourceNote('Derived from All_Referrals × Partner_Details.partner_type commission rates'), 'p-4') +
      '</div><div class="col-xl-5">' +
        card(head('Commission Structure') + '<div class="d-flex flex-column gap-3 mt-3">' +
          Object.keys(d.CONFIG.commissionRate).map(function (type, i) {
            const r = d.CONFIG.commissionRate[type];
            const count = partners.filter(function (p) { return field(p, 'partner_type') === type; }).length;
            return '<div><div class="d-flex justify-content-between" style="font-size:.72rem"><span class="fw-semibold">' +
              '<span class="me-1" style="width:8px;height:8px;border-radius:99px;background:' + PALETTE[i % PALETTE.length] + ';display:inline-block"></span>' + esc(type) +
              ' <span class="text-muted">(' + count + ')</span></span><b>' + Math.round(r * 100) + '%</b></div>' +
              '<div class="zp-progress mt-1"><span style="width:' + (r * 100 / 0.2 * 100 / 100) * 100 / 100 + '%;background:' + PALETTE[i % PALETTE.length] + '"></span></div></div>';
          }).join('') + '</div>' +
          '<div class="row row-cols-3 g-2 text-center mt-4">' +
          '<div class="col"><div class="p-2 rounded-3 border" style="background:#f8fafc"><div class="text-muted" style="font-size:.62rem">Payout Cycle</div><div class="fw-bold">' + d.CONFIG.payout.cycleDays + ' days</div></div></div>' +
          '<div class="col"><div class="p-2 rounded-3 border" style="background:#f8fafc"><div class="text-muted" style="font-size:.62rem">Min. Payout</div><div class="fw-bold">' + d.money(d.CONFIG.payout.minimum) + '</div></div></div>' +
          '<div class="col"><div class="p-2 rounded-3 border" style="background:#f8fafc"><div class="text-muted" style="font-size:.62rem">Currency</div><div class="fw-bold">' + d.CONFIG.currency.code + '</div></div></div></div>') +
      '</div></div>' +
      card('<div class="d-flex align-items-center gap-2 p-3"><h3 class="zp-card-title">Payout History <span class="badge bg-success-subtle text-success rounded-pill">' + paidRows.length + ' Paid</span></h3></div>' +
        '<div class="table-responsive"><table class="zp-table"><thead><tr><th>Transaction ID</th><th>Partner</th><th>Period</th><th class="text-end">Amount</th><th>Method</th><th>Status</th><th>Paid On</th></tr></thead><tbody>' +
        (paidRows.length ? paidRows.map(function (r) {
          return '<tr><td class="text-secondary fw-semibold">' + esc(r.id) + '</td>' +
            '<td><div class="d-flex align-items-center gap-2"><img src="' + esc(r.avatar) + '" style="width:24px;height:24px;border-radius:50%;object-fit:cover" alt=""><span>' + esc(r.partnerName) + '</span></div></td>' +
            '<td class="text-secondary">' + esc(r.period) + '</td><td class="text-end fw-bold">' + d.money(r.amount) + '</td>' +
            '<td class="text-secondary">' + esc(r.method) + '</td><td>' + pill('Paid') + '</td>' +
            '<td class="text-secondary">' + d.fmtDate(r.paidOn) + '</td></tr>';
        }).join('') : '<tr><td colspan="7">' + empty('No settled payouts yet', 'Commission settles ' + d.CONFIG.payout.lagDays + ' days after a deal is won.') + '</td></tr>') +
        '</tbody></table></div>', 'overflow-hidden');

    function render() {
      const q = (($('#payout-search') || {}).value || '').toLowerCase();
      const st = (($('#payout-status') || {}).value) || 'all';
      const vis = rows.filter(function (r) {
        return r.partnerName.toLowerCase().indexOf(q) >= 0 && (st === 'all' || r.status === st);
      });
      const tb = $('#payout-tbody');
      if (tb) tb.innerHTML = vis.length ? vis.map(function (r) {
        return '<tr><td class="text-secondary fw-semibold">' + esc(r.id) + '</td>' +
          '<td><div class="d-flex align-items-center gap-2"><img src="' + esc(r.avatar) + '" style="width:24px;height:24px;border-radius:50%;object-fit:cover" alt="">' +
          '<div><div class="fw-semibold">' + esc(r.partnerName) + '</div><div class="text-muted" style="font-size:.66rem">' + r.deals + ' won deals</div></div></div></td>' +
          '<td class="text-end fw-bold">' + d.money(r.amount) + '</td>' +
          '<td class="text-secondary">' + esc(r.method) + '</td>' +
          '<td>' + pill(r.status === 'Paid' ? 'Paid' : r.status === 'Below Minimum' ? 'Hold' : 'Pending') + '</td>' +
          '<td class="text-secondary">' + esc(r.period) + '</td></tr>';
      }).join('') : '<tr><td colspan="6">' + empty('No payout requests', 'Requests appear once partner referrals reach Closed Won.') + '</td></tr>';
      const c = $('#payout-count');
      if (c) c.textContent = 'Showing ' + vis.length + ' of ' + rows.length + ' payout records';
    }
    render();
    chromeExtras({ tasks: await zp.getRecords(zp.REPORTS.tasks), referrals: referrals });
    $('#payout-search')?.addEventListener('input', render);
    $('#payout-status')?.addEventListener('change', render);
    $('#payout-export')?.addEventListener('click', function () {
      const csvRows = [['ID', 'Partner', 'Deals', 'Amount', 'Method', 'Status', 'Period']].concat(rows.map(function (r) {
        return [r.id, r.partnerName, r.deals, Math.round(r.amount), r.method, r.status, r.period];
      }));
      const blob = new Blob([csvRows.map(function (r) { return r.join(','); }).join('\n')], { type: 'text/csv' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'zenpartner-payouts.csv';
      a.click();
      URL.revokeObjectURL(a.href);
    });
  }

  /* ══════════════════════ Admin — Support Tickets ══════════════════════ */
  async function adminTicketsPage(session) {
    const d = D();
    const zp = Z();
    const [tasks, partners] = await Promise.all([
      zp.getRecords(zp.REPORTS.tasks),
      zp.getRecords(zp.REPORTS.partners)
    ]);
    const list = d.tickets(tasks);
    const wrap = page();
    if (!wrap) return;
    const open = list.filter(function (t) { return t.status === 'Open'; });
    const prog = list.filter(function (t) { return t.status === 'In Progress'; });
    const resolved = list.filter(function (t) { return t.status === 'Resolved'; });
    const breached = list.filter(function (t) { return t.breached; });
    const escalated = list.filter(function (t) { return t.escalated; });
    const priorities = ['Critical', 'High', 'Medium', 'Low'];
    const pColors = { Critical: '#f43f5e', High: '#f87171', Medium: '#fbbf24', Low: '#cbd5e1' };
    const withinSla = list.length - breached.length;
    const slaPct = d.pct(withinSla, list.length);
    const avgAge = list.length ? Math.round(list.reduce(function (a, t) { return a + t.hoursOpen; }, 0) / list.length * 10) / 10 : 0;

    wrap.innerHTML =
      '<div class="d-flex flex-wrap align-items-center justify-content-between gap-2">' +
      '<span class="zp-pill no-dot zp-pill--indigo">' + list.length + ' tickets from All_Tasks · ' + partners.length + ' partners</span>' +
      '<button id="ticket-export" class="btn btn-sm btn-outline-secondary"><i class="fa-solid fa-download"></i> Export</button></div>' +
      '<div class="row row-cols-2 row-cols-md-3 row-cols-xxl-6 g-3">' +
        statCard('Open Tickets', String(open.length), list.filter(function (t) { return t.priority === 'High' || t.priority === 'Critical'; }).length + ' high priority', 'tint-sky', 'fa-life-ring') +
        statCard('In Progress', String(prog.length), 'being worked on', 'tint-indigo', 'fa-arrows-rotate') +
        statCard('Resolved', String(resolved.length), d.pct(resolved.length, list.length) + '% of all tickets', 'tint-emerald', 'fa-circle-check') +
        statCard('Avg. Age', avgAge + ' <span class="fs-6 text-secondary fw-bold">hrs</span>', 'since created', 'tint-amber', 'fa-stopwatch') +
        statCard('Escalated', String(escalated.length), 'critical & unresolved', 'tint-rose', 'fa-triangle-exclamation') +
        statCard('SLA Breached', String(breached.length), 'past target response', 'tint-slate', 'fa-hourglass-end') +
      '</div>' +
      card(head('All Tickets <span class="badge bg-primary-subtle text-primary rounded-pill">' + list.length + '</span>',
        '<div class="d-flex gap-2 flex-wrap"><div class="zp-input-icon"><i class="fa-solid fa-magnifying-glass"></i><input id="ticket-search" class="form-control form-control-sm" placeholder="Search tickets..." style="padding-left:2.1rem"></div>' +
        '<select id="ticket-status" class="form-select form-select-sm w-auto"><option value="all">Status: All</option><option>Open</option><option>In Progress</option><option>Resolved</option><option>On Hold</option><option>Closed</option></select>' +
        '<select id="ticket-priority" class="form-select form-select-sm w-auto"><option value="all">Priority: All</option>' + priorities.map(function (p) { return '<option>' + p + '</option>'; }).join('') + '</select></div>') +
        '<div class="zp-table-wrap mt-3"><table class="zp-table"><thead><tr><th>Ticket ID</th><th>Subject</th><th>Partner</th><th>Priority</th><th>Status</th><th>Created</th><th>SLA</th></tr></thead>' +
        '<tbody id="ticket-tbody"></tbody></table></div><div class="mt-2"><span id="ticket-count" class="text-muted" style="font-size:.72rem"></span></div>' +
        sourceNote('Each Task record is surfaced as a support ticket until a dedicated Tickets form exists')) +
      '<div class="row g-3"><div class="col-lg-6">' +
        card(head('Tickets by Priority') + '<div class="d-flex flex-column gap-3 mt-3">' +
          priorities.map(function (p) {
            const n = list.filter(function (t) { return t.priority === p; }).length;
            const pc = d.pct(n, list.length);
            return '<div><div class="d-flex justify-content-between" style="font-size:.72rem"><span><span class="me-1" style="width:8px;height:8px;border-radius:99px;background:' + pColors[p] + ';display:inline-block"></span>' + p + '</span><b>' + n + ' (' + pc + '%)</b></div>' +
              '<div class="zp-progress mt-1"><span style="width:' + pc + '%;background:' + pColors[p] + '"></span></div></div>';
          }).join('') + '</div>') +
      '</div><div class="col-lg-6">' +
        card(head('SLA Compliance', '<span class="zp-pill no-dot ' + (slaPct >= 95 ? 'zp-pill--emerald' : 'zp-pill--amber') + '">' + slaPct + '%</span>') +
          '<div class="row row-cols-3 g-2 text-center mt-3">' +
          '<div class="col"><div class="p-2 rounded-3 border" style="background:#f8fafc"><div class="text-muted" style="font-size:.62rem">Within SLA</div><div class="fw-bold">' + withinSla + '</div></div></div>' +
          '<div class="col"><div class="p-2 rounded-3 border" style="background:#f8fafc"><div class="text-muted" style="font-size:.62rem">Breached</div><div class="fw-bold text-danger">' + breached.length + '</div></div></div>' +
          '<div class="col"><div class="p-2 rounded-3 border" style="background:#f8fafc"><div class="text-muted" style="font-size:.62rem">Target</div><div class="fw-bold">95%</div></div></div></div>' +
          '<div class="zp-progress mt-3"><span style="width:' + slaPct + '%;background:linear-gradient(90deg,#10b981,#2dd4bf)"></span></div>' +
          '<div class="d-flex justify-content-between text-muted mt-2" style="font-size:.66rem"><span>Average ticket age</span><span class="fw-semibold text-secondary">' + avgAge + ' hrs</span></div>') +
      '</div></div>';

    function render() {
      const q = (($('#ticket-search') || {}).value || '').toLowerCase();
      const st = (($('#ticket-status') || {}).value) || 'all';
      const pr = (($('#ticket-priority') || {}).value) || 'all';
      const vis = list.filter(function (t) {
        return (t.id + ' ' + t.subject + ' ' + t.partner).toLowerCase().indexOf(q) >= 0 &&
          (st === 'all' || t.status === st) && (pr === 'all' || t.priority === pr);
      });
      const tb = $('#ticket-tbody');
      if (tb) tb.innerHTML = vis.length ? vis.map(function (t) {
        return '<tr><td class="text-secondary fw-semibold">' + esc(t.id) + '</td>' +
          '<td><div class="fw-semibold">' + esc(t.subject) + '</div><div class="text-muted text-truncate" style="font-size:.66rem;max-width:280px">' + esc(t.detail || '—') + '</div></td>' +
          '<td class="text-secondary">' + esc(t.partner || '—') + '</td>' +
          '<td>' + pill(t.priority) + '</td><td>' + pill(t.status) + '</td>' +
          '<td class="text-secondary">' + d.fmtDate(t.created) + '</td>' +
          '<td>' + (t.breached ? '<span class="zp-pill no-dot zp-pill--rose">Breached</span>' : '<span class="zp-pill no-dot zp-pill--emerald">' + t.slaHours + 'h</span>') + '</td></tr>';
      }).join('') : '<tr><td colspan="7">' + empty('No tickets', 'Tasks created in Creator show up here.') + '</td></tr>';
      const c = $('#ticket-count');
      if (c) c.textContent = 'Showing ' + vis.length + ' of ' + list.length + ' tickets';
    }
    render();
    chromeExtras({ tasks: tasks, referrals: await zp.getRecords(zp.REPORTS.referrals) });
    ['ticket-search', 'ticket-status', 'ticket-priority'].forEach(function (id) {
      const el = document.getElementById(id);
      el?.addEventListener('input', render);
      el?.addEventListener('change', render);
    });
    $('#ticket-export')?.addEventListener('click', function () {
      const rows = [['Ticket', 'Subject', 'Partner', 'Priority', 'Status', 'Created']].concat(list.map(function (t) {
        return [t.id, t.subject, t.partner, t.priority, t.status, d.fmtDate(t.created)];
      }));
      const blob = new Blob([rows.map(function (r) { return r.map(function (c) { return '"' + String(c).replace(/"/g, '""') + '"'; }).join(','); }).join('\n')], { type: 'text/csv' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'zenpartner-tickets.csv';
      a.click();
      URL.revokeObjectURL(a.href);
    });
  }

  /* ══════════════════════ Dashboard (index.html) extras ══════════════════════ */
  function dashboardExtras(session) {
    const d = D();
    const list = d.leads(session.referrals, session.partner);
    const e = d.earnings(list);
    const pipe = d.pipeline(list);
    const now = new Date();

    // Toolbar date range → current month, from the clock not a fixed string.
    const rangeBtn = $$('.zp-page .btn').find(function (b) { return /\d{4}|Filter/.test(b.textContent) && b.querySelector('.fa-calendar-days'); });
    if (rangeBtn) rangeBtn.innerHTML = '<i class="fa-solid fa-calendar-days"></i> ' + esc(d.monthRangeLabel(now)) + ' <i class="fa-solid fa-chevron-down"></i>';

    // Hero chip: partner type, status and member-since (first task / referral date).
    const first = [].concat(list.map(function (l) { return l.created; }),
      (session.steps || []).map(function (s) { return s.record ? d.recordDate(s.record) : null; }).filter(Boolean))
      .sort(function (a, b) { return a - b; })[0];
    const chip = $('.zp-hero-chip');
    if (chip) {
      chip.innerHTML = '<i class="fa-solid fa-circle-check text-warning"></i> ' +
        esc((session.type || 'Partner') + ' · ' + (session.status || 'Prospective')) +
        (first ? ' · Member since ' + esc(d.fmtDate(first)) : '');
    }

    // Hero stats: referrals, commission, onboarding.
    const stats = $('.zp-hero-stats');
    if (stats) {
      stats.innerHTML =
        '<div><div class="zp-hero-stat-value">' + list.length + '</div><div class="zp-hero-stat-label">Total Referrals</div></div>' +
        '<div class="vr opacity-25" style="height:2rem"></div>' +
        '<div><div class="zp-hero-stat-value">' + list.filter(function (l) { return !l.won; }).length + '</div><div class="zp-hero-stat-label">Active Opportunities</div></div>' +
        '<div class="vr opacity-25" style="height:2rem"></div>' +
        '<div><div class="zp-hero-stat-value">' + d.moneyShort(e.commission) + '</div><div class="zp-hero-stat-label">Commission (YTD)</div></div>';
    }

    // KPI strip — five live values with data-driven sparklines.
    const monthlyLeads = d.monthlySeries(list, function () { return 1; }).map(function (m) { return m.count; });
    const monthlyComm = e.byMonth.map(function (m) { return m.value; });
    const openTasks = (session.steps || []).filter(function (s) { return !s.done; }).length +
      (session.extraTasks || []).filter(function (t) { return field(t, 'status') !== 'Completed'; }).length;
    const kpis = [
      { label: 'Total Referrals', value: String(list.length), sub: 'from Add_Referrals', series: monthlyLeads, color: '#4f46e5' },
      { label: 'Active Opportunities', value: String(list.filter(function (l) { return !l.won; }).length), sub: 'not yet Closed Won', series: monthlyLeads, color: '#0ea5e9' },
      { label: 'Commission (YTD)', value: d.moneyShort(e.commission), sub: e.wonCount + ' deals won', series: monthlyComm, color: '#10b981' },
      { label: 'Pending Payouts', value: d.moneyShort(e.pending), sub: 'next run ' + d.fmtDateShort(e.nextPayout), series: monthlyComm, color: '#f59e0b' },
      { label: 'Open Tasks', value: String(openTasks), sub: session.onboard.pct + '% onboarding done', series: [session.onboard.done, session.onboard.total], color: '#0d9488' }
    ];
    $$('.zp-stat').forEach(function (cardEl, i) {
      const k = kpis[i];
      if (!k) return;
      const label = cardEl.querySelector('.zp-stat-label');
      const val = cardEl.querySelector('.zp-stat-value');
      const muted = cardEl.querySelector('.zp-stat-delta .muted');
      const spark = cardEl.querySelector('.zp-spark');
      if (label) label.textContent = k.label;
      if (val) val.textContent = k.value;
      if (muted) muted.textContent = k.sub;
      if (spark) {
        spark.innerHTML = '<polyline points="' + d.linePoints(k.series, 120, 32, 3) + '" fill="none" stroke="' + k.color + '" stroke-width="1.6" stroke-linecap="round"/>';
      }
    });

    // Referral pipeline card.
    const pipeTitle = $$('.zp-card-title').find(function (t) { return /Referral Pipeline/.test(t.textContent); });
    if (pipeTitle) {
      const box = pipeTitle.closest('.zp-card');
      const badge = box.querySelector('.zp-pill');
      if (badge) badge.textContent = list.filter(function (l) { return !l.won; }).length + ' Open';
      const body = box.querySelector('.d-flex.flex-column.gap-2.mt-3');
      if (body) {
        body.innerHTML = list.length
          ? pipe.map(function (s) { return barRow(s.key, s.count, list.length, s.color, s.count + ' · ' + d.moneyShort(s.value)); }).join('')
          : '<div class="text-muted small">No referrals yet. <a href="referral.html">Add your first lead</a>.</div>';
      }
    }

    // Earnings overview card.
    const earnTitle = $$('.zp-card-title').find(function (t) { return /Earnings Overview/.test(t.textContent); });
    if (earnTitle) {
      const box = earnTitle.closest('.zp-card');
      box.innerHTML = head('Earnings Overview <span class="fw-normal text-muted" style="font-size:.66rem">(' + now.getFullYear() + ')</span>',
        '<a href="earnings.html" class="zp-card-link">View Report</a>') +
        '<div class="mt-2"><div class="text-muted" style="font-size:.66rem">Commission earned</div>' +
        '<div class="fs-4 fw-bold">' + d.money(e.commission) + '</div>' +
        '<div class="text-success" style="font-size:.66rem;font-weight:600">' + d.money(e.paid) + ' paid <span class="text-muted fw-normal">· ' + d.money(e.pending) + ' pending</span></div></div>' +
        lineChart([monthlyComm], ['#4f46e5'], 110, d.MONTHS);
    }

    // Top performing categories → commission by service.
    const catTitle = $$('.zp-card-title').find(function (t) { return /Top Performing Categories/.test(t.textContent); });
    if (catTitle) {
      const box = catTitle.closest('.zp-card');
      const groups = e.bySource.length ? e.bySource : d.groupSum(list, function (l) { return l.service; }, function (l) { return l.value; });
      const total = groups.reduce(function (a, g) { return a + g.value; }, 0);
      box.innerHTML = '<h3 class="zp-card-title">Top Performing Categories</h3>' +
        '<div class="d-flex align-items-center gap-4 mt-3 flex-wrap">' +
        donut(groups.map(function (g) { return g.value; }), PALETTE, d.moneyShort(total), e.bySource.length ? 'Commission' : 'Pipeline', 120) +
        '<div class="flex-grow-1 d-flex flex-column gap-2 min-w-0" style="font-size:.72rem">' +
        (groups.length ? groups.slice(0, 5).map(function (g, i) {
          return '<div class="d-flex gap-2"><span class="rounded-circle align-self-center flex-shrink-0" style="width:8px;height:8px;background:' + PALETTE[i % PALETTE.length] + '"></span>' +
            '<div class="min-w-0"><div class="fw-semibold text-truncate">' + esc(g.key) + '</div>' +
            '<div class="text-muted" style="font-size:.66rem">' + d.money(g.value) + ' (' + d.pct(g.value, total) + '%)</div></div></div>';
        }).join('') : '<span class="text-muted">No referrals yet</span>') + '</div></div>';
    }

    // Performance timeline.
    const perfTitle = $$('.zp-card-title').find(function (t) { return /Performance Timeline/.test(t.textContent); });
    if (perfTitle) {
      const box = perfTitle.closest('.zp-card');
      const wonMonthly = d.monthlySeries(list.filter(function (l) { return l.won; }), function () { return 1; }).map(function (m) { return m.count; });
      const series = { referrals: monthlyLeads, opportunities: monthlyLeads.map(function (v, i) { return Math.max(0, v - wonMonthly[i]); }), earnings: monthlyComm, payouts: d.monthlySeries(e.paidRows, function (l) { return l.commission; }).map(function (m) { return m.value; }) };
      box.innerHTML =
        '<div class="d-flex flex-wrap align-items-center justify-content-between gap-2">' +
        '<h3 class="zp-card-title">Performance Timeline</h3>' +
        '<span class="zp-pill no-dot zp-pill--slate">' + now.getFullYear() + '</span></div>' +
        '<div class="zp-segmented mt-3" id="perf-seg">' +
        ['Referrals', 'Opportunities', 'Earnings', 'Payouts'].map(function (t, i) { return '<button' + (i === 0 ? ' class="active"' : '') + ' data-series="' + t.toLowerCase() + '">' + t + '</button>'; }).join('') +
        '</div><div id="perf-chart"></div>';
      const draw = function (key) {
        const vals = series[key] || [];
        $('#perf-chart').innerHTML = lineChart([vals], ['#4f46e5'], 150, d.MONTHS) +
          '<div class="text-muted mt-2" style="font-size:.66rem">' + esc(key.charAt(0).toUpperCase() + key.slice(1)) + ' per month · total ' +
          (key === 'earnings' || key === 'payouts' ? d.money(vals.reduce(function (a, v) { return a + v; }, 0)) : vals.reduce(function (a, v) { return a + v; }, 0)) + '</div>';
      };
      draw('referrals');
      $('#perf-seg')?.addEventListener('click', function (ev) {
        const b = ev.target.closest('button[data-series]');
        if (!b) return;
        $$('#perf-seg button').forEach(function (x) { x.classList.remove('active'); });
        b.classList.add('active');
        draw(b.getAttribute('data-series'));
      });
    }
  }

  /* ══════════════════════ Admin — shared KPI strip ══════════════════════ */
  function adminKpis(partners, referrals) {
    const d = D();
    const all = d.leadsForAll(referrals, partners);
    const e = d.earnings(all);
    const values = [
      String(partners.length),
      String(partners.filter(function (p) { return field(p, 'partner_status') === 'Active'; }).length),
      String(all.length),
      String(e.wonCount),
      d.moneyShort(e.commission),
      d.moneyShort(e.paid)
    ];
    const subs = [
      'Partner_Details records',
      'partner_status = Active',
      'from All_Referrals',
      'referrals Closed Won',
      'commission earned',
      'settled payouts'
    ];
    $$('.zp-stat').forEach(function (cardEl, i) {
      if (values[i] === undefined) return;
      const val = cardEl.querySelector('.zp-stat-value');
      const delta = cardEl.querySelector('.zp-stat-delta');
      if (val) val.textContent = values[i];
      if (delta) delta.innerHTML = '<span class="muted">' + esc(subs[i]) + '</span>';
    });
    return { all: all, earnings: e };
  }

  /* ══════════════════════ Admin dashboard extras ══════════════════════ */
  function adminDashboardExtras(partners, referrals, tasks, stats) {
    const d = D();
    chromeExtras({ tasks: tasks, referrals: referrals });
    const res = adminKpis(partners, referrals);
    const all = res.all;
    const e = res.earnings;
    const now = new Date();
    const active = partners.filter(function (p) { return field(p, 'partner_status') === 'Active'; });
    const openTasks = tasks.filter(function (t) { return field(t, 'status') !== 'Completed' && field(t, 'status') !== 'Cancelled'; });
    const doneTasks = tasks.filter(function (t) { return field(t, 'status') === 'Completed'; });
    const completion = d.pct(doneTasks.length, tasks.length);

    const chip = $('.zp-hero-chip');
    if (chip) chip.innerHTML = '<i class="fa-solid fa-shield-halved text-info"></i> Admin Overview · ' + esc(d.MONTHS[now.getMonth()] + ' ' + now.getFullYear());
    const heroP = $('.zp-hero p');
    if (heroP) heroP.textContent = partners.length + ' partners, ' + d.money(e.commission) + ' in commission and ' + openTasks.length + ' open tasks.';
    const heroStats = $('.zp-hero-stats');
    if (heroStats) {
      heroStats.innerHTML =
        '<div><div class="zp-hero-stat-value">' + partners.length + '</div><div class="zp-hero-stat-label">Total Partners</div></div>' +
        '<div class="vr opacity-25" style="height:2rem"></div>' +
        '<div><div class="zp-hero-stat-value">' + active.length + '</div><div class="zp-hero-stat-label">Active Partners</div></div>' +
        '<div class="vr opacity-25" style="height:2rem"></div>' +
        '<div><div class="zp-hero-stat-value">' + completion + '%</div><div class="zp-hero-stat-label">Task Completion</div></div>';
    }
    const panel = $('.zp-hero-panel');
    if (panel) {
      const newThisQuarter = partners.filter(function (p) {
        const dt = d.parseDate(field(p, 'Added_Time'));
        return dt && d.ageDays(dt) <= 90;
      }).length;
      const target = Math.max(e.commission, d.CONFIG.payout.minimum * 20);
      panel.innerHTML =
        '<div class="d-flex align-items-center gap-3"><span class="zp-stat-icon" style="width:44px;height:44px;background:#eef2ff;color:#4f46e5;font-size:1.2rem"><i class="fa-solid fa-users"></i></span>' +
        '<div class="min-w-0"><div class="fw-bold" style="font-size:.82rem">Partner Growth</div>' +
        '<div class="text-muted" style="font-size:.68rem">' + newThisQuarter + ' new partners in the last 90 days</div></div></div>' +
        '<div class="d-flex align-items-center gap-3 mt-3 pt-3 border-top"><div class="zp-ring" style="--p:' + d.pct(e.commission, target) + '%"><span>' + d.pct(e.commission, target) + '%</span></div>' +
        '<div class="min-w-0"><div class="fw-bold" style="font-size:.74rem">Commission vs target</div>' +
        '<div class="text-muted" style="font-size:.66rem">' + d.money(e.commission) + ' of ' + d.money(target) + '</div></div></div>' +
        '<div class="mt-3"><div class="d-flex justify-content-between" style="font-size:.66rem"><span class="text-muted fw-semibold">Payouts settled</span>' +
        '<span class="fw-bold text-success">' + d.pct(e.paid, e.commission) + '%</span></div>' +
        '<div class="zp-progress mt-1" style="background:#eef0f6"><span style="width:' + d.pct(e.paid, e.commission) + '%;background:linear-gradient(90deg,#34d399,#38bdf8)"></span></div></div>';
    }

    const badge = $$('.zp-card-title .badge').find(function (b) { return /ZenPartners|Partners/.test(b.parentElement.textContent); });
    if (badge) badge.textContent = String(partners.length);
    const count = $('#table-count');
    if (count) count.textContent = 'Showing ' + Math.min(8, partners.length) + ' of ' + partners.length + ' partners';
    const pager = $('#page-next');
    if (pager && pager.parentElement) pager.parentElement.style.display = partners.length > 8 ? '' : 'none';

    // Partner growth chart → cumulative partners per month (Added_Time).
    const growthTitle = $$('.zp-card-title').find(function (t) { return /Partner Growth|ZenPartner Growth/.test(t.textContent); });
    if (growthTitle) {
      const box = growthTitle.closest('.zp-card');
      const perMonth = d.MONTHS.map(function () { return 0; });
      partners.forEach(function (p) {
        const dt = d.parseDate(field(p, 'Added_Time'));
        if (dt && dt.getFullYear() === now.getFullYear()) perMonth[dt.getMonth()] += 1;
      });
      let running = 0;
      const cumulative = perMonth.map(function (v) { running += v; return running || partners.length; });
      box.innerHTML = head('Partner Growth', '<span class="badge bg-secondary-subtle text-secondary rounded">' + now.getFullYear() + '</span>') +
        lineChart([cumulative], ['#4f46e5'], 160, d.MONTHS);
    }

    // "Projects by Status" → referrals by pipeline stage.
    const projTitle = $$('.zp-card-title').find(function (t) { return /Projects by Status/.test(t.textContent); });
    if (projTitle) {
      const box = projTitle.closest('.zp-card');
      const pipe = d.pipeline(all);
      box.innerHTML = '<h3 class="zp-card-title">Referrals by Stage</h3>' +
        '<div class="d-flex flex-wrap gap-3 mt-2 align-items-center">' +
        donut(pipe.map(function (p) { return p.count; }), pipe.map(function (p) { return p.color; }), String(all.length), 'Total', 110) +
        '<div class="flex-grow-1 d-flex flex-column gap-1" style="font-size:.66rem">' +
        pipe.map(function (p) {
          return '<div class="d-flex justify-content-between"><span class="d-flex align-items-center gap-1"><span style="width:7px;height:7px;border-radius:99px;background:' + p.color + '"></span>' + esc(p.key) + '</span><b>' + p.count + '</b></div>';
        }).join('') + '</div></div>';
    }

    // Top performing partners by commission.
    const topTitle = $$('.zp-card-title').find(function (t) { return /Top Performing/.test(t.textContent); });
    if (topTitle) {
      const box = topTitle.closest('.zp-card');
      const ranked = partners.map(function (p) {
        const s = (stats && stats[p.ID]) || { earnings: 0, leads: 0 };
        return { p: p, earnings: s.earnings, leads: s.leads };
      }).sort(function (a, b) { return b.earnings - a.earnings || b.leads - a.leads; }).slice(0, 5);
      box.innerHTML = head('Top Performing', '<a href="partners.html" class="zp-card-link">View All</a>') +
        '<div class="d-flex flex-column gap-1 mt-2">' +
        (ranked.length ? ranked.map(function (r, i) {
          return '<div class="d-flex align-items-center gap-2"><span class="text-muted fw-bold" style="width:14px">' + (i + 1) + '</span>' +
            '<img src="' + esc(Z().imageUrl(r.p.Profile_Image) || Z().DEFAULT_AVATAR) + '" style="width:24px;height:24px;border-radius:50%;object-fit:cover" alt="">' +
            '<span class="flex-grow-1 fw-semibold text-truncate" style="font-size:.72rem">' + esc(Z().partnerLabel(r.p)) + '</span>' +
            '<span class="fw-bold" style="font-size:.72rem">' + d.moneyShort(r.earnings) + '</span></div>';
        }).join('') : '<span class="text-muted small">No partners yet</span>') + '</div>';
    }

    // Recent activity across the whole program.
    const recentTitle = $$('.zp-card-title').find(function (t) { return /Recent Activity/.test(t.textContent); });
    if (recentTitle) {
      const box = recentTitle.closest('.zp-card');
      const feed = d.activities({ tasks: tasks, referrals: referrals, taken: [], documents: [] }).slice(0, 5);
      box.innerHTML = head('Recent Activity', '<a href="admin-tickets.html" class="zp-card-link">View All</a>') +
        '<div class="d-flex flex-column gap-2 mt-2">' +
        (feed.length ? feed.map(function (it) {
          return '<div class="d-flex gap-2"><span class="zp-stat-icon ' + it.tint + ' flex-shrink-0" style="width:28px;height:28px;font-size:.8rem"><i class="fa-solid ' + it.icon + '"></i></span>' +
            '<div><div class="fw-semibold text-truncate" style="font-size:.72rem;max-width:190px">' + esc(it.title + ' · ' + it.detail) + '</div>' +
            '<div class="text-muted" style="font-size:.62rem">' + esc(d.fmtDateShort(it.when) + ', ' + d.fmtTime(it.when)) + '</div></div></div>';
        }).join('') : '<span class="text-muted small">No activity yet</span>') + '</div>';
    }

    // Recent follow ups → most recently touched tasks.
    const followTitle = $$('.zp-card-title').find(function (t) { return /Recent Follow Ups/.test(t.textContent); });
    if (followTitle) {
      const box = followTitle.closest('.zp-card');
      const rows = tasks.slice().sort(function (a, b) { return d.recordDate(b) - d.recordDate(a); }).slice(0, 3);
      box.innerHTML = head('Recent Follow Ups', '<a href="admin-tickets.html" class="zp-card-link">View All</a>') +
        '<div class="d-flex flex-column gap-2 mt-2">' +
        (rows.length ? rows.map(function (t, i) {
          const who = Z().lookupName(t.Partner_Name) || 'Partner';
          const tints = ['tint-indigo', 'tint-sky', 'tint-amber'];
          return '<div class="d-flex gap-2"><span class="zp-stat-icon ' + tints[i % 3] + ' flex-shrink-0 rounded-circle" style="width:32px;height:32px;font-size:.7rem;font-weight:700">' +
            esc(who.split(/\s+/).slice(0, 2).map(function (x) { return x.charAt(0); }).join('').toUpperCase()) + '</span>' +
            '<div><div class="fw-semibold" style="font-size:.74rem">' + esc(field(t, 'Task_Name')) + '</div>' +
            '<div class="text-muted" style="font-size:.66rem">' + esc(who + ' · ' + d.fmtDate(d.recordDate(t))) + '</div></div></div>';
        }).join('') : '<span class="text-muted small">No tasks yet</span>') + '</div>' +
        '<a href="admin-tickets.html" class="btn btn-outline-secondary btn-sm w-100 mt-3"><i class="fa-solid fa-list-check"></i> All Tasks</a>';
    }

    // Task assignments overview table.
    const taskTitle = $$('.zp-card-title').find(function (t) { return /Task Assignments Overview/.test(t.textContent); });
    if (taskTitle) {
      const tb = taskTitle.closest('.zp-card').querySelector('tbody');
      const rows = tasks.slice().sort(function (a, b) { return d.recordDate(b) - d.recordDate(a); }).slice(0, 8);
      if (tb) tb.innerHTML = rows.length ? rows.map(function (t) {
        return '<tr><td class="fw-semibold">' + esc(field(t, 'Task_Name')) + '</td>' +
          '<td><div class="d-flex align-items-center gap-2"><span>' + esc(Z().lookupName(t.Partner_Name) || '—') + '</span></div></td>' +
          '<td class="text-secondary text-truncate" style="max-width:260px">' + esc(field(t, 'Task_Description') || '—') + '</td>' +
          '<td>' + pill(field(t, 'priority')) + '</td>' +
          '<td class="text-secondary">' + d.fmtDate(d.recordDate(t)) + '</td>' +
          '<td>' + pill(field(t, 'status')) + '</td></tr>';
      }).join('') : '<tr><td colspan="6">' + empty('No tasks', 'Tasks are created automatically when a partner is added.') + '</td></tr>';
    }
  }

  /* ══════════════════════ Profile extras ══════════════════════ */
  function profileExtras(session) {
    if (!session.partner) return;
    const d = D();
    const list = d.leads(session.referrals, session.partner);
    const e = d.earnings(list);
    const joined = field(session.partner, 'Added_Time') ||
      (list.length ? list[list.length - 1].created : null);

    const joinEl = $$('.zp-page .col').find(function (c) { return /Joined on/.test(c.textContent) && c.querySelector('.fa-calendar-days'); });
    if (joinEl) joinEl.innerHTML = '<span class="zp-stat-icon tint-indigo" style="width:28px;height:28px;font-size:.8rem"><i class="fa-solid fa-calendar-days"></i></span> Joined on ' + esc(joined ? d.fmtDate(joined) : '—');

    const tiles = [
      ['Total Referrals', String(list.length), 'from Add_Referrals'],
      ['Deals Won', String(e.wonCount), 'Closed Won'],
      ['Commission', d.money(e.commission), 'earned to date'],
      ['Conversion Rate', e.conversion + '%', 'won ÷ referrals']
    ];
    const tints = ['tint-indigo', 'tint-sky', 'tint-emerald', 'tint-rose'];
    const icons = ['fa-users', 'fa-trophy', 'fa-coins', 'fa-chart-line'];
    $$('.zp-page .row.row-cols-2.row-cols-xl-4 > .col').forEach(function (col, i) {
      const t = tiles[i];
      if (!t) return;
      col.innerHTML = '<div class="border rounded-3 p-3 h-100 text-center text-lg-start" style="background:#f8fafc">' +
        '<div class="zp-stat-icon ' + tints[i] + '" style="width:28px;height:28px"><i class="fa-solid ' + icons[i] + '"></i></div>' +
        '<div class="text-muted mt-2" style="font-size:.7rem">' + esc(t[0]) + '</div>' +
        '<div class="fs-5 fw-bold">' + t[1] + '</div>' +
        '<div class="text-muted" style="font-size:.66rem">' + esc(t[2]) + '</div></div>';
    });

    const tier = $$('.zp-page .zp-pill').find(function (el) { return /Gold Partner|Silver|Bronze/.test(el.textContent); });
    if (tier) tier.outerHTML = UI().typePill(session.type);

    $$('.zp-page .form-label').forEach(function (lab) {
      if (lab.textContent.replace('*', '').trim() !== 'Partnership Since') return;
      const input = lab.parentElement.querySelector('input');
      if (input) input.value = joined ? d.fmtDate(joined) : '';
    });

    const actTitle = $$('.zp-card-title').find(function (t) { return /Recent Activity/.test(t.textContent); });
    if (actTitle) {
      const box = actTitle.closest('.zp-card').querySelector('.zp-timeline');
      const feed = d.activities({
        tasks: (session.steps || []).map(function (s) { return s.record; }).filter(Boolean).concat(session.extraTasks || []),
        referrals: session.referrals, taken: session.taken, documents: session.documents
      }).slice(0, 5);
      if (box) box.innerHTML = feed.length ? feed.map(function (it) {
        return '<div class="zp-timeline-item"><div class="fw-semibold" style="font-size:.76rem">' + esc(it.title + ' · ' + it.detail) + '</div>' +
          '<div class="text-muted" style="font-size:.68rem">' + esc(d.fmtDate(it.when) + (d.fmtTime(it.when) ? ' • ' + d.fmtTime(it.when) : '')) + '</div></div>';
      }).join('') : '<div class="text-muted small">No activity yet</div>';
    }
  }

  /* ══════════════════════ Training extras ══════════════════════ */
  function trainingExtras(session) {
    if (!session.partner) return;
    const d = D();
    const courses = session.courses || [];
    const taken = session.taken || [];
    const statusOf = function (c) {
      const t = taken.find(function (x) { return Z().lookupId(x.Course_Name) === c.ID; });
      return t ? field(t, 'status') : 'Not Started';
    };
    const done = courses.filter(function (c) { return statusOf(c) === 'Completed'; });
    const next = courses.find(function (c) { return statusOf(c) !== 'Completed'; });

    const certTitle = $$('.zp-card-title').find(function (t) { return /Certificates Earned/.test(t.textContent); });
    if (certTitle) {
      const box = certTitle.closest('.zp-card');
      box.innerHTML = head('Certificates Earned <span class="fw-normal text-muted" style="font-size:.66rem">(' + done.length + ')</span>',
        '<a href="resources.html" class="zp-card-link">Resources</a>') +
        '<div class="d-flex flex-column gap-2 mt-3">' +
        (done.length ? done.map(function (c) {
          const rec = taken.find(function (x) { return Z().lookupId(x.Course_Name) === c.ID; });
          return '<div class="d-flex align-items-center gap-3 p-2 border rounded-3"><span class="zp-stat-icon tint-indigo" style="width:36px;height:36px"><i class="fa-solid fa-award"></i></span>' +
            '<div class="flex-grow-1"><div class="fw-bold" style="font-size:.76rem">' + esc(field(c, 'Course_Name')) + '</div>' +
            '<div class="text-muted" style="font-size:.68rem">Completed ' + esc(rec ? d.fmtDate(d.recordDate(rec)) : '') + '</div></div></div>';
        }).join('') : '<div class="text-muted small">Complete a course to earn your first certificate.</div>') + '</div>';
    }

    const upTitle = $$('.zp-card-title').find(function (t) { return /Upcoming Learning/.test(t.textContent); });
    if (upTitle) {
      const box = upTitle.closest('.zp-card');
      box.innerHTML = head('Next Course', '<a href="training.html" class="zp-card-link">All Courses</a>') +
        (next ? '<div class="d-flex gap-3 align-items-center p-3 rounded-3 border mt-3" style="background:#f8fafc">' +
          '<div class="bg-white border rounded-3 text-center px-3 py-2 flex-shrink-0"><div class="text-primary fw-bold" style="font-size:.6rem;letter-spacing:.1em">STEP</div>' +
          '<div class="fs-4 fw-bold">' + (courses.indexOf(next) + 1) + '</div></div>' +
          '<div class="flex-grow-1"><div class="fw-bold" style="font-size:.76rem">' + esc(field(next, 'Course_Name')) + '</div>' +
          '<div class="text-muted" style="font-size:.68rem">' + esc(statusOf(next)) + ' · ' + esc(field(next, 'Description') || 'Partner course') + '</div></div>' +
          '<button class="btn btn-sm btn-outline-primary" data-zp data-course="' + esc(next.ID) + '" data-url="' + esc(Z().urlValue(next.Url) || field(next, 'Url')) + '">Start</button></div>'
          : '<div class="mt-3">' + empty('All courses complete', 'You have finished every Partner Course record.') + '</div>');
    }

    const lrTitle = $$('.zp-card-title').find(function (t) { return /Learning Resources/.test(t.textContent); });
    if (lrTitle) {
      const box = lrTitle.closest('.zp-card');
      const docs = session.documents || [];
      const groups = [
        ['Guides', docs.filter(function (x) { return /guide|playbook|agreement/i.test(field(x, 'Document_Name')); }).length, 'fa-book'],
        ['Decks', docs.filter(function (x) { return /present|portfolio|deck/i.test(field(x, 'Document_Name')); }).length, 'fa-chalkboard'],
        ['Other', docs.length, 'fa-folder-open']
      ];
      box.innerHTML = head('Learning Resources', '<a href="resources.html" class="zp-card-link">View All</a>') +
        '<div class="row row-cols-3 g-2 mt-2">' + groups.map(function (g) {
          return '<div class="col"><a href="resources.html" class="border rounded-3 p-2 d-block text-center text-decoration-none hover-lift">' +
            '<span class="zp-stat-icon tint-indigo mx-auto" style="width:32px;height:32px"><i class="fa-solid ' + g[2] + '"></i></span>' +
            '<div class="fw-bold mt-2" style="font-size:.7rem">' + g[0] + '</div>' +
            '<div class="text-muted" style="font-size:.64rem">' + g[1] + '</div></a></div>';
        }).join('') + '</div>';
    }
  }

  /* ══════════════════════ Resources extras ══════════════════════ */
  function docCategory(name) {
    const n = (name || '').toLowerCase();
    if (/nda|agreement|legal/.test(n)) return 'Legal';
    if (/commission|finance|payout|invoice/.test(n)) return 'Finance';
    if (/brand|market/.test(n)) return 'Marketing';
    if (/playbook|sales|portfolio|deck/.test(n)) return 'Sales';
    if (/product|roadmap|solution/.test(n)) return 'Product';
    return 'Partner Guides';
  }

  function resourcesExtras(session) {
    const d = D();
    const docs = session.documents || [];
    const now = new Date();
    const newThisMonth = docs.filter(function (x) {
      const dt = d.recordDate(x);
      return dt.getMonth() === now.getMonth() && dt.getFullYear() === now.getFullYear();
    }).length;
    const latest = docs.slice().sort(function (a, b) { return d.recordDate(b) - d.recordDate(a); });

    const heroPill = $('.zp-page .zp-pill.zp-pill--indigo');
    if (heroPill) heroPill.innerHTML = '<i class="fa-solid fa-database me-1"></i>' + docs.length + ' documents from Partner_Documents';
    const chips = $$('.zp-page .border.rounded-3.px-3.py-2 .fs-5.fw-bold.lh-1');
    const chipVals = [String(docs.length), String(newThisMonth), latest[0] ? d.fmtDateShort(d.recordDate(latest[0])) : '—'];
    const chipLabels = ['Total Resources', 'New This Month', 'Last Upload'];
    chips.forEach(function (el, i) {
      if (chipVals[i] === undefined) return;
      el.parentElement.innerHTML = '<div class="fs-5 fw-bold lh-1">' + esc(chipVals[i]) + '</div>' +
        '<div class="text-muted" style="font-size:.66rem">' + esc(chipLabels[i]) + '</div>';
    });
    $$('.zp-page .pagination, .zp-page nav').forEach(function (p) { if (docs.length <= 12) p.style.display = 'none'; });
    $$('.zp-page .zp-pill').forEach(function (p) {
      if (/\+\d+ new/.test(p.textContent)) p.textContent = '+' + newThisMonth + ' this month';
    });

    const CATS = [
      { key: 'Marketing', icon: 'fa-bullhorn', color: '#7c3aed' },
      { key: 'Sales', icon: 'fa-briefcase', color: '#059669' },
      { key: 'Partner Guides', icon: 'fa-users', color: '#0284c7' },
      { key: 'Legal', icon: 'fa-shield-halved', color: '#ea580c' },
      { key: 'Product', icon: 'fa-box', color: '#4f46e5' },
      { key: 'Finance', icon: 'fa-file-lines', color: '#0891b2' }
    ];
    const counts = {};
    docs.forEach(function (x) {
      const c = docCategory(field(x, 'Document_Name'));
      counts[c] = (counts[c] || 0) + 1;
    });

    const quickTitle = $$('.zp-card-title').find(function (t) { return /Quick Access/.test(t.textContent); });
    if (quickTitle) {
      const grid = quickTitle.closest('.zp-card').querySelector('.row');
      if (grid) grid.innerHTML = CATS.map(function (c) {
        return '<div class="col"><a href="#" data-cat="' + esc(c.key) + '" class="border rounded-3 p-2 d-block text-center text-decoration-none hover-lift">' +
          '<span class="zp-stat-icon mx-auto" style="width:34px;height:34px;background:' + c.color + ';color:#fff"><i class="fa-solid ' + c.icon + '"></i></span>' +
          '<div class="fw-bold mt-2" style="font-size:.68rem">' + esc(c.key) + '</div>' +
          '<div class="text-muted" style="font-size:.64rem">' + (counts[c.key] || 0) + '</div></a></div>';
      }).join('');
    }

    const catTitle = $$('.zp-card-title').find(function (t) { return /Resource Categories/.test(t.textContent); });
    if (catTitle) {
      const box = catTitle.closest('.zp-card');
      box.innerHTML = head('Resource Categories', '<span class="text-muted" style="font-size:.68rem">' + docs.length + ' files</span>') +
        '<div class="d-flex flex-column gap-1 mt-3">' + CATS.map(function (c) {
          return '<div class="d-flex align-items-center gap-3 p-2 rounded-3">' +
            '<span class="zp-stat-icon" style="width:36px;height:36px;background:' + c.color + ';color:#fff"><i class="fa-solid ' + c.icon + '"></i></span>' +
            '<span class="flex-grow-1 fw-semibold" style="font-size:.74rem">' + esc(c.key) + '</span>' +
            '<span class="fw-bold">' + (counts[c.key] || 0) + '</span></div>';
        }).join('') + '</div>';
    }

    const allTitle = $$('.zp-card-title').find(function (t) { return /All Resources/.test(t.textContent); });
    if (allTitle) {
      allTitle.innerHTML = 'All Resources <span class="text-muted fw-semibold">(' + docs.length + ')</span>';
      const sub = allTitle.parentElement && allTitle.parentElement.querySelector('.text-muted:not(.fw-semibold)');
      if (sub && /updated/i.test(sub.textContent)) {
        sub.textContent = 'From Partner_Documents — last updated ' + (latest[0] ? d.fmtDate(d.recordDate(latest[0])) : '—');
      }
    }
    const showing = $$('.zp-page span, .zp-page div').find(function (el) { return /^Showing 1[–-]\d+ of \d+ resources$/.test(el.textContent.trim()); });
    if (showing) showing.textContent = 'Showing ' + docs.length + ' of ' + docs.length + ' resources';

    const recentTitle = $$('.zp-card-title').find(function (t) { return /Recently Added/.test(t.textContent); });
    if (recentTitle) {
      const box = recentTitle.closest('.zp-card');
      box.innerHTML = head('Recently Added', '<a href="resources.html" class="zp-card-link">View All</a>') +
        '<div class="d-flex flex-column gap-2 mt-3">' +
        (latest.slice(0, 3).map(function (x) {
          return '<div class="d-flex gap-3 p-2 border rounded-3 align-items-center"><span class="zp-stat-icon tint-rose" style="width:32px;height:32px"><i class="fa-solid fa-file-lines"></i></span>' +
            '<div class="flex-grow-1"><div class="fw-bold" style="font-size:.74rem">' + esc(field(x, 'Document_Name')) + '</div>' +
            '<div class="text-muted" style="font-size:.66rem">' + esc(d.fmtDate(d.recordDate(x)) + ' • ' + docCategory(field(x, 'Document_Name'))) + '</div></div></div>';
        }).join('') || '<div class="text-muted small">No documents yet</div>') + '</div>';
    }
  }

  /* ══════════════════════ Referral extras ══════════════════════ */
  function referralExtras(session) {
    if (!session.partner) return;
    const d = D();
    const list = d.leads(session.referrals, session.partner);
    const pipe = d.pipeline(list);

    const tiles = $$('.zp-page .row.row-cols-2.row-cols-md-5 > .col');
    tiles.forEach(function (col, i) {
      const s = pipe[i];
      if (!s) return;
      const lab = col.querySelector('.text-muted');
      const val = col.querySelector('.fw-bold');
      if (lab) lab.textContent = s.key;
      if (val) val.textContent = String(s.count);
    });

    const overviewTitle = $$('.zp-card-title').find(function (t) { return /Referral Overview/.test(t.textContent); });
    if (overviewTitle) {
      const box = overviewTitle.closest('.zp-card');
      const donutWrap = box.querySelector('.position-relative.flex-shrink-0');
      if (donutWrap) {
        donutWrap.outerHTML = donut(pipe.map(function (p) { return p.count; }), pipe.map(function (p) { return p.color; }), String(list.length), 'Referrals', 110);
      }
      const legend = box.querySelector('.flex-grow-1.d-flex.flex-column.gap-1');
      if (legend) {
        legend.innerHTML = pipe.map(function (p) {
          return '<div class="d-flex align-items-center gap-2"><span style="width:8px;height:8px;border-radius:99px;background:' + p.color + '"></span>' +
            '<span class="flex-grow-1">' + esc(p.key) + '</span><span class="text-muted">' + p.count + '</span></div>';
        }).join('');
      }
      const svcTitle = Array.prototype.slice.call(box.querySelectorAll('.zp-card-title')).find(function (t) { return /Top Services/.test(t.textContent); });
      if (svcTitle) {
        const svcBox = svcTitle.parentElement.querySelector('.d-flex.flex-column.gap-2');
        const groups = d.groupSum(list, function (l) { return l.service; }, function (l) { return l.value; }).slice(0, 5);
        if (svcBox) svcBox.innerHTML = groups.length ? groups.map(function (g, i) {
          return '<div><div class="d-flex justify-content-between" style="font-size:.7rem"><span>' + esc(g.key) + '</span><span class="text-muted">' + g.count + '</span></div>' +
            '<div class="zp-progress mt-1"><span style="width:' + d.pct(g.count, list.length) + '%;background:' + PALETTE[i % PALETTE.length] + '"></span></div></div>';
        }).join('') : '<div class="text-muted small">No referrals yet</div>';
      }
    }

    const tbody = $('.zp-page .zp-table tbody');
    if (tbody) {
      tbody.innerHTML = list.length ? list.map(function (l) {
        return '<tr><td class="text-secondary fw-semibold">' + esc(l.code) + '</td>' +
          '<td><div class="fw-bold">' + esc(l.company) + '</div><div class="text-muted" style="font-size:.68rem">' + esc(l.contact) + '</div></td>' +
          '<td><span class="zp-pill no-dot zp-pill--violet">' + esc(l.service) + '</span></td>' +
          '<td class="fw-semibold">' + d.money(l.value) + '</td>' +
          '<td><span class="zp-pill no-dot ' + l.tint + '">' + esc(l.stage) + '</span></td>' +
          '<td class="text-secondary">' + esc(session.name) + '</td>' +
          '<td class="text-secondary">' + d.fmtDate(l.created) + '</td>' +
          '<td class="text-end"><a href="leads.html?lead=' + encodeURIComponent(l.id) + '" class="row-action" title="View"><i class="fa-solid fa-eye"></i></a></td></tr>';
      }).join('') : '<tr><td colspan="8">' + empty('No referrals yet', 'Submit the form to create an Add_Referrals record.') + '</td></tr>';
    }
    const total = $('#ref-total');
    if (total) total.textContent = String(list.length);
    const showing = total && total.parentElement;
    if (showing) showing.innerHTML = 'Showing ' + list.length + ' of <span id="ref-total">' + list.length + '</span> entries';

    const valueSel = $('#ref-value');
    if (valueSel) {
      valueSel.innerHTML = '<option value="">Auto from rate card</option>' +
        Object.keys(d.CONFIG.rateCard).map(function (k) { return '<option value="' + esc(k) + '">' + esc(k) + ' · ' + d.money(d.CONFIG.rateCard[k]) + '</option>'; }).join('');
      valueSel.disabled = true;
      valueSel.title = 'Estimated value is derived from the selected service';
    }
  }

  /* ══════════════════════ Admin partner view extras ══════════════════════ */
  async function partnerViewExtras(session) {
    const d = D();
    const list = d.leads(session.referrals, session.partner);
    const e = d.earnings(list);
    const joined = field(session.partner, 'Added_Time') || (list.length ? list[list.length - 1].created : null);

    const kpiCols = $$('.zp-page .row.row-cols-1.row-cols-md-3 > .col');
    const kpis = [
      ['Total Leads', String(list.length), list.filter(function (l) { return !l.won; }).length + ' open'],
      ['Total Commission', d.money(e.commission), e.wonCount + ' deals won'],
      ['Pending Earnings', d.money(e.pending), e.paidRows.length + ' payouts settled']
    ];
    kpiCols.forEach(function (col, i) {
      const k = kpis[i];
      if (!k) return;
      col.innerHTML = '<div class="border rounded-3 p-3 h-100" style="background:#f8fafc">' +
        '<div class="text-muted" style="font-size:.7rem">' + esc(k[0]) + '</div>' +
        '<div class="d-flex align-items-baseline gap-2 mt-1"><span class="fs-3 fw-bold">' + k[1] + '</span></div>' +
        '<div class="text-muted" style="font-size:.66rem">' + esc(k[2]) + '</div></div>';
    });

    $$('.zp-page .zp-info-row').forEach(function (row) {
      const lab = row.querySelector('.zp-info-label');
      const val = row.querySelector('.zp-info-value, .zp-pill');
      if (!lab || !val) return;
      const key = lab.textContent.trim();
      if (key === 'Joined On') val.textContent = joined ? d.fmtDate(joined) : '—';
      if (key === 'Industry') val.textContent = session.industries.join(', ') || '—';
      if (key === 'Tax ID / EIN') { lab.textContent = 'Services'; val.textContent = session.services.join(', ') || '—'; }
      if (key === 'Partner Level') val.textContent = session.type || '—';
      if (key === 'KYC Status') { val.outerHTML = pill(session.onboard.allDone ? 'Verified' : 'Pending'); }
      if (key === 'Payment Terms') { lab.textContent = 'Commission Rate'; val.textContent = Math.round(d.commissionRate(session.partner) * 100) + '%'; }
      if (key === 'Address') val.textContent = session.address || '—';
    });

    const perfTitle = $$('.zp-card-title').find(function (t) { return /Performance Overview/.test(t.textContent); });
    if (perfTitle) {
      const box = perfTitle.closest('.zp-card');
      const leadsMonthly = d.monthlySeries(list, function () { return 1; }).map(function (m) { return m.count; });
      const commMonthly = e.byMonth.map(function (m) { return m.value; });
      box.innerHTML = head('Performance Overview', '<span class="zp-pill no-dot zp-pill--slate">' + new Date().getFullYear() + '</span>') +
        '<div class="d-flex gap-3 mt-2" style="font-size:.66rem">' +
        '<span class="d-flex align-items-center gap-1"><span style="width:8px;height:8px;border-radius:99px;background:#4f46e5"></span>Leads</span>' +
        '<span class="d-flex align-items-center gap-1"><span style="width:8px;height:8px;border-radius:99px;background:#10b981"></span>Commission</span></div>' +
        lineChart([leadsMonthly, commMonthly], ['#4f46e5', '#10b981'], 200, d.MONTHS) +
        '<div class="row row-cols-2 row-cols-sm-4 g-2 mt-2 pt-2 border-top">' +
        [['Leads', list.length], ['Won', e.wonCount], ['Commission', d.moneyShort(e.commission)], ['Conversion', e.conversion + '%']].map(function (x) {
          return '<div class="col"><div class="text-muted" style="font-size:.62rem">' + x[0] + '</div><div class="fw-bold">' + x[1] + '</div></div>';
        }).join('') + '</div>';
    }

    const actTitle = $$('.zp-card-title').find(function (t) { return /Recent Activity/.test(t.textContent); });
    if (actTitle) {
      const box = actTitle.closest('.zp-card');
      const feed = d.activities({
        tasks: (session.steps || []).map(function (s) { return s.record; }).filter(Boolean).concat(session.extraTasks || []),
        referrals: session.referrals, taken: session.taken, documents: []
      }).slice(0, 5);
      box.innerHTML = head('Recent Activity', '<a href="admin-tickets.html" class="zp-card-link">View All</a>') +
        '<div class="d-flex flex-column gap-3 mt-3">' + (feed.length ? feed.map(function (it) {
          return '<div class="d-flex gap-2"><span class="zp-stat-icon ' + it.tint + ' flex-shrink-0" style="width:28px;height:28px;font-size:.8rem"><i class="fa-solid ' + it.icon + '"></i></span>' +
            '<div><div class="fw-semibold" style="font-size:.74rem">' + esc(it.title + ' · ' + it.detail) + '</div>' +
            '<div class="text-muted" style="font-size:.66rem">' + esc(d.fmtDate(it.when) + (d.fmtTime(it.when) ? ' ' + d.fmtTime(it.when) : '')) + '</div></div></div>';
        }).join('') : '<div class="text-muted small">No activity yet</div>') + '</div>';
    }

    const earnTitle = $$('.zp-card-title').find(function (t) { return /Earnings Summary/.test(t.textContent); });
    if (earnTitle) {
      const box = earnTitle.closest('.zp-card');
      box.innerHTML = '<div class="d-flex align-items-center gap-2 p-3"><h3 class="zp-card-title">Earnings Summary</h3>' +
        '<a href="admin-payouts.html" class="zp-card-link ms-auto">All Payouts</a></div>' +
        '<div class="row row-cols-3 g-0 border-top">' +
        '<div class="col p-3 border-end"><div class="text-muted" style="font-size:.62rem">Total Commission</div><div class="fw-bold mt-1">' + d.money(e.commission) + '</div></div>' +
        '<div class="col p-3 border-end"><div class="text-muted" style="font-size:.62rem">Paid to Date</div><div class="fw-bold mt-1 text-success">' + d.money(e.paid) + '</div></div>' +
        '<div class="col p-3"><div class="text-muted" style="font-size:.62rem">Pending</div><div class="fw-bold mt-1 text-warning">' + d.money(e.pending) + '</div></div></div>' +
        '<div class="p-3"><div class="text-uppercase text-muted fw-bold" style="font-size:.62rem">Commission by Deal</div></div>' +
        '<div class="table-responsive"><table class="zp-table"><thead><tr><th>Deal</th><th class="text-end">Amount</th><th>Won On</th><th>Status</th></tr></thead><tbody>' +
        (e.wonCount ? list.filter(function (l) { return l.won; }).map(function (l) {
          return '<tr><td class="text-secondary">' + esc(l.company) + '</td><td class="text-end fw-bold">' + d.money(l.commission) + '</td>' +
            '<td class="text-secondary">' + d.fmtDate(l.wonOn) + '</td><td>' + pill(l.paid ? 'Paid' : 'Pending') + '</td></tr>';
        }).join('') : '<tr><td colspan="4">' + empty('No commission yet', '') + '</td></tr>') + '</tbody></table></div>';
    }
  }

  /* ══════════════════════ Admin onboarding extras ══════════════════════ */
  function adminOnboardingExtras(partners, tasks, rows) {
    const d = D();
    const now = new Date();
    const rangeBtn = $$('.zp-page .btn').find(function (b) { return b.querySelector('.fa-calendar-days'); });
    if (rangeBtn) rangeBtn.innerHTML = '<i class="fa-solid fa-calendar-days"></i> ' + esc(d.monthRangeLabel(now));

    const levelSel = document.getElementById('level-filter');
    if (levelSel) levelSel.innerHTML = '<option value="all">Partner Type: All</option>' +
      Z().PARTNER_TYPES.map(function (t) { return '<option value="' + esc(t) + '">' + esc(t) + '</option>'; }).join('');

    const completed = rows.filter(function (r) { return r.overall === 'Completed'; }).length;
    const inProgress = rows.filter(function (r) { return r.overall === 'In Progress'; }).length;
    const pending = rows.filter(function (r) { return r.overall === 'Pending'; }).length;

    $$('.zp-stat').forEach(function (cardEl) {
      const delta = cardEl.querySelector('.zp-stat-delta');
      const label = cardEl.querySelector('.zp-stat-label');
      if (delta && label) delta.innerHTML = '<span class="muted">' + esc(label.textContent.trim()) + ' · live</span>';
    });

    const distTitle = $$('.zp-card-title').find(function (t) { return /Status Distribution/.test(t.textContent); });
    if (distTitle) {
      const box = distTitle.closest('.zp-card');
      box.innerHTML = '<h3 class="zp-card-title">Status Distribution</h3>' +
        '<div class="d-flex flex-wrap gap-3 mt-3 align-items-center">' +
        donut([completed, inProgress, pending], ['#10b981', '#2563eb', '#f97316'], String(partners.length), 'Partners', 110) +
        '<div class="flex-grow-1 d-flex flex-column gap-2" style="font-size:.7rem">' +
        [['Completed', completed, '#10b981'], ['In Progress', inProgress, '#2563eb'], ['Pending', pending, '#f97316']].map(function (x) {
          return '<div class="d-flex justify-content-between"><span class="d-flex align-items-center gap-1"><span style="width:8px;height:8px;border-radius:99px;background:' + x[2] + '"></span>' + x[0] + '</span><b>' + x[1] + '</b></div>';
        }).join('') + '</div></div>';
    }

    const avgTitle = $$('.zp-card-title').find(function (t) { return /Avg\. Completion Time/.test(t.textContent); });
    if (avgTitle) {
      const box = avgTitle.closest('.zp-card');
      const durations = rows.filter(function (r) { return r.o.allDone; }).map(function (r) {
        const dates = r.steps.map(function (s) { return d.parseDate(s.date); }).filter(Boolean).sort(function (a, b) { return a - b; });
        return dates.length > 1 ? Math.max(0, (dates[dates.length - 1] - dates[0]) / 86400000) : 0;
      });
      const avg = durations.length ? Math.round(durations.reduce(function (a, b) { return a + b; }, 0) / durations.length * 10) / 10 : 0;
      const tasksDone = tasks.filter(function (t) { return field(t, 'status') === 'Completed'; }).length;
      box.innerHTML = '<h3 class="zp-card-title">Onboarding Throughput</h3>' +
        '<div class="p-3 rounded-3 border mt-3" style="background:#f8fafc"><div class="text-muted" style="font-size:.68rem"><i class="fa-solid fa-clock me-1 text-primary"></i>Avg. days to finish all 5 tasks</div>' +
        '<div class="fs-3 fw-bold mt-1">' + avg + ' <span class="fs-6 text-secondary">Days</span></div></div>' +
        '<div class="p-3 rounded-3 border mt-2" style="background:#f8fafc"><div class="text-muted" style="font-size:.68rem"><i class="fa-solid fa-shield-halved me-1 text-success"></i>Tasks completed</div>' +
        '<div class="fs-3 fw-bold mt-1">' + tasksDone + ' <span class="fs-6 text-secondary">of ' + tasks.length + '</span></div></div>';
    }

    const dropTitle = $$('.zp-card-title').find(function (t) { return /Drop Off Analysis/.test(t.textContent); });
    if (dropTitle) {
      const box = dropTitle.closest('.zp-card');
      const defs = Z().ONBOARD_TASKS;
      box.innerHTML = '<h3 class="zp-card-title">Drop Off Analysis</h3><div class="d-flex flex-column gap-2 mt-3">' +
        defs.slice(0, 4).map(function (def, i) {
          const reached = rows.filter(function (r) { return r.steps[i] && r.steps[i].done; }).length;
          const nextDone = rows.filter(function (r) { return r.steps[i + 1] && r.steps[i + 1].done; }).length;
          const drop = Math.max(0, reached - nextDone);
          return '<div><div class="d-flex justify-content-between" style="font-size:.66rem"><span>After ' + esc(def.name) + '</span><b>' + drop + '</b></div>' +
            '<div class="zp-progress mt-1"><span style="width:' + d.pct(drop, partners.length || 1) + '%;background:#4b5480"></span></div></div>';
        }).join('') + '<a href="partners.html" class="text-primary fw-bold mt-2" style="font-size:.7rem">Open All Partners →</a></div>';
    }
  }


  /* ══════════════════════ Topbar chrome (notifications / messages) ══════════════════════ */
  function chromeExtras(bundle, opts) {
    const d = D();
    const o = opts || {};
    const items = d.activities({
      tasks: bundle.tasks || [], referrals: bundle.referrals || [],
      taken: bundle.taken || [], documents: bundle.documents || []
    }).slice(0, 6);

    const chip = document.getElementById('admin-date-chip');
    if (chip) chip.innerHTML = '<i class="fa-solid fa-calendar-days"></i> ' + esc(d.monthRangeLabel(new Date()));

    const menus = $$('#app-topbar .dropdown-menu');
    const notif = menus[0];
    if (notif) {
      const list = notif.querySelector('.mt-1');
      if (list) list.innerHTML = items.length ? items.map(function (it, i) {
        return '<div class="dropdown-item' + (i === 0 ? ' bg-light rounded' : '') + '">' +
          '<i class="fa-solid ' + it.icon + ' text-primary"></i><div>' +
          '<div class="fw-medium" style="font-size:.76rem">' + esc(it.title + ' — ' + it.detail) + '</div>' +
          '<div class="text-muted" style="font-size:.7rem">' + esc(d.fmtDate(it.when) + (d.fmtTime(it.when) ? ' ' + d.fmtTime(it.when) : '')) + '</div></div></div>';
      }).join('') : '<div class="dropdown-item text-muted" style="font-size:.76rem">No notifications</div>';
    }
    const msgs = menus[1];
    if (msgs) {
      const contacts = (bundle.referrals || []).slice(0, 4);
      Array.prototype.slice.call(msgs.querySelectorAll('.dropdown-item')).forEach(function (el) { el.remove(); });
      msgs.insertAdjacentHTML('beforeend', contacts.length ? contacts.map(function (r) {
        return '<div class="dropdown-item"><span class="zp-stat-icon tint-sky" style="width:32px;height:32px;font-size:.75rem"><i class="fa-solid fa-user"></i></span>' +
          '<div><div class="fw-semibold" style="font-size:.76rem">' + esc(field(r, 'Contact_Person') || field(r, 'Company_Name')) + '</div>' +
          '<div class="text-muted text-truncate" style="font-size:.7rem">' + esc(field(r, 'Email') || '—') + '</div></div></div>';
      }).join('') : '<div class="dropdown-item text-muted" style="font-size:.76rem">No referral contacts</div>');
    }
    const badges = $$('#app-topbar .zp-badge-dot');
    const openCount = (bundle.tasks || []).filter(function (t) { return field(t, 'status') !== 'Completed' && field(t, 'status') !== 'Cancelled'; }).length;
    if (badges[0]) { badges[0].textContent = String(openCount); badges[0].style.display = openCount ? '' : 'none'; }
    if (badges[1]) {
      const n = (bundle.referrals || []).length;
      badges[1].textContent = String(n);
      badges[1].style.display = n ? '' : 'none';
    }
    if (o.title) {
      const t = $('#app-topbar .zp-page-title');
      if (t) t.textContent = o.title;
    }
  }

  global.ZPPages = {
    leads: leadsPage,
    chromeExtras: chromeExtras,
    profileExtras: profileExtras,
    trainingExtras: trainingExtras,
    resourcesExtras: resourcesExtras,
    referralExtras: referralExtras,
    partnerViewExtras: partnerViewExtras,
    adminOnboardingExtras: adminOnboardingExtras,
    activities: activitiesPage,
    earnings: earningsPage,
    reports: reportsPage,
    adminPayouts: adminPayoutsPage,
    adminKpis: adminKpis,
    adminDashboardExtras: adminDashboardExtras,
    adminTickets: adminTicketsPage,
    dashboardExtras: dashboardExtras
  };
})(window);
