---
slug: anti-interface-jodi
title: Interface, Glitch, and Disruption — JODI
description: >-
  Interfaces are not neutral: they choreograph attention, trust, and frustration.
  Glitch can be read as language. JODI’s anti-interface work asks what happens when
  the browser’s “polite” surface refuses to behave.
order: 9
estimated_duration: 50
difficulty: beginner
---

> **Lesson chrome:** On the dedicated chapter page, the thesis, rail, anchor Whitney links (artist, exhibition, exhibition art), artist/institution cards, and tool strip come from `lib/course/overlays/anti-interface-jodi.ts`. Edit that file when you tune copy; keep this markdown as the long-form reader.

Most people experience the web as **smooth**: legible type, predictable buttons, gentle errors. Net art often asks a different question: *what does the interface do to your body and mood before you even “understand” the piece?*

This chapter treats the **interface as an emotional system**—spacing, motion, defaults, and failure states included—and introduces **glitch** not only as accident but as **tone and syntax**. We then look at **anti-interface** strategies through **JODI** (Joan Heemskerk and Dirk Paesmans): work that weaponizes wrongness, overload, and misdirection while still living inside the browser.

If you followed [Hypertext and nonlinear narrative](hypertext-and-nonlinear-narrative), you already practiced *where* attention moves. Here we focus on *how* surfaces feel—and what it means when they refuse to cooperate.

## Interface as emotional system

An interface is more than chrome around content. It trains expectations:

- **Rhythm:** fast cuts vs. long holds change how “serious” or “playful” a page feels.  
- **Hierarchy:** what is big, centered, or dimmed tells the viewer what counts—even when the text disagrees.  
- **Recovery:** a calm error message soothes; a raw stack trace alarms. Both are aesthetic choices.  
- **Friction:** extra clicks can feel respectful (consent) or hostile (obstruction).

**Try this lens:** describe a webpage you use daily using only **feeling words** (relieved, watched, rushed, soothed). Then list **three concrete UI decisions** that create those feelings (spacing, copy, color, motion, sound).

### Questions

1. When is “smooth” ethical—and when is it manipulative?  
2. Where does your own work *comfort* the viewer, and where should it *challenge* them?  
3. What is the difference between **confusing** someone and **refusing** the default contract of usability?

## Glitch as language (preview)

**Glitch** is often introduced as broken files or corrupted video—but in net art it frequently behaves like **language**: repetition, stutter, truncation, and illegibility become *units of meaning*.

You do not need a perfect definition yet. Notice three qualities you can *design* with even in plain HTML/CSS:

- **Pattern + break:** establish a beat, then snap it once.  
- **Legibility at risk:** almost-readable text invites projection.  
- **Material honesty:** show the seams (scrollbars, system fonts, default outlines) instead of hiding them.

You will go deeper in the next reader chapter, **[Glitch as language — JODI](glitch-as-language-jodi)**—for now, keep a small “glitch vocabulary” list in your notes (three verbs, three nouns).

## Smooth vs. anti-interface

**Smooth interface** wants to disappear: errors are quiet, paths are obvious, the user is “guided.” Many civic and commerce contexts need this.

**Anti-interface** (as a *critical/aesthetic* stance) deliberately **breaks the politeness contract**—not always to destroy usability, but to **expose power** or **short-circuit habit**. Tactics can include:

- wrong hierarchy (everything screams)  
- hostile cursor/scroll behavior used as *material*  
- “broken” navigation that still has *rules* (it is hostile, not random)  
- raw HTML energy: chaos that is composed, not careless

**Important distinction:** anti-interface is not an excuse for inaccessible art. You can be provocative while still offering **alt text**, **keyboard paths**, or **clear artist statements** outside the chaotic surface.

### Anchor: JODI

**JODI** helped define net-native disruption in the 1990s: sites that felt like crashes, wrong turns, and aggressive minimalism—*before* “glitch” was a mainstream aesthetic. Their work is frequently cited in histories of net art and experimental web practice.

**Whitney spine (images + institutional framing—start here):**

- [Whitney — Artist: JODI](https://whitney.org/artists/15261)  
- [Whitney — Exhibition: *JODI*](https://whitney.org/exhibitions/jodi)  
- [Whitney — Exhibition art](https://whitney.org/exhibitions/jodi/art)  

**More context (read lightly, steal verbs, not pixels):**

- [Jodi (art collective) — Wikipedia overview](https://en.wikipedia.org/wiki/Jodi_(art_collective))  
- [Rhizome](https://rhizome.org/) — archives, essays, and preservation adjacent to net art histories  
- [Tate](https://www.tate.org.uk/) — broader modern/contemporary framing when you want museum-scale language for web-based work  

Use museums and archives as **context and citation practice**, not as a checklist of “official approval.” Your job is to connect **your** interface decisions to **your** politics and poetics.

## Mini artifact — Anti-Interface Study

Ship a single-page study that **refuses one default expectation** of the “nice” web while remaining **intentionally navigable**.

### Easy mode

Break **one** convention (alignment, hover affordance, or heading hierarchy). Add a **one-sentence** artist label at the bottom naming the convention you refused.

### Medium mode

Break **two** conventions and add a **second beat**: a visible state change (color, spacing, or motion) that re-frames the first beat.

### Advanced mode

Design a **hostile-but-rule-based** interaction (for example: misleading hover states that follow an internal logic, or a scroll behavior that “argues back”). Pair it with a **short statement** (3–5 sentences) explaining the **contract** you are breaking—and why.

## Reflection

- What emotion did you *stage* with layout alone?  
- Where did you still rely on “smooth” defaults to keep the piece legible?  
- What is the ethical line between **disruption** and **harm** for your audience?  
- How does glitch-as-language show up in your study—even if you did not use images or video?

---

Next in the reader: **[Glitch as language — JODI](glitch-as-language-jodi)**—error, repetition, and distortion as feeling. Later in the sequence, return to these ideas in **[Interaction, Motion, and Responsive Behavior](interaction-motion-and-responsive-behavior)**.

<!-- chapter-reference-media -->

## Reference media

Two workshop visuals (swap URLs for your slide exports when ready).

![Catalog workshop visual](https://res.cloudinary.com/dck5rzi4h/image/upload/q_auto/f_auto/v1776525117/dccmiami/workshops/vibe-coding-with-net-art_dtead3.png)

![Workshop hero](https://res.cloudinary.com/dkod1at3i/image/upload/v1776612065/vibe-code-and-net-art_mx7emv.webp)

### In-chapter clip (CC0 sample)

<div class="not-prose my-6 max-w-3xl">
<video controls playsinline preload="metadata" poster="https://res.cloudinary.com/dck5rzi4h/image/upload/q_auto,f_auto/v1776525117/dccmiami/workshops/vibe-coding-with-net-art_dtead3.png" class="w-full rounded-lg border border-neutral-200 dark:border-neutral-800">
  <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4" />
</video>

<p class="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Sample clip (MDN interactive examples, CC0). Replace with your own narrated screen capture or an embed when publishing.</p>
</div>
