#!/bin/sh

sh prisma/generate.sh

eval "export $(sed -n 4p prisma/.env)"
echo "waiting for postgres . . ."
until psql "$POSTGRES_URL" -c '\l' >/dev/null; do
  sleep 1
done
echo "postgres ready"

node_modules/.bin/prisma migrate up --experimental
node_modules/.bin/ts-node /opt/app/prisma/seed.ts

exec node /opt/app/dist/src/main
