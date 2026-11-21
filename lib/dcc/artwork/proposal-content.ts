/** Edit this file to revise the public proposal without changing the page layout.
 * All stages are proposed unless explicitly labeled as implemented.
 */
export const PROPOSAL = {
  title: 'The Network Makes Itself',
  subtitle: 'A collectively authored institution that can be seen, changed, and made physical.',
  eyebrow: 'DCC MIAMI / RHIZOME MICROGRANTS 2026 / CO-OP PROPOSAL',
  status: 'Artist proposal / pilot in development',
  author: 'Moises Sanabria with the DCC Miami creative network',
  grantCategory: 'CO-OP',
  requestedAmount: 1500,
  statement: 'What if the building of a cultural institution were code, its architecture were human relationships, and its members could collectively redesign it?',
  shortProposal: 'Traditional cultural institutions have buildings and IT departments. DCC Miami asks: what if code and human relationships become the institution’s architecture? The Network Makes Itself turns our existing artist-led network into a collectively authored web artwork. Members opt in to shape their own nodes and mutually approve connections; each action alters a living 3D composition. Together, they choose a moment to fabricate as a sculptural network edition. Building on my Born Into the Machine research and DCC’s Atlas prototype, Rhizome’s grant would support participant honoraria, consent-based authoring tools, and the first physical edition—testing whether a cultural institution can be programmed by its community.',
  intro: 'Many established cultural institutions treat software as a department or utility that supports a building. DCC Miami is testing a different proposition: an artist-led cultural institution in which shared code, human relationships, local spaces and distributed production capacity are the organizational architecture itself. This is not a claim that software can replace social trust or physical institutions. It asks what becomes possible when people can directly shape the protocols through which they discover, gather, and make.',
  artwork: 'The Network Makes Itself turns that ongoing institutional experiment into a participatory web artwork. Participants author the terms of their own representation: what they are making, what they need, what they can offer, and which connections they choose to acknowledge. As these choices change, the composition changes. The code is both interface and score; the network is both subject and co-author.',
  fabrication: 'At an agreed moment, participating artists will select a consented state of the network, freeze its geometry, and translate it into a small physical sculpture through digital fabrication. The physical edition is not a trophy for network growth. It is a material record of chosen relationships, absences, decisions, and the limits of what a graph can show. The first study favors laser-cut or engraved layers, with material and joinery confirmed by a participating fabricator.',
  criticalQuestion: 'Who authors the institution when the institution is programmable?',
  method: [
    { index: '01', name: 'Author', detail: 'A small invited cohort of artists chooses what to reveal about their practices. People can remain private or change their representations.' },
    { index: '02', name: 'Negotiate', detail: 'Participants propose connections; a public person-to-person edge appears only with both parties’ approval. Shared interests are not misrepresented as personal relationships.' },
    { index: '03', name: 'Compose', detail: 'Changes to declared contributions and approved connections reshape an inspectable artwork. No prestige ranking or automated scoring of individual worth.' },
    { index: '04', name: 'Freeze', detail: 'The group selects a specific edition with separate permission for permanent physical inclusion. The version and decision process are documented.' },
    { index: '05', name: 'Fabricate', detail: 'A DCC maker translates the edition into a modest physical object. The process, contributors and technical constraints become part of the work.' },
  ],
  deliverables: [
    'Public browser-based artwork with a documented opt-in pilot, building on the existing DCC Atlas',
    'A small, compensated group of participants exercising real authoring and connection choices',
    'A reproducible, consented edition and a maker-reviewed physical sculptural study',
    'Open process notes documenting decisions, credits, technical limitations and ethical boundaries',
  ],
  budget: [
    { name: 'Participant artist honoraria', dollars: 600, note: 'Four participating contributors at $150 each; final invitations and terms to be agreed' },
    { name: 'Interactive authoring + edition engineering', dollars: 350, note: 'Consent controls, deterministic snapshot, SVG output; builds on the existing codebase' },
    { name: 'Physical fabrication', dollars: 350, note: 'Materials, laser/print tests and paid fabrication assistance' },
    { name: 'Documentation + access', dollars: 200, note: 'Photographs, contributor credits, process notes and accessible presentation' },
  ],
  timeline: [
    { phase: 'I', duration: 'Weeks 1–2', task: 'Review existing Atlas, recruit a consenting pilot cohort, define the artistic score and participation permissions' },
    { phase: 'II', duration: 'Weeks 3–5', task: 'Pilot participant-authored nodes and mutual connections; refine interactive graph and recording of changes' },
    { phase: 'III', duration: 'Weeks 6–7', task: 'Select and permission an edition, produce deterministic geometry, test materials and fabricate' },
    { phase: 'IV', duration: 'Week 8', task: 'Publish artwork and pilot documentation with contributor review and attribution' },
  ],
  principles: [
    'The network is not a scraped directory and private WhatsApp conversations are never silently published.',
    'Public profile, public relationship, and physical edition inclusion are separate, affirmative permissions.',
    'A proposed edge and a verified mutual connection must look different. No visual inference is evidence of trust.',
    'A participant may refuse, revise or withdraw digital representation; a fixed physical edition requires an explicit, informed permission process.',
    'Human stewards remain accountable for trust, labor, conflict and consent. AI may assist but does not unilaterally decide who belongs.',
    'The physical sculpture is a proposal until it has been fabricated; all visualization sketches are identified as studies.',
  ],
  references: [
    { label: 'DCC Miami — public site', href: 'https://dcc.miami' },
    { label: 'Existing DCC Community Atlas', href: 'https://dcc.miami/network/community' },
    { label: 'Working artwork prototype (GitHub)', href: 'https://github.com/moisestech/infra24/pull/54' },
    { label: 'Artist portfolio', href: 'https://www.moises.tech' },
  ],
} as const
