#!/usr/bin/env bash
set -eo pipefail

if [ "$POETICMETRIC_FRONTEND_DEV" = "true" ]; then
  exec pnpm run dev
else
  pnpm run build
  exec pnpm run start
fi
