/** Cloudinary CDN for resin workshop media (primary src — not local public/). */
export const RESIN_CLOUDINARY_CLOUD = 'dck5rzi4h'
export const RESIN_CLOUDINARY_FOLDER =
  'dccmiami/workshops/resin-printing-for-artist'

export function resinCloudinaryUrl(
  version: number,
  fileWithHashAndExt: string
): string {
  return `https://res.cloudinary.com/${RESIN_CLOUDINARY_CLOUD}/image/upload/v${version}/${RESIN_CLOUDINARY_FOLDER}/${fileWithHashAndExt}`
}

/** Module banners 00–08 (1915×821 PNG). */
export const RESIN_BANNER_CDN = {
  welcome: resinCloudinaryUrl(1786411642, '00-welcome-join-banner_uuj3y1.png'),
  'why-resin': resinCloudinaryUrl(1786411641, '01-why-resin-banner_zvzmtl.png'),
  'safety-zones': resinCloudinaryUrl(
    1786411636,
    '02-safety-zones-banner_dxisj7.png'
  ),
  'complete-workflow': resinCloudinaryUrl(
    1786411638,
    '03-complete-workflow-banner_qfymqt.png'
  ),
  'file-readiness': resinCloudinaryUrl(
    1786411636,
    '04-file-printable-banner_jvsgvc.png'
  ),
  'slicer-lab': resinCloudinaryUrl(
    1786411634,
    '05-slicer-lab-banners_wcw8do.png'
  ),
  'print-wash-cure': resinCloudinaryUrl(
    1786411643,
    '06-print-wash-cure-banner_thclij.png'
  ),
  'failure-clinic': resinCloudinaryUrl(
    1786411640,
    '07-failure-clinic-banner_sk1ix9.png'
  ),
  'project-readiness': resinCloudinaryUrl(
    1786411637,
    '08-project-readiness-banner_sm5rjc.png'
  ),
} as const

