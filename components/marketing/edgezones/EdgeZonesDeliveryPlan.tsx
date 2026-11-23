'use client'

import { useEdgeZonesLocale } from '@/components/marketing/edgezones/EdgeZonesLocaleProvider'

const content = {
  en: {
    title: 'What DCC brings — delivery status',
    intro: 'Explore the prototype, planned production and decisions requiring agreement. Status is evidence of work, not a contract or a guarantee of funding.',
    stages: [
      { title: 'Explore now', status: 'Built — preliminary', items: [
        ['Exhibition microsite', 'Responsive proposal with host credit, exhibition concept and gallery imagery.', '#overview'],
        ['Artist index prototype', 'Six initial profiles; final roster, works and image rights require artist approval.', '#artists'],
        ['Opt-in signup', 'An optional DCC membership/signup form exists; it is not the official exhibition RSVP or an Edge Zones mailing list.', '#join']
      ] },
      { title: 'Planned production', status: 'Materials / capacity pending', items: [
        ['Artist and work records', 'Approved images, biographies, artwork details, alt text and meaningful links.', '#artists'],
        ['Documentation archive', 'Credit installation photos, program notes and permissions; video or 360 is not guaranteed.', '#archive'],
        ['Publishing and outreach', 'Proposed editorial recap and DCC-channel amplification, using Charo-approved copy, images and credits, linking first to Edge Zones official exhibition information.', '#support']
      ] },
      { title: 'Joint approvals', status: 'Not yet confirmed', items: [
        ['Final checklist', 'Jordan and artists decide works and needs; Angelo coordinates local installation.', '#artists'],
        ['One proposed public program', 'Charo must approve presenters, date, access, staffing, equipment and costs before any program promotion.', '#programs'],
        ['Honorarium and costs', 'Clarify the $500 allocation and any external travel or production funding.', '#roles']
      ] }
    ],
    detail: 'Read details',
    foot: 'Keyboard-accessible native disclosure controls; no animation required. All program and cost decisions remain pending.'
  },
  es: {
    title: 'Qué aporta DCC — estado de entrega',
    intro: 'Explora el prototipo y lo que requiere aprobación de Edge Zones. El trabajo de DCC no es promoción oficial y no implica un acuerdo firmado.',
    stages: [
      { title: 'Explorar ahora', status: 'Versión inicial', items: [
        ['Micrositio de la exposición', 'Propuesta adaptable con crédito a la sede e imágenes de la galería.', '#overview'],
        ['Índice de artistas', 'Seis perfiles iniciales; nombres, obras y derechos de imagen requieren revisión.', '#artists'],
        ['Registro voluntario', 'Formulario opcional de membresía DCC, no una reserva oficial ni lista de correo de Edge Zones.', '#join']
      ] },
      { title: 'Producción prevista', status: 'Materiales pendientes', items: [
        ['Fichas de artistas y obras', 'Imágenes aprobadas, biografías, detalles técnicos, textos alternativos y enlaces.', '#artists'],
        ['Archivo documental', 'Fotografías con créditos y notas. Video y 360 no están garantizados.', '#archive'],
        ['Difusión editorial', 'Resumen y anuncios propuestos, con copia y créditos aprobados por Charo y enlaces a la información oficial de Edge Zones.', '#support']
      ] },
      { title: 'Aprobaciones conjuntas', status: 'Sin confirmar', items: [
        ['Lista definitiva', 'Jordan y artistas definen las obras; Angelo coordina la instalación.', '#artists'],
        ['Un programa público propuesto', 'Charo debe aprobar participantes, fecha, acceso, personal, equipo y costos antes de difundirlo.', '#programs'],
        ['Honorario y costos', 'Aclarar la asignación de $500 y gastos de viaje o producción.', '#roles']
      ] }
    ],
    detail: 'Ver detalles',
    foot: 'Controles accesibles por teclado, sin animación necesaria. Programas y costos siguen pendientes.'
  }
} as const

export function EdgeZonesDeliveryPlan() {
  const { locale } = useEdgeZonesLocale()
  const t = content[locale === 'es' ? 'es' : 'en']
  return <section id="deliverables" className="ez-section border-b border-[var(--ez-border)] bg-[var(--ez-paper)]" aria-labelledby="deliverables-heading">
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <p className="ez-module-number">DCC / DELIVERY EVIDENCE</p>
      <h2 id="deliverables-heading" className="ez-heading ez-section-title mt-2">{t.title}</h2>
      <p className="ez-body mt-4 max-w-3xl text-[var(--ez-body-fg)]">{t.intro}</p>
      <div className="mt-8 grid gap-4 lg:grid-cols-3">{t.stages.map((g, index) => <article key={g.title} className="ez-card p-5">
        <p className="ez-module-number">{String(index + 1).padStart(2, '0')} · {g.status}</p>
        <h3 className="ez-heading ez-subsection-title mt-3">{g.title}</h3>
        <div className="mt-5 space-y-3">{g.items.map(([label, detail, href]) => <details key={label} className="border border-[var(--ez-border)] bg-[var(--ez-paper)] p-3 open:border-[var(--ez-blue)]">
          <summary className="cursor-pointer font-semibold marker:text-[var(--ez-blue)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ez-blue)]">{label}</summary>
          <p className="ez-caption mt-3 text-[var(--ez-body-fg)]">{detail}</p>
          <a href={href} className="ez-caption mt-2 inline-block font-semibold text-[var(--ez-blue)] underline underline-offset-4 focus-visible:outline focus-visible:outline-2">{t.detail} →</a>
        </details>)}</div>
      </article>)}</div>
      <p className="ez-caption mt-6 max-w-4xl text-[var(--ez-muted)]">{t.foot}</p>
    </div>
  </section>
}
