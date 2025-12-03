## Client — StudySprint Web App

React + Vite single‑page app for browsing blogs, reading posts, commenting, and administering content.

### Tech Stack
- **Core:** React 19, React Router, Axios
- **UI:** Ant Design, @ant-design/icons
- **Content:** Quill editor, Marked, DOMPurify
- **Utils:** React Hot Toast, i18next/react-i18next, Moment.js

### Quick Start
```bash
# 1. Copy environment file (already configured for local development)
cp .env.example .env

# 2. Install dependencies
npm install

# 3. Start development server (port 5173)
npm run dev
```

### Environment
The `.env` file should contain:
```
VITE_BASE_URL=http://localhost:5001
```

This is already configured in `.env.example` for local development.

For the full feature list and endpoints, see `../server/README.md`.

### Notes
- Axios `baseURL` is `import.meta.env.VITE_BASE_URL`
- On login, JWT is stored and attached to `Authorization` header
- Rich text HTML is stored in the database; Quill renders/edits content
- i18next handles internationalization (currently English)
- DOMPurify sanitizes HTML content for safe rendering
- Moment.js formats dates throughout the application

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
