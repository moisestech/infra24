'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Building2 } from 'lucide-react'
import type { WorkshopsLandingContent } from '@/lib/orgs/oolite/workshops-landing-content'

function buildMailto(email: string, subject: string, body: string): string {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export function InstitutionalInquiryCta({
  landing,
  workshopTitle,
  orgSlug,
}: {
  landing: WorkshopsLandingContent['institutionalInquiry']
  workshopTitle?: string
  orgSlug: string
}) {
  const [open, setOpen] = useState(false)
  const [orgName, setOrgName] = useState('')
  const [role, setRole] = useState('')
  const [cohort, setCohort] = useState('')
  const [notes, setNotes] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = `${landing.subjectPrefix} ${workshopTitle ? `— ${workshopTitle}` : ''}`.trim()
    const body = [
      landing.bodyIntro,
      '',
      `Organization: ${orgName || '(not provided)'}`,
      `Role: ${role || '(not provided)'}`,
      `Cohort size / timeline: ${cohort || '(not provided)'}`,
      `Org slug: ${orgSlug}`,
      '',
      notes || '(no additional notes)',
    ].join('\n')
    window.location.href = buildMailto(landing.email, subject, body)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="gap-2">
          <Building2 className="h-4 w-4" />
          Institutional inquiry
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Institutional inquiry</DialogTitle>
            <DialogDescription>
              Opens your email client with a pre-filled message to {landing.email}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="inq-org">Organization</Label>
              <Input
                id="inq-org"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="Organization name"
                autoComplete="organization"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="inq-role">Your role</Label>
              <Input
                id="inq-role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. education director"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="inq-cohort">Cohort size & timing</Label>
              <Input
                id="inq-cohort"
                value={cohort}
                onChange={(e) => setCohort(e.target.value)}
                placeholder="e.g. 15 staff, fall 2026"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="inq-notes">Notes</Label>
              <Textarea
                id="inq-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Context, accessibility, hybrid needs…"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Open email</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
