import type { ThreeDCurriculumWorkshop } from '@/lib/dcc/education/3d-curriculum/types'
import { THREE_D_SCHOOL_PATH } from '@/lib/dcc/education/3d-curriculum/types'

export function curriculumWorkshopPath(slug: string): string {
  return `${THREE_D_SCHOOL_PATH}/${slug}`
}

export function curriculumSessionPath(workshopSlug: string, sessionSlug: string): string {
  return `${curriculumWorkshopPath(workshopSlug)}/${sessionSlug}`
}

const FROM_FILE: ThreeDCurriculumWorkshop = {
  id: 'from-file-to-physical-object',
  slug: 'from-file-to-physical-object',
  title: 'From File to Physical Object',
  subtitle: 'How 3D objects actually work',
  order: 1,
  status: 'pilot',
  level: 'intro',
  mentalModel: 'literacy',
  mentalModelLabel: '3D literacy',
  software: ['Slicer (Bambu Studio or equivalent)'],
  duration: '90 minutes–2 hours',
  formatNote: 'One session. No previous 3D experience required.',
  prerequisites: [],
  outcomes: [
    'Tell a mesh from a solid, and know which file formats carry which kind of geometry.',
    'Inspect a file for scale, watertightness, wall thickness, and overhangs before it hits a printer.',
    'Move an existing object through inspection, preparation, slicing, and a physical print.',
    'Recognize why a beautiful digital model can still fail as a physical object.',
  ],
  topics: [
    'Mesh vs solid',
    'STL, OBJ, STEP, 3MF',
    'Scale and dimensions',
    'Watertight geometry',
    'Normals',
    'Wall thickness',
    'Tolerances',
    'Overhangs and supports',
    'Orientation',
    'FDM vs resin',
    'Slicing',
  ],
  applications: [
    'Remixing a downloaded object',
    'Checking an AI-generated mesh',
    'First print in the studio',
    'Talking to a fabricator about a file',
  ],
  pipeline: [
    { label: 'File', sessionSlug: 'how-digital-objects-become-physical' },
    { label: 'Inspect', sessionSlug: 'how-digital-objects-become-physical' },
    { label: 'Prepare', sessionSlug: 'how-digital-objects-become-physical' },
    { label: 'Slice', sessionSlug: 'how-digital-objects-become-physical' },
    { label: 'Print', sessionSlug: 'how-digital-objects-become-physical' },
  ],
  projectPrompt:
    'Take an existing object or file through inspection, preparation, slicing, and a physical print.',
  whatYouMake:
    'A prepared and sliced print of an existing object — not a model you designed from scratch.',
  skillNext: [
    'Choose a modeling direction: mesh, solid CAD, or precision surfaces.',
    'Bring a broken file into Fix My 3D File.',
    'Hand a usable file to DCC Fabricate My File if you do not want to print it yourself.',
  ],
  equipment: ['FDM printer', 'Resin printer (process comparison)', 'Calipers'],
  softwareRequirements: ['Slicer installed or available in the studio'],
  participantFiles: ['A small starter object', 'A short printability checklist'],
  curriculumSessions: [
    {
      slug: 'how-digital-objects-become-physical',
      title: 'How digital objects become physical',
      body: 'Mesh vs solid, common formats, scale, watertight geometry, wall thickness, overhangs, supports, FDM vs resin, and why a file can look finished and still fail on the machine.',
    },
  ],
  relatedWorkshopIds: [
    'from-print-to-finished-object',
    'blender-for-artists',
    'plasticity-for-artists',
    'fix-my-3d-file',
  ],
  relatedServiceIds: ['FABRICATE_MY_FILE'],
  relatedExistingPages: [
    {
      href: '/workshop/3d-printing-for-artists',
      label: '3D Printing for Artists — print, clean, finish',
    },
    { href: '/workshop/resin-printing', label: 'Resin SLA syllabus' },
  ],
  heroAssetId: '3D-FOUNDATION-HERO-001',
  galleryAssetIds: [
    '3D-FOUNDATION-FORMATS-001',
    '3D-FOUNDATION-PRINTABILITY-001',
  ],
  diagramAssetIds: ['3D-PIPELINE-001'],
  interestSlug: 'from-file-to-physical-object',
  colorTokenId: 'teal',
}

