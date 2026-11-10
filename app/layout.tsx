import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { WhatsAppButton } from '@/components/whatsapp-button'

export const metadata: Metadata = {
  title: {
    default: 'Hati | Get Your Credit Score',
    template: '%s | Hati',
  },
  description:
    'Get a clearer view of your credit profile with Hati and follow practical steps toward your next financial milestone.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#F4F2E8',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="light">
      <body className="antialiased">
        {children}
        <WhatsAppButton />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
