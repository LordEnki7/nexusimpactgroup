# NIG Division Status Endpoint

Copy `nig-status-endpoint.js` into each of your division apps to allow the NIG Command Center to collect live data.

## Setup

1. Copy `nig-status-endpoint.js` into your division app
2. Add to your Express app:
   ```js
   import { nigStatusHandler } from "./nig-status-endpoint.js";
   app.get("/api/nig-status", nigStatusHandler);
   ```
3. Set these environment variables in your division app:
   ```
   NIG_API_KEY=same-key-as-in-command-center
   DIVISION_NAME=C.A.R.E.N.
   ```
4. Customize `getMetrics()` to return real data from your database

## What the Command Center collects

| Field | Description |
|-------|-------------|
| `status` | live / maintenance / degraded / offline |
| `health` | 0-100 score |
| `activeUsers` | Current active users |
| `revenue` | Monthly revenue (USD) |
| `subscribers` | Total subscribers |
| `uptime` | 30-day uptime % |
| `metrics` | Any custom key/value metrics |

## Collection Schedule

The Command Center polls every **30 minutes** automatically.
You can also trigger manual collection from the Command Center dashboard.