const FROM_PRINT: ThreeDCurriculumWorkshop = {
  id: 'from-print-to-finished-object',
  slug: 'from-print-to-finished-object',
  title: 'From Print to Finished Object',
  subtitle: 'Finishing, Surface & Material Craft',
  order: 2,
  status: 'in-development',
  level: 'foundation',
  mentalModel: 'surface',
  mentalModelLabel: 'Surface / material craft',
  software: [],
  duration: 'Pilot format in validation',
  formatNote:
    'The final duration is being validated through physical pilot work, including a DCC Surface Study and Gianni Case 001. This page does not promise a timed public class yet.',
  prerequisites: [
    'From File to Physical Object, or equivalent 3D-printing literacy. Recommended, not a hard gate.',
  ],
  outcomes: [
    'Diagnose print artifacts and decide accept, remove, add, or reprint.',
    'Use files, abrasives, and filler without erasing intended form or detail.',
    'Use primer and raking light as an inspection loop, rather than assuming paint hides poor preparation.',
    'Translate a digital visual intention into physical surface decisions: matte, satin, gloss, color separation, and hierarchy.',
    'Build a finish plan for a personal printed object.',
  ],
  topics: [
    'Defect diagnosis',
    'Support and nub cleanup',
    'Files and abrasive selection',
    'Convex vs planar sanding',
    'Edge and detail preservation',
    'Localized filling and seam repair',
    'Primer inspection',
    'Raking light',
    'Localized correction',
    'Masking and basic paint control',
    'Matte, satin, and gloss',
    'Material hierarchy',
    'Upstream print decisions',
    'Finish planning',
  ],
  applications: [
    'A personal print that still looks like a print',
    'Choosing whether a defect should stay, go, be filled, or be reprinted',
    'Studio objects where the printed part is not yet the finished object',
  ],
  pipeline: [
    { label: 'See', sessionSlug: 'see-the-surface' },
    { label: 'Decide', sessionSlug: 'accept-remove-add-reprint' },
    { label: 'Remove', sessionSlug: 'remove-with-control' },
    { label: 'Add', sessionSlug: 'add-and-repair' },
    { label: 'Reveal', sessionSlug: 'primer-tells-the-truth' },
    { label: 'Correct', sessionSlug: 'correct-locally' },
    { label: 'Translate', sessionSlug: 'translate-material-intent' },
    { label: 'Resolve', sessionSlug: 'resolve-and-present' },
  ],
  projectPrompt:
    'Diagnose a printed surface, choose accept, remove, add, or reprint, and write a finish plan you can reuse.',
  whatYouMake:
    'A materially improved printed object plus a finish plan you can apply to future prints. Foundation practice begins on a controlled DCC surface study before transferring decisions to a personal object.',
  skillNext: [
    'Carry the same accept, remove, add, or reprint decision to the next print.',
    'Place seams and supports with less finishing in mind.',
    'Hand a file to DCC fabrication if you do not want to finish the object yourself.',
  ],
  equipment: [
    'A printed practice form — the DCC Surface Study is still being validated',
    'Files and abrasives',
    'Filler for recessed seams',
    'An inspection coat and raking light',
    'Paint for a material decision',
  ],
  softwareRequirements: ['No modeling software — this is a bench workshop'],
  participantFiles: [
    'A finish plan for a personal object',
    'Surface Study model not included yet',
  ],
  curriculumSessions: [
    {
      slug: 'see-the-surface',
      title: 'See the surface',
      body: 'Look at a raw print before changing it. Name the artifact, where it sits, and whether it is raised, recessed, or a decision that belongs back in the print.',
    },
    {
      slug: 'accept-remove-add-reprint',
      title: 'Accept, remove, add, reprint',
      body: 'Every defect gets one of four decisions. Leaving a mark alone is a decision. Reprinting is sometimes the smaller intervention.',
    },
    {
      slug: 'remove-with-control',
      title: 'Remove with control',
      body: 'Files and abrasives take down what is raised. The work is to keep the curve, the edge, and the detail you meant to keep.',
    },
    {
      slug: 'add-and-repair',
      title: 'Add and repair',
      body: 'Filler belongs in a recess or a seam, in a controlled amount. Adding material everywhere hides the form you were trying to resolve.',
    },
    {
      slug: 'primer-tells-the-truth',
      title: 'Primer tells the truth',
      body: 'An even inspection coat and raking light show what ordinary light and a final color can conceal. Primer here is a way of seeing, not a promise that paint will fix the surface.',
    },
    {
      slug: 'correct-locally',
      title: 'Correct locally',
      body: 'After inspection, return only to the spots that still fail. The correction stays local so the rest of the form is not sanded away.',
    },
    {
      slug: 'translate-material-intent',
      title: 'Translate material intent',
      body: 'Matte, satin, gloss, color separation, and hierarchy are physical decisions. They have to match what the object was meant to feel like, not only how the render looked.',
    },
    {
      slug: 'resolve-and-present',
      title: 'Resolve and present',
      body: 'A resolved object is one you can stand behind: the surface decisions are finished enough to show, and you can say what you accepted, removed, added, or would reprint.',
    },
    {
      slug: 'finish-plan-for-your-object',
      title: 'Finish plan for your object',
      body: 'Move from the controlled practice form to a personal print. Write the operations that object actually needs. This is not a timed module yet, and it does not assume a finished case study.',
    },
  ],
  relatedWorkshopIds: [
    'from-file-to-physical-object',
    'fix-my-3d-file',
    'blender-for-artists',
    'plasticity-for-artists',
  ],
  relatedServiceIds: ['PREPARE_PLUS_FABRICATE'],
  relatedExistingPages: [
    {
      href: '/workshop/3d-printing-for-artists',
      label: '3D Printing for Artists — print, clean, finish',
    },
  ],
  heroAssetId: '3D-FINISH-HERO-001',
  galleryAssetIds: [
    '3D-FINISH-SAND-001',
    '3D-FINISH-FILL-001',
    '3D-FINISH-MATERIAL-001',
    '3D-FINISH-FINAL-001',
  ],
  diagramAssetIds: ['3D-FINISH-RAKING-001', '3D-FINISH-INSPECT-001'],
  interestSlug: 'from-print-to-finished-object',
  colorTokenId: 'orange',
}

