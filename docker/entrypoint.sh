#!/bin/sh

sh prisma/scripts/generate.sh
sh prisma/scripts/wait-for-postgres.sh
node_modules/.bin/prisma migrate up --experimental
node_modules/.bin/ts-node /opt/app/prisma/seed.ts

exec node /opt/app/dist/src/main
