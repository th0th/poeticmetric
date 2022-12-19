FROM golang:1.19.4

WORKDIR /usr/src/poeticmetric

RUN CGO_ENABLED=0 go install -tags 'clickhouse,postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@v4.15.1

COPY go.mod go.sum ./
RUN go mod download

COPY cmd cmd
COPY pkg pkg

RUN mkdir bin

RUN CGO_ENABLED=0 go build -a -o bin/rest-api cmd/restapi/*
RUN CGO_ENABLED=0 go build -a -o bin/seeder cmd/seeder/*

FROM alpine:3.16

RUN apk update && apk add bash tzdata

WORKDIR /webgazer

COPY migrations migrations
COPY scripts/migrate-clickhouse /usr/local/bin/migrate-clickhouse
COPY scripts/migrate-postgres /usr/local/bin/migrate-postgres

COPY --from=0 /go/bin/migrate /usr/local/bin/migrate
COPY --from=0 /usr/src/webgazer/bin/rest-api /usr/local/bin/webgazer-rest-api
COPY --from=0 /usr/src/webgazer/bin/seeder /usr/local/bin/webgazer-seeder

COPY docker-entrypoint.sh /usr/local/bin/

CMD ["/usr/local/bin/docker-entrypoint.sh"]
