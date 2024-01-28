FROM node:18.17.1

WORKDIR /app

ENV NODE_ENV 'development' 
ENV PORT 3000 
ENV DATABASE_HOST 'mysql' 
ENV DATABASE_PORT 3306 
ENV DATABASE_USERNAME 'root' 
ENV DATABASE_PASSWORD 'root' 
ENV DATABASE_SCHEMA 'fiap'

COPY package.json package-lock.json ./

COPY . .

RUN npm install --legacy-peer-deps --no-package-lock && npm run build

CMD npm run start:prod