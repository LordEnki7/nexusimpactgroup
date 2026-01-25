# Nexus Impact Group (NIG) Marketing Website

## Overview
A stunning, futuristic marketing website for Nexus Impact Group - a fully integrated ecosystem with 13 innovative divisions plus the NIG Core hub. The site showcases all divisions covering safety, identity, automation, finance, connection, entertainment, health, and global trade.

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
│   │   └── Home.tsx             # Main landing page
│   └── App.tsx                  # Router setup
├── index.html                   # SEO meta tags
└── index.css                    # Global styles, animations

server/
├── routes.ts      # API endpoints
├── storage.ts     # Database interface (Drizzle)
└── index.ts       # Express server

shared/
└── schema.ts      # Database schema
```

## 14 Divisions (13 + NIG Core)
1. **C.A.R.E.N.** - Citizen Assistance for Roadside Encounters and Navigation
2. **Real Pulse Verifier** - True Identity Validation
3. **My Life Assistant** - AI Personal Concierge
4. **The Remedy Club** - Credit & Debt Freedom (Mr. Delete Credit Counseling)
5. **NIG Core Ecosystem** - Central Intelligence Hub
6. **Rent-A-Buddy** - Platonic Connection
7. **Eternal Chase** - Immersive Entertainment
8. **Project DNA Music** - Shakim & Project DNA - Sonic Engineering
9. **Zapp Marketing and Manufacturing** - 40,000+ products, global trade
10. **Studio Artist Live** - Creative Performance Platform
11. **Right Time Notary** - Mobile Notary Services
12. **The Shock Factor** - Podcast Entertainment
13. **ClearSpace** - iPhone Image Cleaner
14. **CAD and Me** - Coronary Artery Disease Audiobook by S. Williams

## Database Tables
PostgreSQL with Drizzle ORM:
- `users` - User accounts
- `inquiries` - Contact form submissions
- `subscribers` - Newsletter signups
- `quote_requests` - App development quote requests
- `callback_requests` - Phone callback requests
- `blog_posts` - Blog/news articles

## API Endpoints
- `POST /api/inquiries` - Submit contact form
- `POST /api/subscribe` - Newsletter signup
- `POST /api/quotes` - Submit quote request
- `POST /api/callbacks` - Request callback
- `GET /api/inquiries` - List all inquiries (admin)
- `GET /api/blog` - Get published blog posts
- `GET /api/blog/:slug` - Get single blog post

## Features
- **AI-Generated Hero Video** - Cinematic intro video with modal playback
- **Case Studies** - Interactive success stories with testimonials
- **Timeline** - Visual roadmap of NIG's journey
- **Comparison Charts** - Feature comparison vs competitors
- **Social Proof** - Stats bar and testimonial carousel
- **Booking System** - Callback request form (Calendly placeholder)
- **FAQ Section** - Categorized questions by division
- **Quote Form** - App development inquiry form
- **Blog Section** - Featured + regular posts

## NIG Core AI Agent System

### Executive Agents (C-Suite)
| Agent | Color | Focus |
|-------|-------|-------|
| CFO Agent | Gold | Financial intelligence - revenue, costs, projections |
| COO Agent | Cyan | Operations - division health, bottlenecks, efficiency |
| CTO Agent | Green | Technical - uptime, security, performance, architecture |
| CMO Agent | Purple | Marketing - brand health, campaigns, growth opportunities |
| CHRO Agent | Pink | HR - team capacity, hiring needs, productivity |

### Division Agents (Under Executives)
**CMO Division Agents:**
- Social Media Agent - engagement, followers, viral opportunities
- SEO Agent - search rankings, organic traffic, backlinks
- Content Agent - blog posts, videos, email campaigns

**CTO Division Agents:**
- DevOps Agent - CI/CD, deployments, infrastructure
- Security Agent - vulnerabilities, compliance, threats
- Architecture Agent - tech debt, scalability, code quality

### Automated Scheduler
- Executive Health Check (every 30 min)
- Alert Scan (every 15 min)
- Daily Summary (daily at 9 AM)

### API Endpoints - Agents
- `/api/cfo/*` - CFO analysis & Q&A
- `/api/coo/*` - COO analysis & Q&A
- `/api/cto/*` - CTO analysis & Q&A
- `/api/cmo/*` - CMO analysis & Q&A
- `/api/chro/*` - CHRO analysis & Q&A
- `/api/division/cmo/*` - CMO division agents
- `/api/division/cto/*` - CTO division agents
- `/api/scheduler/*` - Scheduler control
- `/api/alerts` - Alert management

## Recent Changes (Jan 2026)
- Added AI-generated hero video with modal playback
- Created Case Studies section with 5 success stories
- Built Timeline component showing NIG journey 2020-2026
- Added Comparison Charts for 3 divisions
- Implemented Social Proof with stats and testimonial carousel
- Created Booking Section with callback form
- Built comprehensive FAQ with category tabs
- Added Quote Form for app development requests
- Created Blog section with featured posts
- Built 5 Executive AI Agents (CFO, COO, CTO, CMO, CHRO)
- Added 6 Division Agents under CMO and CTO
- Implemented automated scheduler with alerts
- Updated database schema with new tables
- Added all 13 division logos to EcosystemGrid
- Enhanced SEO meta tags

## User Preferences
- Futuristic, tech-forward design aesthetic
- NIG logo with intertwining rings for Core Ecosystem
- "Zapp Marketing" renamed to "Zapp Marketing and Manufacturing"
