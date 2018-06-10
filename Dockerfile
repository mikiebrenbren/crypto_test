FROM node:10

COPY package.json /src/package.json
COPY ./src/pg-client.js /src/pg-client.js
COPY ./src/transaction-processor.js /src/transaction-processor.js

RUN cd /src && npm install;

WORKDIR /src
CMD ["node", "transaction-processor.js"]