// ═══════════════════════════════════════════════════════════════════════════
// ZenPartner — Zoho Creator Widget SDK v2 data layer
// Forms / reports / fields come from Zenpartnerforms.txt
// API signatures come from "zoho creator widget backend prompt.txt"
// Falls back to a local demo store when the widget is opened outside Creator.
// ═══════════════════════════════════════════════════════════════════════════

(function (global) {
  'use strict';

  const FORMS = {
    Partner_Details: 'Partner_Details',
    Add_Referrals: 'Add_Referrals',
    Task: 'Task',
    Partner_Courses: 'Partner_Courses',
    Partner_Course_Taken: 'Partner_Course_Taken',
    Partner_Documents: 'Partner_Documents'
  };

  const REPORTS = {
    partners: 'Partner_Details_Report',
    referrals: 'All_Referrals',
    tasks: 'All_Tasks',
    courses: 'All_Partner_Courses',
    taken: 'Partner_Course_Taken_Report',
    documents: 'All_Partner_Documents'
  };

  const PARTNER_TYPES = ['Consultant', 'Freelancer', 'Agency', 'Zoho Partner', 'Business Professional', 'Other'];
  const PARTNER_STATUSES = ['Prospective', 'Documentation Pending', 'Training', 'Active', 'On Hold', 'Suspended', 'Terminated', 'Expired'];
  const INDUSTRIES = ['Technology', 'Finance', 'Healthcare', 'Retail', 'Education', 'Manufacturing', 'Logistics', 'Other'];
  const SERVICES = ['Lead Generation', 'Implementation', 'Support', 'Training', 'Consulting', 'Development', 'Other'];
  const TASK_PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];
  const TASK_STATUSES = ['Pending', 'In Progress', 'Completed', 'Cancelled', 'Hold'];
  const COURSE_STATUSES = ['Enrolled', 'In Progress', 'Completed', 'Dropped', 'Failed'];
  const REFERRAL_SERVICES = ['Website Development', 'Mobile App Development', 'Cloud Solutions', 'Digital Marketing', 'Implementation', 'Consulting', 'Support', 'Training'];
  const HEAR_ABOUT = ['Google Search', 'Referral', 'Social Media', 'Event', 'Partner Portal', 'Other'];

  const ONBOARD_TASKS = [
    {
      key: 'agreement',
      name: 'Agreement',
      match: /agreement/i,
      description: 'View and accept the Partner Agreement to begin your ZenPartner journey.',
      sub: 'View & Accept',
      priority: 'High',
      icon: 'fa-file-signature',
      tint: 'tint-indigo'
    },
    {
      key: 'nda',
      name: 'NDA Sign',
      match: /nda/i,
      description: 'Review and e-sign the Non-Disclosure Agreement.',
      sub: 'Review & Sign',
      priority: 'High',
      icon: 'fa-file-contract',
      tint: 'tint-sky'
    },
    {
      key: 'training',
      name: 'Training & Certification',
      match: /training|certif/i,
      description: 'Complete the required partner training and certification.',
      sub: 'Complete Training',
      priority: 'Medium',
      icon: 'fa-graduation-cap',
      tint: 'tint-violet'
    },
    {
      key: 'learn',
      name: 'Learn About Our Company',
      match: /learn about|our company/i,
      description: 'Learn about Zentegra, our solutions and how partners succeed with us.',
      sub: 'Complete Learning',
      priority: 'Medium',
      icon: 'fa-building',
      tint: 'tint-amber'
    },
    {
      key: 'resources',
      name: 'Resources Access',
      match: /resource/i,
      description: 'Unlock partner resources, documents and sales tools.',
      sub: 'Access Granted',
      priority: 'Low',
      icon: 'fa-folder-open',
      tint: 'tint-emerald'
    }
  ];

  const DEMO_KEY = 'zp_creator_db_v1';
  const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=60';

  const state = {
    ready: false,
    live: false,
    params: { scope: '', appLinkName: 'zenpartner', loginUser: '', themeBrandColor: '#5051F9', envUrlFragment: '' },
    initPromise: null
  };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }

  function escCrit(s) {
    return String(s == null ? '' : s).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  }

  function field(record, name, fallback) {
    if (!record) return fallback == null ? '' : fallback;
    const val = record[name];
    if (val === undefined || val === null || val === '') return fallback == null ? '' : fallback;
    return val;
  }

  function displayName(val) {
    if (val == null || val === '') return '';
    if (typeof val === 'string') return val;
    if (typeof val === 'object') {
      if (val.zc_display_value) return val.zc_display_value;
      const first = val.first_name || val.First_Name || '';
      const last = val.last_name || val.Last_Name || '';
      const joined = (first + ' ' + last).trim();
      if (joined) return joined;
      if (val.prefix || val.suffix) return [val.prefix, first, last, val.suffix].filter(Boolean).join(' ');
    }
    return String(val);
  }

  function addressText(val) {
    if (val == null || val === '') return '';
    if (typeof val === 'string') return val;
    if (typeof val === 'object') {
      if (val.zc_display_value) return val.zc_display_value;
      return [
        val.address_line_1 || val.Address_Line_1,
        val.address_line_2 || val.Address_Line_2,
        val.district_city || val.District_City || val.city,
        val.state_province || val.State_Province || val.state,
        val.postal_code || val.Postal_Code,
        val.country || val.Country
      ].filter(Boolean).join(', ');
    }
    return String(val);
  }

  function lookupId(val) {
    if (!val) return '';
    if (typeof val === 'object') return String(val.ID || '');
    return String(val);
  }

  function lookupName(val) {
    if (!val) return '';
    if (typeof val === 'object') return val.zc_display_value || displayName(val) || String(val.ID || '');
    return String(val);
  }

  function urlValue(val) {
    if (!val) return '';
    if (typeof val === 'object') return val.url || val.value || '';
    return String(val);
  }

  function asList(val) {
    if (val == null || val === '') return [];
    if (Array.isArray(val)) return val.filter(Boolean);
    return [val];
  }

  function inferHost() {
    const host = (global.location && location.host) || '';
    if (/zoho\.in/i.test(host)) return 'https://creatorapp.zoho.in';
    if (/zoho\.eu/i.test(host)) return 'https://creatorapp.zoho.eu';
    if (/zoho\.com\.au/i.test(host)) return 'https://creatorapp.zoho.com.au';
    if (/zoho\.com/i.test(host)) return 'https://creatorapp.zoho.com';
    return 'https://creatorapp.zoho.in';
  }

  function imageUrl(path) {
    if (!path) return '';
    if (typeof path === 'object') path = path.url || path.value || '';
    path = String(path || '');
    if (!path) return '';
    if (/^(https?:|data:|blob:)/i.test(path)) return path;
    return inferHost() + (path.charAt(0) === '/' ? path : '/' + path);
  }

  function fileNameFromPath(path) {
    const raw = String(path || '');
    const m = raw.match(/filepath=([^&]+)/);
    const fp = decodeURIComponent(m ? m[1] : raw.split('/').pop() || 'file');
    const cut = fp.indexOf('_');
    return cut > 0 ? fp.slice(cut + 1) : fp;
  }

  function today() {
    const d = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return String(d.getDate()).padStart(2, '0') + '-' + months[d.getMonth()] + '-' + d.getFullYear();
  }

  function prettyDate(val) {
    if (!val) return '';
    const s = String(val);
    const m = s.match(/^(\d{2})-([A-Za-z]{3})-(\d{4})/);
    if (m) return m[2] + ' ' + m[1] + ', ' + m[3];
    return s;
  }

  function parseErr(err) {
    try {
      if (err && err.responseText) return JSON.parse(err.responseText);
    } catch (e) { /* ignore */ }
    return { code: 0, message: (err && (err.message || err.statusText)) || 'Request failed' };
  }

  function isNoRecords(err) {
    return parseErr(err).code === 9280;
  }

  /* ── Demo store (preview / local) ── */
  function seedDemo() {
    const p1 = '3900000000001';
    const p2 = '3900000000002';
    const p3 = '3900000000003';
    const c1 = '3900000001001';
    const c2 = '3900000001002';
    const c3 = '3900000001003';
    const c4 = '3900000001004';
    return {
      seq: 3900000002000,
      partners: [
        {
          ID: p1,
          Organization_Name: 'Acme Corporation',
          partner_name: 'James Anderson',
          partner_type: 'Zoho Partner',
          primary_email: 'james.anderson@example.com',
          phone_number: '+1 (888) 123-4567',
          address: '123 Business Ave, Suite 500, New York, NY 10001, USA',
          website_url: { value: 'acmecorp.com', url: 'https://www.acmecorp.com' },
          industry_focus: ['Technology', 'Finance'],
          services_of_interest: ['Lead Generation', 'Consulting', 'Implementation'],
          partner_status: 'Training',
          Profile_Image: DEFAULT_AVATAR
        },
        {
          ID: p2,
          Organization_Name: 'BrightWave Solutions',
          partner_name: 'Sarah Mitchell',
          partner_type: 'Agency',
          primary_email: 'sarah.mitchell@example.com',
          phone_number: '+1 (555) 234-5678',
          address: '88 Market Street, Austin, TX 78701, USA',
          website_url: { value: 'brightwave.com', url: 'https://www.brightwave.com' },
          industry_focus: ['Healthcare', 'Retail'],
          services_of_interest: ['Support', 'Training'],
          partner_status: 'Documentation Pending',
          Profile_Image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=60'
        },
        {
          ID: p3,
          Organization_Name: 'Northstar Consulting',
          partner_name: 'Michael Davis',
          partner_type: 'Consultant',
          primary_email: 'michael.davis@example.com',
          phone_number: '+1 (555) 345-6789',
          address: '14 King St, Toronto, ON, Canada',
          website_url: { value: 'northstar.co', url: 'https://www.northstar.co' },
          industry_focus: ['Education'],
          services_of_interest: ['Development', 'Consulting'],
          partner_status: 'Prospective',
          Profile_Image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=60'
        }
      ],
      tasks: [
        taskRec('3900000000101', p1, 'James Anderson', 'Agreement', ONBOARD_TASKS[0].description, '01-May-2024', 'High', 'Completed'),
        taskRec('3900000000102', p1, 'James Anderson', 'NDA Sign', ONBOARD_TASKS[1].description, '02-May-2024', 'High', 'Completed'),
        taskRec('3900000000103', p1, 'James Anderson', 'Training & Certification', ONBOARD_TASKS[2].description, '19-Aug-2026', 'Medium', 'In Progress'),
        taskRec('3900000000104', p1, 'James Anderson', 'Learn About Our Company', ONBOARD_TASKS[3].description, '19-Aug-2026', 'Medium', 'Pending'),
        taskRec('3900000000105', p1, 'James Anderson', 'Resources Access', ONBOARD_TASKS[4].description, '19-Aug-2026', 'Low', 'Pending'),
        taskRec('3900000000111', p2, 'Sarah Mitchell', 'Agreement', ONBOARD_TASKS[0].description, '10-Aug-2026', 'High', 'Completed'),
        taskRec('3900000000112', p2, 'Sarah Mitchell', 'NDA Sign', ONBOARD_TASKS[1].description, '19-Aug-2026', 'High', 'In Progress'),
        taskRec('3900000000113', p2, 'Sarah Mitchell', 'Training & Certification', ONBOARD_TASKS[2].description, '19-Aug-2026', 'Medium', 'Pending'),
        taskRec('3900000000114', p2, 'Sarah Mitchell', 'Learn About Our Company', ONBOARD_TASKS[3].description, '19-Aug-2026', 'Medium', 'Pending'),
        taskRec('3900000000115', p2, 'Sarah Mitchell', 'Resources Access', ONBOARD_TASKS[4].description, '19-Aug-2026', 'Low', 'Pending'),
        taskRec('3900000000121', p3, 'Michael Davis', 'Agreement', ONBOARD_TASKS[0].description, '19-Aug-2026', 'High', 'Pending'),
        taskRec('3900000000122', p3, 'Michael Davis', 'NDA Sign', ONBOARD_TASKS[1].description, '19-Aug-2026', 'High', 'Pending'),
        taskRec('3900000000123', p3, 'Michael Davis', 'Training & Certification', ONBOARD_TASKS[2].description, '19-Aug-2026', 'Medium', 'Pending'),
        taskRec('3900000000124', p3, 'Michael Davis', 'Learn About Our Company', ONBOARD_TASKS[3].description, '19-Aug-2026', 'Medium', 'Pending'),
        taskRec('3900000000125', p3, 'Michael Davis', 'Resources Access', ONBOARD_TASKS[4].description, '19-Aug-2026', 'Low', 'Pending')
      ],
      referrals: [
        { ID: '3900000000201', partner_id: { ID: p1, zc_display_value: 'James Anderson' }, Company_Name: 'TechNova Solutions', Contact_Person: 'John Smith', Email: 'john@technova.com', Project_Service_Interest: 'Website Development', How_did_you_hear_about_us: 'Referral', Project_Description: 'Corporate site rebuild with partner portal integration.' },
        { ID: '3900000000202', partner_id: { ID: p1, zc_display_value: 'James Anderson' }, Company_Name: 'BrightWave Industries', Contact_Person: 'Lisa Brown', Email: 'lisa@brightwave.io', Project_Service_Interest: 'Mobile App Development', How_did_you_hear_about_us: 'Event', Project_Description: 'Field-service mobile app for technicians.' },
        { ID: '3900000000203', partner_id: { ID: p1, zc_display_value: 'James Anderson' }, Company_Name: 'CloudCore Systems', Contact_Person: 'Robert Johnson', Email: 'robert@cloudcore.com', Project_Service_Interest: 'Cloud Solutions', How_did_you_hear_about_us: 'Google Search', Project_Description: 'Migrate on-prem CRM to Zoho cloud.' },
        { ID: '3900000000204', partner_id: { ID: p2, zc_display_value: 'Sarah Mitchell' }, Company_Name: 'Harbor Health', Contact_Person: 'Priya Nair', Email: 'priya@harbor.health', Project_Service_Interest: 'Implementation', How_did_you_hear_about_us: 'Partner Portal', Project_Description: 'Clinic operations suite implementation.' }
      ],
      courses: [
        { ID: c1, Course_Name: 'Zentegra Solutions Overview', Description: 'Overview of Zentegra solutions and the partner value proposition.', Url: 'https://learn.zentegra.com/solutions-overview' },
        { ID: c2, Course_Name: 'Sales Process & Methodology', Description: 'How we qualify, propose and close partner-sourced opportunities.', Url: 'https://learn.zentegra.com/sales-process' },
        { ID: c3, Course_Name: 'Cloud & Technology Basics', Description: 'Cloud fundamentals partners need before a customer conversation.', Url: 'https://learn.zentegra.com/cloud-basics' },
        { ID: c4, Course_Name: 'Compliance & Policies', Description: 'Partner code of conduct, data handling and brand usage.', Url: 'https://learn.zentegra.com/compliance' }
      ],
      taken: [
        { ID: '3900000000301', Partner_Name: { ID: p1, zc_display_value: 'James Anderson' }, Course_Name: { ID: c1, zc_display_value: 'Zentegra Solutions Overview' }, status: 'Completed' },
        { ID: '3900000000302', Partner_Name: { ID: p1, zc_display_value: 'James Anderson' }, Course_Name: { ID: c2, zc_display_value: 'Sales Process & Methodology' }, status: 'In Progress' },
        { ID: '3900000000303', Partner_Name: { ID: p1, zc_display_value: 'James Anderson' }, Course_Name: { ID: c3, zc_display_value: 'Cloud & Technology Basics' }, status: 'Enrolled' }
      ],
      documents: [
        { ID: '3900000000401', Document_Name: 'Partner Agreement', File_upload: ['/demo/Partner_Agreement.pdf'] },
        { ID: '3900000000402', Document_Name: 'Non-Disclosure Agreement', File_upload: ['/demo/NDA.pdf'] },
        { ID: '3900000000403', Document_Name: 'Commission Structure Guide', File_upload: ['/demo/Commission_Guide.xlsx'] },
        { ID: '3900000000404', Document_Name: 'Brand Guidelines', File_upload: ['/demo/Brand_Guidelines.pdf'] },
        { ID: '3900000000405', Document_Name: 'Sales Playbook', File_upload: ['/demo/Sales_Playbook.pdf'] },
        { ID: '3900000000406', Document_Name: 'Solution Portfolio Presentation', File_upload: ['/demo/Portfolio.pptx'] }
      ]
    };
  }

  function taskRec(id, partnerId, partnerLabel, name, desc, date, priority, status) {
    return {
      ID: id,
      Partner_Name: { ID: partnerId, zc_display_value: partnerLabel },
      Task_Name: name,
      Task_Description: desc,
      Task_Date: date,
      priority: priority,
      status: status
    };
  }

  function readDemo() {
    try {
      const raw = localStorage.getItem(DEMO_KEY);
      if (raw) {
        const db = JSON.parse(raw);
        if (db && Array.isArray(db.partners)) return db;
      }
    } catch (e) { /* ignore */ }
    const db = seedDemo();
    writeDemo(db);
    return db;
  }

  function writeDemo(db) {
    try { localStorage.setItem(DEMO_KEY, JSON.stringify(db)); } catch (e) { /* ignore */ }
  }

  function nextId(db) {
    db.seq = (db.seq || 3900000002000) + 1;
    return String(db.seq);
  }

  function demoBucket(report) {
    if (report === REPORTS.partners) return 'partners';
    if (report === REPORTS.referrals) return 'referrals';
    if (report === REPORTS.tasks) return 'tasks';
    if (report === REPORTS.courses) return 'courses';
    if (report === REPORTS.taken) return 'taken';
    if (report === REPORTS.documents) return 'documents';
    return null;
  }

  function formToBucket(form) {
    if (form === FORMS.Partner_Details) return 'partners';
    if (form === FORMS.Add_Referrals) return 'referrals';
    if (form === FORMS.Task) return 'tasks';
    if (form === FORMS.Partner_Courses) return 'courses';
    if (form === FORMS.Partner_Course_Taken) return 'taken';
    if (form === FORMS.Partner_Documents) return 'documents';
    return null;
  }

  function hydrateLookups(data, db) {
    const out = Object.assign({}, data);
    ['Partner_Name', 'partner_id'].forEach(function (k) {
      if (out[k] && typeof out[k] === 'string') {
        const p = (db.partners || []).find(function (x) { return x.ID === out[k]; });
        out[k] = { ID: out[k], zc_display_value: p ? displayName(p.partner_name) : out[k] };
      }
    });
    if (out.Course_Name && typeof out.Course_Name === 'string') {
      const c = (db.courses || []).find(function (x) { return x.ID === out.Course_Name; });
      out.Course_Name = { ID: out.Course_Name, zc_display_value: c ? c.Course_Name : out.Course_Name };
    }
    return out;
  }

  function matchCriteria(record, criteria) {
    if (!criteria) return true;
    const raw = String(criteria).trim().replace(/^\(/, '').replace(/\)$/, '');
    const parts = raw.split(/\s*&&\s*/);
    return parts.every(function (part) {
      let m = part.match(/^\(?([A-Za-z0-9_]+)\s*==\s*"([^"]*)"\)?$/);
      if (m) return String(unwrap(record[m[1]])).toLowerCase() === m[2].toLowerCase();
      m = part.match(/^\(?([A-Za-z0-9_]+)\s*==\s*([0-9]+)\)?$/);
      if (m) return String(unwrap(record[m[1]])) === m[2];
      m = part.match(/^\(?([A-Za-z0-9_]+)\.contains\("([^"]*)"\)\)?$/);
      if (m) return String(unwrap(record[m[1]])).toLowerCase().indexOf(m[2].toLowerCase()) >= 0;
      return true;
    });
  }

  function unwrap(val) {
    if (val && typeof val === 'object') return val.ID || val.zc_display_value || val.url || '';
    return val == null ? '' : val;
  }

  async function demoGetRecords(report, criteria) {
    const db = readDemo();
    const key = demoBucket(report);
    const rows = ((key && db[key]) || []).filter(function (r) { return matchCriteria(r, criteria); });
    return rows.slice();
  }

  async function demoGetRecord(report, id) {
    const rows = await demoGetRecords(report);
    const rec = rows.find(function (r) { return String(r.ID) === String(id); });
    if (!rec) {
      const err = new Error('No records found');
      err.responseText = JSON.stringify({ code: 9280, message: 'No records found matching the given criteria.' });
      throw err;
    }
    return rec;
  }

  async function demoAdd(form, data) {
    const db = readDemo();
    const key = formToBucket(form);
    if (!key) throw new Error('Unknown form ' + form);
    const rec = hydrateLookups(Object.assign({}, data, { ID: nextId(db) }), db);
    db[key].push(rec);
    writeDemo(db);
    return rec.ID;
  }

  async function demoUpdate(report, id, data) {
    const db = readDemo();
    const key = demoBucket(report);
    const list = db[key] || [];
    const idx = list.findIndex(function (r) { return String(r.ID) === String(id); });
    if (idx < 0) throw new Error('Record not found');
    list[idx] = hydrateLookups(Object.assign({}, list[idx], data), db);
    writeDemo(db);
    return id;
  }

  /* ── Live Creator API ── */
  async function liveGetRecords(report, criteria) {
    const all = [];
    let page = 1;
    const pageSize = 200;
    while (true) {
      const config = {
        app_name: state.params.appLinkName,
        report_name: report,
        page: page,
        pageSize: pageSize
      };
      if (criteria) config.criteria = criteria;
      try {
        const res = await ZOHO.CREATOR.DATA.getRecords(config);
        const rows = res.data || [];
        all.push.apply(all, rows);
        if (rows.length < pageSize) break;
        page += 1;
      } catch (err) {
        if (isNoRecords(err)) break;
        throw err;
      }
    }
    return all;
  }

  async function liveGetRecord(report, id) {
    const res = await ZOHO.CREATOR.DATA.getRecordById({
      app_name: state.params.appLinkName,
      report_name: report,
      id: String(id)
    });
    return res.data;
  }

  async function liveAdd(form, data) {
    const res = await ZOHO.CREATOR.DATA.addRecords({
      app_name: state.params.appLinkName,
      form_name: form,
      payload: { data: data }
    });
    return res.data && res.data.ID;
  }

  async function liveUpdate(report, id, data) {
    const res = await ZOHO.CREATOR.DATA.updateRecordById({
      app_name: state.params.appLinkName,
      report_name: report,
      id: String(id),
      payload: { data: data }
    });
    return res.data && res.data.ID;
  }

  async function getRecords(report, criteria) {
    return state.live ? liveGetRecords(report, criteria) : demoGetRecords(report, criteria);
  }

  async function getRecord(report, id) {
    return state.live ? liveGetRecord(report, id) : demoGetRecord(report, id);
  }

  async function addRecord(form, data) {
    return state.live ? liveAdd(form, data) : demoAdd(form, data);
  }

  async function updateRecord(report, id, data) {
    return state.live ? liveUpdate(report, id, data) : demoUpdate(report, id, data);
  }

  /* ── Domain helpers ── */
  function partnerLabel(rec) {
    return displayName(field(rec, 'partner_name')) || field(rec, 'Organization_Name') || field(rec, 'primary_email') || 'Partner';
  }

  function matchOnboardKey(taskName) {
    const name = String(taskName || '');
    for (let i = 0; i < ONBOARD_TASKS.length; i++) {
      if (ONBOARD_TASKS[i].match.test(name)) return ONBOARD_TASKS[i].key;
    }
    return '';
  }

  function normalizeSteps(tasks) {
    return ONBOARD_TASKS.map(function (def) {
      const rec = (tasks || []).find(function (t) { return def.match.test(field(t, 'Task_Name')); });
      const status = rec ? (field(rec, 'status') || 'Pending') : 'Pending';
      return {
        key: def.key,
        name: def.name,
        description: rec ? (field(rec, 'Task_Description') || def.description) : def.description,
        sub: def.sub,
        priority: rec ? (field(rec, 'priority') || def.priority) : def.priority,
        icon: def.icon,
        tint: def.tint,
        status: status,
        date: rec ? field(rec, 'Task_Date') : '',
        id: rec ? rec.ID : '',
        record: rec || null,
        done: status === 'Completed',
        active: status === 'In Progress',
        missing: !rec
      };
    });
  }

  function onboardSummary(steps) {
    const done = steps.filter(function (s) { return s.done; }).length;
    const current = steps.find(function (s) { return !s.done; }) || null;
    return { done: done, total: steps.length, pct: Math.round((done / steps.length) * 100), current: current, allDone: done === steps.length };
  }

  function nextPartnerStatus(steps, current) {
    if (['On Hold', 'Suspended', 'Terminated', 'Expired'].indexOf(current) >= 0) return current;
    const done = steps.filter(function (s) { return s.done; }).length;
    if (done >= 5) return 'Active';
    if (done >= 3) return 'Training';
    if (done >= 1) return 'Documentation Pending';
    return current || 'Prospective';
  }

  async function findPartnerByEmail(email) {
    if (!email) return null;
    const rows = await getRecords(REPORTS.partners, '(primary_email == "' + escCrit(email) + '")');
    return rows[0] || null;
  }

  async function tasksForPartner(partnerId) {
    if (!partnerId) return [];
    return getRecords(REPORTS.tasks, '(Partner_Name == ' + partnerId + ')');
  }

  async function referralsForPartner(partnerId) {
    if (!partnerId) return [];
    return getRecords(REPORTS.referrals, '(partner_id == ' + partnerId + ')');
  }

  async function takenForPartner(partnerId) {
    if (!partnerId) return [];
    return getRecords(REPORTS.taken, '(Partner_Name == ' + partnerId + ')');
  }

  async function ensureOnboardingTasks(partner) {
    if (!partner || !partner.ID) return [];
    const existing = await tasksForPartner(partner.ID);
    const created = [];
    for (let i = 0; i < ONBOARD_TASKS.length; i++) {
      const def = ONBOARD_TASKS[i];
      const found = existing.find(function (t) { return def.match.test(field(t, 'Task_Name')); });
      if (found) continue;
      const id = await addRecord(FORMS.Task, {
        Partner_Name: partner.ID,
        Task_Name: def.name,
        Task_Description: def.description,
        Task_Date: today(),
        priority: def.priority,
        status: 'Pending'
      });
      created.push(id);
    }
    return created.length ? tasksForPartner(partner.ID) : existing;
  }

  async function createPartnerWithTasks(data) {
    const payload = {
      Organization_Name: data.Organization_Name || '',
      partner_name: data.partner_name || '',
      partner_type: data.partner_type || 'Consultant',
      primary_email: data.primary_email || '',
      phone_number: data.phone_number || '',
      address: data.address || '',
      website_url: data.website_url || '',
      industry_focus: asList(data.industry_focus),
      services_of_interest: asList(data.services_of_interest),
      partner_status: data.partner_status || 'Prospective'
    };
    const id = await addRecord(FORMS.Partner_Details, payload);
    const partner = { ID: id };
    try {
      const full = await getRecord(REPORTS.partners, id);
      Object.assign(partner, full);
    } catch (e) {
      Object.assign(partner, payload);
    }
    const taskIds = [];
    for (let i = 0; i < ONBOARD_TASKS.length; i++) {
      const def = ONBOARD_TASKS[i];
      const tid = await addRecord(FORMS.Task, {
        Partner_Name: id,
        Task_Name: def.name,
        Task_Description: def.description,
        Task_Date: today(),
        priority: def.priority,
        status: 'Pending'
      });
      taskIds.push(tid);
    }
    return { partner: partner, taskIds: taskIds };
  }

  async function setTaskStatus(taskId, status, extra) {
    const data = Object.assign({ status: status }, extra || {});
    if (status === 'Completed' && !data.Task_Date) data.Task_Date = today();
    return updateRecord(REPORTS.tasks, taskId, data);
  }

  async function syncPartnerStatus(partner, steps) {
    if (!partner || !partner.ID) return partner;
    const next = nextPartnerStatus(steps, field(partner, 'partner_status'));
    if (next && next !== field(partner, 'partner_status')) {
      await updateRecord(REPORTS.partners, partner.ID, { partner_status: next });
      partner.partner_status = next;
    }
    return partner;
  }

  async function completeOnboardStep(partner, key) {
    const tasks = await ensureOnboardingTasks(partner);
    const def = ONBOARD_TASKS.find(function (t) { return t.key === key; });
    const rec = tasks.find(function (t) { return def && def.match.test(field(t, 'Task_Name')); });
    if (!rec) throw new Error('Onboarding task not found: ' + key);
    await setTaskStatus(rec.ID, 'Completed');
    const refreshed = await tasksForPartner(partner.ID);
    const steps = normalizeSteps(refreshed);
    await syncPartnerStatus(partner, steps);
    return steps;
  }

  async function startOnboardStep(partner, key) {
    const tasks = await ensureOnboardingTasks(partner);
    const def = ONBOARD_TASKS.find(function (t) { return t.key === key; });
    const rec = tasks.find(function (t) { return def && def.match.test(field(t, 'Task_Name')); });
    if (!rec) return;
    if (field(rec, 'status') === 'Pending') await setTaskStatus(rec.ID, 'In Progress');
  }

  async function loadPartnerBundle(partnerOrId) {
    let partner = partnerOrId;
    if (typeof partnerOrId === 'string') {
      try { partner = await getRecord(REPORTS.partners, partnerOrId); }
      catch (e) { partner = null; }
    }
    if (!partner) {
      return { partner: null, tasks: [], steps: normalizeSteps([]), referrals: [], courses: [], taken: [], documents: [], extraTasks: [] };
    }
    const tasks = await ensureOnboardingTasks(partner);
    const steps = normalizeSteps(tasks);
    await syncPartnerStatus(partner, steps);
    const extraTasks = tasks.filter(function (t) { return !matchOnboardKey(field(t, 'Task_Name')); });
    const [referrals, courses, taken, documents] = await Promise.all([
      referralsForPartner(partner.ID),
      getRecords(REPORTS.courses),
      takenForPartner(partner.ID),
      getRecords(REPORTS.documents)
    ]);
    return { partner: partner, tasks: tasks, steps: steps, extraTasks: extraTasks, referrals: referrals, courses: courses, taken: taken, documents: documents };
  }

  async function addReferral(partnerId, data) {
    return addRecord(FORMS.Add_Referrals, {
      partner_id: partnerId,
      Company_Name: data.Company_Name || '',
      Contact_Person: data.Contact_Person || '',
      Email: data.Email || '',
      Project_Service_Interest: data.Project_Service_Interest || '',
      How_did_you_hear_about_us: data.How_did_you_hear_about_us || '',
      Project_Description: data.Project_Description || ''
    });
  }

  async function enrollCourse(partnerId, courseId, status) {
    const existing = await getRecords(REPORTS.taken, '(Partner_Name == ' + partnerId + ' && Course_Name == ' + courseId + ')');
    if (existing[0]) {
      await updateRecord(REPORTS.taken, existing[0].ID, { status: status || 'In Progress' });
      return existing[0].ID;
    }
    return addRecord(FORMS.Partner_Course_Taken, {
      Partner_Name: partnerId,
      Course_Name: courseId,
      status: status || 'In Progress'
    });
  }

  async function maybeCompleteTraining(partner) {
    const courses = await getRecords(REPORTS.courses);
    if (!courses.length) return false;
    const taken = await takenForPartner(partner.ID);
    if (!taken.length) return false;
    const allDone = courses.every(function (c) {
      const row = taken.find(function (t) { return lookupId(t.Course_Name) === c.ID; });
      return row && field(row, 'status') === 'Completed';
    });
    if (!allDone) return false;
    const steps = normalizeSteps(await tasksForPartner(partner.ID));
    const training = steps.find(function (s) { return s.key === 'training'; });
    if (training && training.id && !training.done) {
      await setTaskStatus(training.id, 'Completed');
      await syncPartnerStatus(partner, normalizeSteps(await tasksForPartner(partner.ID)));
      return true;
    }
    return false;
  }

  function queryParam(name) {
    try { return new URLSearchParams(location.search).get(name) || ''; } catch (e) { return ''; }
  }

  async function initSdk() {
    if (!global.ZOHO || !ZOHO.CREATOR || typeof ZOHO.CREATOR.init !== 'function') return false;
    try {
      await ZOHO.CREATOR.init();
      const params = await ZOHO.CREATOR.UTIL.getInitParams();
      if (!params || !params.loginUser) return false;
      state.params = Object.assign({}, state.params, params);
      state.live = true;
      return true;
    } catch (e) {
      console.warn('Zoho Creator SDK init failed — using demo store', e);
      return false;
    }
  }

  async function ready() {
    if (state.initPromise) return state.initPromise;
    state.initPromise = (async function () {
      const live = await initSdk();
      if (!live) {
        const as = queryParam('as');
        state.params.loginUser = as || 'james.anderson@example.com';
        state.params.appLinkName = 'zenpartner';
        state.live = false;
        readDemo();
      }
      const qp = queryParam('as');
      if (qp) state.params.loginUser = qp;
      if (queryParam('resetdemo') === '1') {
        try { localStorage.removeItem(DEMO_KEY); } catch (e) { /* ignore */ }
        readDemo();
      }
      state.ready = true;
      return state;
    })();
    return state.initPromise;
  }

  function resetDemo() {
    try { localStorage.removeItem(DEMO_KEY); } catch (e) { /* ignore */ }
    return readDemo();
  }

  global.ZohoAPI = {
    ready: ready,
    get live() { return state.live; },
    get params() { return state.params; },
    get loginUser() { return state.params.loginUser; },
    get appName() { return state.params.appLinkName; },
    FORMS: FORMS,
    REPORTS: REPORTS,
    ONBOARD_TASKS: ONBOARD_TASKS,
    PARTNER_TYPES: PARTNER_TYPES,
    PARTNER_STATUSES: PARTNER_STATUSES,
    INDUSTRIES: INDUSTRIES,
    SERVICES: SERVICES,
    TASK_PRIORITIES: TASK_PRIORITIES,
    TASK_STATUSES: TASK_STATUSES,
    COURSE_STATUSES: COURSE_STATUSES,
    REFERRAL_SERVICES: REFERRAL_SERVICES,
    HEAR_ABOUT: HEAR_ABOUT,
    DEFAULT_AVATAR: DEFAULT_AVATAR,
    esc: esc,
    escCrit: escCrit,
    field: field,
    displayName: displayName,
    addressText: addressText,
    lookupId: lookupId,
    lookupName: lookupName,
    urlValue: urlValue,
    asList: asList,
    imageUrl: imageUrl,
    fileNameFromPath: fileNameFromPath,
    today: today,
    prettyDate: prettyDate,
    getRecords: getRecords,
    getRecord: getRecord,
    addRecord: addRecord,
    updateRecord: updateRecord,
    partnerLabel: partnerLabel,
    normalizeSteps: normalizeSteps,
    onboardSummary: onboardSummary,
    nextPartnerStatus: nextPartnerStatus,
    findPartnerByEmail: findPartnerByEmail,
    tasksForPartner: tasksForPartner,
    referralsForPartner: referralsForPartner,
    takenForPartner: takenForPartner,
    ensureOnboardingTasks: ensureOnboardingTasks,
    createPartnerWithTasks: createPartnerWithTasks,
    setTaskStatus: setTaskStatus,
    syncPartnerStatus: syncPartnerStatus,
    completeOnboardStep: completeOnboardStep,
    startOnboardStep: startOnboardStep,
    loadPartnerBundle: loadPartnerBundle,
    addReferral: addReferral,
    enrollCourse: enrollCourse,
    maybeCompleteTraining: maybeCompleteTraining,
    queryParam: queryParam,
    resetDemo: resetDemo
  };
})(window);
