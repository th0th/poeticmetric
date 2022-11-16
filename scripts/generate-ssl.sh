#!/usr/bin/env bash
set -eo pipefail

SSL_PATH=$(dirname "$0")/../etc/ssl

echo $SSL_PATH

openssl req -x509 -newkey rsa:4096 -sha256 -days 3650 -nodes \
  -keyout "${SSL_PATH}/dev.poeticmetric.com.key" -out "${SSL_PATH}/dev.poeticmetric.com.crt" -extensions san -config \
  <(echo "[req]";
    echo distinguished_name=req;
    echo "[san]";
    echo subjectAltName=DNS:dev.poeticmetric.com,DNS:*.dev.poeticmetric.com
    ) \
  -subj "/CN=poeticmetric.com"
