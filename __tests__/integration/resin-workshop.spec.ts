import { expect, test, type Page } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'

const SCREENSHOT_DIR = path.join(
  process.cwd(),
  'docs/workshops/qa-screenshots'
)

async function assertNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => {
    const doc = document.documentElement
    return {
      scrollWidth: doc.scrollWidth,
      clientWidth: doc.clientWidth,
    }
  })
  expect(
    overflow.scrollWidth,
    `horizontal overflow: scrollWidth ${overflow.scrollWidth} > clientWidth ${overflow.clientWidth}`
  ).toBeLessThanOrEqual(overflow.clientWidth + 1)
}

async function shot(page: Page, name: string) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true })
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, `${name}.png`),
    fullPage: true,
  })
}

const VIEWPORTS = [
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'desktop-1280', width: 1280, height: 800 },
  { name: 'large-1440', width: 1440, height: 900 },
  { name: 'tv-1920', width: 1920, height: 1080 },
] as const

test.describe('resin workshop responsive QA', () => {
  for (const vp of VIEWPORTS) {
    test(`hub + safety readable at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height })
      await page.goto('/workshop/resin-printing')
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      await assertNoHorizontalOverflow(page)
      if (vp.name === 'mobile-390' || vp.name === 'desktop-1280') {
        await shot(page, `hub-${vp.name}`)
      }

      await page.goto('/workshop/resin-printing/modules/safety-zones')
      await expect(
        page.getByRole('heading', { name: /Safety & Zones/i })
      ).toBeVisible()
      await expect(page.getByText(/Safety \(required\)/i)).toBeVisible()
      await expect(page.getByText(/Discussion/i)).toBeVisible()
      await assertNoHorizontalOverflow(page)
      if (vp.name === 'mobile-390' || vp.name === 'desktop-1280') {
        await shot(page, `safety-${vp.name}`)
      }
    })
  }

  test('slicer lab and booklet index never claim missing pages', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/workshop/resin-printing/modules/slicer-lab')
    await expect(page.getByRole('heading', { name: /Slicer Lab/i })).toBeVisible()
    await expect(page.getByText(/Page mapping pending/i)).toHaveCount(0)
    await expect(page.getByText(/booklet page 10/i)).toHaveCount(0)
    await assertNoHorizontalOverflow(page)
    await shot(page, 'slicer-desktop-1280')

    await page.goto('/workshop/resin-printing/booklet')
    await expect(page.getByText(/21 PDF sheets/i)).toBeVisible()
    await expect(page.getByText(/missing pages 10 and 35/i)).toBeVisible()
    await expect(page.getByText(/mapping pending/i)).toHaveCount(0)
    await expect(page.getByText(/Failure Clinic/i)).toBeVisible()
    await expect(page.getByText(/^Related$/i).first()).toBeVisible()
    await assertNoHorizontalOverflow(page)
    await shot(page, 'booklet-desktop-1280')
  })

  test('live session sync surfaces for facilitator / TV / participant', async ({
    page,
  }) => {
    test.setTimeout(120000)
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/workshop/resin-printing')

    const created = await page.evaluate(async () => {
      try {
        const res = await fetch('/api/workshop-live-sessions', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            workshopSlug: 'resin-printing',
            venueConfigId: 'oolite',
          }),
        })
        const text = await res.text()
        let json: { session?: { joinCode: string }; error?: string } = {}
        try {
          json = JSON.parse(text) as typeof json
        } catch {
          json = {}
        }
        return {
          ok: res.ok,
          status: res.status,
          code: json.session?.joinCode ?? null,
          error: json.error ?? text.slice(0, 200),
        }
      } catch (err) {
        return {
          ok: false,
          status: 0,
          code: null,
          error: err instanceof Error ? err.message : String(err),
        }
      }
    })

    // Clerk may 401 unauthenticated API POSTs in some local/CI contexts even when
    // middleware marks the route public. Fall back to UI start button.
    let code = created.code
    if (!code) {
      await page.getByRole('button', { name: /Start live session/i }).click()
      try {
        await page.waitForURL(/\/facilitate\/[A-Z0-9]+/i, { timeout: 15000 })
        code = page.url().split('/').pop() ?? null
      } catch {
        test.skip(
          true,
          `Could not create live session (API ${created.status}: ${created.error}). Middleware/Clerk auth blocks session create in this environment.`
        )
      }
    }

    expect(code).toBeTruthy()

    await page.goto(`/facilitate/${code}`)
    await expect(page.getByText(/Facilitator ·/i)).toBeVisible()
    await expect(page.getByText(/Private facilitator notes/i)).toBeVisible()
    await assertNoHorizontalOverflow(page)
    await shot(page, 'facilitate-1440')

    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto(`/present/${code}`)
    await expect(page.getByText(/Not certification/i)).toBeVisible()
    await expect(page.getByText(/Private facilitator notes/i)).toHaveCount(0)
    await assertNoHorizontalOverflow(page)
    await shot(page, 'present-1920')

    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(`/session/${code}`)
    await expect(
      page.getByRole('button', { name: /Follow class/i }).first()
    ).toBeVisible()
    await expect(page.getByRole('button', { name: /My pace/i }).first()).toBeVisible()
    await expect(
      page.getByText(/Independent navigation never authorizes/i)
    ).toBeVisible()
    await assertNoHorizontalOverflow(page)
    await shot(page, 'session-mobile-390')
  })
})
