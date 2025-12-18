import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LinkFolio - The Only Link You Need',
  description: 'Transform your scattered digital presence into a cohesive, high-converting landing page.',
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
