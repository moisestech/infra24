---
slug: interaction-motion-and-responsive-behavior
title: Interaction, Motion, and Responsive Behavior
description: >-
  Learn how hover, click, motion, delay, and responsive change become artistic
  material in browser-based art — with Rozendaal, Whitney Sunrise/Sunset, and
  MDN as practical spines.
order: 22
estimated_duration: 55
difficulty: beginner
---

> **Lesson chrome:** On the dedicated chapter page, the thesis, rail, anchor Whitney / Rhizome links, **chapter media** strip (two placeholder stills from the overlay), artist and institution cards, tool strip, artifact, and reflection prompts come from `lib/course/overlays/interaction-motion-and-responsive-behavior.ts`. Concept cards support optional icons (react-icons via `ConceptBlock`). Edit the overlay when you tune copy; keep this markdown as the long-form reader.

> **Outcomes:** By the end of this chapter, you should be able to (1) read **interaction** as artistic material, (2) treat **motion and responsiveness** as meaning rather than only polish, (3) distinguish **static layout** from **behavioral** design, (4) connect **time and state** to net art practice, and (5) ship a **small browser work** that changes through user action or timed motion.

A webpage does not have to stay still.

It can react.  
It can fade.  
It can reveal.  
It can hesitate.  
It can transform when you hover, click, scroll, or wait.

That means a page can behave like an **event**, not only an image.

> **In net art, interaction and motion can become part of the meaning.**

If you are coming from [Interface, Glitch, and Disruption — JODI](anti-interface-jodi), you have already practiced **refusal** and **instability**. Here the emphasis shifts toward **choreography**: how small responses, delays, and motion shape trust, play, and attention.

## Why this matters

If a page only sits there, the viewer mostly **looks**.

If a page **responds**, the viewer begins to **test** it:

- What happens if I hover here?  
- What changes if I click?  
- What is hidden?  
- What is delayed?  
- Is this page alive?  
- Am I controlling it, or is it controlling me?

This is one reason interactive browser art feels different from a poster or a screenshot.

## Working definitions

For this workshop:

- **Interaction** is any meaningful change triggered by the viewer’s action.  
- **Motion** is any visual change over time.  
- **Responsive behavior** is when the page changes state in relation to input, timing, or context.

That change can be small or large: color shift, reveal, movement, resize, fade, loop, transform, or delay.

## Key ideas (compact)

### Hover is attention

Hover can reward attention: reveal, shift mood, clarify, destabilize, or expose a hidden layer. The viewer’s attention **activates** the work.

### Click is agency

A click can read as choice, permission, interruption, transformation, trigger, or trap—not only “go to next page.”

### Motion shapes feeling

Fast motion can feel anxious, playful, aggressive, or unstable. Slow motion can feel dreamy, suspenseful, ceremonial, or distant. **Timing is never neutral.**

### Delay creates suspense

Not everything needs to happen instantly. Delay creates anticipation, uncertainty, rhythm, patience, or unease.

### The page can feel alive

Responsive behavior makes the surface feel less fixed: the page can answer back, unfold in sequence, and hold multiple states.

## Canon anchors

### Rafaël Rozendaal

Important for focused browser composition, **interaction as a visual event**, and websites as self-contained artworks. The Whitney’s artist dossier is a clean citation spine; Rhizome’s **into time .com** anthology entry is ideal when you want language about participatory abstraction.

