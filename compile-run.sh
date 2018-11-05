#!/bin/bash

echo "Installing node modules"
npm install

echo "Compiling typescript -> javascript"
tsc -p tsconfig.json
tsc -p src/server/tsconfig.json

echo "Starting node server"
node out/server