FROM node

WORKDIR /app

COPY ./ ./

RUN npm install
RUN npm run frontend-build

CMD ["sh", "-c", "npm run migrate && npm run server"]