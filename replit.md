# Nexus Impact Group (NIG) Marketing Website

## Overview
A stunning, futuristic marketing website for Nexus Impact Group - a fully integrated ecosystem with 15 divisions plus the NIG Core hub. The site showcases all divisions covering safety, identity, automation, finance, connection, entertainment, health, and global trade. Features a Master Ecosystem Command Center with AI-powered executive agents, specialist agents, daily executive briefs, approval workflows, and full audit trail execution logging.

## Design System
- **Nexus Blue**: #0B1B3F (primary dark background)
- **Impact Gold**: #DAA520 (accent, highlights)
- **Neon Cyan**: #14C1D7 (interactive elements, glows)
- **Typography**: Montserrat (headings), Inter (body), JetBrains Mono (technical/code)

## Project Structure
```
client/
├── src/
│   ├── components/
│   │   ├── Hero.tsx             # Hero section with 3D scene + video modal
│   │   ├── EcosystemGrid.tsx    # Division grid with logos
│   │   ├── DivisionShowcase.tsx # Deep-dive into each division
│   │   ├── CaseStudies.tsx      # Success stories & testimonials
│   │   ├── Timeline.tsx         # NIG journey roadmap
│   │   ├── ComparisonCharts.tsx # NIG vs competitors
│   │   ├── SocialProof.tsx      # Stats & testimonial carousel
│   │   ├── BookingSection.tsx   # Calendly + callback request
│   │   ├── FAQ.tsx              # Categorized FAQ accordion
│   │   ├── QuoteForm.tsx        # App development quote request
│   │   ├── Blog.tsx             # News & updates section
│   │   ├── ContactDialog.tsx    # Contact form modal
│   │   ├── Footer.tsx           # Newsletter signup
│   │   └── Navigation.tsx       # Site header
│   ├── pages/
│   │   ├── Home.tsx             # Main landing page
│   │   └── CommandCenter.tsx    # Master Command Center Dashboard
│   └── App.tsx                  # Router setup
├── index.html                   # SEO meta tags
└── index.css                    # Global styles, animations

server/
├── agents/
│   ├── orchestratorAgent.ts     # Master Orchestrator - daily briefs, proposals, cross-business intelligence
│   ├── specialistAgents.ts      # Opportunity Hunter, Revenue Generator, Growth Engine, System Optimizer
│   ├── cfoAgent.ts              # CFO Agent - financial analysis
│   ├── cooAgent.ts              # COO Agent - operations analysis
│   ├── ctoAgent.ts              # CTO Agent - technical analysis
│   ├── cmoAgent.ts              # CMO Agent - marketing analysis
│   ├── chroAgent.ts             # CHRO Agent - HR analysis
│   ├── scheduler.ts             # Automated scheduler with health checks, alerts, daily briefs
│   └── division/
│       ├── cmoDivisionAgents.ts # Social Media, SEO, Content agents
│       └── ctoDivisionAgents.ts # DevOps, Security, Architecture agents
├── routes.ts                    # API endpoints
├── storage.ts                   # Database interface (Drizzle)
└── index.ts                     # Express server

shared/
└── schema.ts                    # Database schema
```

## 15 Divisions (14 + NIG Core)
1. **C.A.R.E.N.** - Citizen Assistance for Roadside Encounters and Navigation (carenalert.com)
2. **Real Pulse Verifier** - True Identity Validation
3. **My Life Assistant** - AI Personal Concierge (mylifeassistant.vip)
4. **The Remedy Club** - Credit & Debt Freedom (theremedyclub.vip)
5. **NIG Core Ecosystem** - Central Intelligence Hub
6. **Rent-A-Buddy** - Platonic Connection (rent-a-buddy.info)
7. **Eternal Chase** - Immersive Entertainment (eternalchase.stream)
8. **Project DNA Music** - Shakim & Project DNA - Sonic Engineering (projectdnamusic.info)
9. **Zapp Marketing and Manufacturing** - 40,000+ products, global trade (zapp-ecommerce.online)
10. **Studio Artist Live** - Creative Performance Platform (studioartistlive.com)
11. **Right Time Notary** - Mobile Notary Services
12. **The Shock Factor** - Podcast Entertainment
13. **ClearSpace** - iPhone Image Cleaner (clearspace.photos)
14. **CAD and Me** - Coronary Artery Disease Audiobook by S. Williams
15. **Global Trade Facilitators** - GSM-102 USDA Export Credit Guarantee (globaltradefacilitators.us.com)

