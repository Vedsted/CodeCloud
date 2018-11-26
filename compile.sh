#!/bin/bash

echo "Installing node modules"
npm install

echo "Compiling typescript -> javascript"
tsc -p src/client/tsconfig.json
tsc -p src/server/tsconfig.json
#tsc -p src/shared/tsconfig.json