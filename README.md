# Small Web

Needs Node 20+ and MongoDB running locally on `mongodb://127.0.0.1:27017`.

```bash
npm run install:all    # root, backend and frontend
npm run seed           # safe to run again: never doubles the web
npm run dev            # API on http://localhost:4100/api, browser on http://localhost:3100
```

Each side on its own: `npm run start:dev` in `backend`, `npm run dev` in `frontend`.
`npm run seed:fresh` in `backend` wipes everything, including sites people published, and seeds again.

No env files are needed; the defaults above are built in. To change them, create `backend/.env` with
`MONGODB_URI`, `PORT` and `CORS_ORIGIN`, and `frontend/.env.local` with `NEXT_PUBLIC_API_URL`.
