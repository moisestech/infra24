/**
 * Golden-set eval for Memory Agent grounding.
 *
 *   npm run eval:memory-agent
 *   npm run eval:memory-agent -- --org=dcc
 *   npm run eval:memory-agent -- --json
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import path from 'path'
import { config } from 'dotenv'

import { getAlumniConnectionForOrg } from '@/lib/airtable/org-alumni-config'
import { runMemoryAgentAsk } from '@/lib/memory-agent/ask'
import { getOpenAIClient } from '@/lib/memory-agent/openai-client'
import type { MemoryAgentCitationSourceType, MemoryAgentMode } from '@/types/memory-agent'

config({ path: path.resolve(process.cwd(), '.env.local') })

type GoldenCase = {
  id: string
  orgSlug: string
  mode: MemoryAgentMode
  question: string
  mustCiteSourceTypes?: MemoryAgentCitationSourceType[]
  mustIncludeRecordIds?: string[]
  mustNotIncludePatterns?: string[]
  answerMustMatch?: string[]
  expectDataGaps?: boolean
  skipIfNotConfigured?: boolean
}

type CaseResult = {
  id: string
  passed: boolean
  skipped?: boolean
  reason?: string
  errors: string[]
}

function loadGolden(): GoldenCase[] {
  const file = path.join(process.cwd(), '__tests__/fixtures/memory-agent-golden.json')
  return JSON.parse(readFileSync(file, 'utf8')) as GoldenCase[]
}

function parseArgs() {
  let orgFilter: string | null = null
  let jsonOut = false
  let reportPath: string | null = null

  for (const a of process.argv.slice(2)) {
    if (a.startsWith('--org=')) orgFilter = a.slice(6).trim().toLowerCase()
    else if (a === '--json') jsonOut = true
    else if (a.startsWith('--report=')) reportPath = a.slice(9).trim()
  }

  return { orgFilter, jsonOut, reportPath }
}

async function evaluateCase(testCase: GoldenCase): Promise<CaseResult> {
  const errors: string[] = []

  if (testCase.skipIfNotConfigured && !getAlumniConnectionForOrg(testCase.orgSlug)) {
    if (testCase.orgSlug !== 'dcc') {
      return { id: testCase.id, passed: true, skipped: true, reason: 'org not configured', errors: [] }
    }
  }

  const result = await runMemoryAgentAsk({
    orgSlug: testCase.orgSlug,
    question: testCase.question,
    mode: testCase.mode,
  })

  if (!result.ok) {
    if (testCase.skipIfNotConfigured && result.code === 'not_configured') {
      return { id: testCase.id, passed: true, skipped: true, reason: result.message, errors: [] }
    }
    return { id: testCase.id, passed: false, errors: [result.message] }
  }

  const data = result.data
  const answerLower = data.answer.toLowerCase()
  const artistIds = new Set(data.artists.map((a) => a.id))
  const eventIds = new Set((data.events ?? []).map((e) => e.id))
  const sourceTypes = new Set((data.sources ?? []).map((s) => s.type))
  const sourceIds = new Set((data.sources ?? []).map((s) => s.id))

  if (testCase.expectDataGaps && data.dataGaps.length === 0) {
    errors.push('Expected dataGaps to be non-empty for unanswerable question')
  }

  for (const pattern of testCase.mustNotIncludePatterns ?? []) {
    if (new RegExp(pattern, 'i').test(data.answer)) {
      errors.push(`Answer must not match pattern: ${pattern}`)
    }
  }

  for (const fragment of testCase.answerMustMatch ?? []) {
    if (!answerLower.includes(fragment.toLowerCase())) {
      errors.push(`Answer must mention: ${fragment}`)
    }
  }

  for (const type of testCase.mustCiteSourceTypes ?? []) {
    if (!sourceTypes.has(type)) {
      errors.push(`Missing citation source type: ${type}`)
    }
  }

  for (const recordId of testCase.mustIncludeRecordIds ?? []) {
    const inArtists = artistIds.has(recordId)
    const inEvents = eventIds.has(recordId)
    const inSources = sourceIds.has(recordId)
    if (!inArtists && !inEvents && !inSources) {
      errors.push(`Expected record id in response: ${recordId}`)
    }
  }

  for (const artist of data.artists) {
    if (data.contextInspector?.retrieval?.allowedArtistIds) {
      const allowed = new Set(data.contextInspector.retrieval.allowedArtistIds)
      if (!allowed.has(artist.id)) {
        errors.push(`Artist id not in allowed context: ${artist.id}`)
      }
    }
  }

  return { id: testCase.id, passed: errors.length === 0, errors }
}

async function main() {
  if (!getOpenAIClient()) {
    console.log('SKIP: OPENAI_API_KEY not set — eval:memory-agent requires live API')
    process.exit(0)
  }

  const { orgFilter, jsonOut, reportPath } = parseArgs()
  let cases = loadGolden()
  if (orgFilter) cases = cases.filter((c) => c.orgSlug === orgFilter)

  const results: CaseResult[] = []
  for (const testCase of cases) {
    const r = await evaluateCase(testCase)
    results.push(r)
    if (!jsonOut) {
      const label = r.skipped ? 'SKIP' : r.passed ? 'PASS' : 'FAIL'
      console.log(`${label} ${testCase.id}`)
      r.errors.forEach((e) => console.log(`  - ${e}`))
    }
  }

  const failed = results.filter((r) => !r.passed && !r.skipped)
  const passed = results.filter((r) => r.passed && !r.skipped)
  const skipped = results.filter((r) => r.skipped)

  const summary = {
    runAt: new Date().toISOString(),
    total: results.length,
    passed: passed.length,
    failed: failed.length,
    skipped: skipped.length,
    results,
  }

  if (reportPath) {
    mkdirSync(path.dirname(reportPath), { recursive: true })
    writeFileSync(reportPath, JSON.stringify(summary, null, 2))
  }

  if (jsonOut) {
    console.log(JSON.stringify(summary, null, 2))
  } else {
    console.log(`\nEval: ${passed.length} passed, ${failed.length} failed, ${skipped.length} skipped`)
  }

  if (failed.length) process.exit(1)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
