import type { Metadata } from 'next'
import './globals.css'
import '@/components/components.css'
import './page-layouts.css'
import { Providers } from './providers'
import { BASE_APP_ID } from '@/lib/baseApp'

export const metadata: Metadata = {
  title: 'base-split-vault-key-notes',
  description: 'A sealed key note vault for saving short notes and status proofs on Base.',
  applicationName: 'base-split-vault-key-notes',
  metadataBase: new URL('https://key-notes-vault.vercel.app'),
  openGraph: {
    title: 'base-split-vault-key-notes',
    description: 'A sealed key note vault for saving short notes and status proofs on Base.',
    url: 'https://key-notes-vault.vercel.app',
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
        <meta name="base:app_id" content={BASE_APP_ID} />
        <meta
          name="talentapp:project_verification"
          content="16e344a8a12da84c7e0e464758623983773603f12b0c9b815ead6d08a05cb68f96a5c8716e147c6c9136bcea4a0eceea929271e40444a4591601ef894f00f413"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
