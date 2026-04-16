// ============================================================
// TechFides GSE — Mock / Seed Data
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
      id: "c-001", firstName: "Sarah", lastName: "Mitchell", email: "sarah@mitchelllaw.com",
      phone: "(214) 555-0142", title: "Managing Partner", company: "Mitchell & Associates Law Firm", avatar: "",
    },
    vertical: "legal", service: "sovereign-ai", stage: "negotiation", source: "referral",
    region: "us", currency: "USD", dealValue: 10000, sowCost: 10000, monthlyRetainer: 1000,
    probability: 75, grossMargin: 68, createdAt: daysAgo(45), lastActivity: daysAgo(1),
    expectedCloseDate: daysFromNow(7), staleDays: 0,
    tags: ["high-priority", "legal", "hipaa-adjacent"], notes: "Needs client privilege AI. Very interested after demo.",
    assignedTo: "Jacques", referralPartner: "BlueSignal", dealRoomId: "dr-001", dealRoomStatus: "viewed",
    heatScore: 87,
    salesStatus: "accepted",
    location: { lat: 32.9483, lng: -96.7299, city: "Frisco", state: "TX", zip: "75034", address: "5600 Tennyson Pkwy" },
  },
  {
    id: "lead-002",
    contact: {
      id: "c-002", firstName: "Dr. Michael", lastName: "Chen", email: "mchen@brightsmiledental.com",
      phone: "(469) 555-0198", title: "Owner", company: "BrightSmile Dental Group", avatar: "",
    },
    vertical: "medical", service: "sovereign-ai", stage: "proposal", source: "website",
    region: "us", currency: "USD", dealValue: 15000, sowCost: 15000, monthlyRetainer: 1500,
    probability: 50, grossMargin: 72, createdAt: daysAgo(30), lastActivity: daysAgo(3),
    expectedCloseDate: daysFromNow(21), staleDays: 3,
    tags: ["multi-site", "hipaa", "medical"], notes: "3 locations. HIPAA compliance is the top concern.",
    assignedTo: "Jacques", heatScore: 65,
    salesStatus: "proposal-sent",
    location: { lat: 33.0198, lng: -96.6989, city: "Plano", state: "TX", zip: "75024", address: "8300 Preston Rd" },
  },
  {
    id: "lead-003",
    contact: {
      id: "c-003", firstName: "Marcus", lastName: "Johnson", email: "mjohnson@johnsonhvac.com",
      phone: "(972) 555-0234", title: "Owner", company: "Johnson HVAC & Plumbing", avatar: "",
    },
    vertical: "trades", service: "sovereign-ai", stage: "qualified", source: "linkedin",
    region: "us", currency: "USD", dealValue: 5000, sowCost: 5000, monthlyRetainer: 500,
    probability: 25, grossMargin: 65, createdAt: daysAgo(14), lastActivity: daysAgo(5),
    expectedCloseDate: daysFromNow(30), staleDays: 5,
    tags: ["trades", "small-biz"], notes: "Wants to automate dispatch scheduling and customer follow-ups.",
    assignedTo: "Jacques", heatScore: 52,
    salesStatus: "contacted",
    location: { lat: 32.7767, lng: -96.7970, city: "Dallas", state: "TX", zip: "75201", address: "1400 Main St" },
  },
  {
    id: "lead-004",
    contact: {
      id: "c-004", firstName: "Angela", lastName: "Torres", email: "atorres@texasautoplex.com",
      phone: "(817) 555-0176", title: "GM", company: "Texas AutoPlex", avatar: "",
    },
    vertical: "auto", service: "sovereign-ai", stage: "prospect", source: "cold-outreach",
    region: "us", currency: "USD", dealValue: 12000, sowCost: 12000, monthlyRetainer: 1000,
    probability: 10, grossMargin: 70, createdAt: daysAgo(7), lastActivity: daysAgo(7),
    expectedCloseDate: daysFromNow(60), staleDays: 7,
    tags: ["auto", "new-lead"], notes: "Initial outreach. No response yet.",
    assignedTo: "Jacques", nurtureStatus: "active", nurtureSequenceId: "seq-001", heatScore: 18,
    salesStatus: "not-contacted",
    location: { lat: 32.7555, lng: -97.3308, city: "Fort Worth", state: "TX", zip: "76102", address: "500 Commerce St" },
  },
  {
    id: "lead-005",
    contact: {
      id: "c-005", firstName: "Robert", lastName: "Williams", email: "rwilliams@premierproperties.com",
      phone: "(214) 555-0321", title: "CEO", company: "Premier Properties Management", avatar: "",
    },
    vertical: "property-management", service: "transformation-management", stage: "qualified", source: "event",
    region: "us", currency: "USD", dealValue: 15000, sowCost: 15000, monthlyRetainer: 2500,
    probability: 30, grossMargin: 60, createdAt: daysAgo(21), lastActivity: daysAgo(2),
    expectedCloseDate: daysFromNow(45), staleDays: 0,
    tags: ["enterprise", "multi-site", "property"], notes: "Met at DFW Business AI Summit. Manages 200+ units.",
    assignedTo: "Jacques", heatScore: 58,
    salesStatus: "appointment-scheduled",
    location: { lat: 32.8668, lng: -96.7836, city: "Richardson", state: "TX", zip: "75080", address: "100 N Central Expy" },
  },
  {
    id: "lead-006",
    contact: {
      id: "c-006", firstName: "Lisa", lastName: "Park", email: "lpark@parkfamilylaw.com",
      phone: "(469) 555-0087", title: "Senior Partner", company: "Park Family Law", avatar: "",
    },
    vertical: "legal", service: "ai-readiness-360", stage: "proposal", source: "referral",
    region: "us", currency: "USD", dealValue: 5000, sowCost: 5000, monthlyRetainer: 500,
    probability: 60, grossMargin: 75, createdAt: daysAgo(18), lastActivity: daysAgo(1),
    expectedCloseDate: daysFromNow(10), staleDays: 0,
    tags: ["legal", "assessment-first"], notes: "Wants AI Readiness assessment before committing to full deployment.",
    assignedTo: "Jacques", referralPartner: "Sarah Mitchell", dealRoomId: "dr-002", dealRoomStatus: "sent",
    heatScore: 72,
    salesStatus: "proposal-sent",
    location: { lat: 33.0237, lng: -96.8228, city: "Frisco", state: "TX", zip: "75033", address: "3100 Preston Rd" },
  },
  {
    id: "lead-007",
    contact: {
      id: "c-007", firstName: "David", lastName: "Ramirez", email: "dramirez@ramirezelectric.com",
      phone: "(817) 555-0445", title: "Owner", company: "Ramirez Electrical Services", avatar: "",
    },
    vertical: "trades", service: "aegis", stage: "closed-won", source: "partner",
    region: "us", currency: "USD", dealValue: 12000, sowCost: 12000, monthlyRetainer: 1500,
    probability: 100, grossMargin: 66, createdAt: daysAgo(90), lastActivity: daysAgo(10),
    expectedCloseDate: daysAgo(15), staleDays: 0,
    tags: ["trades", "closed", "aegis"], notes: "Signed and onboarded. AEGIS deployment for field ops.",
    assignedTo: "Jacques", dealRoomId: "dr-003", dealRoomStatus: "completed", heatScore: 95,
    salesStatus: "client",
    location: { lat: 32.8140, lng: -97.1367, city: "Arlington", state: "TX", zip: "76010", address: "200 E Main St" },
  },
  {
    id: "lead-008",
    contact: {
      id: "c-008", firstName: "Jennifer", lastName: "Blake", email: "jblake@blakevethospital.com",
      phone: "(972) 555-0553", title: "Practice Manager", company: "Blake Veterinary Hospital", avatar: "",
    },
    vertical: "medical", service: "sovereign-ai", stage: "closed-lost", source: "website",
    region: "us", currency: "USD", dealValue: 8000, sowCost: 8000, monthlyRetainer: 750,
    probability: 0, grossMargin: 70, createdAt: daysAgo(60), lastActivity: daysAgo(25),
    expectedCloseDate: daysAgo(5), staleDays: 25,
    tags: ["medical", "lost", "budget"], notes: "Lost to budget constraints. Re-engage in Q3.",
    assignedTo: "Jacques", heatScore: 12,
    salesStatus: "lost",
    location: { lat: 33.1507, lng: -96.8236, city: "McKinney", state: "TX", zip: "75070", address: "1700 N Central Expy" },
  },
  // Additional leads for richer map view
  {
    id: "lead-009",
    contact: {
      id: "c-009", firstName: "Tony", lastName: "Reeves", email: "treeves@reevesauto.com",
      phone: "(214) 555-0611", title: "Owner", company: "Reeves Auto Group", avatar: "",
    },
    vertical: "auto", service: "sovereign-ai", stage: "prospect", source: "linkedin",
    region: "us", currency: "USD", dealValue: 10000, sowCost: 10000, monthlyRetainer: 1000,
    probability: 15, grossMargin: 68, createdAt: daysAgo(5), lastActivity: daysAgo(5),
    expectedCloseDate: daysFromNow(50), staleDays: 5,
    tags: ["auto", "linkedin"], notes: "Connected on LinkedIn. Liked our private AI post.",
    assignedTo: "Jacques", heatScore: 25,
    salesStatus: "contacted",
    location: { lat: 32.9857, lng: -96.8300, city: "Carrollton", state: "TX", zip: "75006", address: "2200 E Trinity Mills Rd" },
  },
  {
    id: "lead-010",
    contact: {
      id: "c-010", firstName: "Maria", lastName: "Santos", email: "msantos@santosdentalcare.com",
      phone: "(469) 555-0744", title: "DDS", company: "Santos Dental Care", avatar: "",
    },
    vertical: "medical", service: "sovereign-ai", stage: "prospect", source: "referral",
    region: "us", currency: "USD", dealValue: 8000, sowCost: 8000, monthlyRetainer: 750,
    probability: 20, grossMargin: 71, createdAt: daysAgo(3), lastActivity: daysAgo(3),
    expectedCloseDate: daysFromNow(45), staleDays: 3,
    tags: ["medical", "referral", "dental"], notes: "Referred by Dr. Chen (lead-002). Interested in HIPAA-compliant AI.",
    assignedTo: "Jacques", referralPartner: "Dr. Michael Chen", heatScore: 35,
    salesStatus: "not-contacted",
    location: { lat: 32.9126, lng: -96.6389, city: "Allen", state: "TX", zip: "75013", address: "945 W Stacy Rd" },
  },
  {
    id: "lead-011",
    contact: {
      id: "c-011", firstName: "Kevin", lastName: "Oduya", email: "koduya@oduyalaw.com",
      phone: "(972) 555-0892", title: "Attorney", company: "Oduya Legal Group", avatar: "",
    },
    vertical: "legal", service: "ai-readiness-360", stage: "qualified", source: "event",
    region: "us", currency: "USD", dealValue: 5000, sowCost: 5000, monthlyRetainer: 500,
    probability: 30, grossMargin: 74, createdAt: daysAgo(12), lastActivity: daysAgo(1),
    expectedCloseDate: daysFromNow(25), staleDays: 0,
    tags: ["legal", "event-lead"], notes: "Met at DFW AI Summit. Wants assessment first.",
    assignedTo: "Jacques", heatScore: 60,
    salesStatus: "appointment-scheduled",
    location: { lat: 33.0801, lng: -96.8084, city: "The Colony", state: "TX", zip: "75056", address: "4800 Main St" },
  },
  {
    id: "lead-012",
    contact: {
      id: "c-012", firstName: "Rachel", lastName: "Kim", email: "rkim@legacyplumbing.com",
      phone: "(817) 555-0231", title: "Operations Mgr", company: "Legacy Plumbing Co", avatar: "",
    },
    vertical: "trades", service: "aegis", stage: "prospect", source: "website",
    region: "us", currency: "USD", dealValue: 7000, sowCost: 7000, monthlyRetainer: 750,
    probability: 10, grossMargin: 65, createdAt: daysAgo(2), lastActivity: daysAgo(2),
    expectedCloseDate: daysFromNow(60), staleDays: 2,
    tags: ["trades", "plumbing", "website-lead"], notes: "Filled out website form. Interested in field ops automation.",
    assignedTo: "Jacques", heatScore: 20,
    salesStatus: "not-contacted",
    location: { lat: 32.7357, lng: -97.1081, city: "Arlington", state: "TX", zip: "76013", address: "601 W Randol Mill Rd" },
  },
];

