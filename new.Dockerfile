FROM node:18.14.0

WORKDIR /app

COPY build /app/build
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
COPY prisma /app/prisma

RUN npm install --production
RUN npx prisma generate

CMD ["node", "build/index.js"]