## StudySprint — Demo Project

StudySprint is a simple full‑stack blog demo used to showcase Cursor's capabilities in web development. It includes a React + Vite client and an Express + MongoDB server, with local file storage for images and Google Gemini for optional AI‑assisted content generation.

---
### Monorepo Structure
- [`client/`](client/README.md) — React 19 app (Vite, Ant Design, React Router, Quill editor, Marked, React Hot Toast, i18next, Moment, DOMPurify)
- [`server/`](server/README.md) — Express 5 API (MongoDB/Mongoose via Docker, JWT auth, Multer, bcryptjs, CORS, Helmet, express-rate-limit, local file storage, Gemini)

### Design
Figma reference: `https://www.figma.com/design/3HUPAs6WgN093rjby8REyr/StudySprint?node-id=8678-14409&t=4kyjZcu1PAlkoznc-1`

For the full feature list and API documentation, see [`server/README.md`](server/README.md).

### First Run Order
1) Start the Server (starts local MongoDB via Docker + seeds data)
2) Start the Client

### Quickstart
See [`server/README.md`](server/README.md) and [`client/README.md`](client/README.md) for detailed steps. Briefly:

**Server**
1. Copy `server/.env.example` to `server/.env` (credentials are pre-configured, but you can customize them)
2. `cd server && npm install`
3. `npm run setup` (starts local MongoDB in Docker + creates schema + seeds test data)
4. `npm run server` (starts API on port 5001)

**Client**
1. Copy `client/.env.example` to `client/.env` (already configured for local development)
2. `cd client && npm install`
3. `npm run dev` (starts dev server on port 5173)

**Admin Login** (after seeding)
- Navigate to `http://localhost:5173/admin`
- Email: `admin@studysprint.com` / Password: `admin123`

### Database
This project uses a **local MongoDB database** running in Docker (no cloud database needed). The database is automatically set up when you run `npm run setup` in the server directory.

To view your data:
- **Mongo Express** (Web UI): `http://localhost:8081` (login with your `MONGODB_USER` / `MONGODB_PASSWORD` from `server/.env`)
- **MongoDB Compass** (Desktop): Connect using your `MONGODB_URI` from `server/.env` (format: `mongodb://USER:PASSWORD@localhost:27017/DATABASE`)

### Environment Variables
See [`server/README.md`](server/README.md) and [`client/README.md`](client/README.md) for complete environment configuration. Server requires database credentials, `JWT_SECRET`, and optionally `GEMINI_API_KEY`. Client only needs `VITE_BASE_URL`.

