#!/usr/bin/env bash

PGPASSWORD=kraken psql -h db -d kraken -U kraken  -p 5432 -a -q -f /usr/local/bin/init.sql