// ---- ACTIVITIES ----
export const SEED_ACTIVITIES: Activity[] = [
  { id: "a-001", leadId: "lead-001", type: "email-received", title: "Reply: SOW Review", description: "Sarah confirmed she reviewed the SOW with her partners. Requesting minor edits to SLA section.", timestamp: daysAgo(1), automated: false },
  { id: "a-002", leadId: "lead-001", type: "meeting", title: "Demo Call — Private AI", description: "45-min demo showing local LLM for legal research. Very positive response.", timestamp: daysAgo(8), automated: false },
  { id: "a-003", leadId: "lead-001", type: "deal-room-created", title: "Deal Room Created", description: "Secure deal room portal generated with SOW, NDA, and technical docs.", timestamp: daysAgo(5), automated: true },
  { id: "a-004", leadId: "lead-001", type: "stage-change", title: "Stage: Proposal → Negotiation", description: "Moved to Negotiation after SOW review confirmed.", timestamp: daysAgo(3), automated: false },
  { id: "a-005", leadId: "lead-002", type: "email-sent", title: "Proposal Sent", description: "Sent Private AI proposal with HIPAA compliance addendum for 3 dental locations.", timestamp: daysAgo(3), automated: false },
  { id: "a-006", leadId: "lead-002", type: "call", title: "Discovery Call", description: "30-min call. 3 locations, 45 staff. Main pain: patient records scattered across cloud tools.", timestamp: daysAgo(15), automated: false },
  { id: "a-007", leadId: "lead-003", type: "email-sent", title: "Follow-up: Scheduling Demo", description: "Sent calendar invite for Private AI demo focused on dispatch automation.", timestamp: daysAgo(5), automated: false },
  { id: "a-008", leadId: "lead-003", type: "stage-change", title: "Stage: Prospect → Qualified", description: "Qualified after LinkedIn conversation confirmed budget and timeline.", timestamp: daysAgo(10), automated: false },
  { id: "a-009", leadId: "lead-004", type: "auto-nurture", title: "Auto: Welcome Sequence Email 1", description: "Automated introduction email sent via nurture sequence.", timestamp: daysAgo(6), automated: true },
  { id: "a-010", leadId: "lead-004", type: "auto-nurture", title: "Auto: Value-Add Email — Auto Industry", description: "Automated email with auto dealership AI use cases.", timestamp: daysAgo(3), automated: true },
  { id: "a-011", leadId: "lead-005", type: "meeting", title: "DFW Business AI Summit — Intro", description: "Met at conference. Discussed property management AI needs. Exchanged cards.", timestamp: daysAgo(21), automated: false },
  { id: "a-012", leadId: "lead-005", type: "email-sent", title: "Post-Event Follow-up", description: "Sent personalized follow-up with property management case study.", timestamp: daysAgo(19), automated: false },
  { id: "a-013", leadId: "lead-006", type: "document-sent", title: "AI Readiness 360 Proposal Sent", description: "Sent assessment proposal via deal room.", timestamp: daysAgo(1), automated: true },
  { id: "a-014", leadId: "lead-007", type: "payment-received", title: "Payment: SOW — $12,000", description: "Full SOW payment received via wire transfer.", timestamp: daysAgo(30), automated: false },
  { id: "a-015", leadId: "lead-007", type: "document-signed", title: "SOW Signed", description: "AEGIS SOW signed via deal room e-signature.", timestamp: daysAgo(35), automated: false },
  { id: "a-016", leadId: "lead-008", type: "stage-change", title: "Stage: Negotiation → Closed Lost", description: "Budget constraints. Owner decided to revisit in Q3 2026.", timestamp: daysAgo(25), automated: false },
  { id: "a-017", leadId: "lead-005", type: "email-received", title: "Reply: Interested in Assessment", description: "Robert replied expressing interest. Wants to schedule a call next week.", timestamp: daysAgo(2), automated: false },
];

