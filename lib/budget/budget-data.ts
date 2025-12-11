// Budget data source: Oolite_Digital_Lab_Programming_2025-2026.xlsx - Lab Equipment V1 Ask.csv
// Location: /Users/moisessanabria/Documents/website/infra24/lib/budget/budget-data.ts

import { BudgetLineItem } from './budget-utils'

// Organization-specific budget configurations
export interface OrganizationBudgetConfig {
  totalBudget: number
  items: (Omit<BudgetLineItem, 'id' | 'date' | 'imageUrl'> & { date?: string })[]
  description?: string
}

// Oolite Digital Lab Budget - Updated to reflect actual purchased items
// Removed: Contingency, Room Build-Out items, some Compute items, and other unused items
export const OOLITE_BUDGET_CONFIG: OrganizationBudgetConfig = {
  totalBudget: 80000, // Keep $80k as total budget for planning purposes
  description: 'Digital Lab Equipment and Infrastructure',
  items: [
    // CSV items ($6,661)
    {
      name: 'Color-accurate reference monitor (27")',
      category: 'hardware-materials',
      amount: 1599,
      vendor: 'Link1',
      notes: 'Grading/proofing / VESA Mount compatible. Accurate Color Printing, Efficient Printing (Waste Less Ink)',
      date: '2025-11-10'
    },
    {
      name: 'Single Monitor Mount',
      category: 'hardware-materials',
      amount: 100,
      vendor: 'Link1',
      notes: 'Mounts Color Accurate Monitor',
      date: '2025-11-10'
    },
    {
      name: 'Meta Quest 3 headset',
      category: 'virtual-reality',
      amount: 500,
      vendor: 'Link1',
      notes: 'VR / XR demos. Metaverse Exhibitions of the Gallery, Mock-up future exhibitions, 3D Modeling, Immersive Cinema, Interactive Video Games',
      date: '2025-11-17'
    },
    {
      name: 'Meta Quest Charging Dock',
      category: 'virtual-reality',
      amount: 40,
      vendor: 'Link1',
      notes: 'Equipment Display. Magnetic, eliminating constant plugging and unplugging'
    },
    {
      name: 'Resin 3D Printer',
      category: '3d-printing',
      amount: 720,
      vendor: 'Link1',
      notes: 'High Quality Resin Printer with Exhaust for the Window',
      date: '2025-11-18'
    },
    {
      name: 'Resin Enclosure & Exhaust',
      category: '3d-printing',
      amount: 73,
      vendor: 'Link1',
      notes: 'Heat Controlled, Exhaust',
      date: '2025-11-18'
    },
    {
      name: 'Amaran 100x Light',
      category: 'hardware-materials',
      amount: 200,
      vendor: 'Link1',
      notes: 'Video Interview lighting equipment'
    },
    {
      name: 'Light Soft Box',
      category: 'hardware-materials',
      amount: 165,
      vendor: 'Link1',
      notes: 'Video Interview lighting equipment'
    },
    {
      name: 'C Stand Boom Arm Mobile',
      category: 'hardware-materials',
      amount: 134,
      vendor: 'Link1',
      notes: 'Video Interview lighting equipment'
    },
    {
      name: 'Verity IT - Cabling Service',
      category: 'hardware-materials',
      amount: 4941,
      vendor: 'Verity',
      notes: 'Cabling service for streaming infrastructure - December 2025',
      date: '2025-12-15'
    },
    {
      name: 'BenQ Laser Projector',
      category: 'hardware-materials',
      amount: 2500,
      vendor: 'Link1',
      notes: 'Exhibitions, Presentation (Qty: 2 @ $1,250 each)',
      date: '2025-11-12'
    },
    {
      name: '3D Printing Rack',
      category: '3d-printing',
      amount: 88,
      vendor: 'Link1',
      notes: 'Create space, rollable, can hold up to 2 3D Printers and PLA, Bamboo material. Professional Grade Storage Efficiency for 3d Printers',
      date: '2025-11-20'
    },
    {
      name: 'Lighting Strip',
      category: 'hardware-materials',
      amount: 120,
      vendor: 'Link1',
      notes: '60ft Ceiling + 60ft Floor (Per room) (Qty: 4 @ $30 each)',
      date: '2025-11-05'
    },
    {
      name: 'Metal Storage Organizer',
      category: 'furniture',
      amount: 40,
      vendor: 'Link1',
      notes: 'Hold small items, personal accessories'
    },
    {
      name: '2 Layer Metal Trolley Cart',
      category: 'furniture',
      amount: 143,
      vendor: 'Link1',
      notes: 'Hold VR Headset, Small Printer'
    },
    {
      name: 'Mobile Desktop Workstation',
      category: 'hardware-materials',
      amount: 239,
      vendor: 'Link1',
      notes: 'Space organization, flexibility. Height Adjustable Rolling Desk with Keyboard Tray, Storage Shelves & Locking Wheels'
    },
    // Additional items to reach $80k total (from original mock data)
    {
      name: 'Raspberry Pi 5 kits (8GB) bundles',
      category: 'hardware-materials',
      amount: 660,
      vendor: 'Raspberry Pi',
      notes: 'Cases, PSUs, SD cards, HDMI (Qty: 3)',
      date: '2025-11-16'
    },
    {
      name: 'Short-throw Laser portable projector (1080p/4K-ready)',
      category: 'hardware-materials',
      amount: 1600,
      vendor: 'Projector Supplier',
      notes: 'Workshops & pop-ups'
    },
    // Room Build-Out items
    {
      name: 'Digital Lab Paint Floor Space Renovation Contractors',
      category: 'hardware-materials',
      amount: 1200,
      vendor: 'Contractor',
      notes: 'Paint and floor space renovation work - 10 days @ $120/day. Spot paint walls & floor before Art Week Open Studios, clean/mop floor, re-install shelf higher, install additional row of shelves',
      date: '2025-11-15'
    },
    {
      name: 'Digital Lab Surface Touch-ups',
      category: 'hardware-materials',
      amount: 460,
      vendor: 'Denzel Grant',
      notes: 'LED Sign & Touch-Up - Labor (2 days/16 hours = $360) + Materials ($100 for 2 shelving systems from ACE). Clean/mop floor, paint walls and floors, install LED sign outside Digital Lab entrance with cable routing',
      date: '2025-11-25'
    },
    {
      name: 'Room Build-Out - Construction Materials & Supplies',
      category: 'hardware-materials',
      amount: 2249.87,
      vendor: 'Home Depot',
      notes: 'Complete construction materials order for Digital Lab, Cinematic, and Printshop room build-out. Includes: Floor paint (BEHR Premium Porch & Patio 5gal × 3 = $534, Black 5gal × 2 = $356), wall paint (Glidden Essentials 5gal × 3 = $315, White 1gal × 14 = $490), primers (Concrete Bonding Primer 1gal × 3 = $89.94, Multi-Surface Primer 5gal × 2 = $286), concrete mix (Quickrete 80lb × 15 bags = $90), patching materials (MAPEI Planipatch, Planipatch Plus), adhesive removers (Sentinel 747), painting supplies (rollers, brushes, trays, extension poles), window/metal supplies (sills, trim, caulk, rust remover, silicone), curtain rods and hardware, construction hardware (bolts, drill bits, adhesive), and cleaning supplies. Home Depot order total: $2,159.87 + Quickrete concrete mix: $90 = $2,249.87',
      date: '2025-11-01'
    },
    // Large Format Printer items
    {
      name: 'IPRSR Service Call Epson P-8000',
      category: 'hardware-materials',
      amount: 375,
      vendor: 'Image Pro International',
      notes: 'Error code 1561 - Service call for Epson P-8000 large format printer',
      date: '2025-11-06'
    },
    {
      name: 'Epson P-8000 Paper thickness sensor',
      category: 'hardware-materials',
      amount: 35,
      vendor: 'Image Pro International',
      notes: 'UParts replacement part for Epson P-8000',
      date: '2025-11-06'
    },
    {
      name: '1 Year Maintenance Agreement - Epson/Canon 17"-36"',
      category: 'hardware-materials',
      amount: 600,
      vendor: 'Image Pro International',
      notes: 'IPRS1736 - Labor only. Includes: 1 visit every 6 months, 20% discount on MSRP for parts, No labor charges for repair, Priority Service',
      date: '2025-11-06'
    },
    {
      name: 'Epson P-8000 Ink Cartridges (8 total)',
      category: 'hardware-materials',
      amount: 1120,
      vendor: 'Image Pro International',
      notes: 'Estimate 277694 - 8x UltraChrome HD ink cartridges (350ml each): T54X200 Cyan, T54X300 Vivid Magenta, T54X600 Vivid Light Magenta, T54X500 Light Cyan, T54X800 Matte Black, T54X100 Photo Black, T54X700 Light Black, T54X900 Light Light Black. $140 each = $1,120 total',
      date: '2025-11-14'
    },
    {
      name: 'Epson LLK Light Light Black Ink Bundle',
      category: 'hardware-materials',
      amount: 899,
      vendor: 'Amazon',
      notes: 'Epson T54X900 UltraChrome HD Light Light Black ink cartridge bundle. Purchased via Amazon account for large format printer',
      date: '2025-11-14'
    },
    {
      name: 'Rechargeable A1 Light Pad 35.4"x23.6", Extra Large LED Light Board for Diamond Painting, 3-Color Modes Light Box, Diamond Art Light Table, Lightbox for Tracing and Drawing, Sketching, Artists',
      category: 'large-format-printer',
      amount: 170,
      vendor: 'Amazon',
      notes: 'Light pad for large format printing and art work',
      date: '2025-11-22'
    }
  ]
}

