import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { StorefrontLauncher } from '@/components/storefront/StorefrontLauncher';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#ffd600",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.bespoint.it"),
  title: {
    default: "BesPoint — Store Online Illuminazione e Sicurezza",
    template: "%s | BesPoint",
  },
  description: "Il punto di riferimento per l'illuminazione LED e la sicurezza domestica in Italia.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  verification: {
    google: "process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION",
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="it" suppressHydrationWarning={true}>
      <head>
        {/* Google Analytics */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
        {/* Structured Data: Organization */}
        <Script id="org-schema" type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "BesPoint",
            url: "https://www.bespoint.it",
            logo: "https://www.bespoint.it/logo.png",
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+39-06-1234567",
              contactType: "customer service",
              areaServed: "IT",
              availableLanguage: "Italian",
            },
            sameAs: [
              "https://facebook.com/bespoint",
              "https://instagram.com/bespoint",
              "https://twitter.com/bespoint",
              "https://twitter.com/bespoint",
            ],
          })}
        </Script>
        {/* Structured Data: WebSite with SearchAction */}
        <Script id="website-schema" type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "BesPoint",
            url: "https://www.bespoint.it",
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: "https://www.bespoint.it/?cerca={search_term_string}",
              },
              "query-input": "required name=search_term_string",
            },
          })}
        </Script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <StorefrontLauncher>
          {children}
        </StorefrontLauncher>
      </body>
    </html>
  );
}
