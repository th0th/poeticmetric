FROM golang:1.21.0

WORKDIR /usr/src/poeticmetric

RUN CGO_ENABLED=0 go install -tags 'clickhouse,postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@v4.16.2

COPY go.mod go.sum ./
RUN go mod download

COPY cmd cmd
COPY pkg pkg

RUN mkdir bin

RUN CGO_ENABLED=0 go build -a -o bin/migrator cmd/migrator/*
RUN CGO_ENABLED=0 go build -a -o bin/rest-api cmd/restapi/*
RUN CGO_ENABLED=0 go build -a -o bin/scheduler cmd/scheduler/*
RUN CGO_ENABLED=0 go build -a -o bin/worker cmd/worker/*

FROM alpine:3.17

RUN apk update && apk add bash tzdata

WORKDIR /poeticmetric

COPY assets assets
COPY migrations migrations
COPY scripts/migrate-clickhouse /usr/local/bin/migrate-clickhouse
COPY scripts/migrate-postgres /usr/local/bin/migrate-postgres

COPY --from=0 /go/bin/migrate /usr/local/bin/migrate
COPY --from=0 /usr/src/poeticmetric/bin/migrator /usr/local/bin/poeticmetric-migrator
COPY --from=0 /usr/src/poeticmetric/bin/rest-api /usr/local/bin/poeticmetric-rest-api
COPY --from=0 /usr/src/poeticmetric/bin/scheduler /usr/local/bin/poeticmetric-scheduler
COPY --from=0 /usr/src/poeticmetric/bin/worker /usr/local/bin/poeticmetric-worker

COPY docker-entrypoint.sh /usr/local/bin/

CMD ["docker-entrypoint.sh"]
