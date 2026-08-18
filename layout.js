// ═══════════════════════════════════════════════════════════════════════════
// ZenPartner — Layout Injector + Interactive Engine (Bootstrap 5.3)
// SINGLE SOURCE: sidebar / topbar / mobile nav + all JS interactions.
// Pages only need: <div id="app-sidebar"></div> <div id="app-topbar"></div>
// <div id="app-mobile-nav"></div> <script src="layout.js"></script>
// <script>injectLayout({active:'dashboard', title:'...', ...})</script>
// ═══════════════════════════════════════════════════════════════════════════

const ADMIN_AVATAR='https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&auto=format&fit=crop&q=60';
const USER_AVATAR='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60';
const STORE_KEY='zp_state_v3';
let currentActive='dashboard';

/* ── safe storage ── */
function safeStoreGet(k){try{return localStorage.getItem(k)}catch(e){return null}}
function safeStoreSet(k,v){try{localStorage.setItem(k,v)}catch(e){}}
function safeSessionGet(k){try{return sessionStorage.getItem(k)}catch(e){return null}}
function safeSessionSet(k,v){try{sessionStorage.setItem(k,v)}catch(e){}}
function getStore(){try{return JSON.parse(localStorage.getItem(STORE_KEY)||'{}')}catch(e){return{}}}
function setStore(patch){const s={...getStore(),...patch};safeStoreSet(STORE_KEY,JSON.stringify(s));return s}
function debounce(fn,ms){let t;return(...a)=>{clearTimeout(t);t=setTimeout(()=>fn(...a),ms)}}

/* ═══════════════ Toast ═══════════════ */
function showToast(msg,type='info',dur=2800){
  let c=document.getElementById('zp-toasts');
  if(!c){c=document.createElement('div');c.id='zp-toasts';document.body.appendChild(c)}
  const el=document.createElement('div');
  el.className=`zp-toast ${type}`;
  const icon=type==='success'?'✓':type==='error'?'⚠':'ℹ';
  el.innerHTML=`<span class="icon">${icon}</span><span class="flex-grow-1">${msg}</span><button class="close" aria-label="Close">✕</button>`;
  c.appendChild(el);
  const dismiss=()=>{el.classList.add('leaving');setTimeout(()=>el.remove(),180)};
  el.querySelector('.close').onclick=dismiss;
  let t=setTimeout(dismiss,dur);
  el.addEventListener('mouseenter',()=>clearTimeout(t));
  el.addEventListener('mouseleave',()=>{t=setTimeout(dismiss,900)});
}

/* ═══════════════ Modal (Bootstrap) ═══════════════ */
function _ensureModal(){
  let m=document.getElementById('zp-modal');
  if(m)return m;
  m=document.createElement('div');
  m.id='zp-modal';m.className='modal fade zp-modal';m.tabIndex=-1;m.setAttribute('aria-hidden','true');
  m.innerHTML=`
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title"></h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body"></div>
        <div class="modal-footer"></div>
      </div>
    </div>`;
  document.body.appendChild(m);
  m.addEventListener('hidden.bs.modal',()=>{document.body.style.overflow=''});
  return m;
}
function openModal({title,body,actions,size='md'}){
  const m=_ensureModal();
  const dlg=m.querySelector('.modal-dialog');
  dlg.className='modal-dialog modal-dialog-centered modal-dialog-scrollable '+
    (size==='lg'?'modal-lg':size==='sm'?'modal-sm':'');
  m.querySelector('.modal-title').textContent=title||'';
  m.querySelector('.modal-body').innerHTML=body||'';
  m.querySelector('.modal-footer').innerHTML=actions||`<button class="btn btn-light" data-bs-dismiss="modal">Close</button>`;
  document.body.style.overflow='hidden';
  if(window.bootstrap){bootstrap.Modal.getOrCreateInstance(m).show()}
  else{m.classList.add('show');m.style.display='block';document.body.classList.add('modal-open')}
  return m;
}
function closeModal(){
  const m=document.getElementById('zp-modal');
  if(m&&window.bootstrap){const inst=bootstrap.Modal.getInstance(m);if(inst)inst.hide();else m.classList.remove('show')}
  else if(m){m.classList.remove('show');m.style.display='none';document.body.classList.remove('modal-open')}
  document.body.style.overflow='';
}
window.closeModal=closeModal;window.showToast=showToast;window.openModal=openModal;

function downloadStaticFile(filename,content,type='text/plain'){
  const blob=new Blob([content],{type});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),100);
}
function showStaticList(title,rows){
  const body=rows.map((r,i)=>`<div class="d-flex align-items-center gap-3 p-3 ${i?'border-top':''}"><span class="zp-empty-icon" style="width:32px;height:32px;font-size:.85rem">${i+1}</span><div class="flex-grow-1 min-w-0"><div class="fw-semibold small">${r[0]}</div><div class="text-muted" style="font-size:.72rem">${r.slice(1).join(' • ')}</div></div><button class="btn btn-sm btn-outline-secondary" onclick="showToast('Opened ${r[0].replace(/'/g,"\\'")}','info')">Open</button></div>`).join('');
  openModal({title,body:`<div class="border rounded-3 overflow-hidden">${body}</div>`,size:'lg'});
}
function openActionMenu(anchor){
  document.querySelectorAll('.action-menu').forEach(m=>m.remove());
  const menu=document.createElement('div');
  menu.className='action-menu';
  menu.innerHTML=`<button data-menu-action="view"><i class="bi bi-eye"></i>View details</button><button data-menu-action="edit"><i class="bi bi-pencil"></i>Edit item</button><button data-menu-action="duplicate"><i class="bi bi-copy"></i>Duplicate</button><button data-menu-action="archive"><i class="bi bi-archive"></i>Archive</button>`;
  document.body.appendChild(menu);
  const r=anchor.getBoundingClientRect(),width=200;
  menu.style.left=Math.max(8,Math.min(window.innerWidth-width-8,r.right-width))+'px';
  menu.style.top=Math.min(window.innerHeight-menu.offsetHeight-8,r.bottom+6)+'px';
  menu.addEventListener('click',e=>{
    const btn=e.target.closest('[data-menu-action]');if(!btn)return;
    const action=btn.dataset.menuAction;menu.remove();
    if(action==='archive'){openModal({title:'Archive item?',body:`<p class="small text-muted">This demo item will be moved out of the active list.</p>`,actions:`<button class="btn btn-light" data-bs-dismiss="modal">Cancel</button><button class="btn btn-primary" onclick="closeModal();showToast('Item archived','success')">Archive</button>`,size:'sm'})}
    else if(action==='edit'){openModal({title:'Edit item',body:`<label class="form-label">Name</label><input class="form-control" value="Demo item"><label class="form-label mt-3">Notes</label><textarea class="form-control" rows="3">Static demo details</textarea>`,actions:`<button class="btn btn-light" data-bs-dismiss="modal">Cancel</button><button class="btn btn-primary" onclick="closeModal();showToast('Changes saved','success')">Save</button>`})}
    else{showToast(action==='duplicate'?'Item duplicated':'Details opened','success')}
  });
  setTimeout(()=>document.addEventListener('click',()=>menu.remove(),{once:true}),0);
}

/* ═══════════════ Sidebar builders ═══════════════ */
function _navLink(id,label,href,icon,active,badge=''){
  const on=active===id||(active==='leads'&&id==='referral');
  return `<a href="${href}" class="zp-nav-link ${on?'active':''}"><i class="bi ${icon}"></i><span>${label}</span>${badge}${on?'<i class="bi bi-chevron-right ms-auto" style="font-size:.8rem;opacity:.6"></i>':''}</a>`;
}
function buildSidebar(active){
  const nav=`
    ${_navLink('dashboard','Dashboard','index.html','bi-grid-1x2',active, active==='dashboard'?'<span class="zp-nav-badge"></span>':'')}
    ${_navLink('profile','My Profile','profile.html','bi-person',active)}
    ${_navLink('onboarding','Onboarding & Overview','onboarding.html','bi-clipboard2-check',active,'<span class="badge rounded-pill bg-success ms-auto" style="font-size:.6rem"><i class="bi bi-check2"></i></span>')}
    ${_navLink('training','Training & Learning','training.html','bi-mortarboard',active)}
    ${_navLink('resources','Resources Center','resources.html','bi-folder2-open',active)}
    ${_navLink('referral','Add Referral / Leads','referral.html','bi-people',active)}
    ${_navLink('earnings','Earnings & Payouts','earnings.html','bi-wallet2',active)}
    ${_navLink('reports','Reports & Analytics','reports.html','bi-graph-up-arrow',active)}`;
  return `
  <aside class="zp-sidebar d-none d-lg-flex">
    <div class="zp-brand">
      <a href="index.html" class="zp-brand-logo">Z</a>
      <div class="zp-brand-text"><div class="zp-brand-title">ZENPARTNER</div><div class="zp-brand-sub">Partner Portal</div></div>
    </div>
    <div class="zp-user-card d-flex align-items-center gap-2">
      <img src="${USER_AVATAR}" class="avatar" alt="James Anderson">
      <div class="flex-grow-1 min-w-0">
        <div class="fw-semibold" style="font-size:.76rem">James Anderson</div>
        <div class="text-warning" style="font-size:.66rem"><i class="bi bi-star-fill"></i> Gold Partner</div>
      </div>
    </div>
    <div class="px-3 mb-2" style="font-size:.66rem;color:rgba(255,255,255,.5)">Partner ID: ZP-2024-0015</div>
    <div class="px-3 mb-2">
      <div class="d-flex justify-content-between" style="font-size:.68rem"><span style="color:rgba(255,255,255,.7)">Profile Strength</span><span class="text-success">90%</span></div>
      <div class="zp-progress mt-1"><span style="width:90%"></span></div>
    </div>
    <nav class="zp-nav flex-grow-1">${nav}</nav>
    <div class="zp-sidebar-foot">
      <a href="admin.html" class="zp-nav-link"><i class="bi bi-shield-lock"></i><span>Admin Panel</span></a>
      <a href="#" class="zp-nav-link" data-signout><i class="bi bi-box-arrow-right"></i><span>Sign Out</span></a>
    </div>
  </aside>

  <!-- Mobile offcanvas -->
  <div class="offcanvas offcanvas-start zp-offcanvas" tabindex="-1" id="zpOffcanvas">
    <div class="offcanvas-header">
      <div class="d-flex align-items-center gap-2">
        <div class="zp-brand-logo" style="width:34px;height:34px">Z</div>
        <div><div class="zp-brand-title">ZENPARTNER</div><div class="zp-brand-sub">Partner Portal</div></div>
      </div>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body p-2">
      <nav class="zp-nav">${nav}</nav>
      <div class="zp-user-card d-flex align-items-center gap-2 mt-3">
        <img src="${USER_AVATAR}" class="avatar" alt="">
        <div class="flex-grow-1"><div class="fw-semibold" style="font-size:.8rem">James Anderson</div><div class="text-warning" style="font-size:.7rem"><i class="bi bi-star-fill"></i> Gold Partner</div></div>
      </div>
      <a href="admin.html" class="btn btn-outline-light w-100 mt-2 btn-sm"><i class="bi bi-shield-lock me-1"></i>Admin Panel</a>
      <a href="#" class="btn btn-primary w-100 mt-2 btn-sm" data-signout><i class="bi bi-box-arrow-right me-1"></i>Sign Out</a>
    </div>
  </div>`;
}

