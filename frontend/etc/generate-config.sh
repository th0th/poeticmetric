#!/usr/bin/env bash
set -eo pipefail

: "${POETICMETRIC_FRONTEND_BASE_URL:?Please set the environment variable.}"
: "${POETICMETRIC_REST_API_BASE_URL:?Please set the environment variable.}"

cd /usr/share/nginx/html

sed \
  "s,frontendBaseUrl: \"\",frontendBaseUrl: \"${POETICMETRIC_FRONTEND_BASE_URL}\",g;
  s,nodeRedBaseUrl: \"\",nodeRedBaseUrl: \"${POETICMETRIC_NODE_RED_BASE_URL}\",g;
  s,restApiBaseUrl: \"\",restApiBaseUrl: \"${POETICMETRIC_REST_API_BASE_URL}\",g;" \
   < ./config.template.js > ./config.js
