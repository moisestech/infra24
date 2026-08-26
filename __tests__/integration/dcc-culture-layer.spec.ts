import { expect, test } from '@playwright/test'

const DCC_CULTURAL_POSITION =
  'DCC MIA is a digital cultural center for artists working through the technological conditions of the present.'
const ARTISTS_EMPTY =
  'Artist profiles will appear here as DCC presents and documents work. Names, images and bios are published only when confirmed.'
const JOURNAL_EMPTY_CONVERSATIONS =
  'DCC Conversations will be published here as recorded interviews and studio visits are edited. A podcast feed is not launching in this phase.'

test.describe('dcc culture + fabricate smokes', () => {
  test('home shows the cultural position and Clandestine as Now', async ({
    page,
  }) => {
    await page.goto('/')
    await expect(page.getByText(DCC_CULTURAL_POSITION)).toBeVisible()
    const now = page.locator('#now')
    await expect(
      now.getByRole('heading', { name: 'DCC MIA at Clandestine Art Fair 2026' })
    ).toBeVisible()
    await expect(now.getByRole('heading', { name: 'Moises Sanabria' })).toBeVisible()
    await expect(now.getByRole('heading', { name: 'Workshops' })).toBeVisible()
    await expect(now.getByRole('heading', { name: 'Fabricate' })).toBeVisible()
    await expect(now.getByRole('heading', { name: 'Journal' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Artists', exact: true }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: 'Fabricate', exact: true }).first()).toBeVisible()
    await page.getByRole('link', { name: 'Meet the artist' }).click()
    await expect(page).toHaveURL(/\/artists\/moises-sanabria/)
  })

  test('programs index lists Clandestine without invented dates', async ({
    page,
  }) => {
    await page.goto('/programs')
    await expect(
      page.getByRole('heading', { name: 'DCC MIA at Clandestine Art Fair 2026' })
    ).toBeVisible()
    await expect(page.getByText(/Art fair/i).first()).toBeVisible()
    await expect(page.getByText(/\b(10|15)\s*%/)).toHaveCount(0)
  })

  test('Clandestine detail stays a known-facts skeleton', async ({ page }) => {
    await page.goto('/programs/art-fairs/clandestine-art-fair-2026')
    await expect(
      page.getByRole('heading', { name: 'DCC MIA at Clandestine Art Fair 2026' })
    ).toBeVisible()
    await expect(
      page.getByText(/published when confirmed/i).first()
    ).toBeVisible()
    await expect(page.getByText(/\b(10|15)\s*%/)).toHaveCount(0)
    await expect(page.getByText(/DCC × ITS3D|ITS3D Miami/i)).toHaveCount(0)
  })

  test('artists and workshops indexes stay public without Clerk sign-in', async ({
    page,
  }) => {
    await page.goto('/artists')
    await expect(page).not.toHaveURL(/sign-in/)
    await expect(page.getByRole('heading', { name: 'Artists', exact: true })).toBeVisible()
    await page.goto('/workshops')
    await expect(page).not.toHaveURL(/sign-in/)
    await expect(page.getByRole('heading', { name: /Workshop catalog/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'DCC MIA sessions' })).toBeVisible()
    await expect(page.getByText('Workshop catalog unavailable')).toHaveCount(0)
    await expect(page.getByText(/No organization found for slug/i)).toHaveCount(0)
    await expect(page.getByText(/NEXT_PUBLIC_WORKSHOP_CATALOG_ORG_SLUG/)).toHaveCount(0)
  })

  test('artists index lists published founders and not an invented Clandestine roster', async ({
    page,
  }) => {
    await page.goto('/artists')
    await expect(page.getByRole('heading', { name: 'Artists', exact: true })).toBeVisible()
    await expect(page.getByText(ARTISTS_EMPTY)).toHaveCount(0)
    await expect(page.getByRole('link', { name: /Moises Sanabria/i }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: /Fabiola Larios/i }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: /Angelo Caruso/i }).first()).toBeVisible()
  })

  test('journal conversations category stays empty of invented guests', async ({
    page,
  }) => {
    await page.goto('/journal/conversations')
    await expect(page.getByRole('heading', { name: 'Conversations' })).toBeVisible()
    await expect(page.getByText(JOURNAL_EMPTY_CONVERSATIONS)).toBeVisible()
  })

  test('fabricate landing stays public and /fabrication aliases to it', async ({
    page,
  }) => {
    await page.goto('/fabricate')
    await expect(page).not.toHaveURL(/sign-in/)
    await expect(
      page.getByRole('heading', { name: 'Transparent fabrication for artists' })
    ).toBeVisible()
    await expect(page.getByText('DCC Fabrication')).toBeVisible()

    await page.goto('/fabrication')
    await expect(page).not.toHaveURL(/sign-in/)
    await expect(page).toHaveURL(/\/fabricate\/?$/)
    await expect(
      page.getByRole('heading', { name: 'Transparent fabrication for artists' })
    ).toBeVisible()
  })
})
