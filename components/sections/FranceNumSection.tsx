'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calculator, Gift, CheckCircle, Info, Euro, Users, Building, MapPin } from 'lucide-react';

export function FranceNumSection() {
  const [formData, setFormData] = useState({
    companySize: '',
    sector: '',
    location: '',
    projectType: '',
    budget: ''
  });
  const [result, setResult] = useState<any>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateAid = () => {
    let baseAid = 0;
    let percentage = 0;

    // Calcul selon le type de projet
    switch (formData.projectType) {
      case 'vitrine':
        baseAid = 1000;
        percentage = 20;
        break;
      case 'ecommerce':
        baseAid = 2000;
        percentage = 25;
        break;
      case 'application':
        baseAid = 3000;
        percentage = 30;
        break;
      default:
        baseAid = 500;
        percentage = 15;
    }

    // Bonus selon la taille d'entreprise
    if (formData.companySize === 'tpe') {
      baseAid += 500;
      percentage += 5;
    } else if (formData.companySize === 'pme') {
      baseAid += 300;
      percentage += 3;
    }

    // Bonus selon le secteur
    if (formData.sector === 'commerce' || formData.sector === 'artisanat') {
      baseAid += 200;
      percentage += 2;
    }

    const maxAid = Math.min(baseAid, 5000);
    const budgetNum = parseInt(formData.budget) || 0;
    const calculatedAid = Math.min(maxAid, (budgetNum * percentage) / 100);

    setResult({
      aid: Math.round(calculatedAid),
      percentage: percentage,
      maxAid: maxAid,
      finalCost: budgetNum - calculatedAid,
      eligible: calculatedAid > 0
    });
  };

  const companySizes = [
    { value: 'tpe', label: 'TPE (0-9 salariés)' },
    { value: 'pme', label: 'PME (10-249 salariés)' },
    { value: 'eti', label: 'ETI (250-4999 salariés)' },
    { value: 'ge', label: 'Grande Entreprise (5000+ salariés)' }
  ];

  const sectors = [
    { value: 'commerce', label: 'Commerce de détail' },
    { value: 'artisanat', label: 'Artisanat' },
    { value: 'services', label: 'Services' },
    { value: 'industrie', label: 'Industrie' },
    { value: 'agriculture', label: 'Agriculture' },
    { value: 'autre', label: 'Autre secteur' }
  ];

  const projectTypes = [
    { value: 'vitrine', label: 'Site Vitrine' },
    { value: 'ecommerce', label: 'Site E-commerce' },
    { value: 'application', label: 'Application Web' },
    { value: 'refonte', label: 'Refonte de Site' }
  ];

  const budgetRanges = [
    { value: '3000', label: '3 000€' },
    { value: '5000', label: '5 000€' },
    { value: '8000', label: '8 000€' },
    { value: '10000', label: '10 000€' },
    { value: '15000', label: '15 000€' },
    { value: '20000', label: '20 000€+' }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-cream via-rose-powder/5 to-cream dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-rose-powder/30 dark:border-rose-800/30 rounded-full px-6 py-2 mb-8">
            <Gift className="w-4 h-4 text-magenta"  aria-hidden="true" />
            <span className="text-sm font-medium text-charcoal dark:text-cream">Aide Publique France Num</span>
          </div>

          <h2 className="font-playfair text-4xl md:text-6xl font-bold text-charcoal dark:text-cream mb-6">
            Jusqu'à <span className="text-gradient">5 000€</span>
            <br />
            d'Aide Publique
          </h2>

          <p className="text-xl text-charcoal/80 dark:text-cream/80 mb-8 leading-relaxed">
            Bénéficiez du dispositif France Num pour financer votre transformation digitale. 
            Calculez instantanément votre aide personnalisée.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Calculateur */}
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-3xl p-8 border border-rose-powder/30 dark:border-rose-800/30 shadow-rose">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-rose rounded-full flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-playfair text-2xl font-bold text-charcoal dark:text-cream">
                    Calculateur d'Aide
                  </h3>
                  <p className="text-charcoal/70 dark:text-cream/80">Estimation instantanée et gratuite</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-charcoal dark:text-cream mb-2">
                    <Users className="w-4 h-4 inline mr-2" />
                    Taille de votre entreprise
                  </label>
                  <select
                    name="companySize"
                    value={formData.companySize}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-rose-powder/30 dark:border-rose-800/30 focus:border-magenta focus:outline-none transition-colors bg-white/50 dark:bg-gray-900/60 text-charcoal dark:text-cream"
                  >
                    <option value="">Sélectionnez</option>
                    {companySizes.map((size) => (
                      <option key={size.value} value={size.value}>{size.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal dark:text-cream mb-2">
                    <Building className="w-4 h-4 inline mr-2" />
                    Secteur d'activité
                  </label>
                  <select
                    name="sector"
                    value={formData.sector}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-rose-powder/30 dark:border-rose-800/30 focus:border-magenta focus:outline-none transition-colors bg-white/50 dark:bg-gray-900/60 text-charcoal dark:text-cream"
                  >
                    <option value="">Sélectionnez</option>
                    {sectors.map((sector) => (
                      <option key={sector.value} value={sector.value}>{sector.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal dark:text-cream mb-2">
                    <MapPin className="w-4 h-4 inline mr-2"  aria-label="Localisation" />
                    Localisation
                  </label>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-rose-powder/30 dark:border-rose-800/30 focus:border-magenta focus:outline-none transition-colors bg-white/50 dark:bg-gray-900/60 text-charcoal dark:text-cream"
                  >
                    <option value="">Sélectionnez</option>
                    <option value="france">France métropolitaine</option>
                    <option value="outremer">Outre-mer</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal dark:text-cream mb-2">
                    Type de projet
                  </label>
                  <select
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-rose-powder/30 dark:border-rose-800/30 focus:border-magenta focus:outline-none transition-colors bg-white/50 dark:bg-gray-900/60 text-charcoal dark:text-cream"
                  >
                    <option value="">Sélectionnez</option>
                    {projectTypes.map((type) => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal dark:text-cream mb-2">
                    <Euro className="w-4 h-4 inline mr-2" />
                    Budget estimé
                  </label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-rose-powder/30 dark:border-rose-800/30 focus:border-magenta focus:outline-none transition-colors bg-white/50 dark:bg-gray-900/60 text-charcoal dark:text-cream"
                  >
                    <option value="">Sélectionnez</option>
                    {budgetRanges.map((range) => (
                      <option key={range.value} value={range.value}>{range.label}</option>
                    ))}
                  </select>
                </div>

                <Button
                  onClick={calculateAid}
                  disabled={!formData.companySize || !formData.projectType || !formData.budget}
                  className="w-full bg-gradient-rose text-white py-4 text-lg font-semibold rounded-2xl hover:opacity-90 shadow-rose disabled:opacity-50"
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculer Mon Aide
                </Button>
              </div>
            </div>

            {/* Résultats */}
            <div className="space-y-6">
              {result ? (
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-rose-powder/30 shadow-rose">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="font-playfair text-2xl font-bold text-charcoal mb-2">
                      Votre Aide Estimée
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gradient-rose text-white rounded-2xl p-6 text-center">
                      <div className="text-3xl font-bold mb-2">
                        {result.aid.toLocaleString('fr-FR')}€
                      </div>
                      <div className="text-rose-powder/80">
                        Aide France Num estimée
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-cream rounded-xl p-4 text-center">
                        <div className="text-xl font-bold text-magenta">
                          {result.percentage}%
                        </div>
                        <div className="text-sm text-charcoal/70">
                          Taux d'aide
                        </div>
                      </div>
                      <div className="bg-cream rounded-xl p-4 text-center">
                        <div className="text-xl font-bold text-magenta">
                          {result.finalCost.toLocaleString('fr-FR')}€
                        </div>
                        <div className="text-sm text-charcoal/70">
                          Reste à charge
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-start space-x-3">
                        <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div className="text-sm text-blue-800">
                          <p className="font-semibold mb-1">Conditions :</p>
                          <ul className="space-y-1 text-xs">
                            <li>• Entreprise éligible au dispositif France Num</li>
                            <li>• Projet de transformation digitale</li>
                            <li>• Prestataire certifié (comme SDS)</li>
                            <li>• Dossier validé par les organismes</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <Button className="w-full bg-gradient-rose text-white py-3 rounded-2xl hover:opacity-90">
                      Demander un Devis Détaillé
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-3xl p-8 border border-rose-powder/30 dark:border-rose-800/30 shadow-rose">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-rose rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calculator className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-playfair text-2xl font-bold text-charcoal dark:text-cream mb-4">
                      Découvrez Votre Aide
                    </h3>
                    <p className="text-charcoal/70 dark:text-cream/80 mb-6">
                      Remplissez le formulaire pour connaître le montant de votre aide France Num.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-magenta/10 to-rose-powder/20 dark:from-rose-950/20 dark:to-rose-900/10 rounded-xl p-4">
                      <h4 className="font-semibold text-charcoal dark:text-cream mb-2">Avantages France Num :</h4>
                      <ul className="space-y-2 text-sm text-charcoal/80 dark:text-cream/80">
                        <li className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                          Jusqu'à 5 000€ d'aide directe
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                          Accompagnement personnalisé
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                          Prestataires certifiés
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                          Démarches simplifiées
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Informations complémentaires */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-rose-powder/30 shadow-rose">
                <h4 className="font-playfair text-lg font-bold text-charcoal mb-4">
                  Pourquoi Choisir SDS ?
                </h4>
                <ul className="space-y-3 text-sm text-charcoal/80">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-3 mt-0.5" />
                    <span><strong>Prestataire certifié</strong> France Num</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-3 mt-0.5" />
                    <span><strong>Accompagnement complet</strong> des démarches</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-3 mt-0.5" />
                    <span><strong>Expertise technique</strong> reconnue</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-3 mt-0.5" />
                    <span><strong>Garantie de résultat</strong> et satisfaction</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

