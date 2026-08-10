const JOIN_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

/** Short room code for TV / participant join (no ambiguous 0/O/1/I). */
export function generateJoinCode(length = 5): string {
  let code = ''
  for (let i = 0; i < length; i += 1) {
    code += JOIN_ALPHABET[Math.floor(Math.random() * JOIN_ALPHABET.length)]
  }
  return code
}

export function normalizeJoinCode(raw: string): string {
  return raw.trim().toUpperCase().replace(/[^A-Z0-9]/g, '')
}
