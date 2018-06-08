FROM node:10

COPY package.json /src/package.json
COPY ./src/insert-data.js /src/insert-data.js
COPY ./src/pg-client.js /src/pg-client.js
COPY ./src/transactions-1.json /src/transactions-1.json
COPY ./src/transactions-2.json /src/transactions-2.json

RUN cd /src && npm install;

WORKDIR /src
CMD ["node", "insert-data.js"]