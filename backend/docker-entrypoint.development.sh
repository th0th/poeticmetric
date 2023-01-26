#!/usr/bin/env bash
set -eo pipefail

CMD="reflex -s -d none -- go run ."

if [[ "$REMOTE_DEBUG" == "true" ]]; then
  CMD="reflex -R __debug_bin -s -d none -- /go/bin/dlv --headless=true --listen=:2345 --api-version=2 --accept-multiclient debug ."
fi

case "$INSTANCE" in
  rest-api)
    cd cmd/restapi

    exec $CMD
  ;;
  scheduler)
    cd cmd/scheduler

    exec $CMD
  ;;
  worker)
    cd cmd/worker

    exec $CMD
  ;;
  *)
    echo >&2 "Invalid INSTANCE."
    exit 1
esac
