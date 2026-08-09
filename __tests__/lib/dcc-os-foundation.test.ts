import {
  estimateFabricationRange,
} from '@/lib/dcc/make-estimator'
import {
  formatTierPrice,
} from '@/lib/dcc/services'
import {
  publicMachineStatusLabel,
} from '@/lib/dcc/os-field-map'

describe('make estimator', () => {
  it('returns a widened non-binding range', () => {
    const r = estimateFabricationRange({
      process: 'FDM',
      volumeBracket: 'medium',
      tier: 'Public',
    })
    expect(r.high).toBeGreaterThan(r.low)
    expect(r.label).toContain('estimate, not a quote')
  })

  it('applies associate discount vs commercial', () => {
    const a = estimateFabricationRange({
      process: 'Resin',
      volumeBracket: 'small',
      tier: 'Associate',
    })
    const c = estimateFabricationRange({
      process: 'Resin',
      volumeBracket: 'small',
      tier: 'Commercial',
    })
    expect(a.low).toBeLessThan(c.low)
  })
})

describe('pricing helpers', () => {
  it('never renders blank or zero as $0', () => {
    expect(formatTierPrice(null)).toBe('Quoted')
    expect(formatTierPrice(0)).toBe('Quoted')
    expect(formatTierPrice(120)).toBe('$120')
  })
})

describe('machine public status', () => {
  it('maps Service Soon to Available', () => {
    expect(publicMachineStatusLabel('Service Soon')).toBe('Available')
    expect(publicMachineStatusLabel('Operational')).toBe('Available')
    expect(publicMachineStatusLabel('Maintenance')).toBe('In service')
    expect(publicMachineStatusLabel('Offline')).toBe('Offline')
    expect(publicMachineStatusLabel('Planned / Not Acquired')).toBe('Coming soon')
  })
})
