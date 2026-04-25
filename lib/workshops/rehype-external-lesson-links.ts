import type { Root, Element } from 'hast'

/**
 * Marks absolute http(s) links in workshop chapter HTML: `target`/`rel`, optional
 * `title`, and a class for manuscript styling (external indicator in CSS).
 */
export function rehypeExternalLessonLinks() {
  return function transformer(tree: Root) {
    visitElements(tree, (node) => {
      if (node.tagName !== 'a') return
      const href = node.properties?.href
      if (typeof href !== 'string') return
      if (!href.startsWith('http://') && !href.startsWith('https://')) return

      const props = { ...node.properties } as Record<string, unknown>
      props.target = '_blank'
      props.rel = 'noopener noreferrer'
      if (props.title == null) {
        props.title = 'Opens in a new tab — external site'
      }
      const cur = props.className
      if (Array.isArray(cur)) props.className = [...cur, 'lesson-external-link']
      else if (typeof cur === 'string') props.className = [cur, 'lesson-external-link']
      else props.className = ['lesson-external-link']
      node.properties = props
    })
  }
}

function visitElements(tree: Root, visitor: (node: Element) => void) {
  function walk(el: Element) {
    visitor(el)
    for (const c of el.children) {
      if (c.type === 'element') walk(c)
    }
  }
  for (const c of tree.children) {
    if (c.type === 'element') walk(c)
  }
}
