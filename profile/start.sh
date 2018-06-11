#!/bin/bash

sleep 15 &&
run_psql.sh &&
node /src/process.js