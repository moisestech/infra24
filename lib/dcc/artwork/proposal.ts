/**
 * Public-facing proposal copy for The Network Makes Itself.
 *
 * This file is the editorial source of truth for /network/artwork/proposal.
 * Edit text, deliverables, and budget here without changing the route.
 * Hypothetical participant count and funding uses are a proposal, not an
 * assertion that anyone has joined or that an award has been made.
 */
export const NETWORK_ARTWORK_PROPOSAL = {
  title: 'The Network Makes Itself',
  eyebrow: 'A proposed collectively authored web artwork and sculptural edition',
  subtitle: 'If code can become the architecture of a cultural institution, who gets to redesign it?',
  proposition: 'A cultural institution is no longer only a building with an IT department. A network can organize through protocols, software, distributed fabrication, and relationships chosen by its participants. The Network Makes Itself makes that architecture visible, editable, and—at a moment chosen together—physical.',
  source: 'An artist-led experiment developed within DCC Miami, in dialogue with Born Into the Machine.',
  introduction: [
    'Conventional cultural institutions often use digital systems to administer programs already organized around buildings, boards, collections, and staff. DCC Miami explores a different arrangement: software and reciprocal human relationships form part of the institution’s operational structure, while studios, machines, workshops, and existing cultural spaces remain essential.',
    'Instead of showing a community as an automatically generated social graph, this project asks participants to author the graph as an artwork. Each node can change what it chooses to reveal, what it needs, and what it offers. An edge is not evidence of friendship or endorsement: an actual public connection must be agreed to by the people involved.',
  ],
  projectQuestion: 'Can an institution’s living code and relationships become a collectively authored artwork—and then a physical object?',
  phases: [
    {
      number: '01',
      title: 'Describe yourself',
      verb: 'AUTHOR',
      body: 'An invited, opt-in group of artists chooses how each is represented: their practice, a current question, a capability, or the decision to remain quiet or absent. Participants can revise or remove their digital contributions.',
    },
    {
      number: '02',
      title: 'Negotiate an edge',
      verb: 'CONNECT',
      body: 'Connections may begin as proposals. The artwork visually distinguishes a shared topic, a proposed connection, and an explicitly accepted collaboration. No network analysis should silently turn proximity into a social claim.',
    },
    {
      number: '03',
      title: 'Change the architecture',
      verb: 'TRANSFORM',
      body: 'Every approved contribution changes the composition. The web interface is not a dashboard illustrating a finished artwork: the act of collectively editing the structure is the artwork.',
    },
    {
      number: '04',
      title: 'Freeze an edition',
      verb: 'MATERIALIZE',
      body: 'Participants select a state of the network to make physical. A deterministic vector edition becomes a modest sculptural study, such as layered engraved acrylic or routed material. Physical inclusion requires separate consent.',
    },
  ],
  tension: {
    left: {
      label: 'The building',
      title: 'Institution as fixed architecture',
      body: 'Culture becomes legible through facilities, departments, permanent sites, and established rules of access.',
    },
    right: {
      label: 'The network',
      title: 'Institution as negotiated architecture',
      body: 'Culture emerges through distributed spaces, programmable protocols, reciprocal actions, and permissioned relationships.',
    },
  },
  grant: {
    award: '$1,500',
    heading: 'A grant-sized experiment, not a new institution from scratch.',
    summary: 'The proposal extends an existing DCC Community Atlas and a separate interactive artwork study. The award would support a small, paid coauthoring experiment, public-facing consent controls, fabrication, and documentation. The aim is one credible digital-to-physical edition, not the completion of a full membership platform.',
    budget: [
      { name: 'Participant honoraria', detail: 'Eight opt-in artists × $75', amount: 600 },
      { name: 'Fabrication and materials', detail: 'Material tests, cutting/engraving, hardware', amount: 500 },
      { name: 'Software and accessibility', detail: 'Consent interaction and export refinements', amount: 250 },
      { name: 'Documentation', detail: 'Photography and openly shared production notes', amount: 150 },
    ],
    outcomes: [
      'A working, publicly viewable web artwork demonstrating collective authorship',
      'An invited coauthoring process with clearly scoped opt-in participation',
      'A documented, reproducible snapshot and one fabricated sculptural study',
      'A transparent record of the rules, permissions, and material decisions used to make the edition',
    ],
  },
  ethics: [
    {
      title: 'People are not data points',
      text: 'A declared skill or shared interest is not a real relationship, referral, agreement, or invitation. The visual language must distinguish inference from human approval.',
    },
    {
      title: 'Permission is specific',
      text: 'Being part of DCC, its private chat, or its internal contact records does not authorize a public node. Public graph visibility, a public edge, and inclusion in an enduring physical edition require separate choices.',
    },
    {
      title: 'Absence belongs in the artwork',
      text: 'Participants may decline, revise, or withdraw from the digital study. Published physical editions cannot be automatically undone, so the materialization step requires informed consent and a clear correction policy.',
    },
    {
      title: 'The institution should outlive the founder',
      text: 'The project tests the possibility of stewardship and editorial authority shared with participants, rather than relying on one person to continuously compose the network.',
    },
  ],
  status: {
    implemented: [
      'Existing DCC Community Atlas and member-consent design research',
      'A Three.js minimum-count portrait of 100+ founder-reported Commons members without identifying a specific person',
      'A separate hypothetical connection experiment and two reproducible SVG studies',
    ],
    proposed: [
      'Real participant authorship and verified mutual-edge approval',
      'Participatory edition selection and physical-edition permission',
      'Material testing, fabrication, documentation and stewardship',
    ],
  },
  attribution: {
    lead: 'Moises Sanabria',
    studio: 'DCC Miami / artist-led cooperative infrastructure experiment',
    research: 'Born Into the Machine',
    note: 'The generated installation rendering is a speculative visualization of a proposed edition, not a photograph of a finished artwork.',
  },
} as const