// ---- NURTURE SEQUENCES ----
export const SEED_NURTURE_SEQUENCES: NurtureSequence[] = [
  {
    id: "seq-001",
    name: "Cold Lead — Auto Vertical",
    leadId: "lead-004",
    status: "active",
    currentStep: 2,
    startedAt: daysAgo(7),
    triggerReason: "No response after 3 days from initial outreach",
    steps: [
      { id: "s1", order: 1, type: "email", subject: "Own Your AI — Built for Auto Dealerships", body: "Introduction to TechFides Private AI for auto operations...", completed: true, sentAt: daysAgo(6) },
      { id: "s2", order: 2, type: "wait", waitDays: 3, completed: true },
      { id: "s3", order: 3, type: "email", subject: "How Dealerships Cut Cloud Costs by 82%", body: "Value-add email with auto industry AI use cases...", completed: true, sentAt: daysAgo(3) },
      { id: "s4", order: 4, type: "wait", waitDays: 4, completed: false },
      { id: "s5", order: 5, type: "email", subject: "Quick Question, Angela", body: "Soft follow-up asking about current AI/tech challenges...", completed: false },
      { id: "s6", order: 6, type: "wait", waitDays: 7, completed: false },
      { id: "s7", order: 7, type: "task", subject: "Manual Follow-up Call", body: "If no response after full sequence, schedule a personal call.", completed: false },
    ],
  },
  {
    id: "seq-002",
    name: "Re-engagement — Lost Deal",
    leadId: "lead-008",
    status: "scheduled",
    currentStep: 0,
    startedAt: "",
    triggerReason: "Closed-Lost 25 days ago. Scheduled Q3 re-engagement.",
    steps: [
      { id: "s8", order: 1, type: "wait", waitDays: 60, completed: false },
      { id: "s9", order: 2, type: "email", subject: "New Options for BrightSmile — TechFides Q3 Update", body: "Re-engagement with new pricing options and case studies...", completed: false },
      { id: "s10", order: 3, type: "wait", waitDays: 5, completed: false },
      { id: "s11", order: 4, type: "email", subject: "Installation Is Still Free — Let's Revisit", body: "Follow-up emphasizing $0 installation and flexible retainer...", completed: false },
      { id: "s12", order: 5, type: "task", subject: "Personal outreach call", body: "Call Jennifer to discuss revised budget options.", completed: false },
    ],
  },
];

