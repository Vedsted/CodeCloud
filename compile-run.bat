CALL npm install
CALL tsc -p src/client/tsconfig.json
CALL tsc -p src/server/tsconfig.json
CALL tsc -p src/shared/tsconfig.json
CALL node out/server/
cmd /k