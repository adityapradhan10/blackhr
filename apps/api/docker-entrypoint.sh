#!/bin/sh
set -e

mkdir -p /app/data

npx prisma migrate deploy
node scripts/ensure-seeded.cjs

exec node dist/main.js
