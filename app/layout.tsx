import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BioFolio - The Only Link You Need',
  description: 'Transform your scattered digital presence into a cohesive, high-converting landing page.',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="overflow-x-hidden selection:bg-green-500/30 selection:text-green-200">
        {children}
      </body>
    </html>
  )
}
