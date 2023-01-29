#!/usr/bin/env bash
set -eo pipefail

: "${FRONTEND_BASE_URL:?Please set the environment variable.}"
: "${REST_API_BASE_URL:?Please set the environment variable.}"

if [[ -d "/poeticmetric" ]];
then
  cd /poeticmetric/public
else
  cd /usr/share/nginx/html
fi

sed \
  "s,frontendBaseUrl: \"\",frontendBaseUrl: \"${FRONTEND_BASE_URL}\",g;
  s,restApiBaseUrl: \"\",restApiBaseUrl: \"${REST_API_BASE_URL}\",g;" \
   < ./config.template.js > ./config.js
