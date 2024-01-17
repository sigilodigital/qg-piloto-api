FROM node:20

ARG PROJECT_NAME
ARG SRV_PORT

ARG DB_TYPE
ARG DB_HOST
ARG DB_PORT
ARG DB_USERNAME
ARG DB_PASSWORD
ARG DB_NAME
ARG DB_SCHEMA
ARG DB_SERVICE_NAME

WORKDIR /app

RUN npm install @nestjs/cli@10 --location=global
RUN npm install pm2@latest --location=global

COPY ./package*.json ./
RUN npm install --legacy-peer-deps
COPY . .

WORKDIR /app/libs
RUN npm install --legacy-peer-deps

WORKDIR /app

RUN npm run build

CMD pm2-runtime start ./dist/main.js --name $PROJECT_NAME