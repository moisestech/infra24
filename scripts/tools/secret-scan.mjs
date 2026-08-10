#!/usr/bin/env node
/**
 * Lightweight Stage-0 secret gate for CI / verify:career.
 * Does not rewrite git history. Fails if credential-bearing backups are tracked
 * or if common secret patterns appear in tracked text files.
 *
 * Known remediation debt: `.env.local.local-backup` was previously committed.
 * Rotate those credentials; history rewrite is optional and not done here.
 */
import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const DENY_TRACKED = [
  /^\.env\.local(\.|$)/,
  /^\.env\.production(\.|$)/,
  /\.pem$/i,
  /credentials\.json$/i,
  /service[-_]account.*\.json$/i,
]

const CONTENT_PATTERNS = [
  { name: 'OpenAI sk-key', re: /\bsk-(?:proj-|live-|test-)?[A-Za-z0-9]{20,}\b/ },
  { name: 'Airtable pat', re: /\bpat[A-Za-z0-9]{14,}\.[A-Za-z0-9]{40,}\b/ },
  { name: 'Clerk live secret', re: /\bsk_live_[A-Za-z0-9]{20,}\b/ },
  { name: 'AWS access key', re: /\bAKIA[0-9A-Z]{16}\b/ },
  { name: 'Stripe live secret', re: /\bsk_live_[A-Za-z0-9]{20,}\b/ },
]

const ALLOW_PATH_PREFIXES = [
  '.env.example',
  'docs/',
  '__tests__/fixtures/',
  'scripts/tools/secret-scan.mjs',
]

/** Local `supabase start` demo JWTs are ubiquitous in scripts; skip JWT scanning. */


function trackedFiles() {
  const out = execSync('git ls-files -z', { encoding: 'buffer' })
  return out
    .toString('utf8')
    .split('\0')
    .filter(Boolean)
}

function isAllowed(path) {
  return ALLOW_PATH_PREFIXES.some((p) => path === p || path.startsWith(p))
}

const files = trackedFiles()
const failures = []

for (const path of files) {
  if (DENY_TRACKED.some((re) => re.test(path))) {
    failures.push(`Tracked credential-bearing path: ${path}`)
  }
}

for (const path of files) {
  if (isAllowed(path)) continue
  if (!/\.(ts|tsx|js|jsx|mjs|cjs|json|md|yml|yaml|env|txt|sql|toml)$/i.test(path)) continue
  let text
  try {
    text = readFileSync(path, 'utf8')
  } catch {
    continue
  }
  // Skip binary-ish / huge
  if (text.length > 2_000_000) continue
  for (const { name, re } of CONTENT_PATTERNS) {
    if (re.test(text)) {
      failures.push(`${name} pattern in tracked file: ${path}`)
    }
  }
}

if (failures.length) {
  console.error('secret-scan failed:')
  for (const f of failures) console.error(`  - ${f}`)
  console.error(
    '\nRemediation: remove from the index (git rm --cached), harden .gitignore, rotate secrets. Do not force-push history unless planned.'
  )
  process.exit(1)
}

console.log(`secret-scan ok (${files.length} tracked files checked)`)
