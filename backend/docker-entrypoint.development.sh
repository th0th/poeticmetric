#!/usr/bin/env bash
set -eo pipefail

cd cmd/migrator
go run .
cd ../..

run() {
  if [[ "$REMOTE_DEBUG" == "true" ]]; then
    exec reflex -R __debug_bin -s -d none -- bash -c "cd cmd/$1 && /go/bin/dlv --headless=true --listen=:2345 --api-version=2 --accept-multiclient debug ."
  else
    exec reflex -s -d none -- bash -c "cd cmd/$1 && go run ."
  fi
}

case "$INSTANCE" in
  rest-api)
    run restapi
  ;;
  scheduler)
    run scheduler
  ;;
  worker)
    run worker
  ;;
  *)
    echo >&2 "Invalid INSTANCE."
    exit 1
esac
