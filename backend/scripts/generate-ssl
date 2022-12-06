#!/usr/bin/env bash
set -eo pipefail

mkcert -install

SSL_PATH=$(dirname "$0")/../etc/ssl

mkdir -p $SSL_PATH

mkcert \
  -cert-file "$SSL_PATH/dev.poeticmetric.com.crt" \
  -key-file "$SSL_PATH/dev.poeticmetric.com.key" \
  "dev.poeticmetric.com" "*.dev.poeticmetric.com"
