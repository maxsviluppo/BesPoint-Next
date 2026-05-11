import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CategoryClient } from '@/components/category/CategoryClient';
import { CATEGORIES, slugify } from '@/lib/data';

interface Props {
  params: Promise<{ categoria: string }>;
}

// Generate all static paths at build time (SSG)
export async function generateStaticParams() {
  return CATEGORIES.filter((c) => c !== 'Tutti').map((cat) => ({
    categoria: slugify(cat),
  }));
}

// Server-side metadata per category (SSR)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria } = await params;
  const decoded = decodeURIComponent(categoria);

  const match = CATEGORIES.find(
    (c) => slugify(c).toLowerCase() === decoded.toLowerCase() || c.toLowerCase() === decoded.toLowerCase()
  );

  if (!match || match === 'Tutti') return {};

  const categoryDescriptions: Record<string, string> = {
    Illuminazione: 'Faretti LED, strisce RGB, lampadine smart e soluzioni di illuminazione per interni ed esterni.',
    Sicurezza: 'Kit antifurto wireless, telecamere Wi-Fi, serrature smart e sistemi di sicurezza per la casa.',
    Bricolage: 'Trapani, avvitatori, utensili elettrici e manuali per tutti i lavori di fai-da-te.',
    Giardinaggio: 'Tagliaerba, sistemi di irrigazione, attrezzi e arredo per il giardino.',
    Elettronica: 'Smartphone, smart TV, audio, accessori e tutta l\'elettronica di consumo.',
  };

  const desc = categoryDescriptions[match] || `Scopri tutti i prodotti nella categoria ${match} su BesPoint.`;

  return {
    title: `${match} — Acquista Online su BesPoint`,
    description: desc,
    openGraph: {
      title: `${match} | BesPoint`,
      description: desc,
      url: `https://www.bespoint.it/categoria/${slugify(match)}`,
    },
    alternates: {
      canonical: `https://www.bespoint.it/categoria/${slugify(match)}`,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { categoria } = await params;
  const decoded = decodeURIComponent(categoria);

  const match = CATEGORIES.find(
    (c) => slugify(c).toLowerCase() === decoded.toLowerCase() || c.toLowerCase() === decoded.toLowerCase()
  );

  if (!match || match === 'Tutti') notFound();

  return <CategoryClient categoryName={match} />;
}
