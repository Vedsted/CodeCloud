#!/bin/bash

echo "Installing node modules"
npm install

echo "Compiling typescript -> javascript"
browserify src/client/main.ts -p [ tsify --noImplicitAny ] > webcontent/js/main.js
uglifyjs webcontent/js/main.js -c -o webcontent/js/main.js
tsc -p src/server/tsconfig.json

echo "Starting node server"
node out/server/server