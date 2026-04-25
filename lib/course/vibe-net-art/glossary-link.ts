/** Deep link to a glossary entry: `/workshop/.../glossary?term=slug` */
export function vcnGlossaryTermHref(glossaryHref: string, termSlug: string): string {
  const base = glossaryHref.replace(/\/$/, '')
  const sep = base.includes('?') ? '&' : '?'
  return `${base}${sep}term=${encodeURIComponent(termSlug)}`
}
