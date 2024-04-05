FROM node:18.14.0

WORKDIR /app

COPY build /app/build
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
COPY prisma /app/prisma

RUN npm ci --only=production --ignore-scripts
RUN npm install --platform=linux --arch=x64 sharp
RUN npx prisma generate

CMD ["node", "build/index.js"]