function buildAdminSidebar(active){
  const sec=l=>`<div class="zp-nav-section">${l}</div>`;
  const a=(id,label,href,icon)=>_navLink(id,label,href,icon,active);
  const nav=`
    ${sec('Overview')}
    ${a('dashboard','Dashboard','admin.html','bi-grid')}
    ${a('partnersOverview','Partners Overview','partners.html','bi-speedometer2')}
    ${a('partners','All Partners','partners.html','bi-people')}
    ${a('onboarding','Partners Onboarding','partners-onboarding.html','bi-clipboard2-check')}
    ${sec('Partner Management')}
    ${a('partnerView','Partner Details','partner-view.html','bi-person-badge')}
    ${a('tasks','Tasks & Assignments','#','bi-list-task')}
    ${a('followups','Follow Ups','#','bi-chat-dots')}
    ${a('kyc','KYC & Verification','#','bi-shield-check')}
    ${a('performance','Performance Review','#','bi-trophy')}
    ${sec('Reports & Analytics')}
    ${a('leads','Leads & Projects','leads.html','bi-bullseye')}
    ${a('payouts','Earnings & Payouts','admin-payouts.html','bi-cash-stack')}
    ${a('reports','Reports & Analytics','reports.html','bi-bar-chart')}
    ${a('tickets','Support Tickets','admin-tickets.html','bi-life-preserver')}
    ${sec('Configuration')}
    ${a('users','Users & Roles','#','bi-person-gear')}
    ${a('templates','Email Templates','#','bi-envelope-paper')}
    ${a('settings','Settings','#','bi-gear')}
    ${a('audit','Audit Logs','#','bi-shield-lock')}`;
  return `
  <aside class="zp-sidebar d-none d-lg-flex">
    <div class="zp-brand">
      <a href="admin.html" class="zp-brand-logo">Z</a>
      <div class="zp-brand-text"><div class="zp-brand-title">ZENPARTNER</div><div class="zp-brand-sub">Admin Panel</div></div>
    </div>
    <div class="zp-user-card d-flex align-items-center gap-2">
      <img src="${ADMIN_AVATAR}" class="avatar" alt="Admin User">
      <div class="flex-grow-1 min-w-0">
        <div class="fw-semibold" style="font-size:.76rem">Admin User</div>
        <div style="font-size:.66rem;color:#a5b4fc"><i class="bi bi-shield-fill"></i> Super Administrator</div>
      </div>
    </div>
    <div class="px-3 mb-2" style="font-size:.66rem;color:rgba(255,255,255,.5)">admin@zentegra.com</div>
    <div class="px-3 mb-2">
      <div class="d-flex justify-content-between" style="font-size:.68rem"><span style="color:rgba(255,255,255,.7)">Panel Coverage</span><span style="color:#a5b4fc">100%</span></div>
      <div class="zp-progress mt-1"><span style="width:100%;background:linear-gradient(90deg,#6366f1,#38bdf8)"></span></div>
    </div>
    <nav class="zp-nav flex-grow-1" style="overflow-y:auto">${nav}</nav>
    <div class="zp-sidebar-foot">
      <div class="zp-user-card mb-1">
        <div class="fw-semibold" style="font-size:.72rem">Need Help?</div>
        <div style="font-size:.64rem;color:rgba(255,255,255,.5)">Our support team is here for you.</div>
        <a href="mailto:admin@zentegra.com" class="d-block small text-white-50 text-truncate mt-1">admin@zentegra.com</a>
        <a href="tel:+18885550198" class="d-block small text-white-50">+1 (888) 555-0198</a>
      </div>
      <a href="index.html" class="zp-nav-link"><i class="bi bi-house"></i><span>View Partner Portal</span></a>
      <a href="#" class="zp-nav-link" data-signout><i class="bi bi-box-arrow-right"></i><span>Sign Out</span></a>
    </div>
  </aside>

  <div class="offcanvas offcanvas-start zp-offcanvas" tabindex="-1" id="zpOffcanvas">
    <div class="offcanvas-header">
      <div class="d-flex align-items-center gap-2">
        <div class="zp-brand-logo" style="width:34px;height:34px">Z</div>
        <div><div class="zp-brand-title">ZENPARTNER</div><div class="zp-brand-sub">Admin Panel</div></div>
      </div>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body p-2">
      <nav class="zp-nav">${nav}</nav>
      <a href="index.html" class="btn btn-outline-light w-100 mt-3 btn-sm"><i class="bi bi-house me-1"></i>Partner Portal</a>
      <a href="#" class="btn btn-primary w-100 mt-2 btn-sm" data-signout><i class="bi bi-box-arrow-right me-1"></i>Sign Out</a>
    </div>
  </div>`;
}

