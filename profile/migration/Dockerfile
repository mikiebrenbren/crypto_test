FROM alpine

RUN apk add --update bash curl postgresql-client && rm -rf /var/cache/apk/*

COPY run_psql.sh /usr/local/bin/run_psql.sh
COPY init.sql /usr/local/bin/init.sql

CMD ["run_psql.sh"]