/** Compose handbook links from `/workshop/{slug}/` + relative segment or hash. */
export function handbookHref(basePath: string, href: string): string {
  const root = basePath.replace(/\/+$/, '')
  if (/^https?:\/\//i.test(href)) return href
  if (href.startsWith('#')) return `${root}${href}`
  return `${root}/${href.replace(/^\/+/, '')}`
}
