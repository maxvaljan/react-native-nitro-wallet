#!/usr/bin/env bash
set -euo pipefail

tool="${1:?tool name is required}"
install_hint="${2:-Install ${tool} and try again.}"

if ! command -v "${tool}" >/dev/null 2>&1; then
  printf 'Missing native tool: %s\n%s\n' "${tool}" "${install_hint}" >&2
  exit 127
fi
