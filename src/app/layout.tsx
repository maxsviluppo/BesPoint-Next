import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.bespoint.it"),
  title: {
    default: "BesPoint — Illuminazione, Sicurezza, Bricolage, Giardinaggio ed Elettronica",
    template: "%s | BesPoint",
  },
  description:
    "BesPoint è il tuo negozio online di fiducia per Illuminazione, Sicurezza, Bricolage, Giardinaggio ed Elettronica. Qualità, risparmio e spedizione veloce.",
  keywords: [
    "illuminazione LED",
    "sicurezza casa",
    "bricolage",
    "giardinaggio",
    "elettronica",
    "BesPoint",
    "negozio online",
    "antifurto",
    "smart home",
  ],
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: "https://www.bespoint.it",
    siteName: "BesPoint",
    title: "BesPoint — Illuminazione, Sicurezza, Bricolage, Giardinaggio ed Elettronica",
    description:
      "BesPoint è il tuo negozio online di fiducia. Scopri i migliori prodotti per la casa e il giardino.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "BesPoint Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BesPoint — Illuminazione, Sicurezza, Bricolage",
    description: "Il tuo negozio online di fiducia per la casa.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  verification: {
    // google: "INSERISCI_QUI_IL_TUO_CODICE_VERIFICA_GOOGLE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="it" suppressHydrationWarning>
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
      <body className="antialiased">{children}</body>
    </html>
  );
}
