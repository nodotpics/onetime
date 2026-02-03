FROM oven/bun:1.1 AS pruner
WORKDIR /repo
COPY . .
ARG SCOPE=api
RUN bunx turbo prune --scope=$SCOPE --docker

FROM node:20-bookworm-slim AS deps
WORKDIR /repo

COPY --from=pruner /repo/out/json/ ./

RUN corepack enable

RUN npm install

FROM oven/bun:1.1 AS builder
WORKDIR /repo
COPY --from=deps /repo/node_modules ./node_modules
COPY --from=pruner /repo/out/full/ ./
ARG SCOPE=api
RUN bunx turbo run build --filter=$SCOPE...

FROM oven/bun:1.1-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /repo/apps/api/dist ./dist
COPY --from=builder /repo/apps/api/package.json ./package.json
COPY --from=deps /repo/node_modules ./node_modules

EXPOSE 3000
CMD ["bun", "dist/main.js"]