# syntax=docker/dockerfile:1

FROM node:22-bookworm-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate
WORKDIR /app

FROM base AS builder
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/api/package.json apps/api/
COPY packages/shared-types/package.json packages/shared-types/
COPY packages/ts-config/package.json packages/ts-config/

RUN pnpm install --frozen-lockfile

COPY packages/shared-types packages/shared-types
COPY packages/ts-config packages/ts-config
COPY apps/api apps/api

ENV DATABASE_URL="file:./build.db"
RUN pnpm --filter @blackhr/shared-types build
WORKDIR /app/apps/api
RUN pnpm exec prisma generate
RUN pnpm build
RUN rm -rf prisma/seed/dist && pnpm exec tsc -p tsconfig.seed.json
WORKDIR /app
RUN pnpm --filter @blackhr/api add prisma@7.8.0 --save-prod
RUN pnpm --filter @blackhr/api deploy --prod /app/deploy
WORKDIR /app/deploy
ENV DATABASE_URL="file:./build.db"
RUN npx prisma generate

FROM base AS runner
RUN apt-get update \
  && apt-get install -y --no-install-recommends tini openssl \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

COPY --from=builder /app/deploy ./
COPY --from=builder /app/apps/api/prisma ./prisma
COPY --from=builder /app/apps/api/assets ./assets
COPY --from=builder /app/apps/api/prisma.config.ts ./prisma.config.ts
COPY apps/api/scripts/ensure-seeded.cjs ./scripts/ensure-seeded.cjs
COPY apps/api/docker-entrypoint.sh ./docker-entrypoint.sh

RUN chmod +x ./docker-entrypoint.sh \
  && mkdir -p /app/data

EXPOSE 3001

ENTRYPOINT ["/usr/bin/tini", "--", "./docker-entrypoint.sh"]
