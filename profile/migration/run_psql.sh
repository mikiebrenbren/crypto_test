#!/usr/bin/env bash

#exec shmig -t postgresql -d kraken -l kraken -H localhost -p kraken -m /migrations "$1" "$2"
#PGPASSWORD=kraken psql -h localhost -U kraken
PGPASSWORD=kraken psql -h db -d kraken -U kraken  -p 5432 -a -q -f /usr/local/bin/init.sql
