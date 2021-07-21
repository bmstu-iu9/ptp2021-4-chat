FROM node

WORKDIR /app

COPY ./ ./

RUN npm i
RUN npm i -g gulp
RUN gulp build

CMD ["npm", "run", "server"]