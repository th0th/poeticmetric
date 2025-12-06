FROM golang:1.25.5

WORKDIR /poeticmetric

RUN go install -tags 'clickhouse,postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@v4.1.1

COPY go.mod go.sum ./
RUN go mod download

COPY cmd cmd
COPY pkg pkg

RUN mkdir bin

ARG CGO_ENABLED=0
ARG GO_BUILD_ARGS

ENV CGO_ENABLED=${CGO_ENABLED}

RUN go build -a -o bin/migrator ${GO_BUILD_ARGS} cmd/migrator/*
RUN go build -a -o bin/rest-api ${GO_BUILD_ARGS} cmd/rest-api/*
RUN go build -a -o bin/scheduler ${GO_BUILD_ARGS} cmd/scheduler/*
RUN go build -a -o bin/worker ${GO_BUILD_ARGS} cmd/worker/*

FROM alpine:3

RUN apk update && apk add bash tzdata

WORKDIR /poeticmetric

COPY --from=0 /go/bin/migrate /usr/local/bin/migrate
COPY --from=0 /poeticmetric/bin/migrator /usr/local/bin/poeticmetric-migrator
COPY --from=0 /poeticmetric/bin/rest-api /usr/local/bin/poeticmetric-rest-api
COPY --from=0 /poeticmetric/bin/scheduler /usr/local/bin/poeticmetric-scheduler
COPY --from=0 /poeticmetric/bin/worker /usr/local/bin/poeticmetric-worker

COPY docker-entrypoint.sh /usr/local/bin/

CMD ["/usr/local/bin/docker-entrypoint.sh"]
