FROM golang:1.21.0

RUN apt update && apt install -y postgresql-client

WORKDIR /poeticmetric

RUN CGO_ENABLED=0 go install -tags 'clickhouse,postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@v4.16.2

RUN go install github.com/cespare/reflex@v0.3.1
RUN go install github.com/go-delve/delve/cmd/dlv@v1.21.0

COPY go.mod go.sum ./
RUN go mod download

COPY bin bin
COPY cmd cmd
COPY internal internal
COPY migrations migrations
COPY public public
COPY public-generated public-generated
COPY templates templates
COPY MANIFESTO.md .

COPY docker-entrypoint.development.sh docker-entrypoint.sh

EXPOSE 80

CMD ["./docker-entrypoint.sh"]
