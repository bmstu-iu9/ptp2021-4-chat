FROM node

WORKDIR /app

COPY ./ ./

RUN npm i
RUN npm i -g gulp

CMD ["gulp", "build"]

CMD ["npm", "run", "server"]