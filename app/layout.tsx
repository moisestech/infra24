import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@/components/ThemeProvider'
import { TenantProvider } from '@/components/tenant/TenantProvider'

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
    <ClerkProvider
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
    >
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TenantProvider>
              {children}
            </TenantProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
