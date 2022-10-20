#!/bin/sh

alias prisma=/opt/app/node_modules/.bin/prisma
if [ "$POSTGRES_URL" = "" ]; then
    export POSTGRES_URL="postgresql://${POSTGRES_PASSWORD}:${POSTGRES_USER}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DATABASE}?sslmode=prefer"
fi

mkdir -p /data
cd prisma
if [ "$MIGRATE" == "true" ]; then
    prisma migrate deploy
    prisma studio &
fi
cd ..

exec node /opt/app/dist/main
