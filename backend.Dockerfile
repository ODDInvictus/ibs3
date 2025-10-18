FROM node:24.10.0-alpine

WORKDIR /app

COPY backend/* ./
COPY prisma ./prisma/
COPY emails ./emails/

RUN apk add openssl
RUN npm install
RUN npx prisma generate
RUN npm install -g typescript
RUN npm install node-cron

RUN tsc

CMD ["node", "./dist/index.js"]