const BLENDER: ThreeDCurriculumWorkshop = {
  id: 'blender-for-artists',
  slug: 'blender-for-artists',
  title: 'Blender for Artists',
  subtitle: 'Make a sculpture. Make it printable.',
  order: 3,
  status: 'pilot',
  level: 'foundation',
  mentalModel: 'mesh',
  mentalModelLabel: 'Mesh / organic',
  software: ['Blender'],
  duration: '4 × 2-hour sessions, or 1 intensive day',
  sessions: 4,
  formatNote:
    'The same curriculum can run as four evening sessions or one intensive. Dates are not listed until a session is scheduled.',
  prerequisites: ['From File to Physical Object, or equivalent print literacy'],
  outcomes: [
    'Navigate 3D space in Blender without needing the whole program.',
    'Build and transform geometry from primitives through Edit Mode and modifiers.',
    'Sculpt, boolean, and clean a mesh until it can be exported for fabrication.',
    'Export a printable file and slice it.',
  ],
  topics: [
    'Primitives',
    'Edit Mode',
    'Modifiers',
    'Sculpting',
    'Boolean operations',
    'Mesh cleanup',
    'Export',
    'Slice',
    'Print',
  ],
  applications: [
    'Sculpture',
    'AI mesh cleanup',
    'Digital assemblage',
    'Basic characters and forms',
    'Scans',
    'Experimental objects',
    '3D printing',
  ],
  pipeline: [
    { label: 'Primitive', sessionSlug: 'building-and-transforming-geometry' },
    { label: 'Mesh', sessionSlug: 'building-and-transforming-geometry' },
    { label: 'Modify', sessionSlug: 'modifiers-booleans-and-sculptural-mutations' },
    { label: 'Sculpt', sessionSlug: 'modifiers-booleans-and-sculptural-mutations' },
    { label: 'Repair', sessionSlug: 'preparing-an-object-for-physical-fabrication' },
    { label: 'Export', sessionSlug: 'preparing-an-object-for-physical-fabrication' },
    { label: 'Print', sessionSlug: 'preparing-an-object-for-physical-fabrication' },
  ],
  projectPrompt:
    'Make a small sculptural object, modify it, repair it, and print it.',
  whatYouMake:
    'A small sculptural object that started as primitive geometry and left as a printable mesh.',
  skillNext: [
    'AI mesh cleanup and digital assemblage',
    'Sculpture and experimental objects',
    'Scanning and further mesh work',
    'Rendering and animation if that is where the work goes',
    '3D printing through DCC or your own machine',
  ],
  equipment: ['Computer with Blender', 'FDM or resin printer'],
  softwareRequirements: ['Blender (free, open source)'],
  participantFiles: ['Starter .blend', 'Export checklist'],
  curriculumSessions: [
    {
      slug: 'navigating-3d-space',
      title: 'Navigating 3D space',
      body: 'Move, orbit, scale. Learn enough of the viewport to stop fighting the camera.',
    },
    {
      slug: 'building-and-transforming-geometry',
      title: 'Building and transforming geometry',
      body: 'Primitives, Edit Mode, and the first decisions that make a form, not a default cube.',
    },
    {
      slug: 'modifiers-booleans-and-sculptural-mutations',
      title: 'Modifiers, booleans, and sculptural mutations',
      body: 'Change the object without starting over. Boolean cuts, modifiers, and sculpting as artistic tools.',
    },
    {
      slug: 'preparing-an-object-for-physical-fabrication',
      title: 'Preparing an object for physical fabrication',
      body: 'Cleanup, export, slice, print. The same exit ramp as every other DCC 3D path.',
    },
  ],
  relatedWorkshopIds: [
    'from-file-to-physical-object',
    'fix-my-3d-file',
    'plasticity-for-artists',
  ],
  relatedServiceIds: ['PREPARE_PLUS_FABRICATE'],
  relatedExistingPages: [
    {
      href: '/workshop/ai-3d-physical-object',
      label: 'AI → 3D Physical Object',
    },
    {
      href: '/workshop/3d-printing-for-artists',
      label: '3D Printing for Artists',
    },
  ],
  heroAssetId: '3D-BLENDER-HERO-001',
  galleryAssetIds: ['3D-BLENDER-OBJECT-001'],
  diagramAssetIds: ['3D-BLENDER-STAGES-001'],
  interestSlug: 'blender-for-artists',
  colorTokenId: 'cyan',
}

