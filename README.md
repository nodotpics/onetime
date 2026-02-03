# no.pics / OneTimePhoto

One-time photo sharing: upload an image → get a link → view once (or until TTL) → deleted.

> Photos are deleted after the first view or when the TTL expires (whichever comes first).
> Do not upload illegal content or anything you’re not comfortable sharing with the link recipient.

## Features

- One-time view (GET + delete)
- TTL expiration
- Optional passphrase-protected photos (`/unlock`)
- Manual burn (`DELETE /:id`)
- Simple stack: Web + API + Redis

## Tech Stack

- Web: Vite + React + TypeScript
- API: NestJS + Redis
- Monorepo: Turbo + Bun
- Local runtime: Docker Compose (optional)

## Local URLs

- Web: http://localhost:5173
- API (dev): http://localhost:3000

## Quickstart (Local Dev)

```bash
git clone https://github.com/nodotpics/onetime
cd onetime

bun install

# run redis locally (pick one)
docker compose up -d redis
# OR: run your own redis and set REDIS_URL accordingly

# start apps
bunx turbo run dev

Environment

Create .env (or copy from .env.example if you have one):

# API
API_PORT=3000
REDIS_URL=redis://localhost:6379

# Web -> API
CORS_ORIGIN=http://localhost:5173

API Routes

Base: /api/v1/photos
  POST /api/v1/photos/upload — upload photo (multipart/form-data)
  GET  /api/v1/photos/:id/status — check photo status
  POST /api/v1/photos/:id/unlock — unlock protected photo (passphrase)
  GET  /api/v1/photos/receipt/:receiptId/status — check receipt status
  GET  /api/v1/photos/:id — view photo (one-time)
  DELETE /api/v1/photos/:id — burn/delete photo

Contributing

PRs are welcome. Please run lint/typecheck before opening a PR.

License

MIT
```
