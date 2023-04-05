FROM node:18.14.0 as build

WORKDIR /app

COPY . .

RUN npm install && \
    npx prisma generate && \
    bash /app/build.sh

FROM node:18.14.0 as runtime

WORKDIR /app

COPY --from=build /app/build /app/build
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
COPY prisma /app/prisma

RUN npm install --production
RUN npx prisma generate

CMD ["node", "build/index.js"]