const PLASTICITY: ThreeDCurriculumWorkshop = {
  id: 'plasticity-for-artists',
  slug: 'plasticity-for-artists',
  title: 'Plasticity for Artists',
  subtitle: 'CAD Without the CAD Headache',
  order: 4,
  status: 'pilot',
  level: 'intermediate',
  mentalModel: 'solid',
  mentalModelLabel: 'Solid / direct CAD',
  software: ['Plasticity'],
  duration: 'One intensive, or a short series',
  formatNote:
    'Foundation-to-intermediate. Useful when an object needs to be strange and precise at the same time.',
  prerequisites: ['From File to Physical Object, or equivalent print literacy'],
  outcomes: [
    'Model with solids and surfaces using direct editing rather than a long feature history.',
    'Cut, join, fillet, chamfer, shell, and dimension an object you can fabricate.',
    'Export STEP or mesh for slicing — and know when to pass the object through Blender.',
    'Design something useful for the studio and print it.',
  ],
  topics: [
    'Solids',
    'Surfaces',
    'Booleans',
    'Fillets and chamfers',
    'Direct editing',
    'Dimensions',
    'Holes',
    'Shelling',
    'Object thickness',
    'STEP workflows',
    'Export for fabrication',
  ],
  applications: [
    'Hard-surface objects',
    'Product-like forms',
    'Enclosures',
    'Brackets',
    'Smooth surfaces',
    'Functional sculpture',
    'Studio accessories',
  ],
  pipeline: [
    { label: 'Idea', sessionSlug: 'direct-cad-without-the-engineering-stack' },
    { label: 'Primitive', sessionSlug: 'direct-cad-without-the-engineering-stack' },
    { label: 'Solid', sessionSlug: 'cuts-joins-and-fillets' },
    { label: 'Boolean', sessionSlug: 'cuts-joins-and-fillets' },
    { label: 'Detail', sessionSlug: 'cuts-joins-and-fillets' },
    { label: 'Export', sessionSlug: 'export-interoperability-print' },
    { label: 'Slice', sessionSlug: 'export-interoperability-print' },
    { label: 'Print', sessionSlug: 'export-interoperability-print' },
  ],
  projectPrompt:
    'Design something useful for the studio: a phone stand, bracket, enclosure, lamp component, pedestal connector, tool holder, or a strange functional sculpture.',
  whatYouMake:
    'A functional studio object with exact dimensions, holes, joints, and fillets — printed.',
  skillNext: [
    'Fabrication-ready enclosures and brackets',
    'Product-like forms and functional sculpture',
    'Plasticity → Blender for texture, render, or sculptural mutation',
    'Prototyping objects DCC can later fabricate for someone else',
  ],
  equipment: ['Computer with Plasticity', 'FDM or resin printer'],
  softwareRequirements: ['Plasticity'],
  softwareHref: 'https://www.plasticity.xyz/',
  participantFiles: ['Starter solid', 'STEP export notes'],
  curriculumSessions: [
    {
      slug: 'direct-cad-without-the-engineering-stack',
      title: 'Direct CAD without the engineering stack',
      body: 'Solids, surfaces, and the difference between this workflow and mesh modeling in Blender.',
    },
    {
      slug: 'cuts-joins-and-fillets',
      title: 'Cuts, joins, and fillets',
      body: 'Booleans, holes, shelling, and the details that make an object feel made rather than defaulted.',
    },
    {
      slug: 'export-interoperability-print',
      title: 'Export, interoperability, print',
      body: 'STEP and mesh export. Optional pass through Blender. Slicer. Physical object.',
    },
  ],
  relatedWorkshopIds: [
    'from-file-to-physical-object',
    'blender-for-artists',
    'rhino-for-artists',
  ],
  relatedServiceIds: ['PREPARE_PLUS_FABRICATE'],
  relatedExistingPages: [
    {
      href: '/fabricate/services/prepare-and-fabricate',
      label: 'Prepare + Fabricate',
    },
  ],
  heroAssetId: '3D-PLASTICITY-HERO-001',
  galleryAssetIds: ['3D-PLASTICITY-STUDIO-OBJECTS-001'],
  diagramAssetIds: [
    '3D-PLASTICITY-BOOLEAN-001',
    '3D-PLASTICITY-BRIDGE-001',
  ],
  interestSlug: 'plasticity-for-artists',
  colorTokenId: 'indigo',
}