/* ═══════════════ Topbar builder ═══════════════ */
function buildTopbar(title,breadcrumb,searchPlaceholder,extraActions,admin,homeUrl){
  const home=homeUrl||(admin?'admin.html':'index.html');
  const dateChip=admin?`
    <button class="btn btn-sm btn-outline-secondary d-none d-sm-inline-flex align-items-center gap-2" id="admin-date-chip">
      <i class="bi bi-calendar3"></i> May 01 – May 15, 2024 <i class="bi bi-chevron-down" style="font-size:.7rem"></i>
    </button>`:'';
  const notifItems=admin?`
      <div class="dropdown-item bg-light rounded"><div class="fw-semibold" style="font-size:.76rem">New partner registered — Emily Wilson</div><div class="text-muted" style="font-size:.7rem">2 hours ago</div></div>
      <div class="dropdown-item"><i class="bi bi-cash-coin text-warning"></i><div><div class="fw-medium" style="font-size:.76rem">Payout of $2,500 pending approval</div><div class="text-muted" style="font-size:.7rem">Yesterday</div></div></div>
      <div class="dropdown-item"><i class="bi bi-exclamation-circle text-danger"></i><div><div class="fw-medium" style="font-size:.76rem">Support ticket #T-1042 escalated</div><div class="text-muted" style="font-size:.7rem">2 days ago</div></div></div>`:`
      <div class="dropdown-item bg-light rounded"><i class="bi bi-patch-check text-primary"></i><div><div class="fw-semibold" style="font-size:.76rem">Training completed — Sales Process</div><div class="text-muted" style="font-size:.7rem">2 hours ago</div></div></div>
      <div class="dropdown-item"><i class="bi bi-cash-coin text-success"></i><div><div class="fw-medium" style="font-size:.76rem">Payout of $2,500 completed</div><div class="text-muted" style="font-size:.7rem">Yesterday</div></div></div>
      <div class="dropdown-item"><i class="bi bi-graph-up-arrow text-info"></i><div><div class="fw-medium" style="font-size:.76rem">New referral qualified</div><div class="text-muted" style="font-size:.7rem">2 days ago</div></div></div>`;
  const profName=admin?'Admin User':'James Anderson';
  const profRole=admin?'Super Administrator':'Gold Partner';
  const profRoleCls=admin?'text-primary':'text-warning-emphasis';
  const profAvatar=admin?ADMIN_AVATAR:USER_AVATAR;
  return `
  <header class="zp-topbar">
    <nav class="navbar">
      <div class="d-flex align-items-center gap-2 me-2">
        <button id="nav-toggle" class="zp-burger" aria-label="Toggle navigation"><i class="bi bi-list"></i></button>
        <div class="d-none d-sm-block min-w-0">
          <div class="zp-page-title text-truncate">${title}</div>
          <div class="zp-breadcrumb text-truncate"><a href="${home}" class="text-decoration-none text-muted">Home</a> <span class="mx-1">›</span> <span class="text-secondary fw-medium">${breadcrumb}</span></div>
        </div>
      </div>

      <div class="zp-top-search d-none d-md-flex me-auto ms-2 ms-lg-4">
        <i class="bi bi-search text-muted"></i>
        <input id="top-search-input" placeholder="${searchPlaceholder}" autocomplete="off">
        <span class="zp-kbd d-none d-xl-inline">⌘K</span>
      </div>
      <button id="mobile-search-toggle" class="zp-burger d-md-none ms-auto" aria-label="Search"><i class="bi bi-search"></i></button>

      <div class="d-flex align-items-center gap-1 ms-2">
        ${dateChip}
        <div class="dropdown zp-dropdown">
          <button class="zp-icon-btn" data-bs-toggle="dropdown" aria-expanded="false"><i class="bi bi-bell"></i><span class="zp-badge-dot">5</span></button>
          <div class="dropdown-menu dropdown-menu-end">
            <div class="d-flex align-items-center justify-content-between px-2 py-1"><span class="dropdown-header p-0">Notifications</span><span class="text-primary cursor-pointer mark-read" style="font-size:.7rem;font-weight:700">Mark all read</span></div>
            <div class="mt-1">${notifItems}</div>
            <a href="${admin?'admin-tickets.html':'activities.html'}" class="dropdown-item text-center text-primary fw-semibold" style="font-size:.76rem">View all notifications</a>
          </div>
        </div>
        <div class="dropdown zp-dropdown d-none d-sm-block">
          <button class="zp-icon-btn" data-bs-toggle="dropdown" aria-expanded="false"><i class="bi bi-envelope"></i><span class="zp-badge-dot">3</span></button>
          <div class="dropdown-menu dropdown-menu-end">
            <span class="dropdown-header">Messages</span>
            <div class="dropdown-item"><img src="${USER_AVATAR}" style="width:32px;height:32px;border-radius:50%"><div><div class="fw-semibold" style="font-size:.76rem">Sarah Mitchell</div><div class="text-muted text-truncate" style="font-size:.7rem">Reviewed your proposal!</div></div></div>
            <div class="dropdown-item"><img src="${USER_AVATAR}" style="width:32px;height:32px;border-radius:50%"><div><div class="fw-semibold" style="font-size:.76rem">Michael Davis</div><div class="text-muted text-truncate" style="font-size:.7rem">Follow-up next week?</div></div></div>
          </div>
        </div>
        <div class="dropdown zp-dropdown">
          <button class="d-flex align-items-center gap-2 border-0 bg-transparent ps-1" data-bs-toggle="dropdown" aria-expanded="false">
            <img src="${profAvatar}" class="zp-avatar" alt="">
            <div class="d-none d-xl-block text-start"><div class="fw-semibold" style="font-size:.74rem">${profName} <i class="bi bi-chevron-down" style="font-size:.6rem"></i></div><div class="${profRoleCls}" style="font-size:.66rem;font-weight:600">${profRole}</div></div>
          </button>
          <div class="dropdown-menu dropdown-menu-end" style="min-width:230px">
            <div class="dropdown-item"><img src="${profAvatar}" style="width:38px;height:38px;border-radius:50%"><div><div class="fw-semibold" style="font-size:.8rem">${profName}</div><div class="text-muted" style="font-size:.7rem">${admin?'admin@zentegra.com':'james@zentegra.com'}</div><div class="${profRoleCls}" style="font-size:.7rem;font-weight:600">${profRole}</div></div></div>
            <div class="dropdown-divider"></div>
            ${admin?'<a href="#" class="dropdown-item">Admin Profile</a><a href="#" class="dropdown-item">System Settings</a><a href="index.html" class="dropdown-item">Partner Portal</a>':'<a href="profile.html" class="dropdown-item">My Profile</a><a href="#" class="dropdown-item">Settings</a>'}
            <div class="dropdown-divider"></div>
            <a href="#" class="dropdown-item text-danger" data-signout>Sign Out</a>
          </div>
        </div>
      </div>
    </nav>
    <div id="mobile-search-bar" class="d-none px-3 pb-2 d-md-none">
      <div class="zp-top-search w-100"><i class="bi bi-search text-muted"></i><input placeholder="${searchPlaceholder}"><button id="mobile-search-close" class="border-0 bg-transparent text-muted">✕</button></div>
    </div>
    ${extraActions||''}
  </header>`;
}

/* ═══════════════ Mobile bottom nav ═══════════════ */
function _bottomLink(id,href,icon,label,active){
  const on=active===id||(active==='leads'&&id==='referral')||(active==='partnerView'&&id==='partners');
  return `<a href="${href}" class="${on?'active':''}"><i class="bi ${icon}"></i><span>${label}</span></a>`;
}
function buildMobile(active){
  return `<nav class="zp-bottomnav">
    ${_bottomLink('dashboard','index.html','bi-grid-1x2','Dashboard',active)}
    ${_bottomLink('referral','referral.html','bi-people','Referrals',active)}
    ${_bottomLink('earnings','earnings.html','bi-wallet2','Earnings',active)}
    ${_bottomLink('reports','reports.html','bi-graph-up-arrow','Reports',active)}
  </nav>`;
}
function buildAdminMobile(active){
  return `<nav class="zp-bottomnav">
    ${_bottomLink('dashboard','admin.html','bi-grid','Dashboard',active)}
    ${_bottomLink('partners','partners.html','bi-people','Partners',active)}
    ${_bottomLink('onboarding','partners-onboarding.html','bi-clipboard2-check','Onboarding',active)}
    ${_bottomLink('payouts','admin-payouts.html','bi-cash-stack','Payouts',active)}
    ${_bottomLink('tickets','admin-tickets.html','bi-life-preserver','Tickets',active)}
  </nav>`;
}

/* ═══════════════ Global UI wiring ═══════════════ */
function wireGlobalUI(){
  const burger=document.getElementById('nav-toggle');
  function toggleNavigation(){
    if(window.innerWidth<992){
      const oc=document.getElementById('zpOffcanvas');
      if(oc&&window.bootstrap){bootstrap.Offcanvas.getOrCreateInstance(oc).show()}
      return;
    }
    document.body.classList.toggle('zp-collapsed');
    safeStoreSet('zp_collapsed',document.body.classList.contains('zp-collapsed')?'1':'0');
  }
  burger?.addEventListener('click',toggleNavigation);
  if(window.innerWidth>=992&&safeStoreGet('zp_collapsed')==='1')document.body.classList.add('zp-collapsed');

  // close offcanvas on in-drawer nav
  document.getElementById('zpOffcanvas')?.querySelectorAll('.zp-nav-link').forEach(a=>{
    a.addEventListener('click',()=>{const oc=document.getElementById('zpOffcanvas');if(oc&&window.bootstrap){const i=bootstrap.Offcanvas.getInstance(oc);i&&i.hide()}});
  });

  // mobile search
  const mToggle=document.getElementById('mobile-search-toggle');
  const mBar=document.getElementById('mobile-search-bar');
  const mClose=document.getElementById('mobile-search-close');
  mToggle?.addEventListener('click',()=>{mBar.classList.toggle('d-none');if(!mBar.classList.contains('d-none'))mBar.querySelector('input')?.focus()});
  mClose?.addEventListener('click',()=>mBar.classList.add('d-none'));

  // mark all read
  document.querySelectorAll('.mark-read').forEach(mk=>{
    mk.addEventListener('click',e=>{
      e.stopPropagation();
      mk.closest('.dropdown-menu')?.querySelectorAll('.zp-badge-dot').forEach(()=>{});
      document.querySelectorAll('.zp-badge-dot').forEach(d=>d.style.display='none');
      showToast('All notifications marked as read','success');
    });
  });

  // sign out
  document.querySelectorAll('[data-signout]').forEach(b=>{
    b.addEventListener('click',e=>{e.preventDefault();openModal({title:'Sign out?',body:`<p class="small text-muted mb-0">Your local demo preferences are saved. You can return at any time.</p>`,actions:`<button class="btn btn-light" data-bs-dismiss="modal">Stay signed in</button><button class="btn btn-primary" onclick="localStorage.removeItem('${STORE_KEY}');closeModal();showToast('Signed out from demo','success')">Sign Out</button>`,size:'sm'})});
  });

  // Ctrl/Cmd+K + "/" focus search
  document.addEventListener('keydown',e=>{
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();const i=document.getElementById('top-search-input');if(i){i.focus();i.select()}}
    if(e.key==='/'&&!/input|textarea|select/i.test(document.activeElement.tagName)){e.preventDefault();const i=document.getElementById('top-search-input');i?.focus()}
  });

  // generic live search
  const top=document.getElementById('top-search-input');
  top?.addEventListener('input',debounce(()=>{
    const q=top.value.toLowerCase().trim();
    document.querySelectorAll('.zp-card,.zp-stat,tr').forEach(el=>{
      if(!q){el.style.display='';return}
      const hit=el.textContent.toLowerCase().includes(q);
      if(el.classList.contains('zp-card')||el.classList.contains('zp-stat')||el.tagName==='TR')el.style.display=hit?'':'none';
    });
  },180));

  // tooltips
  if(window.bootstrap){document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el=>new bootstrap.Tooltip(el))}
}

