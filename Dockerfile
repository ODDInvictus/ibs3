FROM node:19-alpine3.16

WORKDIR /app

# copy everything to the container
COPY package*.json ./

# clean install all dependencies
RUN npm ci

# remove potential security issues
RUN npm audit fix

COPY . .
    
# build SvelteKit app
RUN npm run build

# expose port 3000
EXPOSE 3000

# start the app
RUN node -r dotenv/config build
