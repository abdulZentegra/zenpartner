// ═══════════════════════════════════════════════════════════════════════════
// ZenPartner — derived business data layer  (window.ZPData)
//
// The zenpartner Creator app only stores six forms:
//   Partner_Details · Add_Referrals · Task · Partner_Courses ·
//   Partner_Course_Taken · Partner_Documents
//
// Pages such as Leads, Activities, Earnings, Reports, Admin Payouts and
// Admin Tickets have NO dedicated form yet, so every number they show is
// DERIVED from the records above using the rule-set in CONFIG below.
// Nothing on any page is hard-coded — change CONFIG (or add the real fields
// in Creator and map them in the readers) and every page follows.
// ═══════════════════════════════════════════════════════════════════════════

(function (global) {
  'use strict';

  const CONFIG = {
    currency: { code: 'INR', symbol: '₹', locale: 'en-IN' },

    // Deal size per "Project / Service Interest" value on Add_Referrals.
    rateCard: {
      'Website Development': 450000,
      'Mobile App Development': 850000,
      'Cloud Solutions': 1200000,
      'Digital Marketing': 300000,
      'Implementation': 950000,
      'Consulting': 400000,
      'Support': 250000,
      'Training': 200000
    },
    defaultDealValue: 350000,

    // Commission % per Partner Type (Partner_Details.partner_type).
    commissionRate: {
      'Zoho Partner': 0.20,
      'Agency': 0.15,
      'Consultant': 0.12,
      'Freelancer': 0.10,
      'Business Professional': 0.10,
      'Other': 0.08
    },
    defaultCommissionRate: 0.10,

    // Pipeline stage is derived from the age of the referral record.
    stages: [
      { key: 'New', minAgeDays: 0, probability: 20, color: '#4f46e5', tint: 'zp-pill--indigo' },
      { key: 'Qualified', minAgeDays: 7, probability: 40, color: '#0ea5e9', tint: 'zp-pill--sky' },
      { key: 'Proposal', minAgeDays: 21, probability: 60, color: '#7c3aed', tint: 'zp-pill--violet' },
      { key: 'Negotiation', minAgeDays: 35, probability: 75, color: '#f59e0b', tint: 'zp-pill--amber' },
      { key: 'Closed Won', minAgeDays: 60, probability: 100, color: '#10b981', tint: 'zp-pill--emerald' }
    ],

    payout: {
      lagDays: 15,          // days after a deal is Won before commission is paid
      cycleDays: 15,        // bi-weekly payout run
      minimum: 25000,
      methods: ['Bank Transfer', 'UPI', 'PayPal']
    },

    // Task → support ticket mapping (admin Support Tickets page).
    ticketStatus: { Pending: 'Open', 'In Progress': 'In Progress', Completed: 'Resolved', Hold: 'On Hold', Cancelled: 'Closed' },
    slaHours: { Critical: 4, High: 8, Medium: 24, Low: 48 }
  };

  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const DAY = 86400000;

  function Z() { return global.ZohoAPI; }
  function field(r, n, f) { return Z() ? Z().field(r, n, f) : (r && r[n]) || f || ''; }

  /* ── formatting ─────────────────────────────────────────────────────── */
  function money(n) {
    const v = Math.round(Number(n) || 0);
    try {
      return CONFIG.currency.symbol + v.toLocaleString(CONFIG.currency.locale, { maximumFractionDigits: 0 });
    } catch (e) {
      return CONFIG.currency.symbol + v;
    }
  }

  function moneyShort(n) {
    const v = Math.round(Number(n) || 0);
    if (v >= 10000000) return CONFIG.currency.symbol + (v / 10000000).toFixed(2) + ' Cr';
    if (v >= 100000) return CONFIG.currency.symbol + (v / 100000).toFixed(2) + ' L';
    if (v >= 1000) return CONFIG.currency.symbol + (v / 1000).toFixed(1) + 'K';
    return money(v);
  }

  function pct(part, total) {
    if (!total) return 0;
    return Math.round((part / total) * 1000) / 10;
  }

  function parseDate(val) {
    if (!val) return null;
    if (val instanceof Date) return isNaN(val.getTime()) ? null : val;
    const s = String(val).trim();
    let m = s.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?/);
    if (m) {
      const mon = MONTHS.indexOf(m[2].charAt(0).toUpperCase() + m[2].slice(1, 3).toLowerCase());
      if (mon >= 0) return new Date(+m[3], mon, +m[1], +(m[4] || 0), +(m[5] || 0), +(m[6] || 0));
    }
    m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
  }

  function fmtDate(d) {
    const dt = parseDate(d);
    if (!dt) return '—';
    return MONTHS[dt.getMonth()] + ' ' + String(dt.getDate()).padStart(2, '0') + ', ' + dt.getFullYear();
  }

  function fmtDateShort(d) {
    const dt = parseDate(d);
    if (!dt) return '—';
    return MONTHS[dt.getMonth()] + ' ' + String(dt.getDate()).padStart(2, '0');
  }

  function fmtTime(d) {
    const dt = parseDate(d);
    if (!dt) return '';
    if (dt.getHours() === 0 && dt.getMinutes() === 0) return ''; // date-only record
    let h = dt.getHours();
    const ap = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return String(h).padStart(2, '0') + ':' + String(dt.getMinutes()).padStart(2, '0') + ' ' + ap;
  }

  function addDays(d, n) {
    const dt = parseDate(d) || new Date();
    return new Date(dt.getTime() + n * DAY);
  }

  function ageDays(d) {
    const dt = parseDate(d);
    if (!dt) return 0;
    return Math.max(0, Math.floor((Date.now() - dt.getTime()) / DAY));
  }

  function sameDay(a, b) {
    const x = parseDate(a), y = parseDate(b);
    if (!x || !y) return false;
    return x.toDateString() === y.toDateString();
  }

  // Best available timestamp on a Creator record.
  function recordDate(rec) {
    return parseDate(field(rec, 'Added_Time') || field(rec, 'Task_Date') || field(rec, 'Modified_Time')) || new Date();
  }

  function monthRangeLabel(d) {
    const dt = parseDate(d) || new Date();
    const first = new Date(dt.getFullYear(), dt.getMonth(), 1);
    const last = new Date(dt.getFullYear(), dt.getMonth() + 1, 0);
    return MONTHS[first.getMonth()] + ' ' + first.getDate() + ' – ' + MONTHS[last.getMonth()] + ' ' + last.getDate() + ', ' + last.getFullYear();
  }

  /* ── core derivations ───────────────────────────────────────────────── */
  function commissionRate(partner) {
    const type = field(partner, 'partner_type');
    const r = CONFIG.commissionRate[type];
    return typeof r === 'number' ? r : CONFIG.defaultCommissionRate;
  }

  function dealValue(referral) {
    const svc = field(referral, 'Project_Service_Interest');
    const v = CONFIG.rateCard[svc];
    return typeof v === 'number' ? v : CONFIG.defaultDealValue;
  }

  function stageFor(days) {
    let stage = CONFIG.stages[0];
    for (let i = 0; i < CONFIG.stages.length; i++) {
      if (days >= CONFIG.stages[i].minAgeDays) stage = CONFIG.stages[i];
    }
    return stage;
  }

  function stageIndex(key) {
    for (let i = 0; i < CONFIG.stages.length; i++) if (CONFIG.stages[i].key === key) return i;
    return 0;
  }

  // One referral record → one fully derived "lead".
  function lead(referral, partner) {
    const created = recordDate(referral);
    const days = ageDays(created);
    const st = stageFor(days);
    const value = dealValue(referral);
    const rate = commissionRate(partner);
    const won = st.key === 'Closed Won';
    const wonOn = won ? addDays(created, CONFIG.stages[CONFIG.stages.length - 1].minAgeDays) : null;
    const paid = won && ageDays(wonOn) >= CONFIG.payout.lagDays;
    const commission = value * rate;
    return {
      id: String(referral.ID || ''),
      code: 'REF-' + String(referral.ID || '').slice(-6),
      company: field(referral, 'Company_Name') || 'Unnamed company',
      contact: field(referral, 'Contact_Person'),
      email: field(referral, 'Email'),
      service: field(referral, 'Project_Service_Interest') || 'Other',
      source: field(referral, 'How_did_you_hear_about_us') || '—',
      description: field(referral, 'Project_Description'),
      partnerId: Z() ? Z().lookupId(referral.partner_id) : '',
      partnerName: Z() ? Z().lookupName(referral.partner_id) : '',
      created: created,
      ageDays: days,
      stage: st.key,
      stageIdx: stageIndex(st.key),
      color: st.color,
      tint: st.tint,
      probability: st.probability,
      won: won,
      wonOn: wonOn,
      value: value,
      rate: rate,
      commission: commission,
      earned: won ? commission : 0,
      paid: paid,
      paidOn: paid ? addDays(wonOn, CONFIG.payout.lagDays) : null,
      expectedClose: addDays(created, CONFIG.stages[CONFIG.stages.length - 1].minAgeDays)
    };
  }

  function leads(referrals, partner) {
    return (referrals || []).map(function (r) { return lead(r, partner); })
      .sort(function (a, b) { return b.created - a.created; });
  }

  // Leads for a mixed set of partners (admin views).
  function leadsForAll(referrals, partners) {
    const byId = {};
    (partners || []).forEach(function (p) { byId[p.ID] = p; });
    return (referrals || []).map(function (r) {
      const pid = Z() ? Z().lookupId(r.partner_id) : '';
      return lead(r, byId[pid] || null);
    }).sort(function (a, b) { return b.created - a.created; });
  }

  function pipeline(list) {
    return CONFIG.stages.map(function (s) {
      const rows = list.filter(function (l) { return l.stage === s.key; });
      return {
        key: s.key,
        color: s.color,
        count: rows.length,
        value: rows.reduce(function (a, l) { return a + l.value; }, 0),
        pct: pct(rows.length, list.length)
      };
    });
  }

  function groupSum(list, keyFn, valFn) {
    const map = {};
    list.forEach(function (l) {
      const k = keyFn(l) || 'Other';
      if (!map[k]) map[k] = { key: k, count: 0, value: 0 };
      map[k].count += 1;
      map[k].value += valFn ? valFn(l) : 0;
    });
    return Object.keys(map).map(function (k) { return map[k]; })
      .sort(function (a, b) { return b.value - a.value || b.count - a.count; });
  }

  function monthlySeries(list, valFn, year) {
    const y = year || new Date().getFullYear();
    const out = MONTHS.map(function (m) { return { month: m, value: 0, count: 0 }; });
    list.forEach(function (l) {
      const d = parseDate(l.created);
      if (!d || d.getFullYear() !== y) return;
      out[d.getMonth()].value += valFn ? valFn(l) : 0;
      out[d.getMonth()].count += 1;
    });
    return out;
  }

  function earnings(list) {
    const won = list.filter(function (l) { return l.won; });
    const paidRows = won.filter(function (l) { return l.paid; });
    const pendingRows = won.filter(function (l) { return !l.paid; });
    const gross = list.reduce(function (a, l) { return a + l.value; }, 0);
    const commission = won.reduce(function (a, l) { return a + l.commission; }, 0);
    const paid = paidRows.reduce(function (a, l) { return a + l.commission; }, 0);
    const pending = pendingRows.reduce(function (a, l) { return a + l.commission; }, 0);
    const openPipelineValue = list.filter(function (l) { return !l.won; })
      .reduce(function (a, l) { return a + (l.value * l.probability / 100); }, 0);
    const thisYear = new Date().getFullYear();
    const thisMonth = new Date().getMonth();
    const monthCommission = won.filter(function (l) {
      const d = parseDate(l.wonOn);
      return d && d.getFullYear() === thisYear && d.getMonth() === thisMonth;
    }).reduce(function (a, l) { return a + l.commission; }, 0);
    return {
      leads: list.length,
      wonCount: won.length,
      gross: gross,
      commission: commission,
      paid: paid,
      pending: pending,
      available: pending,
      thisMonth: monthCommission,
      weightedPipeline: openPipelineValue,
      conversion: pct(won.length, list.length),
      bySource: groupSum(won, function (l) { return l.service; }, function (l) { return l.commission; }),
      byMonth: monthlySeries(won, function (l) { return l.commission; }),
      paidRows: paidRows,
      pendingRows: pendingRows,
      nextPayout: addDays(new Date(), CONFIG.payout.cycleDays)
    };
  }

  /* ── activity feed (Tasks + Referrals + Courses + Documents) ────────── */
  function activities(bundle) {
    const out = [];
    const zp = Z();
    (bundle.tasks || []).forEach(function (t) {
      const st = field(t, 'status');
      out.push({
        when: recordDate(t),
        type: 'Task',
        title: st === 'Completed' ? 'Task Completed' : st === 'In Progress' ? 'Task In Progress' : 'Task Assigned',
        detail: field(t, 'Task_Name') + (field(t, 'Task_Description') ? ' — ' + field(t, 'Task_Description') : ''),
        status: st,
        icon: st === 'Completed' ? 'fa-circle-check' : 'fa-list-check',
        tint: st === 'Completed' ? 'tint-emerald' : 'tint-indigo',
        color: '#4f46e5'
      });
    });
    (bundle.referrals || []).forEach(function (r) {
      out.push({
        when: recordDate(r),
        type: 'Lead',
        title: 'Referral Submitted',
        detail: field(r, 'Company_Name') + ' · ' + (field(r, 'Project_Service_Interest') || 'Service not set'),
        status: 'New',
        icon: 'fa-user-plus',
        tint: 'tint-sky',
        color: '#0ea5e9'
      });
    });
    (bundle.taken || []).forEach(function (t) {
      const st = field(t, 'status');
      out.push({
        when: recordDate(t),
        type: 'Training',
        title: st === 'Completed' ? 'Course Completed' : 'Course ' + (st || 'Enrolled'),
        detail: (zp ? zp.lookupName(t.Course_Name) : '') || 'Partner course',
        status: st,
        icon: 'fa-graduation-cap',
        tint: 'tint-violet',
        color: '#7c3aed'
      });
    });
    (bundle.documents || []).forEach(function (d) {
      out.push({
        when: recordDate(d),
        type: 'Resource',
        title: 'Document Available',
        detail: field(d, 'Document_Name') || 'Partner document',
        status: 'Available',
        icon: 'fa-folder-open',
        tint: 'tint-amber',
        color: '#f59e0b'
      });
    });
    return out.sort(function (a, b) { return b.when - a.when; });
  }

  function groupByDay(items) {
    const map = [];
    const idx = {};
    items.forEach(function (it) {
      const key = parseDate(it.when).toDateString();
      if (idx[key] === undefined) {
        idx[key] = map.length;
        map.push({ key: key, date: it.when, items: [] });
      }
      map[idx[key]].items.push(it);
    });
    return map;
  }

  function dayLabel(d) {
    const dt = parseDate(d);
    if (!dt) return '';
    const now = new Date();
    if (sameDay(dt, now)) return 'Today – ' + fmtDateShort(dt);
    if (sameDay(dt, new Date(now.getTime() - DAY))) return 'Yesterday – ' + fmtDateShort(dt);
    return fmtDate(dt);
  }

  /* ── tickets derived from Task records ──────────────────────────────── */
  function tickets(tasks) {
    return (tasks || []).map(function (t) {
      const raw = field(t, 'status') || 'Pending';
      const status = CONFIG.ticketStatus[raw] || raw;
      const priority = field(t, 'priority') || 'Medium';
      const created = recordDate(t);
      const sla = CONFIG.slaHours[priority] || 24;
      const hoursOpen = Math.max(0, (Date.now() - parseDate(created).getTime()) / 3600000);
      return {
        id: 'TKT-' + String(t.ID || '').slice(-6),
        recordId: t.ID,
        subject: field(t, 'Task_Name') || 'Partner task',
        detail: field(t, 'Task_Description'),
        partner: Z() ? Z().lookupName(t.Partner_Name) : '',
        priority: priority,
        status: status,
        created: created,
        updated: created,
        slaHours: sla,
        breached: status !== 'Resolved' && status !== 'Closed' && hoursOpen > sla,
        hoursOpen: Math.round(hoursOpen * 10) / 10,
        escalated: priority === 'Critical' && status !== 'Resolved'
      };
    }).sort(function (a, b) { return b.created - a.created; });
  }

  /* ── admin payout requests, one per partner per payout cycle ────────── */
  function payoutRequests(partners, allLeads) {
    const byPartner = {};
    allLeads.forEach(function (l) {
      if (!l.won) return;
      if (!byPartner[l.partnerId]) byPartner[l.partnerId] = [];
      byPartner[l.partnerId].push(l);
    });
    const rows = [];
    (partners || []).forEach(function (p) {
      const mine = byPartner[p.ID] || [];
      if (!mine.length) return;
      const pending = mine.filter(function (l) { return !l.paid; });
      const paid = mine.filter(function (l) { return l.paid; });
      if (pending.length) {
        rows.push(buildPayout(p, pending, 'Pending'));
      }
      if (paid.length) {
        rows.push(buildPayout(p, paid, 'Paid'));
      }
    });
    return rows.sort(function (a, b) { return b.requestedOn - a.requestedOn; });
  }

  function buildPayout(partner, rows, status) {
    const amount = rows.reduce(function (a, l) { return a + l.commission; }, 0);
    const dates = rows.map(function (l) { return parseDate(l.wonOn) || l.created; }).sort(function (a, b) { return a - b; });
    const first = dates[0];
    const last = dates[dates.length - 1];
    const idx = Math.abs(hash(String(partner.ID) + status)) % CONFIG.payout.methods.length;
    return {
      id: (status === 'Paid' ? 'TXN-' : 'PR-') + String(partner.ID).slice(-4) + '-' + String(rows.length).padStart(2, '0'),
      partner: partner,
      partnerName: Z() ? Z().partnerLabel(partner) : field(partner, 'partner_name'),
      avatar: Z() ? (Z().imageUrl(partner.Profile_Image) || Z().DEFAULT_AVATAR) : '',
      deals: rows.length,
      amount: amount,
      method: CONFIG.payout.methods[idx],
      status: amount < CONFIG.payout.minimum && status === 'Pending' ? 'Below Minimum' : status,
      period: fmtDate(first) + ' – ' + fmtDate(last),
      requestedOn: last,
      paidOn: status === 'Paid' ? addDays(last, CONFIG.payout.lagDays) : null
    };
  }

  function hash(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) { h = ((h << 5) - h) + str.charCodeAt(i); h |= 0; }
    return h;
  }

  /* ── tiny svg helpers so charts follow the data too ─────────────────── */
  function linePoints(values, w, h, pad) {
    const p = pad == null ? 4 : pad;
    const max = Math.max.apply(null, values.concat([1]));
    const n = values.length;
    if (!n) return '';
    return values.map(function (v, i) {
      const x = n === 1 ? w / 2 : (i / (n - 1)) * (w - p * 2) + p;
      const y = h - p - (v / max) * (h - p * 2);
      return Math.round(x * 10) / 10 + ',' + Math.round(y * 10) / 10;
    }).join(' ');
  }

  function areaPath(values, w, h, pad) {
    const pts = linePoints(values, w, h, pad);
    if (!pts) return '';
    return 'M' + pts.split(' ').join(' L').replace(/^M L/, 'M') + ' L' + w + ',' + h + ' L0,' + h + ' Z';
  }

  function conicGradient(parts, colors) {
    const total = parts.reduce(function (a, p) { return a + p; }, 0);
    if (!total) return 'conic-gradient(#e2e8f0 0 100%)';
    let acc = 0;
    const stops = parts.map(function (p, i) {
      const from = (acc / total) * 100;
      acc += p;
      const to = (acc / total) * 100;
      return (colors[i % colors.length]) + ' ' + from.toFixed(1) + '% ' + to.toFixed(1) + '%';
    });
    return 'conic-gradient(' + stops.join(',') + ')';
  }

  global.ZPData = {
    CONFIG: CONFIG,
    MONTHS: MONTHS,
    money: money,
    moneyShort: moneyShort,
    pct: pct,
    parseDate: parseDate,
    fmtDate: fmtDate,
    fmtDateShort: fmtDateShort,
    fmtTime: fmtTime,
    addDays: addDays,
    ageDays: ageDays,
    recordDate: recordDate,
    monthRangeLabel: monthRangeLabel,
    dayLabel: dayLabel,
    commissionRate: commissionRate,
    dealValue: dealValue,
    lead: lead,
    leads: leads,
    leadsForAll: leadsForAll,
    pipeline: pipeline,
    groupSum: groupSum,
    monthlySeries: monthlySeries,
    earnings: earnings,
    activities: activities,
    groupByDay: groupByDay,
    tickets: tickets,
    payoutRequests: payoutRequests,
    linePoints: linePoints,
    areaPath: areaPath,
    conicGradient: conicGradient
  };
})(window);
