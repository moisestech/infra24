#!/usr/bin/env bash
# Push local migrations to the linked Supabase project (hosted).
# Full checklist: docs/DEPLOY_SUPABASE_CONTROL.md
# Prerequisites:
#   1. npx supabase login
#   2. npx supabase link --project-ref <your-project-ref>
# Then from repo root:
#   npm run supabase:push
set -euo pipefail
cd "$(dirname "$0")/.."
npx supabase db push "$@"
