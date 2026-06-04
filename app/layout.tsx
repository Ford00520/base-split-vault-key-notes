import type { Metadata } from 'next'
import './globals.css'
import '@/components/components.css'
import './page-layouts.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'base-split-vault-key-notes',
  description: 'A sealed key note vault for saving short notes and status proofs on Base.',
  applicationName: 'base-split-vault-key-notes',
  metadataBase: new URL('https://base-split-vault-key-notes.vercel.app'),
  openGraph: {
    title: 'base-split-vault-key-notes',
    description: 'A sealed key note vault for saving short notes and status proofs on Base.',
    url: 'https://base-split-vault-key-notes.vercel.app',
    siteName: 'base-split-vault-key-notes',
    type: 'website'
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="base:app_id" content="6a1fdcf94a7867dea5dcf4f6" />
        <meta
          name="talentapp:project_verification"
          content="c72e1997b2a5f7c751001aaf5fe9122349136a041df6c64c06cd757abb94722c9ac31eeb56c47c32b9d1df209346c1e29836d4403d9167139361adee2266fc4e"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
