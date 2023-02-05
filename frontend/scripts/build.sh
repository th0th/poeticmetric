#!/usr/bin/env bash
set -eo pipefail

if [ "$HOSTED" != "true" ]
then
  rm -rf pages/billing
  rm -rf pages/blog
  rm -rf pages/docs
  rm -rf pages/index.ts
  rm -rf pages/manifesto.tsx
  rm -rf pages/pricing.tsx
  rm -rf pages/privacy-policy.tsx
  rm -rf pages/sign-up.tsx
  rm -rf pages/terms-of-service.tsx
fi

npm run build

if [ "$HOSTED" == "true" ]
then
  npm run build-site-map
fi

npm run export
