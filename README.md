# Small Web

Needs Node 20+ and MongoDB running locally (default `mongodb://127.0.0.1:27017/smallweb_assessment`; change it in `backend/.env`).

```bash
npm run install:all    # root, backend and frontend
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
npm run seed           # safe to run again: never doubles the web
npm run dev            # API on http://localhost:4100/api, browser on http://localhost:3100
```

Each side on its own: `npm run start:dev` in `backend`, `npm run dev` in `frontend`.
`npm run seed:fresh` in `backend` wipes everything, including sites people published, and seeds again.
