import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { TenantProvider } from '@/components/tenant/TenantProvider'
import { OrganizationFontProvider } from '@/components/organization/OrganizationFontProvider'
import { Toaster } from '@/components/ui/Toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Infra24 - Multi-tenant Cultural Infrastructure Platform',
  description: 'Infra24 is a comprehensive platform for cultural organizations to manage announcements, bookings, workshops, and community engagement.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider>
            <TenantProvider>
              <OrganizationFontProvider>
                {children}
                <Toaster />
              </OrganizationFontProvider>
            </TenantProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
