#!/usr/bin/env bash
set -eo pipefail

/usr/local/bin/generate-config.sh

exec pnpm run dev
