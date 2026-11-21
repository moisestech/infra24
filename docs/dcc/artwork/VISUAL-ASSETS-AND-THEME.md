# The Network Makes Itself + Community Atlas — visual asset and theme plan

Updated: November 21, 2026

## Design principle

**The graph is the principal artwork image. The people are the evidence.**

Use photographic portraits when they help someone find a real collaborator. Use real documentation when explaining a physical edition or an event. Do not fill the site with generated avatar faces, stock community imagery, emojis, category illustrations pretending to be people, or a fictional connection topology.

The two public network routes now use one semantic theme system, sharing:
- **Light**: warm chalk, deep green-black text, stronger graph and poll marks.
- **Dark**: deep green-black, chalk/soft-mint labels, muted material accents.
- Existing site preference: \`ThemeContext\` and \`html.light\` / \`html.dark\`, including System. No second mode setting.
- Tokens: \`app/(marketing)/dcc-network-theme.css\`.
- WebGL: \`PeopleNetworkField.tsx\` reads those CSS values and updates the renderer when the theme changes; no graph re-mount or camera reset.
- Mobile: viewport-scaled canvas, single-column artist details, swipeable category filters, larger targets, dialogs that scroll and use the same palette, a capped device pixel ratio, reduced-motion camera rules.

## Already available: verified public assets

These image URLs are from the connected public DCC Cloudinary library. They are real portrait photography, not synthetic placeholders.

| Slot | Verified asset | Usage |
|---|---|---|
| Moises artist profile | \`https://res.cloudinary.com/dck5rzi4h/image/upload/v1777511801/dccmiami/portraits/moises-pfp_dnn3d3.jpg\` | Artist card and Atlas details |
| Fabiola artist profile | \`https://res.cloudinary.com/dck5rzi4h/image/upload/v1777518148/dccmiami/portraits/fabiola-lariosm-profile_vuypf4.jpg\` | Artist card and Atlas details |
| Angelo artist profile | \`https://res.cloudinary.com/dck5rzi4h/image/upload/v1780488560/dccmiami/portraits/angelo-caruso-portrait-from-exhibition_avht0i.png\` | Artist card and Atlas details |
| Two public cofounders together | \`https://res.cloudinary.com/dck5rzi4h/image/upload/v1777520267/dccmiami/portraits/Fabiola-and-Moises_khyrpu.jpg\` | Photo-based anchor on project proposal (replaces an obsolete fictional-network concept render) |

The existing approved profile-data contract only exposes individually approved attributes from Airtable. Curated, public artist examples remain editorially separate from real live opt-ins. No one is assigned a private poll selection based on their portrait.

## The three next visuals worth producing

**Priority 1 — actual artwork preview still / OG card.** Capture the *deployed real 3D field*, preferably at 1200×630 and 1080×1350, with the two public cofounders visible and no fictitious person-to-person links. Use a UI capture rather than fabricated render. This is for link previews and project pitches. Review small-screen legibility before promoting it.

**Priority 2 — actual DCC action documentation.** One or two consent-cleared photographs of a fabrication exchange, workshop, or public meetup. This makes the social infrastructure tangible, but should be used sparingly in the Atlas/Passport context. Record photographer credit and reuse permissions. Don't imply people shown opted into public profiles.

**Priority 3 — physical artwork test object.** Document a real low-budget material prototype: one freestanding 3D-printed or laser-cut, assembled network sculpture, photographed against a neutral studio background with a human or ruler for scale. This belongs on the proposal only once it actually exists; never label a generated concept as documentation of a completed object.

## Not needed

- Additional icons or emojis beyond the existing Lucide UI glyphs.
- AI-generated headshots in place of real portraits.
- Decorative hero stock photos behind the network.
- The older speculative SVG, which described fictional user edits and is no longer aligned with the live model.
- A second graph or diagram in the Atlas that could conflict with the artwork's evidence.

## Visual QA / acceptance

1. Test light, dark, and system color modes; use browser computed colors rather than only checking for class presence.
2. Check at 375px, 390px, 768px, and desktop widths, including iOS Safari and Android Chrome.
3. The canvas must remain responsive to theme changes and selection; browser Back after profile links must work.
4. Ensure real photos are not distorted: \`object-fit: cover\`, consistent accessible alt text, initial fallback when missing.
5. Touch scrolling should not be trapped by the canvas. Controls need at least ~40px target height and visible focus.
6. Radix/Lucide poll colors should show sufficient contrast in both modes and **72 selections must never be labeled 72 respondents**.
7. Passport and profile requests are interactive regardless of theme; disabled intake is still labeled honestly.
8. The proposal's live field and founder photograph must make a clearer evidence claim than the old speculative sketch.
9. Don't claim a physical edition exists until fabricated and photographed.
