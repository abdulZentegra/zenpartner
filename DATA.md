# ZenPartner — dynamic data guide

Every screen in this widget renders from the **zenpartner** Zoho Creator app.
There are no hard-coded sample numbers left in the rendered UI: the static HTML
is only a skeleton that the JavaScript layer replaces with live records (or the
local demo store when the widget is opened outside Creator).

## Script order (all pages)

```html
<script src="zoho.js"></script>    <!-- Creator SDK v2 data layer + demo store -->
<script src="derive.js"></script>  <!-- ZPData: derived business metrics + formatting -->
<script src="layout.js"></script>  <!-- sidebar / topbar / modals / toasts -->
<script src="pages.js"></script>   <!-- ZPPages: per-page renderers -->
<script src="app.js"></script>     <!-- ZPApp.boot(): session, mounts, actions -->
```

## Where the data comes from

| Form / Report | Used for |
|---|---|
| `Partner_Details` → `Partner_Details_Report` | session, profile, partner tables, commission rate |
| `Add_Referrals` → `All_Referrals` | leads, pipeline, earnings, payouts, reports |
| `Task` → `All_Tasks` | onboarding steps, activities, admin support tickets |
| `Partner_Courses` → `All_Partner_Courses` | training catalogue |
| `Partner_Course_Taken` → `Partner_Course_Taken_Report` | course progress, certificates |
| `Partner_Documents` → `All_Partner_Documents` | resources centre, profile documents |

## Derived values (`derive.js` → `ZPData.CONFIG`)

The Creator app has no Earnings / Payout / Ticket / Lead-stage forms yet, so
those pages are computed from the six forms above with one explicit rule-set.
Change `ZPData.CONFIG` and every page follows immediately.

| Config key | Meaning | Default |
|---|---|---|
| `currency` | Display currency | INR (`₹`, `en-IN`) |
| `rateCard` | Deal value per `Project_Service_Interest` | ₹2 L – ₹12 L |
| `defaultDealValue` | Fallback deal value | ₹3,50,000 |
| `commissionRate` | Commission % per `partner_type` | Zoho Partner 20% … Other 8% |
| `stages` | Pipeline stage by referral age | New 0d, Qualified 7d, Proposal 21d, Negotiation 35d, Closed Won 60d |
| `payout.lagDays` | Days after a win before commission is paid | 15 |
| `payout.cycleDays` / `payout.minimum` | Payout run cadence / threshold | 15 days / ₹25,000 |
| `ticketStatus` | `Task.status` → ticket status | Pending→Open, In Progress→In Progress, Completed→Resolved |
| `slaHours` | SLA target per task priority | Critical 4h … Low 48h |

Formulas:

* **Deal value** = `rateCard[service]` (fallback `defaultDealValue`)
* **Commission** = deal value × `commissionRate[partner_type]`
* **Stage** = derived from record age (`Added_Time`, falling back to `Task_Date`)
* **Earned** = commission of referrals that reached *Closed Won*
* **Paid** = earned commission older than `payout.lagDays`; the rest is *Pending*
* **Conversion** = won ÷ total referrals

When Creator gains real Earnings / Payout / Ticket forms, point the readers in
`derive.js` at those reports and the rest of the UI needs no changes.

## Page → renderer map

| Page | Renderer |
|---|---|
| `index.html` | `app.js mountDashboard()` + `ZPPages.dashboardExtras()` |
| `onboarding.html` | `mountOnboarding()` |
| `profile.html` | `mountProfile()` + `ZPPages.profileExtras()` |
| `training.html` | `mountTraining()` + `ZPPages.trainingExtras()` |
| `resources.html` | `mountResources()` + `ZPPages.resourcesExtras()` |
| `referral.html` | `mountReferral()` + `ZPPages.referralExtras()` |
| `leads.html` | `ZPPages.leads()` |
| `activities.html` | `ZPPages.activities()` |
| `earnings.html` | `ZPPages.earnings()` |
| `reports.html` | `ZPPages.reports()` (CSV export from live records) |
| `admin.html` | `mountAdminDashboard()` + `ZPPages.adminDashboardExtras()` |
| `partners.html` | `mountAdminPartners()` + `ZPPages.adminKpis()` |
| `partners-onboarding.html` | `mountAdminOnboarding()` + `ZPPages.adminOnboardingExtras()` |
| `partner-view.html?id=…` | `mountAdminPartnerView()` + `ZPPages.partnerViewExtras()` |
| `admin-payouts.html` | `ZPPages.adminPayouts()` |
| `admin-tickets.html` | `ZPPages.adminTickets()` |

The topbar (notifications, messages, badges, date chip) is also rebuilt from
records by `ZPPages.chromeExtras()`.

## Running locally

```bash
python3 -m http.server 8080     # then open http://localhost:8080/index.html
```

Outside Creator the widget falls back to the seeded demo store in
`localStorage` (`zp_creator_db_v2`). Useful query params:

* `?as=email@example.com` — impersonate a partner
* `?resetdemo=1` — reseed the demo store
* `?id=<recordId>` — open a specific partner on `partner-view.html`
* `?lead=<recordId>` — open a specific lead on `leads.html`

> Note: the legacy `init*` demo functions inside `layout.js` are **not**
> executed — `ZPApp.boot()` injects the layout with `skipInit: true` and all
> page content is produced by `app.js` / `pages.js` from real records.