const RHINO: ThreeDCurriculumWorkshop = {
  id: 'rhino-for-artists',
  slug: 'rhino-for-artists',
  title: 'Rhino for Artists & Fabricators',
  subtitle: 'Precision modeling for artists',
  order: 5,
  status: 'coming',
  level: 'intermediate',
  mentalModel: 'nurbs',
  mentalModelLabel: 'Precision / NURBS',
  software: ['Rhino'],
  duration: 'To be set with the instructor',
  formatNote:
    'This workshop enters when DCC can name someone who uses Rhino professionally, and show what they make with it. Instructor is not listed yet.',
  prerequisites: ['From File to Physical Object'],
  outcomes: [
    'Work with curves, surfaces, and dimensionally sensitive geometry.',
    'Build jewelry-scale or architectural-scale forms that can be fabricated.',
    'Understand where Rhino sits relative to mesh modeling and direct CAD.',
  ],
  topics: [
    'Curves',
    'NURBS surfaces',
    'SubD',
    'Precision dimensions',
    'Fabrication tolerances',
    'Mesh repair in a precision workflow',
  ],
  applications: [
    'Jewelry',
    'Architectural forms',
    'Complex surfaces',
    'Product forms',
    'Precision fabrication',
  ],
  pipeline: [
    { label: 'Curves' },
    { label: 'Surfaces' },
    { label: 'Precision' },
    { label: 'Fabrication' },
  ],
  projectPrompt:
    'A precision object or jewelry-scale component — dimensional control, complex curvature, manufacturable geometry.',
  whatYouMake:
    'A precision object or jewelry component, not a generic software exercise.',
  skillNext: [
    'Jewelry and wearables',
    'Architecture and complex surfaces',
    'Grasshopper / computational fabrication',
    'Professional production workflows',
  ],
  equipment: ['Computer with Rhino', 'FDM or resin printer'],
  softwareRequirements: ['Rhino'],
  participantFiles: ['Curve-to-surface starter file'],
  relatedWorkshopIds: [
    'from-file-to-physical-object',
    'grasshopper-computational-objects',
    'plasticity-for-artists',
  ],
  relatedServiceIds: ['PREPARE_PLUS_FABRICATE'],
  relatedExistingPages: [
    {
      href: '/fabricate/services/prepare-and-fabricate',
      label: 'Prepare + Fabricate',
    },
  ],
  heroAssetId: '3D-RHINO-HERO-001',
  galleryAssetIds: ['3D-RHINO-JEWELRY-001'],
  diagramAssetIds: [],
  interestSlug: 'rhino-for-artists',
  colorTokenId: 'violet',
}

