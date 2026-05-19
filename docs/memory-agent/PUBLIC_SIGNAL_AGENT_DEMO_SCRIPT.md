# Public Signal Agent — demo script

**Product name:** Public Signal Agent

**Promise (elevator):**

> **Ask the place. Generate public-safe outputs. Approve Public QR. Let visitors continue on mobile.**

**Positioning:**

> Turn institutional memory into **approved public-facing experiences**.

---

## Before you demo

1. Apply Supabase migrations **in order**:
   - `20260514120000_memory_agent_generated_assets.sql`
   - `20260515120000_memory_agent_generated_assets_channel_report.sql`
2. Confirm: table exists; channel constraint includes `report`; API create/list/patch works; **`qr_handoff`** approval path works; **`wrong_channel`** gate blocks non–QR-channel public assets.
3. Sign in with **organization access** for `/o/[slug]/memory-agent`.
4. **Freeze the path**—do not add features mid-demo. One hero question, one clean run.

**Hero question (use voice):**

> **What should visitors see this week?**

---

## 1. Frame (spoken)

> “This is a conversational audio interface to institutional memory. It lets staff ask the organization what it knows, then turns that knowledge into public, staff, leadership, signage, and mobile outputs.”

---

## 2. Ask

Use **voice** with the hero question above. Let transcription and retrieval complete.

---

## 3. Show answer

Point to:

- The **grounded answer**
- **Artist / source cards** (or equivalent record UI)
- **Follow-ups**
- **Data gaps** if the UI surfaces them

Say:

> “The answer is generated from **selected institutional records**, not from a generic chatbot memory.”

---

## 4. Show triple outputs

Say:

> “The same evidence is **reframed for three audiences**: public, staff, and leadership.”

Walk the tabs or sections in order: **Public** → **Staff** → **Leadership** (internal demo mode as appropriate).

---

## 5. Show signage

Say:

> “The **public-safe** version becomes **signage-ready** copy.”

Scroll the signage draft so it reads as lobby/kiosk language, not internal notes.

---

## 6. Save + approve

Say:

> “It saves as a **generated asset**. It is still a **draft** until staff **approve it for QR**.”

Actions:

1. **Save Signage Draft** (or save a public output—pick one story and stick to it).
2. Confirm the asset appears from the **server** when signed in (queue blurb mentions org sync).
3. Click **Approve Public QR**.
4. Confirm **status** = approved, **visibility** = public, **channel** = qr_handoff in the queue.

---

## 7. Scan QR / mobile handoff

Say:

> “Now this **public asset** can be scanned from a lobby screen or kiosk.”

- **Open Handoff** in a second browser **or** scan **QR from another phone** (the client-demo unlock: **desktop saves and approves; phone scans and opens**).

---

## 8. Context inspector (brief)

Say:

> “Internally, staff can inspect **what records were used** and **what was validated**.”

Keep this under ~30 seconds unless the buyer is technical.

---

## 9. Close

Pick one:

> “This is **institutional memory** becoming **public-facing infrastructure**.”

Governance line:

> “**The agent drafts. Your team approves. Visitors only see approved public handoffs.**”

---

## 90-second recording structure (after QA)

| Time | Beat |
|------|------|
| 0:00 | Ask by voice (hero question) |
| 0:15 | Answer + grounded / cards |
| 0:30 | Signage draft |
| 0:45 | Save + **Approve Public QR** |
| 1:00 | Scan QR / mobile handoff on phone |
| 1:15 | Inspector / traceability (quick) |
| 1:30 | Closing line + governance line |

---

## Pilot QA checklist (cross-device proof)

The **most important** test: **Desktop saves and approves; phone scans and opens.**

1. Migrations applied (both files, in order).
2. Sign in with org access → `/o/[slug]/memory-agent`.
3. Ask hero question → answer renders.
4. Public / Staff / Leadership render.
5. Signage draft renders.
6. **Save Signage Draft** → asset in queue from **server**.
7. **Approve Public QR** → approved, public, `qr_handoff`.
8. **Open Handoff** + scan **QR from another phone** → handoff renders.
9. **Archive** asset → handoff **blocked** for visitors.

---

## What not to demo yet

Force graphs, multi-agent diagrams, full analytics, PDF export, many vertical skins. **One loop, perfectly.**

---

## Companion documents

- [AI Public Output Governance](./AI_PUBLIC_OUTPUT_GOVERNANCE.md)
- [Public Signal Agent — pilot offer](./PUBLIC_SIGNAL_AGENT_PILOT_OFFER.md)