## Database Tables
PostgreSQL with Drizzle ORM:
- `users` - User accounts
- `inquiries` - Contact form submissions
- `subscribers` - Newsletter signups
- `quote_requests` - App development quote requests
- `callback_requests` - Phone callback requests
- `blog_posts` - Blog/news articles
- `divisions` - NIG ecosystem divisions
- `division_metrics` - Division KPIs
- `incidents` - Incident tracking
- `financial_snapshots` - Financial data
- `agent_logs` - Agent activity audit trail
- `orchestrator_proposals` - Task proposals requiring approval
- `execution_reports` - Full execution audit trail with quality scores
- `agent_memory` - Shared AI memory for learning
- `daily_briefs` - Stored daily executive briefs

## Master Ecosystem Command Center

### Architecture (6 Layers)
1. **AI Brain** - GPT-4o via OpenAI (Replit AI Integrations)
2. **Master Orchestrator** - Universal Business Orchestrator above all executives
3. **Executive Agents** - CFO, COO, CTO, CMO, CHRO
4. **Division Agents** - Social Media, SEO, Content, DevOps, Security, Architecture
5. **Specialist Agents** - Opportunity Hunter, Revenue Generator, Growth Engine, System Optimizer
6. **Monitoring & Control** - Scheduler, alerts, execution reports, memory system

### Master Orchestrator
- Generates Daily Executive Briefs with 9 structured sections
- Creates task proposals with priority scoring (1-100)
- Manages approval workflows (pending → approved → executed)
- Cross-business intelligence between divisions
- Full execution logging with quality reviews

### Executive Agents (C-Suite)
| Agent | Color | Focus |
|-------|-------|-------|
| CFO Agent | Gold | Financial intelligence - revenue, costs, projections |
| COO Agent | Cyan | Operations - division health, bottlenecks, efficiency |
| CTO Agent | Green | Technical - uptime, security, performance, architecture |
| CMO Agent | Purple | Marketing - brand health, campaigns, growth opportunities |
| CHRO Agent | Pink | HR - team capacity, hiring needs, productivity |

### Specialist Agents
| Agent | Focus |
|-------|-------|
| Opportunity Hunter | Growth, partnerships, investment, market expansion |
| Revenue Generator | Monetization, cross-selling, new revenue streams |
| Growth Engine | Marketing campaigns, viral opportunities, funnel optimization |
| System Optimizer | Efficiency, automation, workflow improvements |

### Division Agents
**CMO Division:** Social Media, SEO, Content
**CTO Division:** DevOps, Security, Architecture

### Automated Scheduler
- Executive Health Check (every 30 min)
- Alert Scan (every 15 min)
- Daily Summary (daily at 9 AM)
- Daily Executive Brief (daily at 9 AM)
- Cross-Business Synergy Scan (weekly)

### API Endpoints
**Orchestrator:**
- `POST /api/orchestrator/daily-brief` - Generate daily executive brief
- `GET /api/orchestrator/daily-brief/latest` - Get latest brief
- `POST /api/orchestrator/ask` - Ask orchestrator a question
- `POST /api/orchestrator/cross-business` - Run cross-business analysis
- `GET /api/orchestrator/overview` - Ecosystem overview

**Proposals & Approvals:**
- `POST /api/proposals` - Create proposal
- `GET /api/proposals` - Get proposals (filterable by status)
- `PUT /api/proposals/:id/approve` - Approve
- `PUT /api/proposals/:id/reject` - Reject
- `POST /api/proposals/:id/execute` - Execute approved proposal

**Specialist Agents:**
- `POST /api/specialist/opportunity-hunter`
- `POST /api/specialist/revenue-generator`
- `POST /api/specialist/growth-engine`
- `POST /api/specialist/system-optimizer`

**Reports & Memory:**
- `GET /api/execution-reports` - Execution audit trail
- `GET /api/memory` - Agent memory entries
- `POST /api/memory` - Store memory entry

**Executive Agents:**
- `/api/cfo/*`, `/api/coo/*`, `/api/cto/*`, `/api/cmo/*`, `/api/chro/*`

**Division Agents:**
- `/api/division/cmo/*`, `/api/division/cto/*`

**System:**
- `/api/scheduler/*`, `/api/alerts`

## Command Center UI Panels
1. **Orchestrator** - Master orchestrator with daily brief generation, cross-business analysis, Q&A
2. **Dashboard** - Division status, agent activity, system stats
3. **Approvals** - Pending proposals with approve/reject/execute actions
4. **Specialists** - Opportunity Hunter, Revenue Generator, Growth Engine, System Optimizer
5. **Exec Agents** - CFO, COO, CTO, CMO, CHRO panels with analysis & Q&A
6. **Reports** - Execution reports with quality scores and audit details
7. **Memory** - AI memory entries with category filtering

## User Preferences
- Futuristic, tech-forward design aesthetic
- NIG logo with intertwining rings for Core Ecosystem
- "Zapp Marketing" renamed to "Zapp Marketing and Manufacturing"
- Master agent system based on uploaded planning documents