/* ═══════════════ Command search ═══════════════ */
function setupCommandSearch(pages){
  const input=document.getElementById('top-search-input');
  if(!input)return;
  let panel;
  function render(q=''){
    panel?.remove();
    const query=q.toLowerCase().trim();
    const hits=pages.filter(p=>!query||`${p.name} ${p.key}`.toLowerCase().includes(query)).slice(0,7);
    panel=document.createElement('div');panel.className='command-panel';panel.id='command-panel';
    panel.innerHTML=`<div class="px-3 py-2 text-uppercase" style="font-size:.66rem;font-weight:700;letter-spacing:.08em;color:#94a3b8">Quick navigation</div>`+
      (hits.length?hits.map((p,i)=>`<a class="command-result ${i===0?'active':''}" href="${p.url}"><span class="zp-empty-icon" style="width:32px;height:32px;font-size:.85rem"><i class="bi bi-arrow-up-right"></i></span><div><div class="fw-semibold" style="font-size:.82rem">${p.name}</div><div class="text-muted" style="font-size:.7rem">${p.key}</div></div><span class="command-key">Enter</span></a>`).join('')
      :`<div class="zp-empty"><div class="zp-empty-icon"><i class="bi bi-search"></i></div><div class="fw-semibold text-secondary">No matching pages</div><div class="small mt-1">Try “reports”, “referrals”, or “earnings”.</div></div>`);
    document.body.appendChild(panel);
  }
  input.addEventListener('focus',()=>render(input.value));
  input.addEventListener('input',()=>render(input.value));
  input.addEventListener('keydown',e=>{
    if(e.key==='Enter'){const f=panel?.querySelector('a');if(f){e.preventDefault();location.href=f.href}}
    if(e.key==='Escape'){panel?.remove();panel=null;input.blur()}
  });
  document.addEventListener('click',e=>{if(panel&&!panel.contains(e.target)&&e.target!==input){panel.remove();panel=null}});
}

/* ═══════════════ Static data ═══════════════ */
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
  activity:[['Lead status updated','Beta Solutions moved to Negotiation','Today, 10:30 AM'],['Quotation reviewed','Q-2024-0056 reviewed by Sarah Mitchell','Today, 9:15 AM'],['Payment received','$5,000 received from Beta Solutions','Yesterday'],['Training completed','Sales Process & Methodology','May 14, 2024']]
};
const ZP_ADMIN={
  pages:[
    {name:'Admin Dashboard',url:'admin.html',key:'overview kpi partners growth'},
    {name:'All Partners',url:'partners.html',key:'partners list status level kyc'},
    {name:'Partner Details',url:'partner-view.html',key:'partner profile kpi onboarding performance'},
    {name:'Onboarding Setup',url:'partners-onboarding.html',key:'onboarding steps progress invited'},
    {name:'Commission & Payouts',url:'admin-payouts.html',key:'commission payout requests history'},
    {name:'Tickets',url:'admin-tickets.html',key:'support tickets priority status'}
  ],
  activity:[['New partner registered','Emily Wilson joined the program','Today, 9:20 AM'],['Payout approved','$2,500 payout approved for James Anderson','Yesterday'],['Ticket resolved','Ticket #T-1042 marked as resolved','Yesterday'],['Onboarding completed','Michael Davis finished onboarding','May 14, 2024']]
};

function wireUniversalActions(opts){
  setupCommandSearch(opts.variant==='admin'?ZP_ADMIN.pages:ZP_DATA.pages);
  document.addEventListener('click',e=>{
    if(e.defaultPrevented)return;
    const control=e.target.closest('a,button');
    if(!control)return;
    if(control.id||control.dataset.bsToggle||control.dataset.dropdown||control.type==='submit'||control.type==='reset')return;
    const href=control.getAttribute('href');
    const label=control.textContent.replace(/\s+/g,' ').trim();
    const isPlaceholder=control.tagName==='A'&&(href==='#'||href===''||href===null);
    const isIconOnly=!label&&control.querySelector('i');
    if(!isPlaceholder&&!isIconOnly)return;
    if(isPlaceholder)e.preventDefault();
    if(label.match(/View All Activities|Recent Activity/i)){showStaticList('Recent Activities',(opts.variant==='admin'?ZP_ADMIN:ZP_DATA).activity);return}
    if(label.match(/View All|View Full Timeline/i)){showStaticList(label.replace('View All','All')||'Details',(opts.variant==='admin'?ZP_ADMIN:ZP_DATA).activity);return}
    if(label.match(/Export|Download/i)){downloadStaticFile(`${opts.active}-export.csv`,`ZenPartner ${opts.title} Export\nGenerated,${new Date().toISOString()}\nStatus,Demo data`,'text/csv');showToast('Export downloaded successfully','success');return}
    if(label.match(/Contact|Call|Email|Live Chat/i)){openModal({title:'Contact Support',body:`<div class="d-grid gap-2"><a href="mailto:support@zentegra.com" class="zp-card p-3 small fw-semibold"><i class="bi bi-envelope me-2"></i>Email • support@zentegra.com</a><a href="tel:+18885550198" class="zp-card p-3 small fw-semibold"><i class="bi bi-telephone me-2"></i>Call • +1 (888) 555-0198</a><div class="zp-card p-3 small"><b>Live chat</b><div class="text-muted" style="font-size:.72rem">An agent is available now.</div></div></div>`,actions:`<button class="btn btn-light" data-bs-dismiss="modal">Close</button><button class="btn btn-primary" onclick="closeModal();showToast('Starting live chat…','success')">Start Chat</button>`});return}
    if(label.match(/Explore|Resources/i)){location.href='resources.html';return}
    if(label.match(/Add Referral/i)){location.href='referral.html';return}
    if(isIconOnly||label==='Actions'||label==='⋮'){openActionMenu(control);return}
    if(label.match(/Review|Start|Continue|Open|Log Activity|Add Activity/i)){showToast(`${label} is ready in demo mode`,'success');return}
    if(label){showToast(`${label} selected`,'info',1400)}
  });
}

/* ═══════════════ Page initializers ═══════════════ */
function _findByText(sel,text){return[...document.querySelectorAll(sel)].find(b=>b.textContent.includes(text))}

function initDashboard(){
  document.querySelector('.dashboard-secondary')?.remove();
  const filterBtn=_findByText('button','Filter');
  filterBtn?.addEventListener('click',()=>{
    openModal({title:'Filter Dashboard',body:`
      <div class="row g-3">
        <div class="col-sm-6"><label class="form-label">Date Range</label><select class="form-select"><option>May 1 – May 31, 2024</option><option>Last 30 days</option><option>This Quarter</option></select></div>
        <div class="col-sm-6"><label class="form-label">Status</label><select class="form-select"><option>All</option><option>Qualified</option><option>Won</option></select></div>
        <div class="col-12"><label class="form-label">Search</label><input class="form-control" placeholder="Referral, company, owner..."></div>
      </div>`,actions:`<button class="btn btn-light" data-bs-dismiss="modal">Cancel</button><button class="btn btn-primary" onclick="closeModal();showToast('Filters applied','success')">Apply Filters</button>`});
  });
  // segmented period controls
  document.querySelectorAll('.zp-segmented button').forEach(btn=>{
    btn.addEventListener('click',()=>{
      btn.closest('.zp-segmented').querySelectorAll('button').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');showToast(`Showing ${btn.textContent.trim()}`,'info',1200);
    });
  });
}

function initProfile(){
  const saveBtn=_findByText('button','Save Changes');
  const editBtns=[...document.querySelectorAll('a,button')].filter(b=>b.textContent.trim()==='Edit');
  const inputs=[...document.querySelectorAll('input,select,textarea')].filter(i=>!['checkbox','radio'].includes(i.type));
  let editing=false;
  function setEditing(on){
    editing=on;
    inputs.forEach(i=>{i.readOnly=!on;i.disabled=on&&i.tagName==='SELECT'?!on:on&&i.tagName==='SELECT';if(i.tagName!=='SELECT')i.readOnly=!on;i.style.background=on?'#fff':'#f8fafc'});
    if(saveBtn){saveBtn.disabled=!on;saveBtn.style.opacity=on?'1':'.55'}
  }
  setEditing(false);
  editBtns.forEach(btn=>btn.addEventListener('click',e=>{e.preventDefault();setEditing(!editing);showToast(editing?'Editing enabled — make changes then Save':'Editing locked','info');btn.textContent=editing?'Done':'Edit'}));
  saveBtn?.addEventListener('click',e=>{e.preventDefault();setEditing(false);editBtns.forEach(b=>b.textContent='Edit');setStore({profile:{updatedAt:new Date().toISOString()}});showToast('Profile saved successfully ✓','success')});
  // avatar upload
  const cam=document.querySelector('.zp-avatar-upload');
  cam?.addEventListener('click',()=>{
    const inp=document.createElement('input');inp.type='file';inp.accept='image/*';
    inp.onchange=()=>{const f=inp.files[0];if(!f)return;const url=URL.createObjectURL(f);const img=cam.closest('.position-relative')?.querySelector('img');if(img)img.src=url;showToast('Profile photo updated (preview)','success')};
    inp.click();
  });
}

