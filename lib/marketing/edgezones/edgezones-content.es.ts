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
  metaTitle: 'Touching Grass en Edge Zones — Propuesta expositiva',
  hero: {
    eyebrow: 'Propuesta para Edge Zones · Sujeta a aprobación',
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
      'Edge Zones mantiene el control de su sede, identidad institucional y comunicaciones oficiales. Jordan Horton desarrolla la propuesta curatorial; Angelo Caruso coordina la logística local; DCC propone apoyo digital y programación pública para revisión de Charo Oquet. El acuerdo final aún está pendiente.',
    edgeZones: {
      title: 'Edge Zones',
      subtitle: 'Espacio anfitrión físico',
      intro:
        'Edge Zones es la sede institucional y aporta el espacio y una recepción de apertura, según los términos del 6 de noviembre. Otras actividades requieren aprobación.',
      items: [
        'Espacio anfitrión físico',
        'Recepción de apertura',
        'Gestión estándar de exposición',
        'Edge Zones controla su sitio web, redes sociales, identidad y aprobación de anuncios compartidos',
        'Honorario de $500 para la exposición; destino y aplicación a producción pendientes del acuerdo escrito',
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
        'DCC desarrolló un prototipo de micrositio y propone visibilidad para artistas, documentación, publicación y un programa público, sujetos a aprobación y recursos.',
      items: [
        'Página web de la exposición',
        'Índice de artistas',
        'Registro opcional a la red DCC, distinto de cualquier reserva o lista de correo de Edge Zones',
        'Estructura de documentación/archivo digital',
        'Apoyo de publicación digital',
        'Difusión en canales de DCC de anuncios aprobados por Edge Zones, con crédito principal para la sede',
        'Una propuesta de programa público para revisión de Edge Zones antes de confirmar fecha o promoción',
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
    paragraphStages: [
      {
        label: 'Salir de la pantalla',
        caption: 'Lentitud · cuidado · textura · experiencia vivida',
      },
      {
        label: 'Sistemas y cuerpos',
        caption: 'Percepción · tierra · vida social compartida',
      },
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
        'Explora el prototipo y las propuestas pendientes. Edge Zones revisará los créditos, anuncios y actividades antes de cualquier publicación oficial.',
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
        'DCC puede desarrollar una propuesta de conversación o demostración para revisión de Charo. No hay programa, acceso, personal ni canales de Edge Zones confirmados.',
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
        'Abre el folleto de trabajo. Créditos, promoción, artistas, costos y programas siguen sujetos a revisión del equipo y Edge Zones.',
      note: 'Este paquete de propuesta puede actualizarse a medida que se confirmen roles, entregables, fechas y materiales de artistas.',
    },
    join: {
      id: 'join',
      title: 'Conoce DCC Miami (opcional)',
      intro:
        'Este es un registro opcional a la red de DCC, no una reserva ni una suscripción oficial de Edge Zones. Sigue los canales de Edge Zones para anuncios oficiales.',
      formIntro:
        'El formulario permite unirse a la red de DCC; los correos de DCC requieren autorización aparte. No registra al público en Edge Zones.',
      signupHref:
        '/network/signup?source=edgezones&utm_source=edgezones&utm_medium=proposal&utm_campaign=dcc_edgezones_launch&utm_content=partnership_pdf&qr=dcc_edgezones_main',
      signupLabel: 'Conocer la membresía DCC',
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
      'Para aprobaciones de la sede e información oficial de la exposición, contacta a Edge Zones directamente. DCC responde por su contribución digital propuesta.',
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
    { id: 'deliverables', label: 'Entregables' },
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