const FIX_FILE: ThreeDCurriculumWorkshop = {
  id: 'fix-my-3d-file',
  slug: 'fix-my-3d-file',
  title: 'Fix My 3D File',
  subtitle: 'I already have a model. How do I make it printable?',
  order: 6,
  status: 'coming',
  level: 'foundation',
  mentalModel: 'repair',
  mentalModelLabel: 'Mesh validation / repair',
  software: ['Blender', 'Plasticity', 'Rhino'],
  duration: 'One clinic-style session',
  formatNote:
    'Bring a file: AI mesh, Thingiverse download, scan, Blender model, STL, OBJ, STEP, Meshy export, or something someone emailed you. Software is a tool inside the class, not the subject.',
  prerequisites: ['From File to Physical Object helps, but is not required if you already have a file'],
  outcomes: [
    'Diagnose why a file will not print: open geometry, non-manifold surfaces, thin walls, scale, intersections, orientation, polygon count.',
    'Repair enough of the object to slice it — or know when the honest next step is a DCC preparation service.',
    'Leave with a clearer file and a clearer sense of what skilled preparation is worth.',
  ],
  topics: [
    'Broken topology',
    'Open geometry',
    'Non-manifold surfaces',
    'Wrong scale',
    'Thin walls',
    'Intersecting geometry',
    'Bad orientation',
    'Excessive polygons',
    'Unsupported features',
  ],
  applications: [
    'AI-generated meshes',
    'Downloaded STLs',
    'Scans',
    'Someone else’s model',
    'Prepare + Fabricate handoff',
  ],
  pipeline: [
    { label: 'Arrive with a file' },
    { label: 'Diagnose' },
    { label: 'Repair' },
    { label: 'Validate' },
    { label: 'Slice' },
  ],
  projectPrompt:
    'Can we make this thing manufacturable?',
  whatYouMake:
    'A repaired, printable version of a file you already had — or a clear diagnosis of what still blocks fabrication.',
  skillNext: [
    'Print the repaired file yourself',
    'Ask DCC to prepare and fabricate it',
    'Return to Blender, Plasticity, or Rhino with a sharper eye for manufacturable geometry',
  ],
  equipment: ['Computer', 'FDM or resin printer for tests'],
  softwareRequirements: ['Whatever opened the file — Blender, Plasticity, or Rhino as needed'],
  participantFiles: ['Your incoming file', 'Diagnosis notes'],
  relatedWorkshopIds: [
    'from-file-to-physical-object',
    'from-print-to-finished-object',
    'blender-for-artists',
    'plasticity-for-artists',
  ],
  relatedServiceIds: ['PREPARE_PLUS_FABRICATE', 'FABRICATE_MY_FILE'],
  relatedExistingPages: [
    {
      href: '/fabricate/services/prepare-and-fabricate',
      label: 'Prepare + Fabricate',
    },
    {
      href: '/fabricate/services/fabricate-my-file',
      label: 'Fabricate My File',
    },
  ],
  heroAssetId: '3D-FIX-HERO-001',
  galleryAssetIds: [],
  diagramAssetIds: ['3D-FIX-DIAGNOSIS-001'],
  interestSlug: 'fix-my-3d-file',
  colorTokenId: 'rose',
}

