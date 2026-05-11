import type { Metadata } from 'next';
import { HomeClient } from '@/components/home/HomeClient';
import { CATEGORIES } from '@/lib/data';

export const metadata: Metadata = {
  title: 'BesPoint — Illuminazione, Sicurezza, Bricolage, Giardinaggio ed Elettronica',
  description:
    'Acquista online i migliori prodotti per Illuminazione, Sicurezza, Bricolage, Giardinaggio ed Elettronica. Qualità garantita, spedizione veloce in tutta Italia.',
  openGraph: {
    title: 'BesPoint — Il tuo negozio online',
    description: 'Illuminazione, Sicurezza, Bricolage, Giardinaggio ed Elettronica. Scopri le offerte.',
    url: 'https://www.bespoint.it',
    images: [{ url: '/og-home.jpg', width: 1200, height: 630, alt: 'BesPoint Home' }],
  },
  alternates: {
    canonical: 'https://www.bespoint.it',
  },
};

export default function HomePage() {
  // Server component: renders instantly for SEO bots
  // The interactive client shell is loaded via HomeClient
  return (
    <>
      {/* Static SEO content pre-rendered for Google */}
      <noscript>
        <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
          <h1>BesPoint — Negozio Online</h1>
          <p>Illuminazione, Sicurezza, Bricolage, Giardinaggio ed Elettronica.</p>
          <ul>
            {CATEGORIES.filter((c) => c !== 'Tutti').map((cat) => (
              <li key={cat}>
                <a href={`/categoria/${cat.toLowerCase()}`}>{cat}</a>
              </li>
            ))}
          </ul>
        </div>
      </noscript>
      <HomeClient />
    </>
  );
}
