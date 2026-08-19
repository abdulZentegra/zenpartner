// ═══════════════════════════════════════════════════════════════════════════
// ZenPartner — dynamic process engine
// Step 1: Partner_Details from the logged-in Creator user
// Step 2: New partner → 5 onboarding tasks (Agreement, NDA, Training,
//         Learn About Our Company, Resources Access)
// Pages bind to live Creator data (or the local demo store).
// ═══════════════════════════════════════════════════════════════════════════

(function (global) {
  'use strict';

  const Z = function () { return global.ZohoAPI; };
  const $ = function (sel, root) { return (root || document).querySelector(sel); };
  const $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  const session = {
    live: false,
    loginUser: '',
    isAdmin: false,
    partner: null,
    partnerId: '',
    name: 'Partner',
    firstName: 'Partner',
    email: '',
    phone: '',
    org: '',
    type: '',
    status: '',
    avatar: '',
    address: '',
    website: '',
    industries: [],
    services: [],
    steps: [],
    extraTasks: [],
    referrals: [],
    courses: [],
    taken: [],
    documents: [],
    onboard: { done: 0, total: 5, pct: 0, current: null, allDone: false }
  };

  global.ZP = { session: session };

  function esc(s) { return Z().esc(s); }
  function field(r, n, f) { return Z().field(r, n, f); }

  function pill(status) {
    const map = {
      Completed: 'zp-pill--emerald', Active: 'zp-pill--emerald', Paid: 'zp-pill--emerald', Verified: 'zp-pill--emerald',
      'In Progress': 'zp-pill--blue', Training: 'zp-pill--blue', Enrolled: 'zp-pill--indigo',
      Pending: 'zp-pill--amber', Prospective: 'zp-pill--amber', 'Documentation Pending': 'zp-pill--amber', Hold: 'zp-pill--amber',
      New: 'zp-pill--indigo', Qualified: 'zp-pill--emerald',
      Cancelled: 'zp-pill--rose', Suspended: 'zp-pill--rose', Terminated: 'zp-pill--rose', Expired: 'zp-pill--rose', Failed: 'zp-pill--rose', Dropped: 'zp-pill--rose',
      'On Hold': 'zp-pill--slate', 'Not Started': 'zp-pill--slate'
    };
    const cls = map[status] || 'zp-pill--slate';
    return '<span class="zp-pill no-dot ' + cls + '">' + esc(status || '—') + '</span>';
  }

  function typePill(type) {
    const map = { 'Zoho Partner': 'zp-pill--amber', Agency: 'zp-pill--violet', Consultant: 'zp-pill--indigo', Freelancer: 'zp-pill--sky', 'Business Professional': 'zp-pill--teal', Other: 'zp-pill--slate' };
    return '<span class="zp-pill zp-level no-dot ' + (map[type] || 'zp-pill--slate') + '">' + esc(type || 'Partner') + '</span>';
  }

  function statusClass(status) {
    if (status === 'Active' || status === 'Completed') return 'zp-pill--emerald';
    if (status === 'Training' || status === 'In Progress') return 'zp-pill--blue';
    if (status === 'Prospective' || status === 'Documentation Pending' || status === 'Pending') return 'zp-pill--amber';
    if (status === 'Suspended' || status === 'Terminated' || status === 'Expired') return 'zp-pill--rose';
    return 'zp-pill--slate';
  }

  function initials(name) {
    return String(name || 'P').split(/\s+/).slice(0, 2).map(function (p) { return p.charAt(0); }).join('').toUpperCase();
  }

  function showBoot() {
    if ($('#zp-boot')) return;
    const el = document.createElement('div');
    el.id = 'zp-boot';
    el.innerHTML = '<div class="zp-boot-card"><div class="zp-brand-logo" style="width:42px;height:42px;margin:0 auto 12px">Z</div><div class="fw-bold">Loading ZenPartner</div><div class="text-muted" style="font-size:.74rem">Fetching Partner Details…</div><div class="zp-progress mt-3"><span style="width:38%"></span></div></div>';
    document.body.appendChild(el);
  }

  function hideBoot() {
    const el = $('#zp-boot');
    if (!el) return;
    el.classList.add('leaving');
    setTimeout(function () { el.remove(); }, 220);
  }

  function applySessionFromBundle(bundle, loginUser) {
    const p = bundle.partner;
    session.live = Z().live;
    session.loginUser = loginUser || Z().loginUser;
    session.partner = p;
    session.partnerId = p ? p.ID : '';
    session.name = p ? Z().partnerLabel(p) : (session.loginUser ? session.loginUser.split('@')[0] : 'Partner');
    session.firstName = session.name.split(/\s+/)[0] || 'Partner';
    session.email = p ? field(p, 'primary_email', session.loginUser) : session.loginUser;
    session.phone = p ? field(p, 'phone_number') : '';
    session.org = p ? field(p, 'Organization_Name') : '';
    session.type = p ? field(p, 'partner_type') : '';
    session.status = p ? field(p, 'partner_status', 'Prospective') : '';
    session.avatar = p ? (Z().imageUrl(p.Profile_Image) || Z().DEFAULT_AVATAR) : Z().DEFAULT_AVATAR;
    session.address = p ? Z().addressText(p.address) : '';
    session.website = p ? Z().urlValue(p.website_url) : '';
    session.industries = p ? Z().asList(p.industry_focus) : [];
    session.services = p ? Z().asList(p.services_of_interest) : [];
    session.steps = bundle.steps || Z().normalizeSteps([]);
    session.extraTasks = bundle.extraTasks || [];
    session.referrals = bundle.referrals || [];
    session.courses = bundle.courses || [];
    session.taken = bundle.taken || [];
    session.documents = bundle.documents || [];
    session.onboard = Z().onboardSummary(session.steps);
    session.adminName = session.loginUser ? session.loginUser.split('@')[0] : 'Admin';
  }

  async function loadSession(opts) {
    await Z().ready();
    session.isAdmin = !!(opts && opts.variant === 'admin');
    const login = Z().loginUser;
    const viewId = Z().queryParam('id');
    let bundle;
    if (session.isAdmin && viewId) {
      bundle = await Z().loadPartnerBundle(viewId);
    } else if (session.isAdmin) {
      bundle = { partner: null, steps: Z().normalizeSteps([]), extraTasks: [], referrals: [], courses: [], taken: [], documents: [] };
    } else {
      const mine = await Z().findPartnerByEmail(login);
      bundle = mine ? await Z().loadPartnerBundle(mine) : { partner: null, steps: Z().normalizeSteps([]), extraTasks: [], referrals: [], courses: await Z().getRecords(Z().REPORTS.courses), taken: [], documents: await Z().getRecords(Z().REPORTS.documents) };
    }
    applySessionFromBundle(bundle, login);
    return session;
  }

  async function reloadMine() {
    if (!session.partnerId) {
      const mine = await Z().findPartnerByEmail(session.loginUser);
      if (mine) session.partnerId = mine.ID;
    }
    if (!session.partnerId) return session;
    const bundle = await Z().loadPartnerBundle(session.partnerId);
    applySessionFromBundle(bundle, session.loginUser);
    return session;
  }

  function liveChip() {
    return session.live
      ? '<span class="zp-live-chip live"><i class="fa-solid fa-circle"></i> Creator live</span>'
      : '<span class="zp-live-chip demo"><i class="fa-solid fa-flask"></i> Demo data</span>';
  }

  function emptyState(title, body, action) {
    return '<div class="zp-empty"><div class="zp-empty-icon"><i class="fa-solid fa-inbox"></i></div><div class="fw-bold">' + esc(title) + '</div><div class="small mt-1">' + (body || '') + '</div>' + (action || '') + '</div>';
  }

  function registerCard() {
    const ZAPI = Z();
    const typeOpts = ZAPI.PARTNER_TYPES.map(function (t) { return '<option>' + esc(t) + '</option>'; }).join('');
    const ind = ZAPI.INDUSTRIES.map(function (t) {
      return '<label class="zp-check"><input type="checkbox" name="industry_focus" value="' + esc(t) + '"> ' + esc(t) + '</label>';
    }).join('');
    const svc = ZAPI.SERVICES.map(function (t) {
      return '<label class="zp-check"><input type="checkbox" name="services_of_interest" value="' + esc(t) + '"> ' + esc(t) + '</label>';
    }).join('');
    return '<div class="zp-card p-4" id="zp-register">' +
      '<div class="d-flex gap-3 align-items-start mb-3"><span class="zp-stat-icon tint-indigo" style="width:42px;height:42px"><i class="fa-solid fa-handshake"></i></span>' +
      '<div><h2 class="jakarta fs-5 fw-bold mb-1">Welcome to ZenPartner</h2>' +
      '<p class="text-muted mb-0" style="font-size:.8rem">No Partner Details record is linked to <b>' + esc(session.loginUser) + '</b>. Complete this form to create your partner profile. Five onboarding tasks will be created automatically.</p></div></div>' +
      '<form id="zp-register-form" class="row g-3" onsubmit="return false;">' +
      '<div class="col-md-6"><label class="form-label">Organization Name <span class="text-danger">*</span></label><input name="Organization_Name" class="form-control" required></div>' +
      '<div class="col-md-6"><label class="form-label">Partner Name <span class="text-danger">*</span></label><input name="partner_name" class="form-control" required></div>' +
      '<div class="col-md-4"><label class="form-label">Partner Type</label><select name="partner_type" class="form-select">' + typeOpts + '</select></div>' +
      '<div class="col-md-4"><label class="form-label">Primary Email</label><input name="primary_email" class="form-control" value="' + esc(session.loginUser) + '" readonly></div>' +
      '<div class="col-md-4"><label class="form-label">Phone with Country Code</label><input name="phone_number" class="form-control" placeholder="+91 98765 43210"></div>' +
      '<div class="col-md-8"><label class="form-label">Country / State / City</label><input name="address" class="form-control" placeholder="City, State, Country"></div>' +
      '<div class="col-md-4"><label class="form-label">Website / LinkedIn URL</label><input name="website_url" class="form-control" placeholder="https://"></div>' +
      '<div class="col-md-6"><label class="form-label">Industry / Network Focus</label><div class="zp-multi">' + ind + '</div></div>' +
      '<div class="col-md-6"><label class="form-label">Services of Interest</label><div class="zp-multi">' + svc + '</div></div>' +
      '<div class="col-12 d-flex justify-content-end"><button id="zp-register-btn" class="btn btn-primary" data-zp>Create Partner Profile <i class="fa-solid fa-arrow-right"></i></button></div>' +
      '</form></div>';
  }

  function bindRegister(after) {
    const btn = $('#zp-register-btn');
    if (!btn) return;
    btn.addEventListener('click', async function () {
      const form = $('#zp-register-form');
      const name = form.partner_name.value.trim();
      const org = form.Organization_Name.value.trim();
      if (!name || !org) { showToast('Organization and partner name are required', 'error'); return; }
      btn.disabled = true;
      btn.innerHTML = 'Creating profile &amp; 5 tasks…';
      try {
        const res = await Z().createPartnerWithTasks({
          Organization_Name: org,
          partner_name: name,
          partner_type: form.partner_type.value,
          primary_email: form.primary_email.value.trim() || session.loginUser,
          phone_number: form.phone_number.value.trim(),
          address: form.address.value.trim(),
          website_url: form.website_url.value.trim(),
          industry_focus: $$('input[name="industry_focus"]:checked', form).map(function (i) { return i.value; }),
          services_of_interest: $$('input[name="services_of_interest"]:checked', form).map(function (i) { return i.value; }),
          partner_status: 'Prospective'
        });
        session.partnerId = res.partner.ID;
        await reloadMine();
        showToast('Partner created. 5 onboarding tasks are ready.', 'success');
        if (after) after();
        else location.reload();
      } catch (e) {
        console.error(e);
        showToast('Could not create partner. ' + ((e && e.message) || ''), 'error');
        btn.disabled = false;
        btn.innerHTML = 'Create Partner Profile';
      }
    });
  }

  function agreementBody() {
    return '<div class="small text-secondary">' +
      '<p class="fw-semibold text-dark">ZenPartner Partner Agreement</p>' +
      '<p>This agreement is between Zentegra and <b>' + esc(session.name) + '</b> (' + esc(session.org || 'your organization') + ').</p>' +
      '<ol class="ps-3">' +
      '<li class="mb-2">You will represent Zentegra professionally and only use approved brand materials.</li>' +
      '<li class="mb-2">Referrals submitted through this portal are tracked against your Partner Details record.</li>' +
      '<li class="mb-2">Commission is payable only on qualified, accepted opportunities.</li>' +
      '<li class="mb-2">Either party may pause the partnership using Partner Status (On Hold / Suspended).</li>' +
      '</ol>' +
      '<div class="p-3 rounded-3" style="background:#eef2ff">By accepting, task <b>Agreement</b> is marked Completed and your status moves to Documentation Pending.</div>' +
      '</div>';
  }

  function ndaBody() {
    return '<div class="small text-secondary"><p class="fw-semibold text-dark">Non-Disclosure Agreement</p>' +
      '<p>Confidential information includes pricing, customer lists, unreleased product plans and partner playbooks.</p>' +
      '<p>You agree not to disclose this information for 24 months after the partnership ends.</p>' +
      '<div class="p-3 rounded-3" style="background:#e0f2fe">Signing marks the <b>NDA Sign</b> task Completed.</div></div>';
  }

  function learnBody() {
    return '<div class="small text-secondary">' +
      '<p class="fw-semibold text-dark">Learn About Zentegra</p>' +
      '<p>Zentegra helps partners deliver cloud, collaboration and business-system projects.</p>' +
      '<ul class="ps-3"><li>Cloud infrastructure &amp; Zoho platform implementations</li><li>Partner enablement, training and certification</li><li>Shared delivery playbooks and marketing resources</li></ul>' +
      '<div class="p-3 rounded-3" style="background:#fffbeb">Mark this reviewed to complete <b>Learn About Our Company</b>.</div></div>';
  }

  async function runStepAction(key) {
    if (!session.partner) { showToast('Create your partner profile first', 'error'); return; }
    const step = session.steps.find(function (s) { return s.key === key; });
    if (!step) return;

    if (key === 'agreement') {
      if (step.done) {
        openModal({ title: 'Partner Agreement', body: agreementBody() + '<div class="mt-3">' + pill('Completed') + ' ' + esc(Z().prettyDate(step.date)) + '</div>', actions: '<button class="btn btn-primary" data-bs-dismiss="modal">Close</button>', size: 'lg' });
        return;
      }
      openModal({
        title: 'Partner Agreement', body: agreementBody(), size: 'lg',
        actions: '<button class="btn btn-light" data-bs-dismiss="modal">Cancel</button><button class="btn btn-primary" id="zp-accept-ag" data-zp>Accept &amp; Complete</button>'
      });
      $('#zp-accept-ag')?.addEventListener('click', async function () {
        await Z().completeOnboardStep(session.partner, 'agreement');
        closeModal();
        showToast('Agreement accepted', 'success');
        await refreshActive();
      });
      return;
    }

    if (key === 'nda') {
      if (step.done) {
        openModal({ title: 'Non-Disclosure Agreement', body: ndaBody() + '<div class="mt-3">' + pill('Completed') + '</div>' });
        return;
      }
      openModal({
        title: 'Sign NDA', body: ndaBody(),
        actions: '<button class="btn btn-light" data-bs-dismiss="modal">Cancel</button><button class="btn btn-primary" id="zp-sign-nda" data-zp>Sign NDA</button>'
      });
      $('#zp-sign-nda')?.addEventListener('click', async function () {
        await Z().completeOnboardStep(session.partner, 'nda');
        closeModal();
        showToast('NDA signed', 'success');
        await refreshActive();
      });
      return;
    }

    if (key === 'training') {
      if (step.done) { location.href = 'training.html'; return; }
      await Z().startOnboardStep(session.partner, 'training');
      location.href = 'training.html';
      return;
    }

    if (key === 'learn') {
      if (step.done) {
        openModal({ title: 'Learn About Our Company', body: learnBody(), actions: '<button class="btn btn-primary" data-bs-dismiss="modal">Close</button>' });
        return;
      }
      openModal({
        title: 'Learn About Our Company', body: learnBody(),
        actions: '<button class="btn btn-light" data-bs-dismiss="modal">Later</button><button class="btn btn-primary" id="zp-learn-done" data-zp>Mark as Reviewed</button>'
      });
      $('#zp-learn-done')?.addEventListener('click', async function () {
        await Z().completeOnboardStep(session.partner, 'learn');
        closeModal();
        showToast('Company learning completed', 'success');
        await refreshActive();
      });
      return;
    }

    if (key === 'resources') {
      if (!step.done) await Z().startOnboardStep(session.partner, 'resources');
      location.href = 'resources.html';
    }
  }

  async function refreshActive() {
    await reloadMine();
    personalizeChrome();
    const page = document.body.dataset.zpPage;
    const variant = document.body.dataset.zpVariant;
    await mount(page, variant);
  }

  function stepActionLabel(step, locked) {
    if (locked) return 'Locked';
    if (step.done) {
      if (step.key === 'agreement') return 'View Agreement';
      if (step.key === 'nda') return 'View NDA';
      if (step.key === 'training') return 'View Certificate';
      if (step.key === 'learn') return 'Review Again';
      if (step.key === 'resources') return 'Open Resources';
      return 'View';
    }
    if (step.key === 'agreement') return 'Accept Agreement';
    if (step.key === 'nda') return 'Sign NDA';
    if (step.key === 'training') return 'Go to Training';
    if (step.key === 'learn') return 'Start Learning';
    if (step.key === 'resources') return 'Unlock Resources';
    return 'Start';
  }

  function renderStepper(steps) {
    const ready = steps.every(function (s) { return s.done; });
    const cells = steps.map(function (s, i) {
      const cls = s.done ? 'done' : (s.active || (!s.done && steps.slice(0, i).every(function (x) { return x.done; }))) ? 'active' : '';
      const icon = s.done ? 'fa-check' : s.icon;
      return '<div class="zp-step ' + cls + '"><span class="zp-step-dot"><i class="fa-solid ' + icon + '"></i></span>' +
        '<div class="zp-step-title">' + (i + 1) + '. ' + esc(s.name) + '</div>' +
        '<div class="zp-step-sub">' + esc(s.sub) + '</div>' +
        pill(s.done ? 'Completed' : s.active ? 'In Progress' : 'Pending') + '</div>';
    }).join('');
    const readyCls = ready ? 'done' : '';
    return cells + '<div class="zp-step ' + readyCls + '"><span class="zp-step-dot"><i class="fa-solid fa-paper-plane"></i></span>' +
      '<div class="zp-step-title">6. Ready to Refer</div><div class="zp-step-sub">Start Referring Leads</div>' +
      pill(ready ? 'Completed' : 'Pending') + '</div>';
  }

  function renderStepRows(steps) {
    return steps.map(function (s, i) {
      const locked = i > 0 && !steps[i - 1].done && !s.done;
      const bg = s.active && !s.done ? 'style="background:#eef2ff"' : '';
      const icon = s.done
        ? '<span class="zp-stat-icon tint-emerald" style="width:28px;height:28px"><i class="fa-solid fa-check"></i></span>'
        : locked
          ? '<span class="zp-stat-icon tint-slate" style="width:28px;height:28px"><i class="fa-solid fa-lock"></i></span>'
          : s.active
            ? '<span class="spinner-border spinner-border-sm text-primary"></span>'
            : '<span class="zp-stat-icon ' + s.tint + '" style="width:28px;height:28px"><i class="fa-solid ' + s.icon + '"></i></span>';
      const when = s.done && s.date
        ? '<div class="d-none d-sm-block text-muted text-end" style="font-size:.66rem">Completed on<br><span class="text-secondary fw-medium">' + esc(Z().prettyDate(s.date)) + '</span></div>'
        : '<div class="text-muted" style="font-size:.66rem">' + esc(s.status) + '</div>';
      const btnCls = locked ? 'btn btn-sm btn-outline-secondary disabled' : (s.done ? 'btn btn-sm btn-outline-primary' : 'btn btn-sm btn-primary');
      return '<div class="d-flex flex-wrap align-items-center gap-3 p-3 ' + (i < steps.length - 1 ? 'border-bottom' : '') + '" ' + bg + '>' +
        icon + '<div class="flex-grow-1 min-w-0"><div class="fw-bold" style="font-size:.78rem">' + (i + 1) + '. ' + esc(s.name) + '</div>' +
        '<div class="text-muted" style="font-size:.72rem">' + esc(s.description) + '</div></div>' + when +
        '<button class="' + btnCls + '" data-zp data-step="' + s.key + '"' + (locked ? ' disabled' : '') + '>' + esc(stepActionLabel(s, locked)) + '</button></div>';
    }).join('');
  }

  /* ═══════════════ Page mounts ═══════════════ */
  async function mountDashboard() {
    const page = $('.zp-page');
    if (!page) return;
    if (!session.partner) {
      page.innerHTML = registerCard();
      bindRegister(function () { location.href = 'onboarding.html'; });
      return;
    }
    const s = session;
    const o = s.onboard;
    const refs = s.referrals;
    const current = o.current;
    const chip = (s.type || 'Partner') + ' · ' + esc(s.status || 'Prospective');
    const heroChip = $('.zp-hero-chip');
    if (heroChip) heroChip.innerHTML = '<i class="fa-solid fa-circle-check text-warning"></i> ' + chip;
    const title = $('#app-topbar .zp-page-title');
    if (title) title.innerHTML = 'Welcome back, ' + esc(s.firstName) + '! <span class="text-warning">👋</span>';
    const stats = $('.zp-hero-stats');
    if (stats) {
      stats.innerHTML =
        '<div><div class="zp-hero-stat-value">' + refs.length + '</div><div class="zp-hero-stat-label">Total Referrals</div></div>' +
        '<div class="vr opacity-25" style="height:2rem"></div>' +
        '<div><div class="zp-hero-stat-value">' + o.done + '/' + o.total + '</div><div class="zp-hero-stat-label">Tasks Complete</div></div>' +
        '<div class="vr opacity-25" style="height:2rem"></div>' +
        '<div><div class="zp-hero-stat-value">' + esc(s.status || '—') + '</div><div class="zp-hero-stat-label">Partner Status</div></div>';
    }
    const panel = $('.zp-hero-panel');
    if (panel) {
      panel.innerHTML =
        '<div class="d-flex align-items-center gap-3"><img src="' + esc(s.avatar) + '" class="rounded-circle" style="width:46px;height:46px;object-fit:cover;border:2px solid #e0e7ff" alt="">' +
        '<div class="min-w-0"><div class="fw-bold" style="font-size:.82rem">' + esc(s.name) + '</div>' +
        '<div class="text-warning" style="font-size:.68rem;font-weight:600"><i class="fa-solid fa-star"></i> ' + esc(s.type || 'Partner') + '</div></div></div>' +
        '<div class="d-flex align-items-center gap-3 mt-3 pt-3 border-top"><div class="zp-ring" style="--p:' + o.pct + '%"><span>' + o.pct + '%</span></div>' +
        '<div class="min-w-0"><div class="fw-bold" style="font-size:.74rem">' + o.pct + '% onboarding</div>' +
        '<div class="text-muted" style="font-size:.66rem">' + (current ? ('Next: ' + esc(current.name)) : 'Ready to refer') + '</div></div></div>' +
        '<div class="mt-3"><div class="d-flex justify-content-between" style="font-size:.66rem"><span class="text-muted fw-semibold">Profile</span><span class="fw-bold text-success">' + esc(s.org || '') + '</span></div>' +
        '<div class="zp-progress mt-1" style="background:#eef0f6"><span style="width:' + o.pct + '%;background:linear-gradient(90deg,#34d399,#38bdf8)"></span></div></div>';
    }
    const kpiCards = $$('.zp-stat');
    const kpiMap = [
      ['Total Referrals', String(refs.length), 'from Add_Referrals'],
      ['Open Tasks', String(s.steps.filter(function (x) { return !x.done; }).length + s.extraTasks.filter(function (t) { return field(t, 'status') !== 'Completed'; }).length), 'from All_Tasks'],
      ['Partner Status', s.status || '—', 'from Partner_Details'],
      ['Documents', String(s.documents.length), 'from Partner_Documents'],
      ['Onboarding', o.pct + '%', o.done + ' of ' + o.total + ' tasks']
    ];
    kpiMap.forEach(function (row, i) {
      const card = kpiCards[i];
      if (!card) return;
      const label = card.querySelector('.zp-stat-label');
      const val = card.querySelector('.zp-stat-value');
      const muted = card.querySelector('.zp-stat-delta .muted');
      if (label) label.textContent = row[0];
      if (val) val.textContent = row[1];
      if (muted) muted.textContent = row[2];
    });

    const onboardCard = $$('.zp-card').find(function (c) { return c.textContent.indexOf('Onboarding Progress') >= 0 && c.querySelector('.zp-card-title'); });
    if (onboardCard) {
      const list = s.steps.map(function (st) {
        const icon = st.done ? 'fa-circle-check text-success' : (st.active ? 'fa-lock text-primary' : 'fa-circle text-secondary');
        return '<div class="d-flex align-items-center gap-2' + (st.active && !st.done ? ' p-1 rounded-3 bg-light' : '') + '">' +
          '<span class="zp-stat-icon ' + (st.done ? 'tint-emerald' : st.tint) + '" style="width:26px;height:26px;font-size:.8rem"><i class="fa-solid ' + st.icon + '"></i></span>' +
          '<div class="flex-grow-1 min-w-0"><div class="fw-semibold" style="font-size:.72rem">' + esc(st.name) + '</div>' +
          '<div class="text-muted" style="font-size:.66rem">' + esc(st.done ? ('Completed ' + Z().prettyDate(st.date)) : st.sub) + '</div></div>' +
          '<i class="fa-solid ' + icon + ' flex-shrink-0"></i></div>';
      }).join('');
      const head = onboardCard.querySelector('.zp-card-head');
      onboardCard.innerHTML = (head ? head.outerHTML : '') +
        '<div class="d-flex justify-content-between mt-3" style="font-size:.7rem;color:#64748b"><span>' + o.done + ' of ' + o.total + ' Completed</span><span class="fw-semibold">' + o.pct + '%</span></div>' +
        '<div class="zp-progress mt-1"><span style="width:' + o.pct + '%"></span></div>' +
        '<div class="mt-3 d-flex flex-column gap-2">' + list + '</div>';
    }

    const pipeCard = $$('.zp-card-title').find(function (t) { return t.textContent.indexOf('Referral Pipeline') >= 0; });
    if (pipeCard) {
      const wrap = pipeCard.closest('.zp-card');
      const counts = {};
      refs.forEach(function (r) {
        const k = field(r, 'Project_Service_Interest') || 'Other';
        counts[k] = (counts[k] || 0) + 1;
      });
      const colors = ['#4f46e5', '#0ea5e9', '#7c3aed', '#f59e0b', '#10b981', '#f43f5e'];
      const keys = Object.keys(counts);
      const max = Math.max.apply(null, keys.map(function (k) { return counts[k]; }).concat([1]));
      const rows = keys.length ? keys.map(function (k, i) {
        const w = Math.round((counts[k] / max) * 100);
        return '<div class="d-flex align-items-center gap-2" style="font-size:.76rem"><span class="fw-semibold flex-shrink-0 text-secondary text-truncate" style="width:140px">' + esc(k) + '</span>' +
          '<div class="zp-progress flex-grow-1" style="background:#eef2ff"><span style="width:' + w + '%;background:' + colors[i % colors.length] + '"></span></div>' +
          '<b class="flex-shrink-0 text-center" style="width:30px">' + counts[k] + '</b></div>';
      }).join('') : '<div class="text-muted small">No referrals yet. <a href="referral.html">Add your first lead</a>.</div>';
      const badge = wrap.querySelector('.zp-pill');
      if (badge) badge.textContent = refs.length + ' Open';
      const body = wrap.querySelector('.d-flex.flex-column.gap-2.mt-3');
      if (body) body.innerHTML = rows;
    }

    // Derived dashboard values (pipeline, commission, charts, timeline).
    if (global.ZPPages) {
      try { global.ZPPages.dashboardExtras(session); }
      catch (e) { console.warn('dashboard extras failed', e); }
    }
  }

  async function mountOnboarding() {
    const page = $('.zp-page');
    if (!page) return;
    if (!session.partner) {
      page.innerHTML = registerCard();
      bindRegister(function () { location.reload(); });
      return;
    }
    const steps = session.steps;
    const o = session.onboard;
    const current = o.current;
    const stepper = $('.zp-stepper');
    if (stepper) stepper.innerHTML = renderStepper(steps);
    const progressHead = $$('.zp-card-title').find(function (t) { return t.textContent.indexOf('Onboarding Progress') >= 0; });
    if (progressHead) {
      const card = progressHead.closest('.zp-card');
      const nextCta = current
        ? '<a href="#" class="btn btn-sm btn-primary" data-zp data-step="' + current.key + '">Continue ' + esc(current.name) + ' <i class="fa-solid fa-arrow-right"></i></a>'
        : '<a href="referral.html" class="btn btn-sm btn-primary">Start Referring <i class="fa-solid fa-arrow-right"></i></a>';
      card.innerHTML =
        '<div class="zp-card-head"><h3 class="zp-card-title">Onboarding Progress</h3><span class="fw-bold">' + o.pct + '%</span></div>' +
        '<div class="d-flex align-items-center gap-3 mt-2"><div class="zp-progress flex-grow-1"><span data-w="' + o.pct + '%" style="width:' + o.pct + '%"></span></div>' +
        '<span class="text-muted" style="font-size:.72rem">' + o.done + ' of ' + o.total + ' Tasks Completed</span></div>' +
        '<div class="border rounded-3 overflow-hidden mt-4">' + renderStepRows(steps) +
        '<div class="d-flex flex-wrap align-items-center gap-3 p-3 border-top"><span class="zp-stat-icon ' + (o.allDone ? 'tint-emerald' : 'tint-slate') + '" style="width:28px;height:28px"><i class="fa-solid ' + (o.allDone ? 'fa-check' : 'fa-paper-plane') + '"></i></span>' +
        '<div class="flex-grow-1 min-w-0"><div class="fw-bold" style="font-size:.78rem">6. Ready to Refer</div><div class="text-muted" style="font-size:.72rem">Unlocks when all five tasks are Completed.</div></div>' +
        (o.allDone ? '<a href="referral.html" class="btn btn-sm btn-primary">Start Referring</a>' : '<span class="btn btn-sm btn-outline-secondary disabled">Start Referring</span>') +
        '</div></div>' +
        '<div class="d-flex flex-wrap align-items-center gap-3 mt-3 p-3 rounded-3" style="background:#f0f0ff;border:1px solid #e0e7ff">' +
        '<span class="zp-stat-icon tint-indigo" style="width:40px;height:40px"><i class="fa-solid fa-gift"></i></span>' +
        '<div class="flex-grow-1 min-w-0"><div class="fw-bold" style="font-size:.78rem">Complete all 5 tasks to become an Active partner</div>' +
        '<div class="text-secondary" style="font-size:.74rem">Status updates automatically: Prospective → Documentation Pending → Training → Active.</div></div>' +
        nextCta + '</div>';
    }
    const nextCard = $$('.zp-card-title').find(function (t) { return t.textContent.indexOf("What's Next") >= 0; });
    if (nextCard && current) {
      const box = nextCard.parentElement;
      const inner = box.querySelector('.d-flex.gap-3');
      if (inner) {
        inner.innerHTML = '<div class="zp-stat-icon ' + current.tint + ' flex-shrink-0" style="width:60px;height:60px"><i class="fa-solid ' + current.icon + '" style="font-size:1.4rem"></i></div>' +
          '<div><div class="fw-bold" style="font-size:.78rem">Complete ' + esc(current.name) + '</div>' +
          '<p class="text-muted mb-0" style="font-size:.72rem">' + esc(current.description) + '</p>' +
          '<button class="btn btn-sm btn-primary mt-2" data-zp data-step="' + current.key + '">' + esc(stepActionLabel(current, false)) + ' <i class="fa-solid fa-arrow-right"></i></button></div>';
      }
    } else if (nextCard && o.allDone) {
      const box = nextCard.parentElement.querySelector('.d-flex.gap-3');
      if (box) box.innerHTML = '<div class="zp-stat-icon tint-emerald flex-shrink-0" style="width:60px;height:60px"><i class="fa-solid fa-circle-check" style="font-size:1.4rem"></i></div>' +
        '<div><div class="fw-bold" style="font-size:.78rem">You are Active</div><p class="text-muted mb-0" style="font-size:.72rem">All onboarding tasks are complete. Start adding referrals.</p>' +
        '<a href="referral.html" class="btn btn-sm btn-primary mt-2">Add Referral</a></div>';
    }
    if (!page.dataset.stepBound) {
      page.dataset.stepBound = '1';
      page.addEventListener('click', function (e) {
        const btn = e.target.closest('[data-step]');
        if (!btn || btn.disabled) return;
        e.preventDefault();
        runStepAction(btn.getAttribute('data-step'));
      });
    }
  }

  async function mountProfile() {
    if (!session.partner) {
      const page = $('.zp-page');
      if (page) { page.innerHTML = registerCard(); bindRegister(function () { location.reload(); }); }
      return;
    }
    const s = session;
    const p = s.partner;
    const h1 = $('.zp-page h1');
    if (h1) h1.textContent = s.name;
    const img = $('.zp-page img.rounded-circle');
    if (img) img.src = s.avatar;
    const typeBadge = $('.zp-page .zp-pill');
    if (typeBadge) typeBadge.outerHTML = typePill(s.type);
    const sub = h1 && h1.parentElement && h1.parentElement.parentElement.querySelector('.text-secondary');
    if (sub) sub.textContent = (s.type || 'Partner') + (s.org ? ' at ' + s.org : '');
    const info = $$('.zp-page .col.d-flex.align-items-center');
    if (info[0]) info[0].innerHTML = '<span class="zp-stat-icon tint-indigo flex-shrink-0" style="width:28px;height:28px;font-size:.8rem"><i class="fa-solid fa-envelope"></i></span><span class="text-truncate">' + esc(s.email) + '</span>';
    if (info[2]) info[2].innerHTML = '<span class="zp-stat-icon tint-indigo" style="width:28px;height:28px;font-size:.8rem"><i class="fa-solid fa-phone"></i></span> ' + esc(s.phone || '—');
    if (info[3]) info[3].innerHTML = '<span class="zp-stat-icon tint-indigo" style="width:28px;height:28px;font-size:.8rem"><i class="fa-solid fa-award"></i></span> ' + esc(s.status);

    const inputs = $$('.zp-page input.form-control, .zp-page select.form-select');
    const map = {
      'Full Name': s.name,
      'Email Address': s.email,
      'Phone Number': s.phone,
      'Address': s.address,
      'Company Name': s.org,
      'Website': s.website,
      'Partner ID': s.partnerId,
      'Partnership Since': '',
      'Primary Focus Area': s.industries.join(', ')
    };
    $$('.zp-page .form-label').forEach(function (lab) {
      const key = lab.textContent.replace('*', '').trim();
      const fieldEl = lab.parentElement && lab.parentElement.querySelector('input,select');
      if (!fieldEl) return;
      if (map[key] != null && map[key] !== '') {
        if (fieldEl.tagName === 'SELECT') return;
        fieldEl.value = map[key];
      }
      if (key === 'Industry') {
        fieldEl.innerHTML = Z().INDUSTRIES.map(function (i) { return '<option' + (s.industries.indexOf(i) >= 0 ? ' selected' : '') + '>' + esc(i) + '</option>'; }).join('');
      }
      if (key === 'Partner Type' || key === 'Partner Tier') {
        /* keep visual pill */
      }
    });
    const tier = $$('.zp-page .zp-pill').find(function (el) { return /Gold|Silver|Bronze|Partner/.test(el.textContent); });
    if (tier && tier.closest('.col-6')) tier.outerHTML = typePill(s.type);

    const docsBox = $$('.zp-card-title').find(function (t) { return t.textContent.trim() === 'Documents'; });
    if (docsBox) {
      const card = docsBox.closest('.zp-card');
      const list = (s.documents || []).map(function (d) {
        const files = Z().asList(d.File_upload);
        const name = field(d, 'Document_Name') || 'Document';
        return '<div class="d-flex align-items-center gap-3 p-2 rounded-3 border" style="background:#f8fafc"><span class="zp-stat-icon tint-rose" style="width:32px;height:32px"><i class="fa-solid fa-file-lines"></i></span>' +
          '<div class="flex-grow-1"><div class="fw-semibold" style="font-size:.76rem">' + esc(name) + '</div>' +
          '<div class="text-muted" style="font-size:.68rem">' + esc(files[0] ? Z().fileNameFromPath(files[0]) : 'File') + '</div></div>' +
          '<button class="row-action" data-zp data-doc="' + esc(d.ID) + '"><i class="fa-solid fa-download"></i></button></div>';
      }).join('') || '<div class="text-muted small">No partner documents uploaded yet.</div>';
      const head = card.querySelector('.zp-card-head');
      card.innerHTML = (head ? head.outerHTML : '') + '<div class="d-flex flex-column gap-2 mt-3">' + list + '</div>';
    }

    const save = $$('button').find(function (b) { return /Save Changes/.test(b.textContent); });
    if (save) {
      save.addEventListener('click', async function (e) {
        e.preventDefault();
        const byLabel = function (label) {
          const lab = $$('.form-label').find(function (l) { return l.textContent.replace('*', '').trim() === label; });
          return lab && lab.parentElement.querySelector('input,select,textarea');
        };
        try {
          await Z().updateRecord(Z().REPORTS.partners, s.partnerId, {
            partner_name: (byLabel('Full Name') || {}).value || s.name,
            primary_email: (byLabel('Email Address') || {}).value || s.email,
            phone_number: (byLabel('Phone Number') || {}).value || s.phone,
            address: (byLabel('Address') || {}).value || s.address,
            Organization_Name: (byLabel('Company Name') || {}).value || s.org,
            website_url: (byLabel('Website') || {}).value || s.website
          });
          showToast('Partner Details saved', 'success');
          await refreshActive();
        } catch (err) {
          showToast('Save failed', 'error');
        }
      });
    }

    if (global.ZPPages) {
      try { global.ZPPages.profileExtras(session); }
      catch (e) { console.warn('profileExtras failed', e); }
    }
  }

  function takenFor(courseId) {
    return session.taken.find(function (t) { return Z().lookupId(t.Course_Name) === courseId; });
  }

  function courseStatus(course) {
    const t = takenFor(course.ID);
    return t ? field(t, 'status') : 'Not Started';
  }

  function coursePct(st) {
    if (st === 'Completed') return 100;
    if (st === 'In Progress') return 60;
    if (st === 'Enrolled') return 20;
    return 0;
  }

  async function mountTraining() {
    const tbody = $('.zp-table tbody');
    if (!session.partner) {
      const page = $('.zp-page');
      if (page) { page.innerHTML = registerCard(); bindRegister(function () { location.reload(); }); }
      return;
    }
    const courses = session.courses;
    const thumbs = [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=100&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1451187580459-43490279c429?w=100&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=100&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&auto=format&fit=crop&q=60'
    ];
    if (tbody) {
      tbody.innerHTML = courses.length ? courses.map(function (c, i) {
        const st = courseStatus(c);
        const pct = coursePct(st);
        const bar = st === 'Completed' ? '#10b981' : st === 'In Progress' ? '#0ea5e9' : '#4f46e5';
        const action = st === 'Completed' ? 'Review' : st === 'Not Started' ? 'Start' : 'Continue';
        const btn = st === 'Completed' ? 'btn-outline-primary' : 'btn-primary';
        const url = Z().urlValue(c.Url) || field(c, 'Url');
        return '<tr class="zp-course" data-status="' + esc(st) + '"><td><div class="d-flex gap-2 align-items-center"><img src="' + thumbs[i % thumbs.length] + '" style="width:52px;height:36px;object-fit:cover;border-radius:8px" alt="">' +
          '<div><div class="fw-bold">' + esc(field(c, 'Course_Name')) + '</div><div class="text-muted" style="font-size:.68rem">' + esc(field(c, 'Description') || 'Partner course') + '</div></div></div></td>' +
          '<td class="text-secondary">TrainerCentral</td>' +
          '<td><div class="d-flex align-items-center gap-2"><div class="zp-progress flex-grow-1" style="width:80px"><span style="width:' + pct + '%;background:' + bar + '"></span></div><span class="small">' + pct + '%</span></div></td>' +
          '<td>' + pill(st) + '</td>' +
          '<td class="text-end"><button class="btn btn-sm ' + btn + '" data-zp data-course="' + c.ID + '" data-url="' + esc(url) + '">' + action + '</button></td></tr>';
      }).join('') : '<tr><td colspan="5">' + emptyState('No courses yet', 'Add Partner Courses in Creator to populate this list.') + '</td></tr>';
    }
    const enrolled = session.taken.length;
    const completed = session.taken.filter(function (t) { return field(t, 'status') === 'Completed'; }).length;
    const progress = session.taken.filter(function (t) { return field(t, 'status') === 'In Progress' || field(t, 'status') === 'Enrolled'; }).length;
    const nums = $$('.row.row-cols-4 .fs-5');
    if (nums[0]) nums[0].textContent = String(enrolled || courses.length);
    if (nums[1]) nums[1].textContent = String(completed);
    if (nums[2]) nums[2].textContent = String(progress);
    if (nums[3]) nums[3].textContent = String(completed);
    const heroProg = $$('.zp-hero-body .fw-bold').find(function (el) { return /Completed|Progress|In Progress/.test(el.textContent); });
    const pctAll = courses.length ? Math.round((completed / courses.length) * 100) : session.onboard.pct;
    $$('.zp-hero-body .fw-bold').forEach(function (el) {
      if (/Completed/.test(el.textContent)) el.textContent = pctAll + '% Completed';
      if (/In Progress|Certification Status/.test(el.parentElement.textContent) && el.parentElement.querySelector('.text-white-50')) {
        if (/Certification/.test(el.parentElement.textContent)) el.textContent = session.steps.find(function (s) { return s.key === 'training'; })?.done ? 'Certified' : 'In Progress';
      }
    });

    if (!document.body.dataset.courseBound) {
      document.body.dataset.courseBound = '1';
      document.addEventListener('click', async function (e) {
        const btn = e.target.closest('[data-course]');
        if (!btn) return;
        e.preventDefault();
        const id = btn.getAttribute('data-course');
        const url = btn.getAttribute('data-url');
        const st = courseStatus({ ID: id });
        const next = st === 'Not Started' ? 'In Progress' : st === 'In Progress' || st === 'Enrolled' ? 'Completed' : 'Completed';
        try {
          await Z().startOnboardStep(session.partner, 'training');
          await Z().enrollCourse(session.partnerId, id, next);
          const auto = await Z().maybeCompleteTraining(session.partner);
          if (url && next === 'In Progress') {
            showToast('Opening course…', 'info');
            window.open(url, '_blank');
          }
          showToast(next === 'Completed' ? 'Course marked completed' : 'Course started', 'success');
          if (auto) showToast('Training & Certification task completed', 'success');
          await refreshActive();
        } catch (err) {
          console.error(err);
          showToast('Could not update course', 'error');
        }
      });
    }

    if (global.ZPPages) {
      try { global.ZPPages.trainingExtras(session); }
      catch (e) { console.warn('trainingExtras failed', e); }
    }
  }

  function docMeta(name) {
    const n = (name || '').toLowerCase();
    if (/nda|agreement|legal/.test(n)) return { cat: 'Legal', ext: 'PDF', color: 'linear-gradient(135deg,#f97316,#ea580c)', icon: 'fa-file-lines', tint: 'zp-pill--orange' };
    if (/commission|finance|payout/.test(n)) return { cat: 'Finance', ext: 'XLSX', color: 'linear-gradient(135deg,#10b981,#059669)', icon: 'fa-table', tint: 'zp-pill--emerald' };
    if (/brand|market/.test(n)) return { cat: 'Marketing', ext: 'PDF', color: 'linear-gradient(135deg,#7c3aed,#4f46e5)', icon: 'fa-palette', tint: 'zp-pill--violet' };
    if (/playbook|sales|portfolio|ppt/.test(n)) return { cat: 'Sales', ext: 'PPT', color: 'linear-gradient(135deg,#0ea5e9,#2563eb)', icon: 'fa-chalkboard', tint: 'zp-pill--sky' };
    return { cat: 'Partner Guide', ext: 'PDF', color: 'linear-gradient(135deg,#7c3aed,#4f46e5,#9333ea)', icon: 'fa-file-lines', tint: 'zp-pill--indigo' };
  }

  async function mountResources() {
    if (session.partner) {
      const step = session.steps.find(function (s) { return s.key === 'resources'; });
      if (step && !step.done) {
        const prior = session.steps.filter(function (s) { return s.key !== 'resources'; });
        const ready = prior.every(function (s) { return s.done; }) || prior.filter(function (s) { return s.done; }).length >= 3;
        if (ready) {
          try {
            await Z().completeOnboardStep(session.partner, 'resources');
            await reloadMine();
            showToast('Resources Access unlocked', 'success');
          } catch (e) { /* ignore */ }
        } else {
          await Z().startOnboardStep(session.partner, 'resources');
        }
      }
    }
    const grid = $('.row.row-cols-1.row-cols-sm-2.row-cols-xl-3');
    const docs = session.documents || [];
    if (grid) {
      grid.innerHTML = docs.length ? docs.map(function (d) {
        const name = field(d, 'Document_Name') || 'Document';
        const meta = docMeta(name);
        const files = Z().asList(d.File_upload);
        const href = files[0] ? Z().imageUrl(files[0]) : '#';
        return '<div class="col"><div class="resource-card zp-card overflow-hidden d-flex flex-column h-100">' +
          '<div class="position-relative p-3 overflow-hidden" style="height:92px;background:' + meta.color + '">' +
          '<div class="d-flex gap-3 h-100 align-items-center position-relative">' +
          '<div class="bg-white rounded-2 p-2 d-flex flex-column align-items-center shadow" style="width:52px;height:68px"><i class="fa-solid ' + meta.icon + ' text-primary" style="font-size:1.2rem"></i>' +
          '<span class="text-white fw-bold" style="font-size:.55rem;background:#ef4444;padding:1px 6px;border-radius:4px;margin-top:2px">' + meta.ext + '</span></div>' +
          '<div class="flex-grow-1 d-flex flex-column justify-content-between align-items-end"><a href="' + esc(href) + '" target="_blank" rel="noopener" class="rounded-circle d-grid place-items-center text-white" data-zp data-download style="width:28px;height:28px;background:rgba(255,255,255,.15)"><i class="fa-solid fa-download"></i></a></div></div></div>' +
          '<div class="p-3 flex-grow-1"><div class="fw-bold" style="font-size:.76rem">' + esc(name) + '</div>' +
          '<div class="text-muted" style="font-size:.7rem">' + esc(files[0] ? Z().fileNameFromPath(files[0]) : 'Partner document') + '</div>' +
          '<div class="mt-2"><span class="zp-pill no-dot ' + meta.tint + '">' + meta.cat + '</span></div></div>' +
          '<div class="px-3 py-2 border-top d-flex align-items-center justify-content-between" style="background:#f8fafc"><span class="text-muted" style="font-size:.68rem">' + meta.ext + '</span>' +
          '<a href="' + esc(href) + '" target="_blank" rel="noopener" data-zp data-download class="row-action"><i class="fa-solid fa-download"></i></a></div></div></div>';
      }).join('') : '<div class="col-12">' + emptyState('No documents', 'Upload files on the Partner Documents form in Creator.') + '</div>';
    }
    const countEls = $$('.fs-5.fw-bold.lh-1');
    if (countEls[0]) countEls[0].textContent = String(docs.length);
    const titleCount = $$('.zp-card-title').find(function (t) { return /All Resources/.test(t.textContent); });
    if (titleCount) titleCount.innerHTML = 'All Resources <span class="text-muted fw-semibold">(' + docs.length + ')</span>';
    const heroPill = $('.zp-pill.zp-pill--indigo');
    if (heroPill && /Total Resources/.test(heroPill.textContent)) heroPill.innerHTML = '<span class="spinner-grow spinner-grow-sm text-primary me-1"></span>' + docs.length + ' documents from Partner_Documents';

    if (global.ZPPages) {
      try { global.ZPPages.resourcesExtras(session); }
      catch (e) { console.warn('resourcesExtras failed', e); }
    }
  }

  async function mountReferral() {
    if (!session.partner) {
      const page = $('.zp-page');
      if (page) { page.innerHTML = registerCard(); bindRegister(function () { location.reload(); }); }
      return;
    }
    const svc = Z().REFERRAL_SERVICES.map(function (s) { return '<option>' + esc(s) + '</option>'; }).join('');
    const hear = Z().HEAR_ABOUT.map(function (s) { return '<option>' + esc(s) + '</option>'; }).join('');
    const serviceSel = $('#ref-service');
    if (serviceSel) serviceSel.innerHTML = '<option value="">Select service / solution</option>' + svc;
    const hearSel = $$('#referral-form select').find(function (s) { return s !== serviceSel && s.id !== 'ref-value'; });
    if (hearSel) hearSel.innerHTML = '<option value="">Select source</option>' + hear;

    const refs = session.referrals;
    const tbody = $('.zp-table tbody');
    if (tbody) {
      tbody.innerHTML = refs.length ? refs.map(function (r, i) {
        return '<tr><td class="text-secondary fw-semibold">REF-' + String(r.ID).slice(-6) + '</td>' +
          '<td><div class="fw-bold">' + esc(field(r, 'Company_Name')) + '</div><div class="text-muted" style="font-size:.68rem">' + esc(field(r, 'Contact_Person')) + '</div></td>' +
          '<td><span class="zp-pill no-dot zp-pill--violet">' + esc(field(r, 'Project_Service_Interest') || '—') + '</span></td>' +
          '<td class="text-secondary">' + esc(field(r, 'Email')) + '</td>' +
          '<td>' + pill('New') + '</td>' +
          '<td class="text-secondary">' + esc(session.name) + '</td>' +
          '<td class="text-secondary">—</td>' +
          '<td class="text-end"><button class="row-action" data-zp title="View"><i class="fa-solid fa-eye"></i></button></td></tr>';
      }).join('') : '<tr><td colspan="8">' + emptyState('No referrals yet', 'Submit the form to create an Add_Referrals record.') + '</td></tr>';
    }
    const totalEl = $('#ref-total');
    if (totalEl) totalEl.textContent = String(refs.length);
    $$('.rounded-3.border.p-2.text-center .fw-bold').forEach(function (el, i) {
      if (i === 0) el.textContent = String(refs.length);
    });

    const submit = $('#ref-submit');
    if (submit) {
      const clone = submit.cloneNode(true);
      submit.parentNode.replaceChild(clone, submit);
      clone.addEventListener('click', async function (e) {
        e.preventDefault();
        const company = $('#ref-company');
        const contact = $('#ref-contact');
        const email = $('#ref-email');
        const service = $('#ref-service');
        let ok = true;
        [company, contact].forEach(function (i) { if (i && !i.value.trim()) { ok = false; i.classList.add('is-invalid'); } });
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { ok = false; email.classList.add('is-invalid'); }
        if (!ok) { showToast('Please fix the highlighted fields', 'error'); return; }
        try {
          await Z().addReferral(session.partnerId, {
            Company_Name: company.value.trim(),
            Contact_Person: contact.value.trim(),
            Email: email.value.trim(),
            Project_Service_Interest: service.value,
            How_did_you_hear_about_us: (hearSel && hearSel.value) || '',
            Project_Description: ($('#referral-form textarea') || {}).value || ''
          });
          showToast('Referral submitted to Add_Referrals', 'success');
          $('#referral-form')?.reset();
          await refreshActive();
        } catch (err) {
          console.error(err);
          showToast('Could not submit referral', 'error');
        }
      });
    }

    if (global.ZPPages) {
      try { global.ZPPages.referralExtras(session); }
      catch (e) { console.warn('referralExtras failed', e); }
    }
  }

  let adminStats = {};

  function buildAdminStats(partners, referrals) {
    adminStats = {};
    const D = global.ZPData;
    if (!D) return adminStats;
    const all = D.leadsForAll(referrals || [], partners || []);
    (partners || []).forEach(function (p) {
      const mine = all.filter(function (l) { return l.partnerId === p.ID; });
      const won = mine.filter(function (l) { return l.won; });
      const dates = mine.map(function (l) { return l.created; }).sort(function (a, b) { return a - b; });
      adminStats[p.ID] = {
        leads: mine.length,
        projects: won.length,
        pipeline: mine.reduce(function (a, l) { return a + l.value; }, 0),
        earnings: won.reduce(function (a, l) { return a + l.commission; }, 0),
        payouts: won.filter(function (l) { return l.paid; }).reduce(function (a, l) { return a + l.commission; }, 0),
        joined: field(p, 'Added_Time') ? D.fmtDate(field(p, 'Added_Time')) : (dates[0] ? D.fmtDate(dates[0]) : '—')
      };
    });
    adminStats.__all = all;
    return adminStats;
  }

  function statsFor(id) {
    return adminStats[id] || { leads: 0, projects: 0, pipeline: 0, earnings: 0, payouts: 0, joined: '—' };
  }

  function partnerRow(p, compact) {
    const name = Z().partnerLabel(p);
    const email = field(p, 'primary_email');
    const phone = field(p, 'phone_number');
    const type = field(p, 'partner_type');
    const status = field(p, 'partner_status');
    const avatar = Z().imageUrl(p.Profile_Image) || Z().DEFAULT_AVATAR;
    if (compact) {
      return '<tr data-status="' + esc(status) + '" data-search="' + esc((p.ID + ' ' + name + ' ' + email).toLowerCase()) + '">' +
        '<td class="text-secondary fw-semibold">' + esc(p.ID) + '</td>' +
        '<td><div class="d-flex align-items-center gap-2"><img src="' + esc(avatar) + '" style="width:28px;height:28px;border-radius:50%;object-fit:cover" alt=""><div><div class="fw-semibold">' + esc(name) + '</div><div class="text-muted" style="font-size:.68rem">' + esc(email) + '</div></div></div></td>' +
        '<td><span class="zp-pill ' + statusClass(status) + '">' + esc(status || '—') + '</span></td>' +
        '<td class="text-center fw-semibold">' + statsFor(p.ID).projects + '</td><td class="text-center fw-semibold">' + statsFor(p.ID).leads + '</td>' +
        '<td class="text-end fw-bold">' + (global.ZPData ? global.ZPData.moneyShort(statsFor(p.ID).earnings) : '—') + '</td>' +
        '<td class="text-end">' + (global.ZPData ? global.ZPData.moneyShort(statsFor(p.ID).payouts) : '—') + '</td>' +
        '<td class="text-secondary">' + esc(statsFor(p.ID).joined) + '</td>' +
        '<td class="text-center"><a href="partner-view.html?id=' + encodeURIComponent(p.ID) + '" class="row-action"><i class="fa-solid fa-eye"></i></a></td></tr>';
    }
    return '<tr data-id="' + p.ID + '" data-status="' + esc(status) + '" data-level="' + esc(type) + '" data-search="' + esc((p.ID + ' ' + name + ' ' + email).toLowerCase()) + '">' +
      '<td class="text-secondary fw-semibold">' + esc(p.ID) + '</td>' +
      '<td><div class="d-flex align-items-center gap-2"><img src="' + esc(avatar) + '" style="width:30px;height:30px;border-radius:50%;object-fit:cover"><span class="fw-semibold">' + esc(name) + '</span></div></td>' +
      '<td class="text-secondary">' + esc(email) + '</td><td class="text-secondary">' + esc(phone) + '</td>' +
      '<td>' + typePill(type) + '</td>' +
      '<td><span class="zp-pill ' + statusClass(status) + '">' + esc(status || '—') + '</span></td>' +
      '<td>' + pill(field(p, 'Organization_Name') ? 'Linked' : '—') + '</td>' +
      '<td class="text-secondary">' + esc(statsFor(p.ID).joined) + '</td>' +
      '<td class="text-center fw-semibold">' + statsFor(p.ID).leads + '</td><td class="text-center fw-semibold">' + statsFor(p.ID).projects + '</td>' +
      '<td class="text-end fw-bold">' + esc(field(p, 'Organization_Name')) + '</td>' +
      '<td class="text-end">' + esc((Z().asList(p.services_of_interest)[0]) || '—') + '</td>' +
      '<td class="text-center"><a href="partner-view.html?id=' + encodeURIComponent(p.ID) + '" class="row-action" title="View"><i class="fa-solid fa-eye"></i></a></td></tr>';
  }

  function addPartnerModal() {
    const ZAPI = Z();
    const types = ZAPI.PARTNER_TYPES.map(function (t) { return '<option>' + esc(t) + '</option>'; }).join('');
    const statuses = ZAPI.PARTNER_STATUSES.map(function (t) { return '<option' + (t === 'Prospective' ? ' selected' : '') + '>' + esc(t) + '</option>'; }).join('');
    const ind = ZAPI.INDUSTRIES.map(function (t) { return '<label class="zp-check"><input type="checkbox" value="' + esc(t) + '" name="np-ind"> ' + esc(t) + '</label>'; }).join('');
    const svc = ZAPI.SERVICES.map(function (t) { return '<label class="zp-check"><input type="checkbox" value="' + esc(t) + '" name="np-svc"> ' + esc(t) + '</label>'; }).join('');
    openModal({
      title: 'Add Partner',
      size: 'lg',
      body: '<p class="small text-muted">Creates a <b>Partner_Details</b> record, then 5 Task records: Agreement, NDA Sign, Training &amp; Certification, Learn About Our Company, Resources Access.</p>' +
        '<div class="row g-3">' +
        '<div class="col-md-6"><label class="form-label">Organization Name *</label><input id="np-org" class="form-control"></div>' +
        '<div class="col-md-6"><label class="form-label">Partner Name *</label><input id="np-name" class="form-control"></div>' +
        '<div class="col-md-6"><label class="form-label">Primary Email *</label><input id="np-email" type="email" class="form-control"></div>' +
        '<div class="col-md-6"><label class="form-label">Phone</label><input id="np-phone" class="form-control" placeholder="+91 …"></div>' +
        '<div class="col-md-6"><label class="form-label">Partner Type</label><select id="np-type" class="form-select">' + types + '</select></div>' +
        '<div class="col-md-6"><label class="form-label">Partner Status</label><select id="np-status" class="form-select">' + statuses + '</select></div>' +
        '<div class="col-md-6"><label class="form-label">Website</label><input id="np-web" class="form-control"></div>' +
        '<div class="col-md-6"><label class="form-label">Address</label><input id="np-addr" class="form-control"></div>' +
        '<div class="col-md-6"><label class="form-label">Industry / Network Focus</label><div class="zp-multi">' + ind + '</div></div>' +
        '<div class="col-md-6"><label class="form-label">Services of Interest</label><div class="zp-multi">' + svc + '</div></div></div>',
      actions: '<button class="btn btn-light" data-bs-dismiss="modal">Cancel</button><button class="btn btn-primary" id="save-partner" data-zp>Create + 5 Tasks</button>'
    });
    $('#save-partner')?.addEventListener('click', async function () {
      const name = $('#np-name').value.trim();
      const email = $('#np-email').value.trim();
      const org = $('#np-org').value.trim();
      if (!name || !email || !org) { showToast('Name, email and organization are required', 'error'); return; }
      try {
        const res = await Z().createPartnerWithTasks({
          Organization_Name: org,
          partner_name: name,
          partner_type: $('#np-type').value,
          primary_email: email,
          phone_number: $('#np-phone').value.trim(),
          address: $('#np-addr').value.trim(),
          website_url: $('#np-web').value.trim(),
          industry_focus: $$('input[name="np-ind"]:checked').map(function (i) { return i.value; }),
          services_of_interest: $$('input[name="np-svc"]:checked').map(function (i) { return i.value; }),
          partner_status: $('#np-status').value
        });
        closeModal();
        showToast(name + ' added · 5 onboarding tasks created', 'success');
        await mount(document.body.dataset.zpPage, 'admin');
        return res;
      } catch (e) {
        console.error(e);
        showToast('Could not create partner', 'error');
      }
    });
  }

  async function mountAdminPartners() {
    const partners = await Z().getRecords(Z().REPORTS.partners);
    const allRefs = await Z().getRecords(Z().REPORTS.referrals);
    buildAdminStats(partners, allRefs);
    const tbody = $('#partner-tbody');
    const statusSel = $('#status-filter');
    const levelSel = $('#level-filter');
    if (statusSel) statusSel.innerHTML = '<option value="all">Status: All</option>' + Z().PARTNER_STATUSES.map(function (s) { return '<option value="' + esc(s) + '">' + esc(s) + '</option>'; }).join('');
    if (levelSel) levelSel.innerHTML = '<option value="all">Partner Type: All</option>' + Z().PARTNER_TYPES.map(function (s) { return '<option value="' + esc(s) + '">' + esc(s) + '</option>'; }).join('');
    function render() {
      const q = (($('#partner-search') || {}).value || '').toLowerCase();
      const st = (statusSel && statusSel.value) || 'all';
      const lv = (levelSel && levelSel.value) || 'all';
      const vis = partners.filter(function (p) {
        const blob = (p.ID + ' ' + Z().partnerLabel(p) + ' ' + field(p, 'primary_email')).toLowerCase();
        return blob.indexOf(q) >= 0 && (st === 'all' || field(p, 'partner_status') === st) && (lv === 'all' || field(p, 'partner_type') === lv);
      });
      if (tbody) tbody.innerHTML = vis.map(function (p) { return partnerRow(p, false); }).join('') || '<tr><td colspan="13">' + emptyState('No partners', 'Add a partner to create the 5 onboarding tasks.') + '</td></tr>';
      const c = $('#table-count');
      if (c) c.textContent = 'Showing ' + vis.length + ' of ' + partners.length + ' partners';
      const badge = $$('.badge').find(function (b) { return /248|\d+/.test(b.textContent) && b.closest('.zp-card-title,h3'); });
      if (badge) badge.textContent = String(partners.length);
    }
    ['partner-search', 'status-filter', 'level-filter', 'kyc-filter'].forEach(function (id) {
      const el = document.getElementById(id);
      el?.addEventListener('input', render);
      el?.addEventListener('change', render);
    });
    render();
    const addBtn = $('#add-btn');
    if (addBtn) {
      const clone = addBtn.cloneNode(true);
      addBtn.parentNode.replaceChild(clone, addBtn);
      clone.addEventListener('click', function (e) { e.preventDefault(); addPartnerModal(); });
    }
    if (global.ZPPages) global.ZPPages.adminKpis(partners, allRefs);
  }

  async function mountAdminOnboarding() {
    const partners = await Z().getRecords(Z().REPORTS.partners);
    const tasks = await Z().getRecords(Z().REPORTS.tasks);
    const tbody = $('#onboard-tbody');
    const rows = partners.map(function (p) {
      const mine = tasks.filter(function (t) { return Z().lookupId(t.Partner_Name) === p.ID; });
      const steps = Z().normalizeSteps(mine);
      const o = Z().onboardSummary(steps);
      const overall = o.allDone ? 'Completed' : o.done ? 'In Progress' : 'Pending';
      return { p: p, steps: steps, o: o, overall: overall };
    });
    function cell(step) {
      if (!step || !step.id) return '<td><span class="zp-pill zp-pill--slate">Missing</span></td>';
      if (step.done) return '<td><span class="zp-pill zp-pill--emerald"><i class="fa-solid fa-check"></i>' + esc(Z().prettyDate(step.date) || 'Done') + '</span></td>';
      if (step.active) return '<td><span class="zp-pill zp-pill--blue">In Progress</span></td>';
      return '<td><span class="zp-pill zp-pill--amber">Pending</span></td>';
    }
    function render() {
      const q = (($('#partner-search') || {}).value || '').toLowerCase();
      const st = (($('#status-filter') || {}).value) || 'all';
      const vis = rows.filter(function (r) {
        const blob = (r.p.ID + ' ' + Z().partnerLabel(r.p)).toLowerCase();
        return blob.indexOf(q) >= 0 && (st === 'all' || r.overall === st);
      });
      if (tbody) tbody.innerHTML = vis.map(function (r) {
        return '<tr data-status="' + r.overall + '"><td><div class="d-flex align-items-center gap-2"><img src="' + esc(Z().imageUrl(r.p.Profile_Image) || Z().DEFAULT_AVATAR) + '" style="width:30px;height:30px;border-radius:50%;object-fit:cover">' +
          '<div><div class="fw-semibold">' + esc(Z().partnerLabel(r.p)) + '</div><div class="text-muted" style="font-size:.68rem">' + esc(r.p.ID) + '</div></div></div></td>' +
          '<td>' + typePill(field(r.p, 'partner_type')) + '</td>' +
          '<td>' + pill(r.overall) + '</td>' +
          r.steps.map(cell).join('') +
          '<td>' + (r.o.allDone ? pill('Ready') : pill('Locked')) + '</td>' +
          '<td><div class="d-flex align-items-center gap-2"><div class="zp-progress" style="width:56px"><span class="' + (r.o.pct >= 100 ? 'bg-success' : r.o.pct ? 'bg-primary' : 'bg-secondary') + '" style="width:' + r.o.pct + '%"></span></div><span class="small fw-bold">' + r.o.pct + '%</span></div></td></tr>';
      }).join('');
      const c = $('#table-count');
      if (c) c.textContent = 'Showing ' + vis.length + ' of ' + rows.length + ' partners';
    }
    ['partner-search', 'status-filter', 'level-filter'].forEach(function (id) {
      document.getElementById(id)?.addEventListener('input', render);
      document.getElementById(id)?.addEventListener('change', render);
    });
    render();
    const kpis = $$('.zp-stat-value');
    if (kpis[0]) kpis[0].textContent = String(partners.length);
    if (kpis[1]) kpis[1].textContent = String(partners.length);
    if (kpis[2]) kpis[2].textContent = String(rows.filter(function (r) { return r.overall === 'In Progress'; }).length);
    if (kpis[3]) kpis[3].textContent = String(rows.filter(function (r) { return r.overall === 'Completed'; }).length);
    if (kpis[4]) kpis[4].textContent = String(rows.filter(function (r) { return r.overall === 'Pending'; }).length);
    if (kpis[5]) kpis[5].textContent = partners.length ? Math.round(rows.filter(function (r) { return r.overall === 'Completed'; }).length / partners.length * 1000) / 10 + '%' : '0%';

    const stepCard = $$('.zp-card-title').find(function (t) { return /Onboarding by Step/.test(t.textContent); });
    if (stepCard) {
      const box = stepCard.parentElement.querySelector('.d-flex.flex-column');
      if (box) {
        box.innerHTML = Z().ONBOARD_TASKS.map(function (def, i) {
          const n = rows.filter(function (r) { return r.steps[i] && r.steps[i].done; }).length;
          const pct = partners.length ? Math.round(n / partners.length * 1000) / 10 : 0;
          return '<div><div class="d-flex justify-content-between" style="font-size:.7rem"><span>' + (i + 1) + '. ' + esc(def.name) + '</span><b>' + n + ' (' + pct + '%)</b></div><div class="zp-progress mt-1"><span style="width:' + pct + '%;background:#10b981"></span></div></div>';
        }).join('');
      }
    }

    if (global.ZPPages) {
      try { global.ZPPages.adminOnboardingExtras(partners, tasks, rows); }
      catch (e) { console.warn('adminOnboardingExtras failed', e); }
    }
  }

  async function mountAdminPartnerView() {
    const id = Z().queryParam('id') || session.partnerId;
    if (!id) {
      const page = $('.zp-page');
      if (page) page.insertAdjacentHTML('afterbegin', '<div class="alert alert-warning">Open a partner from All Partners. Missing <code>?id=</code>.</div>');
      return;
    }
    const bundle = await Z().loadPartnerBundle(id);
    applySessionFromBundle(bundle, session.loginUser);
    const s = session;
    const h1 = $('.zp-page h1');
    if (h1) h1.textContent = s.name;
    $$('.zp-page .zp-pill').forEach(function (el, i) {
      if (i === 0) el.outerHTML = '<span class="zp-pill ' + statusClass(s.status) + '">' + esc(s.status) + '</span>';
      if (i === 1) el.outerHTML = typePill(s.type);
    });
    const info = $$('.zp-info-value');
    const labels = $$('.zp-info-label');
    labels.forEach(function (lab, i) {
      const key = lab.textContent.trim();
      const val = info[i];
      if (!val) return;
      if (key === 'Partner ID') val.textContent = s.partnerId;
      if (key === 'Email') val.textContent = s.email;
      if (key === 'Phone') val.textContent = s.phone || '—';
      if (key === 'Company') val.textContent = s.org || '—';
      if (key === 'Location') val.textContent = s.address || '—';
      if (key === 'Website') { val.textContent = s.website || '—'; val.classList.add('text-primary'); }
      if (key === 'Industry') val.innerHTML = esc(s.industries.join(', ') || '—');
      if (key === 'Partner Level') val.innerHTML = esc(s.type);
    });
    const stepper = $('.zp-stepper');
    if (stepper) stepper.innerHTML = renderStepper(s.steps);
    const head = $$('.zp-card-title').find(function (t) { return t.textContent.indexOf('Onboarding Progress') >= 0; });
    if (head) {
      const pct = head.parentElement.querySelector('.text-primary, span');
      if (pct) pct.textContent = s.onboard.done + ' of ' + s.onboard.total + ' completed';
    }
    const taskTable = $$('.zp-card-title').find(function (t) { return t.textContent.indexOf('Recent Tasks') >= 0; });
    if (taskTable) {
      const tb = taskTable.closest('.zp-card').querySelector('tbody');
      const all = (s.steps.map(function (st) { return st.record; }).filter(Boolean)).concat(s.extraTasks);
      if (tb) tb.innerHTML = all.map(function (t) {
        return '<tr><td class="fw-semibold">' + esc(field(t, 'Task_Name')) + '</td><td>' + pill(field(t, 'priority')) + '</td>' +
          '<td class="text-secondary">System</td><td class="text-secondary">' + esc(Z().prettyDate(field(t, 'Task_Date'))) + '</td>' +
          '<td>' + pill(field(t, 'status')) + '</td></tr>';
      }).join('') || '<tr><td colspan="5">No tasks</td></tr>';
    }
    const crumb = $('#app-topbar .zp-breadcrumb span.text-secondary');
    if (crumb) crumb.textContent = 'Partners › ' + s.name;

    if (global.ZPPages) {
      try { global.ZPPages.partnerViewExtras(session); }
      catch (e) { console.warn('partnerViewExtras failed', e); }
    }
  }

  async function mountAdminDashboard() {
    const partners = await Z().getRecords(Z().REPORTS.partners);
    const tasks = await Z().getRecords(Z().REPORTS.tasks);
    const refs = await Z().getRecords(Z().REPORTS.referrals);
    buildAdminStats(partners, refs);
    const tbody = $('#partner-tbody');
    if (tbody) tbody.innerHTML = partners.slice(0, 8).map(function (p) { return partnerRow(p, true); }).join('');
    const kpis = $$('.zp-stat-value');
    if (kpis[0]) kpis[0].textContent = String(partners.length);
    if (kpis[1]) kpis[1].textContent = String(partners.filter(function (p) { return field(p, 'partner_status') === 'Active'; }).length);
    if (kpis[2]) kpis[2].textContent = String(refs.length);
    const hero = $('.zp-hero p');
    if (hero) hero.textContent = partners.length + ' partners, ' + refs.length + ' referrals, ' + tasks.filter(function (t) { return field(t, 'status') !== 'Completed'; }).length + ' open tasks.';
    const heroStats = $$('.zp-hero-stat-value');
    if (heroStats[0]) heroStats[0].textContent = String(partners.length);
    if (heroStats[1]) heroStats[1].textContent = String(partners.filter(function (p) { return field(p, 'partner_status') === 'Active'; }).length);
    const badge = $$('.badge').find(function (b) { return b.closest('h3'); });
    if (badge) badge.textContent = String(partners.length);
    const pending = tasks.filter(function (t) { return field(t, 'status') === 'Pending' || field(t, 'status') === 'In Progress'; }).slice(0, 3);
    const pendingBox = $$('.zp-card-title').find(function (t) { return /Pending Tasks/.test(t.textContent); });
    if (pendingBox) {
      const list = pendingBox.closest('.zp-card').querySelector('.d-flex.flex-column');
      if (list) list.innerHTML = pending.map(function (t) {
        return '<div class="d-flex gap-2 p-2 border rounded-3" style="background:#f8fafc"><span class="zp-stat-icon tint-indigo flex-shrink-0" style="width:32px;height:32px;font-size:.8rem"><i class="fa-solid fa-list-check"></i></span>' +
          '<div><div class="fw-semibold" style="font-size:.74rem">' + esc(field(t, 'Task_Name')) + '</div>' +
          '<div class="text-muted" style="font-size:.66rem">' + esc(Z().lookupName(t.Partner_Name)) + '</div>' +
          '<div class="d-flex gap-2 mt-1">' + pill(field(t, 'priority')) + '<span class="text-muted" style="font-size:.62rem">' + esc(field(t, 'status')) + '</span></div></div></div>';
      }).join('') || '<div class="text-muted small p-2">No open tasks</div>';
    }
    const assign = $$('button').find(function (b) { return /Assign New Task/.test(b.textContent); });
    if (assign) {
      const clone = assign.cloneNode(true);
      assign.parentNode.replaceChild(clone, assign);
      clone.addEventListener('click', function (e) {
        e.preventDefault();
        const opts = partners.map(function (p) { return '<option value="' + p.ID + '">' + esc(Z().partnerLabel(p)) + '</option>'; }).join('');
        openModal({
          title: 'Assign Task',
          body: '<label class="form-label">Task Name</label><input id="at-name" class="form-control mb-3">' +
            '<label class="form-label">Partner</label><select id="at-partner" class="form-select mb-3">' + opts + '</select>' +
            '<label class="form-label">Priority</label><select id="at-pri" class="form-select mb-3">' + Z().TASK_PRIORITIES.map(function (x) { return '<option>' + x + '</option>'; }).join('') + '</select>' +
            '<label class="form-label">Description</label><textarea id="at-desc" class="form-control" rows="3"></textarea>',
          actions: '<button class="btn btn-light" data-bs-dismiss="modal">Cancel</button><button class="btn btn-primary" id="at-save" data-zp>Create Task</button>'
        });
        $('#at-save')?.addEventListener('click', async function () {
          try {
            await Z().addRecord(Z().FORMS.Task, {
              Partner_Name: $('#at-partner').value,
              Task_Name: $('#at-name').value.trim(),
              Task_Description: $('#at-desc').value.trim(),
              Task_Date: Z().today(),
              priority: $('#at-pri').value,
              status: 'Pending'
            });
            closeModal();
            showToast('Task created', 'success');
            await mountAdminDashboard();
          } catch (err) { showToast('Could not create task', 'error'); }
        });
      });
    }
    const invite = $$('a,button').find(function (b) { return /Invite Partner/.test(b.textContent); });
    invite?.addEventListener('click', function (e) { e.preventDefault(); addPartnerModal(); });

    if (global.ZPPages) {
      try { global.ZPPages.adminDashboardExtras(partners, refs, tasks, adminStats); }
      catch (e) { console.warn('admin dashboard extras failed', e); }
    }
  }

  async function mountGeneric() {
    if (!session.isAdmin && !session.partner) {
      const page = $('.zp-page');
      if (page && !page.querySelector('#zp-register')) {
        page.insertAdjacentHTML('afterbegin', registerCard());
        bindRegister(function () { location.reload(); });
      }
    }
  }

  function pages() { return global.ZPPages; }

  async function mount(active, variant) {
    try {
      if (variant === 'admin') {
        if (active === 'partners') return mountAdminPartners();
        if (active === 'onboarding') return mountAdminOnboarding();
        if (active === 'partnerView') return mountAdminPartnerView();
        if (active === 'dashboard') return mountAdminDashboard();
        if (active === 'payouts' && pages()) return pages().adminPayouts(session);
        if (active === 'tickets' && pages()) return pages().adminTickets(session);
        return;
      }
      if (active === 'dashboard') return mountDashboard();
      if (active === 'onboarding') return mountOnboarding();
      if (active === 'profile') return mountProfile();
      if (active === 'training') return mountTraining();
      if (active === 'resources') return mountResources();
      if (active === 'referral') return mountReferral();
      if (active === 'leads' && pages()) return pages().leads(session);
      if (active === 'activities' && pages()) return pages().activities(session);
      if (active === 'earnings' && pages()) return pages().earnings(session);
      if (active === 'reports' && pages()) return pages().reports(session);
      return mountGeneric();
    } catch (e) {
      console.error('mount error', e);
      showToast('Could not load live data', 'error');
    }
  }

  function personalizeChrome() {
    const s = session;
    $$('.zp-user-card .fw-semibold').forEach(function (el) {
      if (!s.isAdmin) el.textContent = s.name;
    });
    $$('.zp-user-card img, .zp-avatar').forEach(function (img) {
      if (!s.isAdmin && s.avatar) img.src = s.avatar;
    });
    const idLine = $$('.zp-side-extra').find(function (el) { return /Partner ID/.test(el.textContent); });
    if (idLine && s.partnerId) idLine.textContent = 'Partner ID: ' + s.partnerId;
    const strength = $$('.zp-side-extra .text-success, .zp-side-extra [class*="text-"]').find(function (el) { return /%/.test(el.textContent); });
    if (strength && !s.isAdmin) strength.textContent = s.onboard.pct + '%';
    const bar = $('.zp-side-extra .zp-progress > span');
    if (bar && !s.isAdmin) bar.style.width = s.onboard.pct + '%';
    const onboardLink = $$('.zp-nav-link').find(function (a) { return /Onboarding/.test(a.textContent) && a.getAttribute('href') === 'onboarding.html'; });
    if (onboardLink) {
      const badge = onboardLink.querySelector('.badge');
      if (badge) badge.innerHTML = s.onboard.allDone ? '<i class="fa-solid fa-check"></i>' : s.onboard.done + '/' + s.onboard.total;
    }
    if (global.ZPPages && !s.isAdmin) {
      try {
        global.ZPPages.chromeExtras({
          tasks: (s.steps || []).map(function (x) { return x.record; }).filter(Boolean).concat(s.extraTasks || []),
          referrals: s.referrals, taken: s.taken, documents: s.documents
        });
      } catch (e) { /* ignore */ }
    }
    const top = $('#app-topbar');
    if (top && !top.querySelector('.zp-live-chip')) {
      const search = top.querySelector('.zp-top-search');
      if (search) search.insertAdjacentHTML('afterend', '<div class="d-none d-lg-block ms-2">' + liveChip() + '</div>');
    }
  }

  async function boot(opts) {
    opts = opts || {};
    document.body.dataset.zpPage = opts.active || '';
    document.body.dataset.zpVariant = opts.variant || 'partner';
    showBoot();
    try {
      await loadSession(opts);
      if (typeof injectLayout === 'function') {
        injectLayout(Object.assign({}, opts, { skipInit: true }));
      }
      personalizeChrome();
      await mount(opts.active, opts.variant);
      if (!opts.skipInit && typeof wireUniversalActions === 'function') {
        try { wireGlobalUI(); } catch (e) { /* layout may already */ }
      }
      if (!sessionStorage.getItem('zp_welcomed_v4')) {
        sessionStorage.setItem('zp_welcomed_v4', '1');
        const who = opts.variant === 'admin' ? (session.loginUser || 'Admin') : session.firstName;
        setTimeout(function () {
          showToast('Welcome, ' + who + ' · ' + (session.live ? 'Creator connected' : 'Demo mode') + (session.partner ? '' : ' · no Partner Details yet'), 'info', 2600);
        }, 400);
      }
    } catch (e) {
      console.error(e);
      if (typeof injectLayout === 'function') injectLayout(opts);
      showToast('Could not start the partner process', 'error');
    } finally {
      hideBoot();
    }
  }

  global.ZPApp = {
    boot: boot,
    session: session,
    reload: reloadMine,
    refresh: refreshActive,
    mount: mount,
    ui: {
      esc: esc,
      pill: pill,
      typePill: typePill,
      statusClass: statusClass,
      emptyState: emptyState,
      registerCard: registerCard,
      bindRegister: bindRegister,
      showToast: function () { return global.showToast.apply(null, arguments); },
      openModal: function () { return global.openModal.apply(null, arguments); },
      closeModal: function () { return global.closeModal.apply(null, arguments); }
    }
  };
})(window);
