# Project Codex: The TechFides Velocity Engine

**Status:** Blueprint v2.0 — Adapted to TechFides 2.0 Architecture
**Last Updated:** 2026-04-11
**Owner:** Jacques Jean

> A sovereign, 24/7 autonomous sales machine that runs on TechFides' own infrastructure — eating its own dog food. The Velocity Engine handles **Hunt → Qualify → Nurture → Hand-off**, delivering "Closing-Ready" dossiers to the human executive team via the existing GSE dashboards.

---

## 0. Decision: Integration Path

**This is NOT an extension of the onboarding tools.** The two systems serve completely different stages of the customer lifecycle:

| System | Stage | Purpose |
|---|---|---|
| **Velocity Engine + GSE** | Pre-sale | Hunt, qualify, nurture, close |
| **Onboarding Tools** (`/onboarding/[id]`) | Post-sale | Provision, configure, train clients |

**Recommendation:** The Velocity Engine becomes the **autonomous AI backend layer that powers the existing GSE** (`src/app/gse/*`). The current GSE dashboards are the human-facing command center; the Velocity Engine is the brain feeding them. The existing data model in `src/lib/gse/types.ts` already has 90% of the schema we need (`Lead`, `Activity`, `NurtureSequence`, `DealRoom`, `heatScore`) — the Velocity Engine populates and acts on it.

### Architecture at a Glance

```
┌─────────────────────────────────────────────────────────┐
│  TechFides 2.0 — Marketing Site (Public)                │
│  src/app/(public pages)                                 │
└────────────────────┬────────────────────────────────────┘
                     │ inbound leads (contact form, etc.)
                     ▼
┌─────────────────────────────────────────────────────────┐
│  VELOCITY ENGINE (NEW — backend services)               │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐         │
│  │Intelligence│→ │  Persona   │→ │   Logic    │         │
│  │  Engine    │  │  Engine    │  │  Engine    │         │
│  └────────────┘  └────────────┘  └────────────┘         │
│         ▲              ▲              │                 │
│         │              │              ▼                 │
│         │       ┌──────────────────────────┐            │
│         │       │  Behavioral Signal Bus   │            │
│         │       │  (Email/LinkedIn/Site)   │            │
│         │       └──────────────────────────┘            │
│         │                     │                         │
└─────────┼─────────────────────┼─────────────────────────┘
          │                     │
          │                     ▼
┌─────────┴───────────────────────────────────────────────┐
│  GSE — Command Engine (EXISTS — src/app/gse/*)          │
│  • /gse — dashboard                                     │
│  • /gse/leads — Closing-Ready queue                     │
│  • /gse/pipeline — Kanban view                          │
│  • /gse/forecast — Revenue projections                  │
│  • /gse/nurture — Active sequences                      │
│  • /gse/deal-room/[id] — Closing room                   │
│  • /gse/analytics — Win/Loss feedback loop              │
└─────────────────────┬───────────────────────────────────┘
                      │ Won/Lost feedback
                      ▼
          (back into Intelligence Engine for self-tuning)

POST-CLOSE (separate flow):
GSE → /onboarding/[id] → Client provisioning
```

---

## 1. Core System Modules

The solution consists of four interlocking engines, each a distinct backend service that reads/writes to a shared PostgreSQL database and communicates via an internal event bus.

### 1.1 The Intelligence Engine — *The Hunter*

**Mission:** Daily ingestion of 50 high-fit leads with deep enrichment.

**Responsibilities:**
- Ingest raw leads from Apollo, Clay, ZoomInfo, LinkedIn Sales Navigator, or web scrapers
- Trigger an Enrichment Agent (a local LLM) that pulls:
  - Last 90 days of company news (via NewsAPI, Google News RSS, or scraping)
  - Prospect's recent LinkedIn activity (posts, comments, job changes)
  - Public financial data (10-Ks, press releases, funding announcements)
  - Tech stack signals (BuiltWith, Wappalyzer)
  - AI Readiness signals (job postings mentioning AI/ML, RFPs, recent breaches)
- Tier classification:
  - **Tier 1:** $250K – $250M annual revenue (SMB/Mid-Market)
  - **Tier 2:** $250M – $2B annual revenue (Enterprise)
  - **Tier 3 (reject):** <$250K or >$2B (out of ICP)
