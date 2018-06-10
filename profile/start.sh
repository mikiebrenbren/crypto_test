#!/bin/bash

sleep 15 &&
run_psql.sh &&
node /src/data/insert-data.js &&
node /src/transaction-processor.js