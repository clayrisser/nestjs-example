#!/bin/sh

BABEL_NODE="../node_modules/.bin/babel-node"
WAIT_FOR_POSTGRES="../node_modules/.bin/wait-for-postgres"

$WAIT_FOR_POSTGRES \
  --database $POSTGRES_DATABASE \
  --host $POSTGRES_HOST \
  --password $POSTGRES_PASSWORD \
  --port $POSTGRES_PORT \
  --username $POSTGRES_USER

exec node /opt/app/dist/main
