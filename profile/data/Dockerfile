FROM node:10

COPY package.json /src/package.json
COPY ./src/data/insert-data.js /src/data/insert-data.js
COPY ./src/pg-client.js /src/pg-client.js
COPY ./src/data/transactions-1.json /src/data/transactions-1.json
COPY ./src/data/transactions-2.json /src/data/transactions-2.json
COPY ./src/data/customers.json /src/data/customers.json

RUN cd /src && npm install;

WORKDIR /src
CMD ["node", "data/insert-data.js"]