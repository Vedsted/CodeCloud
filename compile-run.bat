CALL npm install
CALL tsc -p tsconfig.json
CALL tsc -p src/server/tsconfig.json
CALL node out/server/
cmd /k