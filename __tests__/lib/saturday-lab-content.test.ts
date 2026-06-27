import fs from 'fs'
import path from 'path'
import { SATURDAY_LAB_CHEAT_SHEET_IMAGES, SATURDAY_LAB_CHEAT_SHEET_PDFS } from '@/lib/workshops/saturday-lab-media'

const CONTENT_DIR = path.join(process.cwd(), 'content/workshops/saturday-lab')

describe('saturday-lab content files', () => {
  const requiredFiles = [
    'facilitator-run-of-show.md',
    'packet-beginner-artist-website.md',
    'packet-vibe-coding-for-artists.md',
    'student-paths.md',
    'shared-resources.md',
    'print/start-here-half-sheet.md',
    'print/beginner-cheat-sheet.md',
    'print/vibe-coding-cheat-sheet.md',
    'print/exit-ticket.md',
    'starter-template/index.html',
    'starter-template/style.css',
  ]

  it.each(requiredFiles)('includes %s', (file) => {
    expect(fs.existsSync(path.join(CONTENT_DIR, file))).toBe(true)
  })

  it('cloudinary cheat sheet URLs are configured', () => {
    expect(SATURDAY_LAB_CHEAT_SHEET_IMAGES.beginner).toContain('artist_website_cheat_sheet_for_beginners_vkvcvl')
    expect(SATURDAY_LAB_CHEAT_SHEET_IMAGES.vibeCoding).toContain('vibe_coding_cheat_sheet_for_artists')
    expect(SATURDAY_LAB_CHEAT_SHEET_PDFS.beginner).toContain('Beginner_Website_Cheat_Sheet')
    expect(SATURDAY_LAB_CHEAT_SHEET_PDFS.vibeCoding).toContain('Vibe_Coding_Cheat_Sheet')
  })

  it('uses canonical vibe chapter URLs without /chapters/', () => {
    const vibePacket = fs.readFileSync(
      path.join(CONTENT_DIR, 'packet-vibe-coding-for-artists.md'),
      'utf8'
    )
    expect(vibePacket).toContain('/workshop/vibe-coding-and-net-art/getting-started-with-vibecoding')
    expect(vibePacket).not.toContain('/workshop/vibe-coding-and-net-art/chapters/')
  })

  it('starter zip path referenced in shared resources', () => {
    const body = fs.readFileSync(path.join(CONTENT_DIR, 'shared-resources.md'), 'utf8')
    expect(body).toContain('/workshops/saturday-lab-starter.zip')
  })
})
