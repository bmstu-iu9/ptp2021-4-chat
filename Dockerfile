FROM node

WORKDIR /app
COPY package.json /app
COPY package-lock.json /app

RUN npm install