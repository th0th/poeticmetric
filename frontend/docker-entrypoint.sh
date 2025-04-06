#!/usr/bin/env bash
set -eo pipefail

/poeticmetric/bin/bootstrap

if [ "$NODE_ENV" == "production" ]; then
  exec pnpm run start
else
  exec pnpm run dev
fi
