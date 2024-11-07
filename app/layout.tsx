import { Metadata } from 'next';
import ThemeToggle from '../components/ThemeToggle';
import '@/app/globals.css';

// TODO - Jen
export const metadata: Metadata = {
  title: {
    default: 'Next.js App Router',
    template: '%s | Next.js App Router',
  },
  metadataBase: new URL('https://app-router.vercel.app'),
  description:
    'A playground to explore new Next.js App Router features such as nested layouts, instant loading states, streaming, and component level data fetching.',
  openGraph: {
    title: 'Next.js App Router Playground',
    description:
      'A playground to explore new Next.js App Router features such as nested layouts, instant loading states, streaming, and component level data fetching.',
    images: [`/api/og?title=Next.js App Router`],
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="[color-scheme:light] dark:[color-scheme:dark]">
      <body className="overflow-y-scroll bg-gray-50 pb-36 dark:bg-gray-900">
        <div className="fixed right-4 top-4 z-50">
          <ThemeToggle />
        </div>
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
  );
}
