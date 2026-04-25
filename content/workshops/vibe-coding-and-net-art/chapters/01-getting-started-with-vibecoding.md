---
slug: getting-started-with-vibecoding
title: Getting Started with Vibecoding
description: >-
  Tools, terms, accounts, and your first creative workflow. Choose a starting
  lane, learn the vocabulary, and ship a tiny browser artifact—without setup
  hell.
order: 1
estimated_duration: 60
difficulty: beginner
---

This chapter is **onboarding**, not mastery. Its job is to make you **situated, unafraid, and able to start**: a mental model for how we work, words that won’t sound alien, and one small thing you can point to at the end.

> **This chapter is about getting situated, not getting perfect.**

## Chapter outcomes

By the end, you should be able to:

- describe **what vibecoding means** in this course (prompts + iteration + creative direction, not “one magic app”)
- name **three realistic ways to begin** and pick one that fits your nerves today
- recognize core terms (**IDE**, **repo**, **commit**, **push**, **prompt**, **deploy**, and a few others)
- know **why GitHub** shows up in our stack and what a **repository** is for
- choose a **workspace** (browser sandbox vs editor vs AI-assisted editor) without shame
- write **stronger prompts** for creative coding help
- complete a first **“Hello Browser”** artifact in easy, medium, or advanced mode

