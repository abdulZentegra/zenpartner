// ZenPartner — Professional Layout Injector + Interactive Engine
// SINGLE SOURCE: sidebar / topbar / mobile + all JS interactions.
// Pages only need: <div id="app-sidebar"></div> <div id="app-topbar"></div>
// <div id="app-mobile-nav"></div> <script src="layout.js"></script>
// <script>injectLayout({active:'dashboard', title:'...', breadcrumb:'...', searchPlaceholder:'...'})</script>

function buildSidebar(active){
  const a=(id,label,href,icon,badge='')=>{
    const isActive = active===id || (active==='leads' && id==='referral');
    const cls = isActive ? 'bg-[#4f46e5] text-white font-semibold shadow-sm' : 'text-white/80 hover:bg-white/10';
    return `<a href="${href}" class="flex items-center gap-3 px-3 py-2.5 rounded-lg ${cls}">${icon}<span class="truncate">${label}</span>${badge}</a>`;
  };
  const ico={
    dash:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>`,
    profile:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 20a8 8 0 0 1 16 0"/></svg>`,
    onboard:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6v6H9z"/></svg>`,
    training:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5"/><path d="M22 10v6"/></svg>`,
    resources:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v15H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><path d="M8 7h8"/><path d="M8 11h8"/></svg>`,
    referral:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="7" r="3"/><path d="M14 11a3 3 0 1 0 0-6"/><path d="M2 19a5 5 0 0 1 10 0"/><path d="M14 19a5 5 0 0 1 5 0"/></svg>`,
    activities:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 10h8"/><path d="M8 14h5"/></svg>`,
    earnings:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="6"/><path d="M15 13a3 3 0 1 1-6 0"/><path d="M12 16v4"/><path d="M9 20h6"/></svg>`,
    reports:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>`
  };
  return `
  <aside class="hidden lg:flex w-[260px] bg-[#0a1033] text-white flex-col shrink-0 sticky top-0 h-screen overflow-y-auto scrollbar-none">
    <div class="px-5 py-5 flex items-center gap-3">
      <a href="index.html" class="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7c3aed] via-[#4f46e5] to-[#06b6d4] flex items-center justify-center font-black text-lg rotate-3 shrink-0">Z</a>
      <div>
        <div class="font-extrabold tracking-wide text-[13px] leading-none">ZENPARTNER</div>
        <div class="text-[10px] text-white/60 tracking-widest font-semibold">Partner Portal</div>
      </div>
    </div>
    <div class="mx-3 mt-2 bg-white/[0.07] border border-white/10 rounded-xl p-3">
      <div class="flex items-center gap-3">
        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60" class="w-9 h-9 rounded-full object-cover">
        <div class="leading-tight">
          <div class="text-xs font-semibold">James Anderson</div>
          <div class="text-[10px] text-amber-300 font-medium flex items-center gap-1">Gold Partner <span>★</span></div>
        </div>
      </div>
      <div class="mt-2 text-[9px] text-white/50">Partner ID: ZP-2024-0015 • 90% strength</div>
      <div class="mt-3">
        <div class="flex justify-between text-[10px] font-medium"><span class="text-white/70">Profile Strength</span><span class="text-emerald-400">90%</span></div>
        <div class="mt-1 h-1.5 bg-white/10 rounded-full overflow-hidden"><div class="h-full bg-gradient-to-r from-emerald-500 to-sky-400 rounded-full" style="width:90%"></div></div>
      </div>
    </div>
    <nav class="px-2.5 mt-4 space-y-0.5 text-[13px] flex-1">
      ${a('dashboard','Dashboard','index.html', ico.dash, active==='dashboard'?'<span class="ml-auto text-white/60">›</span>':'')}
      ${a('profile','My Profile','profile.html', ico.profile)}
      ${a('onboarding','Onboarding & Overview','onboarding.html', ico.onboard, '<span class="ml-auto w-4 h-4 rounded-full bg-emerald-500 text-white grid place-items-center text-[10px]">✓</span>')}
      ${a('training','Training & Learning','training.html', ico.training)}
      ${a('resources','Resources Center','resources.html', ico.resources)}
      ${a('referral','Add Referral / Leads','referral.html', ico.referral)}
      ${a('earnings','Earnings & Payouts','earnings.html', ico.earnings)}
      ${a('reports','Reports & Analytics','reports.html', ico.reports)}
    </nav>
    <div class="p-3 mt-auto space-y-0.5">
      <a href="admin.html" class="flex items-center gap-2 px-2 py-2.5 text-xs text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2l8 3.5v5.5c0 5-3.4 9.4-8 11-4.6-1.6-8-6-8-11V5.5z"/><path d="M8.5 12l2.5 2.5 4.5-4.5"/></svg> Admin Panel</a>
      <a href="#" class="flex items-center gap-2 px-2 py-3 text-xs text-white/70 hover:text-white"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> Sign Out</a>
    </div>
  </aside>

  <!-- Mobile Drawer (injected, hidden by default) -->
  <div id="mobile-drawer" class="mobile-drawer lg:hidden" aria-hidden="true">
    <div class="p-5 flex items-center justify-between border-b border-white/10">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7c3aed] via-[#4f46e5] to-[#06b6d4] grid place-items-center font-black">Z</div>
        <div><div class="font-extrabold text-sm">ZENPARTNER</div><div class="text-[10px] text-white/60 tracking-widest">Partner Portal</div></div>
      </div>
      <button id="drawer-close" class="w-9 h-9 grid place-items-center rounded-xl bg-white/10 text-white hover:bg-white/15">✕</button>
    </div>
    <nav class="p-3 space-y-1 text-[13px] flex-1 overflow-y-auto">
      ${a('dashboard','Dashboard','index.html', ico.dash)}
      ${a('profile','My Profile','profile.html', ico.profile)}
      ${a('onboarding','Onboarding & Overview','onboarding.html', ico.onboard)}
      ${a('training','Training & Learning','training.html', ico.training)}
      ${a('resources','Resources Center','resources.html', ico.resources)}
      ${a('referral','Add Referral / Leads','referral.html', ico.referral)}
      ${a('earnings','Earnings & Payouts','earnings.html', ico.earnings)}
      ${a('reports','Reports & Analytics','reports.html', ico.reports)}
    </nav>
    <div class="p-4 border-t border-white/10">
      <div class="flex items-center gap-3">
        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60" class="w-9 h-9 rounded-full">
        <div><div class="text-sm font-semibold">James Anderson</div><div class="text-xs text-amber-300">Gold Partner ★</div></div>
      </div>
      <a href="admin.html" class="mt-3 flex items-center justify-center gap-2 border border-white/15 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-white/10 transition">🛡 Admin Panel</a>
      <a href="#" class="mt-2 flex items-center justify-center gap-2 bg-[#4f46e5] text-white text-sm font-semibold py-2.5 rounded-xl">Sign Out</a>
    </div>
  </div>
  <div id="mobile-backdrop" class="mobile-backdrop lg:hidden"></div>`;
}

function buildTopbar(title,breadcrumb,searchPlaceholder,extraActions,admin,homeUrl){
  const home=homeUrl||(admin?'admin.html':'index.html');
  const dateChip=admin?`
      <button class="hidden sm:flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition shadow-sm" id="admin-date-chip" aria-label="Date range">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>
        May 01 – May 15, 2024
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="1.8"><path d="M6 9l6 6 6-6"/></svg>
      </button>`:'';
  const notifItems=admin?`
      <div class="dropdown-item border border-slate-100 bg-slate-50/50 rounded-xl">
        <span class="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 grid place-items-center shrink-0"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="7" r="3"/><path d="M2 19a7 7 0 0 1 14 0"/><path d="M16 4.5a3 3 0 0 1 0 5"/><path d="M18.5 19a7 7 0 0 0-3-5.7"/></svg></span>
        <div class="flex-1 min-w-0"><div class="text-[12px] font-semibold leading-tight">New partner registered — Emily Wilson</div><div class="text-[11px] text-slate-500">2 hours ago</div></div>
        <span class="w-2 h-2 rounded-full bg-[#4f46e5] mt-2"></span>
      </div>
      <div class="dropdown-item hover:bg-slate-50">
        <span class="w-8 h-8 rounded-full bg-amber-50 text-amber-600 grid place-items-center shrink-0">$</span>
        <div class="flex-1 min-w-0"><div class="text-[12px] font-medium leading-tight">Payout of $2,500 pending approval</div><div class="text-[11px] text-slate-500">Yesterday</div></div>
      </div>
      <div class="dropdown-item hover:bg-slate-50">
        <span class="w-8 h-8 rounded-full bg-rose-50 text-rose-600 grid place-items-center shrink-0">!</span>
        <div class="flex-1 min-w-0"><div class="text-[12px] font-medium leading-tight">Support ticket #T-1042 escalated</div><div class="text-[11px] text-slate-500">2 days ago</div></div>
      </div>`:`
      <div class="dropdown-item border border-slate-100 bg-slate-50/50 rounded-xl">
        <span class="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 grid place-items-center shrink-0"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span>
        <div class="flex-1 min-w-0"><div class="text-[12px] font-semibold leading-tight">Training completed — Sales Process</div><div class="text-[11px] text-slate-500">2 hours ago</div></div>
        <span class="w-2 h-2 rounded-full bg-[#4f46e5] mt-2"></span>
      </div>
      <div class="dropdown-item hover:bg-slate-50">
        <span class="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 grid place-items-center shrink-0">$</span>
        <div class="flex-1 min-w-0"><div class="text-[12px] font-medium leading-tight">Payout of $2,500 completed</div><div class="text-[11px] text-slate-500">Yesterday</div></div>
      </div>
      <div class="dropdown-item hover:bg-slate-50">
        <span class="w-8 h-8 rounded-full bg-sky-50 text-sky-600 grid place-items-center shrink-0">↗</span>
        <div class="flex-1 min-w-0"><div class="text-[12px] font-medium leading-tight">New referral qualified</div><div class="text-[11px] text-slate-500">2 days ago</div></div>
      </div>`;
  const msgItems=admin?`
      <div class="dropdown-item border border-slate-100 rounded-xl">
        <img src="${ADMIN_AVATAR}" class="w-8 h-8 rounded-full">
        <div class="flex-1 min-w-0"><div class="text-[12px] font-semibold">Support Team</div><div class="text-[11px] text-slate-500 truncate">Ticket #T-1042 has been escalated</div></div>
        <span class="text-[10px] text-slate-400">2h</span>
      </div>
      <div class="dropdown-item"><img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60" class="w-8 h-8 rounded-full"><div class="flex-1 min-w-0"><div class="text-[12px] font-semibold">James Anderson</div><div class="text-[11px] text-slate-500 truncate">Can you review my payout status?</div></div><span class="text-[10px] text-slate-400">1d</span></div>`:`
      <div class="dropdown-item border border-slate-100 rounded-xl">
        <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=60" class="w-8 h-8 rounded-full">
        <div class="flex-1 min-w-0"><div class="text-[12px] font-semibold">Sarah Mitchell</div><div class="text-[11px] text-slate-500 truncate">Reviewed your proposal — amazing work!</div></div>
        <span class="text-[10px] text-slate-400">2h</span>
      </div>
      <div class="dropdown-item"><img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60" class="w-8 h-8 rounded-full"><div class="flex-1 min-w-0"><div class="text-[12px] font-semibold">Michael Davis</div><div class="text-[11px] text-slate-500 truncate">Follow-up next week?</div></div><span class="text-[10px] text-slate-400">1d</span></div>`;
  const profName=admin?'Admin User':'James Anderson';
  const profEmail=admin?'admin@zentegra.com':'james@zentegra.com';
  const profRole=admin?'Super Administrator':'Gold Partner';
  const profRoleCls=admin?'text-indigo-600':'text-amber-600';
  const profAvatar=admin?ADMIN_AVATAR:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60';
  return `
  <header class="bg-white border-b border-slate-200 sticky top-0 z-20">
    <div class="flex items-center gap-3 px-3 sm:px-4 lg:px-6 py-3">
      <button id="nav-toggle" class="hamburger" aria-label="Toggle navigation" aria-expanded="false">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/></svg>
      </button>
      <div class="leading-tight min-w-0">
        <div class="font-bold text-[15px] sm:text-[16px] jakarta truncate">${title}</div>
        <div class="text-[11px] text-slate-500 truncate"><a href="${home}" class="hover:text-indigo-600">Home</a> <span class="mx-1">›</span> <span class="text-slate-700 font-medium">${breadcrumb}</span></div>
      </div>
      <div class="hidden md:flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 w-[240px] lg:w-[340px] ml-2 lg:ml-6 shadow-sm top-search">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" class="shrink-0"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3-3"/></svg>
        <input id="top-search-input" placeholder="${searchPlaceholder}" class="flex-1 text-xs placeholder:text-slate-400 bg-transparent min-w-0"/>
        <span class="ctrl-k hidden xl:inline-flex">⌘ K</span>
      </div>
      <button id="mobile-search-toggle" class="md:hidden w-9 h-9 grid place-items-center rounded-xl border border-slate-200 bg-white text-slate-600">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3-3"/></svg>
      </button>
      <div class="ml-auto flex items-center gap-1.5 sm:gap-2">
        ${dateChip}
        <div class="relative">
          <button class="notif-btn relative w-9 h-9 grid place-items-center rounded-full hover:bg-slate-50" data-dropdown="notif-dropdown" aria-label="Notifications">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="1.8"><path d="M6 8a6 6 0 0 1 12 0c0 7-6 5-6 9"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>
            <span class="absolute -top-0.5 -right-0.5 bg-[#4f46e5] text-white text-[9px] w-4 h-4 grid place-items-center rounded-full font-bold">5</span>
          </button>
          <div id="notif-dropdown" class="dropdown">
            <div class="flex items-center justify-between px-2 py-1">
              <span class="text-xs font-bold">Notifications</span><span class="text-[11px] font-bold text-[#4f46e5] cursor-pointer">Mark all read</span>
            </div>
            <div class="mt-2 space-y-1">${notifItems}</div>
            <a href="${admin?'admin-tickets.html':'activities.html'}" class="mt-2 block text-center text-[12px] font-bold text-[#4f46e5] py-2 hover:bg-indigo-50 rounded-xl">View all notifications</a>
          </div>
        </div>
        <div class="relative">
          <button class="msg-btn relative w-9 h-9 grid place-items-center rounded-full hover:bg-slate-50" data-dropdown="msg-dropdown" aria-label="Messages">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="1.8"><path d="M4 4h16v12H4z"/><path d="M4 4l8 7 8-7"/></svg>
            <span class="absolute -top-0.5 -right-0.5 bg-[#4f46e5] text-white text-[9px] w-4 h-4 grid place-items-center rounded-full font-bold">3</span>
          </button>
          <div id="msg-dropdown" class="dropdown">
            <div class="text-xs font-bold px-2 py-1">Messages</div>
            <div class="space-y-1 mt-2">${msgItems}</div>
          </div>
        </div>
        <div class="relative">
          <button id="profile-toggle" class="hidden lg:flex items-center gap-2 pl-2 sm:pl-3 ml-1 hover:opacity-80" data-dropdown="profile-dropdown">
            <img src="${profAvatar}" class="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-50">
            <div class="leading-tight hidden xl:block text-left">
              <div class="text-xs font-semibold flex items-center gap-1">${profName} <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div>
              <div class="text-[10px] ${profRoleCls} font-medium">${profRole}</div>
            </div>
          </button>
          <div id="profile-dropdown" class="dropdown" style="min-width:220px">
            <div class="p-3 flex gap-3 border-b border-slate-100">
              <img src="${profAvatar}" class="w-10 h-10 rounded-full">
              <div><div class="text-sm font-bold">${profName}</div><div class="text-xs text-slate-500">${profEmail}</div><div class="text-[11px] ${profRoleCls} font-semibold">${profRole}</div></div>
            </div>
            <div class="py-1">
              ${admin?'<a href="#" class="dropdown-item text-[13px] font-medium">Admin Profile</a><a href="#" class="dropdown-item text-[13px] font-medium">System Settings</a><a href="index.html" class="dropdown-item text-[13px] font-medium">Partner Portal</a>':'<a href="profile.html" class="dropdown-item text-[13px] font-medium">My Profile</a><a href="#" class="dropdown-item text-[13px] font-medium">Settings</a>'}
              <a href="#" class="dropdown-item text-[13px] font-medium text-red-600">Sign Out</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="mobile-search-bar" class="hidden px-3 pb-3 md:hidden">
      <label class="flex items-center gap-2 bg-[#f8fafc] border border-slate-200 rounded-xl px-3 py-2.5">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3-3"/></svg>
        <input placeholder="${searchPlaceholder}" class="flex-1 text-sm bg-transparent placeholder:text-slate-400"/>
        <button id="mobile-search-close" class="text-slate-400">✕</button>
      </label>
    </div>
    ${extraActions||''}
  </header>`;
}


