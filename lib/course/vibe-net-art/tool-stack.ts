export type VcnToolCategory = 'quick-start' | 'structured' | 'ai-assisted' | 'advanced'

export type VcnTool = {
  name: string
  category: VcnToolCategory
  description: string
  href: string
}

export const VCN_TOOL_STACK: VcnTool[] = [
  {
    name: 'CodePen',
    category: 'quick-start',
    description: 'Fast in-browser HTML/CSS/JS sketches with instant preview.',
    href: 'https://codepen.io/about',
  },
  {
    name: 'p5.js Web Editor',
    category: 'quick-start',
    description: 'Zero-install creative coding in the browser.',
    href: 'https://editor.p5js.org/',
  },
  {
    name: 'GitHub',
    category: 'structured',
    description: 'Version history, collaboration, and publishing workflows for projects.',
    href: 'https://docs.github.com/',
  },
  {
    name: 'VS Code',
    category: 'structured',
    description: 'Structured editing, file tree, and extensions for web projects.',
    href: 'https://code.visualstudio.com/docs',
  },
  {
    name: 'GitHub Pages',
    category: 'structured',
    description: 'Turn a repository into a live static site.',
    href: 'https://docs.github.com/pages',
  },
  {
    name: 'Cursor',
    category: 'ai-assisted',
    description: 'AI-assisted editor for iterating on code with tight feedback loops.',
    href: 'https://cursor.com/',
  },
  {
    name: 'p5.js',
    category: 'advanced',
    description: 'Friendly creative coding API for drawing, interaction, and sound in the browser.',
    href: 'https://p5js.org/',
  },
  {
    name: 'Three.js',
    category: 'advanced',
    description: 'WebGL-powered 3D scenes and spatial web experiments.',
    href: 'https://threejs.org/docs/',
  },
]
