#!/usr/bin/env bash
set -eo pipefail

run() {
  if [[ "$REMOTE_DEBUG" == "false" ]] || [[ "$1" == "migrator" ]]; then
    CMD="cd cmd/$1 && go run ."
  else
    CMD="cd cmd/$1 && /go/bin/dlv debug . --accept-multiclient --api-version=2 --continue --headless=true --listen=:2345 --output=/tmp/__debug_bin"
  fi

  if [[ "$1" == "migrator" ]]; then
    exec bash -c "$CMD"
    return
  else
    REFLEX_PARAMS=(
      "--decoration=none"
      "--shutdown-timeout=2s"
      "--start-service"
    )

    exec reflex \
      "${REFLEX_PARAMS[@]}" \
      -- bash -c "$CMD"
  fi
}

case "$INSTANCE" in
  migrator)
    run migrator
  ;;
  rest-api)
    run rest-api
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
