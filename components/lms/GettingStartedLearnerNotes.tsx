'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const KEYS = {
  github: 'lms_getting_started_github_username',
  repo: 'lms_getting_started_repo_name',
  workspace: 'lms_getting_started_workspace',
  artifact: 'lms_getting_started_artifact_url',
} as const

export function GettingStartedLearnerNotes() {
  const [github, setGithub] = useState('')
  const [repo, setRepo] = useState('')
  const [workspace, setWorkspace] = useState('')
  const [artifact, setArtifact] = useState('')

  useEffect(() => {
    try {
      setGithub(localStorage.getItem(KEYS.github) ?? '')
      setRepo(localStorage.getItem(KEYS.repo) ?? '')
      setWorkspace(localStorage.getItem(KEYS.workspace) ?? '')
      setArtifact(localStorage.getItem(KEYS.artifact) ?? '')
    } catch {
      /* ignore */
    }
  }, [])

  const persist = (key: keyof typeof KEYS, value: string) => {
    try {
      localStorage.setItem(KEYS[key], value)
    } catch {
      /* ignore */
    }
  }

  return (
    <section
      id="onboarding-notes"
      className="rounded-3xl border border-border bg-card/50 p-6 shadow-sm md:p-8"
    >
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">Your notes (saved locally)</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Optional fields for class check-in. Nothing here is uploaded—only stored in this browser.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="gs-github">GitHub username</Label>
          <Input
            id="gs-github"
            value={github}
            onChange={(e) => setGithub(e.target.value)}
            onBlur={() => persist('github', github)}
            placeholder="@you"
            autoComplete="off"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gs-repo">First repo name</Label>
          <Input
            id="gs-repo"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            onBlur={() => persist('repo', repo)}
            placeholder="net-art-lab"
            autoComplete="off"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gs-workspace">Preferred workspace</Label>
          <Input
            id="gs-workspace"
            value={workspace}
            onChange={(e) => setWorkspace(e.target.value)}
            onBlur={() => persist('workspace', workspace)}
            placeholder="CodePen / VS Code / Cursor"
            autoComplete="off"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="gs-artifact">Artifact link or notes</Label>
          <Input
            id="gs-artifact"
            value={artifact}
            onChange={(e) => setArtifact(e.target.value)}
            onBlur={() => persist('artifact', artifact)}
            placeholder="CodePen URL, repo link, or short description"
            autoComplete="off"
          />
        </div>
      </div>
    </section>
  )
}
