import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services | SLW',
  description: 'Création de sites statiques, landing pages et intégrations front-end performantes pour TPE/PME.',
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}