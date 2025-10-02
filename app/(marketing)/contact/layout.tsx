import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | SLW',
  description: 'Demandez un devis gratuit ou prenez rendez-vous pour votre site vitrine statique performant.',
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}