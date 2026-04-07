# Nexus Impact Group (NIG) Marketing Website

## Overview
The Nexus Impact Group (NIG) marketing website is designed to be a futuristic showcase for a comprehensive ecosystem comprising 15 divisions, including the central NIG Core hub. This platform highlights divisions across various sectors such as safety, identity, automation, finance, connection, entertainment, health, and global trade. A key feature is the Master Ecosystem Command Center, which integrates AI-powered executive and specialist agents, provides daily executive briefs, manages approval workflows, and maintains a full audit trail of all executions. The project aims to consolidate NIG's diverse offerings into a cohesive digital presence, demonstrating its innovative approach and market leadership in integrated solutions.

## User Preferences
- Futuristic, tech-forward design aesthetic
- NIG logo with intertwining rings for Core Ecosystem
- "Zapp Marketing" renamed to "Zapp Marketing and Manufacturing"
- Master agent system based on uploaded planning documents

## System Architecture

### UI/UX Decisions
The website adopts a futuristic, tech-forward design aesthetic.
- **Color Scheme**: Nexus Blue (#0B1B3F) as primary dark background, Impact Gold (#DAA520) for accents, and Neon Cyan (#14C1D7) for interactive elements.
- **Typography**: Montserrat for headings, Inter for body text, and JetBrains Mono for technical content.
- **Components**: Includes a Hero section with a 3D scene, an Ecosystem Grid for divisions, detailed Division Showcases, Case Studies, a company Timeline, Comparison Charts, Social Proof elements, Booking/Quote/Contact forms, a Blog, and a comprehensive Navigation.

### Technical Implementations
The application is structured with a `client` (React-based frontend) and a `server` (Node.js/Express backend) with a `shared` module for common schemas.
- **Frontend**: Built with React, featuring dynamic components for each section and pages for the Home and Command Center.
- **Backend**: Express.js server managing API routes, agent logic, and database interactions.
- **Database**: PostgreSQL with Drizzle ORM for data management.

### Feature Specifications
- **Master Ecosystem Command Center**: A central dashboard providing AI-driven insights and control.
    - **AI Brain**: Powered by GPT-4o via OpenAI for advanced intelligence.
    - **Agent Hierarchy**: Features a layered architecture including a Master Orchestrator, Executive Agents (CFO, COO, CTO, CMO, CHRO), Division Agents (e.g., CMO, CTO divisions), and Specialist Agents (Opportunity Hunter, Revenue Generator, Growth Engine, System Optimizer).
    - **Daily Briefs & Proposals**: The Master Orchestrator generates structured daily executive briefs and task proposals with priority scoring, managing approval workflows and logging executions.
    - **Automated Scheduler**: Handles tasks like Executive Health Checks, Alert Scans, Daily Summaries, Daily Executive Briefs, and Cross-Business Synergy Scans.
- **Sales CRM Agent**: An AI-powered CRM integrated into the Command Center.
    - **Contact & Deal Management**: Features for managing contacts and per-division sales pipelines with stages.
    - **AI Capabilities**: AI-generated personalized outreach drafts, cross-division recommendations, and contact summaries.
    - **Data Import**: CSV import functionality for contacts.
- **Security Integrity Agent**: An AI-powered security monitoring panel within the Command Center.
    - **Security Scans**: GPT-4o analyzes platform signals to detect threats, anomalies, and integrity issues across all NIG apps.
    - **Risk Management**: Assigns 5 risk levels (INFO, LOW, MEDIUM, HIGH, CRITICAL) to findings, with management tools for findings and incidents.
    - **Event Logging & Escalation**: Logs security events with auto-escalation for high-severity issues.

### System Design Choices
- **Self-Hosted Deployment**: Designed for deployment outside Replit using Docker, with `Dockerfile` and `docker-compose.yml` configurations.
- **Environment Variables**: Utilizes `.env.example` for required variables, ensuring portability.
- **Authentication**: Conditionally loads Replit OIDC auth; uses simple session middleware for self-hosted environments.
- **OpenAI Integration**: Shared client (`openaiClient.ts`) handles OpenAI API key fallback logic.

## External Dependencies
- **OpenAI**: For GPT-4o integration, powering AI agents (Master Orchestrator, Executive Agents, Specialist Agents, CRM Agent, Security Integrity Agent).
- **PostgreSQL**: Relational database for storing all application data.
- **Drizzle ORM**: ORM for interacting with the PostgreSQL database.
- **Express.js**: Backend web application framework.
- **React**: Frontend JavaScript library for building user interfaces.
- **Vite**: Frontend build tool.
- **Calendly**: Integration for booking and callback requests.