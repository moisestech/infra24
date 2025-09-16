// New Infra24 Navigation Structure
export const navigationItems = [
  {
    title: 'Products',
    href: '/product',
    children: [
      { title: 'SmartSign', href: '/product/smartsign' },
      { title: 'Submissions', href: '/product/submissions' },
      { title: 'Bookings', href: '/product/bookings' },
      { title: 'Analytics', href: '/product/analytics' }
    ]
  },
  {
    title: 'Organizations',
    href: '/organizations',
    children: [
      { title: 'Bakehouse Art Complex', href: '/o/bakehouse' },
      { title: 'Oolite Arts', href: '/o/oolite' },
      { title: 'Edge Zones', href: '/o/edgezones' },
      { title: 'Locust Projects', href: '/o/locust' }
    ]
  },
  {
    title: 'About',
    href: '/about'
  },
  {
    title: 'Contact',
    href: '/contact'
  }
];