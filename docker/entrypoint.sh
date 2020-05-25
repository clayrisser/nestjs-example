#!/bin/sh

if [ -z "$POSTGRES_URL" ]; then
  export POSTGRES_URL=postgresql://$POSTGRES_USERNAME:$POSTGRES_PASSWORD@$POSTGRES_HOST:$POSTGRES_PORT/$POSTGRES_DATABASE?sslmode=$POSTGRES_SSLMODE
fi

node_modules/.bin/prisma migrate up --experimental
node_modules/.bin/ts-node /opt/app/prisma/seed.ts

exec node /opt/app/dist/main
