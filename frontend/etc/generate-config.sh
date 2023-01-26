#!/usr/bin/env bash
set -eo pipefail

: "${FRONTEND_BASE_URL:?Please set the environment variable.}"
: "${REST_API_BASE_URL:?Please set the environment variable.}"

cd /usr/share/nginx/html

sed \
  "s,frontendBaseUrl: \"\",frontendBaseUrl: \"${FRONTEND_BASE_URL}\",g;
  s,nodeRedBaseUrl: \"\",nodeRedBaseUrl: \"${NODE_RED_BASE_URL}\",g;
  s,restApiBaseUrl: \"\",restApiBaseUrl: \"${REST_API_BASE_URL}\",g;" \
   < ./config.template.js > ./config.js
