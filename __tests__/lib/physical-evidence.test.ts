import {
  PHYSICAL_EVIDENCE_BOOKLET_PAGES,
  PHYSICAL_EVIDENCE_HERO,
  PHYSICAL_EVIDENCE_STAGES,
} from '@/lib/workshop-engine/resin-printing/physical-evidence'

describe('physical evidence stage icon map (v07 prep)', () => {
  it('defines hero + five stages with conceptual alts and icons', () => {
    expect(PHYSICAL_EVIDENCE_HERO.iconKey).toBe('workflow')
    expect(PHYSICAL_EVIDENCE_STAGES).toHaveLength(5)
    expect(PHYSICAL_EVIDENCE_STAGES.map((s) => s.id)).toEqual([
      'raw-file',
      'sliced-file',
      'supported-print',
      'washed-cured',
      'finished-object',
    ])
    for (const stage of PHYSICAL_EVIDENCE_STAGES) {
      expect(stage.alt.length).toBeGreaterThan(20)
      expect(stage.Icon).toBeTruthy()
      expect(stage.assetStem).toMatch(/^31[1-5]-/)
    }
    expect(PHYSICAL_EVIDENCE_STAGES.find((s) => s.id === 'washed-cured')?.ready).toBe(
      false
    )
    expect(PHYSICAL_EVIDENCE_BOOKLET_PAGES).toEqual([3, 9, 33, 39])
  })
})