- Vertical fit scoring against existing TechFides verticals: Legal, Medical, Auto, Trades, Property Management
- Geographic eligibility: US, Mexico (Guadalajara), CEMAC (Libreville), aligning with `src/lib/gse/types.ts` Region enum

**Output:** Writes to `Lead` table (existing schema in `src/lib/gse/types.ts`) with `stage: "prospect"`, `source: "cold-outreach" | "linkedin"`, `heatScore: 0`, populated `vertical`, `region`, `currency`, and a new `enrichmentJson` blob.

### 1.2 The Persona Engine — *The Messenger*

**Mission:** Hyper-personalized, multi-channel outreach at scale using local LLMs.

**Responsibilities:**
- Generate 5-step bespoke email/LinkedIn sequences using Llama 3, Mistral, or Phi running locally on TechFides GPUs
- Each step incorporates:
  - **Personalization Anchor:** A specific reference to enrichment data (e.g., "Saw your Q3 earnings call mention of AI governance challenges")
  - **Pain Point Hook:** Mapped from the prospect's vertical to TechFides solution
  - **Value Proposition:** Tier-appropriate (Silver/Gold/Platinum) with specific savings estimates
- Multi-channel orchestration:
  - **Email:** Via Domain Swarm (Instantly.ai, Smartlead, or self-hosted Postal)
  - **LinkedIn:** Via Phantombuster, Expandi, or Sales Navigator API
- Compliance:
  - CAN-SPAM unsubscribe in every email
  - GDPR consent tracking for EU prospects
  - Suppression list enforcement
  - Send time optimization per timezone

**Output:** Creates `NurtureSequence` records (existing type) and `Activity` records of type `email-sent` (existing type).

### 1.3 The Logic Engine — *The Brain*

**Mission:** Real-time behavioral scoring and decision-making.

**Responsibilities:**
- Ingest behavioral signals via webhooks:
  - Email opens, link clicks, replies (from Postmark, SendGrid, Instantly)
  - LinkedIn message reads, profile views
  - Website visits (via tracking pixel on TechFides 2.0 marketing pages)
  - Pricing page interactions (calculator usage, tier selections)
  - Document views in deal rooms
- Calculate `heatScore` (0–100) using weighted signals:
  - Reply: +30
  - Multiple opens within 24h: +10
  - Pricing page visit: +15
  - Calculator usage with high cloud spend: +20
  - Deal room document view: +25
  - Inbound contact form submission: +40
- Decision triggers:
  - `heatScore > 70` → move to "Closing-Ready" queue, alert human
  - `heatScore 40-70` → continue nurture sequence
  - `heatScore < 40` after 5 touches → move to long-term nurture
  - `replied: true` → immediately escalate to human
- Self-tuning: Analyzes `closed-won` vs `closed-lost` patterns from the GSE feedback loop and adjusts scoring weights weekly

**Output:** Updates `Lead.heatScore` and `Lead.stage`, creates `Activity` records, fires events to the Command Engine.

### 1.4 The Command Engine — *The Dashboard*

**Mission:** Human-facing interface for deal management. **This is the existing GSE — no new UI needs to be built from scratch.**

**Existing GSE pages that map to Velocity Engine functions:**

| GSE Page | Velocity Engine Role |
|---|---|
| `/gse` (dashboard) | Top-level KPIs from Logic Engine |
| `/gse/leads` | Filtered by `heatScore > 70` = Closing-Ready Queue |
| `/gse/leads/[id]` | Renders the Closing-Ready Dossier |
| `/gse/pipeline` | Kanban with auto-updated stages |
| `/gse/nurture` | Active sequences from Persona Engine |
| `/gse/forecast` | Self-tuning revenue projections |
| `/gse/deal-room/[id]` | Closing tools with payment integration |
| `/gse/analytics` | Win/Loss feedback loop visualization |
| `/gse/map` | Geographic distribution of enriched leads |
| `/gse/surveys` | Post-close NPS feeds back into Intelligence Engine |

**New additions to GSE (minimal UI work):**
- Add a "Velocity Engine Status" widget on `/gse` showing: leads ingested today, sequences active, replies this week, queue depth
- Add a "Re-train" button on `/gse/analytics` to manually trigger feedback loop recalibration
- Add a "Lookalike Search" button on closed-won deals to trigger `POST /v1/leads/find-lookalikes`