const GRASSHOPPER: ThreeDCurriculumWorkshop = {
  id: 'grasshopper-computational-objects',
  slug: 'grasshopper-computational-objects',
  title: 'Grasshopper / Computational Objects',
  subtitle: 'Rules, systems, and editions',
  order: 7,
  status: 'in-development',
  level: 'advanced',
  mentalModel: 'systems',
  mentalModelLabel: 'Rules / systems / parameters',
  software: ['Grasshopper', 'Rhino'],
  duration: 'Advanced series — not scheduled',
  formatNote: 'Future / advanced. Builds on Rhino, not a first 3D class.',
  prerequisites: ['Rhino for Artists & Fabricators'],
  outcomes: [
    'Describe a form as a set of rules rather than a single modeled object.',
    'Generate families, patterns, and editions that can be fabricated.',
  ],
  topics: [
    'Parameters',
    'Repetition',
    'Variation',
    'Computational form',
    'Systems',
    'Editions',
    'Installations',
    'Fabrication',
  ],
  applications: [
    'Generative structures',
    'Patterns',
    'Installations',
    'Editions',
  ],
  pipeline: [
    { label: 'Rule' },
    { label: 'System' },
    { label: 'Family of forms' },
    { label: 'Fabrication' },
  ],
  whatYouMake:
    'A rule-driven family of forms, not a one-off mesh.',
  skillNext: [
    'Computational fabrication',
    'Installations and editions',
    'Advanced surface systems',
  ],
  equipment: ['Computer with Rhino + Grasshopper'],
  softwareRequirements: ['Rhino', 'Grasshopper'],
  participantFiles: ['Starter definition (when the course exists)'],
  relatedWorkshopIds: ['rhino-for-artists'],
  relatedServiceIds: [],
  relatedExistingPages: [],
  heroAssetId: '3D-GRASSHOPPER-HERO-001',
  galleryAssetIds: [],
  diagramAssetIds: [],
  interestSlug: 'grasshopper-computational-objects',
  colorTokenId: 'emerald',
}

