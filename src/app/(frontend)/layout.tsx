import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import React from 'react'

import LocalBusinessSchema from '@/components/LocalBusinessSchema'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { getSiteSettings, phoneHref } from '@/lib/site-settings'
import './styles.css'

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
})

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://twoja-domena.pl'),
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings()
  const phone = settings.phone ?? '+48 000 000 000'

  return (
    <html lang="pl" className={`${cormorantGaramond.variable} ${inter.variable}`}>
      <head>
        <LocalBusinessSchema />
      </head>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[200] focus:bg-black focus:text-cream focus:px-4 focus:py-2 focus:text-sm">
          Przejdź do treści
        </a>
        <Header phone={phone} phoneHref={phoneHref(phone)} />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
