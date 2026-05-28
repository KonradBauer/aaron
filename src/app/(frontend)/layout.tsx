import type { Metadata } from 'next'
import React from 'react'

import Footer from '@/components/Footer'
import Header from '@/components/Header'
import './styles.css'

export const metadata: Metadata = {
  title: {
    default: 'Aaron Dom Pogrzebowy',
    template: '%s | Aaron Dom Pogrzebowy',
  },
  description:
    'Profesjonalny dom pogrzebowy Aaron - kompleksowa organizacja pogrzebów, sala pożegnań, usługi 24h. Dwie lokalizacje.',
  keywords: ['dom pogrzebowy', 'pogrzeb', 'usługi pogrzebowe', 'Aaron'],
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    siteName: 'Aaron Dom Pogrzebowy',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
