# DCC Journal — Complete Image-Prompt Library and Social Visual System

**Edition:** 2026-10-26 · **Status:** ART DIRECTION ONLY — no images, posts, or Cloudinary uploads authorized by this document.
**Owner:** DCC MIA editorial studio · **Canonical implementation:** GitHub infra24 and Cloudinary.
**Companion:** GitHub issue #28 (per-essay distribution) and issue #25 (visual quality).

## 0. Production rule: distinguish output classes

There are three fundamentally different kinds of visual material:

1. **Conceptual illustration** — may be generated. It argues visually, is disclosed as conceptual/AI where appropriate, and never pretends to be a real DCC job, participant, public artwork, or studio.
2. **Documentary evidence** — must come from an actual camera/source, with location, author, date and usage permission verified. DO NOT generate a purported photo of Studio 43, a member, a specific finished job, or a partner event.
3. **Explanatory diagram** — render from editable code/SVG in Cursor or the site's React components (or another source-controlled vector workflow). Text/labels must be real typography, not AI-painted pseudo-text. Exact node labels and relationships are in this document.

All renders must deliver independently authored source detail. NEVER take a 500-pixel crop from a collage, enlarge it to 1672 pixels, and call it high resolution.

## 1. Shared style / negative constraints (append to every generative prompt)

