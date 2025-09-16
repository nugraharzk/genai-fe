## Multi-stage Dockerfile for React (Vite) frontend on Node 22

FROM node:22-alpine AS base
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable && corepack prepare pnpm@9.12.3 --activate

FROM base AS builder
WORKDIR /app
ENV NODE_ENV=development
ENV VITE_API_BASE_URL=http://localhost:5001
COPY package.json ./
# No lock file present; allow resolver to generate it
RUN pnpm install --no-frozen-lockfile
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
# Copy only what is needed to serve preview
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY docker-entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
EXPOSE 8080
ENTRYPOINT ["/entrypoint.sh"]
