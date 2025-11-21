# relay

This is a small in-memory chat demo prepared for deployment on Vercel.

Project layout
- `public/` — static site: `index.html`, `script.js`, `style.css`
- `api/chat.js` — serverless API handler for `/api/chat` and `/api/user`
- `vercel.json` — Vercel routing configuration
- `server_local.js` — tiny local Node server for testing

Local testing
1. Install dependencies (none required for runtime, but recommended to have Node >=16).
2. Start the local server:

```bash
npm install
npm start
# open http://localhost:3000
```

Using `curl` to exercise the API:

```bash
# Get a generated user
curl http://localhost:3000/api/user

# Get messages
curl http://localhost:3000/api/chat

# Post a message
curl -X POST http://localhost:3000/api/chat -H "Content-Type: application/json" -d '{"user_id":"12345","username":"Tester","text":"hello"}'
```

Deploying to Vercel
- Option A: Push this repository to GitHub and connect it in the Vercel dashboard — Vercel will detect `vercel.json` and deploy static files and the `api/chat.js` serverless function automatically.
- Option B: Install the Vercel CLI and run:

```bash
npm i -g vercel
vercel login
vercel --prod
```

Notes
- The API uses in-memory storage; messages will be lost when the serverless function cold-starts or the server restarts. For production, add a persistent store (e.g., PostgreSQL, SQLite, or an external database service) and update `api/chat.js` accordingly.
- If you prefer the original Python handler, I can convert `api/chat.py` into a Vercel Python function instead.
