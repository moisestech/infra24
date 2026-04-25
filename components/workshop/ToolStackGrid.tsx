const categoryLabels: Record<string, string> = {
  'quick-start': 'Quick start',
  structured: 'Structured build',
  'ai-assisted': 'AI-assisted',
  advanced: 'Advanced',
}

const categoryOrder = ['quick-start', 'structured', 'ai-assisted', 'advanced'] as const

export type ToolStackGridProps = {
  tools: {
    name: string
    category: string
    description: string
    website?: string
  }[]
}

export function ToolStackGrid({ tools }: ToolStackGridProps) {
  const grouped = tools.reduce<Record<string, ToolStackGridProps['tools']>>((acc, tool) => {
    acc[tool.category] = acc[tool.category] ?? []
    acc[tool.category].push(tool)
    return acc
  }, {})

  const orderSet = new Set<string>(categoryOrder)
  const orderedKeys = [
    ...categoryOrder.filter((k) => (grouped[k]?.length ?? 0) > 0),
    ...Object.keys(grouped).filter((k) => !orderSet.has(k)),
  ]

  return (
    <section
      className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 md:p-8"
      id="tool-stack"
    >
      <div className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
          Tool stack
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50 md:text-4xl">
          Multiple ways to build
        </h2>
      </div>
      <div className="mt-8 grid gap-4 xl:grid-cols-2">
        {orderedKeys.map((category) => {
          const categoryTools = grouped[category]
          if (!categoryTools?.length) return null
          return (
            <article
              key={category}
              className="rounded-3xl border border-neutral-200 p-5 dark:border-neutral-700 dark:bg-neutral-950/30"
            >
              <h3 className="text-lg font-semibold text-neutral-950 dark:text-neutral-50">
                {categoryLabels[category] ?? category.replace(/-/g, ' ')}
              </h3>
              <div className="mt-4 space-y-4">
                {categoryTools.map((tool) => (
                  <div
                    key={tool.name}
                    className="rounded-2xl border border-neutral-200 p-4 dark:border-neutral-600 dark:bg-neutral-900/80"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-medium text-neutral-950 dark:text-neutral-50">{tool.name}</h4>
                        <p className="mt-2 text-sm leading-6 text-neutral-700 dark:text-neutral-300">{tool.description}</p>
                      </div>
                      {tool.website ? (
                        <a
                          href={tool.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-600 transition hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-400 dark:hover:bg-neutral-800"
                        >
                          Site
                        </a>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
