#!/usr/bin/env sh
set -eo pipefail

: "${BASE_URL:?Please set the environment variable.}"
: "${REST_API_BASE_URL:?Please set the environment variable.}"

# robots.txt
if [[ "${ALLOW_ROBOTS}" == "true" ]]; then
  mv "robots-allow.txt" "robots.txt"
  rm -rf "robots-disallow.txt"
else
  mv "robots-disallow.txt" "robots.txt"
  rm -rf "robots-allow.txt"
fi

# replace the placeholders with environment variables
find . \
  -type f \
  -exec \
    sed \
    -i \
    -e "s|https://api.placeholder.poeticmetric.com|${REST_API_BASE_URL}|g" \
    -e "s|https://placeholder.poeticmetric.com|${BASE_URL}|g" \
    {} \;
