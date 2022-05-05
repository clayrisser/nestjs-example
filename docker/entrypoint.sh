#!/bin/sh

mkdir -p /data
cd prisma
if [ "$MIGRATE" == "true" ]; then
  $PRISMA migrate deploy
  $PRISMA studio &
fi
cd ..

exec node /opt/app/dist/backend/main
