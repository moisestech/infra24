# Community Atlas — verification

Checkpoint: November 16, 2026.

## Story

A visitor explores an interest-based force-directed graph, selects a profile and its public links, and can request their own public profile. Requests remain pending until identity, permission and content review. Approved source edits can be refreshed without rebuilding the site. Passport remains a separate optional local preview.

| Boundary | Result | Evidence |
|---|---|---|
| Data model / provider / handlers | Pass | 24 focused Jest tests across three suites. Includes public-field stripping, permission gates, unsafe links, duplicate slugs, pagination, sequential retries, pending staging, exact disclosure, same-origin validation, size limits, provider failure and withdrawal/update responses. |
| Feature TypeScript | Pass | Strict focused check covers the route, model, adapter, form and graph. |
| Lint | Pass | ESLint on the changed components, adapter, schema and API handlers. |
| Force graph | Pass | Actual library renders a canvas in headless Chromium; search, interest filtering and profile selection work. |
| Existing Passport preview | Pass | Browser save/reload/removal retains local-only behavior and no POST. |
| Public profile form | Pass with mocked HTTP responses | Disabled configuration shown honestly. Enabled form preserves inputs after 503, keeps retry UUID, and displays pending only after 202. It does not add the pending profile to the public list. |
| Updated data | Pass with mocked HTTP responses | Refresh displays a modified approved summary; subsequent withdrawal removes the profile. |
| Public links / deep selection | Pass | Approved portfolio link present and query-selected profile opened. |
| Phone layout | Pass | 390 × 844 viewport, no horizontal overflow. |
| No-WebGL fallback | Pass | Forced WebGL failure leaves profiles and filters available. |
| Uncaught browser errors | None during successful journeys | Checked on desktop and phone widths. |
| Real provider writes / production release | Not established | No actual member submission sent by tests; dedicated server credentials/capacity and release configuration are still required. |
| Full application integration | Not established | Browser harness imports actual feature files and routes without the production marketing shell or Clerk configuration. |

The newest library renderer initially failed to compile because it required a Three.js Timer export absent from this application's Three.js 0.170. The graph and renderer are now pinned to a compatible scoped pair; the existing application Three.js version is unchanged. Compilation and browser rendering were rechecked successfully.

A repository-wide type check at the previous checkpoint exceeded the default Node heap. The focused checks do not claim whole-repository type correctness. Request throttling is per instance; production distributed/edge abuse control remains a launch requirement. Provider lookups prevent sequential duplicate retries, not races under concurrent writes.

No private member roster, private coordination URL, provider credential or individual poll-voter record is committed by this feature. Anonymous dots in preview mode are explicitly illustrative.