function buildMobile(active){
  const i=(id,href,svg,label)=>{
    const on = active===id || (active==='leads' && id==='referral');
    return `<a href="${href}" class="flex flex-col items-center gap-1 ${on?'text-white bg-[#4f46e5] rounded-xl px-2.5 py-1.5':'text-white/60 py-1.5 px-2'}">${svg}<span class="text-[9px] font-semibold">${label}</span></a>`;
  };
  const s={
    dash:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>`,
    prof:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 20a8 8 0 0 1 16 0"/></svg>`,
    onboard:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6v6H9z"/></svg>`,
    train:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5"/></svg>`,
    res:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v15H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
    ref:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="7" r="3"/><path d="M14 11a3 3 0 1 0 0-6"/><path d="M2 19a5 5 0 0 1 10 0"/><path d="M14 19a5 5 0 0 1 5 0"/></svg>`,
    act:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 10h8"/><path d="M8 14h5"/></svg>`,
    earn:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="6"/><path d="M15 13a3 3 0 1 1-6 0"/><path d="M12 16v4"/><path d="M9 20h6"/></svg>`,
    rep:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>`
  };
  return `
  <nav class="lg:hidden fixed bottom-0 inset-x-0 bg-[#0a1033] border-t border-white/10 flex items-center gap-0.5 justify-around py-1.5 px-1 z-30 overflow-x-auto scrollbar-none" style="scrollbar-width:none; -ms-overflow-style:none">
    ${i('dashboard','index.html',s.dash,'Dashboard')}
    ${i('referral','referral.html',s.ref,'Referrals')}
    ${i('earnings','earnings.html',s.earn,'Earnings')}
    ${i('reports','reports.html',s.rep,'Reports')}
  </nav>`;
}


// ── Admin Layout Builders (mirror the portal logic, same container IDs) ──
function buildAdminSidebar(active){
  const isOn=(id)=> active===id || (active==='partnerView' && id==='partners');
  const a=(id,label,href,icon)=>{
    const on=isOn(id);
    const cls=on?'bg-[#4f46e5] text-white font-semibold shadow-sm':'text-white/80 hover:bg-white/10';
    return `<a href="${href}" class="flex items-center gap-3 px-3 py-2.5 rounded-lg ${cls}" data-admin-nav="${id}">${icon}<span class="truncate">${label}</span>${on?'<span class="ml-auto text-white/60">›</span>':''}</a>`;
  };
  const ico={
    dash:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>`,
    partners:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="7" r="3"/><path d="M2 19a7 7 0 0 1 14 0"/><path d="M16 4.5a3 3 0 0 1 0 5"/><path d="M18.5 19a7 7 0 0 0-3-5.7"/></svg>`,
    onboard:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 11l3 3 8-8"/><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9"/></svg>`,
    payouts:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 10h.01"/><path d="M18 14h.01"/></svg>`,
    tickets:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.5"/><path d="M5.6 5.6l3.2 3.2"/><path d="M15.2 15.2l3.2 3.2"/><path d="M18.4 5.6l-3.2 3.2"/><path d="M8.8 15.2l-3.2 3.2"/></svg>`
  };
  return `
  <aside class="hidden lg:flex w-[260px] bg-[#0a1033] text-white flex-col shrink-0 sticky top-0 h-screen overflow-y-auto scrollbar-none">
    <div class="px-5 py-5 flex items-center gap-3">
      <a href="admin.html" class="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7c3aed] via-[#4f46e5] to-[#06b6d4] flex items-center justify-center font-black text-lg rotate-3 shrink-0">Z</a>
      <div>
        <div class="font-extrabold tracking-wide text-[13px] leading-none">ZENPARTNER</div>
        <div class="text-[10px] text-white/60 tracking-widest font-semibold">Admin Panel</div>
      </div>
    </div>
    <div class="mx-3 mt-2 bg-white/[0.07] border border-white/10 rounded-xl p-3">
      <div class="flex items-center gap-3">
        <img src="${ADMIN_AVATAR}" class="w-9 h-9 rounded-full object-cover">
        <div class="leading-tight">
          <div class="text-xs font-semibold">Admin User</div>
          <div class="text-[10px] text-indigo-300 font-medium flex items-center gap-1">Super Administrator <span>🛡</span></div>
        </div>
      </div>
      <div class="mt-2 text-[9px] text-white/50">admin@zentegra.com</div>
      <div class="mt-3">
        <div class="flex justify-between text-[10px] font-medium"><span class="text-white/70">Panel Coverage</span><span class="text-indigo-300">100%</span></div>
        <div class="mt-1 h-1.5 bg-white/10 rounded-full overflow-hidden"><div class="h-full bg-gradient-to-r from-indigo-500 to-sky-400 rounded-full" style="width:100%"></div></div>
      </div>
    </div>
    <nav class="px-2.5 mt-4 space-y-0.5 text-[13px] flex-1">
      ${a('dashboard','Dashboard','admin.html',ico.dash)}
      ${a('partners','All Partners','partners.html',ico.partners)}
      ${a('onboarding','Onboarding Setup','partners-onboarding.html',ico.onboard)}
      ${a('payouts','Commission & Payouts','admin-payouts.html',ico.payouts)}
      ${a('tickets','Tickets','admin-tickets.html',ico.tickets)}
    </nav>
    <div class="p-3 mt-auto space-y-0.5">
      <a href="index.html" class="flex items-center gap-2 px-2 py-2.5 text-xs text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg> View Partner Portal</a>
      <a href="#" class="flex items-center gap-2 px-2 py-3 text-xs text-white/70 hover:text-white"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> Sign Out</a>
    </div>
  </aside>

  <!-- Mobile Drawer (injected, hidden by default) -->
  <div id="mobile-drawer" class="mobile-drawer lg:hidden" aria-hidden="true">
    <div class="p-5 flex items-center justify-between border-b border-white/10">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7c3aed] via-[#4f46e5] to-[#06b6d4] grid place-items-center font-black">Z</div>
        <div><div class="font-extrabold text-sm">ZENPARTNER</div><div class="text-[10px] text-white/60 tracking-widest">Admin Panel</div></div>
      </div>
      <button id="drawer-close" class="w-9 h-9 grid place-items-center rounded-xl bg-white/10 text-white hover:bg-white/15">✕</button>
    </div>
    <nav class="p-3 space-y-1 text-[13px] flex-1 overflow-y-auto">
      ${a('dashboard','Dashboard','admin.html',ico.dash)}
      ${a('partners','All Partners','partners.html',ico.partners)}
      ${a('onboarding','Onboarding Setup','partners-onboarding.html',ico.onboard)}
      ${a('payouts','Commission & Payouts','admin-payouts.html',ico.payouts)}
      ${a('tickets','Tickets','admin-tickets.html',ico.tickets)}
    </nav>
    <div class="p-4 border-t border-white/10">
      <div class="flex items-center gap-3">
        <img src="${ADMIN_AVATAR}" class="w-9 h-9 rounded-full">
        <div><div class="text-sm font-semibold">Admin User</div><div class="text-xs text-indigo-300">Super Administrator</div></div>
      </div>
      <a href="index.html" class="mt-3 flex items-center justify-center gap-2 border border-white/15 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-white/10 transition">🏠 Partner Portal</a>
      <a href="#" class="mt-2 flex items-center justify-center gap-2 bg-[#4f46e5] text-white text-sm font-semibold py-2.5 rounded-xl">Sign Out</a>
    </div>
  </div>
  <div id="mobile-backdrop" class="mobile-backdrop lg:hidden"></div>`;
}

function buildAdminMobile(active){
  const i=(id,href,svg,label)=>{
    const on=active===id || (active==='partnerView' && id==='partners');
    return `<a href="${href}" class="flex flex-col items-center gap-1 ${on?'text-white bg-[#4f46e5] rounded-xl px-2.5 py-1.5':'text-white/60 py-1.5 px-2'}">${svg}<span class="text-[9px] font-semibold">${label}</span></a>`;
  };
  const s={
    dash:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>`,
    partners:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="7" r="3"/><path d="M2 19a7 7 0 0 1 14 0"/><path d="M16 4.5a3 3 0 0 1 0 5"/><path d="M18.5 19a7 7 0 0 0-3-5.7"/></svg>`,
    onboard:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 11l3 3 8-8"/><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9"/></svg>`,
    payouts:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 10h.01"/><path d="M18 14h.01"/></svg>`,
    tickets:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.5"/><path d="M5.6 5.6l3.2 3.2"/><path d="M15.2 15.2l3.2 3.2"/><path d="M18.4 5.6l-3.2 3.2"/><path d="M8.8 15.2l-3.2 3.2"/></svg>`
  };
  return `
  <nav class="lg:hidden fixed bottom-0 inset-x-0 bg-[#0a1033] border-t border-white/10 flex items-center gap-0.5 justify-around py-1.5 px-1 z-30 overflow-x-auto scrollbar-none" style="scrollbar-width:none; -ms-overflow-style:none">
    ${i('dashboard','admin.html',s.dash,'Dashboard')}
    ${i('partners','partners.html',s.partners,'Partners')}
    ${i('onboarding','partners-onboarding.html',s.onboard,'Onboarding')}
    ${i('payouts','admin-payouts.html',s.payouts,'Payouts')}
    ${i('tickets','admin-tickets.html',s.tickets,'Tickets')}
  </nav>`;
}

// ── Global State & Helpers ──
let currentActive = 'dashboard';
const STORE_KEY = 'zp_state_v2';
const ADMIN_AVATAR='https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&auto=format&fit=crop&q=60';

// Storage is optional (private mode / sandboxed frames): never let it break the UI.
function safeStoreGet(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
function safeStoreSet(k,v){ try{ localStorage.setItem(k,v); }catch(e){} }
function safeSessionGet(k){ try{ return sessionStorage.getItem(k); }catch(e){ return null; } }
function safeSessionSet(k,v){ try{ sessionStorage.setItem(k,v); }catch(e){} }

function getStore(){ try{return JSON.parse(localStorage.getItem(STORE_KEY)||'{}')}catch(e){return{}} }
function setStore(patch){ const s={...getStore(),...patch}; localStorage.setItem(STORE_KEY, JSON.stringify(s)); return s; }

function showToast(msg, type='info', dur=2800){
  let c=document.getElementById('toast-container');
  if(!c){ c=document.createElement('div'); c.id='toast-container'; document.body.appendChild(c); }
  const el=document.createElement('div');
  el.className=`toast ${type}`;
  const icon = type==='success'?'✓':type==='error'?'⚠':'ℹ';
  el.innerHTML=`<span class="toast-icon">${icon}</span><span class="flex-1">${msg}</span><button class="toast-close" aria-label="Close">✕</button>`;
  c.appendChild(el);
  el.querySelector('.toast-close').onclick=()=>dismiss();
  let t=setTimeout(dismiss,dur);
  function dismiss(){ el.style.animation='toastOut .18s forwards'; setTimeout(()=>el.remove(),180); clearTimeout(t); }
  el.addEventListener('mouseenter',()=>clearTimeout(t));
  el.addEventListener('mouseleave',()=>{t=setTimeout(dismiss,900)});
}

function openModal({title, body, actions, size='md'}){
  let m=document.getElementById('app-modal');
  if(!m){
    m=document.createElement('div'); m.id='app-modal';
    m.innerHTML=`<div class="modal-backdrop"></div><div class="modal-panel"><div class="modal-head"><h3 class="text-sm font-bold"></h3><button class="w-8 h-8 grid place-items-center rounded-xl hover:bg-slate-100">✕</button></div><div class="modal-body"></div><div class="modal-actions"></div></div>`;
    document.body.appendChild(m);
    m.querySelector('.modal-backdrop').onclick=closeModal;
    m.querySelector('.modal-head button').onclick=closeModal;
    document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeModal(); });
  }
  const titleEl=m.querySelector('.modal-head h3');
  const bodyEl=m.querySelector('.modal-body');
  const actsEl=m.querySelector('.modal-actions');
  titleEl.textContent=title||'';
  bodyEl.innerHTML=body||'';
  actsEl.innerHTML=actions||`<button class="btn-ghost" onclick="closeModal()">Close</button>`;
  const panel=m.querySelector('.modal-panel');
  panel.style.width = size==='lg'?'min(96vw,760px)':size==='sm'?'min(96vw,420px)':'min(96vw,640px)';
  m.classList.add('open'); document.body.style.overflow='hidden';
  // focus trap: focus first button
  setTimeout(()=>{ const f=panel.querySelector('button,input,select,textarea'); if(f) f.focus(); },30);
}
function closeModal(){
  const m=document.getElementById('app-modal');
  if(m) m.classList.remove('open');
  document.body.style.overflow='';
}
window.closeModal=closeModal;
window.showToast=showToast;
window.openModal=openModal;

function debounce(fn,ms){ let t; return (...a)=>{clearTimeout(t); t=setTimeout(()=>fn(...a),ms)} }

// Generic table filter
function filterRows(input, selector){
  const q=input.value.toLowerCase().trim();
  document.querySelectorAll(selector).forEach(row=>{
    const txt=row.textContent.toLowerCase();
    row.style.display = !q || txt.includes(q) ? '' : 'none';
  });
  // update counts if needed
}

// Dropdown & Drawer wiring
function wireGlobalUI(){
  // One navigation toggle: mobile drawer below 1024px, icon-only sidebar above it.
  const burger=document.getElementById('nav-toggle');
  const drawer=document.getElementById('mobile-drawer');
  const backdrop=document.getElementById('mobile-backdrop');
  const closeBtn=document.getElementById('drawer-close');
  function openDrawer(){ if(!drawer) return; drawer.classList.add('open'); backdrop?.classList.add('open'); document.body.style.overflow='hidden'; if(burger) burger.setAttribute('aria-expanded','true'); }
  function closeDrawer(){ if(!drawer) return; drawer.classList.remove('open'); backdrop?.classList.remove('open'); document.body.style.overflow=''; if(burger) burger.setAttribute('aria-expanded','false'); }
  function toggleNavigation(){
    if(window.innerWidth < 1024){
      openDrawer();
      return;
    }
    const collapsed=document.body.classList.toggle('sidebar-collapsed');
    burger?.setAttribute('aria-expanded', String(!collapsed));
    burger?.setAttribute('aria-label', collapsed ? 'Expand navigation' : 'Collapse navigation');
    safeStoreSet('zp_sidebar_collapsed', collapsed ? '1' : '0');
  }
  burger?.addEventListener('click', toggleNavigation);
  closeBtn?.addEventListener('click', closeDrawer);
  backdrop?.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeDrawer(); });

  // Never leave the mobile drawer over the desktop layout after rotation/resize.
  const syncNavigation=debounce(()=>{
    if(window.innerWidth >= 1024) closeDrawer();
  },80);
  window.addEventListener('resize', syncNavigation);

  // Restore the user's compact desktop preference.
  if(window.innerWidth >= 1024 && safeStoreGet('zp_sidebar_collapsed')==='1'){
    document.body.classList.add('sidebar-collapsed');
    burger?.setAttribute('aria-label','Expand navigation');
  }

  // mobile search
  const mToggle=document.getElementById('mobile-search-toggle');
  const mBar=document.getElementById('mobile-search-bar');
  const mClose=document.getElementById('mobile-search-close');
  mToggle?.addEventListener('click', ()=>{ mBar.classList.toggle('hidden'); if(!mBar.classList.contains('hidden')) mBar.querySelector('input')?.focus(); });
  mClose?.addEventListener('click', ()=> mBar.classList.add('hidden'));

  // dropdowns (notification, messages, profile)
  document.querySelectorAll('[data-dropdown]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      e.stopPropagation();
      const id=btn.getAttribute('data-dropdown');
      const dd=document.getElementById(id);
      const isOpen=dd.classList.contains('open');
      document.querySelectorAll('.dropdown.open').forEach(d=>d.classList.remove('open'));
      if(!isOpen) dd.classList.add('open');
    });
  });
  document.addEventListener('click', ()=>{
    document.querySelectorAll('.dropdown.open').forEach(d=>d.classList.remove('open'));
  });
  document.querySelectorAll('.dropdown').forEach(d=>d.addEventListener('click', e=>e.stopPropagation()));

  // Ctrl+K / ⌘K focuses search
  document.addEventListener('keydown', e=>{
    if((e.ctrlKey||e.metaKey) && e.key.toLowerCase()==='k'){
      e.preventDefault();
      const inp=document.getElementById('top-search-input') || document.querySelector('header input[placeholder*="Search"]');
      if(inp){ inp.focus(); inp.select(); showToast('Search focused — type to filter','info',1400); }
    }
    if(e.key==='/' && !/input|textarea|select/i.test(document.activeElement.tagName)){
      e.preventDefault();
      const inp=document.getElementById('top-search-input'); if(inp){ inp.focus(); }
    }
  });

  // top search live filter (generic)
  const topSearch=document.getElementById('top-search-input');
  if(topSearch){
    topSearch.addEventListener('input', debounce(()=>{
      const q=topSearch.value.toLowerCase().trim();
      if(!q){
        document.querySelectorAll('[data-searchable]').forEach(el=>el.style.display='');
        // also reset resource/cards hidden by filterRows
        document.querySelectorAll('.resource-card, tr, .table-row, [data-card]').forEach(el=>el.style.display='');
        return;
      }
      // mark searchable areas
      let hits=0;
      document.querySelectorAll('.resource-card, .card, tr').forEach(card=>{
        if(!card.textContent) return;
        const match=card.textContent.toLowerCase().includes(q);
        if(card.classList.contains('resource-card') || card.tagName==='TR'){
          card.style.display = match ? '' : 'none';
          if(match) hits++;
        }
      });
      if(hits===0 && q.length>1) showToast(`No results for “${q}”`,'info',1600);
    },180));
  }

  // mark all read
  document.querySelectorAll('.dropdown').forEach(dd=>{
    const mark=dd.querySelector('span.text-\\[11px\\].text-\\[\\#4f46e5\\]');
    if(mark && mark.textContent.includes('Mark all')){
      mark.addEventListener('click', ()=>{
        dd.querySelectorAll('.w-2.h-2.bg-\\[\\#4f46e5\\]').forEach(d=>d.style.display='none');
        showToast('All notifications marked as read','success');
        document.querySelectorAll('.notif-btn span.bg-\\[\\#4f46e5\\]').forEach(b=>b.style.display='none');
      });
    }
  });
}

