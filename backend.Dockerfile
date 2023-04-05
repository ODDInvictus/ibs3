FROM node:18.14.0 as build

WORKDIR /app

COPY backend ./backend
COPY package.json ./
COPY .svelte-kit ./.svelte-kit
COPY package-lock.json ./
COPY prisma ./prisma/
COPY tsconfig.json ./

RUN npm install
RUN npx prisma generate
RUN npm install -g typescript ts-node

CMD ["ts-node", "backend/index.ts"]