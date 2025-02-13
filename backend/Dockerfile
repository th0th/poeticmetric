FROM golang:1.23.6

WORKDIR /poeticmetric

RUN CGO_ENABLED=0 go install -tags 'clickhouse,postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@v4.18.1

COPY go.mod go.sum ./
RUN go mod download

COPY cmd cmd
COPY pkg pkg

RUN mkdir bin

RUN CGO_ENABLED=0 go build -a -o bin/migrator cmd/migrator/*
RUN CGO_ENABLED=0 go build -a -o bin/rest-api cmd/rest-api/*
RUN CGO_ENABLED=0 go build -a -o bin/worker cmd/worker/*

FROM alpine:3

RUN apk update && apk add bash tzdata

WORKDIR /poeticmetric

COPY --from=0 /go/bin/migrate /usr/local/bin/migrate
COPY --from=0 /poeticmetric/bin/migrator /usr/local/bin/poeticmetric-migrator
COPY --from=0 /poeticmetric/bin/rest-api /usr/local/bin/poeticmetric-rest-api
COPY --from=0 /poeticmetric/bin/worker /usr/local/bin/poeticmetric-worker

COPY docker-entrypoint.sh /usr/local/bin/

CMD ["/usr/local/bin/docker-entrypoint.sh"]
