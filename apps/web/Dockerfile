FROM oven/bun:1.1 AS base
WORKDIR /repo

FROM base AS pruner
COPY . .
ARG SCOPE=web
RUN bunx turbo prune --scope=$SCOPE --docker

FROM base AS deps
WORKDIR /repo
COPY --from=pruner /repo/out/json/ ./

COPY bun.lock ./bun.lock
RUN bun install

FROM base AS builder
WORKDIR /repo
COPY --from=deps /repo/node_modules ./node_modules
COPY --from=pruner /repo/out/full/ ./
ARG SCOPE=web
RUN bunx turbo run build --filter=$SCOPE...

FROM nginx:alpine AS runner
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /repo/apps/web/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]