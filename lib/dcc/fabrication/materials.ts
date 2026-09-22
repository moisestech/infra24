import type { Material } from '@/lib/dcc/fabrication/schema'
import { PRICE_REFERENCE_DISCLAIMER } from '@/lib/dcc/fabrication/schema'

export const FABRICATION_MATERIALS: Material[] = [
  {
    id: 'resin-high-clear-anycubic',
    manufacturer: 'Anycubic',
    productName: 'High Clear Resin',
    materialType: 'SLA photopolymer',
    color: 'Clear',
    translucency:
      'High-transparency resin marketed for lampshade and lighting applications — product language, not a DCC guarantee.',
    bottleSize: '1 kg',
    currentPrice: 42.47,
    currency: 'USD',
    supplierName: 'Anycubic',
    productUrl: 'https://store.anycubic.com/products/high-clear-resin',
    priceCheckedAt: '2026-09-21',
    printerCompatibility: ['anycubic-photon-mono-m7-max'],
    supplyModeDefault: 'client_supplied',
    pendingConfirmation: true,
    active: true,
  },
  {
    id: 'resin-translucent-pending',
    manufacturer: 'TBD',
    productName: 'Translucent resin — pending approval',
    materialType: 'SLA photopolymer',
    color: 'Translucent',
    translucency: 'To be confirmed after resin approval',
    printerCompatibility: ['anycubic-photon-mono-m7-max'],
    supplyModeDefault: 'client_supplied',
    pendingConfirmation: true,
    active: false,
  },
]

export function getMaterial(id: string): Material | undefined {
  return FABRICATION_MATERIALS.find((m) => m.id === id)
}

export function materialPriceLabel(material: Material): string {
  if (
    material.currentPrice == null ||
    !Number.isFinite(material.currentPrice) ||
    !material.priceCheckedAt
  ) {
    return 'Reference price pending confirmation'
  }
  const size = material.bottleSize ? ` / ${material.bottleSize}` : ''
  return `$${material.currentPrice.toFixed(2)} ${material.currency}${size}`
}

export { PRICE_REFERENCE_DISCLAIMER }