/** Instructional concepts 107–135. */
export const RESIN_CONCEPT_CDN = {
  '107-slicer-orientation-compare': resinCloudinaryUrl(
    1786559729,
    '107-slicer-orientation-compare_occocx.webp'
  ),
  '108-slicer-support-patterns': resinCloudinaryUrl(
    1786559729,
    '108-slicer-support-patterns_gkssim.webp'
  ),
  '109-slicer-hollow-drain-logic': resinCloudinaryUrl(
    1786559729,
    '109-slicer-hollow-drain-logic_y5ojsl.webp'
  ),
  '110-slicer-layer-preview': resinCloudinaryUrl(
    1786559729,
    '110-slicer-layer-preview_j6tath.webp'
  ),
  '111-file-scale-mismatch': resinCloudinaryUrl(
    1786559730,
    '111-file-scale-mismatch_lfwb2f.webp'
  ),
  '112-project-planning-drivers': resinCloudinaryUrl(
    1786559730,
    '112-project-planning-drivers_bkxbcj.webp'
  ),
  '113-post-processing-states': resinCloudinaryUrl(
    1786559730,
    '113-post-processing-states_nesh2n.webp'
  ),
  '114-failure-evidence-first': resinCloudinaryUrl(
    1786559731,
    '114-failure-evidence-first_w9lrpo.webp'
  ),
  '115-complete-toolchain': resinCloudinaryUrl(
    1787020034,
    '115-complete-toolchain_krmd0u.png'
  ),
  '116-source-image-preparation': resinCloudinaryUrl(
    1787020033,
    '116-source-image-preparation_b1fpuf.png'
  ),
  '117-ai-image-to-3d-compare': resinCloudinaryUrl(
    1787020033,
    '117-ai-image-to-3d-compare_e26f5o.png'
  ),
  '118-blender-mesh-inspection': resinCloudinaryUrl(
    1787020040,
    '118-blender-mesh-inspection_srcx5g.png'
  ),
  '119-photon-workshop-concept': resinCloudinaryUrl(
    1787020036,
    '119-photon-workshop-concept_qoewh4.png'
  ),
  '120-m7-max-equipment-portrait': resinCloudinaryUrl(
    1787020034,
    '120-m7-max-equipment-portrait_e97nv0.png'
  ),
  '121-resin-printer-components': resinCloudinaryUrl(
    1787020034,
    '121-resin-printer-components_zcngln.png'
  ),
  '122-wash-cure-equipment-portrait': resinCloudinaryUrl(
    1787020036,
    '122-wash-cure-equipment-portrait_iffuk8.png'
  ),
  '123-ppe-consumables-atlas': resinCloudinaryUrl(
    1787020038,
    '123-ppe-consumables-atlas_m5u5gt.png'
  ),
  '124-meshy-tool-card': resinCloudinaryUrl(
    1787020036,
    '124-meshy-tool-card_bvfnyw.png'
  ),
  '125-tripo-tool-card': resinCloudinaryUrl(
    1787020040,
    '125-tripo-tool-card_qvjrnb.png'
  ),
  '126-file-format-handoff': resinCloudinaryUrl(
    1787020038,
    '126-file-format-handoff_wpi3k6.png'
  ),
  '127-material-states': resinCloudinaryUrl(
    1787020034,
    '127-material-states_ycfbfk.png'
  ),
  '128-stop-isolate-notify': resinCloudinaryUrl(
    1787020036,
    '128-stop-isolate-notify_w3gisu.png'
  ),
  '129-failure-plate-detached': resinCloudinaryUrl(
    1787020036,
    '129-failure-plate-detached_pkccpe.png'
  ),
  '130-failure-crack-bloom': resinCloudinaryUrl(
    1787020038,
    '130-failure-crack-bloom_hwgkk5.png'
  ),
  '131-failure-surface-symptoms': resinCloudinaryUrl(
    1787020038,
    '131-failure-surface-symptoms_hkkbno.png'
  ),
  '132-known-good-next-test': resinCloudinaryUrl(
    1787020038,
    '132-known-good-next-test_t52pse.png'
  ),
  '133-resin-fdm-consultation': resinCloudinaryUrl(
    1787020040,
    '133-resin-fdm-consultation_ytbd2m.png'
  ),
  '134-file-inspection-toolkit': resinCloudinaryUrl(
    1787020040,
    '134-file-inspection-toolkit_ml4gqs.png'
  ),
  '135-dry-finishing-toolkit': resinCloudinaryUrl(
    1787020041,
    '135-dry-finishing-toolkit_zyezvm.png'
  ),
  /** Module teaching stills 200–214 (m00–m08). */
  '200-m00-participant-path': resinCloudinaryUrl(
    1787060083,
    '200-m00-participant-path_xdv53d.webp'
  ),
  '201-m01-process-choice': resinCloudinaryUrl(
    1787060083,
    '201-m01-process-choice_ocl4l1.webp'
  ),
  '202-m02-safety-zone-behaviors': resinCloudinaryUrl(
    1787060083,
    '202-m02-safety-zone-behaviors_glhfpm.webp'
  ),
  '203-m03-workflow-checkpoints': resinCloudinaryUrl(
    1787060084,
    '203-m03-workflow-checkpoints_a1g5en.webp'
  ),
  '204-m04-five-file-checks': resinCloudinaryUrl(
    1787060084,
    '204-m04-five-file-checks_mzv8zw.webp'
  ),
  '205-m04-file-outcomes': resinCloudinaryUrl(
    1787060084,
    '205-m04-file-outcomes_eyvol4.webp'
  ),
  '206-m05-orientation-tradeoffs': resinCloudinaryUrl(
    1787060085,
    '206-m05-orientation-tradeoffs_ml2r6b.webp'
  ),
  '207-m05-hollow-drain-cutaway': resinCloudinaryUrl(
    1787060085,
    '207-m05-hollow-drain-cutaway_u7x4lz.webp'
  ),
  '208-m05-layers-and-islands': resinCloudinaryUrl(
    1787060085,
    '208-m05-layers-and-islands_oyyvbs.webp'
  ),
  '209-m06-preflight-stop-check': resinCloudinaryUrl(
    1787060086,
    '209-m06-preflight-stop-check_esi9ge.webp'
  ),
  '210-m06-print-wash-dry-support-cure': resinCloudinaryUrl(
    1787060086,
    '210-m06-print-wash-dry-support-cure_tvthgo.webp'
  ),
  '211-m07-failure-symptom-atlas': resinCloudinaryUrl(
    1787060087,
    '211-m07-failure-symptom-atlas_a5uhwc.webp'
  ),
  '212-m07-evidence-first-diagnosis': resinCloudinaryUrl(
    1787060087,
    '212-m07-evidence-first-diagnosis_oubowj.webp'
  ),
  '213-m08-readiness-board': resinCloudinaryUrl(
    1787060087,
    '213-m08-readiness-board_gjwhqs.webp'
  ),
  '214-m08-readiness-pathways': resinCloudinaryUrl(
    1787060087,
    '214-m08-readiness-pathways_ws1wvh.webp'
  ),
} as const

export type ResinConceptId = keyof typeof RESIN_CONCEPT_CDN
