/** Official tool marks supplied for DCC 3D School. Square mark preferred on cards. */
export const THREE_D_TOOL_LOGOS = {
  blender: {
    label: 'Blender',
    src: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1790458222/dccmiami/logo/blender_logo_no_text_jedjww.webp',
    wordmark:
      'https://res.cloudinary.com/dck5rzi4h/image/upload/v1790458222/dccmiami/logo/blender_logo_type_jbxwsr.png',
  },
  plasticity: {
    label: 'Plasticity',
    src: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1790458222/dccmiami/logo/plasticity_logo_square_om7adv.webp',
  },
  rhino: {
    label: 'Rhino',
    src: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1790458222/dccmiami/logo/rhino-logo-square_etrvgb.jpg',
  },
  grasshopper: {
    label: 'Grasshopper',
    src: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1790458222/dccmiami/logo/grasshopper-3d-logo-png_seeklogo-291372_d95468.png',
  },
} as const

export type ThreeDToolLogoId = keyof typeof THREE_D_TOOL_LOGOS

const BY_NAME: Record<string, ThreeDToolLogoId> = {
  blender: 'blender',
  plasticity: 'plasticity',
  rhino: 'rhino',
  grasshopper: 'grasshopper',
}

export function toolLogoForName(name: string): (typeof THREE_D_TOOL_LOGOS)[ThreeDToolLogoId] | undefined {
  const id = BY_NAME[name.trim().toLowerCase()]
  return id ? THREE_D_TOOL_LOGOS[id] : undefined
}

export function toolLogoForMapNode(nodeId: string) {
  return toolLogoForName(nodeId)
}

export function toolLogosForSoftware(software: readonly string[]) {
  const seen = new Set<string>()
  const logos: (typeof THREE_D_TOOL_LOGOS)[ThreeDToolLogoId][] = []
  for (const name of software) {
    const logo = toolLogoForName(name)
    if (!logo || seen.has(logo.src)) continue
    seen.add(logo.src)
    logos.push(logo)
  }
  return logos
}
