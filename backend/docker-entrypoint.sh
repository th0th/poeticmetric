#!/usr/bin/env bash
set -eo pipefail

# worker concurrency
POETICMETRIC_WORKER_CONCURRENCY=${POETICMETRIC_WORKER_CONCURRENCY:-1}

DEVELOPMENT_DEBUG_CMD="reflex -R __debug_bin -s -d none -- /go/bin/dlv --headless=true --listen=:2345 --api-version=2 --accept-multiclient debug"

cd /poeticmetric

case "$POETICMETRIC_INSTANCE" in
  rest-api)
    if [[ $POETICMETRIC_STAGE == "development" ]]; then
      if [[ $POETICMETRIC_REST_API_DEBUG == "1" ]]; then
        exec $DEVELOPMENT_DEBUG_CMD cmd/rest_api/main.go
      else
         exec reflex -s -d none -- bash -c 'cd cmd/restapi && go run .'
      fi
    else
      exec /usr/local/bin/poeticmetric-rest-api
    fi
  ;;
  scheduler)
    if [[ $POETICMETRIC_STAGE == "development" ]]; then
      if [[ $POETICMETRIC_SCHEDULER_DEBUG == "1" ]]; then
        exec $DEVELOPMENT_DEBUG_CMD cmd/scheduler/main.go
      else
        exec reflex -s -d none -- bash -c 'cd cmd/scheduler && go run .'
      fi
    else
      exec /usr/local/bin/poeticmetric-scheduler
    fi
  ;;
  seeder)
    if [[ $POETICMETRIC_STAGE == "development" ]]; then
      if [[ $POETICMETRIC_SEEDER_DEBUG == "1" ]]; then
        exec $DEVELOPMENT_DEBUG_CMD cmd/seeder/main.go
      else
        exec reflex -s -d none -- bash -c 'cd cmd/seeder && go run .'
      fi
    else
      exec /usr/local/bin/poeticmetric-seeder
    fi
  ;;
  worker)
    if [[ $POETICMETRIC_STAGE == "development" ]]; then
      if [[ $POETICMETRIC_WORKER_DEBUG == "1" ]]; then
        exec $DEVELOPMENT_DEBUG_CMD cmd/worker/main.go
      else
        exec reflex -s -d none -- bash -c 'cd cmd/worker && go run .'
      fi
    else
      exec /usr/local/bin/poeticmetric-worker
    fi
  ;;
  *)
    echo >&2 "Invalid POETICMETRIC_INSTANCE."
    exit 1
esac
