---
name: ShopEZ Trade architecture
description: Key design decisions for the stock trading platform conversion — roles, trade safety, DB fallback.
---

## Role System
- Roles are `USER` (investor) and `ADMIN` — not `customer`/`seller`.
- `/api/trades/buy` and `/api/trades/sell` use `requireUser` middleware (not just `requireAuth`) to block admins from trading at the API level.
- `/api/trades/history` uses `requireAuth` so admins can also view if needed.

**Why:** Admins manage listings, not portfolios. Mixing roles in trades corrupts analytics.

## Trade Safety (No Real Transactions)
- JSON file fallback (MockModel) has no transaction support.
- Balance is saved first, then portfolio updated, then transaction created.
- If portfolio or transaction write fails, a rollback restores the original balance.
- Pattern: snapshot `balanceBefore`, save balance, try inner writes, catch → restore balance.

**Why:** Without MongoDB sessions, this is the safest achievable approach for the local JSON DB.

## JWT Secret Hierarchy
- `process.env.JWT_SECRET` → `process.env.SESSION_SECRET` → hardcoded fallback.
- `SESSION_SECRET` is already a Replit-managed secret, so production has a real secret without extra config.

**Why:** Avoids exposing a weak default in production while requiring zero extra setup steps.

## DB Fallback (MockModel)
- `backend/src/config/db.js` exports `createModel(name, schema)` which returns a Proxy.
- When `isUsingLocalDB === true`, all calls route to `MockModel` (reads/writes JSON files in `backend/data/`).
- JSON files auto-created on first run. Wipe `backend/data/*.json` to reset seed data.

## Seed Data
- 10 stocks seeded on first run (AAPL, GOOGL, MSFT, AMZN, TSLA, NVDA, META, NFLX, AMD, INTC).
- Admin: admin@shopez.com, Investor demo: investor@shopez.com.
- Credentials are NOT logged to console (only emails).

## Frontend Offline Fallback
- `frontend/src/data/mockDatabase.js` provides stocks, login, register, portfolio for when backend is down.
- MockDatabase uses in-memory state — resets on page refresh.
