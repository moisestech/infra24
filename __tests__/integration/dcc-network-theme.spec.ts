import { test, expect } from '@playwright/test'

/**
 * Manual/CI browser QA for the public DCC network surfaces.
 * Run: npx playwright test dcc-network-theme.spec.ts --project=chromium
 * Designed for both desktop and mobile Playwright projects.
 *
 * The graph uses WebGL; this tests the accessible DOM and the *computed*
 * theme CSS even when the browser does not support WebGL hardware.
 */
test.describe('DCC Atlas / network theme and mobile experience', () => {
  for (const mode of ['light', 'dark'] as const) {
    test('artwork responds to ' + mode + ' theme', async ({ page }) => {
      await page.goto('/network/artwork')
      await page.evaluate((value) => localStorage.setItem('theme', value), mode)
      await page.reload()

      const section = page.locator('.dcc-network-theme').first()
      await expect(section).toBeVisible()
      await expect(section).toHaveCSS('background-color', mode === 'light' ? 'rgb(242, 245, 239)' : 'rgb(9, 19, 19)')
      await expect(page.locator('.dn-network-field').first()).toHaveCSS('background-color', mode === 'light' ? 'rgb(229, 238, 229)' : 'rgb(11, 24, 24)')
      await expect(page.getByRole('button', { name: 'Moises' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'Angelo' })).toBeVisible()
      await page.getByRole('button', { name: 'Moises' }).click()
      await expect(page).toHaveURL(/person=moises-sanabria/)
      await expect(page.getByText('72', { exact: true })).toBeVisible()
      await page.getByRole('button', { name: /Games & XR/i }).first().click()
      await expect(page).toHaveURL(/practice=xr/)
      await page.getByRole('button', { name: 'Angelo', exact: true }).click()
      await expect(page).toHaveURL(/person=angelo-caruso/)
      // No fictional view or obsolete export buttons.
      await expect(page.getByRole('button', { name: /connection study|try a connection|export svg|share view/i })).toHaveCount(0)
    })

    test('Atlas uses matching ' + mode + ' theme and accessible links', async ({ page }) => {
      await page.goto('/network/community')
      await page.evaluate((value) => localStorage.setItem('theme', value), mode)
      await page.reload()

      const section = page.locator('.dcc-network-theme').first()
      await expect(section).toBeVisible()
      await expect(section).toHaveCSS('background-color', mode === 'light' ? 'rgb(242, 245, 239)' : 'rgb(9, 19, 19)')
      await expect(page.getByRole('heading', { name: /find your constellation/i })).toBeVisible()
      await expect(page.getByRole('heading', { name: /find people through their practice/i })).toBeVisible()
      await expect(page.getByText('72', { exact: true })).toBeVisible()
      await expect(page.getByRole('link', { name: /website/i }).first()).toHaveAttribute('href', /^https:\/\//)
      await page.getByRole('button', { name: 'Angelo', exact: true }).click()
      await expect(page.getByRole('heading', { name: 'Angelo Caruso' })).toBeVisible()
      await expect(page.getByRole('link', { name: /Visit website/i })).toHaveAttribute('href', 'https://angelocaruso.art')

      await page.getByRole('button', { name: /your passport/i }).first().click()
      await expect(page.getByRole('dialog')).toBeVisible()
      await expect(page.getByRole('dialog').getByRole('button', { name: 'Save Passport draft' })).toBeVisible()
    })
  }

  test('mobile panels fit within their page without horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    for (const route of ['/network/artwork', '/network/community']) {
      await page.goto(route)
      const overflow = await page.locator('.dcc-network-theme').first().evaluate((element) =>
        Math.max(0, element.getBoundingClientRect().right - window.innerWidth)
      )
      expect(overflow).toBeLessThan(2)
    }
  })
})