---

## 2. Technical API Architecture

All endpoints are versioned under `/api/v1/` and live in `src/app/api/v1/*` as Next.js Route Handlers. Authentication is via JWT bearer tokens issued by NextAuth.js. Rate limiting is enforced via Upstash Redis.

### 2.A Inbound Data & Lead Enrichment API

#### `POST /api/v1/leads/ingest`

Accepts raw lead data from scrapers and triggers the Enrichment Agent.

**Request:**
```json
{
  "source": "apollo",
  "leads": [
    {
      "firstName": "Jane",
      "lastName": "Doe",
      "email": "jane@acme.com",
      "title": "VP of Operations",
      "company": "Acme Healthcare",
      "linkedinUrl": "https://linkedin.com/in/janedoe",
      "rawData": { /* full scraper payload */ }
    }
  ]
}
```

**Response:**
```json
{
  "ingested": 1,
  "rejected": 0,
  "enrichmentJobIds": ["enr_abc123"]
}
```

**Behavior:**
1. Deduplicates against existing leads by email
2. Creates a stub `Lead` record with `stage: "prospect"`, `heatScore: 0`
3. Queues an enrichment job in BullMQ
4. Returns immediately (async enrichment)

#### `POST /api/v1/leads/enrich/:leadId`

Internal endpoint called by the enrichment worker. Pulls news, LinkedIn activity, financials, and tech stack data. Updates the Lead with enriched fields.

#### `GET /api/v1/leads/scoring`

Evaluates leads against Tier 1/Tier 2 financial parameters.

**Query params:** `?tier=1&vertical=medical&minScore=70`

**Response:** Array of Lead objects matching criteria.

#### `POST /api/v1/leads/find-lookalikes`

Triggered when a deal closes won. Takes the closed lead's enrichment profile and queries Apollo/Clay for prospects with similar firmographics.

**Request:** `{ "sourceLeadId": "lead_xyz" }`
**Response:** `{ "lookalikesFound": 12, "ingestionJobId": "job_abc" }`

### 2.B Agentic Outreach API

#### `POST /api/v1/outreach/generate-sequence`

Sends prospect context to a local LLM and generates a 5-step bespoke sequence.

**Request:**
```json
{
  "leadId": "lead_xyz",
  "channel": "email",
  "tone": "executive",
  "model": "llama3-70b"
}
```

**Response (constraint: must return valid JSON):**
```json
{
  "sequenceId": "seq_abc",
  "steps": [
    {
      "order": 1,
      "delayDays": 0,
      "subject": "Acme's Q3 AI governance gap",
      "body": "Jane, saw your earnings call mention of...",
      "personalizationAnchor": "Q3 earnings call mention",
      "cta": "15-min discovery call"
    }
  ]
}
```

#### `POST /api/v1/outreach/send`

Interfaces with the Domain Swarm (Instantly.ai API) to send via rotating sender accounts.

**Request:**
```json
{
  "sequenceId": "seq_abc",
  "stepOrder": 1,
  "leadId": "lead_xyz"
}
```

**Behavior:**
1. Selects a healthy sender domain from the rotation pool
2. Sends via the selected provider's API
3. Records `Activity { type: "email-sent", automated: true }`
4. Schedules the next step based on `delayDays`

#### `POST /api/v1/outreach/pause`

Pauses a sequence (e.g., when prospect replies or unsubscribes).

### 2.C Behavioral Intent API — *The Signal Tracker*

#### `POST /api/v1/signals/webhook`

Generic webhook endpoint that accepts events from email providers, LinkedIn tools, and the website tracking pixel.

**Request:**
```json
{
  "provider": "instantly",
  "event": "click",
  "leadId": "lead_xyz",
  "timestamp": "2026-04-11T14:30:00Z",
  "metadata": {
    "url": "https://techfides.com/pricing",
    "userAgent": "..."
  }
}
```