// Bakehouse budget (example - can be updated with actual data)
export const BAKEHOUSE_BUDGET_CONFIG: OrganizationBudgetConfig = {
  totalBudget: 50000,
  description: 'Bakehouse Arts Budget',
  items: [
    {
      name: 'Example Item 1',
      category: 'hardware-materials',
      amount: 5000,
      vendor: 'Supplier',
      notes: 'Example budget item'
    }
    // Add more items as needed
  ]
}

// Default budget for other organizations
export const DEFAULT_BUDGET_CONFIG: OrganizationBudgetConfig = {
  totalBudget: 30000,
  description: 'Organization Budget',
  items: [
    {
      name: 'General Equipment',
      category: 'hardware-materials',
      amount: 30000,
      vendor: 'Various',
      notes: 'General organization expenses'
    }
  ]
}

// Get budget config for an organization
export function getBudgetConfig(orgSlug: string): OrganizationBudgetConfig {
  switch (orgSlug) {
    case 'oolite':
      return OOLITE_BUDGET_CONFIG
    case 'bakehouse':
      return BAKEHOUSE_BUDGET_CONFIG
    default:
      return DEFAULT_BUDGET_CONFIG
  }
}

// Legacy export for backward compatibility
export const DIGITAL_LAB_BUDGET_ITEMS = OOLITE_BUDGET_CONFIG.items
export const DIGITAL_LAB_TOTAL_BUDGET = OOLITE_BUDGET_CONFIG.totalBudget

// Total budget from CSV items only: $6,661
// Note: This is the sum of the first 14 CSV items
export const CSV_ONLY_TOTAL_BUDGET = 6661

// Map CSV categories to our budget category system
// Most items fall under Hardware & Materials
export const CSV_CATEGORY_MAP: Record<string, string> = {
  'Displays & Projection': 'hardware-materials',
  'Display Support': 'hardware-materials',
  'Peripherals & Creation': 'hardware-materials',
  'Creation': 'hardware-materials',
  'Documentation & Creation': 'hardware-materials',
  'Furniture': 'furniture',
  'Lighting': 'hardware-materials',
  'Charging, Accessory': 'hardware-materials',
  'Virtual and Augmented Reality': 'virtual-reality',
  '3D Printing': '3d-printing',
  'Large Format Printer': 'large-format-printer'
}