// ── Page Initializers ──
function initDashboard(){
  // The dashboard uses one focused content column. Remove the secondary rail
  // entirely so activity/actions do not compete with the primary information.
  const secondaryRail=document.querySelector('.dashboard-secondary');
  secondaryRail?.remove();
  // Date filter demo
  const dateChip=document.querySelector('.flex.items-center.justify-end');
  // Filter button opens modal
  const filterBtn=[...document.querySelectorAll('button')].find(b=>b.textContent.includes('Filter'));
  filterBtn?.addEventListener('click', ()=>{
    openModal({title:'Filter Dashboard', body:`
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <label class="space-y-1"><span class="text-xs font-semibold">Date Range</span><select class="w-full border border-slate-200 rounded-xl px-3 py-2"><option>May 1 – May 31, 2024</option><option>Last 30 days</option><option>This Quarter</option></select></label>
        <label class="space-y-1"><span class="text-xs font-semibold">Status</span><select class="w-full border border-slate-200 rounded-xl px-3 py-2"><option>All</option><option>Qualified</option><option>Won</option></select></label>
        <label class="space-y-1 sm:col-span-2"><span class="text-xs font-semibold">Search</span><input placeholder="Referral, company, owner..." class="w-full border border-slate-200 rounded-xl px-3 py-2"/></label>
      </div>`, actions:`<button class="btn-ghost" onclick="closeModal()">Cancel</button><button class="btn-primary" onclick="closeModal(); showToast('Filters applied','success')">Apply Filters</button>`});
  });

  // Performance Timeline tabs
  const tabs=[...document.querySelectorAll('.bg-white.rounded-xl .flex.gap-2 span')].filter(s=>s.textContent.match(/Referrals|Opportunities/));
  // Implement via label-like behavior: clicking swaps chart opacity
  const perfTabs=document.querySelectorAll('.bg-white.rounded-xl .flex.gap-2.mt-3 span');
  perfTabs.forEach(tab=>{
    tab.style.cursor='pointer';
    tab.addEventListener('click', ()=>{
      perfTabs.forEach(t=>{t.className='px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-slate-600 text-[10px]';});
      tab.className='px-2.5 py-1 rounded-md bg-[#4f46e5] text-white text-[10px] font-semibold';
      showToast(`Showing ${tab.textContent.trim()} timeline`,'info',1200);
    });
  });

  // Explore Resources smooth scroll handled by link

  // Onboarding View All handled via layout

  // Quick actions dummy
  document.querySelectorAll('a').forEach(a=>{
    if(a.textContent.includes('Add Referral') && a.getAttribute('href')==='#'){
      a.addEventListener('click', e=>{ e.preventDefault(); window.location.href='referral.html'; });
    }
  });
}

function initOnboarding(){
  // Animate progress on load
  const bar=document.querySelector('.h-full.bg-\\[\\#4f46e5\\]');
  if(bar){ bar.style.width='0%'; setTimeout(()=>bar.style.transition='width .9s cubic-bezier(.32,.72,0,1)',20); setTimeout(()=>bar.style.width='83%',80); }
  // View buttons open modals
  const labels=['View Agreement','View NDA','View Certificate','Review Again','Go to Resources','Start Referring'];
  document.querySelectorAll('a').forEach(a=>{
    if(labels.some(l=>a.textContent.includes(l))){
      a.addEventListener('click', e=>{
        if(a.getAttribute('href')==='resources.html' || a.getAttribute('href')==='#'){} // allow navigation if resources
        if(a.textContent.includes('View Agreement')){
          e.preventDefault();
          openModal({title:'Partner Agreement', body:`<div class="prose prose-sm max-w-none text-[13px] leading-5 text-slate-600"><p class="font-semibold">ZenPartner Partner Agreement — May 01, 2024</p><p>By accepting this agreement you agree to the terms of partnership, commission structure, and confidentiality obligations. This is a demo view.</p><div class="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs">✅ Completed on May 01, 2024 — Verified</div></div>`, actions:`<button class="btn-ghost" onclick="closeModal()">Close</button><button class="btn-primary" onclick="closeModal(); showToast('Agreement acknowledged','success')">Acknowledge</button>`, size:'lg'});
        }
        if(a.textContent.includes('View NDA')){
          e.preventDefault();
          openModal({title:'Non-Disclosure Agreement', body:`<p class="text-sm text-slate-600">NDA signed on May 02, 2024. Confidential information must not be disclosed for 24 months. Demo modal.</p>`, actions:`<button class="btn-primary" onclick="closeModal(); showToast('NDA verified','success')">OK</button>`});
        }
        if(a.textContent.includes('View Certificate')){
          e.preventDefault();
          openModal({title:'Training Certificate', body:`<div class="text-center py-4"><div class="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 border border-emerald-200 grid place-items-center text-emerald-600 text-xl">🎓</div><div class="font-bold mt-3">Certificate of Completion</div><div class="text-sm text-slate-500">Training & Certification — May 05, 2024</div><div class="mt-4 inline-flex bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">Verified ✓</div></div>`, actions:`<button class="btn-ghost" onclick="closeModal()">Close</button><button class="btn-primary" onclick="closeModal(); window.print()">Print</button>`});
        }
        if(a.textContent.includes('Review Again')){
          e.preventDefault();
          openModal({title:'Learn About Our Company', body:`<p class="text-sm text-slate-600">Zentegra is a cloud solutions platform. This refresher helps partners understand our product suite. Demo content.</p><ul class="mt-3 list-disc pl-5 text-sm text-slate-600 space-y-1"><li>Cloud Infrastructure</li><li>Collaboration Suite</li><li>Partner Enablement</li></ul>`, actions:`<button class="btn-primary" onclick="closeModal(); showToast('Marked as reviewed','success')">Mark as Reviewed</button>`});
        }
      });
    }
  });
  // Why Complete Onboarding
  const why=[...document.querySelectorAll('a')].find(a=>a.textContent.includes('Why Complete'));
  why?.addEventListener('click', e=>{
    e.preventDefault();
    openModal({title:'Why Complete Onboarding?', body:`<ul class="space-y-3 text-sm"><li class="flex gap-2"><span class="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 grid place-items-center">★</span><span><b>Unlock exclusive resources</b> — sales decks, case studies, templates.</span></li><li class="flex gap-2"><span class="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 grid place-items-center">⚡</span><span><b>Prioritized support</b> — faster response from partner team.</span></li><li class="flex gap-2"><span class="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 grid place-items-center">$</span><span><b>Higher earning potential</b> — eligible for premium commissions.</span></li></ul>`, actions:`<button class="btn-primary" onclick="closeModal(); showToast('Keep going — you are at 83%!','info')">Got it</button>`});
  });
}

function initProfile(){
  const saveBtn=[...document.querySelectorAll('a,button')].find(b=>b.textContent.includes('Save Changes'));
  const cancelBtn=[...document.querySelectorAll('a,button')].find(b=>b.textContent.includes('Cancel') && b.textContent.trim()==='Cancel');
  const inputs=[...document.querySelectorAll('input')];
  const edits=[...document.querySelectorAll('a')].filter(a=>a.textContent.trim()==='Edit');

  let editing=false;
  function setEditing(on){
    editing=on;
    inputs.forEach(inp=>{
      if(inp.type==='checkbox' || inp.placeholder?.includes('Search')) return;
      inp.readOnly = !on;
      inp.style.background = on ? '#fff' : '#f8fafc';
      inp.style.borderColor = on ? '#c7d2fe' : '#e2e8f0';
    });
    document.querySelectorAll('select').forEach(s=>{ s.disabled=!on; });
    if(saveBtn) saveBtn.style.opacity = on ? '1' : '.6';
    if(saveBtn) saveBtn.style.pointerEvents = on ? '' : 'none';
  }
  setEditing(false);
  edits.forEach(btn=>{
    btn.addEventListener('click', e=>{
      e.preventDefault();
      setEditing(!editing);
      showToast(editing ? 'Editing enabled — make your changes then Save' : 'Editing locked','info');
      btn.textContent = editing ? 'Done' : 'Edit';
    });
  });
  saveBtn?.addEventListener('click', e=>{
    e.preventDefault();
    // validate email
    const emailInp=[...inputs].find(i=>i.value.includes('@'));
    if(emailInp && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInp.value)){
      showToast('Please enter a valid email address','error');
      emailInp.focus(); emailInp.style.borderColor='#ef4444';
      return;
    }
    // persist
    const data={};
    inputs.forEach((inp,i)=>{ if(inp.value) data['f_'+i]=inp.value; });
    // toggles
    document.querySelectorAll('input[type="checkbox"]').forEach((cb,i)=> data['toggle_'+i]=cb.checked);
    setStore({profile:data, updatedAt: new Date().toISOString()});
    showToast('Profile saved successfully ✓','success');
    setEditing(false);
    edits.forEach(b=>b.textContent='Edit');
  });
  cancelBtn?.addEventListener('click', e=>{
    e.preventDefault();
    setEditing(false);
    showToast('Changes discarded','info');
  });

  // toggles persist
  document.querySelectorAll('input[type="checkbox"]').forEach(cb=>{
    const key='toggle_'+[...document.querySelectorAll('input[type="checkbox"]')].indexOf(cb);
    const saved=getStore().profile?.[key];
    if(saved!==undefined) cb.checked = !!saved;
    cb.addEventListener('change', ()=>{
      setStore({profile:{...getStore().profile, [key]:cb.checked}});
      showToast(cb.checked ? 'Notifications enabled' : 'Notifications disabled','info',1400);
    });
  });

  // avatar preview
  const cam=document.querySelector('span.bg-\\[\\#4f46e5\\].rounded-full');
  const avatar=document.querySelector('img.rounded-full.w-\\[88px\\]');
  if(cam && avatar){
    cam.style.cursor='pointer';
    cam.addEventListener('click', ()=>{
      const inp=document.createElement('input'); inp.type='file'; inp.accept='image/*';
      inp.onchange=()=>{
        const f=inp.files[0]; if(!f) return;
        const url=URL.createObjectURL(f);
        avatar.src=url;
        showToast('Profile photo updated (preview)', 'success');
      };
      inp.click();
    });
  }

  // restore if saved
  const saved=getStore().profile;
  if(saved){
    // could restore values but keep demo simple
  }
}

function initTraining(){
  // Tabs: filter My Courses rows by status
  const tabs=[...document.querySelectorAll('.flex.gap-1.mt-3 span')];
  // Map tab text to status keyword
  const rows=[...document.querySelectorAll('.grid.grid-cols-\\[1\\.8fr_0\\.8fr_1fr_0\\.8fr_0\\.7fr\\]')].slice(1); // skip header?
  // Better: find table wrapper rows via text
  const courseRows=[...document.querySelectorAll('div.grid')].filter(d=>d.textContent.includes('TrainerCentral') && d.textContent.includes('%'));
  function applyCourseFilter(filter){
    courseRows.forEach(r=>{
      const status = r.textContent.includes('Completed') ? 'Completed' : r.textContent.includes('In Progress') ? 'In Progress' : 'Not Started';
      const show = filter==='All Courses' || status===filter;
      r.style.display = show ? '' : 'none';
    });
  }
  tabs.forEach(tab=>{
    if(!tab.textContent.match(/All Courses|In Progress|Completed|Not Started/)) return;
    tab.style.cursor='pointer';
    tab.addEventListener('click', ()=>{
      tabs.forEach(t=>t.className='px-3 py-1.5 rounded-md text-slate-500');
      tab.className='px-3 py-1.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200';
      applyCourseFilter(tab.textContent.trim());
    });
  });
  // Search courses
  const searchIn=document.querySelector('input[placeholder*="Search resources"]') || document.querySelector('input[placeholder*="Search"]');
  // training page has no search? Use generic top search already filters.
  // But if there is a course search input, wire it
  const courseSearch=[...document.querySelectorAll('input')].find(i=>i.placeholder?.toLowerCase().includes('course') || i.closest('label'));
  // Continue buttons
  document.querySelectorAll('a').forEach(a=>{
    if(a.textContent.includes('Continue') || a.textContent.includes('Start')){
      a.addEventListener('click', e=>{
        if(a.getAttribute('href')==='#' || a.getAttribute('href')===null || a.getAttribute('href')===''){
          e.preventDefault();
          // animate progress
          const row=a.closest('div.grid');
          const bar=row?.querySelector('.h-1\\.5 .h-full');
          if(bar){
            let w=parseFloat(bar.style.width)||0;
            const target=Math.min(100, w+25);
            bar.style.transition='width .7s ease';
            bar.style.width=target+'%';
            const pct=row.querySelector('span.text-\\[10px\\]');
            if(pct) pct.textContent=target+'%';
            showToast(target>=100 ? 'Course completed! 🎉' : `Progress updated to ${target}%`,'success');
            if(target>=100){
              const badge=row.querySelector('span.bg-sky-50, span.bg-slate-100');
              if(badge){ badge.textContent='Completed'; badge.className='inline-flex text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-1 rounded-full w-fit'; }
              a.textContent='Review'; a.className='text-[11px] font-semibold text-indigo-600 border border-indigo-200 rounded-lg px-4 py-1.5 hover:bg-indigo-50';
            }
          } else {
            showToast(a.textContent.includes('Continue') ? 'Resuming course…' : 'Starting course…','info');
          }
        }
      });
    }
    if(a.textContent.includes('Join Session')){
      a.addEventListener('click', e=>{
        e.preventDefault();
        openModal({title:'Live Session — Advanced Cloud Solutions', body:`
          <div class="space-y-3">
            <div class="flex gap-3 p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
              <span class="w-10 h-10 rounded-xl bg-[#4f46e5] text-white grid place-items-center">🎥</span>
              <div><div class="font-bold text-sm">May 20 • 10:00 AM – 12:00 PM (EST)</div><div class="text-xs text-slate-600">Hosted by Zentegra Cloud Expert. Link will be active 15 min before start.</div></div>
            </div>
            <div class="text-sm text-slate-600">You’ll receive a calendar invite + reminder email.</div>
          </div>`, actions:`<button class="btn-ghost" onclick="closeModal()">Close</button><button class="btn-primary" onclick="closeModal(); showToast('Registered for session ✓','success')">Add to Calendar</button>`});
      });
    }
  });
  // Certificates View
  document.querySelectorAll('a').forEach(a=>{
    if(a.textContent.includes('View Certificate')){
      a.addEventListener('click', e=>{
        if(a.closest('div')?.textContent.includes('Certificates Earned')){
          e.preventDefault();
          openModal({title:'Certificate', body:`<div class="text-center py-6"><div class="w-20 h-20 mx-auto rounded-2xl bg-indigo-50 border border-indigo-100 grid place-items-center text-2xl">🎓</div><div class="font-bold mt-3">Issued on May 05, 2024</div><div class="text-sm text-slate-500">ZenPartner Certified • Verified</div><img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=60" class="mt-4 w-full h-40 object-cover rounded-xl border"></div>`, actions:`<button class="btn-ghost" onclick="closeModal()">Close</button><button class="btn-primary" onclick="closeModal(); showToast('Downloading certificate…','success')">Download PDF</button>`});
        }
      });
    }
  });
}

