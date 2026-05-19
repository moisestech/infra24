/**
 * Wide topic banners (Unsplash) for module reader sections — swap for branded art later.
 * Hostname must match next/image remotePatterns (images.unsplash.com).
 */
const UNSPLASH = (photoId: string, w = 1200, h = 420) =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${w}&h=${h}&q=80`

export const ipAgeOfAiModuleSectionPlaceholderBySlug: Record<string, string> = {
  video: UNSPLASH('photo-1611162617474-5b21e879e113'),
  transcript: UNSPLASH('photo-1455390582262-044c114baab7'),
  triage: UNSPLASH('photo-1589829545856-d10d557cf95f'),
  aiAudit: UNSPLASH('photo-1677442136019-21780ecad995'),
  contract: UNSPLASH('photo-1507679799987-c73779587ccf'),
  riskLadder: UNSPLASH('photo-1454165804606-c3d57bc86b40'),
  scenario: UNSPLASH('photo-1522071820081-009f0129c71c'),
  tips: UNSPLASH('photo-1517245386807-bb43f82e33b4'),
  extraChecklists: UNSPLASH('photo-1434030216411-0b793f4b4173'),
  keyPoints: UNSPLASH('photo-1516321318423-f06f85e504b3'),
  takeaways: UNSPLASH('photo-1523240795612-9a054b0db644'),
  examples: UNSPLASH('photo-1540575467063-178a50c2df87'),
  checklist: UNSPLASH('photo-1484480974693-6ca9a78abc36'),
  reflection: UNSPLASH('photo-1499750310107-5fef28a66643'),
  glossary: UNSPLASH('photo-1507842217343-583bb7270b66'),
  curatedLinks: UNSPLASH('photo-1460925895917-afdab827c52f'),
  relatedWorksheets: UNSPLASH('photo-1586281380349-632531db108ed'),
  toolkit: UNSPLASH('photo-1456513080510-7bf3a84b82f8'),
  next: UNSPLASH('photo-1522202176988-66273c2fd55f'),
}
