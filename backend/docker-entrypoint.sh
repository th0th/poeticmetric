#!/usr/bin/env bash
set -eo pipefail

/usr/local/bin/poeticmetric-migrator

case "$INSTANCE" in
  rest-api)
    exec /usr/local/bin/poeticmetric-rest-api
  ;;
  scheduler)
    exec /usr/local/bin/poeticmetric-scheduler
  ;;
  worker)
    exec /usr/local/bin/poeticmetric-worker
  ;;
  *)
    echo >&2 "Invalid INSTANCE."
    exit 1
esac