function initResources(){
  // Add data attributes to cards for filtering
  const cards=[...document.querySelectorAll('.resource-card, [class*="resource-card"]')];
  // If not found, fallback to grid items in All Resources section
  const fallback=[...document.querySelectorAll('.grid.grid-cols-1.sm\\:grid-cols-2 .bg-white.border')].filter(c=>c.textContent.includes('PDF')||c.textContent.includes('XLSX'));
  const allCards = cards.length? cards : fallback;

  // Enhance search: top search already does generic; but add resource filters
  const categorySel=[...document.querySelectorAll('select')].find(s=>s.textContent.includes('All Categories') || [...s.options].some(o=>o.text.includes('Categories')));
  const typeSel=[...document.querySelectorAll('select')].find(s=>[...s.options].some(o=>o.text==='PDF'));
  const resetBtn=[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='Reset');

  function applyResourceFilters(){
    const cat=categorySel?.value || 'All Categories';
    const typ=typeSel?.value || 'All Types';
    const search=(document.getElementById('top-search-input')?.value || '').toLowerCase();
    allCards.forEach(card=>{
      const txt=card.textContent.toLowerCase();
      let ok=true;
      if(search && !txt.includes(search)) ok=false;
      if(typ!=='All Types' && !txt.includes(typ.toLowerCase())) ok=false;
      if(cat!=='All Categories'){
        const catMap={ 'Marketing':'marketing','Sales':'sales','Partner':'partner','Legal':'legal','Product':'product','Templates':'template'};
        const key=catMap[cat]||cat.toLowerCase();
        if(!txt.includes(key)) ok=false;
      }
      card.style.display = ok ? '' : 'none';
    });
    const visible=allCards.filter(c=>c.style.display!=='none').length;
    const countEl=document.querySelector('h3')?.nextElementSibling;
    showToast(`${visible} resources found`,'info',1200);
  }
  categorySel?.addEventListener('change', applyResourceFilters);
  typeSel?.addEventListener('change', applyResourceFilters);
  document.getElementById('top-search-input')?.addEventListener('input', debounce(applyResourceFilters,160));
  resetBtn?.addEventListener('click', e=>{
    e.preventDefault();
    if(categorySel) categorySel.value='All Categories';
    if(typeSel) typeSel.value='All Types';
    const top=document.getElementById('top-search-input'); if(top) top.value='';
    allCards.forEach(c=>c.style.display='');
    showToast('Filters reset','info');
  });

  // Download buttons: increment Downloads This Month
  const dlCountEl=[...document.querySelectorAll('div')].find(d=>d.textContent.includes('Downloads This Month') && d.previousElementSibling?.textContent.trim()==='45');
  // Simpler: find the stat with 45
  document.querySelectorAll('a').forEach(a=>{
    if(a.querySelector('svg') && a.closest('.resource-card')){
      a.addEventListener('click', e=>{
        e.preventDefault();
        a.style.transform='scale(.96)'; setTimeout(()=>a.style.transform='',120);
        // find count
        const downloadsStat=[...document.querySelectorAll('div.text-\\[15px\\]')].find(el=>el.textContent==='45');
        if(downloadsStat){
          let n=parseInt(downloadsStat.textContent)||45;
          downloadsStat.textContent=n+1;
        }
        showToast('Downloading… File will be ready in a moment','success');
        // simulate file
        setTimeout(()=>{
          const blob=new Blob(['Demo file content for '+a.closest('.resource-card')?.querySelector('div.text-\\[12px\\]')?.textContent ],{type:'text/plain'});
          const url=URL.createObjectURL(blob);
          const d=document.createElement('a'); d.href=url; d.download='resource.txt'; d.click(); URL.revokeObjectURL(url);
        },400);
      });
    }
  });

  // Quick Access filter
  document.querySelectorAll('a.group').forEach(a=>{
    if(a.textContent.includes('Marketing') || a.textContent.includes('Sales')){
      a.addEventListener('click', e=>{
        e.preventDefault();
        if(categorySel){
          const val = a.textContent.includes('Marketing') ? 'Marketing' : a.textContent.includes('Sales') ? 'Sales' : 'All Categories';
          categorySel.value=val;
          applyResourceFilters();
          document.querySelector('main')?.scrollIntoView({behavior:'smooth'});
        }
      });
    }
  });

  // Pagination demo
  document.querySelectorAll('a.w-8').forEach(btn=>{
    if(btn.textContent.match(/^\d+$/)){
      btn.addEventListener('click', e=>{
        e.preventDefault();
        document.querySelectorAll('a.w-8').forEach(b=>{ if(b.textContent.match(/^\d+$/)) b.className='w-8 h-8 rounded-xl bg-white border border-slate-200 grid place-items-center text-[11px] font-semibold text-slate-700 hover:bg-slate-50';});
        btn.className='w-8 h-8 rounded-xl bg-[#4f46e5] text-white grid place-items-center text-[11px] font-bold shadow-md';
        showToast(`Page ${btn.textContent.trim()} loaded`,'info');
        window.scrollTo({top:0, behavior:'smooth'});
      });
    }
  });

  // Request Resource
  const reqBtn=[...document.querySelectorAll('a')].find(a=>a.textContent.includes('Request Resource'));
  reqBtn?.addEventListener('click', e=>{
    e.preventDefault();
    openModal({title:'Request a Resource', body:`
      <div class="space-y-3">
        <label class="block"><span class="text-xs font-semibold">What do you need?</span><textarea rows="3" placeholder="Describe the resource you need..." class="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"></textarea></label>
        <label class="block"><span class="text-xs font-semibold">For which client/use case?</span><input placeholder="e.g., Proposal for Beta Solutions" class="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"/></label>
        <label class="flex items-center gap-2 text-sm"><input type="checkbox"> <span>Urgent (need within 48 hours)</span></label>
      </div>`, actions:`<button class="btn-ghost" onclick="closeModal()">Cancel</button><button class="btn-primary" onclick="(function(){closeModal(); showToast('Request submitted — our team will respond within 24h','success')})()">Send Request</button>`});
  });
}

function initReferral(){
  const form=document.querySelector('form');
  const companyIn=form?.querySelector('input[placeholder*="company name"]');
  const contactIn=form?.querySelector('input[placeholder*="contact person"]');
  const emailIn=form?.querySelector('input[type="email"]');
  const tableWrap=document.querySelector('.table-wrap') || document.querySelector('.min-w-\\[980px\\]');
  const submitBtn=[...document.querySelectorAll('button')].find(b=>b.textContent.includes('Submit Referral'));
  const resetBtn=[...form?.querySelectorAll('button')||[]].find(b=>b.textContent.includes('Reset'));
  const totalEl=[...document.querySelectorAll('div')].find(d=>d.textContent.trim()==='24' && d.className.includes('font-extrabold'));

  function validateEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

  function addReferralRow(data){
    // Find referral list table body
    const grid=document.querySelector('.divide-y') || document.querySelector('.min-w-\\[980px\\] .divide-y');
    if(!grid) return;
    const id=`REF-${new Date().getFullYear()}-${String(25+Math.floor(Math.random()*10)).padStart(3,'0')}`;
    const row=document.createElement('div');
    row.className='grid grid-cols-[110px_1.6fr_1.2fr_1fr_0.9fr_1.1fr_1fr_1fr_80px] items-center px-3 py-3 text-[11px] bg-white border border-indigo-100 rounded-xl shadow-sm';
    row.innerHTML=`
      <span class="font-medium text-slate-500">${id}</span>
      <div class="leading-tight"><div class="font-bold text-slate-900">${data.company}</div><div class="text-slate-600">${data.contact}</div><div class="text-[10px] text-slate-500">${data.email}</div></div>
      <span class="inline-flex w-fit text-[11px] font-medium bg-violet-50 text-violet-700 border border-violet-200 px-2 py-1 rounded-full">${data.service}</span>
      <span class="text-slate-700 font-medium">${data.value}</span>
      <span><span class="inline-flex text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-1 rounded-full">New</span></span>
      <div class="flex items-center gap-2"><img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=60" class="w-6 h-6 rounded-full"><span class="font-medium">Sarah Mitchell</span></div>
      <span class="text-slate-600">${new Date().toLocaleDateString('en-US',{month:'short',day:'2-digit',year:'numeric'})}</span>
      <span class="text-slate-600">${new Date().toLocaleDateString('en-US',{month:'short',day:'2-digit',year:'numeric'})}</span>
      <div class="flex justify-end gap-1">
        <a href="leads.html" class="w-7 h-7 rounded-lg bg-white border border-slate-200 grid place-items-center text-indigo-600 hover:bg-indigo-50"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></a>
        <button class="w-7 h-7 rounded-lg bg-white border border-slate-200 grid place-items-center text-slate-400"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg></button>
      </div>`;
    grid.prepend(row);
    row.scrollIntoView({behavior:'smooth', block:'center'});
    row.style.animation='dropIn .3s ease';
  }

  submitBtn?.addEventListener('click', e=>{
    e.preventDefault();
    let ok=true;
    [companyIn, contactIn].forEach(inp=>{
      if(!inp || !inp.value.trim()){
        ok=false;
        inp.style.borderColor='#ef4444';
        inp.addEventListener('input', ()=>inp.style.borderColor='#e2e8f0', {once:true});
      }
    });
    if(emailIn && !validateEmail(emailIn.value.trim())){
      ok=false;
      emailIn.style.borderColor='#ef4444';
      emailIn.addEventListener('input', ()=>emailIn.style.borderColor='#e2e8f0', {once:true});
    }
    if(!ok){ showToast('Please fix the highlighted fields','error'); return; }
    const serviceSel=form.querySelector('select');
    const valueSel=[...form.querySelectorAll('select')][1];
    const data={
      company: companyIn?.value.trim()||'New Company',
      contact: contactIn?.value.trim()||'Contact',
      email: emailIn?.value.trim()||'email@example.com',
      service: serviceSel?.value !== 'Select service / solution' ? serviceSel.value : 'Website Development',
      value: valueSel?.value !== 'Select range' ? valueSel.value : '$15,000 - $25,000'
    };
    addReferralRow(data);
    // update total count
    if(totalEl){
      let n=parseInt(totalEl.textContent)||24;
      totalEl.textContent=n+1;
      // also update donut total
      const donutTotal=document.querySelector('.referral-donut + div div');
      if(donutTotal) donutTotal.textContent=n+1;
    }
    showToast(`Referral for ${data.company} submitted ✓`,'success');
    form.reset();
  });

  resetBtn?.addEventListener('click', ()=>{
    setTimeout(()=>showToast('Form reset','info',1200),30);
  });

  // Referral list search & filters
  const searchInput=[...document.querySelectorAll('input')].find(i=>i.placeholder?.includes('Search referrals'));
  const statusSel=[...document.querySelectorAll('select')].find(s=>[...s.options].some(o=>o.text.includes('All Status')));
  const serviceSel=[...document.querySelectorAll('select')].find(s=>[...s.options].some(o=>o.text.includes('All Services')));
  const filterBtn=[...document.querySelectorAll('button')].find(b=>b.textContent.includes('Filter'));

  function applyReferralFilters(){
    const q=(searchInput?.value||'').toLowerCase();
    const status=statusSel?.value || 'All Status';
    const service=serviceSel?.value || 'All Services';
    const rows=[...document.querySelectorAll('.grid.grid-cols-\\[110px_1\\.6fr_1\\.2fr_1fr_0\\.9fr_1\\.1fr_1fr_1fr_80px\\]')].filter(r=>r.querySelector('span.font-medium'));
    rows.forEach(r=>{
      const txt=r.textContent.toLowerCase();
      let show=true;
      if(q && !txt.includes(q)) show=false;
      if(status!=='All Status' && !txt.includes(status.toLowerCase())) show=false;
      if(service!=='All Services' && !txt.includes(service.toLowerCase().replace('development','').trim())) show=false;
      r.style.display = show ? '' : 'none';
    });
  }
  searchInput?.addEventListener('input', debounce(applyReferralFilters,140));
  statusSel?.addEventListener('change', applyReferralFilters);
  serviceSel?.addEventListener('change', applyReferralFilters);
  filterBtn?.addEventListener('click', e=>{
    e.preventDefault();
    openModal({title:'Filter Referrals', body:`
      <div class="grid grid-cols-1 gap-3 text-sm">
        <label><span class="text-xs font-semibold">Status</span><select class="w-full border border-slate-200 rounded-xl px-3 py-2"><option>All Status</option><option>New</option><option>Qualified</option><option>In Progress</option><option>Converted</option><option>Closed (Won)</option></select></label>
        <label><span class="text-xs font-semibold">Service</span><select class="w-full border border-slate-200 rounded-xl px-3 py-2"><option>All Services</option><option>Website Development</option><option>Mobile App Development</option></select></label>
        <label><span class="text-xs font-semibold">Date</span><select class="w-full border border-slate-200 rounded-xl px-3 py-2"><option>All Time</option><option>This Month</option><option>This Year</option></select></label>
      </div>`, actions:`<button class="btn-ghost" onclick="closeModal()">Cancel</button><button class="btn-primary" onclick="closeModal(); showToast('Filters applied','success')">Apply</button>`});
  });

  // Export
  const exportBtn=[...document.querySelectorAll('a,button')].find(b=>b.textContent.includes('Export'));
  exportBtn?.addEventListener('click', e=>{
    e.preventDefault();
    const rows=[...document.querySelectorAll('.grid.grid-cols-\\[110px_1\\.6fr_1\\.2fr_1fr_0\\.9fr_1\\.1fr_1fr_1fr_80px\\]')].filter(r=>r.style.display!=='none' && r.querySelector('span'));
    let csv='Ref ID,Company,Service,Value,Status,Lead Owner,Submitted\n';
    rows.forEach(r=>{
      const cells=[...r.children].map(c=>`"${c.textContent.replace(/"/g,'""').replace(/\n/g,' ').trim()}"`).join(',');
      csv+=cells+'\n';
    });
    const blob=new Blob([csv],{type:'text/csv'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a'); a.href=url; a.download='referrals.csv'; a.click(); URL.revokeObjectURL(url);
    showToast('Referrals exported to CSV','success');
  });

  // Pagination (demo)
  document.querySelectorAll('a.w-8').forEach(btn=>{
    if(btn.textContent.match(/^\d+$/) && btn.closest('div').textContent.includes('Showing')){
      btn.addEventListener('click', e=>{
        e.preventDefault();
        document.querySelectorAll('a.w-8').forEach(b=>{ if(b.textContent.match(/^\d+$/)) b.className='w-8 h-8 rounded-xl bg-white border border-slate-200 grid place-items-center text-[11px] font-semibold text-slate-700 hover:bg-slate-50';});
        btn.className='w-8 h-8 rounded-xl bg-[#4f46e5] text-white grid place-items-center text-[11px] font-bold shadow-md';
        showToast(`Page ${btn.textContent.trim()} — demo data`,'info');
      });
    }
  });
}

function initLeads(){
  // Tabs: simple toast + scroll
  const tabs=[...document.querySelectorAll('a.whitespace-nowrap')];
  tabs.forEach(tab=>{
    tab.addEventListener('click', e=>{
      if(tab.getAttribute('href')==='#'){
        e.preventDefault();
        tabs.forEach(t=>{ t.className='whitespace-nowrap px-4 py-3 text-[12px] font-medium text-slate-500 hover:text-slate-700'; });
        tab.className='whitespace-nowrap px-4 py-3 text-[12px] font-bold text-[#4f46e5] border-b-2 border-[#4f46e5] bg-white';
        showToast(`Switched to ${tab.textContent.trim()}`,'info',1200);
      }
    });
  });
  // Add Activity
  const addAct=[...document.querySelectorAll('a')].find(a=>a.textContent.includes('Add Activity'));
  addAct?.addEventListener('click', e=>{
    e.preventDefault();
    openModal({title:'Add Activity', body:`
      <div class="space-y-3">
        <label class="block"><span class="text-xs font-semibold">Activity Type</span><select class="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"><option>Note</option><option>Call</option><option>Meeting</option><option>Email</option></select></label>
        <label class="block"><span class="text-xs font-semibold">Description</span><textarea rows="3" placeholder="What happened?" class="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"></textarea></label>
        <label class="block"><span class="text-xs font-semibold">Date</span><input type="date" value="${new Date().toISOString().slice(0,10)}" class="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"/></label>
      </div>`, actions:`<button class="btn-ghost" onclick="closeModal()">Cancel</button><button class="btn-primary" onclick="(function(){closeModal(); const list=document.querySelector('.bg-white.rounded-2xl .space-y-3'); if(list){const item=document.createElement('div'); item.className='flex gap-3 p-2.5 rounded-xl border border-slate-100 bg-white'; item.innerHTML='<span class=&quot;w-8 h-8 rounded-lg bg-violet-50 border border-violet-100 text-violet-600 grid place-items-center shrink-0&quot;>✎</span><div class=&quot;leading-tight flex-1&quot;><div class=&quot;text-[11px] font-medium&quot;>New activity added — demo</div><div class=&quot;text-[10px] text-slate-500&quot;>${new Date().toLocaleString()}</div></div>'; list.prepend(item);} showToast('Activity added ✓','success')})()">Save Activity</button>`});
  });
  // View & Review
  document.querySelectorAll('a').forEach(a=>{
    if(a.textContent.includes('View & Review') || a.textContent.includes('View Quotation')){
      a.addEventListener('click', e=>{
        e.preventDefault();
        openModal({title:'Quotation', body:`
          <div class="space-y-3">
            <div class="flex justify-between items-start">
              <div><div class="font-bold">Q-2024-0056</div><div class="text-sm text-slate-500">Phase 1 – Website Redesign • $15,000</div></div>
              <span class="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 rounded-full text-xs font-bold">Reviewed</span>
            </div>
            <div class="border border-slate-100 rounded-xl overflow-hidden">
              <div class="grid grid-cols-2 text-xs"><div class="p-3 border-r border-slate-100"><div class="text-slate-500 font-semibold">Scope</div><div class="mt-1">UX/UI, Frontend, CMS</div></div><div class="p-3"><div class="text-slate-500 font-semibold">Timeline</div><div class="mt-1">May 20 – Jun 30</div></div></div>
              <div class="p-3 bg-slate-50 border-t border-slate-100 text-xs"><span class="font-semibold">Sent on:</span> May 10, 2024 • <span class="font-semibold">Client:</span> Sarah Mitchell</div>
            </div>
            <div class="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900">Client feedback: “Looks good, please proceed with final contract.” — May 15</div>
          </div>`, actions:`<button class="btn-ghost" onclick="closeModal()">Close</button><button class="btn-primary" onclick="closeModal(); showToast('Quotation approved','success')">Approve</button>`, size:'lg'});
      });
    }
  });
}

function initActivities(){
  const filterBtn=[...document.querySelectorAll('button')].find(b=>b.textContent.includes('Filter'));
  filterBtn?.addEventListener('click', ()=>{
    openModal({title:'Filter Activities', body:`
      <div class="grid grid-cols-1 gap-3 text-sm">
        <label><span class="text-xs font-semibold">Type</span><select class="w-full border border-slate-200 rounded-xl px-3 py-2"><option>All Types</option><option>Leads</option><option>Projects</option><option>Payments</option></select></label>
        <label><span class="text-xs font-semibold">Date</span><input type="date" class="w-full border border-slate-200 rounded-xl px-3 py-2"/></label>
        <div class="flex gap-2"><span class="filter-chip active">All</span><span class="filter-chip">Today</span><span class="filter-chip">This Week</span></div>
      </div>`, actions:`<button class="btn-ghost" onclick="closeModal()">Cancel</button><button class="btn-primary" onclick="closeModal(); showToast('Activities filtered','success')">Apply</button>`});
  });

  // donut legend hover highlights + filters timeline
  const legends=[...document.querySelectorAll('.space-y-1\\.5 .flex')];
  legends.forEach(leg=>{
    leg.style.cursor='pointer';
    leg.addEventListener('click', ()=>{
      leg.style.opacity = leg.style.opacity==='0.4' ? '1' : '0.4';
      showToast('Toggled '+leg.textContent.trim().split(' ')[0], 'info',1100);
    });
  });

  // timeline expand
  document.querySelectorAll('.relative.flex.gap-3').forEach(item=>{
    if(item.closest('.relative.pl-8')){
      item.style.cursor='pointer';
      item.addEventListener('click', ()=>{
        item.classList.toggle('bg-slate-50');
        if(!item.dataset.expanded){
          const extra=document.createElement('div');
          extra.className='text-[11px] text-slate-500 mt-1 pl-1';
          extra.textContent='Details: Demo expanded content. Click again to collapse.';
          extra.dataset.extra='1';
          item.querySelector('div.flex-1')?.appendChild(extra);
          item.dataset.expanded='1';
        } else {
          const ex=item.querySelector('[data-extra]'); if(ex) ex.remove();
          delete item.dataset.expanded;
        }
      });
    }
  });
}

function initEarnings(){
  const tabs=[...document.querySelectorAll('.bg-white.border.rounded-xl.p-1 button')].filter(b=>b.textContent.match(/This Year|Quarter|Month|Custom/));
  // For earnings page first row tabs
  const earningsTabs=document.querySelectorAll('.flex.flex-wrap .bg-white.border.rounded-xl.p-1 button');
  const stats=[...document.querySelectorAll('.grid.grid-cols-2.lg\\:grid-cols-5 .bg-white')];
  const updateEarnings=(label)=>{
    const map={
      'This Year': {total:'$24,750', comm:'$18,500', paid:'$12,750', pending:'$5,750'},
      'This Quarter': {total:'$8,200', comm:'$6,100', paid:'$4,200', pending:'$1,900'},
      'This Month': {total:'$2,850', comm:'$2,100', paid:'$1,400', pending:'$700'},
      'Custom Range': {total:'$14,320', comm:'$10,800', paid:'$7,900', pending:'$2,900'}
    };
    const v=map[label]||map['This Year'];
    // patch first 4 cards
    const cards=document.querySelectorAll('.grid.grid-cols-2.lg\\:grid-cols-5 > div');
    if(cards[0]) cards[0].querySelector('.text-\\[18px\\]') && (cards[0].querySelector('.text-\\[18px\\]').textContent=v.total);
    if(cards[1] && cards[1].querySelector('.text-\\[18px\\]')) cards[1].querySelector('.text-\\[18px\\]').textContent=v.comm;
    if(cards[2] && cards[2].querySelector('.text-\\[18px\\]')) cards[2].querySelector('.text-\\[18px\\]').textContent=v.paid;
    if(cards[3] && cards[3].querySelector('.text-\\[18px\\]')) cards[3].querySelector('.text-\\[18px\\]').textContent=v.pending;
    showToast(`Switched to ${label}`,'info',1100);
  };
  // wire both sets
  [...earningsTabs, ...tabs].forEach(btn=>{
    btn.addEventListener('click', ()=>{
      // remove active
      const parent=btn.parentElement;
      if(parent){
        [...parent.querySelectorAll('button')].forEach(b=>{ b.className='px-3.5 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50'; });
        btn.className='bg-[#4f46e5] text-white px-3.5 py-1.5 rounded-lg shadow-sm';
      }
      updateEarnings(btn.textContent.trim());
    });
  });

  // Request Payout
  const reqBtn=[...document.querySelectorAll('a,button')].find(b=>b.textContent.includes('Request Payout'));
  reqBtn?.addEventListener('click', e=>{
    e.preventDefault();
    openModal({title:'Request Payout', body:`
      <div class="space-y-4">
        <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex justify-between">
          <span class="text-xs font-semibold text-slate-600">Available Balance</span><span class="text-sm font-extrabold text-emerald-700">$5,750</span>
        </div>
        <label class="block"><span class="text-xs font-semibold">Amount to request ($)</span><input id="payout-amount" type="number" min="500" max="5750" value="5750" class="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm"/></label>
        <label class="block"><span class="text-xs font-semibold">Payout Method</span><select class="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm"><option>Bank Transfer — •••• 4589</option><option>PayPal — james@...</option></select></label>
        <p class="text-xs text-slate-500">Minimum $500 • Processed within 5 business days. Fees may apply.</p>
      </div>`, actions:`<button class="btn-ghost" onclick="closeModal()">Cancel</button><button class="btn-primary" onclick="(function(){const v=parseInt(document.getElementById('payout-amount').value||'0'); if(v<500){showToast('Minimum payout is $500','error'); return;} if(v>5750){showToast('Amount exceeds available balance','error'); return;} closeModal(); showToast('Payout request for $'+v+' submitted ✓','success');})()">Confirm Request</button>`});
  });

  // Transactions tabs filter
  const tTabs=[...document.querySelectorAll('button')].filter(b=>b.textContent.match(/Transactions|Payouts|Adjustments/));
  tTabs.forEach(tab=>{
    tab.addEventListener('click', ()=>{
      tTabs.forEach(t=>{ t.className='text-[11px] font-medium text-slate-500 px-2'; });
      tab.className='text-[11px] font-bold text-[#4f46e5] border-b-2 border-[#4f46e5] pb-2 -mb-3 px-2';
      // filter table rows by type
      const type=tab.textContent.trim();
      const rows=[...document.querySelectorAll('.grid.grid-cols-\\[90px_1\\.6fr_1fr_90px_90px_90px\\]')].slice(1);
      rows.forEach(r=>{
        const cell=[...r.children][4];
        if(!cell) return;
        const show = type==='Transactions' || cell.textContent.trim().toLowerCase()===type.toLowerCase().slice(0,-1).toLowerCase() || (type==='Payouts' && cell.textContent.includes('Payout')) || (type==='Adjustments' && cell.textContent.includes('Adjustment'));
        r.style.display = show ? '' : 'none';
      });
    });
  });
}

function initReports(){
  const tabs=document.querySelectorAll('.bg-white.border.rounded-xl.p-1 button');
  const stats=document.querySelectorAll('.grid.grid-cols-2.lg\\:grid-cols-6 > div');
  tabs.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const parent=btn.parentElement;
      [...parent.querySelectorAll('button')].forEach(b=>b.className='px-3.5 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50');
      btn.className='bg-[#4f46e5] text-white px-3.5 py-1.5 rounded-lg shadow-sm';
      // simulate numbers changing
      stats.forEach(card=>{
        const numEl=card.querySelector('.text-\\[18px\\]');
        if(numEl){
          const base=parseInt(numEl.textContent.replace(/[^0-9]/g,''))||100;
          const mult = btn.textContent.includes('Quarter') ? 0.34 : btn.textContent.includes('Month') ? 0.12 : 1;
          let newVal=Math.round(base*mult);
          if(numEl.textContent.includes('$')) numEl.textContent='$'+newVal.toLocaleString();
          else if(numEl.textContent.includes('%')) numEl.textContent=(mult*14.92).toFixed(2)+'%';
          else numEl.textContent=newVal.toLocaleString();
        }
      });
      showToast(`Reports updated — ${btn.textContent.trim()}`,'info',1000);
    });
  });
  const exportBtn=[...document.querySelectorAll('a,button')].find(b=>b.textContent.includes('Export Report'));
  exportBtn?.addEventListener('click', e=>{
    e.preventDefault();
    showToast('Generating report PDF…','info');
    setTimeout(()=>{
      const blob=new Blob(['ZenPartner Report\nGenerated: '+new Date().toLocaleString()+'\nDemo export'],{type:'application/pdf'});
      const url=URL.createObjectURL(blob);
      const a=document.createElement('a'); a.href=url; a.download='report.pdf'; a.click(); URL.revokeObjectURL(url);
      showToast('Report downloaded ✓','success');
    },600);
  });
  document.querySelectorAll('a').forEach(a=>{
    if(a.textContent.includes('View Report')){
      a.addEventListener('click', e=>{
        e.preventDefault();
        const title=a.closest('a')?.querySelector('div.text-\\[11px\\]')?.textContent || 'Report';
        openModal({title, body:`<div class="space-y-3 text-sm text-slate-600"><div class="h-32 bg-slate-50 border border-slate-200 rounded-xl grid place-items-center text-slate-400">Chart preview • ${title}</div><p>Detailed ${title.toLowerCase()} with trends, breakdowns, and export options. This is a demo preview.</p></div>`, actions:`<button class="btn-ghost" onclick="closeModal()">Close</button><button class="btn-primary" onclick="closeModal(); showToast('Opening full report…','info')">Open Full Report</button>`});
      });
    }
  });
}


