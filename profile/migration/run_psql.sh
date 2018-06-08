#!/usr/bin/env bash

PGPASSWORD=${POSTGRES_PASSWORD} psql -h db -d ${POSTGRES_DB} -U ${POSTGRES_USER}  -p 5432 -a -q -f /usr/local/bin/init.sql
