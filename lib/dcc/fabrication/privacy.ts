export type FabricationSourceType = 'dcc' | 'peer' | 'vendor' | 'research'

export type FabricationPublicBoundary = {
  publicSafe: boolean
  attributionApproved: boolean
  sourceType: FabricationSourceType
}

/**
 * Public pages must call this before rendering.
 * Peer/vendor records stay unpublished unless both flags are true.
 */
export function isFabricationRecordPublic(
  record: FabricationPublicBoundary
): boolean {
  if (!record.publicSafe) return false
  if (
    (record.sourceType === 'peer' || record.sourceType === 'vendor') &&
    !record.attributionApproved
  ) {
    return false
  }
  return true
}
