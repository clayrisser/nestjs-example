FROM node:14 AS builder

WORKDIR /code

RUN apt-get update && apt-get install -y \
  build-essential \
  make \
  python

# disable git
RUN cp $(which git) $(which git)_ && \
  cp $(which true) $(which git)

COPY package*.json *.mk Makefile /code/
RUN make -s +install

COPY . .
RUN make -s env && \
  make -s +generate +build

FROM node:14-alpine

RUN apk add --no-cache \
  make \
  musl \
  postgresql-client

COPY --from=builder /code/node_modules ./node_modules
COPY --from=builder /code/package*.json ./
COPY --from=builder /code/dist ./dist

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
