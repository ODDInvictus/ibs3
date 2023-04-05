FROM node:18.14.0 as build

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
COPY prisma ./prisma/
COPY .env ./
COPY tsconfig.json ./
COPY build.sh ./

RUN npm install
RUN npx prisma generate

COPY . .

RUN ./build.sh

CMD ["node", "server.js"]