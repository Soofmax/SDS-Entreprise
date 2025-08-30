// Fichier: components/sections/FullCatalogue.tsx
// Version SEO PREMIUM avec optimisations avancées et données structurées

'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Search, Tag, Filter, Grid, List } from 'lucide-react';

import { allServices } from '@/lib/services-data';
import { ServiceCard } from '@/components/services/ServiceCard';

// --- Hook personnalisé pour le "debounce" avec analytics ---
function useDebounce(value: string, delay: number): string {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
      // Analytics: Track search queries (optionnel)
      if (value && value.length > 2) {
        // gtag('event', 'search', { search_term: value });
      }
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

// --- Catégories enrichies avec métadonnées SEO ---
const serviceCategories = [
    { 
      id: 'tous', 
      name: 'Tous les Services', 
      description: 'Catalogue complet de nos services web et digital',
      count: allServices.length 
    },
    { 
      id: 'visibilite', 
      name: 'Visibilité & SEO', 
      description: 'Référencement naturel, optimisation SEO, blog',
      count: allServices.filter(s => s.subCategory === 'visibilite').length 
    },
    { 
      id: 'conversion', 
      name: 'Conversion & CRO', 
      description: 'Landing pages, chatbots IA, tests A/B',
      count: allServices.filter(s => s.subCategory === 'conversion').length 
    },
    { 
      id: 'vente', 
      name: 'Vente & E-commerce', 
      description: 'Boutiques en ligne, systèmes de paiement, membership',
      count: allServices.filter(s => s.subCategory === 'vente').length 
    },
    { 
      id: 'optimisation', 
      name: 'Optimisation & Automatisation', 
      description: 'CRM, workflows IA, gestion inventaire, performance',
      count: allServices.filter(s => s.subCategory === 'optimisation').length 
    },
    { 
      id: 'growth', 
      name: 'Croissance & Marketing', 
      description: 'Analytics IA, parrainage, internationalisation',
      count: allServices.filter(s => s.subCategory === 'growth').length 
    },
    { 
      id: 'plateforme', 
      name: 'Plateformes & Marketplaces', 
      description: 'Marketplaces, e-learning, webinaires, crowdfunding',
      count: allServices.filter(s => s.subCategory === 'plateforme').length 
    },
    { 
      id: 'innovation', 
      name: 'Innovation & Technologies', 
      description: 'Web3, IA, réalité augmentée, assistant vocal',
      count: allServices.filter(s => s.subCategory === 'innovation').length 
    },
];

// --- Génération des données structurées pour le catalogue ---
const generateCatalogueStructuredData = (services: typeof allServices, activeCategory: string) => {
  const filteredServices = activeCategory === 'tous' 
    ? services 
    : services.filter(s => s.subCategory === activeCategory);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `Catalogue Services Web - ${serviceCategories.find(c => c.id === activeCategory)?.name}`,
    "description": `${filteredServices.length} services disponibles dans la catégorie ${activeCategory}`,
    "numberOfItems": filteredServices.length,
    "itemListElement": filteredServices.map((service, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Service",
        "@id": `#service-${service.id}`,
        "name": service.name,
        "description": service.description,
        "provider": {
          "@type": "Organization",
          "name": "Votre Agence Web"
        },
        "serviceType": service.subCategory,
        "offers": {
          "@type": "Offer",
          "price": service.price,
          "priceCurrency": "EUR",
          "availability": "https://schema.org/InStock"
        }
      }
    }))
  };

  return JSON.stringify(structuredData);
};