// ---- SALES GOALS ----
export const SEED_SALES_GOALS: SalesGoal[] = [
  // Organization level
  { id: "g-001", label: "2026 Annual Revenue", level: "organization", assignedTo: "TechFides", period: "yearly", periodLabel: "2026", target: 500000, actual: 12000, deals: 1, pipelineValue: 87000 },
  { id: "g-002", label: "Q2 2026 Revenue", level: "organization", assignedTo: "TechFides", period: "quarterly", periodLabel: "Q2 2026", target: 125000, actual: 12000, deals: 1, pipelineValue: 87000 },
  { id: "g-003", label: "April 2026 Revenue", level: "organization", assignedTo: "TechFides", period: "monthly", periodLabel: "Apr 2026", target: 45000, actual: 12000, deals: 1, pipelineValue: 87000 },
  // Team level
  { id: "g-004", label: "DFW Sales Team — Q2", level: "team", assignedTo: "DFW Sales", period: "quarterly", periodLabel: "Q2 2026", target: 100000, actual: 12000, deals: 1, pipelineValue: 72000 },
  // Individual level
  { id: "g-005", label: "Jacques — Q2 Quota", level: "individual", assignedTo: "Jacques", period: "quarterly", periodLabel: "Q2 2026", target: 75000, actual: 12000, deals: 1, pipelineValue: 72000 },
  { id: "g-006", label: "Jacques — April Quota", level: "individual", assignedTo: "Jacques", period: "monthly", periodLabel: "Apr 2026", target: 25000, actual: 12000, deals: 1, pipelineValue: 42000 },
];

