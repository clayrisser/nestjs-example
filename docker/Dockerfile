FROM registry.gitlab.com/risserlabs/community/images/node:16.14.2 AS builder

WORKDIR /code

RUN curl -Lo /usr/bin/yq https://github.com/mikefarah/yq/releases/download/v4.25.1/yq_linux_amd64 && \
    chmod +x /usr/bin/yq

COPY package.json .yarnrc.yml yarn.lock *.mk Makefile ./
COPY .yarn .yarn
RUN make -s +install
COPY . .
RUN make -s prisma/generate +build

FROM node:16-alpine

WORKDIR /opt/app

RUN apk add --no-cache \
    musl \
    postgresql-client \
    sqlite

COPY --from=builder /code/.env ./.env
COPY --from=builder /code/node_modules ./node_modules
COPY --from=builder /code/package*.json ./
COPY --from=builder /code/dist ./dist

COPY docker/entrypoint.sh /usr/local/sbin/entrypoint
COPY prisma ./prisma
RUN chmod +x /usr/local/sbin/entrypoint

ENTRYPOINT [ "/usr/local/sbin/entrypoint" ]

EXPOSE 3000

ENV DEBUG=0 \
    MIGRATE=true \
    POSTGRES_DATABASE=postgres \
    POSTGRES_HOST=postgres \
    POSTGRES_PASSWORD=postgres \
    POSTGRES_PORT=5432 \
    POSTGRES_USER=postgres \
    SWAGGER=0
