// app/components/sections/CatalogueLoader.tsx

// 1. Marquer ce composant comme un "Client Component"
'use client';

import dynamic from 'next/dynamic';

// 2. Isoler l'importation dynamique ici, dans un environnement client
const FullCatalogue = dynamic(
  () => import('@/components/sections/FullCatalogue').then(mod => mod.FullCatalogue),
  {
    ssr: false, // Le catalogue est interactif, on le charge côté client
    loading: () => (
      // 3. Utiliser le composant de chargement que vous aviez déjà conçu
      <div className="text-center py-20">
        <h3 className="text-xl font-semibold text-charcoal mb-4">
          Catalogue Complet de Services
        </h3>
        <p className="text-charcoal/70 mb-2">
          Chargement de +30 services : Développement, SEO, IA, Web3...
        </p>
        <div className="animate-pulse bg-rose-powder/20 h-4 w-48 mx-auto rounded"></div>
      </div>
    )
  }
);

// 4. Exporter un composant simple qui rend le catalogue chargé dynamiquement
export default function CatalogueLoader() {
  return <FullCatalogue />;
}
