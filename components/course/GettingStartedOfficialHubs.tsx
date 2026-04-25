import type { ComponentType } from 'react'
import { ExternalLink, Sparkles } from 'lucide-react'
import { SiAnthropic, SiOpenai } from 'react-icons/si'
import { TbBrandCodepen, TbBrandGithub, TbBrandVscode } from 'react-icons/tb'

type BrandIcon = ComponentType<{ className?: string }>

type HubItem = {
  href: string
  label: string
  sub: string
  cta: string
  placeholder: string
  aria: string
  BrandIcon: BrandIcon
}

/**
 * Chapter 0 — official vendor links + 16:9 screenshot placeholders.
 * Swap the inner `<div>` in each figure for `<img src="..." alt="..." />` when assets are ready.
 */
export function GettingStartedOfficialHubs() {
  const items: HubItem[] = [
    {
      href: 'https://codepen.io/about',
      label: 'CodePen',
      sub: 'About & product overview',
      cta: 'codepen.io/about →',
      placeholder: 'Image: CodePen — About (replace)',
      aria: 'Placeholder screenshot: CodePen About page (replace with your image)',
      BrandIcon: TbBrandCodepen,
    },
    {
      href: 'https://docs.github.com/repositories/creating-and-managing-repositories/quickstart-for-repositories?tool=cli',
      label: 'GitHub',
      sub: 'Repository quickstart (official docs)',
      cta: 'docs.github.com →',
      placeholder: 'Image: GitHub — Repo quickstart (replace)',
      aria: 'Placeholder screenshot: GitHub repository quickstart (replace with your image)',
      BrandIcon: TbBrandGithub,
    },
    {
      href: 'https://code.visualstudio.com/docs/getstarted/getting-started',
      label: 'Visual Studio Code',
      sub: 'Getting started tutorial',
      cta: 'code.visualstudio.com →',
      placeholder: 'Image: VS Code — Getting started (replace)',
      aria: 'Placeholder screenshot: VS Code getting started (replace with your image)',
      BrandIcon: TbBrandVscode,
    },
    {
      href: 'https://docs.cursor.com/en/get-started/quickstart',
      label: 'Cursor',
      sub: 'Get started (official docs)',
      cta: 'docs.cursor.com →',
      placeholder: 'Image: Cursor — Quickstart (replace)',
      aria: 'Placeholder screenshot: Cursor quickstart (replace with your image)',
      BrandIcon: Sparkles,
    },
    {
      href: 'https://code.claude.com/docs/en/vs-code',
      label: 'Claude',
      sub: 'VS Code extension documentation',
      cta: 'code.claude.com/docs →',
      placeholder: 'Image: Claude — VS Code docs (replace)',
      aria: 'Placeholder screenshot: Claude VS Code documentation (replace with your image)',
      BrandIcon: SiAnthropic,
    },
    {
      href: 'https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan/',
      label: 'OpenAI Codex',
      sub: 'Using Codex with your ChatGPT plan',
      cta: 'help.openai.com →',
      placeholder: 'Image: Codex + ChatGPT plan (replace)',
      aria: 'Placeholder screenshot: OpenAI Codex help article (replace with your image)',
      BrandIcon: SiOpenai,
    },
  ]

  return (
    <section
      id="official-tool-hubs"
      className="not-prose scroll-mt-28"
      aria-labelledby="official-tool-hubs-heading"
    >
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50/80 p-6 dark:border-neutral-800 dark:bg-neutral-950/40 sm:p-8">
        <h2
          id="official-tool-hubs-heading"
          className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50"
        >
          Official documentation hubs
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
          Use these vendor pages as ground truth while you learn. Replace the gray slots with screenshots when you export slides—keep{' '}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">alt</code> text specific to each capture.
        </p>
        <ul className="mt-6 grid list-none gap-4 p-0 sm:grid-cols-2 xl:grid-cols-3" role="list">
          {items.map((item) => {
            const Icon = item.BrandIcon
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="group flex h-full flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition hover:border-primary/40 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-primary/40"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <figure
                    className="m-0 aspect-video w-full bg-neutral-200/90 dark:bg-neutral-800/90"
                    role="img"
                    aria-label={item.aria}
                  >
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-4 text-center">
                      <Icon className="h-10 w-10 text-neutral-500 opacity-90 dark:text-neutral-400" aria-hidden />
                      <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">{item.placeholder}</span>
                    </div>
                  </figure>
                  <div className="flex flex-1 flex-col gap-1 p-4">
                    <span className="flex items-center gap-2 text-sm font-semibold text-neutral-900 group-hover:text-primary dark:text-neutral-50">
                      <Icon className="h-4 w-4 shrink-0 text-primary opacity-90" aria-hidden />
                      {item.label}
                      <ExternalLink className="ml-auto size-3.5 shrink-0 opacity-60" aria-hidden />
                    </span>
                    <span className="text-xs text-neutral-600 dark:text-neutral-400">{item.sub}</span>
                    <span className="mt-2 text-xs font-medium text-primary">{item.cta}</span>
                    <span className="sr-only"> Opens in a new tab.</span>
                  </div>
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