**Behavior (delegated to Logic Engine):**
- `event === "reply"` → set `stage: "qualified"`, `heatScore += 30`, fire alert
- `event === "open"` and count > 1 in 24h → `heatScore += 10`
- `event === "click"` and URL contains `/pricing` → `heatScore += 15`
- `event === "click"` and URL contains `ai-readiness-360` → `heatScore += 20`
- After every signal: re-evaluate triggers, fire `dashboard/ready-to-close` if threshold crossed

#### `POST /api/v1/signals/website-pixel`

Lightweight tracking pixel for the marketing site. Embedded as a `<script>` tag on key pages (pricing, contact, solutions). Identifies known leads via UTM tags and IP intelligence (Clearbit Reveal).

### 2.D Dashboard & Closing API

#### `GET /api/v1/dashboard/priority-queue`

Fetches all prospects with `heatScore > 70` for the human closers.

**Response:** Array of Closing-Ready Dossiers (see Section 3).

#### `PUT /api/v1/dashboard/ready-to-close`

Internal endpoint. Called by the Logic Engine when a lead crosses the threshold. Triggers a real-time alert via:
- WebSocket push to the GSE dashboard (using Pusher or Ably)
- Slack notification to #sales channel
- SMS to assigned closer (Twilio)
- Email to assigned closer

#### `PATCH /api/v1/deals/status`

Updates a deal to `closed-won` or `closed-lost`.

**Request:**
```json
{
  "leadId": "lead_xyz",
  "status": "closed-won",
  "dealValue": 125000,
  "closeReason": "competitor_displacement",
  "notes": "Won on data sovereignty argument"
}
```

**Feedback Loop Triggers:**
- `closed-won` → `POST /api/v1/leads/find-lookalikes` + `POST /api/v1/onboarding/initialize` (hands off to existing onboarding tool)
- `closed-lost` → `POST /api/v1/nurture/long-term` + log loss reason for the Logic Engine retraining

#### `POST /api/v1/nurture/long-term`

Moves a lost or cold lead into a 6-month low-frequency nurture (1 touch every 30 days, content-driven).

---

## 3. The Closing-Ready Dossier

When the Logic Engine hands a lead to a human, the API compiles a JSON dossier rendered on `/gse/leads/[id]`:

```json
{
  "leadId": "lead_xyz",
  "prospectName": "Jane Doe",
  "title": "VP of Operations",
  "company": "Acme Healthcare",
  "companyTier": "Tier 2 ($1.2B Rev)",
  "vertical": "medical",
  "region": "us",
  "intentScore": 92,
  "triggerEvent": "Clicked 'AI Readiness 360' link 3 times in 48h",
  "painPoints": [
    "High cloud latency on Epic EHR integrations",
    "PHI sovereignty concerns post-Change Healthcare breach",
    "Vendor lock-in with current Azure OpenAI deployment"
  ],
  "recommendedHook": "Mention $1.5M projected savings via local Phi/Llama deployment vs current Azure spend",
  "recommendedTier": "Gold",
  "estimatedDealValue": 125000,
  "interactionHistory": [
    { "step": 1, "channel": "email", "status": "opened", "timestamp": "2026-04-08T14:00:00Z" },
    { "step": 2, "channel": "email", "status": "clicked_cta", "timestamp": "2026-04-09T09:30:00Z" },
    { "step": 3, "channel": "linkedin", "status": "viewed_profile", "timestamp": "2026-04-10T11:00:00Z" }
  ],
  "enrichmentSnapshot": {
    "recentNews": ["Acme announces Q3 AI initiative, March 2026"],
    "techStack": ["Epic", "Azure", "ServiceNow"],
    "linkedinSignals": ["Posted about AI governance, 5 days ago"],
    "financials": { "revenue": "$1.2B", "employees": 4500, "fundingStage": "public" }
  },
  "assignedCloser": "jacques@techfides.com",
  "alertChannels": ["slack", "sms", "email"]
}
```

**Implementation note:** This dossier is compiled by the Logic Engine and stored in a `dossiers` table, refreshed on every signal. The GSE renders it via a new tab on the existing lead detail page.

---

## 4. Deployment Strategy: The Sovereign Stack

To align with TechFides 2.0's "eat your own dog food" philosophy, the Velocity Engine runs on TechFides' own infrastructure — no third-party AI APIs.

