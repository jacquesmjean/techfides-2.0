// ============================================================
// TechFides GSE — Real Pipeline Data
// Updated: 2026-04-16
// ============================================================

import type { Lead, Activity, NurtureSequence, SalesGoal, ForecastPoint, SurveyResponse } from "./types";

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}
function daysFromNow(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
}

// ---- LEADS ----
export const SEED_LEADS: Lead[] = [
  {
    id: "lead-001",
    contact: {
      id: "c-001", firstName: "Eric", lastName: "Jang", email: "eric.jang@gartner.com",
      phone: "", title: "Analyst", company: "Gartner", avatar: "",
    },
    vertical: "other", service: "ai-readiness-360", stage: "qualified", source: "referral",
    region: "us", currency: "USD", dealValue: 50000, sowCost: 25000, monthlyRetainer: 5000,
    probability: 25, grossMargin: 70, createdAt: daysAgo(8), lastActivity: daysAgo(8),
    expectedCloseDate: daysFromNow(60), staleDays: 8,
    tags: ["high-priority", "advisory", "cold-follow-up"], notes: "Intro meeting Apr 8 with Grant Wheeler. 8+ days cold. Follow-up draft in Outlook Drafts. Advisory practice fit for AI Readiness 360.",
    assignedTo: "Jacques", heatScore: 35,
    salesStatus: "contacted",
    location: { lat: 32.9483, lng: -96.7299, city: "Dallas", state: "TX", zip: "75034", address: "Gartner DFW" },
  },
  {
    id: "lead-002",
    contact: {
      id: "c-002", firstName: "Modupe", lastName: "Taylor-Pearce", email: "modupe@bcaleadership.com",
      phone: "", title: "Principal", company: "BCA Leadership", avatar: "",
    },
    vertical: "other", service: "transformation-management", stage: "qualified", source: "referral",
    region: "us", currency: "USD", dealValue: 30000, sowCost: 15000, monthlyRetainer: 3000,
    probability: 30, grossMargin: 65, createdAt: daysAgo(20), lastActivity: daysAgo(6),
    expectedCloseDate: daysFromNow(45), staleDays: 6,
    tags: ["leadership", "transformation", "discovery"], notes: "Apr 10 meeting occurred; outcomes not yet logged. Need to confirm meeting results and next steps.",
    assignedTo: "Jacques", heatScore: 45,
    salesStatus: "appointment-scheduled",
    location: { lat: 32.7767, lng: -96.7970, city: "Dallas", state: "TX", zip: "75201", address: "Dallas, TX" },
  },
  {
    id: "lead-003",
    contact: {
      id: "c-003", firstName: "Jean", lastName: "Gardais", email: "jean.gardais@hatfinancial.com",
      phone: "", title: "Managing Director", company: "HAT Financial Group / ECERES Haiti", avatar: "",
    },
    vertical: "other", service: "transformation-management", stage: "qualified", source: "referral",
    region: "cemac", currency: "USD", dealValue: 75000, sowCost: 40000, monthlyRetainer: 5000,
    probability: 35, grossMargin: 60, createdAt: daysAgo(30), lastActivity: daysAgo(3),
    expectedCloseDate: daysFromNow(30), staleDays: 0,
    tags: ["haiti", "financial", "international"], notes: "Follow-up meeting scheduled (date TBD — Dashboard had Apr 18 but that's a Saturday). Hugues Joseph involved. ECERES Haiti engagement.",
    assignedTo: "Jacques", heatScore: 55,
    salesStatus: "prospect",
    location: { lat: 18.5944, lng: -72.3074, city: "Port-au-Prince", state: "HT", zip: "", address: "Port-au-Prince, Haiti" },
  },
  {
    id: "lead-004",
    contact: {
      id: "c-004", firstName: "Bertrand", lastName: "Cambou", email: "bcambou@highentropysecurity.com",
      phone: "", title: "CEO", company: "High Entropy Security / ANNINF Gabon", avatar: "",
    },
    vertical: "other", service: "sovereign-ai", stage: "negotiation", source: "partner",
    region: "cemac", currency: "USD", dealValue: 150000, sowCost: 80000, monthlyRetainer: 10000,
    probability: 40, grossMargin: 55, createdAt: daysAgo(45), lastActivity: daysAgo(0),
    expectedCloseDate: daysFromNow(30), staleDays: 0,
    tags: ["gabon", "incubation", "high-value", "active-today"], notes: "ANNINF/HES meeting held today Apr 16. Cristy Salanga coordinating. Andre Bouassa ($PAY REM) presenting. Both-sides HES agreement. Anti-jamming video from Bertrand reviewed.",
    assignedTo: "Jacques", heatScore: 72,
    salesStatus: "proposal-sent",
    location: { lat: 0.4162, lng: 9.4673, city: "Libreville", state: "GA", zip: "", address: "Libreville, Gabon" },
  },
  {
    id: "lead-005",
    contact: {
      id: "c-005", firstName: "FarmMate CEO", lastName: "(Ghana)", email: "sunjianshan@camce.com.cn",
      phone: "", title: "Project Lead", company: "FarmMate Agri-Processing / CAMC China", avatar: "",
    },
    vertical: "other", service: "transformation-management", stage: "proposal", source: "partner",
    region: "cemac", currency: "USD", dealValue: 200000, sowCost: 100000, monthlyRetainer: 15000,
    probability: 20, grossMargin: 50, createdAt: daysAgo(30), lastActivity: daysAgo(6),
    expectedCloseDate: daysFromNow(90), staleDays: 6,
    tags: ["ghana", "agriculture", "high-value", "$200M-project"], notes: "$200M+ feasibility project. CAMC (China) partner. Kickoff Apr 13. FarmMate CEO flagged timeline reset — dedicated team needed. CAMCE meeting minutes from Apr 10 pending review. CAMC questionnaire needs update.",
    assignedTo: "Jacques", heatScore: 48,
    salesStatus: "proposal-sent",
    location: { lat: 5.6037, lng: -0.1870, city: "Accra", state: "GH", zip: "", address: "Accra, Ghana" },
  },
  {
    id: "lead-006",
    contact: {
      id: "c-006", firstName: "GSA", lastName: "Federal Channel", email: "vendor.support@gsa.gov",
      phone: "(877) 495-4849", title: "Contracting", company: "General Services Administration", avatar: "",
    },
    vertical: "other", service: "sovereign-ai", stage: "qualified", source: "cold-outreach",
    region: "us", currency: "USD", dealValue: 100000, sowCost: 50000, monthlyRetainer: 8000,
    probability: 15, grossMargin: 60, createdAt: daysAgo(120), lastActivity: daysAgo(0),
    expectedCloseDate: daysFromNow(60), staleDays: 0,
    tags: ["federal", "gsa", "urgent", "sam-gov-risk"], notes: "Contract 47QTCA23D005F. SAM.gov deactivation crisis — 6+ notices Apr 8-15. SBA profile CAGE 9ADF9 flagged inactive. New eBuy RFI1806070 (HUD Talino Workstations) due Apr 17 5pm EDT. Bid/no-bid decision needed.",
    assignedTo: "Jacques", heatScore: 30,
    salesStatus: "contacted",
    location: { lat: 38.8951, lng: -77.0364, city: "Washington", state: "DC", zip: "20405", address: "1800 F St NW" },
  },
  {
    id: "lead-007",
    contact: {
      id: "c-007", firstName: "Joseph", lastName: "Asante", email: "joseph.asante@yahoo.com",
      phone: "", title: "", company: "", avatar: "",
    },
    vertical: "other", service: "transformation-management", stage: "prospect", source: "referral",
    region: "cemac", currency: "USD", dealValue: 25000, sowCost: 15000, monthlyRetainer: 2000,
    probability: 15, grossMargin: 65, createdAt: daysAgo(15), lastActivity: daysAgo(3),
    expectedCloseDate: daysFromNow(45), staleDays: 3,
    tags: ["reschedule", "no-show"], notes: "No-showed Apr 13 call. Reschedule draft in Outlook Drafts. Needs follow-up.",
    assignedTo: "Jacques", heatScore: 20,
    salesStatus: "contacted",
    location: { lat: 5.6037, lng: -0.1870, city: "Accra", state: "GH", zip: "", address: "Accra, Ghana" },
  },
  {
    id: "lead-008",
    contact: {
      id: "c-008", firstName: "Akainyah", lastName: "(Columbus)", email: "aaakainyah@columbus.gov",
      phone: "", title: "City Contact", company: "City of Columbus, OH", avatar: "",
    },
    vertical: "other", service: "transformation-management", stage: "prospect", source: "event",
    region: "us", currency: "USD", dealValue: 40000, sowCost: 20000, monthlyRetainer: 3000,
    probability: 15, grossMargin: 65, createdAt: daysAgo(14), lastActivity: daysAgo(7),
    expectedCloseDate: daysFromNow(60), staleDays: 7,
    tags: ["government", "city", "cold-follow-up"], notes: "Last reply Apr 9, 7 days cold. Follow-up draft in Outlook Drafts. City IT consulting opportunity.",
    assignedTo: "Jacques", heatScore: 22,
    salesStatus: "contacted",
    location: { lat: 39.9612, lng: -82.9988, city: "Columbus", state: "OH", zip: "43215", address: "Columbus, OH" },
  },
  {
    id: "lead-009",
    contact: {
      id: "c-009", firstName: "Asaha", lastName: "(MIDA)", email: "asaha@midaadvisors.com",
      phone: "", title: "Advisor", company: "MIDA Advisors / American Business Council Gabon", avatar: "",
    },
    vertical: "other", service: "sovereign-ai", stage: "prospect", source: "referral",
    region: "cemac", currency: "USD", dealValue: 50000, sowCost: 25000, monthlyRetainer: 5000,
    probability: 10, grossMargin: 60, createdAt: daysAgo(8), lastActivity: daysAgo(8),
    expectedCloseDate: daysFromNow(90), staleDays: 8,
    tags: ["gabon", "state-dept", "warm-intro"], notes: "State Dept warm intro Apr 8. Follow-up draft in Outlook Drafts. Potential partner for Gabon Incubation program.",
    assignedTo: "Jacques", heatScore: 18,
    salesStatus: "not-contacted",
    location: { lat: 0.4162, lng: 9.4673, city: "Libreville", state: "GA", zip: "", address: "Libreville, Gabon" },
  },
  {
    id: "lead-010",
    contact: {
      id: "c-010", firstName: "Scott", lastName: "(Kaeppel)", email: "scott@kaeppelconsulting.com",
      phone: "", title: "Principal", company: "Kaeppel Consulting", avatar: "",
    },
    vertical: "other", service: "transformation-management", stage: "qualified", source: "referral",
    region: "us", currency: "USD", dealValue: 20000, sowCost: 10000, monthlyRetainer: 2000,
    probability: 20, grossMargin: 65, createdAt: daysAgo(60), lastActivity: daysAgo(30),
    expectedCloseDate: daysFromNow(30), staleDays: 0,
    tags: ["monthly-touchbase", "partner"], notes: "Monthly touch base. Next meeting tomorrow Fri Apr 17 at 11 AM CT (Teams, Katie Sotelo). Ongoing relationship.",
    assignedTo: "Jacques", heatScore: 40,
    salesStatus: "appointment-scheduled",
    location: { lat: 32.7767, lng: -96.7970, city: "Dallas", state: "TX", zip: "75201", address: "Dallas, TX" },
  },
  // ============================================================
  // DFW SMALL BUSINESS PROSPECTS (added 2026-04-16)
  // Target: 5-50 employees, 1-2 locations, owner-operated.
  // Starter package: $3-5K all-in (hardware + setup + first-month retainer).
  // Dropped mid/large companies (Saunders Walsh, Berkeys, franchise dealerships,
  // North Texas PM, Specialized PM) — need separate enterprise track later.
  // ============================================================
  // LEGAL — Small firms (5-15 attorneys)
  {
    id: "lead-dfw-01",
    contact: { id: "c-dfw-01", firstName: "Robert", lastName: "Newton", email: "info@rnnlaw.com", phone: "", title: "Principal Attorney", company: "The Law Office of Robert Newton, PC", avatar: "" },
    vertical: "legal", service: "sovereign-ai", stage: "prospect", source: "cold-outreach",
    region: "us", currency: "USD", dealValue: 5000, sowCost: 3500, monthlyRetainer: 500,
    probability: 10, grossMargin: 70, createdAt: daysAgo(0), lastActivity: daysAgo(0),
    expectedCloseDate: daysFromNow(45), staleDays: 0,
    tags: ["dfw", "legal", "small-biz", "frisco", "solo-firm"], notes: "Frisco-based solo/small firm. Business law, real estate, estate planning. Owner-operator — fast decision maker. Starter package fit.",
    assignedTo: "Jacques", heatScore: 0, salesStatus: "not-contacted",
    location: { lat: 33.1507, lng: -96.8236, city: "Frisco", state: "TX", zip: "75034", address: "Frisco, TX" },
  },
  {
    id: "lead-dfw-02",
    contact: { id: "c-dfw-02", firstName: "Moore Family", lastName: "Law", email: "info@pwm-law.com", phone: "", title: "Managing Attorney", company: "Moore Family Law, P.C.", avatar: "" },
    vertical: "legal", service: "sovereign-ai", stage: "prospect", source: "cold-outreach",
    region: "us", currency: "USD", dealValue: 5000, sowCost: 3500, monthlyRetainer: 500,
    probability: 10, grossMargin: 70, createdAt: daysAgo(0), lastActivity: daysAgo(0),
    expectedCloseDate: daysFromNow(45), staleDays: 0,
    tags: ["dfw", "legal", "small-biz", "family-law", "frisco"], notes: "Frisco-based family law firm. Serves Plano, McKinney. Small firm. Family law handles very sensitive client data — strong Private AI pitch. Starter package fit.",
    assignedTo: "Jacques", heatScore: 0, salesStatus: "not-contacted",
    location: { lat: 33.1507, lng: -96.8236, city: "Frisco", state: "TX", zip: "75034", address: "Frisco, TX" },
  },
  // DENTAL — Small practices (1-2 locations)
  {
    id: "lead-dfw-03",
    contact: { id: "c-dfw-03", firstName: "Fame", lastName: "Dental", email: "info@fame-dental.com", phone: "", title: "Owner", company: "Fame Dental", avatar: "" },
    vertical: "medical", service: "ai-readiness-360", stage: "prospect", source: "cold-outreach",
    region: "us", currency: "USD", dealValue: 4000, sowCost: 3000, monthlyRetainer: 400,
    probability: 10, grossMargin: 75, createdAt: daysAgo(0), lastActivity: daysAgo(0),
    expectedCloseDate: daysFromNow(45), staleDays: 0,
    tags: ["dfw", "dental", "small-biz", "frisco", "single-location"], notes: "Frisco-based single-practice dental office. Owner-operator. Lean starter — AI Readiness assessment first, then starter setup.",
    assignedTo: "Jacques", heatScore: 0, salesStatus: "not-contacted",
    location: { lat: 33.1507, lng: -96.8236, city: "Frisco", state: "TX", zip: "75036", address: "Frisco, TX" },
  },
  {
    id: "lead-dfw-04",
    contact: { id: "c-dfw-04", firstName: "Dr. Nathan", lastName: "Cotton", email: "info@dentalartsoffrisco.com", phone: "", title: "Owner", company: "Dental Arts of Frisco / Paloma Creek Dental", avatar: "" },
    vertical: "medical", service: "sovereign-ai", stage: "prospect", source: "cold-outreach",
    region: "us", currency: "USD", dealValue: 5000, sowCost: 3500, monthlyRetainer: 500,
    probability: 10, grossMargin: 72, createdAt: daysAgo(0), lastActivity: daysAgo(0),
    expectedCloseDate: daysFromNow(45), staleDays: 0,
    tags: ["dfw", "dental", "small-biz", "two-locations", "frisco"], notes: "Dr. Nathan Cotton owns two small dental practices: Dental Arts of Frisco and Paloma Creek Dental. Owner-operator. Two-location scale fits the starter package.",
    assignedTo: "Jacques", heatScore: 0, salesStatus: "not-contacted",
    location: { lat: 33.1507, lng: -96.8236, city: "Frisco", state: "TX", zip: "75034", address: "Frisco, TX" },
  },
  // TRADES — Small service companies (10-30 employees)
  {
    id: "lead-dfw-05",
    contact: { id: "c-dfw-05", firstName: "LEX Air", lastName: "Conditioning", email: "info@lexairconditioning.com", phone: "", title: "Owner", company: "LEX Air Conditioning, Heating, Plumbing & Electrical", avatar: "" },
    vertical: "trades", service: "aegis", stage: "prospect", source: "cold-outreach",
    region: "us", currency: "USD", dealValue: 5000, sowCost: 3500, monthlyRetainer: 500,
    probability: 10, grossMargin: 66, createdAt: daysAgo(0), lastActivity: daysAgo(0),
    expectedCloseDate: daysFromNow(45), staleDays: 0,
    tags: ["dfw", "trades", "small-biz", "hvac", "plano", "owner-operated"], notes: "22+ years serving Frisco. Plano-based, owner-operated. Small HVAC/plumbing/electrical shop. Dispatch + customer follow-up automation is the pitch. Starter package fit.",
    assignedTo: "Jacques", heatScore: 0, salesStatus: "not-contacted",
    location: { lat: 33.0198, lng: -96.6989, city: "Plano", state: "TX", zip: "75024", address: "Plano, TX" },
  },
  {
    id: "lead-dfw-06",
    contact: { id: "c-dfw-06", firstName: "Navigate", lastName: "Property Mgmt", email: "info@nmcpropertymanagement.com", phone: "", title: "Managing Director", company: "Navigate Property Management", avatar: "" },
    vertical: "property-management", service: "transformation-management", stage: "prospect", source: "cold-outreach",
    region: "us", currency: "USD", dealValue: 6000, sowCost: 4000, monthlyRetainer: 750,
    probability: 10, grossMargin: 60, createdAt: daysAgo(0), lastActivity: daysAgo(0),
    expectedCloseDate: daysFromNow(45), staleDays: 0,
    tags: ["dfw", "property", "small-biz", "frisco", "owner-operated"], notes: "Small DFW property management shop. Single-family and small multi-unit. Tenant communication + maintenance scheduling automation. Starter package fit.",
    assignedTo: "Jacques", heatScore: 0, salesStatus: "not-contacted",
    location: { lat: 33.1507, lng: -96.8236, city: "Frisco", state: "TX", zip: "75034", address: "Frisco, TX" },
  },
];

