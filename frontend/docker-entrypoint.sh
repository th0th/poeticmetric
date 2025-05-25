#!/usr/bin/env sh
set -eo pipefail

: "${VITE_BASE_URL:?Please set the environment variable.}"
: "${VITE_REST_API_BASE_URL:?Please set the environment variable.}"

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
    -e "s|https://placeholder.poeticmetric.com|${VITE_BASE_URL}|g" \
    -e "s|https://api.placeholder.poeticmetric.com|${VITE_REST_API_BASE_URL}|g" \
    -e "s|___+++PLACEHOLDER_GOOGLE_CLIENT_ID+++___|${VITE_GOOGLE_CLIENT_ID:-none}|g" \
    -e "s|___+++PLACEHOLDER_TAGS_ENVIRONMENT+++___|${VITE_TAGS_ENVIRONMENT:-none}|g" \
    {} \;
