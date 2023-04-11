#!/usr/bin/env bash
set -eo pipefail

if [ "$HOSTED" != "true" ]
then
  rm -rf pages/blog
  rm -rf pages/docs

  rm -rf pages/billing.ts
  rm -rf pages/index.ts
  rm -rf pages/manifesto.tsx
  rm -rf pages/open-source.tsx
  rm -rf pages/pricing.tsx
  rm -rf pages/privacy-policy.tsx
  rm -rf pages/sign-up.tsx
  rm -rf pages/terms-of-service.tsx

  rm -rf public/blog-files
  rm -rf public/docs-files
fi

npm run build

if [ "$HOSTED" == "true" ]
then
  pnpm run build-site-map
fi

npm run export
