FROM node:22.4.0 as build

WORKDIR /app

COPY backend ./backend
COPY package.json ./
COPY package-lock.json ./
COPY prisma ./prisma/
COPY tsconfig.json ./
COPY emails ./emails/

RUN npm install
RUN npx prisma generate
RUN npm install -g typescript ts-node

CMD ["ts-node", "backend/index.ts"]