### 4.1 Recommended Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| **API Framework** | Next.js 14 Route Handlers (`src/app/api/v1/*`) | Same codebase as the marketing site and GSE — single deploy, single auth, single type system |
| **Backend Language** | TypeScript | Matches existing GSE types in `src/lib/gse/types.ts`, no context-switching for the team |
| **Primary Database** | PostgreSQL 16 (self-hosted or Supabase) | Structured Lead/Activity/Deal data, ACID compliance for financials |
| **Vector Database** | Qdrant (self-hosted) or Milvus | AI memory for the Persona Engine — embeds enrichment data, prior conversations, win/loss patterns. Qdrant recommended over Pinecone (sovereign, self-hostable) |
| **Job Queue** | BullMQ + Redis | Async enrichment, sequence delivery, signal processing |
| **Cache & Rate Limiting** | Redis (Upstash for managed, or self-hosted) | Hot data, session storage, API rate limits |
| **Local LLMs** | vLLM serving Llama 3.3 70B + Phi-3 + Mistral 7B on TechFides GPU instances | Sovereign — no data leaves the network. vLLM > Ollama for production throughput |
| **LLM Orchestration** | LangChain.js or Vercel AI SDK | Type-safe agent definitions, retry/fallback logic |
| **Email Delivery** | Postal (self-hosted) or Postmark + Domain Swarm via Instantly.ai | Sovereign + deliverability |
| **LinkedIn Automation** | Phantombuster API or Expandi | LinkedIn doesn't have a sanctioned API for outreach |
| **Lead Enrichment** | Apollo.io API + Clay.com + custom scrapers | Hybrid: APIs for structured data, scrapers for news/social |
| **Real-time Alerts** | Pusher Channels or Ably (or self-hosted Soketi) | WebSocket push to GSE dashboard |
| **Slack Integration** | Slack Web API + Bolt.js | #sales notifications |
| **SMS Alerts** | Twilio | Closer notifications |
| **Auth** | NextAuth.js (already in repo plans) | Same auth for marketing site, GSE, and Velocity Engine |
| **Observability** | Sentry (errors) + PostHog (product analytics) + Grafana (infra) | All self-hostable for sovereignty |
| **Secrets** | HashiCorp Vault or Doppler | NEVER in `.env` files committed to git |
| **Encryption** | PostgreSQL `pgcrypto` for PII columns + TLS everywhere | End-to-end encryption for PII |

### 4.2 Infrastructure Topology

```
TechFides Sovereign Cloud
├── App Tier (Next.js — marketing + GSE + Velocity API)
│   ├── 2x app servers behind a load balancer
│   └── Edge cache for static marketing pages
├── Worker Tier (BullMQ workers)
│   ├── Enrichment workers (3x)
│   ├── Outreach workers (2x)
│   └── Signal processors (2x)
├── AI Tier (GPU instances)
│   ├── vLLM serving Llama 3.3 70B (2x A100 80GB)
│   ├── vLLM serving Phi-3 (1x A100 40GB)
│   └── Embedding model (BGE-large or jina-embeddings-v2)
├── Data Tier
│   ├── PostgreSQL primary + read replica
│   ├── Qdrant vector DB
│   └── Redis cluster (cache + queue)
└── Observability
    ├── Sentry (errors)
    ├── Grafana + Prometheus (metrics)
    └── Loki (logs)
```

### 4.3 Repository Structure

The Velocity Engine lives in the **same monorepo** as TechFides 2.0 (extending the existing Next.js project), not a separate service:

```
techfides-2.0/
├── src/
│   ├── app/
│   │   ├── (existing marketing pages)
│   │   ├── gse/                    # EXISTING — UI layer (Command Engine)
│   │   └── api/                    # NEW — Velocity Engine API
│   │       └── v1/
│   │           ├── leads/
│   │           ├── outreach/
│   │           ├── signals/
│   │           ├── dashboard/
│   │           └── deals/
│   ├── lib/
│   │   ├── gse/                    # EXISTING — types, store, seed data
│   │   └── velocity/               # NEW — engines
│   │       ├── intelligence/       # Hunter
│   │       ├── persona/            # Messenger
│   │       ├── logic/              # Brain
│   │       ├── llm/                # Local LLM client (vLLM)
│   │       ├── enrichment/         # Apollo, Clay, scrapers
│   │       ├── outreach/           # Email + LinkedIn adapters
│   │       └── signals/            # Webhook processors
│   └── workers/                    # NEW — BullMQ background jobs
│       ├── enrichmentWorker.ts
│       ├── outreachWorker.ts
│       └── signalWorker.ts
├── prisma/                         # NEW — database schema
│   └── schema.prisma
└── docs/
    └── VELOCITY-ENGINE-BLUEPRINT.md  # this file
```

