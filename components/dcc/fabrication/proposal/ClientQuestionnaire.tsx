'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

type Question = { id: string; text: string }

type ConfirmedItem = { id: string; label: string; answer: string }

export function ClientQuestionnaire({
  questions,
  confirmedItems,
  highlightQuestion,
  projectLabel,
}: {
  questions: readonly Question[]
  confirmedItems?: readonly ConfirmedItem[]
  highlightQuestion?: string
  projectLabel: string
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [copied, setCopied] = useState(false)

  function updateAnswer(id: string, value: string) {
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }

  async function copyResponses() {
    const sections: string[] = []
    if (confirmedItems?.length) {
      sections.push(
        'Confirmed:\n' +
          confirmedItems
            .map((item) => `${item.label}: ${item.answer}`)
            .join('\n')
      )
    }
    sections.push(
      'Still to determine:\n' +
        questions
          .map((q, index) => {
            const answer = answers[q.id]?.trim() || '(no answer yet)'
            return `${index + 1}. ${q.text}\n${answer}`
          })
          .join('\n\n')
    )
    if (highlightQuestion) {
      sections.push(
        `Essential question:\n${highlightQuestion}\n${answers.essential?.trim() || '(no answer yet)'}`
      )
    }
    const body = `${projectLabel} — discussion responses\n\n${sections.join('\n\n')}\n\n(Sent from private proposal page — not stored on server.)`
    try {
      await navigator.clipboard.writeText(body)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="space-y-6">
      {confirmedItems?.length ? (
        <div className="space-y-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">
            Answered / confirmed
          </p>
          <dl className="grid gap-3 sm:grid-cols-2">
            {confirmedItems.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-emerald-200 bg-emerald-50/60 px-4 py-3 dark:border-emerald-900 dark:bg-emerald-950/20"
              >
                <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-emerald-800 dark:text-emerald-200">
                  {item.label}
                </dt>
                <dd className="mt-1 text-sm text-neutral-800 dark:text-neutral-200">
                  {item.answer}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}

      {questions.length ? (
        <div className="space-y-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">
            Still to determine
          </p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Optional — your answers stay on this device until you copy and send them
            to Moises. Nothing is stored on the server.
          </p>

          <ol className="space-y-5">
            {questions.map((question, index) => (
              <li key={question.id}>
                <label
                  htmlFor={question.id}
                  className="block text-sm font-medium text-neutral-900 dark:text-neutral-100"
                >
                  {index + 1}. {question.text}
                </label>
                <textarea
                  id={question.id}
                  rows={2}
                  value={answers[question.id] ?? ''}
                  onChange={(e) => updateAnswer(question.id, e.target.value)}
                  className="mt-2 w-full rounded-xl border border-[var(--cdc-border)] bg-white px-3 py-2 text-sm dark:bg-neutral-950"
                />
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      {highlightQuestion ? (
        <div className="rounded-2xl border border-neutral-900 bg-neutral-50 p-4 dark:border-neutral-100 dark:bg-neutral-900/50">
          <label
            htmlFor="essential"
            className="block text-sm font-semibold text-neutral-900 dark:text-neutral-100"
          >
            {highlightQuestion}
          </label>
          <textarea
            id="essential"
            rows={3}
            value={answers.essential ?? ''}
            onChange={(e) => updateAnswer('essential', e.target.value)}
            className="mt-3 w-full rounded-xl border border-[var(--cdc-border)] bg-white px-3 py-2 text-sm dark:bg-neutral-950"
          />
        </div>
      ) : null}

      {questions.length || highlightQuestion ? (
        <button
          type="button"
          onClick={copyResponses}
          className={cn(
            'rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors',
            copied
              ? 'border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100'
              : 'border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900'
          )}
        >
          {copied ? 'Copied to clipboard' : 'Copy responses'}
        </button>
      ) : null}
    </div>
  )
}
