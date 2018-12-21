CALL browserify src/client/main.ts -p [ tsify --noImplicitAny ] > webcontent/js/main.js
CALL uglifyjs webcontent/js/main.js -c -o webcontent/js/main.js
CALL tsc -p src/server/tsconfig.json
CALL node out/server/server/
cmd /k