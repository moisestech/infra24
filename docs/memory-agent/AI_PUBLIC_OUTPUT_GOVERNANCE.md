# AI Public Output Governance

Client-facing policy for **Public Signal Agent**: institutional memory → governed outputs → signage → **Approve Public QR** → mobile handoff for visitors.

**Positioning (one line):**

> Turn institutional memory into **approved public-facing experiences**.

---

## Core policy

- **AI-generated content is always a draft** until staff take explicit approval actions.
- Staff can save drafts as **generated assets** (public output, signage, QR handoff, staff brief, leadership insight).
- Staff **approve public assets** before they are suitable for visitor-facing channels.
- **QR / mobile handoffs require explicit approval** (“Approve Public QR” in the product): visibility public, channel `qr_handoff`, status approved (with audit fields on the server where configured).
- **Internal outputs** (for example staff briefs and leadership insights) are **never exposed** on the public handoff route.
- **Archived and expired** assets **stop rendering** for visitors.
- **Every asset is traceable** to the originating question and stored metadata the product retains for review.
- **Handoff routes enforce public-safe types only** on the server (`public_output`, `signage_draft`, `qr_handoff`), plus visibility, status, channel, expiry, and archive rules—**not** the browser alone.

---

## Technical gates (summary)

| Gate | Purpose |
|------|---------|
| Public-safe **type** | Only approved types may be returned for anonymous handoff fetches. |
| **`visibility === public`** | Internal drafts cannot become visitor-facing. |
| **`status` approved or published** | Unreviewed AI content does not appear on QR handoff. |
| **`channel === qr_handoff`** | Wrong channel returns a blocked state until staff use **Approve Public QR**. |
| **Not expired; not archived** | Stale or retired assets do not render. |

---

## Client-safe lines (use verbatim in decks and email)

> **Infra24 does not auto-publish institutional memory. It creates governed public assets that staff can review, approve, expire, and trace.**

> **The agent drafts. Your team approves. Visitors only see approved public handoffs.**

---

## Trace metadata (no extra migrations)

Saved assets may include a small **`metadata` JSON** packet: source mode, originating question, assistant message id, coarse retrieval counts / allowed record ids, output kinds present in the turn, `promptVersion`, and **server-added** `chatModel` / `embedModel`. This supports the claim that assets are tied to a governed generation context—not full line-by-line prompt provenance.

## Related code (for implementers)

- Trace builder: `lib/memory-agent/save-asset-trace.ts`
- Public gate: `evaluatePublicHandoff` in `lib/memory-agent/memory-agent-generated-assets-repo.ts`
- Client parity for buttons and links: `isGeneratedAssetHandoffPublished` in `lib/memory-agent/generated-assets.ts`
- Handoff UX: `components/memory-agent/MemoryAgentHandoffPage.tsx`
- Generated assets queue: `components/memory-agent/MemoryAgentGeneratedAssetsQueue.tsx`
