import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'InvoiceAI - Intelligent Invoice Data Extraction',
  description: 'Automate invoice processing with AI-powered OCR technology. Extract data from receipts in seconds.',
  keywords: ['invoice', 'OCR', 'data extraction', 'AI', 'GST', 'automation'],
  authors: [{ name: 'InvoiceAI Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#3b82f6',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://invoiceai.app',
    title: 'InvoiceAI - Intelligent Invoice Data Extraction',
    description: 'Automate invoice processing with AI-powered OCR technology',
    siteName: 'InvoiceAI',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>
        {children}
      </body>
    </html>
  )
}
