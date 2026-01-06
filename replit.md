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
│   │   ├── Hero.tsx           # Hero section with 3D scene
│   │   ├── EcosystemGrid.tsx  # Division grid with logos
│   │   ├── DivisionShowcase.tsx # Deep-dive into each division
│   │   ├── ContactDialog.tsx  # Contact form modal
│   │   ├── Footer.tsx         # Newsletter signup
│   │   └── Navigation.tsx     # Site header
│   ├── pages/
│   │   └── Home.tsx           # Main landing page
│   └── App.tsx                # Router setup
├── index.html                 # SEO meta tags
└── index.css                  # Global styles, animations

server/
├── routes.ts      # API endpoints for inquiries/newsletter
├── storage.ts     # Database interface (Drizzle)
└── index.ts       # Express server

shared/
└── schema.ts      # Database schema (inquiries, subscribers)
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

## Database
PostgreSQL with Drizzle ORM:
- `inquiries` - Contact form submissions
- `subscribers` - Newsletter signups

## API Endpoints
- `POST /api/inquiries` - Submit contact form
- `POST /api/subscribe` - Newsletter signup
- `GET /api/inquiries` - List all inquiries (admin)

## Recent Changes (Jan 2026)
- Added all 13 division logos to EcosystemGrid
- Updated DivisionShowcase with full division details
- Updated ContactDialog dropdown with all divisions
- Enhanced SEO meta tags
- Fixed TypeScript types for division icons/logos

## User Preferences
- Futuristic, tech-forward design aesthetic
- NIG logo with intertwining rings for Core Ecosystem
- "Zapp Marketing" renamed to "Zapp Marketing and Manufacturing"
