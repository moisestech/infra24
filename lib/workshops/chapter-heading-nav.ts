/** Pull H2 and H3 anchors from rendered chapter HTML (expects `rehype-slug` ids on headings). */
export function extractH2NavFromHtml(html: string): { id: string; label: string }[] {
  const out: { id: string; label: string }[] = []
  const re = /<(h2|h3)\b[^>]*\bid="([^"]+)"[^>]*>([\s\S]*?)<\/\1>/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(html)) !== null) {
    const level = m[1]?.toLowerCase()
    const id = m[2]?.trim()
    const raw = m[3] ?? ''
    const plain = raw.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
    if (!id || !plain) continue
    const label = level === 'h3' ? `· ${plain}` : plain
    out.push({ id, label })
  }
  return out
}
