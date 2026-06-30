# ShopEZ Trade — Stock Trading Platform

A full-stack MERN (MongoDB, Express, React, Node.js) simulated stock trading platform. Users can browse live market data, execute buy/sell trades with virtual funds, track their portfolio P&L, and view trade history. Admins can manage the stock listings and monitor all platform activity.

## Stack

- **Frontend**: React 18 + Vite, React Router v6, Recharts, Lucide icons
- **Backend**: Node.js + Express, JWT authentication, bcryptjs
- **Database**: MongoDB (optional) with automatic JSON file fallback — no MongoDB installation required

## Running the Project

Two workflows are configured and start automatically:

| Workflow | Command | Port |
|---|---|---|
| Backend API | `cd backend && npm install && npm start` | 5000 |
| Frontend | `cd frontend && npm install && npm run dev` | 3000 |

The frontend proxies `/api/*` requests to the backend on port 5000.

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Investor | investor@shopez.com | investor123 |
| Admin | admin@shopez.com | admin123 |

## Features

### Investor (USER role)
- Browse the **Live Market** — 10 pre-seeded stocks with 30-day price history charts
- Search and filter stocks by sector, sort by market cap / price / volume
- **Buy / Sell** stocks with a $50,000 virtual starting balance
- **Portfolio** page — live P&L on all holdings
- **Trade History** — full log of all buy/sell transactions

### Admin (ADMIN role)
- **Overview** — total users, trade volume, 7-day activity charts, top-traded stocks
- **Stock Management** — create, edit, update price, delete stock listings
- **Users** — view all registered accounts and balances
- **Transactions** — full platform-wide trade log

## Architecture

```
backend/src/
  models/          User, Stock, Transaction, Portfolio
  controllers/     auth, stock, transaction, portfolio, admin
  routes/          /api/auth, /api/stocks, /api/trades, /api/portfolio, /api/admin
  middleware/      auth.js (requireAuth, requireUser, requireAdmin)
  config/db.js     MongoDB + JSON file fallback (MockModel)

frontend/src/
  pages/           Market, StockDetail, Portfolio, TradeHistory, Auth, AdminDashboard
  components/      Navbar, Footer
  context/         AuthContext, TradeContext
  data/            mockDatabase.js (offline fallback)
```

## Security Notes

- JWT secret uses `JWT_SECRET` env var → falls back to `SESSION_SECRET` → hardcoded default (dev only)
- Admin role cannot execute trades (enforced at both API and UI level)
- Balance rollback on trade failure to prevent state corruption

## User Preferences

_No preferences recorded yet._
