FROM node:10

COPY package.json /src/package.json
COPY insert-data.js /src/insert-data.js
COPY pg-client.js /src/pg-client.js
COPY transactions-1.json /src/transactions-1.json
COPY transactions-2.json /src/transactions-2.json

#RUN cd /src && npm install;

WORKDIR /src
CMD ["/bin/sh"]