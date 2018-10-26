#!/bin/bash

echo "Installing node modules"
npm install

echo "Compiling typescript -> javascript"
tsc

echo "Starting node server"
node out