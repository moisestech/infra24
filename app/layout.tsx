import { Metadata } from 'next';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://bacfl.org'),
  title: {
    default: 'Bakehouse Art Complex',
    template: '%s | Bakehouse Art Complex'
  },
  description: 'A non-profit arts organization in Miami fostering creativity and collaboration for nearly four decades. Home to over 100 resident artists, offering affordable studios, exhibitions, and community programs.',
  keywords: [
    'art complex',
    'artist residency',
    'miami art',
    'art studios',
    'art exhibitions',
    'artist community',
    'south florida arts',
    'art deco bakery',
    'miami culture',
    'visual arts',
    'art workshops'
  ],
  authors: [{ name: 'Bakehouse Art Complex' }],
  creator: 'Bakehouse Art Complex',
  publisher: 'Bakehouse Art Complex',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://bacfl.org',
    siteName: 'Bakehouse Art Complex',
    title: 'Bakehouse Art Complex',
    description: 'A vibrant artist community in the heart of Miami, fostering creativity and collaboration since 1985.',
    images: [
      {
        url: '/og-image.jpg', // You'll need to create this image
        width: 1200,
        height: 630,
        alt: 'Bakehouse Art Complex - Miami\'s Creative Hub'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bakehouse Art Complex',
    description: 'Miami\'s premier artist residency and creative community space.',
    creator: '@BakehouseArt',
    images: ['/twitter-image.jpg'], // You'll need to create this image
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/apple-touch-icon-precomposed.png',
    },
  },
  manifest: '/site.webmanifest',
  other: {
    'msapplication-TileColor': '#ffffff',
    'theme-color': '#ffffff',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
