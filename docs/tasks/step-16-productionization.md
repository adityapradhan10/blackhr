# Step 16 — Productionization

## Objective

Prepare the application for production deployment.

Goal:

Ensure the application runs consistently across environments with minimal operational complexity.

Database decision:

Use SQLite.

Reasoning:

- assessment allows a relational database of choice
- removes database hosting complexity
- simpler deployment
- sufficient for 10,000 employee records
- faster local setup

Tradeoffs:

- not intended for high write concurrency
- not suitable for horizontal scaling
- future SaaS evolution would likely migrate to PostgreSQL

Do NOT add features.

Only production concerns.

---

## Backend Docker

Create:

```txt
apps/api/Dockerfile
```

Requirements:

✓ multi-stage build

✓ production dependencies only

✓ Prisma client generation

✓ expose API port

✓ startup command works with SQLite

✓ auto-seeds empty database on container start (compiled seed in image)

Suggested flow:

```dockerfile
Build
    ↓
Install dependencies
    ↓
Generate Prisma client
    ↓
Build Nest app
    ↓
Run production image
```

---

## Frontend Docker

Create:

```txt
apps/web/Dockerfile
```

Requirements:

✓ multi-stage build

✓ build React application

✓ serve static output

Suggested flow:

```dockerfile
Build React app
    ↓
Serve built assets
```

---

## Docker Compose

Create:

```txt
docker-compose.yml
```

Services:

```txt
api

web
```

No database container required because SQLite uses a local file.

Requirements:

✓ shared network

✓ environment variables

✓ mounted SQLite persistence volume

Suggested volume:

```txt
./data:/app/data
```

Purpose:

Persist SQLite database across container restarts.

---

## Environment Management

Create:

```txt
.env.example

apps/api/.env.example

apps/web/.env.example
```

Backend:

```env
PORT=3001

NODE_ENV=production

DATABASE_URL=file:./data/database.db

CORS_ORIGINS=http://localhost:5173,https://*.vercel.app
```

`CORS_ORIGINS` is comma-separated. Trailing slashes are stripped. Wildcards (e.g. `https://*.vercel.app`) match Vercel preview deployment URLs.

Frontend:

```env
VITE_API_URL=http://localhost:3001/api/v1
```

On Vercel, set `VITE_API_URL` to the production Render API URL and redeploy — Vite reads it at build time.

---

## Prisma Verification

Verify:

```bash
pnpm --filter api prisma generate
```

Verify migration:

```bash
pnpm --filter api prisma migrate deploy
```

Verify seed:

```bash
pnpm --filter api prisma db seed
```

Expected:

✓ SQLite database created

✓ migrations applied

✓ seed successful

---

## Production Build Verification

Verify:

```bash
pnpm build
```

Verify:

```bash
docker compose up
```

Expected:

✓ frontend accessible

✓ backend accessible

✓ SQLite connected

✓ employee APIs working

✓ salary APIs working

✓ seed works

---

## Health Check Verification

Verify:

```http
GET /api/v1/health
```

Expected:

```json
{
   "status":"ok"
}
```

---

## Deployment Targets

Frontend:

Vercel — set `VITE_API_URL` to the Render API base path (`https://<service>.onrender.com/api/v1`).

Backend:

Render or Railway — deploy `apps/api/Dockerfile` with build context at repo root.

SQLite:

- **Docker Compose / paid hosting:** mount `./data:/app/data` for persistence across restarts.
- **Render free tier:** no persistent disk or Shell — the entrypoint runs `prisma migrate deploy`, seeds when the employee table is empty, then starts the API. Data is ephemeral across redeploys; empty databases are re-seeded automatically.

CORS:

Set `CORS_ORIGINS` on the API to match frontend origins. Use `https://*.vercel.app` for Vercel preview URLs. Origins must not include paths (`/dashboard`) or trailing slashes.

---

## Validation

Verify:

✓ build succeeds

✓ docker containers start

✓ API works

✓ frontend works

✓ database persists after restart

✓ no environment values hardcoded

---

## Commit

```bash
git add .

git commit -m "chore: productionize application"
```

---

## Notes

Avoid:

- switching to PostgreSQL now
- unnecessary infrastructure complexity
- hardcoded environment values
- storing SQLite database inside application source folders
