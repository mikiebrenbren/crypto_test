#!/bin/bash

echo 'waiting for db to start' &&
sleep 15 &&
echo 'continuing with processing...' &&
run_psql.sh &&
node /src/process.js