### 4.4 Database Schema (Prisma)

Extends the existing `Lead`, `Activity`, `NurtureSequence`, `DealRoom` types from `src/lib/gse/types.ts` and adds:

- `Enrichment` — JSON blob of news, LinkedIn, financials per lead
- `Dossier` — Cached Closing-Ready Dossier (regenerated on every signal)
- `Signal` — Raw event log for audit + ML retraining
- `SequenceTemplate` — LLM-generated sequence templates with performance stats
- `LookalikeJob` — Tracks lookalike searches triggered by closed-won deals
- `ScoringWeights` — Versioned scoring weights for the Logic Engine (allows rollback)
- `LossReason` — Structured loss feedback for retraining

---

## 5. Security & Compliance

This section is non-negotiable given TechFides' positioning on sovereignty.

| Control | Implementation |
|---|---|
| **PII Encryption at Rest** | PostgreSQL `pgcrypto` for `email`, `phone`, `linkedinUrl` columns |
| **PII Encryption in Transit** | TLS 1.3 everywhere, including internal service-to-service |
| **Secret Management** | HashiCorp Vault — no secrets in env files or git |
| **Authentication** | NextAuth.js with MFA enforced for GSE access |
| **Authorization** | Row-level security in PostgreSQL, scoped by tenant/territory |
| **Audit Logging** | Every API call logged to immutable audit log (S3 with object lock or self-hosted MinIO) |
| **GDPR Compliance** | Right-to-be-forgotten endpoint, consent tracking per lead |
| **CAN-SPAM** | Unsubscribe link auto-injected, suppression list enforced |
| **CCPA** | "Do Not Sell" honored for California prospects |
| **HIPAA** | If processing prospect data from healthcare orgs, BAA required with any third-party tool — keep enrichment local where possible |
| **Data Residency** | EU prospects processed in EU region, US in US region |
| **Backup & Recovery** | Encrypted PostgreSQL backups every 6h, 30-day retention, quarterly restore drills |
| **Penetration Testing** | Annual third-party pentest, quarterly internal scans (OWASP ZAP, Trivy) |

---

## 6. Success Metrics — The Money Machine KPIs

| KPI | Target | Measurement |
|---|---|---|
| **Lead Ingestion Volume** | 50 enriched leads/day | `Lead` records created with `source ∈ {cold-outreach, linkedin}` |
| **Email Deliverability** | >98% | Bounce rate from Postmark/Instantly + spam complaint rate <0.1% |
| **Open Rate** | >40% (industry avg 15-25%) | `Activity { type: email-opened }` / sent |
| **Reply Rate** | >5% | `Activity { type: email-received }` / sent |
| **Meeting Conversion** | 5% of daily leads reach Closing-Ready (heatScore > 70) | Lead transitions per day |
| **AI-to-Human Hand-off Time** | <5 minutes from threshold cross to alert delivery | Timestamp diff in audit log |
| **Closing Cycle Time** | <14 days from Closing-Ready to Closed-Won | `Lead.createdAt` → `closed-won` timestamp |
| **Win Rate** | >25% on Closing-Ready leads | `closed-won` / (`closed-won` + `closed-lost`) |
| **Self-Optimization** | +15% open rate month-over-month for first 6 months | Logic Engine retraining effectiveness |
| **Cost per Closed Deal** | <$500 (vs $2K+ industry avg for B2B SaaS) | Total infra + tooling cost / closed deals |
| **Lookalike Conversion Lift** | 2x baseline conversion on lookalike-sourced leads | A/B vs cold-source leads |

---

## 7. Phased Rollout Plan

### Phase 1 — Foundation (Weeks 1-4)
- Set up PostgreSQL + Prisma schema extending existing GSE types
- Build `POST /api/v1/leads/ingest` and basic enrichment via Apollo API
- Wire up the existing `/gse/leads` page to read from real database (currently uses seed data from `src/lib/gse/data.ts`)
- Add NextAuth.js for GSE access control
- Deploy first vLLM instance with Llama 3.3 70B

