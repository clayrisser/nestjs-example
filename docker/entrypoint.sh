#!/bin/sh

BABEL_NODE="../node_modules/.bin/babel-node"
GENERATE_PRISMA="../node_modules/.bin/generate-prisma"
PRISMA="../node_modules/.bin/prisma"
WAIT_FOR_POSTGRES="../node_modules/.bin/wait-for-postgres"

cd prisma
$GENERATE_PRISMA ..
$WAIT_FOR_POSTGRES
if [ "$MIGRATE" == "true" ]; then
  $PRISMA migrate deploy
fi
cd ..

exec node /opt/app/dist/main
