#!/bin/bash
set -euo pipefail

if [ -z "${NEBULA_EMAIL:-}" ] || [ -z "${NEBULA_PASSWORD:-}" ] || [ -z "${NEBULA_WORKFLOW:-}" ]; then
    exit 0
fi

mkdir -p .deploy
curl -LJ -o .deploy/nebula-cli \
    -H 'Accept: application/octet-stream' \
    "https://storage.googleapis.com/nebula-releases/nebula-v3.0.0-linux-amd64"
chmod +x .deploy/nebula-cli

echo -n "${NEBULA_PASSWORD}" | .deploy/nebula-cli login -e "${NEBULA_EMAIL}" -p
.deploy/nebula-cli workflow run -n "${NEBULA_WORKFLOW}"