// ---- ACTIVITIES ----
export const SEED_ACTIVITIES: Activity[] = [
  // Gartner
  { id: "a-001", leadId: "lead-001", type: "meeting", title: "Intro Meeting with Eric Jang & Grant Wheeler", description: "First meeting with Gartner advisory practice. Discussed AI Readiness 360 and TechFides positioning.", timestamp: daysAgo(8), automated: false },
  { id: "a-002", leadId: "lead-001", type: "email-sent", title: "Follow-up Draft Created", description: "Draft follow-up email created in Outlook Drafts. References GSA eBuy work and international engagements.", timestamp: daysAgo(0), automated: false },
  // BCA Leadership
  { id: "a-003", leadId: "lead-002", type: "meeting", title: "Meeting with Modupe Taylor-Pearce", description: "Apr 10 meeting occurred. Outcomes pending documentation.", timestamp: daysAgo(6), automated: false },
  // HAT Financial
  { id: "a-004", leadId: "lead-003", type: "meeting", title: "Initial Discussion — ECERES Haiti", description: "Discussed Haiti engagement with Jean Gardais and Hugues Joseph.", timestamp: daysAgo(15), automated: false },
  { id: "a-005", leadId: "lead-003", type: "stage-change", title: "Follow-up Meeting Scheduled", description: "Jean Gardais organizing follow-up meeting. Date TBD (originally Apr 18 but that's a Saturday).", timestamp: daysAgo(3), automated: false },
  // ANNINF Gabon
  { id: "a-006", leadId: "lead-004", type: "meeting", title: "ANNINF/HES Meeting — Live", description: "Pay Rem <> HES Meeting via Google Meet. Bertrand Cambou, Andre Bouassa ($PAY REM), Cristy Salanga, World Class Business. Meeting delayed 20 min for flag ceremony.", timestamp: daysAgo(0), automated: false },
  { id: "a-007", leadId: "lead-004", type: "document-sent", title: "EXECUTED BOTH SIDES AGREEMENT", description: "World Class Business sent executed both-sides agreement. Meeting in 30 minutes at 5 PM Gabon time.", timestamp: daysAgo(1), automated: false },
  { id: "a-008", leadId: "lead-004", type: "email-received", title: "Video MFA — Bertrand Cambou", description: "Dear Cristy and team, Thank you very much for sending the partnership materials.", timestamp: daysAgo(12), automated: false },
  // Ghana/FarmMate
  { id: "a-009", leadId: "lead-005", type: "meeting", title: "FarmMate Kickoff Call", description: "Kickoff call Apr 13. FarmMate CEO flagged timeline reset — dedicated team needed.", timestamp: daysAgo(3), automated: false },
  { id: "a-010", leadId: "lead-005", type: "email-received", title: "CAMCE Meeting Minutes", description: "Meeting minutes received from sunjianshan@camce.com.cn on Apr 10. Pending review.", timestamp: daysAgo(6), automated: false },
  // GSA Federal
  { id: "a-011", leadId: "lead-006", type: "email-received", title: "GSA eBuy RFI1806070 — NEW REQUEST", description: "HUD - 3 Talino Workstations - MRAS. Quote/Bid due Apr 17 5pm EDT. Bid/no-bid decision needed today.", timestamp: daysAgo(0), automated: false },
  { id: "a-012", leadId: "lead-006", type: "email-received", title: "SAM.gov Deactivation Notice #6", description: "6+ deactivation notices received Apr 8-15. Entire federal channel at risk.", timestamp: daysAgo(1), automated: false },
  // Joseph Asante
  { id: "a-013", leadId: "lead-007", type: "call", title: "No-Show — Scheduled Call", description: "Joseph did not join the Apr 13 call. Reschedule needed.", timestamp: daysAgo(3), automated: false },
  { id: "a-014", leadId: "lead-007", type: "email-sent", title: "Reschedule Draft Created", description: "Draft reschedule email created in Outlook Drafts.", timestamp: daysAgo(0), automated: false },
  // Columbus OH
  { id: "a-015", leadId: "lead-008", type: "email-received", title: "Last Reply from City Contact", description: "Last response received Apr 9. 7 days cold.", timestamp: daysAgo(7), automated: false },
  { id: "a-016", leadId: "lead-008", type: "email-sent", title: "Follow-up Draft Created", description: "Draft follow-up email created in Outlook Drafts.", timestamp: daysAgo(0), automated: false },
  // MIDA Advisors
  { id: "a-017", leadId: "lead-009", type: "email-received", title: "State Dept Warm Intro", description: "Introduction received Apr 8 from State Department contact for American Business Council Gabon.", timestamp: daysAgo(8), automated: false },
  { id: "a-018", leadId: "lead-009", type: "email-sent", title: "Follow-up Draft Created", description: "Draft follow-up email created in Outlook Drafts.", timestamp: daysAgo(0), automated: false },
  // Kaeppel
  { id: "a-019", leadId: "lead-010", type: "meeting", title: "Monthly Touch Base Scheduled", description: "Jacques/Scott monthly meeting. Tomorrow Fri Apr 17 at 11 AM CT via Teams. Katie Sotelo attending.", timestamp: daysAgo(0), automated: false },
];