export function FullCatalogue() {
  const [activeFilter, setActiveFilter] = useState('tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  
  // Mémoization des services filtrés avec recherche enrichie
  const filteredServices = useMemo(() => {
    let services = allServices;
    
    // Filtre par catégorie
    if (activeFilter !== 'tous') {
      services = services.filter(s => s.subCategory === activeFilter);
    }
    
    // Recherche enrichie (nom, description, features, price)
    if (debouncedSearchQuery) {
      const lowerCaseQuery = debouncedSearchQuery.toLowerCase();
      services = services.filter(s => 
        s.name.toLowerCase().includes(lowerCaseQuery) || 
        s.description.toLowerCase().includes(lowerCaseQuery) ||
        s.features.some(feature => feature.toLowerCase().includes(lowerCaseQuery)) ||
        s.subCategory.toLowerCase().includes(lowerCaseQuery) ||
        s.price.toString().includes(lowerCaseQuery)
      );
    }
    
    return services;
  }, [activeFilter, debouncedSearchQuery]);

  // Calcul des statistiques pour le SEO
  const catalogueStats = useMemo(() => {
    const totalServices = filteredServices.length;
    const priceRange = filteredServices.length > 0 ? {
      min: Math.min(...filteredServices.map(s => s.price)),
      max: Math.max(...filteredServices.map(s => s.price))
    } : null;
    
    return { totalServices, priceRange };
  }, [filteredServices]);

  // Gestionnaire optimisé pour les filtres avec analytics
  const handleFilterChange = useCallback((categoryId: string) => {
    setActiveFilter(categoryId);
    // Analytics tracking (optionnel)
    // gtag('event', 'filter_services', { category: categoryId });
  }, []);

  return (
    <>
      {/* Données structurées dynamiques */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ 
          __html: generateCatalogueStructuredData(filteredServices, activeFilter) 
        }}
      />

      <div className="w-full">
        {/* En-tête avec statistiques SEO */}
        <div className="text-center mb-8">
          <p className="text-lg text-charcoal/70">
            <strong>{catalogueStats.totalServices} services</strong> disponibles
            {catalogueStats.priceRange && (
              <> • De <strong>{catalogueStats.priceRange.min}€</strong> à <strong>{catalogueStats.priceRange.max}€</strong></>
            )}
            {activeFilter !== 'tous' && (
              <> dans la catégorie <strong>{serviceCategories.find(c => c.id === activeFilter)?.name}</strong></>
            )}
          </p>
        </div>

        {/* Filtres et Recherche Optimisés */}
        <div className="mt-16 sticky top-16 bg-cream/95 backdrop-blur-md py-6 z-20 border-y border-rose-powder/10">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between max-w-6xl mx-auto">
            
            {/* Barre de recherche enrichie */}
            <div className="relative w-full lg:w-2/5">
              <label htmlFor="search-service" className="sr-only">
                Rechercher parmi {allServices.length} services web
              </label>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40 w-5 h-5" />
              <input 
                id="search-service"
                type="search"
                placeholder={`Rechercher parmi ${allServices.length} services...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-rose-powder/30 rounded-full bg-white focus:ring-2 focus:ring-magenta focus:border-magenta transition-all"
                aria-describedby="search-help"
              />
              <p id="search-help" className="sr-only">
                Recherchez par nom de service, description, fonctionnalité ou prix
              </p>
            </div>

            {/* Contrôles d'affichage */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white rounded-full p-1 border border-rose-powder/30">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-full transition-all ${viewMode === 'grid' ? 'bg-magenta text-white' : 'text-charcoal/60 hover:bg-rose-powder/20'}`}
                  aria-label="Affichage en grille"
                  aria-pressed={viewMode === 'grid'}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-full transition-all ${viewMode === 'list' ? 'bg-magenta text-white' : 'text-charcoal/60 hover:bg-rose-powder/20'}`}
                  aria-label="Affichage en liste"
                  aria-pressed={viewMode === 'list'}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Filtres par catégorie avec compteurs */}
          <div className="mt-6 max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <Filter className="w-5 h-5 text-charcoal/60" />
              <h3 className="font-semibold text-charcoal">Filtrer par catégorie :</h3>
            </div>
            
            <div role="group" aria-labelledby="filter-heading" className="flex flex-wrap gap-3">
              <h4 id="filter-heading" className="sr-only">Filtres de catégories de services</h4>
              {serviceCategories.map(category => (
                <button 
                  key={category.id} 
                  onClick={() => handleFilterChange(category.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-full transition-all border ${
                    activeFilter === category.id 
                      ? 'bg-magenta text-white shadow-md border-magenta' 
                      : 'bg-white text-charcoal hover:bg-rose-powder/20 border-rose-powder/30 hover:border-magenta/30'
                  }`}
                  aria-pressed={activeFilter === category.id}
                  title={category.description}
                >
                  <span>{category.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    activeFilter === category.id 
                      ? 'bg-white/20 text-white' 
                      : 'bg-rose-powder/20 text-charcoal/70'
                  }`}>
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Annonce des résultats pour l'accessibilité */}
        <div className="sr-only" aria-live="polite" role="status">
          {catalogueStats.totalServices === 0 
            ? "Aucun service ne correspond à vos critères" 
            : `${catalogueStats.totalServices} ${catalogueStats.totalServices > 1 ? 'services trouvés' : 'service trouvé'} ${activeFilter !== 'tous' ? `dans la catégorie ${activeFilter}` : ''}`
          }
        </div>

        {/* Grille/Liste des services avec SEO */}
        <section className="mt-12" aria-labelledby="services-list-heading">
          <h3 id="services-list-heading" className="sr-only">
            Liste des services {activeFilter !== 'tous' && `- ${serviceCategories.find(c => c.id === activeFilter)?.name}`}
          </h3>
          
          {filteredServices.length > 0 ? (
            <div className={
              viewMode === 'grid' 
                ? "grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3" 
                : "space-y-6"
            }>
              {filteredServices.map((service, index) => (
                <article 
                  key={service.id}
                  id={`service-${service.id}`}
                  itemScope 
                  itemType="https://schema.org/Service"
                  className={viewMode === 'list' ? "bg-white rounded-xl p-6 border border-rose-powder/30 hover:border-magenta/30 transition-all" : ""}
                >
                  {/* Métadonnées cachées pour le SEO */}
                  <meta itemProp="serviceType" content={service.subCategory} />
                  <meta itemProp="provider" content="Votre Agence Web" />
                  
                  <ServiceCard 
                    service={service} 
                    viewMode={viewMode}
                    priority={index < 6} // Lazy loading pour les images des 6 premiers services
                  />
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-rose-powder/20">
              <Tag className="w-16 h-16 mx-auto text-charcoal/20 mb-6" />
              <h3 className="text-xl font-semibold text-charcoal mb-2">
                Aucun service ne correspond à votre recherche
              </h3>
              <p className="text-charcoal/60 mb-6 max-w-md mx-auto">
                {debouncedSearchQuery 
                  ? `Aucun résultat pour "${debouncedSearchQuery}". Essayez d'autres termes ou explorez nos catégories.`
                  : "Essayez de modifier vos filtres ou votre recherche."
                }
              </p>
              
              {/* Suggestions de recherche */}
              <div className="flex flex-wrap gap-2 justify-center">
                <p className="text-sm text-charcoal/50 w-full mb-3">Suggestions :</p>
                {['SEO', 'E-commerce', 'IA', 'Site vitrine', 'Mobile'].map(suggestion => (
                  <button
                    key={suggestion}
                    onClick={() => setSearchQuery(suggestion)}
                    className="px-3 py-1.5 text-sm bg-rose-powder/10 text-charcoal hover:bg-rose-powder/20 rounded-full transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Pied de section avec informations SEO */}
        <footer className="mt-16 pt-8 border-t border-rose-powder/20 text-center">
          <p className="text-sm text-charcoal/60">
            Catalogue mis à jour régulièrement • {allServices.length} services disponibles • 
            Devis gratuit sous 24h
          </p>
        </footer>
      </div>
    </>
  );
}