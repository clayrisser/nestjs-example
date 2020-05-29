FROM node:12 AS builder

RUN apt-get update && apt-get install -y \
  build-essential \
  python

WORKDIR /tmp/app

COPY package*.json /tmp/app/
RUN npm install

FROM node:12-alpine

RUN apk add --no-cache \
  make \
  musl \
  postgresql-client

COPY docker/entrypoint.sh /usr/local/sbin/entrypoint
RUN chmod +x /usr/local/sbin/entrypoint

COPY --from=builder /tmp/app /opt/app
WORKDIR /opt/app

COPY . /opt/app/
RUN npm run make -- +generate && \
  npm run make -- +build

EXPOSE 3000

ENV DEBUG=0 \
 GRAPHQL_PLAYGROUND=0 \
 KEYCLOAK_BASE_URL=http://keycloak:8080 \
 KEYCLOAK_CLIENT_ID=appsaas-core \
 KEYCLOAK_REALM=master \
 KEYCLOAK_SECRET=shhh \
 POSTGRES_DATABASE=postgres \
 POSTGRES_HOST=postgres \
 POSTGRES_PASSWORD=postgres \
 POSTGRES_PORT=5432 \
 POSTGRES_SSLMODE=prefer \
 POSTGRES_URL="" \
 POSTGRES_USERNAME=postgres \
 SECRET=shhh \
 SEED_ADMIN_EMAIL=admin@example.com \
 SEED_ADMIN_FULLNAME="Some Admin" \
 SWAGGER=0

ENTRYPOINT [ "/usr/local/sbin/entrypoint" ]
