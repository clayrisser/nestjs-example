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
  musl

COPY docker/entrypoint.sh /usr/local/sbin/entrypoint
RUN chmod +x /usr/local/sbin/entrypoint

COPY --from=builder /tmp/app /opt/app
WORKDIR /opt/app

COPY . /opt/app/
RUN npm run make -- +generate && \
  npm run make -- +build

EXPOSE 3000

ENV GRAPHQL_DEBUG=0
ENV JWT_SECRET=m&XAFzBpM3es
ENV PLAYGROUND_ENABLE=0
ENV POSTGRES_DATABASE=postgres
ENV POSTGRES_HOST=postgres
ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_PORT=5432
ENV POSTGRES_SSLMODE=prefer
ENV POSTGRES_URL=""
ENV POSTGRES_USERNAME=postgres
ENV SEED_ADMIN_EMAIL=admin@example.com
ENV SEED_ADMIN_FULLNAME="Some Admin"
ENV SWAGGER_ENABLE=0

ENTRYPOINT [ "/usr/local/sbin/entrypoint" ]
