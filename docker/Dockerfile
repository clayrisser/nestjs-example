FROM registry.gitlab.com/risserlabs/community/images/node:16.14.2 AS builder

WORKDIR /code

RUN curl -Lo /usr/bin/yq https://github.com/mikefarah/yq/releases/download/v4.25.1/yq_linux_amd64 && \
    chmod +x /usr/bin/yq

COPY package.json .yarnrc.yml yarn.lock *.mk Makefile ./
COPY .mkpm/.bootstrap.mk .mkpm/.cache.tar.gz .mkpm/
COPY .yarn .yarn
COPY .git .git
RUN make -s +install
COPY . .
RUN make -s prisma/generate +build
RUN mkdir -p /tmp/app && \
    mv dist \
    prisma \
    node_modules \
    public \
    views \
    package.json \
    .env /tmp/app

FROM node:16-bullseye-slim

WORKDIR /opt/app

RUN apt-get update && apt-get install -y \
    postgresql-client \
    sqlite3 && \
    rm -rf /var/lib/apt/lists/*

COPY --from=builder /tmp/app ./
COPY docker/entrypoint.sh /usr/local/sbin/entrypoint
RUN chmod +x /usr/local/sbin/entrypoint

ENTRYPOINT [ "/usr/local/sbin/entrypoint" ]

EXPOSE 5000

ENV DEBUG=0 \
    MIGRATE=true \
    PORT=5000 \
    POSTGRES_DATABASE=postgres \
    POSTGRES_HOST=postgres \
    POSTGRES_PASSWORD=postgres \
    POSTGRES_PORT=5432 \
    POSTGRES_USER=postgres \
    SWAGGER=0
