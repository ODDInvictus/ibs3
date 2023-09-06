FROM node:18.14.0

WORKDIR /app

COPY . .

RUN npm install
RUN npx prisma generate
RUN npm run build

CMD ["node", "build/index.js"]