function initOnboarding(){
  document.querySelectorAll('.zp-progress > span').forEach(bar=>{
    if(bar.dataset.w){const target=bar.dataset.w;bar.style.width='0%';setTimeout(()=>bar.style.transition='width .9s cubic-bezier(.32,.72,0,1)',20);setTimeout(()=>bar.style.width=target,80)}
  });
  document.querySelectorAll('[data-modal-agreement]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();openModal({title:'Partner Agreement',body:`<div class="small text-muted"><p class="fw-semibold text-secondary">ZenPartner Partner Agreement — May 01, 2024</p><p>By accepting this agreement you agree to the terms of partnership, commission structure, and confidentiality obligations.</p><div class="p-3 bg-warning-subtle rounded-3 text-warning-emphasis" style="font-size:.75rem">✅ Completed on May 01, 2024 — Verified</div></div>`,actions:`<button class="btn btn-light" data-bs-dismiss="modal">Close</button><button class="btn btn-primary" onclick="closeModal();showToast('Agreement acknowledged','success')">Acknowledge</button>`,size:'lg'})}));
  document.querySelectorAll('[data-modal-nda]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();openModal({title:'Non-Disclosure Agreement',body:`<p class="small text-muted">NDA signed on May 02, 2024. Confidential information must not be disclosed for 24 months.</p>`,actions:`<button class="btn btn-primary" onclick="closeModal();showToast('NDA verified','success')">OK</button>`})}));
  document.querySelectorAll('[data-modal-cert]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();openModal({title:'Training Certificate',body:`<div class="text-center py-3"><div class="zp-empty-icon mx-auto" style="width:64px;height:64px;font-size:1.6rem"><i class="bi bi-mortarboard"></i></div><div class="fw-bold mt-3">Certificate of Completion</div><div class="small text-muted">Training & Certification — May 05, 2024</div><div class="mt-3 d-inline-flex zp-pill zp-pill--emerald">Verified ✓</div></div>`,actions:`<button class="btn btn-light" data-bs-dismiss="modal">Close</button><button class="btn btn-primary" onclick="closeModal();window.print()">Print</button>`})}));
  document.querySelectorAll('[data-modal-review]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();openModal({title:'Learn About Our Company',body:`<p class="small text-muted">Zentegra is a cloud solutions platform. This refresher helps partners understand our product suite.</p><ul class="small text-muted ps-3"><li>Cloud Infrastructure</li><li>Collaboration Suite</li><li>Partner Enablement</li></ul>`,actions:`<button class="btn btn-primary" onclick="closeModal();showToast('Marked as reviewed','success')">Mark as Reviewed</button>`})}));
}

function initTraining(){
  document.querySelectorAll('.zp-segmented button').forEach(btn=>{
    btn.addEventListener('click',()=>{
      btn.closest('.zp-segmented').querySelectorAll('button').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const filter=btn.textContent.trim();
      document.querySelectorAll('.zp-course').forEach(r=>{
        const status=r.textContent.includes('Completed')?'Completed':r.textContent.includes('In Progress')?'In Progress':'Not Started';
        r.style.display=(filter==='All Courses'||status===filter)?'':'none';
      });
    });
  });
  document.querySelectorAll('.zp-course [data-continue]').forEach(a=>a.addEventListener('click',e=>{
    e.preventDefault();
    const row=a.closest('.zp-course');
    const bar=row?.querySelector('.zp-progress > span');
    if(bar){let w=parseInt(bar.style.width)||parseInt(bar.dataset.w)||0;const t=Math.min(100,w+25);bar.style.transition='width .7s ease';bar.style.width=t+'%';showToast(t>=100?'Course completed! 🎉':`Progress updated to ${t}%`,'success')}
    else showToast('Resuming course…','info');
  }));
}

function initResources(){
  const categorySel=_findByText('select','All Categories')||document.querySelector('select');
  const resetBtn=_findByText('button','Reset');
  const cards=[...document.querySelectorAll('.resource-card')];
  const apply=()=>{
    const cat=categorySel?.value||'';
    const q=(document.getElementById('top-search-input')?.value||'').toLowerCase();
    cards.forEach(c=>{
      const txt=c.textContent.toLowerCase();
      const ok=(!q||txt.includes(q))&&(!cat||cat.includes('All')||txt.includes(cat.toLowerCase()));
      c.style.display=ok?'':'none';
    });
    const visible=cards.filter(c=>c.style.display!=='none').length;
    showToast(`${visible} resources found`,'info',1200);
  };
  categorySel?.addEventListener('change',apply);
  document.getElementById('top-search-input')?.addEventListener('input',debounce(apply,160));
  resetBtn?.addEventListener('click',()=>{if(categorySel)categorySel.selectedIndex=0;if(document.getElementById('top-search-input'))document.getElementById('top-search-input').value='';cards.forEach(c=>c.style.display='');showToast('Filters reset','info')});
  document.querySelectorAll('.resource-card [data-download]').forEach(a=>a.addEventListener('click',e=>{
    e.preventDefault();a.style.transform='scale(.96)';setTimeout(()=>a.style.transform='',120);
    showToast('Downloading… File will be ready in a moment','success');
    setTimeout(()=>downloadStaticFile('resource.txt','Demo file content\nZenPartner resource'),400);
  }));
}

function initReferral(){
  const form=document.getElementById('referral-form');
  const submitBtn=document.getElementById('ref-submit');
  const totalEl=document.getElementById('ref-total');
  submitBtn?.addEventListener('click',e=>{
    e.preventDefault();
    const company=document.getElementById('ref-company');
    const email=document.getElementById('ref-email');
    let ok=true;
    [company].forEach(i=>{if(i&&!i.value.trim()){ok=false;i.classList.add('is-invalid')}});
    if(email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())){ok=false;email.classList.add('is-invalid')}
    if(!ok){showToast('Please fix the highlighted fields','error');return}
    showToast(`Referral for ${company?.value.trim()||'New Company'} submitted ✓`,'success');
    if(totalEl){totalEl.textContent=(parseInt(totalEl.textContent)||24)+1}
    form?.reset();
  });
  document.querySelectorAll('.is-invalid').forEach(i=>i.addEventListener('input',()=>i.classList.remove('is-invalid')));
  _findByText('button','Export')?.addEventListener('click',e=>{e.preventDefault();downloadStaticFile('referrals.csv','Ref ID,Company,Service,Value,Status\nDEMO-1,Demo Co,Website,$15000,New','text/csv');showToast('Referrals exported to CSV','success')});
}

function initLeads(){
  document.querySelectorAll('.zp-tabs .zp-tab').forEach(tab=>tab.addEventListener('click',()=>{
    tab.closest('.zp-tabs').querySelectorAll('.zp-tab').forEach(t=>t.classList.remove('active'));
    tab.classList.add('active');showToast(`Switched to ${tab.textContent.trim()}`,'info',1200);
  }));
}

function initActivities(){
  _findByText('button','Filter')?.addEventListener('click',()=>{
    openModal({title:'Filter Activities',body:`<div class="row g-3"><div class="col-12"><label class="form-label">Type</label><select class="form-select"><option>All Types</option><option>Leads</option><option>Projects</option><option>Payments</option></select></div><div class="col-12"><label class="form-label">Date</label><input type="date" class="form-control"></div></div>`,actions:`<button class="btn btn-light" data-bs-dismiss="modal">Cancel</button><button class="btn btn-primary" onclick="closeModal();showToast('Activities filtered','success')">Apply</button>`});
  });
}

function initEarnings(){
  const map={'This Year':['$24,750','$18,500','$12,750','$5,750'],'This Quarter':['$8,200','$6,100','$4,200','$1,900'],'This Month':['$2,850','$2,100','$1,400','$700']};
  document.querySelectorAll('.zp-segmented button').forEach(btn=>btn.addEventListener('click',()=>{
    btn.closest('.zp-segmented').querySelectorAll('button').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const v=map[btn.textContent.trim()]||map['This Year'];
    document.querySelectorAll('.earn-value').forEach((el,i)=>{if(v[i])el.textContent=v[i]});
    showToast(`Switched to ${btn.textContent.trim()}`,'info',1100);
  }));
  _findByText('button','Request Payout')?.addEventListener('click',e=>{e.preventDefault();openModal({title:'Request Payout',body:`<div class="p-3 bg-success-subtle rounded-3 d-flex justify-content-between mb-3"><span class="small fw-semibold text-secondary">Available Balance</span><span class="fw-bold text-success">$5,750</span></div><label class="form-label">Amount ($)</label><input id="payout-amount" type="number" min="500" max="5750" value="5750" class="form-control mb-3"><label class="form-label">Payout Method</label><select class="form-select mb-2"><option>Bank Transfer — •••• 4589</option><option>PayPal — james@...</option></select><p class="small text-muted mb-0">Minimum $500 • Processed within 5 business days.</p>`,actions:`<button class="btn btn-light" data-bs-dismiss="modal">Cancel</button><button class="btn btn-primary" onclick="(function(){var v=parseInt(document.getElementById('payout-amount').value||'0');if(v<500){showToast('Minimum payout is $500','error');return}if(v>5750){showToast('Amount exceeds balance','error');return}closeModal();showToast('Payout request for $'+v+' submitted ✓','success')})()">Confirm Request</button>`})});
}

function initReports(){
  document.querySelectorAll('.zp-segmented button').forEach(btn=>btn.addEventListener('click',()=>{
    btn.closest('.zp-segmented').querySelectorAll('button').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const mult=btn.textContent.includes('Quarter')?.34:btn.textContent.includes('Month')?.12:1;
    document.querySelectorAll('.report-value').forEach(el=>{
      const is$=el.textContent.includes('$'),isP=el.textContent.includes('%');
      const base=parseInt(el.textContent.replace(/[^0-9]/g,''))||100;
      el.textContent=is$?'$'+Math.round(base*mult).toLocaleString():isP?(mult*14.92).toFixed(2)+'%':Math.round(base*mult).toLocaleString();
    });
    showToast(`Reports updated — ${btn.textContent.trim()}`,'info',1000);
  }));
  _findByText('button','Export Report')?.addEventListener('click',e=>{e.preventDefault();showToast('Generating report PDF…','info');setTimeout(()=>{downloadStaticFile('report.txt','ZenPartner Report\nGenerated: '+new Date().toLocaleString());showToast('Report downloaded ✓','success')},600)});
}

/* ── Admin initializers ── */
function initAdminDashboard(){
  const tbody=document.getElementById('partner-tbody');
  if(!tbody)return;
  const rows=[...tbody.querySelectorAll('tr')];
  const apply=()=>{
    const q=(document.getElementById('partner-search')?.value||'').toLowerCase();
    const st=document.getElementById('status-filter')?.value||'all';
    let vis=0;
    rows.forEach(r=>{const s=!q||(r.dataset.search||'').includes(q)&&(st==='all'||r.dataset.status===st);r.style.display=s?'':'none';if(s)vis++});
    const c=document.getElementById('table-count');if(c)c.textContent=`Showing 1 to ${vis} of ${vis} entries`;
  };
  document.getElementById('partner-search')?.addEventListener('input',apply);
  document.getElementById('status-filter')?.addEventListener('change',apply);
  document.getElementById('top-search-input')?.addEventListener('input',function(){const s=document.getElementById('partner-search');if(s){s.value=this.value;apply()}});
  _findByText('button','Assign New Task')?.addEventListener('click',e=>{e.preventDefault();openModal({title:'Assign New Task',body:`<label class="form-label">Task Title</label><input class="form-control mb-3" placeholder="e.g., Review project proposal"><label class="form-label">Assign To</label><select class="form-select mb-3"><option>James Anderson</option><option>Sarah Mitchell</option><option>Michael Davis</option></select><label class="form-label">Priority</label><select class="form-select mb-3"><option>High</option><option>Medium</option><option>Low</option></select><label class="form-label">Due Date</label><input type="date" class="form-control">`,actions:`<button class="btn btn-light" data-bs-dismiss="modal">Cancel</button><button class="btn btn-primary" onclick="closeModal();showToast('Task assigned successfully','success')">Assign Task</button>`})});
}

function initAdminPartners(){
  const tbody=document.getElementById('partner-tbody');
  if(!tbody)return;
  const PARTNERS=[];
  // seed from existing static rows on first load
  const levelClass={'Gold Partner':'zp-pill--amber','Silver Partner':'zp-pill--slate','Bronze Partner':'zp-pill--orange'};
  const statusClass={'Active':'zp-pill--emerald','Pending':'zp-pill--amber','Inactive':'zp-pill--rose'};
  const kycClass={'Verified':'zp-pill--emerald','Pending':'zp-pill--amber','Not Verified':'zp-pill--rose'};
  const SEED=[
    ['ZP-2024-0001','James Anderson','james.anderson@example.com','+1 (555) 123-4567','Gold Partner','Active','Verified','Jan 15, 2024','96','12','$24,750','$12,750'],
    ['ZP-2024-0002','Sarah Mitchell','sarah.mitchell@example.com','+1 (555) 234-5678','Gold Partner','Active','Verified','Jan 18, 2024','64','8','$18,200','$9,450'],
    ['ZP-2024-0003','Michael Davis','michael.davis@example.com','+1 (555) 345-6789','Silver Partner','Active','Verified','Jan 20, 2024','78','10','$16,500','$8,250'],
    ['ZP-2024-0004','Emily Wilson','emily.wilson@example.com','+1 (555) 456-7890','Silver Partner','Pending','Pending','Jan 22, 2024','10','2','$1,250','$0'],
    ['ZP-2024-0005','David Lee','david.lee@example.com','+1 (555) 567-8901','Bronze Partner','Active','Verified','Jan 25, 2024','42','6','$9,800','$4,900'],
    ['ZP-2024-0006','Olivia Brown','olivia.brown@example.com','+1 (555) 678-9012','Bronze Partner','Inactive','Not Verified','Jan 28, 2024','0','0','$0','$0'],
    ['ZP-2024-0007','Daniel Martinez','daniel.martinez@example.com','+1 (555) 789-0123','Silver Partner','Active','Verified','Jan 30, 2024','55','7','$12,600','$6,300'],
    ['ZP-2024-0008','Sophia Johnson','sophia.johnson@example.com','+1 (555) 890-1234','Bronze Partner','Pending','Pending','Feb 02, 2024','5','1','$600','$0'],
    ['ZP-2024-0009','William Taylor','william.taylor@example.com','+1 (555) 901-2345','Silver Partner','Active','Verified','Feb 05, 2024','8','5','$7,400','$3,700'],
    ['ZP-2024-0010','Ava Thomas','ava.thomas@example.com','+1 (555) 012-3456','Bronze Partner','Active','Verified','Feb 08, 2024','22','3','$4,200','$2,100'],
    ['ZP-2024-0011','Benjamin Clark','benjamin.clark@example.com','+1 (555) 111-2222','Silver Partner','Inactive','Not Verified','Feb 10, 2024','0','0','$0','$0'],
    ['ZP-2024-0012','Mia Lewis','mia.lewis@example.com','+1 (555) 222-3333','Bronze Partner','Active','Verified','Feb 12, 2024','18','2','$2,300','$1,150']
  ];
  const avatars=['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=60','https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=60','https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&auto=format&fit=crop&q=60','https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&auto=format&fit=crop&q=60'];
  SEED.forEach((p,i)=>{PARTNERS.push({id:p[0],name:p[1],email:p[2],phone:p[3],level:p[4],status:p[5],kyc:p[6],joined:p[7],leads:p[8],projects:p[9],earnings:p[10],payouts:p[11],avatar:avatars[i%avatars.length]})});
  const av=`<img src="$0" style="width:30px;height:30px;border-radius:50%;object-fit:cover">`;
  const rowHtml=p=>`<tr data-id="${p.id}" data-status="${p.status}" data-level="${p.level}" data-kyc="${p.kyc}" data-search="${(p.id+' '+p.name+' '+p.email).toLowerCase()}">
    <td class="text-secondary fw-semibold">${p.id}</td>
    <td><div class="d-flex align-items-center gap-2"><img src="${p.avatar}" style="width:30px;height:30px;border-radius:50%;object-fit:cover"><span class="fw-semibold">${p.name}</span></div></td>
    <td class="text-secondary">${p.email}</td><td class="text-secondary">${p.phone}</td>
    <td><span class="zp-pill zp-level ${levelClass[p.level]}">${p.level}</span></td>
    <td><span class="zp-pill ${statusClass[p.status]}">${p.status}</span></td>
    <td><span class="zp-pill ${kycClass[p.kyc]}">${p.kyc}</span></td>
    <td class="text-secondary">${p.joined}</td>
    <td class="text-center fw-semibold">${p.leads}</td><td class="text-center fw-semibold">${p.projects}</td>
    <td class="text-end fw-bold">${p.earnings}</td><td class="text-end">${p.payouts}</td>
    <td class="text-center"><a href="partner-view.html" class="row-action" title="View"><i class="bi bi-eye"></i></a><button class="row-action row-more" title="More"><i class="bi bi-three-dots"></i></button></td>
  </tr>`;
  const render=()=>{
    const q=(document.getElementById('partner-search').value||'').toLowerCase();
    const st=document.getElementById('status-filter').value,lv=document.getElementById('level-filter').value,kc=document.getElementById('kyc-filter').value;
    const vis=PARTNERS.filter(p=>((p.id+' '+p.name+' '+p.email).toLowerCase()).includes(q)&&(st==='all'||p.status===st)&&(lv==='all'||p.level===lv)&&(kc==='all'||p.kyc===kc));
    tbody.innerHTML=vis.map(rowHtml).join('');
    document.getElementById('table-count').textContent=vis.length===PARTNERS.length?`Showing 1 to ${PARTNERS.length} of 248 entries`:`Showing 1 to ${vis.length} of ${vis.length} matching entries`;
  };
  ['partner-search','status-filter','level-filter','kyc-filter'].forEach(id=>{const el=document.getElementById(id);el?.addEventListener('input',render);el?.addEventListener('change',render)});
  document.getElementById('top-search-input')?.addEventListener('input',function(){document.getElementById('partner-search').value=this.value;render()});
  render();
  document.getElementById('export-btn')?.addEventListener('click',e=>{e.preventDefault();const rows=[['Partner ID','Partner','Email','Phone','Level','Status','KYC','Joined','Leads','Projects','Earnings','Payouts']];PARTNERS.forEach(p=>rows.push([p.id,p.name,p.email,p.phone,p.level,p.status,p.kyc,p.joined,p.leads,p.projects,p.earnings,p.payouts]));downloadStaticFile('zenpartners.csv',rows.map(r=>r.map(c=>'"'+String(c).replace(/"/g,'""')+'"').join(',')).join('\n'),'text/csv');showToast('Exported partners to CSV','success')});
  document.getElementById('add-btn')?.addEventListener('click',e=>{e.preventDefault();openModal({title:'Add New Partner',body:`<label class="form-label">Full Name</label><input id="np-name" class="form-control mb-3" placeholder="e.g. Liam Carter"><label class="form-label">Email</label><input id="np-email" type="email" class="form-control mb-3" placeholder="liam.carter@example.com"><label class="form-label">Phone</label><input id="np-phone" class="form-control mb-3" placeholder="+1 (555) 333-4444"><div class="row g-3"><div class="col-6"><label class="form-label">Partner Level</label><select id="np-level" class="form-select"><option>Bronze Partner</option><option>Silver Partner</option><option>Gold Partner</option></select></div><div class="col-6"><label class="form-label">Status</label><select id="np-status" class="form-select"><option>Active</option><option>Pending</option><option>Inactive</option></select></div></div>`,actions:`<button class="btn btn-light" data-bs-dismiss="modal">Cancel</button><button class="btn btn-primary" id="save-partner">Add Partner</button>`});document.getElementById('save-partner')?.addEventListener('click',()=>{const name=document.getElementById('np-name').value.trim(),email=document.getElementById('np-email').value.trim();if(!name||!email){showToast('Please enter name and email','error');return}PARTNERS.push({id:'ZP-2024-0'+(PARTNERS.length+13).toString().padStart(3,'0'),name,email,phone:document.getElementById('np-phone').value||'—',level:document.getElementById('np-level').value,status:document.getElementById('np-status').value,kyc:'Pending',joined:new Date().toLocaleDateString('en-US',{month:'short',day:'2-digit',year:'numeric'}),leads:0,projects:0,earnings:'$0',payouts:'$0',avatar:avatars[0]});render();closeModal();showToast('Partner '+name+' added successfully','success')})});
  document.addEventListener('click',e=>{const more=e.target.closest('.row-more');if(more){e.preventDefault();e.stopPropagation();openActionMenu(more)}});
  const prev=document.getElementById('page-prev'),next=document.getElementById('page-next');
  next?.addEventListener('click',()=>{if(prev)prev.disabled=false;next.disabled=true});
  prev?.addEventListener('click',()=>{if(next)next.disabled=false;prev.disabled=true});
}

function initAdminOnboarding(){
  const tbody=document.getElementById('onboard-tbody');
  if(!tbody)return;
  const levelClass={'Gold Partner':'zp-pill--amber','Silver Partner':'zp-pill--slate','Bronze Partner':'zp-pill--orange'};
  const statusClass={'Completed':'zp-pill--emerald','In Progress':'zp-pill--blue','Pending':'zp-pill--amber'};
  const PARTNERS=[
    {id:'ZP-2024-0001',name:'James Anderson',level:'Gold Partner',status:'Completed',overall:100,steps:['May 01, 2024','May 02, 2024','May 05, 2024','May 06, 2024','May 07, 2024','May 08, 2024']},
    {id:'ZP-2024-0002',name:'Sarah Mitchell',level:'Gold Partner',status:'In Progress',overall:33,steps:['May 03, 2024','May 04, 2024','In Progress','Pending','Pending','Pending']},
    {id:'ZP-2024-0003',name:'Michael Davis',level:'Silver Partner',status:'In Progress',overall:17,steps:['May 02, 2024','Pending','Pending','Pending','Pending','Pending']},
    {id:'ZP-2024-0004',name:'Emily Wilson',level:'Bronze Partner',status:'In Progress',overall:22,steps:['May 06, 2024','In Progress','Pending','Pending','Pending','Pending']},
    {id:'ZP-2024-0005',name:'David Lee',level:'Bronze Partner',status:'Pending',overall:0,steps:['Pending','Pending','Pending','Pending','Pending','Pending']},
    {id:'ZP-2024-0006',name:'Olivia Brown',level:'Gold Partner',status:'In Progress',overall:67,steps:['May 04, 2024','May 05, 2024','May 06, 2024','In Progress','Pending','Pending']},
    {id:'ZP-2024-0007',name:'Daniel Martinez',level:'Silver Partner',status:'In Progress',overall:33,steps:['May 03, 2024','Pending','In Progress','Pending','Pending','Pending']},
    {id:'ZP-2024-0008',name:'Sophia Johnson',level:'Bronze Partner',status:'Pending',overall:0,steps:['Pending','Pending','Pending','Pending','Pending','Pending']}
  ];
  const stepCell=v=>v==='Pending'?`<td><span class="zp-pill zp-pill--amber">Pending</span></td>`:v==='In Progress'?`<td><span class="zp-pill zp-pill--blue">In Progress</span></td>`:`<td><span class="zp-pill zp-pill--emerald"><i class="bi bi-check2"></i>${v}</span></td>`;
  const bar=p=>{const c=p>=100?'bg-success':p>0?'bg-primary':'bg-secondary';return`<td><div class="d-flex align-items-center gap-2"><div class="zp-progress" style="width:56px"><span class="${c}" style="width:${p}%"></span></div><span class="small fw-bold">${p}%</span></div></td>`};
  const rowHtml=p=>`<tr data-status="${p.status}" data-level="${p.level}"><td><div class="d-flex align-items-center gap-2"><img src="${USER_AVATAR}" style="width:30px;height:30px;border-radius:50%"><div><div class="fw-semibold">${p.name}</div><div class="text-muted" style="font-size:.68rem">${p.id}</div></div></div></td><td><span class="zp-pill zp-level ${levelClass[p.level]}">${p.level}</span></td><td><span class="zp-pill ${statusClass[p.status]}">${p.status}</span></td>${p.steps.map(stepCell).join('')}${bar(p.overall)}</tr>`;
  const render=()=>{
    const q=(document.getElementById('partner-search').value||'').toLowerCase(),st=document.getElementById('status-filter').value,lv=document.getElementById('level-filter').value;
    const vis=PARTNERS.filter(p=>((p.id+' '+p.name).toLowerCase()).includes(q)&&(st==='all'||p.status===st)&&(lv==='all'||p.level===lv));
    tbody.innerHTML=vis.map(rowHtml).join('');
    document.getElementById('table-count').textContent=`Showing 1 to ${vis.length} of ${vis.length} entries`;
  };
  ['partner-search','status-filter','level-filter'].forEach(id=>{const el=document.getElementById(id);el?.addEventListener('input',render);el?.addEventListener('change',render)});
  document.getElementById('top-search-input')?.addEventListener('input',function(){document.getElementById('partner-search').value=this.value;render()});
  render();
  document.getElementById('export-btn')?.addEventListener('click',e=>{e.preventDefault();downloadStaticFile('partners-onboarding.csv','Partner,Level,Status,Overall\nJames Anderson,Gold Partner,Completed,100%','text/csv');showToast('Exported onboarding data to CSV','success')});
}

function initAdminPartnerView(){
  document.querySelectorAll('.zp-tab').forEach(tab=>tab.addEventListener('click',()=>{
    tab.closest('.zp-tabs').querySelectorAll('.zp-tab').forEach(t=>t.classList.remove('active'));
    tab.classList.add('active');
  }));
  document.querySelectorAll('[data-email]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();openModal({title:'Send Email — James Anderson',body:`<label class="form-label">To</label><input class="form-control mb-3" value="james.anderson@example.com"><label class="form-label">Subject</label><input class="form-control mb-3" placeholder="Subject"><label class="form-label">Message</label><textarea class="form-control" rows="4"></textarea>`,actions:`<button class="btn btn-light" data-bs-dismiss="modal">Cancel</button><button class="btn btn-primary" onclick="closeModal();showToast('Email sent','success')">Send</button>`})}));
  document.querySelectorAll('[data-note]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();openModal({title:'Add Note',body:`<label class="form-label">Note</label><textarea class="form-control" rows="4" placeholder="Add a note about this partner..."></textarea>`,actions:`<button class="btn btn-light" data-bs-dismiss="modal">Cancel</button><button class="btn btn-primary" onclick="closeModal();showToast('Note added','success')">Save Note</button>`})}));
  document.querySelectorAll('[data-task]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();openModal({title:'Assign Task',body:`<label class="form-label">Task</label><input class="form-control" placeholder="Task title">`,actions:`<button class="btn btn-light" data-bs-dismiss="modal">Cancel</button><button class="btn btn-primary" onclick="closeModal();showToast('Task assigned','success')">Assign</button>`})}));
}

function initAdminPayouts(){
  const tbody=document.getElementById('payout-tbody');
  if(!tbody)return;
  const statusClass={'Pending':'zp-pill--amber','Approved':'zp-pill--sky','Paid':'zp-pill--emerald','Rejected':'zp-pill--rose'};
  const PAYOUTS=[
    ['PO-2024-0521','James Anderson','$2,500','Bank Transfer','Pending','May 15, 2024'],['PO-2024-0520','Sarah Mitchell','$1,800','Bank Transfer','Approved','May 14, 2024'],['PO-2024-0519','Michael Davis','$3,200','PayPal','Paid','May 12, 2024'],['PO-2024-0518','Emily Wilson','$750','Bank Transfer','Pending','May 12, 2024'],['PO-2024-0517','David Lee','$1,150','Bank Transfer','Rejected','May 10, 2024'],['PO-2024-0516','Daniel Martinez','$2,900','PayPal','Paid','May 08, 2024'],['PO-2024-0515','William Taylor','$1,600','Bank Transfer','Approved','May 06, 2024'],['PO-2024-0514','Ava Thomas','$950','Bank Transfer','Paid','May 04, 2024']
  ];
  const rowHtml=p=>`<tr data-status="${p[4]}"><td class="text-secondary fw-semibold">${p[0]}</td><td><div class="d-flex align-items-center gap-2"><img src="${USER_AVATAR}" style="width:30px;height:30px;border-radius:50%"><span class="fw-semibold">${p[1]}</span></div></td><td class="text-end fw-bold">${p[2]}</td><td class="text-secondary">${p[3]}</td><td><span class="zp-pill ${statusClass[p[4]]}">${p[4]}</span></td><td class="text-secondary">${p[5]}</td><td class="text-center"><button class="row-action payout-approve" title="Approve"><i class="bi bi-check2"></i></button><button class="row-action payout-reject" title="Reject"><i class="bi bi-x"></i></button></td></tr>`;
  const render=()=>{
    const q=(document.getElementById('payout-search').value||'').toLowerCase(),st=document.getElementById('payout-status').value;
    const vis=PAYOUTS.filter(p=>((p[0]+' '+p[1]).toLowerCase()).includes(q)&&(st==='all'||p[4]===st));
    tbody.innerHTML=vis.map(rowHtml).join('');
    document.getElementById('payout-count').textContent=`Showing 1 to ${vis.length} of ${vis.length} entries`;
  };
  document.getElementById('payout-search')?.addEventListener('input',render);
  document.getElementById('payout-status')?.addEventListener('change',render);
  document.getElementById('top-search-input')?.addEventListener('input',function(){document.getElementById('payout-search').value=this.value;render()});
  render();
  tbody.addEventListener('click',e=>{
    const b=e.target.closest('.payout-approve,.payout-reject');if(!b)return;
    const id=b.closest('tr')?.querySelector('td')?.textContent||'PO-0000';
    if(b.classList.contains('payout-approve'))openModal({title:'Approve Payout',body:`<p class="small text-muted">Approve payout <b>${id}</b>? Funds will be released on the next payment cycle.</p>`,actions:`<button class="btn btn-light" data-bs-dismiss="modal">Cancel</button><button class="btn btn-primary" onclick="closeModal();showToast('Payout ${id} approved','success')">Approve</button>`,size:'sm'});
    else openModal({title:'Reject Payout',body:`<label class="form-label">Reason (optional)</label><textarea class="form-control" rows="3" placeholder="e.g., KYC verification missing"></textarea>`,actions:`<button class="btn btn-light" data-bs-dismiss="modal">Cancel</button><button class="btn btn-primary" onclick="closeModal();showToast('Payout ${id} rejected','error')">Reject</button>`,size:'sm'});
  });
  document.getElementById('payout-export')?.addEventListener('click',e=>{e.preventDefault();downloadStaticFile('payouts.csv','Request ID,Partner,Amount,Method,Status\nPO-2024-0521,James Anderson,$2500,Bank Transfer,Pending','text/csv');showToast('Payouts exported to CSV','success')});
  const map={'This Month':['$18,250','$14,900','$11,400','$3,500'],'This Quarter':['$52,800','$41,200','$30,750','$10,450'],'This Year':['$248,750','$198,600','$127,500','$71,100']};
  document.querySelectorAll('.zp-segmented button').forEach(btn=>btn.addEventListener('click',()=>{btn.closest('.zp-segmented').querySelectorAll('button').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const v=map[btn.textContent.trim()]||map['This Year'];document.querySelectorAll('.admin-kpi-value').forEach((el,i)=>{if(v[i])el.textContent=v[i]});showToast(`Showing payouts — ${btn.textContent.trim()}`,'info',1100)}));
}

function initAdminTickets(){
  const tbody=document.getElementById('ticket-tbody');
  if(!tbody)return;
  const priorityClass={'High':'zp-pill--rose','Medium':'zp-pill--amber','Low':'zp-pill--slate'};
  const statusClass={'Open':'zp-pill--sky','In Progress':'zp-pill--indigo','Resolved':'zp-pill--emerald'};
  const TICKETS=[
    ['T-1042','Payout not received for April cycle','James Anderson','High','In Progress','Support Team','May 15, 2024'],['T-1041','Access to partner resources revoked','Sarah Mitchell','Medium','Open','Unassigned','May 15, 2024'],['T-1040','How to update KYC documents?','Michael Davis','Low','Resolved','Support Team','May 14, 2024'],['T-1039','Commission rate discrepancy on referral','Emily Wilson','High','Open','Finance Team','May 14, 2024'],['T-1038','Training certificate not visible','David Lee','Medium','In Progress','Support Team','May 13, 2024'],['T-1037','Request for new referral template','Olivia Brown','Low','Resolved','Marketing Team','May 12, 2024'],['T-1036','Portal login issue — OTP not received','Daniel Martinez','High','Resolved','Support Team','May 11, 2024'],['T-1035','Update bank account details','Sophia Johnson','Medium','Open','Finance Team','May 10, 2024']
  ];
  const rowHtml=t=>`<tr data-status="${t[4]}" data-priority="${t[3]}"><td class="text-secondary fw-semibold">${t[0]}</td><td><div class="fw-semibold text-truncate" style="max-width:280px">${t[1]}</div><div class="text-muted" style="font-size:.68rem">${t[2]}</div></td><td><span class="zp-pill no-dot ${priorityClass[t[3]]}">${t[3]}</span></td><td><span class="zp-pill ${statusClass[t[4]]}">${t[4]}</span></td><td class="text-secondary">${t[5]}</td><td class="text-secondary">${t[6]}</td><td class="text-secondary">${t[6]}</td><td class="text-center"><button class="row-action ticket-view" title="View"><i class="bi bi-eye"></i></button><button class="row-action ticket-status" title="Change status"><i class="bi bi-arrow-repeat"></i></button></td></tr>`;
  const render=()=>{
    const q=(document.getElementById('ticket-search').value||'').toLowerCase(),st=document.getElementById('ticket-status').value,pr=document.getElementById('ticket-priority').value;
    const vis=TICKETS.filter(t=>((t[0]+' '+t[1]+' '+t[2]).toLowerCase()).includes(q)&&(st==='all'||t[4]===st)&&(pr==='all'||t[3]===pr));
    tbody.innerHTML=vis.map(rowHtml).join('');
    document.getElementById('ticket-count').textContent=`Showing 1 to ${vis.length} of ${vis.length} entries`;
  };
  document.getElementById('ticket-search')?.addEventListener('input',render);
  document.getElementById('ticket-status')?.addEventListener('change',render);
  document.getElementById('ticket-priority')?.addEventListener('change',render);
  document.getElementById('top-search-input')?.addEventListener('input',function(){document.getElementById('ticket-search').value=this.value;render()});
  render();
  tbody.addEventListener('click',e=>{
    const v=e.target.closest('.ticket-view');
    if(v){const tr=v.closest('tr');openModal({title:'Ticket '+tr?.querySelector('td')?.textContent,body:`<div class="p-3 bg-light rounded-3 mb-3 fw-semibold small">${tr?.querySelector('.fw-semibold')?.textContent||'Ticket subject'}</div><p class="small text-muted">Full conversation thread and ticket details would appear here. This is a demo preview.</p>`,actions:`<button class="btn btn-light" data-bs-dismiss="modal">Close</button><button class="btn btn-primary" onclick="closeModal();showToast('Replying to ticket…','success')">Reply</button>`});return}
    const s=e.target.closest('.ticket-status');
    if(s){const tr=s.closest('tr');const id=tr?.querySelector('td')?.textContent;openModal({title:'Change Status — '+id,body:`<label class="form-label">New Status</label><select id="ticket-new-status" class="form-select"><option>Open</option><option>In Progress</option><option>Resolved</option></select>`,actions:`<button class="btn btn-light" data-bs-dismiss="modal">Cancel</button><button class="btn btn-primary" onclick="(function(){var v=document.getElementById('ticket-new-status').value;closeModal();showToast('Ticket moved to '+v,'success')})()">Update</button>`,size:'sm'})}
  });
  document.getElementById('ticket-export')?.addEventListener('click',e=>{e.preventDefault();downloadStaticFile('tickets.csv','Ticket ID,Subject,Partner,Priority,Status\nT-1042,Payout not received,James Anderson,High,In Progress','text/csv');showToast('Tickets exported to CSV','success')});
}

/* ═══════════════ Main injector ═══════════════ */
function injectLayout(opts){
  currentActive=opts.active;
  const admin=opts.variant==='admin';
  const sb=document.getElementById('app-sidebar');
  const tb=document.getElementById('app-topbar');
  const mb=document.getElementById('app-mobile-nav');
  if(sb)sb.innerHTML=admin?buildAdminSidebar(opts.active):buildSidebar(opts.active);
  if(tb)tb.innerHTML=buildTopbar(opts.title,opts.breadcrumb,opts.searchPlaceholder||'Search anything...',opts.extraActions||'',admin);
  if(mb)mb.innerHTML=admin?buildAdminMobile(opts.active):buildMobile(opts.active);

  setTimeout(()=>{
    try{wireGlobalUI()}catch(e){console.error('global UI error',e)}
    const map={dashboard:initDashboard,onboarding:initOnboarding,profile:initProfile,training:initTraining,resources:initResources,referral:initReferral,leads:initLeads,activities:initActivities,earnings:initEarnings,reports:initReports};
    const adminMap={dashboard:initAdminDashboard,partners:initAdminPartners,onboarding:initAdminOnboarding,payouts:initAdminPayouts,tickets:initAdminTickets,partnerView:initAdminPartnerView};
    const fn=(admin?adminMap:map)[opts.active];
    try{if(fn)fn()}catch(e){console.error('init error',e)}
    try{wireUniversalActions(opts)}catch(e){console.error('universal action error',e)}

    if(!safeSessionGet('zp_welcomed')){safeSessionSet('zp_welcomed','1');setTimeout(()=>showToast(admin?`Welcome back, Admin! 🛡 — ${opts.title} loaded`:`Welcome back, James! 👋 — ${opts.title} loaded`,'info',2200),500)}
  },30);
}
window.injectLayout=injectLayout;
