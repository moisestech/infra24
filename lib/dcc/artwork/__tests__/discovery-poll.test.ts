import { DCC_DISCOVERY_POLL, isDiscoveryChoice, discoveryChoice } from '../discovery-poll'

describe('real DCC WhatsApp poll: screenshot-shared 2026-11-21', () => {
  it('records exactly the six options and totals shown by the organizer', () => {
    expect(DCC_DISCOVERY_POLL.choices.map((x) => [x.id, x.count])).toEqual([
      ['art', 21],
      ['fabrication', 16],
      ['film', 11],
      ['code', 10],
      ['xr', 7],
      ['exploring', 7],
    ])
    expect(DCC_DISCOVERY_POLL.choices.reduce((total, choice) => total + choice.count, 0)).toBe(72)
    expect(DCC_DISCOVERY_POLL.totalSelections).toBe(72)
  })
  it('does not claim 72 unique people or include any voter attribution', () => {
    expect(DCC_DISCOVERY_POLL.respondents).toBeNull()
    expect(DCC_DISCOVERY_POLL.multiSelect).toBe(true)
    expect(DCC_DISCOVERY_POLL.choices.every((choice) =>
      !('voters' in choice) && !('memberIds' in choice) && !('avatar' in choice)
    )).toBe(true)
  })
  it('only accepts the published choice IDs in safe share links', () => {
    expect(isDiscoveryChoice('art')).toBe(true)
    expect(isDiscoveryChoice('no-such-option')).toBe(false)
    expect(discoveryChoice('code').count).toBe(10)
  })
})
