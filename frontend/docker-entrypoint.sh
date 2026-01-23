#!/usr/bin/env sh
set -eo pipefail

: "${VITE_BASE_URL:?Please set the environment variable.}"
: "${VITE_REST_API_BASE_URL:?Please set the environment variable.}"

cd /

rm -rf /usr/share/nginx/html
if [[ "${VITE_IS_HOSTED}" != "true" ]]; then
  mv /poeticmetric/non-hosted /usr/share/nginx/html
else
  mv /poeticmetric/hosted /usr/share/nginx/html
fi

cd /usr/share/nginx/html

# robots.txt
if [[ "${ALLOW_ROBOTS}" == "true" ]]; then
  mv "/poeticmetric/common/robots-allow.txt" "robots.txt"
else
  mv "/poeticmetric/common/robots-disallow.txt" "robots.txt"
fi

rm -rf /poeticmetric

# replace the placeholders with environment variables
find . \
  -type f \
  -exec \
    sed \
    -i \
    -e "s|https://placeholder.poeticmetric.com|${VITE_BASE_URL}|g" \
    -e "s|https://api.placeholder.poeticmetric.com|${VITE_REST_API_BASE_URL}|g" \
    -e "s|___+++PLACEHOLDER_GOOGLE_CLIENT_ID+++___|${VITE_GOOGLE_CLIENT_ID:-none}|g" \
    -e "s|___+++PLACEHOLDER_IS_HOSTED+++___|${VITE_IS_HOSTED:-false}|g" \
    -e "s|___+++PLACEHOLDER_POSTHOG_API_KEY+++___|${VITE_POSTHOG_API_KEY:-none}|g" \
    -e "s|___+++PLACEHOLDER_TAGS_ENVIRONMENT+++___|${VITE_TAGS_ENVIRONMENT:-none}|g" \
    {} \;