// ---- FORECAST DATA ----
export const SEED_QUARTERLY_FORECAST: ForecastPoint[] = [
  { label: "Q1 2026", projected: 35000, actual: 28000, target: 100000 },
  { label: "Q2 2026", projected: 95000, actual: 12000, target: 125000 },
  { label: "Q3 2026", projected: 145000, actual: 0, target: 150000 },
  { label: "Q4 2026", projected: 180000, actual: 0, target: 175000 },
];

export const SEED_MONTHLY_FORECAST: ForecastPoint[] = [
  { label: "Jan", projected: 8000, actual: 5000, target: 30000 },
  { label: "Feb", projected: 12000, actual: 10000, target: 32000 },
  { label: "Mar", projected: 18000, actual: 13000, target: 35000 },
  { label: "Apr", projected: 32000, actual: 12000, target: 45000 },
  { label: "May", projected: 38000, actual: 0, target: 42000 },
  { label: "Jun", projected: 45000, actual: 0, target: 40000 },
  { label: "Jul", projected: 48000, actual: 0, target: 48000 },
  { label: "Aug", projected: 52000, actual: 0, target: 50000 },
  { label: "Sep", projected: 55000, actual: 0, target: 52000 },
  { label: "Oct", projected: 58000, actual: 0, target: 55000 },
  { label: "Nov", projected: 62000, actual: 0, target: 58000 },
  { label: "Dec", projected: 68000, actual: 0, target: 62000 },
];

