# === Builder stage ===
FROM node:18.7.0-alpine3.16 as builder
WORKDIR /app

COPY package.json package-lock.json ./

# Install dependencies using ci for production
RUN npm ci

# Fix potential security issues
RUN npm audit --fix

COPY ./ ./

# Build app using npm run build
RUN npm run build
RUN npm ci --omit=dev


# === Deployment stage ===
FROM node:18.7.0-alpine3.16 as deployment

USER node:node

WORKDIR /app
COPY --from=builder --chown=node:node /app/build ./build
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node package.json .
CMD ["node","build"]