const PARAMETRIC: ThreeDCurriculumWorkshop = {
  id: 'parametric-cad-functional-objects',
  slug: 'parametric-cad-functional-objects',
  title: 'Parametric CAD for Functional Objects',
  subtitle: 'Constraints, dimensions, assemblies',
  order: 8,
  status: 'in-development',
  level: 'advanced',
  mentalModel: 'constraints',
  mentalModelLabel: 'Mechanical / constraint-based',
  software: [],
  duration: 'Future — software not locked',
  formatNote:
    'Tool is configurable. Fusion is a candidate, not a confirmed DCC standard.',
  prerequisites: ['From File to Physical Object'],
  outcomes: [
    'Build mechanical parts, fixtures, and assemblies from dimensions and constraints.',
    'Prototype functional replacements and studio infrastructure, not only sculptural objects.',
  ],
  topics: [
    'Dimensions',
    'Constraints',
    'Tolerances',
    'Assemblies',
    'Mechanical objects',
    'Replacement parts',
    'Fixtures',
    'Functional prototyping',
  ],
  applications: [
    'Mechanical components',
    'Brackets and fixtures',
    'Assemblies',
    'Replacement parts',
  ],
  pipeline: [
    { label: 'Constraint' },
    { label: 'Dimension' },
    { label: 'Assemble' },
    { label: 'Fabricate' },
  ],
  whatYouMake:
    'A functional object whose geometry is driven by dimensions and constraints.',
  skillNext: [
    'Studio fixtures and brackets',
    'Replacement parts',
    'Engineering-adjacent fabrication',
  ],
  equipment: ['Computer with the selected parametric CAD tool'],
  softwareRequirements: ['Parametric CAD (tool TBD)'],
  participantFiles: ['Dimensioned starter part (when the course exists)'],
  relatedWorkshopIds: [
    'plasticity-for-artists',
    'from-file-to-physical-object',
  ],
  relatedServiceIds: [],
  relatedExistingPages: [],
  heroAssetId: '3D-PARAMETRIC-HERO-001',
  galleryAssetIds: [],
  diagramAssetIds: [],
  interestSlug: 'parametric-cad-functional-objects',
  colorTokenId: 'amber',
}

export const THREE_D_CURRICULUM_WORKSHOPS: ThreeDCurriculumWorkshop[] = [
  FROM_FILE,
  FROM_PRINT,
  BLENDER,
  PLASTICITY,
  RHINO,
  FIX_FILE,
  GRASSHOPPER,
  PARAMETRIC,
]

export function listCurriculumWorkshops(): ThreeDCurriculumWorkshop[] {
  return [...THREE_D_CURRICULUM_WORKSHOPS].sort((a, b) => a.order - b.order)
}

export function listPilotWorkshops(): ThreeDCurriculumWorkshop[] {
  return listCurriculumWorkshops().filter((workshop) => workshop.status === 'pilot')
}

export function listUpcomingCurriculumWorkshops(): ThreeDCurriculumWorkshop[] {
  return listCurriculumWorkshops().filter((workshop) => workshop.status !== 'pilot')
}

export function getCurriculumWorkshopBySlug(
  slug: string
): ThreeDCurriculumWorkshop | undefined {
  return THREE_D_CURRICULUM_WORKSHOPS.find((workshop) => workshop.slug === slug)
}

export function getCurriculumWorkshopById(
  id: string
): ThreeDCurriculumWorkshop | undefined {
  return THREE_D_CURRICULUM_WORKSHOPS.find((workshop) => workshop.id === id)
}

export function listCurriculumWorkshopSlugs(): string[] {
  return listCurriculumWorkshops().map((workshop) => workshop.slug)
}

export function getCurriculumSession(
  workshopSlug: string,
  sessionSlug: string
): { workshop: ThreeDCurriculumWorkshop; sessionIndex: number } | undefined {
  const workshop = getCurriculumWorkshopBySlug(workshopSlug)
  const sessionIndex = workshop?.curriculumSessions?.findIndex(
    (session) => session.slug === sessionSlug
  )
  if (!workshop || sessionIndex === undefined || sessionIndex < 0) return undefined
  return { workshop, sessionIndex }
}

export function listCurriculumSessionParams(): { slug: string; session: string }[] {
  return THREE_D_CURRICULUM_WORKSHOPS.flatMap((workshop) =>
    (workshop.curriculumSessions ?? []).map((session) => ({
      slug: workshop.slug,
      session: session.slug,
    }))
  )
}
