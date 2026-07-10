import { TOUCHING_GRASS_EXHIBITION } from '@/lib/marketing/edgezones-exhibition'
import { EDGE_ZONES_GALLERY_WEBSITE, JORDAN_HORTON_INSTAGRAM_URL, DCC_MIAMI_WEBSITE } from '@/lib/marketing/edgezones-network-index'
import type { EdgeZonesPortalContent, EdgeZonesSupportModule } from './types'

export const edgeZonesPortalEs: EdgeZonesPortalContent = {
  slug: 'edgezones',
  path: '/edgezones',
  creditLine:
    'Presentada en Edge Zones, curada por Jordan Horton, con plataforma digital y apoyo de programación pública de DCC Miami.',
  shortDescription:
    'Un marco de colaboración para el arte digital en Miami que conecta una exposición liderada por un curador con visibilidad de artistas, programación pública, documentación digital y un archivo en línea a largo plazo.',
  metaTitle: 'DCC Miami × Edge Zones — Touching Grass',
  hero: {
    eyebrow: 'DCC Miami × Edge Zones',
    title: 'Touching Grass',
    subtitle: 'Cultura digital, realidad física',
    intro: `Touching Grass es un concepto de exposición que explora la relación entre la cultura digital y la realidad encarnada, ecológica y material.

La exposición reúne a artistas cuyas prácticas examinan cómo las tecnologías digitales moldean la atención, el trabajo, la memoria, la ecología y la vida social — y cómo esos sistemas regresan a nuestros cuerpos, relaciones y entornos.`,
    statusChips: ['Espacio anfitrión', 'Curador', 'Plataforma digital'],
  },
  primaryCtas: [
    { label: 'Ver índice de artistas', href: '#artists' },
    { label: 'Ver qué aporta DCC', href: '#support' },
    { label: 'Descargar PDF de colaboración', href: '#pdf' },
    { label: 'Recibir actualizaciones', href: '#join' },
  ],
  rolesMatrix: {
    title: 'Cómo funciona la colaboración',
    intro:
      'Esta propuesta se estructura en torno a tres roles distintos: Edge Zones como espacio anfitrión físico, Jordan Horton como curador invitado, y DCC Miami como plataforma digital y capa de apoyo para programación pública.',
    edgeZones: {
      title: 'Edge Zones',
      subtitle: 'Espacio anfitrión físico',
      intro:
        'Edge Zones proporciona el espacio de exposición, la gestión estándar de la muestra y las recepciones de apertura y clausura.',
      items: [
        'Espacio anfitrión físico',
        'Recepción de apertura',
        'Recepción de clausura',
        'Gestión estándar de exposición',
        'Visibilidad en el sitio web y redes sociales existentes de Edge Zones',
        'Honorario curatorial de $500 bajo la estructura estándar de curador invitado de Edge Zones',
      ],
      accent: 'coral',
      href: EDGE_ZONES_GALLERY_WEBSITE,
      hrefLabel: 'edgezones.org',
    },
    jordanHorton: {
      title: 'Jordan Horton',
      subtitle: 'Visión curatorial',
      intro:
        'Jordan Horton lidera el marco curatorial de la exposición, incluyendo la selección de artistas, el desarrollo de la muestra y la coordinación de los materiales necesarios para montar y presentar el proyecto.',
      items: [
        'Selección de artistas',
        'Marco curatorial',
        'Comunicación con artistas',
        'Textos de sala y biografías de artistas',
        'Coordinación de checklist',
        'Coordinación de instalación y desmontaje',
        'Recopilación de materiales de artistas en formato listo para publicación',
      ],
      accent: 'indigo',
      href: JORDAN_HORTON_INSTAGRAM_URL,
      hrefLabel: 'horton.exe',
    },
    dccMiami: {
      title: 'DCC Miami',
      subtitle: 'Plataforma digital y apoyo de programación pública',
      intro:
        'DCC Miami extiende la vida e impacto de la exposición antes, durante y después de su apertura mediante infraestructura en línea, visibilidad de artistas, documentación, publicación y un programa o activación pública.',
      items: [
        'Página web de la exposición',
        'Índice de artistas',
        'Vía de registro para la audiencia',
        'Estructura de documentación/archivo digital',
        'Apoyo de publicación digital',
        'Promoción a través de los canales y la red de DCC',
        'Un programa, taller, conversación o activación pública vinculada a la exposición',
      ],
      accent: 'teal',
      href: DCC_MIAMI_WEBSITE,
      hrefLabel: 'dcc.miami',
    },
  },
  concept: {
    title: 'Touching Grass',
    subtitle: 'Cultura digital, realidad física',
    paragraphs: [
      'Touching Grass invita al público a salir de la pantalla y entrar en el espacio físico, hacia la lentitud, el cuidado, la textura y la experiencia vivida.',
      'La exposición pregunta cómo los sistemas digitales moldean la percepción y el comportamiento, y cómo el arte puede reconectar esos sistemas con el cuerpo, la tierra y las condiciones compartidas de la vida social.',
    ],
    themes: [
      {
        label: 'Atención',
        description: 'Cómo enfocamos, desplazamos, fragmentamos y dispersamos nuestro tiempo.',
        keywords: ['desplazamiento', 'enfoque', 'fragmento', 'feed', 'tiempo'],
      },
      {
        label: 'Extracción',
        description: 'Los datos, recursos y trabajo oculto detrás de los sistemas digitales.',
        keywords: ['datos', 'trabajo', 'extracción', 'plataformas', 'excedente'],
      },
      {
        label: 'Ecología',
        description: 'Las huellas ambientales de redes, dispositivos y plataformas.',
        keywords: ['carbono', 'dispositivos', 'redes', 'suelo', 'energía'],
      },
      {
        label: 'Cuidado',
        description: 'Cuerpos, relaciones y sistemas de apoyo.',
        keywords: ['cuerpos', 'apoyo', 'vínculos', 'reparación', 'cuidar'],
      },
      {
        label: 'Reconexión',
        description: 'Volver al lugar, la presencia y la realidad compartida.',
        keywords: ['lugar', 'presencia', 'compartida', 'tierra', 'volver'],
      },
      {
        label: 'Realidad encarnada',
        description: 'El mundo físico como terreno donde la cultura digital se convierte en experiencia vivida.',
        keywords: ['textura', 'contacto', 'físico', 'vivido', 'material'],
      },
    ],
    diagram: ['Cultura digital', 'Espacio físico', 'Realidad encarnada'],
  },
  artists: {
    title: 'Artistas participantes',
    intro:
      'El índice de artistas conecta el espacio anfitrión, el curador y los artistas participantes mediante perfiles públicos, enlaces, biografías, imágenes y futuros materiales en línea.',
  },
  sections: {
    support: {
      id: 'support',
      title: 'Qué aporta DCC',
      intro:
        'DCC proporciona la infraestructura digital que extiende la exposición antes, durante y después de su apertura.',
      modules: [
        {
          id: 'exhibition-webpage',
          number: '01',
          title: 'Página web de la exposición',
          description:
            'Un espacio dedicado para la exposición con texto curatorial, lista de artistas, fechas, ubicación, programas, enlaces y actualizaciones.',
          href: '#overview',
          status: 'live',
          icon: 'globe',
          accent: 'teal',
        },
        {
          id: 'artist-index',
          number: '02',
          title: 'Índice de artistas',
          description: 'Perfiles de artistas participantes con biografías, imágenes, declaraciones, enlaces y muestras de obra.',
          materialsNote: 'retratos de artistas, biografías, declaraciones, sitios web, enlaces de Instagram, imágenes de obras',
          href: '#artists',
          status: 'in-development',
          icon: 'users',
          accent: 'indigo',
        },
        {
          id: 'virtual-studio-visits',
          number: '03',
          title: 'Visitas virtuales al estudio',
          description:
            'Un marco para apoyar la investigación curatorial, conversaciones con artistas, notas e información técnica.',
          href: undefined,
          status: 'in-development',
          icon: 'video',
          accent: 'magenta',
        },
        {
          id: 'documentation-archive',
          number: '04',
          title: 'Archivo de documentación',
          description:
            'Una estructura para fotos, video, audio, textos, documentación de instalación y materiales de proceso que se preserven y compartan.',
          href: '#archive',
          status: 'coming-soon',
          icon: 'archive',
          accent: 'coral',
        },
        {
          id: 'audience-signup',
          number: '05',
          title: 'Vía de registro para la audiencia',
          description: 'Códigos QR, enlaces de RSVP, registro al boletín, formularios de artistas y recopilación de interés en talleres.',
          href: '#join',
          status: 'live',
          icon: 'mail',
          accent: 'teal',
        },
        {
          id: 'public-programs',
          number: '06',
          title: 'Programas públicos',
          description:
            'Charlas, conversaciones con artistas, talleres, proyecciones y eventos comunitarios vinculados al arte y la cultura digital.',
          href: '#programs',
          status: 'in-development',
          icon: 'calendar',
          accent: 'indigo',
        },
        {
          id: 'digital-publishing',
          number: '07',
          title: 'Publicación digital',
          description: 'Artículos, entrevistas y textos de exposición que contextualizan las obras y extienden su alcance en línea.',
          href: undefined,
          status: 'coming-soon',
          icon: 'bookOpen',
          accent: 'magenta',
        },
      ] satisfies EdgeZonesSupportModule[],
    },
    publicProgram: {
      id: 'programs',
      title: 'Programa público apoyado por DCC',
      intro:
        'DCC apoyará un programa público vinculado a la exposición durante la duración de la muestra. El formato final se confirmará con Edge Zones, Jordan Horton y los artistas participantes.',
      formats: [
        'Charla de artista',
        'Conversación sobre cultura digital',
        'Taller',
        'Activación pública',
        'Proyección de visita al estudio',
        'Recorrido por la exposición',
        'Evento de documentación o publicación',
      ],
      dateLabel: 'Fecha por confirmar',
      formatLabel: 'Formato por confirmar con Edge Zones, Jordan Horton y los artistas participantes',
      ctaHref: '#join',
      ctaLabel: 'Recibir actualizaciones',
    },
    archive: {
      id: 'archive',
      title: 'Archivo a largo plazo',
      intro:
        'DCC apoyará una estructura de documentación en línea para la exposición, de modo que el proyecto pueda seguir vivo más allá de la apertura.',
      deliverables: [
        'Fotos de instalación',
        'Enlaces de artistas',
        'Biografías y declaraciones de artistas',
        'Checklist de obras',
        'Texto curatorial',
        'Documentación de programas',
        'Documentación en video o audio, si está disponible',
        'Materiales de publicación digital',
        'Actualizaciones futuras de la exposición',
      ],
      status: 'Próximamente',
    },
    pdf: {
      id: 'pdf',
      title: 'PDF de colaboración',
      description:
        'Descargue o abra el folleto de propuesta DCC Miami × Edge Zones — marco de colaboración, concepto de exposición, modelo de apoyo de DCC, grupo de artistas e índice de red.',
      note: 'Este paquete de propuesta puede actualizarse a medida que se confirmen roles, entregables, fechas y materiales de artistas.',
    },
    join: {
      id: 'join',
      title: 'Únase a la lista de actualizaciones DCC × Edge Zones',
      intro:
        'Reciba actualizaciones sobre Touching Grass, el índice de artistas, el programa público, el archivo de documentación y la programación futura de DCC Miami.',
      formIntro:
        'Comparta su información de contacto para recibir actualizaciones y futuras oportunidades vinculadas a DCC Miami, Edge Zones y el ecosistema de arte digital de Miami.',
      signupHref:
        '/network/signup?source=edgezones&utm_source=edgezones&utm_medium=proposal&utm_campaign=dcc_edgezones_launch&utm_content=partnership_pdf&qr=dcc_edgezones_main',
      signupLabel: 'Recibir actualizaciones',
      suggestHref: '/network/signup?pathway=research&source=edgezones',
      suggestLabel: 'Sugerir a alguien para la vista de investigación',
    },
  },
  footer: {
    blurb:
      'DCC Miami es una nueva plataforma de cultura digital que apoya el arte digital en Miami mediante visibilidad de artistas, programación pública, publicación digital, documentación, talleres e infraestructura en línea.',
    credit: 'Presentada en Edge Zones. Curada por Jordan Horton. Plataforma digital y apoyo de programación pública por DCC Miami.',
  },
  exhibition: {
    workingTitle: TOUCHING_GRASS_EXHIBITION.workingTitle,
    curator: TOUCHING_GRASS_EXHIBITION.curator,
    location: TOUCHING_GRASS_EXHIBITION.location,
    dates: TOUCHING_GRASS_EXHIBITION.dates,
    artistNames: TOUCHING_GRASS_EXHIBITION.artistNames,
  },
  ui: {
    roleLabel: 'ROL',
    keyThemes: 'Temas clave',
    possibleFormats: 'Formatos posibles',
    programsBannerCaption: 'Programa público apoyado por DCC',
    archiveBannerCaption: 'Archivo de documentación',
    hostSpaceBadge: 'Espacio anfitrión',
    invitedCuratorBadge: 'Curador invitado',
    participatingArtistBadge: 'Artista participante',
    participatingArtistBadgeShort: 'Artista',
    workImageComingSoon: 'Imagen de obra próximamente',
    artistMaterialsPending: 'Materiales de artista pendientes',
    openResearchMap: 'Abrir mapa de investigación →',
    materialsNeededPrefix: 'Materiales necesarios:',
    partnershipContactTitle: 'Contacto de colaboración',
    partnershipContactBody:
      '¿Preguntas sobre la programación de Edge Zones o la exposición Touching Grass? Comuníquese con Charo Oquet (Edge Zones) a través del equipo de DCC.',
    emailDccTeam: 'Enviar correo al equipo de DCC',
    downloadPartnershipPdf: 'Descargar PDF de colaboración',
    openPdfNewTab: 'Abrir PDF en una nueva pestaña',
    bookletDescription:
      'El paquete completo de propuesta describe el marco de colaboración, el concepto de exposición, el modelo de apoyo de DCC, el grupo de artistas y el índice de red — formateado como un folleto imprimible.',
    bookletLabel: 'Paquete de propuesta de colaboración',
    bookletAriaLabel: 'Abrir PDF de colaboración DCC Miami × Edge Zones',
    instagram: 'Instagram',
    website: 'Sitio web',
    jumpTo: 'Ir a',
  },
  navAnchors: [
    { id: 'overview', label: 'Resumen' },
    { id: 'roles', label: 'Roles' },
    { id: 'concept', label: 'Concepto' },
    { id: 'artists', label: 'Artistas' },
    { id: 'support', label: 'Apoyo DCC' },
    { id: 'programs', label: 'Programas' },
    { id: 'archive', label: 'Archivo' },
    { id: 'pdf', label: 'PDF' },
    { id: 'join', label: 'Unirse' },
  ],
  moduleStatusLabels: {
    live: 'EN VIVO',
    'in-development': 'EN DESARROLLO',
    'materials-needed': 'MATERIALES NECESARIOS',
    'coming-soon': 'PRÓXIMAMENTE',
  },
}