- [Whitney — Artist: Rafaël Rozendaal](https://whitney.org/artists/17027)  
- [Whitney — Exhibition: Rafaël Rozendaal (*Almost There*)](https://whitney.org/exhibitions/rafael-rozendaal)  
- [Rhizome — Anthology: into time .com](https://anthology.rhizome.org/intotime-com)  

### Whitney Sunrise/Sunset

Important for **browser-native artworks unfolding over time** and for treating the webpage as a **short, timed event** on an institutional domain.

- [Whitney — Sunrise/Sunset](https://whitney.org/exhibitions/sunrise-sunset)  

### Browser-native interaction references

Practical foundations for teaching transitions and animations as **designable events**:

- [MDN — Using CSS transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Transitions/Using)  
- [MDN — Using CSS animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations/Using_CSS_animations)  
- [MDN — :hover](https://developer.mozilla.org/en-US/docs/Web/CSS/:hover)  
- [Tate — Internet art](https://www.tate.org.uk/art/art-terms/i/internet-art)  

## Static page vs responsive page

**Static page** usually emphasizes composition, fixed presentation, and stable reading.

**Responsive page** may emphasize change over time, viewer action, reveal/conceal, multiple states, timing, sequence, and **behavior as form**.

Neither is inherently better—they train different kinds of attention.

## Layout lab — demo placeholders

Use this block as a **storyboard** when you record teaching clips: same content, different states.

<div class="not-prose my-8 grid max-w-5xl gap-4 md:grid-cols-2">
  <figure class="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950/60">
    <div class="flex aspect-video items-center justify-center bg-neutral-200/90 px-4 text-center text-xs font-medium text-neutral-600 dark:bg-neutral-800/90 dark:text-neutral-400">
      Placeholder video: “Same headline — static A” (replace embed)
    </div>
    <figcaption class="border-t border-neutral-100 p-3 text-xs text-neutral-600 dark:border-neutral-800 dark:text-neutral-400">Demo 1a — baseline</figcaption>
  </figure>
  <figure class="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950/60">
    <div class="flex aspect-video items-center justify-center bg-neutral-200/90 px-4 text-center text-xs font-medium text-neutral-600 dark:bg-neutral-800/90 dark:text-neutral-400">
      Placeholder video: hover reveal + slow fade (replace embed)
    </div>
    <figcaption class="border-t border-neutral-100 p-3 text-xs text-neutral-600 dark:border-neutral-800 dark:text-neutral-400">Demo 1b — state change</figcaption>
  </figure>
  <figure class="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950/60">
    <div class="flex aspect-video items-center justify-center bg-neutral-200/90 px-4 text-center text-xs font-medium text-neutral-600 dark:bg-neutral-800/90 dark:text-neutral-400">
      Placeholder video: same motion, very fast (replace embed)
    </div>
    <figcaption class="border-t border-neutral-100 p-3 text-xs text-neutral-600 dark:border-neutral-800 dark:text-neutral-400">Demo 2a — fast timing</figcaption>
  </figure>
  <figure class="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950/60">
    <div class="flex aspect-video items-center justify-center bg-neutral-200/90 px-4 text-center text-xs font-medium text-neutral-600 dark:bg-neutral-800/90 dark:text-neutral-400">
      Placeholder video: same motion, very slow (replace embed)
    </div>
    <figcaption class="border-t border-neutral-100 p-3 text-xs text-neutral-600 dark:border-neutral-800 dark:text-neutral-400">Demo 2b — slow timing</figcaption>
  </figure>
</div>

## Questions to ask

- What action causes the page to change?  
- Does the interaction feel rewarding, surprising, or suspicious?  
- Is the motion helping meaning or just adding decoration?  
- What state comes first, and what state comes after?  
- Does the work depend on timing?  
- Does the page feel alive, reactive, or staged?  
- Is the viewer in control, or being guided?

## Mini artifact — Responsive study

Make a one-page browser experiment that changes through **interaction** or **timed motion**.

Directions (pick one):

- hover reveals a hidden phrase or image  
- click shifts the emotional tone  
- one object slowly transforms over time  
- motion creates a dreamy or unstable atmosphere  
- a small response makes the browser feel alive  

**Easy:** one hover or click effect that changes mood.  
**Medium:** two states + one meaningful timed transition or animation.  
**Advanced:** layered interaction and motion where timing shapes the experience.

## Reflection

- What kind of change did you use: hover, click, delay, animation, or another trigger?  
- Did the page feel more alive after you added behavior?  
- What emotion did the motion create?  
- Was the viewer controlling the page, or was the page guiding the viewer?

---

Next in the reader: **[Remix, Appropriation, and Internet Vernacular](remix-appropriation-and-internet-vernacular)**.

Supplement on disk (glitch close read): [Glitch as language — JODI](glitch-as-language-jodi).

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
