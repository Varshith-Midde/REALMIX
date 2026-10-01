# REALMIX deployment

REALMIX is a full-stack app:
- Frontend: GitHub Pages (`public/`)
- Backend: Render (`server/server.js`)

## 1. Deploy backend on Render
Create a Web Service from this repository:
- Build command: `npm install`
- Start command: `npm start`
- Health check: `/health`

Environment variables:
- `FRONTEND_URL=https://varshith-midde.github.io/REALMIX`
- `GEMINI_API_KEY=...` (only if you want server-side Gemini features)

After deployment, test:
`https://YOUR-RENDER-SERVICE.onrender.com/health`

## 2. Connect GitHub Pages to Render
Edit `public/js/config.js`:

```js
window.REALMIX_API_URL = 'https://YOUR-RENDER-SERVICE.onrender.com';
```

Commit/push. The existing Pages workflow deploys `public/`.

## 3. Important current limitation
REALMIX currently stores data in `data/database.json`. The deployment package intentionally does not include that local database.

A free Render instance has an ephemeral filesystem, so JSON data should be treated as demo/prototype storage. For persistent multi-user production data, migrate the database to PostgreSQL or another persistent database.

## 4. Security note
The current app uses the `x-user-id` header as its identity mechanism. That is suitable for a demo but is not real authentication. Before a public production launch, replace it with server-issued sessions or JWTs and server-side authorization.
