type HydrationLogPayload = {
  location: string
  message: string
  data?: Record<string, unknown>
  hypothesisId?: string
  runId?: string
}

const ENDPOINT = 'http://127.0.0.1:7282/ingest/20c3cc96-1b1d-4e06-ae4c-3f681483d130'
const SESSION_ID = '5caec2'

/** Debug-only NDJSON log for memory-agent hydration investigation. */
export function logMemoryAgentHydration(payload: HydrationLogPayload) {
  const body = {
    sessionId: SESSION_ID,
    timestamp: Date.now(),
    ...payload,
  }

  if (typeof window !== 'undefined') {
    // #region agent log
    fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Debug-Session-Id': SESSION_ID,
      },
      body: JSON.stringify(body),
    }).catch(() => {})
    // #endregion
  }
}
