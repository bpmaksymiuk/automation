#!/usr/bin/env bash
# Generic pipeline deploy script.
# Usage: ./deploy.sh [--dry-run]
#
# Requires a .env.deploy file (see .env.deploy.example) and a private key whose
# path is set in DEPLOY_KEY_PATH.
#
# The private key itself is NEVER stored in this repository.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/.env.deploy"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Error: $ENV_FILE not found. Copy .env.deploy.example to .env.deploy and fill in values." >&2
  exit 1
fi

# shellcheck source=/dev/null
source "$ENV_FILE"

: "${DEPLOY_USER:?DEPLOY_USER not set}"
: "${DEPLOY_HOST:?DEPLOY_HOST not set}"
: "${DEPLOY_PATH:?DEPLOY_PATH not set}"
: "${DEPLOY_KEY_PATH:?DEPLOY_KEY_PATH not set}"
DEPLOY_PORT="${DEPLOY_PORT:-22}"

BUILD_DIR="${BUILD_DIR:-${SCRIPT_DIR}/9-BUILD}"
DIST_DIR="${DIST_DIR:-${BUILD_DIR}/dist}"

if [[ -f "$BUILD_DIR/package.json" ]]; then
  echo "==> Building production bundle from ${BUILD_DIR}"
  (cd "$BUILD_DIR" && npm run build)
else
  echo "==> No package.json in ${BUILD_DIR}; skipping npm build"
fi

if [[ -d "$DIST_DIR" ]]; then
  DEPLOY_SOURCE_DIR="$DIST_DIR"
elif [[ -f "$BUILD_DIR/index.html" ]]; then
  DEPLOY_SOURCE_DIR="$BUILD_DIR"
else
  echo "Error: no deployable output found. Checked ${DIST_DIR} and ${BUILD_DIR}." >&2
  exit 1
fi

echo "==> Deploying to ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}"

RSYNC_OPTS=(-az --delete --checksum -e "ssh -p ${DEPLOY_PORT} -i ${DEPLOY_KEY_PATH} -o StrictHostKeyChecking=accept-new")

if [[ "${1:-}" == "--dry-run" ]]; then
  RSYNC_OPTS+=(--dry-run)
  echo "(dry run — no files will be transferred)"
fi

rsync "${RSYNC_OPTS[@]}" "${DEPLOY_SOURCE_DIR}/" "${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/"

echo "==> Deploy complete."
