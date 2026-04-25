/** Shared shapes for Learn LMS chapter data and components */

export type LmsCanonArtist = {
  name: string
  focus: string
  href?: string
}

export type LmsArtifactBrief = {
  title: string
  description: string
  prompts: string[]
  modes: {
    easy: string[]
    medium: string[]
    advanced: string[]
  }
}
