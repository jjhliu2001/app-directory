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
    <html lang="en" className="[color-scheme:light] dark:[color-scheme:dark]">
      <body className="overflow-y-scroll bg-gray-50 pb-36 dark:bg-gray-900">
        <div className="lg:pl-72">
          <div className="mx-auto max-w-4xl space-y-8 px-2 pt-20 lg:px-8 lg:py-8">
            <div className="rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 p-px shadow-lg shadow-primary-500/20">
              <div className="rounded-lg bg-white p-3.5 dark:bg-gray-800 lg:p-6">
                {children}
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
