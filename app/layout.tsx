import { Metadata } from 'next'
import '@/app/globals.css'

// TODO - Jen
export const metadata: Metadata = {
  title: {
    default: 'Campus Carpool',
    template: '%s | Campus Carpool',
  },
  metadataBase: new URL('https://campuscarpool.vercel.app'),
  description:
    'The easiest way for university students to share rides and save money. Find or offer rides to split costs and reduce your carbon footprint.',
  openGraph: {
    title: 'Campus Carpool - Student Ridesharing Made Simple',
    description:
      'The easiest way for university students to share rides and save money. Find or offer rides to split costs and reduce your carbon footprint.',
    images: [`/api/og?title=Campus Carpool`],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Campus Carpool - Student Ridesharing Made Simple',
    description:
      'The easiest way for university students to share rides and save money.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