### Phase 2 — Outreach (Weeks 5-8)
- Build Persona Engine with sequence generation
- Integrate Instantly.ai or Smartlead for email delivery
- Build webhook receiver for email events
- Add the Domain Swarm (purchase 5-10 sender domains, warm them up)

### Phase 3 — Intelligence (Weeks 9-12)
- Build the full enrichment pipeline (news, LinkedIn, tech stack)
- Implement the Logic Engine scoring algorithm
- Build the Closing-Ready Dossier compiler
- Wire up real-time alerts (Slack, SMS, WebSocket to GSE)

### Phase 4 — Self-Optimization (Weeks 13-16)
- Implement the Win/Loss feedback loop
- Build lookalike search on closed-won deals
- Retrain the scoring weights weekly based on outcomes
- Add the long-term nurture flow for lost deals

### Phase 5 — Scale (Weeks 17+)
- Add LinkedIn automation (Phantombuster/Expandi)
- Multi-tenant support if selling Velocity Engine as a product
- Add SMS outbound channel (Twilio)
- Build the public-facing "Velocity Engine" product page on the marketing site

---

## 8. Strategic Implications

By building the Velocity Engine, TechFides moves from a **service provider** to a **product-led AI powerhouse**:

1. **Eat Your Own Dog Food:** The Velocity Engine running on TechFides' own sovereign stack becomes the most powerful sales asset — every closed deal is a case study.
2. **Productize It:** Once proven internally, the Velocity Engine can be sold as a Sovereign AI Sales Product to TechFides clients (every law firm, medical group, and dealership wants this).
3. **Competitive Moat:** No Apollo, Outreach, Salesloft, or HubSpot competitor offers a fully sovereign, self-hosted version. TechFides becomes the only option for compliance-sensitive industries.
4. **Margin Multiplication:** Reduces cost per deal by an estimated 75%, freeing the human team to focus exclusively on closing — not prospecting.

---

## 9. Open Questions for the Team

1. **Build vs Buy for the Domain Swarm?** Instantly.ai is fastest to launch but adds a non-sovereign dependency. Self-hosted Postal is slower to set up but fully owned. **Recommendation:** Start with Instantly, migrate to self-hosted Postal in Phase 5.
2. **LinkedIn risk tolerance?** Phantombuster/Expandi are gray-hat — LinkedIn can ban accounts. **Recommendation:** Use throwaway warm accounts for cold outreach, never the executive team's personal accounts.
3. **GPU costs for local LLMs?** A100 80GB instances are ~$1,500/mo each. **Recommendation:** Start with 2x A100s, scale as volume justifies. Compare TCO vs Azure OpenAI ($0.03/1K tokens) — local wins above ~50M tokens/month.
4. **Multi-region deployment?** Mexico and CEMAC offices may need local data residency. **Recommendation:** Start US-only, add regional deployments in Phase 5 if EU/MX prospects justify it.
5. **Integration with existing onboarding?** When a deal closes, the Velocity Engine should hand off to the onboarding tools at `/onboarding/[id]`. **Recommendation:** Add a `POST /api/v1/onboarding/initialize` endpoint that creates the onboarding workspace from the closed-won lead's data.

---

## 10. Definition of Done

The Velocity Engine is "done" when:

- [ ] 50 enriched leads ingested daily without manual intervention
- [ ] 5 outreach sequences generated and sent per lead by local LLMs (zero OpenAI/Anthropic API calls)
- [ ] All behavioral signals captured and scored in real-time
- [ ] Closing-Ready Dossiers automatically compiled and pushed to the GSE
- [ ] Sub-5-minute alert delivery to human closers
- [ ] Win/Loss feedback loop retraining the scoring weights weekly
- [ ] Lookalike search firing on every closed-won deal
- [ ] All KPIs in Section 6 hitting targets for 30 consecutive days
- [ ] Pentest completed with zero critical findings
- [ ] Documentation, runbooks, and on-call rotation in place

---

**This is the blueprint. The next deliverable is a Phase 1 sprint plan with story-pointed tickets in GitHub Projects.**