// ---- NURTURE SEQUENCES ----
export const SEED_NURTURE_SEQUENCES: NurtureSequence[] = [
  {
    id: "seq-001",
    name: "Cold Follow-up — Gartner",
    leadId: "lead-001",
    status: "active",
    currentStep: 1,
    startedAt: daysAgo(0),
    triggerReason: "8+ days cold since Apr 8 intro meeting",
    steps: [
      { id: "s1", order: 1, type: "email", subject: "Following up from our April 8 conversation", body: "Follow-up referencing GSA eBuy work and international engagements.", completed: true, sentAt: daysAgo(0) },
      { id: "s2", order: 2, type: "wait", waitDays: 5, completed: false },
      { id: "s3", order: 3, type: "email", subject: "TechFides AI Readiness 360 — Quick Overview", body: "Value-add email with AI Readiness assessment overview.", completed: false },
      { id: "s4", order: 4, type: "wait", waitDays: 7, completed: false },
      { id: "s5", order: 5, type: "task", subject: "Personal follow-up call to Eric Jang", body: "If no response, escalate to direct call.", completed: false },
    ],
  },
];

// ---- SALES GOALS ----
export const SEED_SALES_GOALS: SalesGoal[] = [
  { id: "g-001", label: "2026 Annual Revenue", level: "organization", assignedTo: "TechFides", period: "yearly", periodLabel: "2026", target: 500000, actual: 0, deals: 0, pipelineValue: 740000 },
  { id: "g-002", label: "Q2 2026 Revenue", level: "organization", assignedTo: "TechFides", period: "quarterly", periodLabel: "Q2 2026", target: 125000, actual: 0, deals: 0, pipelineValue: 740000 },
  { id: "g-003", label: "April 2026 Revenue", level: "organization", assignedTo: "TechFides", period: "monthly", periodLabel: "Apr 2026", target: 45000, actual: 0, deals: 0, pipelineValue: 740000 },
  { id: "g-004", label: "Jacques — Q2 Quota", level: "individual", assignedTo: "Jacques", period: "quarterly", periodLabel: "Q2 2026", target: 125000, actual: 0, deals: 0, pipelineValue: 740000 },
];

