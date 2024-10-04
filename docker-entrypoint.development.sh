#!/usr/bin/env bash
set -eo pipefail

run() {
  if [[ "$REMOTE_DEBUG" == "false" ]]; then
    exec reflex \
      --decoration=none \
      --start-service \
      -- bash -c "cd cmd/$1 && go run ."
  else
    exec reflex \
      --decoration=none \
      --shutdown-timeout=2s \
      --start-service \
      -- bash -c "cd cmd/$1 && /go/bin/dlv debug . --accept-multiclient --api-version=2 --continue --headless=true --listen=:2345 --output=/tmp/__debug_bin"
  fi
}

case "$INSTANCE" in
  web)
    run web
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
