FROM oven/bun:1.4.4 AS build
WORKDIR /app

COPY package.json bun.lock ./
COPY patches ./patches
RUN bun install --frozen-lockfile --ignore-scripts

COPY . .
ENV NODE_ENV=production
ENV ENVIRONMENT=production
RUN DATABASE_URL=mysql://localhost/build bunx prisma generate
RUN bun --bun run build

RUN rm -rf node_modules && bun install --production --frozen-lockfile --ignore-scripts


FROM oven/bun:1.4.4-slim
WORKDIR /app

ENV NODE_ENV=production
ENV ENVIRONMENT=production
ENV PORT=3000

COPY --from=build --chown=bun:bun /app/package.json ./
COPY --from=build --chown=bun:bun /app/node_modules ./node_modules
COPY --from=build --chown=bun:bun /app/build ./build
COPY --from=build --chown=bun:bun /app/src/worker ./src/worker
COPY --from=build --chown=bun:bun /app/src/lib/server/prisma ./src/lib/server/prisma

USER bun
EXPOSE 3000
CMD ["bun", "./build/index.js"]
