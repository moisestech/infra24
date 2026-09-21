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
  title: { default: 'Infra24', template: '%s | Infra24' },
  description:
    'Updateable public communication systems for nonprofits and cultural organizations—plus a multi-tenant platform for cultural orgs.',
}

const themeInitScript = `(function(){try{var stored=localStorage.getItem('theme');var theme=stored==='light'||stored==='dark'||stored==='system'?stored:'system';var resolved=theme==='system'?(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):theme;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);root.style.colorScheme=resolved;}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        </head>
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
