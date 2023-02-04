FROM golang:1.19.4

RUN apt update && apt install -y postgresql-client

WORKDIR /poeticmetric

RUN CGO_ENABLED=0 go install -tags 'clickhouse,postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@v4.15.2

RUN go install github.com/cespare/reflex@latest
RUN go install github.com/go-delve/delve/cmd/dlv@latest

COPY go.mod go.sum ./
RUN go mod download

COPY assets assets
COPY cmd cmd
COPY migrations migrations
COPY pkg pkg

COPY scripts/migrate-clickhouse /usr/local/bin/
COPY scripts/migrate-postgres /usr/local/bin/
COPY scripts/run-tests /usr/local/bin/
COPY scripts/wait-for-it /usr/local/bin/
COPY docker-entrypoint.development.sh /usr/local/bin/docker-entrypoint.sh

EXPOSE 80

CMD ["docker-entrypoint.sh"]