**DCC editoral style:** thoughtful artist-run technology culture, materializing the internet through physical object metaphors, believable modest fabrication environments and ordinary human-scale materials; precision, mystery, restrained dry humor, and attention to labor. Charcoal/petrol-black (#02171B, #031518) dominant, deep teal (#056C78) and cyan (#67C6CE) accents, small deliberate amber/clay-orange (#E18B60) focal highlights. Quiet editorial realism, tactile steel/plastic/paper/cable/glass, natural wear, selective cinematic light, detail visible in shadows, strong legibility at 320 px. Avoid mandatory lamp/3D-printer/table in each image: change subject, silhouette, camera angle and foreground scale across stories. Leave natural negative space for possible site typography, but DON'T bake headings into rendered image.

**Exclude from ALL generated art:** letters, legible signage, UI dashboards, invoices with figures, statistics, logos or watermarks; identifiable real people, unauthorized photography, fabricated DCC events, fabricated completed customer projects, misleading Miami landmarks, speculative public artworks presented as existing; generic neural brain art, neon cyberpunk skyline, glowing floating network spheres, smiling coworking stock photos, unrealistic 3D-printer mechanisms, oversaturated corporate gradient stock art.

**Hero master:** 16:9, aim at least 1920 x 1080 independent source detail (site currently displays 1672 x 941 class). Text-free. Preserve safe central crop; hero appears at full width and as card. Version Cloudinary IDs rather than overwrite existing.
**Native LinkedIn visual:** portrait 4:5, target 1080 x 1350 or greater independent source detail, with clear subject centered for mobile. Leave 18% clear top or bottom area for optional separate HTML/design-system headline overlay. Do not crop a 16:9 hero blindly into a portrait.
**OG link share:** reuse approved 16:9 art only if a real LinkedIn Post Inspector preview is legible; otherwise produce a separate composited 1200 x 627 card in code, using the same source and verified text.
**Multi-page document:** portrait 1080 x 1350 pages / PDF. Use site fonts and native typesetting; visual diagrams must be vector-based.
**Caption:** "AI-generated conceptual illustration · DCC Miami" for generative concept artwork. Real photography credits and consent are separate.

## 2. Production inventory (what is actually new)

| ID | Article | Current website hero | Primary social unit | Creation priority |
|---|---|---|---|---|
| 01 | The Institution That Can Build Itself | KEEP standalone full-frame hero | Personal post + verified link; optional 4:5 concept | Optional social |
| 02 | Miami Doesn't Have a Digital-Art Problem | KEEP original September hero | 4:5 systems schematic | Diagram |
| 03 | Building Node 001: Studio 43 | REPLACE conceptual stand-in ONLY when real photo approved | Native actual studio photo | Documentary |
| 04 | A Digital Lab Is Not a Room Full of Equipment | KEEP original September hero | Five-page access-lifecycle PDF | Diagram |
| 05 | The Artist Doesn't Need to Learn Everything | KEEP original September hero | Artist decision-tree PDF | Diagram |
| 06 | What Does It Cost to Run Digital Culture? | MISSING — GENERATE new original 16:9 | Technical accountability PDF | Hero + diagram P0 |
| 07 | When Public Art Becomes Infrastructure | MISSING — GENERATE new original 16:9 | Public-art lifecycle / rider PDF | Hero + diagram P0 |
| 08 | You Can't Buy Digital Culture | REPLACE low-detail cropped hero | Independently composed 4:5 concept | Hero v2 + social P1 |
| 09 | Capacity Exists Before Infrastructure Does | Draft; REPLACE low-detail cropped hero | 4:5 conceptual missing handoff | Hero v2 + social AFTER article approval |
| 10 | An Invitation to Build DCC Miami With Us | Draft; current hero temporary | 4:5 conceptual open chair or consented photo | AFTER CTA/article approval |

There are 4 requested **new/replacement cover generations** (06, 07, 08, 09), 4 **optional/conditional 4:5 conceptual units** (01, 08, 09, 10), 5 **code-authored diagrams/document systems** (02, 04, 05, 06, 07), and 1 **documentary shoot list** (03, with three photos). Everything else is a reuse or editorial decision, not an additional mandatory generation.

## 3. Per-article production prompts


### 01 — The Institution That Can Build Itself
**State:** PUBLISHED
**Post proposition:** A cultural institution can own a website without owning its digital decisions.
**Article hero:** KEEP existing standalone 16:9 October cover. No replacement generation until after responsive crop QA.

**LI-01 — OPTIONAL CONCEPT / 4:5**
> A human-scale temporary civic structure standing without monumental architecture: small modular metal shelves and transparent acrylic dividers on a concrete studio floor, connected by carefully arranged tangible cords; each piece holds one symbol of function—a blank archival box, a folded sheet of paper, a prototype—but one component has been deliberately removed and the arrangement remains standing. Photograph the system from slightly above so agency and modularity are readable from a phone. Quietly uncanny, believable, substantial negative space at upper left, blue-black structural shadows, selective teal/cyan gleam and a single warm accent. No giant building, figure, readable paper or digital interface. 4:5 portrait.

**Deployment:** Original visual optional; recommended first post is text plus link to existing approved website hero.
**Question / reader CTA:** What technical decision should an institution be able to own?
**Social alt draft:** Modular physical shelves hold different cultural functions while remaining connected without a central monument.

### 02 — Miami Doesn't Have a Digital-Art Problem. It Has an Infrastructure Problem.
**State:** PUBLISHED
**Post proposition:** Miami has talent and tools. The difficult part is making them work together.
**Article hero:** KEEP original September cover, no new hero generation.

**DG-02 — CODE-BUILT SVG / 4:5**
> Build an editable 4:5 portrait editorial systems map WITHOUT a geographic map and WITHOUT invented people, businesses or capacity data. Four large purposeful zones: IDEA / PROJECT at top; SPECIALIZED KNOWLEDGE to the left; TOOLS / SPACES to the right; and AGREEMENTS / HANDOFFS at bottom. Thin directed cyan lines show a potential route, while a conspicuous incomplete connection indicates current friction. Use few words and generous spacing, no fake Miami map coordinates, logos or named partners. At bottom in native type: "A city is not a directory." One diagram, not a database network hairball. Teal lines on near-black/paper-neutral panel; amber for missing connection. SVG nodes remain editable with semantically clear alt or adjacent text.

**Deployment:** Do not use ImageGen for labeled map; implement in Cursor/React SVG.
**Question / reader CTA:** Which connection is hardest to make in Miami?
**Social alt draft:** Diagram connects a creative idea with specialist skills, spaces and agreements, emphasizing the handoffs between them.

### 03 — Building Node 001: Studio 43
**State:** PUBLISHED
**Post proposition:** A small room cannot hold all Miami's creative capacity. That's why it can be one node.
**Article hero:** REPLACE only with genuine consent-approved Studio 43 photo. Current AI asset remains explicitly conceptual until replaced.

**PH-03 — DOCUMENTARY PHOTOGRAPHY / 16:9 and 4:5**
> Real on-location shot list, NOT a generative prompt. (A) 16:9 wide view from a studio corner with honest scale, visible real workbench and machines, enough ambient context to show the room as a working node; do not artificially fill the room with more equipment. (B) 4:5 detailed photograph of a verified work-in-progress prototype with real tool and evidence of physical scale; no staged fake client deliverable. (C) candid hands performing a real, safely documented process only with explicit participant permission and accurate credit. Capture neutral practical light or plausible mixed teal/amber accents without misrepresenting the studio. Ensure image rights and names are approved; photograph any labels privately if needed, but avoid exposing personal data in public image. Record who shot, date, equipment shown, permissions.

**Deployment:** NO GENERATION: actual shoot and consent.
**Question / reader CTA:** What's one capability you'd like to be able to reach without owning a machine?
**Social alt draft:** Real Studio 43 image description must be written after seeing the approved photograph, not imagined now.

### 04 — A Digital Lab Is Not a Room Full of Equipment
**State:** PUBLISHED
**Post proposition:** A new machine is easy to announce. Lasting access is difficult to maintain.
**Article hero:** KEEP existing original September cover.

**DG-04 — CODE-BUILT FIVE-SLIDE PDF / 4:5**
> Design five 4:5 editable vector pages, physically rooted in equipment and maintenance, with readable high-contrast type. Slide 1: "A DIGITAL LAB IS NOT A ROOM FULL OF EQUIPMENT" with small line art of a printer/VR headset. Slide 2: "Acquisition is visible" with one machine outline above a thin receipt-like blank rectangle; NO numbers. Slide 3: "Access is operated" with five linked real labels: TRAINING, STAFF TIME, MATERIALS, MAINTENANCE, DOCUMENTATION. Slide 4: "When one person leaves" with broken continuity handoff, arrows indicating knowledge/documentation loss (a risk, not a claim about a particular museum). Slide 5: "Access should survive the announcement" with one strong question: "Who maintains the lab after launch?" and article source URL. Diagram arrows and all text composed in React SVG/HTML/CSS and rendered as PDF; do not have image model paint words.

**Deployment:** Code-authored document carousel; existing hero serves website and link unfurl.
**Question / reader CTA:** Who maintains access after the announcement?
**Social alt draft:** Five-slide illustrated framework explaining why equipment access requires training, maintenance and durable institutional knowledge.

### 05 — The Artist Doesn't Need to Learn Everything
**State:** PUBLISHED
**Post proposition:** Sometimes a project needs access to a skill, not another tutorial.
**Article hero:** KEEP original September cover.

**DG-05 — CODE-BUILT FOUR-SLIDE PDF / 4:5**
> Make 4 portrait, editable vector slides with a recognizable unfinished project symbol (realistic outline/blank prototype; no identifiable real artist). Slide 1: "THE ARTIST DOESN'T NEED TO LEARN EVERYTHING." Slide 2: a clean four-way decision diagram around an ARTISTIC INTENTION node: LEARN IT, COLLABORATE, COMMISSION, PROTOTYPE. Slide 3: "The artist retains the decision" with human agency clearly distinguished from technician's process expertise; two equal nodes communicating rather than hierarchy. Slide 4: "Expertise is infrastructure" with fair labor and consent as two explicit conditions and question "What expertise would move your work forward?" Use real type in source-controlled SVG, DCC editorial neutral/teal/amber, ample 4:5 mobile legibility; no generic brain/glowing AI.

**Deployment:** Code-authored editorial framework; not AI image generation.
**Question / reader CTA:** What skill did another person bring that changed your project?
**Social alt draft:** Artist-centered four-option decision diagram showing when to learn, collaborate, commission or prototype.

### 06 — What Does It Cost to Run Digital Culture?
**State:** PUBLISHED
**Post proposition:** The software invoice is visible. Technical dependency rarely is.
**Article hero:** H-06 — NEW HERO / 16:9 / P0

**Copy-ready HERO generation prompt:**
> A striking conceptual editorial still life, photographed slightly from above, of a large perfectly polished dark institutional display plinth standing on a dense handmade support structure. On the pristine top: only three anonymous blank software-product boxes and a compact unbranded computer, arranged with false simplicity. Beneath the plinth, completely visible through an open cross-section: dozens of materially believable human-scale support elements—filing binders without text, labeled-but-blank cable loops, replaceable modules, spare screws, a backup drive, a tool roll, and a single ordinary key on a hook—holding the presentation upright. This is an allegory of the invisible maintenance, decision-making and knowledge required to operate cultural technology, NOT a specific budget claim. Dramatic architectural side lighting, almost-black petrol-blue, a restrained cool teal line revealing the hidden layers, small warm amber light on the key, clean powerful silhouette, no people, receipts with invented figures, branding, pseudo letters, server farm or glass skyscraper. Real 16:9 landscape source, at least 1920x1080 detail.

**Hero alt draft:** A polished technology display sits above an exposed structure of tools, cables, documentation and spare parts.

**DG-06 — CODE-BUILT FIVE-SLIDE PDF / 4:5**
> An institutional accountability diagram, five slides, no invented costs. 1: Headline "WHAT DOES IT COST TO RUN DIGITAL CULTURE?" with only one strong visual. 2: "What an invoice shows" — licensing, equipment, service; qualitative labels only. 3: "What operations require" — knowledge, staff time, maintenance, data care, continuity. 4: "Who owns the decision?" — four separate agency stages: CHOOSE, IMPLEMENT, OPERATE, CHANGE; dotted governance line and owner column left blank intentionally. 5: "Buying technology is not the same as owning its consequences" + one question for cultural leadership and exact article link. Use editorial type, spare teal line structure, amber signal for unowned responsibility. 4:5 1080x1350 SVG/HTML authored in code; real legible text.

**Deployment:** Primary post should use native 5-slide PDF; hero covers website and OG.
**Question / reader CTA:** Which technical decision should stay inside cultural leadership?
**Social alt draft:** Five-page system framework separating visible software expenses from the capacity required to operate them.

### 07 — When Public Art Becomes Infrastructure
**State:** PUBLISHED
**Post proposition:** The artwork stays installed. Who still has its password?
**Article hero:** H-07 — NEW HERO / 16:9 / P0

**Copy-ready HERO generation prompt:**
> Conceptual artistic cutaway of a single unidentified interactive light sculpture installed in an ambiguous civic courtyard at night. The sculpture is modestly beautiful and plausible: a softly illuminated layered translucent architectural column casting controlled teal reflections, with one restrained orange status light. The ground beneath the sculpture opens as a precise dollhouse-like technical section revealing real conduits, power connection, network cabling, a sealed service hatch, a replaceable computer, a binder with blank cover and an accessible maintenance panel. The visual surprise is that the cultural artwork has become a small operational public system. Cinematic editorial image with disciplined engineering plausibility, dramatic contrast, dignified civic context, 16:9 horizontal and 1920x1080 genuine detail. Deliberately fictional concept, NOT an actual public artwork or named city installation, no Miami landmark, no false city seals, no real artist appropriation, no readable text or made-up specs.

**Hero alt draft:** Imagined interactive public artwork shown as a cutaway revealing its hidden power, network and maintenance components.

**DG-07 — CODE-BUILT FIVE-SLIDE PDF / 4:5**
> Five editable infographic slides that read as a technical rider for digital public art (not legal advice). 1: "THE ARTWORK IS INSTALLED. WHO MAINTAINS IT?" 2: "A work with software has an operating life" with small lifecycle timeline: COMMISSION → INSTALL → OPERATE → MAINTAIN → MIGRATE / RETIRE. 3: service stack with six real labels: POWER, HARDWARE, SOFTWARE, CREDENTIALS, NETWORK, DOCUMENTATION. 4: ownership questions: "Who holds the keys?", "Who pays recurring costs?", "What happens when the vendor disappears?" Avoid invented municipal requirements or time claims. 5: ask "What should every digital-art commission include?" with linked journal URL. Strong 4:5 vector hierarchy, all labels in real text and source control, teal cross-section lines, amber maintenance accents.

**Deployment:** Primary LinkedIn document = 5-page civic technical rider; hero = conceptual cutaway.
**Question / reader CTA:** What must every public digital-art commission provide for its future maintainers?
**Social alt draft:** Public artwork lifecycle diagram showing commissioning, installation, operations, maintenance and retirement.

### 08 — You Can't Buy Digital Culture
**State:** PUBLISHED
**Post proposition:** Five subscriptions. No shared community memory.
**Article hero:** H-08 — REPLACE CROPPED COVER / 16:9 / P1

**Copy-ready HERO generation prompt:**
> A spare, surreal art-gallery-quality editorial still life in a dark anonymous workroom: an absurdly tall sculptural pile of exactly five anonymous unmarked black-and-cardboard consumer technology boxes, stacked like an unstable institutional monument. Every box has a neatly routed wire attached, yet all wires dangle and terminate in tiny disconnected plugs. In front, sharply focused and much smaller, an irregular translucent hand-built sculptural fragment rests on a simple unfinished plaster square, with delicate evidence of making. The purchased stack casts an immense shadow while the handmade object has the most convincing presence. Strong visual contradiction, almost architectural, not a miscellaneous messy desk scene; restrained deep petrol-black setting, cold cyan slashes of side lighting, a tiny warm amber reflection on the unfinished material. 16:9 wide, at least 1920x1080 independently created detail, clean negative space, no imaginary company brands, labels, UI panels, fake invoices, logos, humans or cyberpunk.

**Hero alt draft:** Five blank boxes wired to nothing tower over a small handmade sculpture.

**S-08 — ORIGINAL 4:5 CONCEPT / P1**
> A simple theatrical portrait-format editorial image, centered on the giant visual gap between a neat vertical column of five anonymous sealed software-service boxes and a small handmade object resting beside the column, separated by an empty dark strip. The boxes form a monolithic stack with disconnected cable tails while the handmade object emits the only warm reflected color. One bold silhouette and severe geometry, material contrast and negative space at top for a later separately typeset headline "YOU CAN'T BUY DIGITAL CULTURE"; the generation itself must have no words. Dark petrol/teal ambient, warm orange sparingly, no people, no computer dashboards, no fake labels. Independent 4:5 portrait at 1080x1350 native detail, not a crop from the 16:9 cover.

**Deployment:** Native 4:5 art plus separate LinkedIn caption; no need for document PDF.
**Question / reader CTA:** Which part of a real community is impossible to buy as a feature?
**Social alt draft:** A tower of anonymous purchased devices stands disconnected from a handmade art object.

### 09 — Capacity Exists Before Infrastructure Does
**State:** DRAFT — do not publish until editorial approval
**Post proposition:** An idle machine is not the same as an available service.
**Article hero:** H-09 — REPLACE CROPPED DRAFT COVER / 16:9 / P1

**Copy-ready HERO generation prompt:**
> An exacting, sculptural editorial illustration of a failed handoff, NOT another printer on a desk. Suspended over a narrow gap between two different well-used industrial work surfaces is a translucent unfinished modular 3D-printed object made of two halves. Both halves have clean mating joints but cannot yet connect because a small visibly missing connector sits alone on a separate neutral pedestal below, unclaimed. On the left: only an inspection caliper. On the right: only a material sample and a pair of protective gloves. Meaning: tools may exist while agreement, availability, responsibility and handoff remain unresolved. Bold simple physical metaphor, readable immediately, low camera angle and slight asymmetry, deep blue-black floor, cool cyan edge reflections, single restrained amber accent on the isolated connector. Photographically plausible materials and gravity, no imaginary jobs/receipts, no text, no machine-brand logos, no printer cage, no real operator, 16:9 standalone composition with genuine 1920x1080 detail.

**Hero alt draft:** Two halves of an unfinished manufactured object cannot connect across a gap because a small joining component is missing.

**S-09 — ORIGINAL 4:5 CONCEPT / CONDITIONAL**
> Minimal portrait editorial concept of two physically plausible machined/3D-printed translucent components held apart across a narrow vertical gap, with an empty labeled-free receiving tray below and a single missing joining piece lying alone at the bottom. The shape suggests an available object that cannot yet be committed into a finished assembly. An operator's hand is intentionally absent. Almost-black teal-blue field, hard crisp cyan rim lighting, one orange highlight on the missing joining piece, negative space across upper fifth for code-added phrase "AVAILABILITY IS NOT CAPACITY". NO generated letters or numbers. 4:5 independent frame, 1080x1350 genuine source, no fabrication machines, fake job evidence or people.

**Deployment:** Hold until essay is published and operator/CTA boundaries reviewed.
**Question / reader CTA:** What condition makes a fabrication handoff dependable?
**Social alt draft:** An unfinished object remains separated into two halves while its connector waits unused.

### 10 — An Invitation to Build DCC Miami With Us
**State:** DRAFT — do not publish until join CTA verified
**Post proposition:** Come with a question, not a résumé.
**Article hero:** KEEP temporary conceptual hero until it can be compared with real documentary photography; no new website hero necessary at first.

**S-10 — ORIGINAL 4:5 CONCEPT / CONDITIONAL**
> Contemplative, inviting vertical editorial frame set in a believable small artist-run studio with a real sense of material scale: one plain unoccupied work chair pulled back from a modest shared table, a single intriguing unfinished translucent sculptural fragment, a blank sheet of paper and a simple pencil. Other chairs and machines are present only as soft abstract shadows near an open doorway; suggestion of room for another person without showing invented participants. The open chair is the clear focal shape, not the 3D printer or lamp. Warm human-scale amber light falls into the otherwise petrol-blue and teal space, authentic imperfections, slightly off-center photographic composition, upper 15% negative space reserved for separately typeset text. No generated title, no fabricated DCC community gathering, no logo, no real studio claim. Original 4:5 portrait at 1080x1350.

**Deployment:** Hold until public invitation article and tested join/DM route; real permissioned group/workshop photo may supersede concept art.
**Question / reader CTA:** What are you trying to make, or curious to learn?
**Social alt draft:** An unoccupied studio chair faces an unfinished object and an open doorway.

## 4. Optional support visuals and stopping rule

**IN-09 — The Quote Is an Agreement (optional replacement):** Source-controlled vector two-column explainer, not a fake invoice. Inquire → establish scope → name operator and compensation → verify material and deadline → agree revision/failure terms → close out. The purpose is to make the decision structure visible, not to imply a client has actually signed or paid. Real typeset labels. Use only if article is published and visual conveys more than the paragraphs.

**IN-10 — The Unfinished Contribution (optional):** Reuse a permissioned real work-in-progress photo, if one genuinely exists and the creator approves. Otherwise omit: the current generated still adds little information beyond the open-chair hero.

**Audio thumbnail (optional across publication):** DO NOT create a new portrait/logo for each audio. Reuse the article hero and a code-rendered audio play control, transcript link and explicit recording credit. Author voice, not invented interview or podcast guest.

**OG preview:** Use existing approved article hero for link cards and inspect it through LinkedIn Post Inspector. If OG crop is illegible, derive a separate composited card with source title and safe image. Never change article canonical URLs solely to boost engagement.

**Three documentary photographs for Studio 43:** broad honest room view, one real in-progress fabrication detail, optional approved interaction. Save author/credit/date/consent; do not treat AI as image evidence. No user-supplied image yet.

**Generation order / stop conditions:**
1. H-06 Cost, H-07 Public Art (missing currently on published essays).
2. H-08 You Can't Buy, H-09 Capacity (effective-resolution repair; Capacity stays draft).
3. DG-02, DG-04, DG-05, DG-06, DG-07 (editable diagram sources and PDF render, not image-gen).
4. S-08 social-native portrait; optional LI-01 if Link preview insufficient.
5. Documentary Studio 43 shoot when possible.
6. S-09 and S-10 only after draft publication, real CTA route and human editorial approval.

A batch should stop at **one strong candidate per asset** unless it fails: (a) legibility at 320px, (b) factual provenance, (c) native resolution/contrast, (d) distinctive thesis/metaphor, (e) correct article mood. Two revisions max by default before taking the decision back to editorial review. Publishing text/recruiting paid work should not wait for optional decorative images.

## 5. Cloudinary and GitHub implementation rules

- Cloudinary target for NEW revisions: dccmiami/journal/2026-10/v2/ for new original master images; dccmiami/journal/social/2026-10/ for independently composed social outputs; do not overwrite or delete v1.
- Use descriptive stable IDs such as what-does-it-cost-to-run-digital-culture-hero-v1, when-public-art-becomes-infrastructure-hero-v1, you-cant-buy-digital-culture-hero-v2, capacity-exists-before-infrastructure-does-hero-v2.
- A successful generation is not an uploaded asset. A successful upload is not a site release. Verify Cloudinary returned secure URL + asset/public ID + dimensions before any GitHub registry edit.
- Website source of truth: lib/dcc/culture/editorial.ts heroImage, heroImageAlt, heroImageCaption and MDX image slots. New images wired by a small reviewable PR only after visual approval.
- Store: article ID, image role, original source dimensions and effective detail, public ID, secure URL, provenance, creator/permission, alt/caption, crop/safe area, generated versus documentary, QA result.
- For social: captions and readable headings belong to code-driven compositing, not AI-generated letterforms. Export poster and PDF from source-controlled templates; avoid Canva as a prerequisite.
- Never mark draft articles published, configure payments, promise charitable deductibility or send posts as an image-production side effect.

## 6. Human approval sheet (same for every image)

- [ ] Does the image explain THIS essay, or could it fit any DCC article?
- [ ] Is the subject understandable at a 320-pixel card width?
- [ ] Is the source genuinely sharp at target crop rather than an enlarged contact-sheet tile?
- [ ] Does the image look like DCC visual culture without repeating the same orange desk lamp?
- [ ] Any false photography, named partner, actual public artwork, specific client object, or participant implied?
- [ ] Correct alt, caption, credit, permission, social 4:5 crop, site 16:9 and Open Graph preview?
- [ ] Does the proposed post lead to ONE real working response path and remain appropriate for the user's professional/career positioning?
- [ ] Explicit editorial approval to upload/change production media?

**No images are generated or uploaded by this prompt document.**