// ── Admin Page Initializers (single source, mirror portal init logic) ──
function initAdminDashboard(){
  const tbody=document.getElementById('partner-tbody');
  if(!tbody) return;
  const rows=[...tbody.querySelectorAll('tr')];
  const searchInput=document.getElementById('partner-search');
  const statusFilter=document.getElementById('status-filter');
  const countEl=document.getElementById('table-count');
  const perPage=document.getElementById('per-page');
  const applyFilters=()=>{
    const q=(searchInput?.value||'').toLowerCase();
    const st=statusFilter?.value||'all';
    let visible=0;
    rows.forEach(r=>{
      const matchQ=!q||(r.dataset.search||'').includes(q);
      const matchS=st==='all'||r.dataset.status===st;
      const show=matchQ&&matchS;
      r.style.display=show?'':'none';
      if(show) visible++;
    });
    if(countEl) countEl.textContent = visible===rows.length
      ? 'Showing 1 to '+rows.length+' of 248 entries'
      : 'Showing 1 to '+visible+' of '+visible+' matching entries';
  };
  searchInput?.addEventListener('input',applyFilters);
  statusFilter?.addEventListener('change',applyFilters);
  perPage?.addEventListener('change',applyFilters);
  const topSearch=document.getElementById('top-search-input');
  topSearch?.addEventListener('input',()=>{ if(searchInput) searchInput.value=topSearch.value; applyFilters(); });
  const prev=document.getElementById('page-prev');
  const next=document.getElementById('page-next');
  next?.addEventListener('click',()=>{ if(prev) prev.disabled=false; next.disabled=true; });
  prev?.addEventListener('click',()=>{ if(next) next.disabled=false; prev.disabled=true; });
  // Context actions use the shared modal + toast engine
  [...document.querySelectorAll('button')].forEach(b=>{
    if(b.textContent.includes('Assign New Task')){
      b.addEventListener('click',e=>{
        e.preventDefault(); e.stopPropagation();
        openModal({title:'Assign New Task', body:`
          <div class="space-y-3">
            <label class="block"><span class="text-xs font-semibold">Task Title</span><input placeholder="e.g., Review project proposal" class="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"/></label>
            <label class="block"><span class="text-xs font-semibold">Assign To</span><select class="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"><option>James Anderson</option><option>Sarah Mitchell</option><option>Michael Davis</option></select></label>
            <label class="block"><span class="text-xs font-semibold">Priority</span><select class="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"><option>High</option><option>Medium</option><option>Low</option></select></label>
            <label class="block"><span class="text-xs font-semibold">Due Date</span><input type="date" value="${new Date().toISOString().slice(0,10)}" class="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"/></label>
          </div>`, actions:`<button class="btn-ghost" onclick="closeModal()">Cancel</button><button class="btn-primary" onclick="closeModal(); showToast('Task assigned successfully','success')">Assign Task</button>`});
      });
    }
    if(b.textContent.includes('Add Follow Up')){
      b.addEventListener('click',e=>{
        e.preventDefault(); e.stopPropagation();
        openModal({title:'Add Follow Up', body:`
          <div class="space-y-3">
            <label class="block"><span class="text-xs font-semibold">Partner</span><select class="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"><option>James Anderson</option><option>Sarah Mitchell</option><option>Michael Davis</option></select></label>
            <label class="block"><span class="text-xs font-semibold">Subject</span><input placeholder="Follow up on project update" class="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"/></label>
            <label class="block"><span class="text-xs font-semibold">Notes</span><textarea rows="3" class="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"></textarea></label>
          </div>`, actions:`<button class="btn-ghost" onclick="closeModal()">Cancel</button><button class="btn-primary" onclick="closeModal(); showToast('Follow up scheduled','success')">Schedule</button>`});
      });
    }
  });
}