> **Layout note:** The [Official documentation hubs](#official-tool-hubs) deck (link cards + 16:9 screenshot placeholders) renders in the lesson chrome **directly under the thesis** on this chapter’s dedicated page—not buried in “Full chapter reading.” Update markup in `components/course/GettingStartedOfficialHubs.tsx` when you drop in images.

## What vibecoding means here

**Vibecoding is not one app, one company, or one style.** It is a **way of working**: you describe what you want, steer with prompts and edits, test in the browser, revise, and gradually shape digital work using both intuition and structure.

For this workshop we keep a simple definition:

**Vibecoding** means building creative web work by combining **prompts**, **visual intuition**, **code or markup**, and **iterative editing**—with or without AI in the loop.

Sometimes that looks like a **CodePen** sketch. Sometimes it looks like **GitHub + VS Code** and real folders. Sometimes it looks like **GitHub + Cursor** (or another AI-aware editor) where you ask for explanations and small edits, then **review** everything before you accept it.

**Key idea:** *prompt → edit → test → refine → publish* (even if “publish” is only a link or screenshot at first).

### Micro exercise

Finish this sentence in your notes:

**“I want to build…”**

- **Easy:** one sentence only  
- **Medium:** add a **mood** word (lonely, loud, tender, broken, etc.)  
- **Advanced:** add **one interaction** you can imagine (hover, click, scroll, glitch, sound on/off, etc.)

## Three ways to begin (no single “correct” path)

There is **not** one right front door. Pick the lane that makes starting feel **possible**. The **[Official documentation hubs](#official-tool-hubs)** section above lists the exact vendor pages for screenshots and syllabus links.

### Lane A — Easy start (fastest feedback)

**CodePen + browser + AI chat (optional)**

**Best for:** total beginners, artists who want **instant** visual feedback, anyone scared of installs.

**You will:** edit HTML/CSS/JS in one place, see changes immediately, save a **share link** or screenshot.

**Why it works:** the browser is the studio; you are not fighting folders yet.

### Lane B — Structured start (files + project home)

**GitHub + VS Code**

**Best for:** learners ready for **files and folders**, people who want a **real project** that can grow, anyone aiming at **GitHub Pages** later.

**You will:** create a **repo**, open it locally, edit files, **commit**, **push**.

**Why it works:** you learn the layout most professional web work still assumes: a project tree, saved checkpoints, a remote home for the work.

Official orientation: [GitHub Docs](https://docs.github.com/) — repositories are where project files and revision history live. Start with [Creating a new repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository) and the **[repository quickstart](https://docs.github.com/repositories/creating-and-managing-repositories/quickstart-for-repositories?tool=cli)** (same page linked in [Official documentation hubs](#official-tool-hubs) above).

### Lane C — AI-assisted start (editor-native help)

**GitHub + Cursor** (later you might add **Claude Code** or **Codex**-style agents for deeper automation)

**Best for:** people comfortable **asking in natural language**, learners who want **faster iteration** once a folder exists.

**You will:** open a repo, ask the tool to **explain** the tree, request a **small** change, **read the diff**, then save/commit.

**Why it works:** you still own direction and review; the AI is a collaborator, not a replacement for taste.

Helpful entry points: [Visual Studio Code docs](https://code.visualstudio.com/docs) (full doc set), **[VS Code — Getting started](https://code.visualstudio.com/docs/getstarted/getting-started)**, **[Cursor — Quickstart](https://docs.cursor.com/en/get-started/quickstart)**, **[Claude — VS Code](https://code.claude.com/docs/en/vs-code)**, **[Codex with ChatGPT plan](https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan/)**, and [GitHub Docs](https://docs.github.com/) (repos, Pages). The [hubs section](#official-tool-hubs) keeps the screenshot-ready list in one place.

### Reflection

Which lane feels **most realistic this week**, and why—one honest paragraph?

## The words you need (glossary)

Most beginner panic is **vocabulary panic**. Here is the survival kit:

| Term | Plain meaning |
| --- | --- |
| **IDE** (used loosely here) | Your **main workspace** to open files, edit, run tasks, and work on a project—sometimes a full IDE, often “just” a powerful **code editor**. In practice: *the desk where the project lives on screen.* |
| **Repository / repo** | A **project container** on GitHub: files + history. Think: *studio folder that remembers versions.* |
| **Commit** | A **saved checkpoint** of your changes. |
| **Branch** | A **parallel line** of work so you can try ideas without trashing the main line. |
| **Push** | Send your local commits **up to** GitHub. |
| **Clone** | Copy a repo **from GitHub** to your machine. |
| **Prompt** | A **written brief** you give an AI tool—specificity beats vibes-only. |
| **Agent** | An AI workflow that can take **multiple steps** (read files, propose edits, run commands)—you still **review**. |
| **Frontend** | What the visitor **sees and does** in the browser. |
| **Deploy / publish** | Put a build or static site **live** on the web. |
| **GitHub Pages** | GitHub’s **static hosting** path for simple sites—see [GitHub Pages documentation](https://docs.github.com/en/pages). |
| **React** / **Next.js** | Ecosystem words you may hear in the wild (**React** for UI components; **Next.js** a **React** framework for apps). This workshop does **not** require you to master them up front. |

### Analogies (keep these)

- **Repo** — studio folder with memory  
- **IDE / editor** — digital workbench  
- **Commit** — named save point in a game  
- **Branch** — parallel sketch layer  
- **Prompt** — creative brief to a collaborator  

## GitHub: account and first repo

### Create a GitHub account

- Go to [github.com](https://github.com/) and sign up  
- Choose a **username** you are okay sharing on a portfolio or syllabus  
- **Verify email**, complete basic security prompts  
- Log in once from the machine you will use in class  

### Create your first repository

Suggested names: `net-art-lab`, `my-first-vibecode`, `browser-art-studies`, or `net-art-workshop`.

Steps (web UI):

1. **New repository**  
2. Pick a **name** and description  
3. **Public** is easiest for sharing homework; **private** is fine if you want privacy while learning  
4. Check **Add a README** so the repo is not empty  
5. **Create repository**  

Docs: [Creating a new repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository).

**Tip:** you are not learning every Git command today—only **where the project lives** and how to make a **first commit** later when you choose Lane B or C.

## Pick your workspace (roles, not hype)

| Tool | Role in this chapter | What we want you to feel |
| --- | --- | --- |
| **CodePen** | Fastest **in-browser** experiments | “I can start **now**.” |
| **GitHub** | **Home + history + publish path** for files | “My work has a **place**.” |
| **VS Code** | Structured **file-based** editing | “I understand the **workspace**.” |
| **Cursor** | **AI-first** editor on a real folder | “I can **direct** and **refine** with help.” |
| **Claude / ChatGPT / etc.** | **Thinking partner** for plans, prompts, explanations | “I can **unstick** my language before I touch code.” |
| **Codex / coding agents** | **Delegation + review** workflows on code | “I can ask for **steps**, then **verify**.” |

### VS Code vs Cursor (teach the difference, not the war)

- **VS Code** — best when you want **clear fundamentals**: explorer, files, source control, extensions. Official intro: [VS Code documentation](https://code.visualstudio.com/docs) and **[Getting started](https://code.visualstudio.com/docs/getstarted/getting-started)**.  
- **Cursor** — best when you already have a **small project folder** and want **in-editor** AI for explanations and surgical edits. Start from the **[Cursor quickstart](https://docs.cursor.com/en/get-started/quickstart)**. Treat it as **VS Code-shaped** with an AI layer—still your responsibility to read changes.

### Claude Code vs Codex-style agents (high level)

Both families emphasize **multi-step** help across a codebase. Pedagogically we frame it as: **which workspace gives you the least friction while you still learn structure?** not “which AI is smartest.”

Use vendor docs for up-to-date positioning when you adopt a specific product in class.

## Prompting for creative coding

Weak prompts produce mush. Strong prompts give you **constraints**, **style**, and **deliverable shape**.

**Weak:** “Make it better.”

**Better:** “Turn this into a **poetic net art homepage**: large serif title, black background, **one** slow fade-in, **one** floating image, **HTML/CSS only**, and **explain each change** in a short list.”

**Weak:** “Fix my code.”

**Better:** “Explain what this file does **in plain language**, find **one** issue, propose the **smallest** patch, and show me the diff before applying.”

### Five prompt patterns to practice

**Explain**

```text
Explain this project like I am a beginner. What are the main files and what does each one do?
```

**Edit**

```text
Change the page so it feels more like a poetic net art homepage. Keep it simple and explain every change.
```

**Compare**

```text
Show me two versions: one minimal and one chaotic. Label the differences.
```

**Refine**

```text
Keep the layout, but improve typography, spacing, and color contrast for readability.
```

**Review (plan first)**

```text
Before changing anything, tell me your plan in 3 steps, then wait for my OK.
```

### Exercise

Rewrite this prompt into something usable:

`make it better`

## Your first artifact — “Hello Browser”

Goal: end with something **real**, not impressive.

Include:

- a **title**  
- **one** sentence you care about  
- **one** visual style choice (color, type, spacing, image, or texture)  
- **one** small interaction or motion (even a hover state counts)

Directions you might try: **poetic homepage**, **digital self-portrait**, **weird welcome page**, **browser poem**, **tiny net art poster**.

### Easy mode (~lowest friction)

Use **CodePen** or any single-file browser sandbox.

- change text and background  
- add **one** typographic choice  
- export a **link** or **screenshot**  

### Medium mode (~structured)

Use **GitHub + VS Code**.

- add `index.html` (and `style.css` if you want separation)  
- build the one-page “Hello Browser” brief  
- **commit** your changes  

### Advanced mode (~AI-assisted)

Use **GitHub + Cursor** (or similar).

- ask the tool to **explain the file tree**  
- request a **small** implementation of the brief  
- **review** suggestions, then **commit** what you actually endorse  

## What this chapter is / is not

**This chapter is not**

- mastering Git theory  
- becoming a software engineer in one night  
- memorizing every tool logo  
- outsourcing your **taste** or **ethics** to AI  

**This chapter is**

- learning the **studio layout**  
- picking a **lane** you can sustain  
- learning **words** so the rest of the workshop reads clearly  
- making a **first creative move** in the browser  

## Reflection

- Which lane did you choose today?  
- Which tool felt **best** on your nervous system?  
- Which term feels **less scary** now?  
- What kind of web-based work do you want to try first in the net art chapters?  

---

When you are ready, continue to **[What Is Net Art?](what-is-net-art)** for the conceptual spine, then **[The browser is a medium](the-browser-is-a-medium)** for your first hands-on Module 1 chapter.
