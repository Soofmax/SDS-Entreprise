import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'À propos | SLW',
  description: 'À propos de SLW: expertise front-end statique, performance, accessibilité et SEO pour vos projets.',
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}