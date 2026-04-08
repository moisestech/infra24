/** Human-readable labels for workshops.category (DB); keep in sync with seed catalogs. */
export const WORKSHOP_CATEGORY_LABELS: Record<string, string> = {
  adult_studio_classes: 'Adult studio classes',
  web_portfolio_presence: 'Web & presence',
  digital_literacy: 'Digital literacy',
  creative_coding_net_art: 'Creative coding',
  ai_literacy: 'AI literacy',
  systems_archive: 'Systems & archive',
}

export function workshopCategoryLabel(category: string | undefined | null): string | null {
  if (!category) return null
  return WORKSHOP_CATEGORY_LABELS[category] ?? category.replace(/_/g, ' ')
}