// ---- SURVEY RESPONSES ----
export const SEED_SURVEYS: SurveyResponse[] = [
  {
    id: "srv-001",
    leadId: "lead-007", // David Ramirez — Closed Won
    status: "completed",
    sentAt: daysAgo(9),
    completedAt: daysAgo(7),
    locale: "en",
    scores: {
      projectDelivery: 9,
      technicalAccuracy: 10,
      easeOfImplementation: 8,
      communication: 9,
      problemSolving: 9,
      systemEasiness: 8,
    },
    nps: 10,
    npsCategory: "promoter",
    testimonial: "TechFides transformed our field operations. The local AI handles dispatch scheduling and customer follow-ups without sending any data to the cloud. My technicians love it.",
    improvementSuggestions: "Would be great to have a mobile app for the field team to interact with the AI directly.",
    consentTestimonial: true,
    consentLogo: true,
    consentSocial: true,
    consentVideo: false,
    consentCaseStudy: true,
    referralName: "Marcus Johnson",
    referralEmail: "mjohnson@johnsonhvac.com",
    referralCompany: "Johnson HVAC & Plumbing",
    successCreditApplied: true,
    caseStudyDraft: "Ramirez Electrical Services, a Fort Worth-based electrical contractor, struggled with manual dispatch scheduling and inconsistent customer follow-ups. After deploying TechFides AEGIS on local hardware, the company automated 85% of its scheduling workflow and reduced missed follow-ups by 92%. The system runs entirely on-premise, ensuring client data never leaves the building. Owner David Ramirez reports his team now handles 30% more service calls per week with zero additional admin overhead.",
    socialProofPublished: true,
    executiveAlertTriggered: false,
  },
];
