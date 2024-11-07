import "#/styles/globals.css";
import { AddressBar } from "#/ui/address-bar";
import Byline from "#/ui/byline";
import { GlobalNav } from "#/ui/global-nav";
import { Metadata } from "next";

// TODO - Jen
export const metadata: Metadata = {
  title: {
    default: "Next.js App Router",
    template: "%s | Next.js App Router",
  },
  metadataBase: new URL("https://app-router.vercel.app"),
  description:
    "A playground to explore new Next.js App Router features such as nested layouts, instant loading states, streaming, and component level data fetching.",
  openGraph: {
    title: "Next.js App Router Playground",
    description:
      "A playground to explore new Next.js App Router features such as nested layouts, instant loading states, streaming, and component level data fetching.",
    images: [`/api/og?title=Next.js App Router`],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="[color-scheme:light]">
      <body className="overflow-y-scroll bg-gray-50">
        {/* <GlobalNav />

        <div className="lg:pl-72">
          <div className="mx-auto max-w-4xl space-y-8 px-2 pt-20 lg:px-8 lg:py-8">
            <div className="rounded-lg bg-vc-border-gradient p-px shadow-lg shadow-black/20">
              <div className="rounded-lg bg-black">
                <AddressBar />
              </div>
            </div> */}

        <div className="rounded-lg border border-gray-200 shadow-md">
          <div className="rounded-lg bg-white p-3.5 lg:p-6 text-gray-900">
            {children}
          </div>
        </div>
        {/* <Byline /> */}
        {/* </div>
        </div>  */}
      </body>
    </html>
  );
}
