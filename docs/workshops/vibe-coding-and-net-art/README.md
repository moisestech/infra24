# Vibe Coding & Net Art — authoring

Public reader chapters live in:

`content/workshops/vibe-coding-and-net-art/chapters/`

Signed-in readers use the same files via **`/o/{org}/workshop/{workshopKey}/chapters/{chapter-slug}`** (canonical org reader; UUID or slug in the path). The plural path `/o/{org}/workshops/.../chapters/...` redirects to that URL. Legacy `/learn/{workshop UUID}/{chapter-slug}` still exists for some flows but is not the canonical chapter surface for this track. Public chapters are canonical at **`/workshop/{workshopSlug}/{chapter-slug}`**; `/workshops/{slug}/{chapter}` redirects there. Disk helpers live in `lib/workshops/workshop-disk-chapters.ts`.

Each file is Markdown with YAML frontmatter: `slug`, `title`, `description`, `order` (or `chapter_number`), optional `estimated_duration` / `estimatedTime`, optional `difficulty`. Filenames follow `NN-kebab-slug.md`; the URL slug comes from frontmatter `slug`.

**Opening spine (public reader):** `order` **0** — [`00-net-art-primer.md`](../../content/workshops/vibe-coding-and-net-art/chapters/00-net-art-primer.md) (`net-art-primer`); **1** — [`01-getting-started-with-vibecoding.md`](../../content/workshops/vibe-coding-and-net-art/chapters/01-getting-started-with-vibecoding.md) (`getting-started-with-vibecoding`); **2** — [`02-what-is-net-art.md`](../../content/workshops/vibe-coding-and-net-art/chapters/02-what-is-net-art.md) (`what-is-net-art`); **3** — [`01-the-browser-is-a-medium.md`](../../content/workshops/vibe-coding-and-net-art/chapters/01-the-browser-is-a-medium.md) (`the-browser-is-a-medium`); **4** — [`02-hypertext-and-nonlinear-narrative.md`](../../content/workshops/vibe-coding-and-net-art/chapters/02-hypertext-and-nonlinear-narrative.md) (`hypertext-and-nonlinear-narrative`); **5+** — remaining technical chapters through the appendix.

**Appended curriculum chapters (later `order` values):** these ship as additional reader chapters after the original spine; URLs use the frontmatter `slug` under **`/workshop/vibe-coding-and-net-art/{slug}`** (and org **`/o/{org}/workshop/.../chapters/{slug}`**). Includes e.g. [`20-interaction-motion-and-responsive-behavior.md`](../../content/workshops/vibe-coding-and-net-art/chapters/20-interaction-motion-and-responsive-behavior.md) (`interaction-motion-and-responsive-behavior`), [`21-remix-appropriation-and-internet-vernacular.md`](../../content/workshops/vibe-coding-and-net-art/chapters/21-remix-appropriation-and-internet-vernacular.md), [`22-identity-presence-and-networked-selves.md`](../../content/workshops/vibe-coding-and-net-art/chapters/22-identity-presence-and-networked-selves.md), [`23-systems-circulation-and-infrastructure.md`](../../content/workshops/vibe-coding-and-net-art/chapters/23-systems-circulation-and-infrastructure.md), [`24-publishing-liveness-and-the-artwork-as-website.md`](../../content/workshops/vibe-coding-and-net-art/chapters/24-publishing-liveness-and-the-artwork-as-website.md), and capstone [`25-final-project-build-publish-and-frame-your-net-artwork.md`](../../content/workshops/vibe-coding-and-net-art/chapters/25-final-project-build-publish-and-frame-your-net-artwork.md) (`final-project-build-publish-and-frame-your-net-artwork`).

## Slide and screenshot assets

- Each chapter includes a **`## Reference media`** block with **at least two images** and **one `<video>`** (HTML5; MDN CC0 sample by default). Replace those URLs and the clip with your deck exports, narrated screen captures, or an iframe embed as you refine the workshop.
- Prefer **full Cloudinary URLs** in markdown images, matching marketing: `![alt](https://res.cloudinary.com/.../image/upload/...)` so chapters ship without binary blobs in git. Chapter HTML is produced server-side by [`lib/mdx-processor.ts`](../../lib/mdx-processor.ts) (Markdown → HTML via `remark` / `rehype`, including `rehype-raw` for trusted embedded HTML in repo content).
- Optional: store slide exports under `docs/workshops/vibe-coding-and-net-art/assets/` (PNG/WebP) only when you need offline or versioned bitmaps; reference them from markdown via committed relative paths **or** upload to Cloudinary and use the URL in the chapter.
- Naming: `slide-{module}-{nn}-short-topic.png` (example: `slide-module2-03-hover-attention.png`) keeps deck order greppable.

## Resource matrix / deck

To align chapter titles and order with your curriculum matrix or slide deck, add source files here (for example `Vibecoding_Net_Art_Resource_Matrix.xlsx` or an exported PDF). The repo cannot reference paths outside the project; commit copies under this folder when you are ready, then adjust the chapter `.md` stubs to match.
