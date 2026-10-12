#!/bin/bash
set -eu
cd "$(dirname "$0")"
if ! command -v python3 >/dev/null 2>&1 || ! python3 -c 'import sys; sys.exit(sys.version_info < (3, 11))'; then
  echo 'Install Python 3.11 or newer from python.org, then run this launcher again.'
  exit 1
fi
exec python3 launch.py
