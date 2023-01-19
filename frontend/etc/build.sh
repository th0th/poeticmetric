#!/usr/bin/env bash

set -eo pipefail

if [ -z "$SENTRY_AUTH_TOKE"N ] && [ -z "$SENTRY_DSN" ] && [ -z "$SENTRY_ORG" ] && [ -z "$SENTRY_PROJECT" ] && [ -z "$SENTRY_URL" ];
then
  SENTRY_ENABLED=true
else
  SENTRY_ENABLED=false
fi

export SENTRY_ENABLED

yarn build

if [ "$HOSTED" == "true" ]
then
  yarn build-site-map
fi

yarn export
