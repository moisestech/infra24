type EditorialMarkdownProps = {
  html: string
}

/**
 * Longform journal HTML from the shared remark stack.
 * Text stays on the article measure; images may run slightly wider.
 */
export function EditorialMarkdown({ html }: EditorialMarkdownProps) {
  return (
    <div
      className={[
        'mt-10 overflow-x-hidden text-base leading-relaxed text-neutral-700 dark:text-neutral-300',
        '[&_p]:mb-5 [&_p]:max-w-2xl',
        '[&_h2]:mb-4 [&_h2]:mt-12 [&_h2]:max-w-2xl [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-neutral-900 dark:[&_h2]:text-neutral-50',
        '[&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:max-w-2xl [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-neutral-900 dark:[&_h3]:text-neutral-50',
        '[&_ul]:mb-5 [&_ul]:max-w-2xl [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5',
        '[&_ol]:mb-5 [&_ol]:max-w-2xl [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5',
        '[&_li]:max-w-2xl',
        '[&_blockquote]:my-8 [&_blockquote]:max-w-2xl [&_blockquote]:border-l-2 [&_blockquote]:border-neutral-300 [&_blockquote]:pl-5 [&_blockquote]:text-lg [&_blockquote]:leading-relaxed [&_blockquote]:text-neutral-800 dark:[&_blockquote]:border-neutral-600 dark:[&_blockquote]:text-neutral-100',
        '[&_a]:underline [&_a]:underline-offset-4',
        '[&_hr]:my-10 [&_hr]:max-w-2xl [&_hr]:border-neutral-200 dark:[&_hr]:border-neutral-700',
        '[&_em]:italic',
        '[&_strong]:font-semibold [&_strong]:text-neutral-900 dark:[&_strong]:text-neutral-100',
        '[&_p:has(>img)]:mx-0 [&_p:has(>img)]:mb-0 [&_p:has(>img)]:mt-10 [&_p:has(>img)]:max-w-3xl',
        '[&_img]:my-10 [&_img]:block [&_img]:h-auto [&_img]:w-full [&_img]:max-w-3xl',
      ].join(' ')}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
