#!/usr/bin/env bash
set -eo pipefail

/usr/local/bin/generate-config.sh

exec npm run dev
