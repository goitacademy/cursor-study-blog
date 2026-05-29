# StudySprint Agent Guide

Full-stack blog monorepo: React 19 + Vite + **Ant Design 6** client, Express 5 + MongoDB server.

## Conventions

Detailed coding rules live in `.cursor/rules/`. Highlights:

- Start **server** before **client**
- API source of truth: `server/src/routes/`
- Client mirrors routes in `client/src/constants/apiEndpoints.js`
- UI: **Ant Design 6** (`antd`) for all components — see `client/src/App.jsx` for theme
- Reuse existing helpers, hooks, and constants before adding new abstractions

## Quick Start

```bash
# Server
cd server && cp .env.example .env && npm install && npm run setup && npm run server

# Client (separate terminal)
cd client && cp .env.example .env && npm install && npm run dev
```

- API: http://localhost:5001
- Client: http://localhost:5173
- Admin UI: http://localhost:5173/admin

See README files for local credentials and seed data details.
