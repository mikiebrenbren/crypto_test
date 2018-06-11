FROM node:10-alpine

RUN apk add --update bash curl postgresql-client && rm -rf /var/cache/apk/*

COPY ./profile/migration/ /usr/local/bin/

COPY package.json /src/package.json
COPY ./src/ /src/

COPY ./profile/start.sh /usr/local/bin/start.sh

RUN cd /src && npm install;

WORKDIR /src
CMD ["start.sh"]