// ---- FORECAST DATA ----
export const SEED_QUARTERLY_FORECAST: ForecastPoint[] = [
  { label: "Q1 2026", projected: 0, actual: 0, target: 100000 },
  { label: "Q2 2026", projected: 185000, actual: 0, target: 125000 },
  { label: "Q3 2026", projected: 275000, actual: 0, target: 150000 },
  { label: "Q4 2026", projected: 280000, actual: 0, target: 175000 },
];

export const SEED_MONTHLY_FORECAST: ForecastPoint[] = [
  { label: "Jan", projected: 0, actual: 0, target: 30000 },
  { label: "Feb", projected: 0, actual: 0, target: 32000 },
  { label: "Mar", projected: 0, actual: 0, target: 35000 },
  { label: "Apr", projected: 45000, actual: 0, target: 45000 },
  { label: "May", projected: 75000, actual: 0, target: 42000 },
  { label: "Jun", projected: 65000, actual: 0, target: 40000 },
  { label: "Jul", projected: 80000, actual: 0, target: 48000 },
  { label: "Aug", projected: 95000, actual: 0, target: 50000 },
  { label: "Sep", projected: 100000, actual: 0, target: 52000 },
  { label: "Oct", projected: 90000, actual: 0, target: 55000 },
  { label: "Nov", projected: 95000, actual: 0, target: 58000 },
  { label: "Dec", projected: 95000, actual: 0, target: 62000 },
];

// ---- SURVEY RESPONSES ----
export const SEED_SURVEYS: SurveyResponse[] = [];
