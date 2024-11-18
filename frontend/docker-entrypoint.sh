#!/usr/bin/env bash
set -eo pipefail

if [ "$NODE_ENV" == "production" ]; then
  exec pnpm run start
else
  exec pnpm run dev
fi