function initAdminPartners(){
  const tbody=document.getElementById('partner-tbody');
  if(!tbody) return;
  const PARTNERS=[
    {id:'ZP-2024-0001',name:'James Anderson',email:'james.anderson@example.com',phone:'+1 (555) 123-4567',level:'Gold Partner',status:'Active',kyc:'Verified',joined:'Jan 15, 2024',leads:96,projects:12,earnings:'$24,750',payouts:'$12,750',avatar:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=60'},
    {id:'ZP-2024-0002',name:'Sarah Mitchell',email:'sarah.mitchell@example.com',phone:'+1 (555) 234-5678',level:'Gold Partner',status:'Active',kyc:'Verified',joined:'Jan 18, 2024',leads:64,projects:8,earnings:'$18,200',payouts:'$9,450',avatar:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=60'},
    {id:'ZP-2024-0003',name:'Michael Davis',email:'michael.davis@example.com',phone:'+1 (555) 345-6789',level:'Silver Partner',status:'Active',kyc:'Verified',joined:'Jan 20, 2024',leads:78,projects:10,earnings:'$16,500',payouts:'$8,250',avatar:'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&auto=format&fit=crop&q=60'},
    {id:'ZP-2024-0004',name:'Emily Wilson',email:'emily.wilson@example.com',phone:'+1 (555) 456-7890',level:'Silver Partner',status:'Pending',kyc:'Pending',joined:'Jan 22, 2024',leads:10,projects:2,earnings:'$1,250',payouts:'$0',avatar:'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&auto=format&fit=crop&q=60'},
    {id:'ZP-2024-0005',name:'David Lee',email:'david.lee@example.com',phone:'+1 (555) 567-8901',level:'Bronze Partner',status:'Active',kyc:'Verified',joined:'Jan 25, 2024',leads:42,projects:6,earnings:'$9,800',payouts:'$4,900',avatar:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=60'},
    {id:'ZP-2024-0006',name:'Olivia Brown',email:'olivia.brown@example.com',phone:'+1 (555) 678-9012',level:'Bronze Partner',status:'Inactive',kyc:'Not Verified',joined:'Jan 28, 2024',leads:0,projects:0,earnings:'$0',payouts:'$0',avatar:'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&auto=format&fit=crop&q=60'},
    {id:'ZP-2024-0007',name:'Daniel Martinez',email:'daniel.martinez@example.com',phone:'+1 (555) 789-0123',level:'Silver Partner',status:'Active',kyc:'Verified',joined:'Jan 30, 2024',leads:55,projects:7,earnings:'$12,600',payouts:'$6,300',avatar:'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&auto=format&fit=crop&q=60'},
    {id:'ZP-2024-0008',name:'Sophia Johnson',email:'sophia.johnson@example.com',phone:'+1 (555) 890-1234',level:'Bronze Partner',status:'Pending',kyc:'Pending',joined:'Feb 02, 2024',leads:5,projects:1,earnings:'$600',payouts:'$0',avatar:'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&auto=format&fit=crop&q=60'},
    {id:'ZP-2024-0009',name:'William Taylor',email:'william.taylor@example.com',phone:'+1 (555) 901-2345',level:'Silver Partner',status:'Active',kyc:'Verified',joined:'Feb 05, 2024',leads:8,projects:5,earnings:'$7,400',payouts:'$3,700',avatar:'https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?w=80&auto=format&fit=crop&q=60'},
    {id:'ZP-2024-0010',name:'Ava Thomas',email:'ava.thomas@example.com',phone:'+1 (555) 012-3456',level:'Bronze Partner',status:'Active',kyc:'Verified',joined:'Feb 08, 2024',leads:22,projects:3,earnings:'$4,200',payouts:'$2,100',avatar:'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=60'},
    {id:'ZP-2024-0011',name:'Benjamin Clark',email:'benjamin.clark@example.com',phone:'+1 (555) 111-2222',level:'Silver Partner',status:'Inactive',kyc:'Not Verified',joined:'Feb 10, 2024',leads:0,projects:0,earnings:'$0',payouts:'$0',avatar:'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&auto=format&fit=crop&q=60'},
    {id:'ZP-2024-0012',name:'Mia Lewis',email:'mia.lewis@example.com',phone:'+1 (555) 222-3333',level:'Bronze Partner',status:'Active',kyc:'Verified',joined:'Feb 12, 2024',leads:18,projects:2,earnings:'$2,300',payouts:'$1,150',avatar:'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=80&auto=format&fit=crop&q=60'}
  ];
  const levelClass={'Gold Partner':'bg-[#fef3df] text-amber-600','Silver Partner':'bg-[#eff2f8] text-slate-600','Bronze Partner':'bg-[#fbeee0] text-[#b45309]'};
  const statusClass={'Active':'bg-emerald-50 text-emerald-600','Pending':'bg-[#fef0da] text-amber-600','Inactive':'bg-[#fde8e8] text-red-500'};
  const kycClass={'Verified':'bg-[#edf8f0] text-emerald-600','Pending':'bg-[#fefbf2] text-amber-600','Not Verified':'bg-[#fdeaea] text-red-500'};
  const rowHtml=p=>`<tr data-id="${p.id}" data-status="${p.status}" data-level="${p.level}" data-kyc="${p.kyc}">
    <td class="font-semibold text-slate-500">${p.id}</td>
    <td><div class="flex items-center gap-2.5"><img src="${p.avatar}" class="w-7 h-7 rounded-full object-cover"><div class="text-[12.5px] font-semibold">${p.name}</div></div></td>
    <td class="text-slate-500">${p.email}</td>
    <td class="text-slate-500">${p.phone}</td>
    <td><span class="level-pill ${levelClass[p.level]}"><span>★</span>${p.level}</span></td>
    <td><span class="status-pill ${statusClass[p.status]}"><span class="w-1.5 h-1.5 rounded-full bg-current opacity-70"></span>${p.status}</span></td>
    <td><span class="status-pill ${kycClass[p.kyc]}">${p.kyc}</span></td>
    <td class="text-slate-500">${p.joined}</td>
    <td class="text-center font-semibold">${p.leads}</td>
    <td class="text-center font-semibold">${p.projects}</td>
    <td class="text-right font-bold">${p.earnings}</td>
    <td class="text-right">${p.payouts}</td>
    <td><div class="flex items-center justify-center gap-1"><a href="partner-view.html" class="w-7 h-7 grid place-items-center rounded-lg hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition" title="View"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg></a><button class="row-more w-7 h-7 grid place-items-center rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition" title="More" aria-label="More actions"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg></button></div></td>
  </tr>`;
  const render=()=>{
    const q=(document.getElementById('partner-search').value||'').toLowerCase();
    const st=document.getElementById('status-filter').value;
    const lv=document.getElementById('level-filter').value;
    const kc=document.getElementById('kyc-filter').value;
    const visible=PARTNERS.filter(p=>{
      const hay=(p.id+' '+p.name+' '+p.email).toLowerCase();
      return (!q||hay.includes(q)) && (st==='all'||p.status===st) && (lv==='all'||p.level===lv) && (kc==='all'||p.kyc===kc);
    });
    tbody.innerHTML=visible.map(rowHtml).join('');
    document.getElementById('table-count').textContent = visible.length===PARTNERS.length
      ? 'Showing 1 to '+PARTNERS.length+' of 248 entries'
      : 'Showing 1 to '+visible.length+' of '+visible.length+' matching entries';
  };
  ['partner-search','status-filter','level-filter','kyc-filter'].forEach(id=>{
    const el=document.getElementById(id);
    el?.addEventListener('input',render);
    el?.addEventListener('change',render);
  });
  document.getElementById('top-search-input')?.addEventListener('input',function(){document.getElementById('partner-search').value=this.value;render();});
  render();
  document.getElementById('export-btn')?.addEventListener('click',e=>{
    e.preventDefault(); e.stopPropagation();
    const rows=[['Partner ID','Partner','Email','Phone','Partner Level','Status','KYC Status','Joined On','Leads','Projects','Earnings','Payouts']];
    PARTNERS.forEach(p=>rows.push([p.id,p.name,p.email,p.phone,p.level,p.status,p.kyc,p.joined,p.leads,p.projects,p.earnings,p.payouts]));
    downloadStaticFile('zenpartners.csv', rows.map(r=>r.map(c=>'"'+String(c).replace(/"/g,'""')+'"').join(',')).join('\n'), 'text/csv');
    showToast('Exported '+PARTNERS.length+' partners to CSV','success');
  });
  document.getElementById('add-btn')?.addEventListener('click',e=>{
    e.preventDefault(); e.stopPropagation();
    openModal({title:'Add New Partner', body:`
      <div class="space-y-3">
        <label class="block"><span class="text-xs font-semibold">Full Name</span><input id="np-name" placeholder="e.g. Liam Carter" class="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"/></label>
        <label class="block"><span class="text-xs font-semibold">Email</span><input id="np-email" type="email" placeholder="liam.carter@example.com" class="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"/></label>
        <label class="block"><span class="text-xs font-semibold">Phone</span><input id="np-phone" placeholder="+1 (555) 333-4444" class="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"/></label>
        <div class="grid grid-cols-2 gap-3">
          <label class="block"><span class="text-xs font-semibold">Partner Level</span><select id="np-level" class="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"><option>Bronze Partner</option><option>Silver Partner</option><option>Gold Partner</option></select></label>
          <label class="block"><span class="text-xs font-semibold">Status</span><select id="np-status" class="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"><option>Active</option><option>Pending</option><option>Inactive</option></select></label>
        </div>
      </div>`, actions:`<button class="btn-ghost" onclick="closeModal()">Cancel</button><button class="btn-primary" id="save-partner">Add Partner</button>`});
    document.getElementById('save-partner')?.addEventListener('click',()=>{
      const name=document.getElementById('np-name').value.trim();
      const email=document.getElementById('np-email').value.trim();
      const phone=document.getElementById('np-phone').value.trim();
      if(!name||!email){ showToast('Please enter name and email','error'); return; }
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ showToast('Please enter a valid email address','error'); return; }
      const nextNum=PARTNERS.length+13;
      PARTNERS.push({id:'ZP-2024-0'+String(nextNum).padStart(3,'0'),name,email,phone:phone||'—',level:document.getElementById('np-level').value,status:document.getElementById('np-status').value,kyc:'Pending',joined:new Date().toLocaleDateString('en-US',{month:'short',day:'2-digit',year:'numeric'}),leads:0,projects:0,earnings:'$0',payouts:'$0',avatar:'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&auto=format&fit=crop&q=60'});
      render(); closeModal(); showToast('Partner '+name+' added successfully','success');
    });
  });
  // per-page pagination (cosmetic)
  const prev=document.getElementById('page-prev');
  const next=document.getElementById('page-next');
  next?.addEventListener('click',()=>{ if(prev) prev.disabled=false; next.disabled=true; });
  prev?.addEventListener('click',()=>{ if(next) next.disabled=false; prev.disabled=true; });
  // more-actions menus
  document.addEventListener('click',e=>{
    const more=e.target.closest('.row-more');
    if(more){ e.preventDefault(); e.stopPropagation(); openActionMenu(more); }
  });
}

function initAdminOnboarding(){
  const tbody=document.getElementById('onboard-tbody');
  if(!tbody) return;
  const PARTNERS=[
    {id:'ZP-2024-0001',name:'James Anderson',level:'Gold Partner',status:'Completed',overall:100,steps:['May 01, 2024','May 02, 2024','May 05, 2024','May 06, 2024','May 07, 2024','May 08, 2024'],avatar:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=60'},
    {id:'ZP-2024-0002',name:'Sarah Mitchell',level:'Gold Partner',status:'In Progress',overall:33,steps:['May 03, 2024','May 04, 2024','In Progress','Pending','Pending','Pending'],avatar:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=60'},
    {id:'ZP-2024-0003',name:'Michael Davis',level:'Silver Partner',status:'In Progress',overall:17,steps:['May 02, 2024','Pending','Pending','Pending','Pending','Pending'],avatar:'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&auto=format&fit=crop&q=60'},
    {id:'ZP-2024-0004',name:'Emily Wilson',level:'Bronze Partner',status:'In Progress',overall:22,steps:['May 06, 2024','In Progress','Pending','Pending','Pending','Pending'],avatar:'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&auto=format&fit=crop&q=60'},
    {id:'ZP-2024-0005',name:'David Lee',level:'Bronze Partner',status:'Pending',overall:0,steps:['Pending','Pending','Pending','Pending','Pending','Pending'],avatar:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=60'},
    {id:'ZP-2024-0006',name:'Olivia Brown',level:'Gold Partner',status:'In Progress',overall:67,steps:['May 04, 2024','May 05, 2024','May 06, 2024','In Progress','Pending','Pending'],avatar:'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&auto=format&fit=crop&q=60'},
    {id:'ZP-2024-0007',name:'Daniel Martinez',level:'Silver Partner',status:'In Progress',overall:33,steps:['May 03, 2024','Pending','In Progress','Pending','Pending','Pending'],avatar:'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&auto=format&fit=crop&q=60'},
    {id:'ZP-2024-0008',name:'Sophia Johnson',level:'Bronze Partner',status:'Pending',overall:0,steps:['Pending','Pending','Pending','Pending','Pending','Pending'],avatar:'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&auto=format&fit=crop&q=60'}
  ];
  const levelClass={'Gold Partner':'bg-[#fef3df] text-amber-600','Silver Partner':'bg-[#eff2f8] text-slate-600','Bronze Partner':'bg-[#fbeee0] text-[#b45309]'};
  const statusClass={'Completed':'bg-emerald-50 text-emerald-600','In Progress':'bg-[#e7effe] text-blue-600','Pending':'bg-[#fef3e2] text-amber-600'};
  const stepDoneClass='bg-emerald-50 text-emerald-600';
  const stepProgressClass='bg-[#e7effe] text-blue-600';
  const stepPendingClass='bg-[#fef3e2] text-amber-600';
  const stepCell=v=>{
    if(v==='Pending') return `<td><span class="step-pill ${stepPendingClass}"><span class="w-1.5 h-1.5 rounded-full bg-current opacity-70"></span>Pending</span></td>`;
    if(v==='In Progress') return `<td><span class="step-pill ${stepProgressClass}"><span class="w-1.5 h-1.5 rounded-full bg-current opacity-70"></span>In Progress</span></td>`;
    return `<td><span class="step-pill ${stepDoneClass}"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 13l4 4L19 7"/></svg>${v}</span></td>`;
  };
  const overallBar=p=>{
    const barColor=p>=100?'bg-[#00a860]':(p>0?'bg-[#2563eb]':'bg-slate-200');
    const textColor=p>=100?'text-emerald-600':(p>0?'text-blue-600':'text-slate-400');
    return `<td><div class="flex items-center gap-2"><div class="w-14 h-1.5 bg-slate-100 rounded-full overflow-hidden"><div class="h-full ${barColor} rounded-full" style="width:${p}%"></div></div><span class="text-[11px] font-bold ${textColor}">${p}%</span></div></td>`;
  };
  const rowHtml=p=>`<tr data-id="${p.id}" data-status="${p.status}" data-level="${p.level}">
    <td><div class="flex items-center gap-2.5"><img src="${p.avatar}" class="w-7 h-7 rounded-full object-cover"><div class="leading-tight"><div class="text-[12.5px] font-semibold">${p.name}</div><div class="text-[10px] text-slate-400">${p.id}</div></div></div></td>
    <td><span class="level-pill ${levelClass[p.level]}"><span>★</span>${p.level}</span></td>
    <td><span class="status-pill ${statusClass[p.status]}"><span class="w-1.5 h-1.5 rounded-full bg-current opacity-70"></span>${p.status}</span></td>
    ${p.steps.map(stepCell).join('')}
    ${overallBar(p.overall)}
  </tr>`;
  const render=()=>{
    const q=(document.getElementById('partner-search').value||'').toLowerCase();
    const st=document.getElementById('status-filter').value;
    const lv=document.getElementById('level-filter').value;
    const sp=document.getElementById('step-filter').value;
    const stepMap={agreement:0,nda:1,training:2,learn:3,resources:4,ready:5};
    const visible=PARTNERS.filter(p=>{
      const hay=(p.id+' '+p.name).toLowerCase();
      let stepOk=true;
      if(sp!=='all') stepOk=!p.steps[stepMap[sp]].toLowerCase().includes('pending');
      return (!q||hay.includes(q)) && (st==='all'||p.status===st) && (lv==='all'||p.level===lv) && stepOk;
    });
    tbody.innerHTML=visible.map(rowHtml).join('');
    document.getElementById('table-count').textContent = visible.length===PARTNERS.length
      ? 'Showing 1 to '+PARTNERS.length+' of 248 entries'
      : 'Showing 1 to '+visible.length+' of '+visible.length+' matching entries';
  };
  ['partner-search','status-filter','level-filter','step-filter'].forEach(id=>{
    const el=document.getElementById(id);
    el?.addEventListener('input',render);
    el?.addEventListener('change',render);
  });
  document.getElementById('top-search-input')?.addEventListener('input',function(){document.getElementById('partner-search').value=this.value;render();});
  render();
  document.getElementById('export-btn')?.addEventListener('click',e=>{
    e.preventDefault(); e.stopPropagation();
    const rows=[['Partner ID','Partner','Partner Level','Onboarding Status','Overall Progress','Agreement','NDA Sign','Training & Certification','Learn About Company','Resources Access','Ready to Refer']];
    PARTNERS.forEach(p=>rows.push([p.id,p.name,p.level,p.status,p.overall+'%',...p.steps]));
    downloadStaticFile('partners-onboarding.csv', rows.map(r=>r.map(c=>'"'+String(c).replace(/"/g,'""')+'"').join(',')).join('\n'), 'text/csv');
    showToast('Exported onboarding data to CSV','success');
  });
  const filtersBtn=[...document.querySelectorAll('button')].find(b=>b.textContent.includes('Filters'));
  filtersBtn?.addEventListener('click',e=>{
    e.preventDefault(); e.stopPropagation();
    openModal({title:'Filter Onboarding', body:`
      <div class="grid grid-cols-1 gap-3 text-sm">
        <label><span class="text-xs font-semibold">Onboarding Status</span><select class="w-full border border-slate-200 rounded-xl px-3 py-2"><option>All</option><option>Completed</option><option>In Progress</option><option>Pending</option></select></label>
        <label><span class="text-xs font-semibold">Partner Level</span><select class="w-full border border-slate-200 rounded-xl px-3 py-2"><option>All</option><option>Gold Partner</option><option>Silver Partner</option><option>Bronze Partner</option></select></label>
        <label><span class="text-xs font-semibold">Invited By</span><select class="w-full border border-slate-200 rounded-xl px-3 py-2"><option>All</option><option>Admin User</option><option>System</option></select></label>
      </div>`, actions:`<button class="btn-ghost" onclick="closeModal()">Cancel</button><button class="btn-primary" onclick="closeModal(); showToast('Onboarding filters applied','success')">Apply Filters</button>`});
  });
  const prev=document.getElementById('page-prev');
  const next=document.getElementById('page-next');
  next?.addEventListener('click',()=>{ if(prev) prev.disabled=false; next.disabled=true; });
  prev?.addEventListener('click',()=>{ if(next) next.disabled=false; prev.disabled=true; });
}

function initAdminPartnerView(){
  document.querySelectorAll('.detail-tab').forEach(tab=>{
    tab.addEventListener('click',()=>{
      document.querySelectorAll('.detail-tab').forEach(t=>t.classList.remove('active'));
      tab.classList.add('active');
    });
  });
  const wire=(el,fn)=>el?.addEventListener('click',e=>{ e.preventDefault(); e.stopPropagation(); fn(); });
  [...document.querySelectorAll('button,a')].forEach(el=>{
    if(el.textContent.includes('Follow Up') && el.tagName==='BUTTON'){
      wire(el,()=>openModal({title:'Add Follow Up', body:`<label class="block"><span class="text-xs font-semibold">Notes</span><textarea rows="4" class="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm" placeholder="What needs a follow up?"></textarea></label>`, actions:`<button class="btn-ghost" onclick="closeModal()">Cancel</button><button class="btn-primary" onclick="closeModal(); showToast('Follow up logged','success')">Save</button>`}));
    }
    if(el.textContent.includes('Assign Task') && el.tagName==='BUTTON'){
      wire(el,()=>openModal({title:'Assign Task', body:`<label class="block"><span class="text-xs font-semibold">Task</span><input placeholder="Task title" class="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"/></label>`, actions:`<button class="btn-ghost" onclick="closeModal()">Cancel</button><button class="btn-primary" onclick="closeModal(); showToast('Task assigned','success')">Assign</button>`}));
    }
    if(el.textContent.includes('Send Email') && el.tagName==='BUTTON'){
      wire(el,()=>showToast('Email composer opened (demo)','success'));
    }
    if(el.textContent.includes('Add New Task') && el.tagName==='BUTTON'){
      wire(el,()=>showToast('New task added (demo)','success'));
    }
    if(el.textContent.includes('Add Follow Up') && el.tagName==='BUTTON' && el.textContent.trim().length<24){
      wire(el,()=>showToast('Follow up added (demo)','success'));
    }
    if(el.textContent.includes('View Public Profile')){
      wire(el,()=>openModal({title:'Public Profile — James Anderson', body:`<div class="flex items-center gap-4"><img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=60" class="w-16 h-16 rounded-full object-cover"><div><div class="font-bold text-sm">James Anderson</div><div class="text-xs text-slate-500">ZP-2024-0001 • Gold Partner</div><div class="text-xs text-slate-500 mt-1">New York, USA</div></div></div><div class="mt-4 text-sm text-slate-600">Public partner card preview — used in the partner directory. Demo content.</div>`, actions:`<button class="btn-primary" onclick="closeModal()">Close</button>`, size:'sm'}));
    }
  });
  // View All Tasks / View All Follow Ups
  [...document.querySelectorAll('a')].forEach(a=>{
    if(a.textContent.includes('View All Tasks') || a.textContent.includes('View All Follow Ups')){
      a.addEventListener('click',e=>{ e.preventDefault(); e.stopPropagation(); showToast('Opening full list (demo)','info'); });
    }
  });
}

function initAdminPayouts(){
  const tbody=document.getElementById('payout-tbody');
  if(!tbody) return;
  const PAYOUTS=[
    {id:'PO-2024-0521',partner:'James Anderson',amount:'$2,500',method:'Bank Transfer',status:'Pending',requested:'May 15, 2024',avatar:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=60'},
    {id:'PO-2024-0520',partner:'Sarah Mitchell',amount:'$1,800',method:'Bank Transfer',status:'Approved',requested:'May 14, 2024',avatar:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=60'},
    {id:'PO-2024-0519',partner:'Michael Davis',amount:'$3,200',method:'PayPal',status:'Paid',requested:'May 12, 2024',avatar:'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&auto=format&fit=crop&q=60'},
    {id:'PO-2024-0518',partner:'Emily Wilson',amount:'$750',method:'Bank Transfer',status:'Pending',requested:'May 12, 2024',avatar:'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&auto=format&fit=crop&q=60'},
    {id:'PO-2024-0517',partner:'David Lee',amount:'$1,150',method:'Bank Transfer',status:'Rejected',requested:'May 10, 2024',avatar:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=60'},
    {id:'PO-2024-0516',partner:'Daniel Martinez',amount:'$2,900',method:'PayPal',status:'Paid',requested:'May 08, 2024',avatar:'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&auto=format&fit=crop&q=60'},
    {id:'PO-2024-0515',partner:'William Taylor',amount:'$1,600',method:'Bank Transfer',status:'Approved',requested:'May 06, 2024',avatar:'https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?w=80&auto=format&fit=crop&q=60'},
    {id:'PO-2024-0514',partner:'Ava Thomas',amount:'$950',method:'Bank Transfer',status:'Paid',requested:'May 04, 2024',avatar:'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=60'}
  ];
  const statusClass={'Pending':'bg-amber-50 text-amber-600','Approved':'bg-sky-50 text-sky-600','Paid':'bg-emerald-50 text-emerald-600','Rejected':'bg-rose-50 text-rose-500'};
  const rowHtml=p=>`<tr data-status="${p.status}">
    <td class="font-semibold text-slate-500">${p.id}</td>
    <td><div class="flex items-center gap-2.5"><img src="${p.avatar}" class="w-7 h-7 rounded-full object-cover"><span class="font-semibold">${p.partner}</span></div></td>
    <td class="text-right font-bold">${p.amount}</td>
    <td class="text-slate-500">${p.method}</td>
    <td><span class="status-pill ${statusClass[p.status]}"><span class="w-1.5 h-1.5 rounded-full bg-current opacity-70"></span>${p.status}</span></td>
    <td class="text-slate-500">${p.requested}</td>
    <td><div class="flex items-center justify-center gap-1">
      <button class="payout-approve w-7 h-7 grid place-items-center rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition" title="Approve"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 13l4 4L19 7"/></svg></button>
      <button class="payout-reject w-7 h-7 grid place-items-center rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition" title="Reject"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg></button>
    </div></td>
  </tr>`;
  const render=()=>{
    const q=(document.getElementById('payout-search').value||'').toLowerCase();
    const st=document.getElementById('payout-status').value;
    const visible=PAYOUTS.filter(p=>{
      const hay=(p.id+' '+p.partner).toLowerCase();
      return (!q||hay.includes(q)) && (st==='all'||p.status===st);
    });
    tbody.innerHTML=visible.map(rowHtml).join('');
    document.getElementById('payout-count').textContent = visible.length===PAYOUTS.length
      ? 'Showing 1 to '+PAYOUTS.length+' of 248 entries'
      : 'Showing 1 to '+visible.length+' of '+visible.length+' matching entries';
  };
  document.getElementById('payout-search')?.addEventListener('input',render);
  document.getElementById('payout-status')?.addEventListener('change',render);
  document.getElementById('top-search-input')?.addEventListener('input',function(){document.getElementById('payout-search').value=this.value;render();});
  render();
  tbody.addEventListener('click',e=>{
    const btn=e.target.closest('.payout-approve, .payout-reject');
    if(!btn) return;
    e.preventDefault(); e.stopPropagation();
    const tr=btn.closest('tr');
    const id=tr?.querySelector('td')?.textContent||'PO-0000';
    if(btn.classList.contains('payout-approve')){
      openModal({title:'Approve Payout', body:`<p class="text-sm text-slate-600">Approve payout <b>${id}</b>? Funds will be released on the next payment cycle.</p>`, actions:`<button class="btn-ghost" onclick="closeModal()">Cancel</button><button class="btn-primary" onclick="closeModal(); showToast('Payout ${id} approved','success')">Approve</button>`, size:'sm'});
    } else {
      openModal({title:'Reject Payout', body:`<label class="block"><span class="text-xs font-semibold">Reason (optional)</span><textarea rows="3" class="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm" placeholder="e.g., KYC verification missing"></textarea></label>`, actions:`<button class="btn-ghost" onclick="closeModal()">Cancel</button><button class="btn-primary" onclick="closeModal(); showToast('Payout ${id} rejected','error')">Reject</button>`, size:'sm'});
    }
  });
  document.getElementById('payout-export')?.addEventListener('click',e=>{
    e.preventDefault(); e.stopPropagation();
    const rows=[['Request ID','Partner','Amount','Method','Status','Requested On']];
    PAYOUTS.forEach(p=>rows.push([p.id,p.partner,p.amount,p.method,p.status,p.requested]));
    downloadStaticFile('payouts.csv', rows.map(r=>r.map(c=>'"'+String(c).replace(/"/g,'""')+'"').join(',')).join('\n'), 'text/csv');
    showToast('Payouts exported to CSV','success');
  });
  // Period tabs adjust KPI values (same logic as portal earnings tabs)
  const tabs=[...document.querySelectorAll('.bg-white.border.rounded-xl.p-1 button')].filter(b=>b.textContent.match(/This Month|This Quarter|This Year/));
  tabs.forEach(btn=>{
    btn.addEventListener('click',()=>{
      const parent=btn.parentElement;
      if(parent){ [...parent.querySelectorAll('button')].forEach(b=>b.className='px-3.5 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50'); btn.className='bg-[#4f46e5] text-white px-3.5 py-1.5 rounded-lg shadow-sm'; }
      const map={'This Month':['$18,250','$14,900','$11,400','$3,500'],'This Quarter':['$52,800','$41,200','$30,750','$10,450'],'This Year':['$248,750','$198,600','$127,500','$71,100']};
      const v=map[btn.textContent.trim()]||map['This Year'];
      [...document.querySelectorAll('.admin-kpi-value')].forEach((el,i)=>{ if(v[i]&&el) el.textContent=v[i]; });
      showToast(`Showing payouts — ${btn.textContent.trim()}`,'info',1100);
    });
  });
}

function initAdminTickets(){
  const tbody=document.getElementById('ticket-tbody');
  if(!tbody) return;
  let seq=1043;
  const TICKETS=[
    {id:'T-1042',subject:'Payout not received for April cycle',partner:'James Anderson',priority:'High',status:'In Progress',assignee:'Support Team',created:'May 15, 2024',updated:'May 15, 2024',avatar:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=60'},
    {id:'T-1041',subject:'Access to partner resources revoked',partner:'Sarah Mitchell',priority:'Medium',status:'Open',assignee:'Unassigned',created:'May 15, 2024',updated:'May 15, 2024',avatar:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=60'},
    {id:'T-1040',subject:'How to update KYC documents?',partner:'Michael Davis',priority:'Low',status:'Resolved',assignee:'Support Team',created:'May 14, 2024',updated:'May 14, 2024',avatar:'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&auto=format&fit=crop&q=60'},
    {id:'T-1039',subject:'Commission rate discrepancy on referral',partner:'Emily Wilson',priority:'High',status:'Open',assignee:'Finance Team',created:'May 14, 2024',updated:'May 14, 2024',avatar:'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&auto=format&fit=crop&q=60'},
    {id:'T-1038',subject:'Training certificate not visible',partner:'David Lee',priority:'Medium',status:'In Progress',assignee:'Support Team',created:'May 13, 2024',updated:'May 14, 2024',avatar:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=60'},
    {id:'T-1037',subject:'Request for new referral template',partner:'Olivia Brown',priority:'Low',status:'Resolved',assignee:'Marketing Team',created:'May 12, 2024',updated:'May 13, 2024',avatar:'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&auto=format&fit=crop&q=60'},
    {id:'T-1036',subject:'Portal login issue — OTP not received',partner:'Daniel Martinez',priority:'High',status:'Resolved',assignee:'Support Team',created:'May 11, 2024',updated:'May 12, 2024',avatar:'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&auto=format&fit=crop&q=60'},
    {id:'T-1035',subject:'Update bank account details',partner:'Sophia Johnson',priority:'Medium',status:'Open',assignee:'Finance Team',created:'May 10, 2024',updated:'May 11, 2024',avatar:'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&auto=format&fit=crop&q=60'}
  ];
  const priorityClass={'High':'bg-red-50 text-red-500','Medium':'bg-amber-50 text-amber-600','Low':'bg-slate-100 text-slate-500'};
  const statusClass={'Open':'bg-sky-50 text-sky-600','In Progress':'bg-indigo-50 text-indigo-600','Resolved':'bg-emerald-50 text-emerald-600'};
  const rowHtml=t=>`<tr data-status="${t.status}" data-priority="${t.priority}">
    <td class="font-semibold text-slate-500">${t.id}</td>
    <td><div class="leading-tight"><div class="font-semibold max-w-[280px] truncate">${t.subject}</div><div class="text-[10px] text-slate-400">${t.partner}</div></div></td>
    <td><span class="priority-pill ${priorityClass[t.priority]}">${t.priority}</span></td>
    <td><span class="status-pill ${statusClass[t.status]}"><span class="w-1.5 h-1.5 rounded-full bg-current opacity-70"></span>${t.status}</span></td>
    <td class="text-slate-500">${t.assignee}</td>
    <td class="text-slate-500">${t.created}</td>
    <td class="text-slate-500">${t.updated}</td>
    <td><div class="flex items-center justify-center gap-1">
      <button class="ticket-view w-7 h-7 grid place-items-center rounded-lg hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition" title="View"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg></button>
      <button class="ticket-status w-7 h-7 grid place-items-center rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition" title="Change status"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8 17l4-4-4-4"/><path d="M12 17l4-4-4-4"/></svg></button>
    </div></td>
  </tr>`;
  const render=()=>{
    const q=(document.getElementById('ticket-search').value||'').toLowerCase();
    const st=document.getElementById('ticket-status').value;
    const pr=document.getElementById('ticket-priority').value;
    const visible=TICKETS.filter(t=>{
      const hay=(t.id+' '+t.subject+' '+t.partner).toLowerCase();
      return (!q||hay.includes(q)) && (st==='all'||t.status===st) && (pr==='all'||t.priority===pr);
    });
    tbody.innerHTML=visible.map(rowHtml).join('');
    document.getElementById('ticket-count').textContent = visible.length===TICKETS.length
      ? 'Showing 1 to '+TICKETS.length+' of 248 entries'
      : 'Showing 1 to '+visible.length+' of '+visible.length+' matching entries';
  };
  document.getElementById('ticket-search')?.addEventListener('input',render);
  document.getElementById('ticket-status')?.addEventListener('change',render);
  document.getElementById('ticket-priority')?.addEventListener('change',render);
  document.getElementById('top-search-input')?.addEventListener('input',function(){document.getElementById('ticket-search').value=this.value;render();});
  render();
  tbody.addEventListener('click',e=>{
    const view=e.target.closest('.ticket-view');
    if(view){
      e.preventDefault(); e.stopPropagation();
      const tr=view.closest('tr');
      const id=tr?.querySelector('td')?.textContent||'T-0000';
      openModal({title:'Ticket '+id, body:`<div class="space-y-3 text-sm"><div class="p-3 bg-slate-50 border border-slate-100 rounded-xl"><b>${tr?.querySelector('.font-semibold')?.textContent||'Ticket subject'}</b></div><p class="text-slate-600">Full conversation thread and ticket details would appear here. This is a demo preview of the ticket view.</p><div class="flex gap-2"><span class="status-pill bg-amber-50 text-amber-600">Awaiting reply</span><span class="status-pill bg-indigo-50 text-indigo-600">Priority: High</span></div></div>`, actions:`<button class="btn-ghost" onclick="closeModal()">Close</button><button class="btn-primary" onclick="closeModal(); showToast('Replying to ticket…','success')">Reply</button>`});
      return;
    }
    const st=e.target.closest('.ticket-status');
    if(st){
      e.preventDefault(); e.stopPropagation();
      const tr=st.closest('tr');
      const id=tr?.querySelector('td')?.textContent||'T-0000';
      openModal({title:'Change Status — '+id, body:`<label class="block"><span class="text-xs font-semibold">New Status</span><select id="ticket-new-status" class="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"><option>Open</option><option>In Progress</option><option>Resolved</option></select></label>`, actions:`<button class="btn-ghost" onclick="closeModal()">Cancel</button><button class="btn-primary" onclick="(function(){const v=document.getElementById('ticket-new-status').value; const t=document.querySelector('#ticket-tbody tr'); showToast('Ticket moved to '+v,'success'); closeModal();})()">Update</button>`, size:'sm'});
    }
  });
  document.getElementById('new-ticket-btn')?.addEventListener('click',e=>{
    e.preventDefault(); e.stopPropagation();
    openModal({title:'Open New Ticket', body:`
      <div class="space-y-3">
        <label class="block"><span class="text-xs font-semibold">Partner</span><select id="tk-partner" class="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"><option>James Anderson</option><option>Sarah Mitchell</option><option>Michael Davis</option><option>Emily Wilson</option><option>David Lee</option></select></label>
        <label class="block"><span class="text-xs font-semibold">Subject</span><input id="tk-subject" placeholder="Brief summary of the issue" class="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"/></label>
        <div class="grid grid-cols-2 gap-3">
          <label class="block"><span class="text-xs font-semibold">Priority</span><select id="tk-priority" class="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"><option>Low</option><option>Medium</option><option>High</option></select></label>
          <label class="block"><span class="text-xs font-semibold">Assignee</span><select id="tk-assignee" class="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"><option>Support Team</option><option>Finance Team</option><option>Marketing Team</option><option>Unassigned</option></select></label>
        </div>
        <label class="block"><span class="text-xs font-semibold">Description</span><textarea id="tk-desc" rows="3" class="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"></textarea></label>
      </div>`, actions:`<button class="btn-ghost" onclick="closeModal()">Cancel</button><button class="btn-primary" id="tk-save">Create Ticket</button>`});
    document.getElementById('tk-save')?.addEventListener('click',()=>{
      const subject=document.getElementById('tk-subject').value.trim();
      if(!subject){ showToast('Please enter a subject','error'); return; }
      const now=new Date();
      const today=now.toLocaleDateString('en-US',{month:'short',day:'2-digit',year:'numeric'});
      TICKETS.unshift({id:'T-'+seq++,subject,partner:document.getElementById('tk-partner').value,priority:document.getElementById('tk-priority').value,status:'Open',assignee:document.getElementById('tk-assignee').value,created:today,updated:today,avatar:'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&auto=format&fit=crop&q=60'});
      render(); closeModal(); showToast('Ticket created successfully','success');
    });
  });
  document.getElementById('ticket-export')?.addEventListener('click',e=>{
    e.preventDefault(); e.stopPropagation();
    const rows=[['Ticket ID','Subject','Partner','Priority','Status','Assignee','Created','Updated']];
    TICKETS.forEach(t=>rows.push([t.id,t.subject,t.partner,t.priority,t.status,t.assignee,t.created,t.updated]));
    downloadStaticFile('tickets.csv', rows.map(r=>r.map(c=>'"'+String(c).replace(/"/g,'""')+'"').join(',')).join('\n'), 'text/csv');
    showToast('Tickets exported to CSV','success');
  });
  const prev=document.getElementById('page-prev');
  const next=document.getElementById('page-next');
  next?.addEventListener('click',()=>{ if(prev) prev.disabled=false; next.disabled=true; });
  prev?.addEventListener('click',()=>{ if(next) next.disabled=false; prev.disabled=true; });
}

// ── Universal Static Data & Action Layer ──
// Covers controls that are intentionally shared or were previously placeholders.
const ZP_DATA={
  pages:[
    {name:'Dashboard',url:'index.html',key:'overview performance timeline'},
    {name:'My Profile',url:'profile.html',key:'account personal company preferences'},
    {name:'Onboarding & Overview',url:'onboarding.html',key:'agreement nda certification progress'},
    {name:'Training & Learning',url:'training.html',key:'courses certificates sessions'},
    {name:'Resources Center',url:'resources.html',key:'guides templates documents downloads'},
    {name:'Add Referral / Leads',url:'referral.html',key:'referrals companies contacts pipeline'},
    {name:'Activities',url:'activities.html',key:'activity notes calls meetings'},
    {name:'Earnings & Payouts',url:'earnings.html',key:'commission balance transactions'},
    {name:'Reports & Analytics',url:'reports.html',key:'analytics charts exports metrics'}
  ],
  activity:[
    ['Lead status updated','Beta Solutions moved to Negotiation','Today, 10:30 AM'],
    ['Quotation reviewed','Q-2024-0056 reviewed by Sarah Mitchell','Today, 9:15 AM'],
    ['Payment received','$5,000 received from Beta Solutions','Yesterday'],
    ['Training completed','Sales Process & Methodology','May 14, 2024']
  ],
  referrals:[
    ['TechNova Solutions','Qualified','$25,000 - $50,000'],
    ['BrightWave Industries','In Progress','$50,000 - $100,000'],
    ['CloudCore Systems','New','$20,000 - $30,000'],
    ['MarketEdge LLC','Converted','$10,000 - $20,000'],
    ['InnovaTech','Closed (Won)','$15,000 - $25,000']
  ],
  resources:[
    ['ZenPartner Program Overview','PDF','Partner Guide'],
    ['Commission Structure Guide','XLSX','Finance'],
    ['Solution Portfolio Presentation','PPT','Sales Deck'],
    ['Brand Guidelines','PDF','Marketing'],
    ['Product Demo Video','MP4','Video'],
    ['Proposal Template','DOCX','Template']
  ]
};

const ZP_ADMIN={
  pages:[
    {name:'Admin Dashboard',url:'admin.html',key:'overview kpi partners growth'},
    {name:'All Partners',url:'partners.html',key:'partners list status level kyc'},
    {name:'Onboarding Setup',url:'partners-onboarding.html',key:'onboarding steps progress invited'},
    {name:'Commission & Payouts',url:'admin-payouts.html',key:'commission payout requests history rates'},
    {name:'Tickets',url:'admin-tickets.html',key:'support tickets priority status'}
  ],
  activity:[
    ['New partner registered','Emily Wilson joined the program','Today, 9:20 AM'],
    ['Payout approved','$2,500 payout approved for James Anderson','Yesterday'],
    ['Ticket resolved','Ticket #T-1042 marked as resolved','Yesterday'],
    ['Onboarding completed','Michael Davis finished onboarding','May 14, 2024']
  ]
};

function downloadStaticFile(filename,content,type='text/plain'){
  const blob=new Blob([content],{type});
  const url=URL.createObjectURL(blob);
  const link=document.createElement('a');
  link.href=url; link.download=filename; document.body.appendChild(link); link.click(); link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),100);
}

function showStaticList(title,rows){
  const body=rows.map((r,i)=>`<div class="flex items-center gap-3 p-3 ${i?'border-t border-slate-100':''}"><span class="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 grid place-items-center font-bold">${i+1}</span><div class="flex-1 min-w-0"><div class="text-sm font-semibold">${r[0]}</div><div class="text-xs text-slate-500">${r.slice(1).join(' • ')}</div></div><button class="btn-ghost" onclick="showToast('Opened ${r[0].replace(/'/g,"\\'")}','info')">Open</button></div>`).join('');
  openModal({title,body:`<div class="border border-slate-100 rounded-xl overflow-hidden">${body}</div>`,actions:`<button class="btn-ghost" onclick="closeModal()">Close</button>`,size:'lg'});
}

function openActionMenu(anchor){
  document.querySelectorAll('.action-menu').forEach(m=>m.remove());
  const menu=document.createElement('div');
  menu.className='action-menu';
  menu.innerHTML=`
    <button data-menu-action="view"><span>◉</span> View details</button>
    <button data-menu-action="edit"><span>✎</span> Edit item</button>
    <button data-menu-action="duplicate"><span>⊕</span> Duplicate</button>
    <button data-menu-action="archive"><span>□</span> Archive</button>`;
  document.body.appendChild(menu);
  const r=anchor.getBoundingClientRect();
  const width=190;
  menu.style.left=Math.max(8,Math.min(window.innerWidth-width-8,r.right-width))+'px';
  menu.style.top=Math.min(window.innerHeight-menu.offsetHeight-8,r.bottom+6)+'px';
  menu.addEventListener('click',e=>{
    const btn=e.target.closest('[data-menu-action]'); if(!btn)return;
    const action=btn.dataset.menuAction;
    menu.remove();
    if(action==='archive'){
      openModal({title:'Archive item?',body:`<p class="text-sm text-slate-600">This demo item will be moved out of the active list. You can restore it later.</p>`,actions:`<button class="btn-ghost" onclick="closeModal()">Cancel</button><button class="btn-primary" onclick="closeModal();showToast('Item archived','success')">Archive</button>`,size:'sm'});
    }else if(action==='edit'){
      openModal({title:'Edit item',body:`<label class="block"><span class="text-xs font-semibold">Name</span><input value="Demo item" class="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2"/></label><label class="block mt-3"><span class="text-xs font-semibold">Notes</span><textarea rows="3" class="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2">Static demo details</textarea></label>`,actions:`<button class="btn-ghost" onclick="closeModal()">Cancel</button><button class="btn-primary" onclick="closeModal();showToast('Changes saved','success')">Save</button>`});
    }else{
      showToast(action==='duplicate'?'Item duplicated':'Details opened','success');
    }
  });
  setTimeout(()=>document.addEventListener('click',()=>menu.remove(),{once:true}),0);
}

function setupCommandSearch(pages){
  const input=document.getElementById('top-search-input');
  if(!input)return;
  let panel;
  function render(q=''){
    panel?.remove();
    const query=q.toLowerCase().trim();
    const hits=(pages||ZP_DATA.pages).filter(p=>!query||`${p.name} ${p.key}`.toLowerCase().includes(query)).slice(0,7);
    panel=document.createElement('div'); panel.className='command-panel'; panel.id='command-panel';
    panel.innerHTML=`<div class="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">Quick navigation</div>${hits.length?hits.map((p,i)=>`<a class="command-result ${i===0?'active':''}" href="${p.url}"><span class="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 grid place-items-center">↗</span><div><div class="text-sm font-semibold">${p.name}</div><div class="text-[11px] text-slate-500">${p.key}</div></div><span class="command-key">Enter</span></a>`).join(''):`<div class="empty-state"><div class="empty-state-icon">⌕</div><div class="font-semibold text-slate-700">No matching pages</div><div class="text-xs mt-1">Try “reports”, “referrals”, or “earnings”.</div></div>`}`;
    document.body.appendChild(panel);
  }
  input.addEventListener('focus',()=>render(input.value));
  input.addEventListener('input',()=>render(input.value));
  input.addEventListener('keydown',e=>{
    if(e.key==='Enter'){
      const first=panel?.querySelector('a'); if(first){e.preventDefault();location.href=first.href;}
    }
    if(e.key==='Escape'){panel?.remove();panel=null;input.blur();}
  });
  document.addEventListener('click',e=>{if(panel&&!panel.contains(e.target)&&e.target!==input){panel.remove();panel=null;}});
}

function wireUniversalActions(opts){
  setupCommandSearch(opts.variant==='admin'?ZP_ADMIN.pages:ZP_DATA.pages);

  // Useful default behavior for every placeholder anchor and unclaimed button.
  document.addEventListener('click',e=>{
    if(e.defaultPrevented)return;
    const control=e.target.closest('a,button');
    if(!control)return;
    if(control.id||control.dataset.dropdown||control.type==='submit'||control.type==='reset')return;
    const href=control.getAttribute('href');
    const label=control.textContent.replace(/\s+/g,' ').trim();
    const isPlaceholder=control.tagName==='A'&&(href==='#'||href===''||href===null);
    const isIconOnly=!label&&control.querySelector('svg');
    if(!isPlaceholder&&!isIconOnly)return;

    if(isPlaceholder)e.preventDefault();
    if(label.match(/View All Activities|Recent Activity/i)){showStaticList('Recent Activities',ZP_DATA.activity);return;}
    if(label.match(/View All Quotations|Quotation/i)){showStaticList('Quotations',[['Q-2024-0056','Website Redesign','$15,000'],['Q-2024-0063','Website Development','$10,000']]);return;}
    if(label.match(/View All|View Full Timeline/i)){
      const data=opts.variant==='admin'?ZP_ADMIN.activity:opts.active==='resources'?ZP_DATA.resources:opts.active==='referral'?ZP_DATA.referrals:ZP_DATA.activity;
      showStaticList(label.replace('View All','All')||'Details',data);return;
    }
    if(label.match(/Export|Download/i)){
      downloadStaticFile(`${opts.active}-export.csv`,`ZenPartner ${opts.title} Export\nGenerated,${new Date().toISOString()}\nStatus,Demo data`, 'text/csv');
      showToast('Export downloaded successfully','success');return;
    }
    if(label.match(/Contact|Call|Email|Live Chat/i)){
      openModal({title:opts.variant==='admin'?'Contact Support':'Contact Partner Support',body:`<div class="grid gap-3"><a href="mailto:support@zentegra.com" class="card p-3 text-sm font-semibold">Email • support@zentegra.com</a><a href="tel:+18885550198" class="card p-3 text-sm font-semibold">Call • +1 (888) 555-0198</a><div class="card p-3 text-sm"><b>Live chat</b><div class="text-xs text-slate-500">An agent is available now.</div></div></div>`,actions:`<button class="btn-ghost" onclick="closeModal()">Close</button><button class="btn-primary" onclick="closeModal();showToast('Starting live chat…','success')">Start Chat</button>`});return;
    }
    if(label.match(/Explore|Resources/i)){location.href='resources.html';return;}
    if(label.match(/Add Referral/i)){location.href='referral.html';return;}
    if(label.match(/Sign Out/i)){
      openModal({title:'Sign out?',body:`<p class="text-sm text-slate-600">Your local demo preferences are saved. You can return at any time.</p>`,actions:`<button class="btn-ghost" onclick="closeModal()">Stay signed in</button><button class="btn-primary" onclick="localStorage.removeItem('${STORE_KEY}');closeModal();showToast('Signed out from demo','success')">Sign Out</button>`,size:'sm'});return;
    }
    if(isIconOnly||label==='Actions'||label==='⋮'){openActionMenu(control);return;}
    if(label.match(/Review|Start|Continue|Open|Log Activity|Add Activity/i)){showToast(`${label} is ready in demo mode`,'success');return;}
    if(label){showToast(`${label} selected`,'info',1400);}
  });

  // Selects always provide immediate feedback unless handled by page-specific logic.
  document.querySelectorAll('select').forEach(select=>{
    select.addEventListener('change',()=>{
      if(select.value&&!select.value.match(/^All |^Select /))showToast(`Showing: ${select.value}`,'info',1100);
    });
  });

  // Icon-only kebab controls receive an action menu.
  document.querySelectorAll('button').forEach(btn=>{
    if(!btn.textContent.trim()&&btn.querySelectorAll('circle').length>=2){
      btn.setAttribute('aria-label','More actions');
    }
  });
}

// ── Bootstrap ──
function injectLayout(opts){
  currentActive = opts.active;
  const admin = opts.variant==='admin';
  const sidebarEl=document.getElementById('app-sidebar');
  const topbarEl=document.getElementById('app-topbar');
  const mobileEl=document.getElementById('app-mobile-nav');
  if(sidebarEl) sidebarEl.innerHTML=admin?buildAdminSidebar(opts.active):buildSidebar(opts.active);
  if(topbarEl) topbarEl.innerHTML=buildTopbar(opts.title, opts.breadcrumb, opts.searchPlaceholder||'Search anything...', opts.extraActions||'', admin);
  if(mobileEl) mobileEl.innerHTML=admin?buildAdminMobile(opts.active):buildMobile(opts.active);
  // ensure containers exist
  if(!document.getElementById('toast-container')){
    const c=document.createElement('div'); c.id='toast-container'; document.body.appendChild(c);
  }
  if(!document.getElementById('app-modal')){
    const m=document.createElement('div'); m.id='app-modal';
    m.innerHTML=`<div class="modal-backdrop"></div><div class="modal-panel"><div class="modal-head"><h3 class="text-sm font-bold"></h3><button class="w-8 h-8 grid place-items-center rounded-xl hover:bg-slate-100">✕</button></div><div class="modal-body"></div><div class="modal-actions"></div></div>`;
    document.body.appendChild(m);
    m.querySelector('.modal-backdrop').onclick=closeModal;
    m.querySelector('.modal-head button').onclick=closeModal;
  }
  // Defer wiring to next tick so DOM is ready
  setTimeout(()=>{
    try{ wireGlobalUI(); }catch(e){ console.error('global UI error',e); }
    // page-specific
    const map={
      dashboard:initDashboard,
      onboarding:initOnboarding,
      profile:initProfile,
      training:initTraining,
      resources:initResources,
      referral:initReferral,
      leads:initLeads,
      activities:initActivities,
      earnings:initEarnings,
      reports:initReports
    };
    const adminMap={
      dashboard:initAdminDashboard,
      partners:initAdminPartners,
      onboarding:initAdminOnboarding,
      payouts:initAdminPayouts,
      tickets:initAdminTickets,
      partnerView:initAdminPartnerView
    };
    const fn=(admin?adminMap:map)[opts.active];
    try{ if(fn) fn(); }catch(e){ console.error('init error',e); }
    try{ wireUniversalActions(opts); }catch(e){ console.error('universal action error',e); }

    // restore state: profile strength etc.
    // responsive helper: adjust font for big screens
    const ro = () => {
      const w=window.innerWidth;
      document.documentElement.style.setProperty('--vw', w+'px');
      // auto-adjust sidebar scroll if height small
      if(window.innerHeight<640){
        document.documentElement.classList.add('compact');
      } else {
        document.documentElement.classList.remove('compact');
      }
    };
    ro();
    window.addEventListener('resize', debounce(ro,120));

    // welcome toast on first load per session
    if(!safeSessionGet('zp_welcomed')){
      safeSessionSet('zp_welcomed','1');
      setTimeout(()=>showToast(admin?`Welcome back, Admin! 🛡 — ${opts.title} loaded`:`Welcome back, James! 👋 — ${opts.title} loaded`,'info',2200), 500);
    }
  }, 30);
}

// expose
window.injectLayout=injectLayout;
