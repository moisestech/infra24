import {
  artistMatchesConstituentFilter,
  buildConstituentMetadata,
  getConstituentTypeDefinition,
  resolveConstituentLabel,
  resolveConstituentTypeKey,
} from '@/lib/network-builder/constituent-types';

describe('constituent-types', () => {
  it('defines studio resident with stable type_key', () => {
    const def = getConstituentTypeDefinition('studio_resident');
    expect(def?.label).toBe('Studio Resident');
    expect(def?.display_filter).toBe('studio_residents');
  });

  it('builds metadata with constituent_type slug and label', () => {
    expect(
      buildConstituentMetadata('studio_resident', { studio: '101', residency_cohort: '2026' })
    ).toMatchObject({
      constituent_type: 'studio_resident',
      constituent_label: 'Studio Resident',
      residency_type: 'Studio Resident',
      studio: '101',
      residency_cohort: '2026',
    });
  });

  it('resolves studio resident from metadata or member type', () => {
    expect(
      resolveConstituentTypeKey({ constituent_type: 'studio_resident' }, null, null)
    ).toBe('studio_resident');
    expect(resolveConstituentTypeKey({ residency_type: 'Studio Resident' }, null, null)).toBe(
      'studio_resident'
    );
    expect(resolveConstituentTypeKey(null, 'studio_resident', null)).toBe('studio_resident');
  });

  it('filters artists by studio_residents program token', () => {
    expect(
      artistMatchesConstituentFilter(
        { constituent_type: 'studio_resident' },
        'studio_resident',
        'studio_residents'
      )
    ).toBe(true);
    expect(
      artistMatchesConstituentFilter({ constituent_type: 'youth_resident' }, null, 'studio_residents')
    ).toBe(false);
    expect(
      artistMatchesConstituentFilter(null, null, 'all')
    ).toBe(true);
  });

  it('resolves display label from metadata', () => {
    expect(
      resolveConstituentLabel({ constituent_label: 'Studio Resident' }, 'Other')
    ).toBe('Studio Resident');
    expect(resolveConstituentLabel(null, 'Studio Resident')).toBe('Studio Resident');
  });
});
