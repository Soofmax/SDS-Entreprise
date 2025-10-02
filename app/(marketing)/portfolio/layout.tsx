import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio | SLW',
  description: 'Sélection de réalisations: sites vitrines statiques, e-commerce light, et interfaces front élégantes.',
};

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return children;
}