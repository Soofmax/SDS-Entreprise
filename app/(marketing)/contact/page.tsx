'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDown, Sparkles, Star, Zap, Heart, Mail, Phone, MapPin, Clock, Send, MessageCircle, Calendar, Coffee, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

type Errors = Partial<Record<'name' | 'email' | 'project' | 'message', string>>;

export default function ContactPage() {
  const [currentWord, setCurrentWord] = useState(0);
  const words = ['Parlons-en', 'C\'est parti !', 'Démarrons ensemble', 'Prêt(e) à commencer ?'];
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    project: '',
    budget: '',
    message: '',
    timeline: ''
  });
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [words.length]);

  // Prefill from query params (?package=professionnel&total=6240)
  useEffect(() => {
    const pkg = searchParams.get('package') || '';
    const totalParam = searchParams.get('total') || '';

    // Map package -> project type
    const packageToProject: Record<string, string> = {
      essentiel: 'Site Vitrine',
      professionnel: 'Site Vitrine',
      boutique: 'E-commerce',
    };

    // Guess budget bucket from numeric total (EUR)
    const computeBudgetBucket = (totalStr: string): string => {
      const n = parseInt(totalStr, 10);
      if (!isFinite(n) || n <= 0) return '';
      if (n < 3000) return 'Moins de 3 000€';
      if (n < 5000) return '3 000€ - 5 000€';
      if (n < 10000) return '5 000€ - 10 000€';
      if (n < 20000) return '10 000€ - 20 000€';
      return 'Plus de 20 000€';
    };

    const projectPrefill = packageToProject[pkg] || '';
    const budgetPrefill = computeBudgetBucket(totalParam);

    if (projectPrefill || budgetPrefill) {
      setFormData(prev => ({
        ...prev,
        project: projectPrefill || prev.project,
        budget: budgetPrefill || prev.budget,
        message: prev.message || (pkg ? `Package souhaité: ${pkg}` : ''),
      }));
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Validation côté client, tout en conservant la dégradation progressive (pas de preventDefault si OK)
    const newErrors: Errors = {};
    if (!formData.name.trim()) newErrors.name = 'Le nom est requis.';
    if (!formData.email.trim()) newErrors.email = 'L\'email est requis.';
    if (!formData.project.trim()) newErrors.project = 'Le type de projet est requis.';
    if (!formData.message.trim()) newErrors.message = 'Le message est requis.';

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      e.preventDefault();
      return;
    }
    // Laisser le navigateur soumettre le formulaire vers /api/contact (fallback no-JS OK)
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email',
      value: 'salwa@sds-studio.fr',
      description: 'Réponse sous 24h',
      color: 'from-magenta to-rose-powder'
    },
    {
      icon: Phone,
      title: 'Téléphone',
      value: '+33 6 XX XX XX XX',
      description: 'Lun-Ven 9h-18h',
      color: 'from-rose-powder to-cream'
    },
    {
      icon: MapPin,
      title: 'Localisation',
      value: 'France',
      description: 'Interventions à distance',
      color: 'from-cream to-rose-powder'
    },
    {
      icon: Clock,
      title: 'Disponibilité',
      value: '48h',
      description: 'Délai de réponse moyen',
      color: 'from-rose-powder to-magenta'
    }
  ];

  const projectTypes = [
    'Site Vitrine',
    'E-commerce',
    'Application Web',
    'Refonte de Site',
    'Optimisation SEO',
    'Maintenance',
    'Autre'
  ];

  const budgetRanges = [
    'Moins de 3 000€',
    '3 000€ - 5 000€',
    '5 000€ - 10 000€',
    '10 000€ - 20 000€',
    'Plus de 20 000€',
    'À discuter'
  ];

  const timelineOptions = [
    'Urgent (moins d\'1 mois)',
    'Court terme (1-2 mois)',
    'Moyen terme (3-6 mois)',
    'Long terme (6+ mois)',
    'Pas de contrainte'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-rose-powder/10 to-cream dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20 overflow-hidden">
        <div className="absolute top-20 left-10 animate-float">
          <Star className="w-8 h-8 text-magenta"  aria-hidden="true" />
        </div>
        <div className="absolute top-40 right-20 animate-float" style={{ animationDelay: '1s' }}>
          <Sparkles className="w-6 h-6 text-rose-powder"  aria-hidden="true" />
        </div>
        <div className="absolute bottom-40 left-20 animate-float" style={{ animationDelay: '2s' }}>
          <Heart className="w-7 h-7 text-magenta"  aria-hidden="true" />
        </div>
        <div className="absolute bottom-20 right-10 animate-float" style={{ animationDelay: '3s' }}>
          <Zap className="w-5 h-5 text-rose-powder"  aria-hidden="true" />
        </div>
        <div className="absolute top-1/2 left-1/4 animate-float" style={{ animationDelay: '4s' }}>
          <Mail className="w-6 h-6 text-magenta"  aria-label="Email" />
        </div>
        <div className="absolute top-1/3 right-1/3 animate-float" style={{ animationDelay: '5s' }}>
          <MessageCircle className="w-5 h-5 text-rose-powder" />
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        {/* Header Section */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-rose-powder/30 rounded-full px-6 py-2 mb-8">
            <Coffee className="w-4 h-4 text-magenta"  aria-hidden="true" />
            <span className="text-sm font-medium text-charcoal">Réponse Garantie sous 24h • Devis Gratuit</span>
          </div>

          {/* Main Heading */}
          <h1 className="font-playfair text-5xl md:text-7xl font-bold text-charcoal mb-6 leading-tight">
            <span className="text-gradient relative">
              {words[currentWord]}
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-charcoal/80 mb-8 max-w-3xl mx-auto leading-relaxed">
            Prête à donner vie à votre vision ? Partageons vos idées autour d'un café virtuel 
            et créons ensemble votre prochaine réussite digitale.
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-magenta mb-2">24h</div>
              <div className="text-sm text-charcoal/70">Délai de Réponse</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-magenta mb-2">100%</div>
              <div className="text-sm text-charcoal/70">Devis Gratuits</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-magenta mb-2">48h</div>
              <div className="text-sm text-charcoal/70">Temps de Démarrage</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-magenta mb-2">∞</div>
              <div className="text-sm text-charcoal/70">Révisions Incluses</div>
            </div>
          </div>
        </div>

        {/* Contact Methods */}
        <div className="max-w-6xl mx-auto mb-20">
          <h2 className="font-playfair text-4xl font-bold text-center text-charcoal mb-12">
            Moyens de Contact
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => {
              const IconComponent = method.icon;
              return (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-rose-powder/30 hover:border-magenta transition-all duration-300 hover:scale-105 hover:shadow-rose text-center"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${method.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="font-playfair text-xl font-bold text-charcoal mb-2">
                    {method.title}
                  </h3>
                  
                  <p className="text-magenta font-semibold mb-2">
                    {method.value}
                  </p>
                  
                  <p className="text-charcoal/70 text-sm">
                    {method.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Form */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-rose-powder/30 shadow-rose">
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-2 bg-gradient-rose text-white rounded-full px-6 py-2 mb-6">
                <Send className="w-5 h-5"  aria-label="Envoyer" />
                <span className="font-medium">Formulaire de Contact</span>
              </div>
              
              <h3 className="font-playfair text-3xl font-bold text-charcoal mb-4">
                Parlez-moi de Votre Projet
              </h3>
              
              <p className="text-charcoal/80 text-lg leading-relaxed">
                Plus vous me donnez de détails, plus je peux vous proposer une solution adaptée.
              </p>
            </div>

            {isSubmitted ? (
              <div className="text-center py-12" role="status" aria-live="polite">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h4 className="font-playfair text-2xl font-bold text-charcoal dark:text-cream mb-4">
                  Message Envoyé !
                </h4>
                <p className="text-charcoal/80 dark:text-cream/80 mb-6">
                  Merci pour votre message. Je vous réponds sous 24h maximum.
                </p>
                <Button 
                  onClick={() => setIsSubmitted(false)}
                  className="bg-gradient-rose text-white px-6 py-3 rounded-2xl hover:opacity-90"
                >
                  Envoyer un Autre Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} action="/api/contact" method="POST" className="space-y-6" noValidate>
                {/* Honeypot anti-spam */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="company">Société (laissez vide)</label>
                  <input type="text" id="company" name="company" tabIndex={-1} autoComplete="organization" />
                </div>
                {/* Personal Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-charcoal mb-2">
                      Nom Complet *{/* Champs requis */}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      aria-required="true"
                      aria-describedby={errors.name ? "name-help name-error" : "name-help"}
                      aria-invalid={Boolean(errors.name)}
                      autoComplete="name"
                      className="w-full px-4 py-3 rounded-xl border border-rose-powder/30 dark:border-rose-800/30 focus:border-magenta focus:outline-none transition-colors bg-white/50 dark:bg-gray-900/60 text-charcoal dark:text-cream placeholder:text-charcoal/60 dark:placeholder:text-cream/60 focus:ring-2 focus:ring-magenta/20"
                      placeholder="Votre nom et prénom"
                    />
                    <div id="name-help" className="text-xs text-charcoal/60 mt-1">
                      Votre nom complet pour personnaliser notre échange
                    </div>
                    {errors.name && (
                      <div id="name-error" role="alert" className="error-message">
                        {errors.name}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-charcoal mb-2">
                      Email *{/* Champs requis */}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      aria-required="true"
                      aria-describedby={errors.email ? "email-help email-error" : "email-help"}
                      aria-invalid={Boolean(errors.email)}
                      autoComplete="email"
                      className="w-full px-4 py-3 rounded-xl border border-rose-powder/30 dark:border-rose-800/30 focus:border-magenta focus:outline-none transition-colors bg-white/50 dark:bg-gray-900/60 text-charcoal dark:text-cream placeholder:text-charcoal/60 dark:placeholder:text-cream/60 focus:ring-2 focus:ring-magenta/20"
                      placeholder="votre@email.com"
                    />
                    <div id="email-help" className="text-xs text-charcoal/60 mt-1">
                      Adresse email pour vous envoyer le devis et communiquer
                    </div>
                    {errors.email && (
                      <div id="email-error" role="alert" className="error-message">
                        {errors.email}
                      </div>
                    )}

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-charcoal mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    aria-describedby="phone-help"
                    autoComplete="tel"
                    className="w-full px-4 py-3 rounded-xl border border-rose-powder/30 dark:border-rose-800/30 focus:border-magenta focus:outline-none transition-colors bg-white/50 dark:bg-gray-900/60 text-charcoal dark:text-cream placeholder:text-charcoal/60 dark:placeholder:text-cream/60 focus:ring-2 focus:ring-magenta/20"
                    placeholder="+33 6 XX XX XX XX"
                  />
                  <div id="phone-help" className="text-xs text-charcoal/60 mt-1">
                    Optionnel - Pour un échange plus rapide si besoin
                  </div>
                </div>

                {/* Project Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="project" className="block text-sm font-semibold text-charcoal mb-2">
                      Type de Projet *
                    </label>
                    <select
                      id="project"
                      name="project"
                      value={formData.project}
                      onChange={handleInputChange}
                      required
                      aria-required="true"
                      aria-describedby={errors.project ? "project-help project-error" : "project-help"}
                      aria-invalid={Boolean(errors.project)}
                      className="w-full px-4 py-3 rounded-xl border border-rose-powder/30 dark:border-rose-800/30 focus:border-magenta focus:outline-none transition-colors bg-white/50 dark:bg-gray-900/60 text-charcoal dark:text-cream focus:ring-2 focus:ring-magenta/20"
                    >
                      <option value="">Sélectionnez un type de projet</option>
                      {projectTypes.map((type, index) => (
                        <option key={index} value={type}>{type}</option>
                      ))}
                    </select>
                    <div id="project-help" className="text-xs text-charcoal/60 mt-1">
                      Choisissez le type qui correspond le mieux à votre besoin
                    </div>
                    {errors.project && (
                      <div id="project-error" role="alert" className="error-message">
                        {errors.project}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="budget" className="block text-sm font-semibold text-charcoal mb-2">
                      Budget Estimé
                    </label>
                    <select
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      aria-describedby="budget-help"
                      className="w-full px-4 py-3 rounded-xl border border-rose-powder/30 dark:border-rose-800/30 focus:border-magenta focus:outline-none transition-colors bg-white/50 dark:bg-gray-900/60 text-charcoal dark:text-cream focus:ring-2 focus:ring-magenta/20"
                    >
                      <option value="">Sélectionnez une fourchette de budget</option>
                      {budgetRanges.map((range, index) => (
                        <option key={index} value={range}>{range}</option>
                      ))}
                    </select>
                    <div id="budget-help" className="text-xs text-charcoal/60 mt-1">
                      Aide à proposer la solution la plus adaptée
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="timeline" className="block text-sm font-semibold text-charcoal mb-2">
                    Délai Souhaité
                  </label>
                  <select
                    id="timeline"
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleInputChange}
                    aria-describedby="timeline-help"
                    className="w-full px-4 py-3 rounded-xl border border-rose-powder/30 focus:border-magenta focus:outline-none transition-colors bg-white/50 focus:ring-2 focus:ring-magenta/20"
                  >
                    <option value="">Sélectionnez un délai de livraison</option>
                    {timelineOptions.map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                  </select>
                  <div id="timeline-help" className="text-xs text-charcoal/60 mt-1">
                    Quand souhaitez-vous que votre projet soit livré ?
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-charcoal mb-2">
                    Décrivez Votre Projet *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    aria-required="true"
                    aria-describedby={errors.message ? "message-help message-error" : "message-help"}
                    aria-invalid={Boolean(errors.message)}
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl border border-rose-powder/30 dark:border-rose-800/30 focus:border-magenta focus:outline-none transition-colors bg-white/50 dark:bg-gray-900/60 text-charcoal dark:text-cream placeholder:text-charcoal/60 dark:placeholder:text-cream/60 resize-none focus:ring-2 focus:ring-magenta/20"
                    placeholder="Parlez-moi de votre vision, vos objectifs, vos besoins spécifiques..."
                  />
                  <div id="message-help" className="text-xs text-charcoal/60 mt-1">
                    Plus vous donnez de détails, plus je peux vous proposer une solution adaptée
                  </div>
                  {errors.message && (
                    <div id="message-error" role="alert" className="error-message">
                      {errors.message}
                    </div>
                  )}
                </div>

                <div className="text-center pt-6">
                  <Button
                    type="submit"
                    aria-describedby="submit-help"
                    className="bg-gradient-rose text-white px-12 py-4 text-lg font-semibold rounded-2xl hover:opacity-90 shadow-rose inline-flex items-center space-x-2 focus:ring-2 focus:ring-magenta/20 focus:outline-none"
                  >
                    <Send className="w-5 h-5" aria-hidden="true" />
                    <span>Envoyer Mon Message</span>
                  </Button>
                  
                  <div id="submit-help" className="text-sm text-charcoal/60 mt-4">
                    En envoyant ce formulaire, vous acceptez d'être contacté par email ou téléphone.
                    Réponse garantie sous 24h.
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* RDV Section */}
        <div id="rdv" className="max-w-4xl mx-auto mt-24">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-rose-powder/30 shadow-rose">
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-2 bg-gradient-rose text-white rounded-full px-6 py-2 mb-6">
                <Calendar className="w-5 h-5" aria-hidden="true" />
                <span className="font-medium">Prendre Rendez-vous</span>
              </div>
              <h3 className="font-playfair text-3xl font-bold text-charcoal mb-4">
                Échange de 20 minutes pour cadrer votre projet
              </h3>
              <p className="text-charcoal/80 text-lg leading-relaxed max-w-2xl mx-auto">
                Choisissez un créneau pour discuter de vos besoins. Je vous propose une estimation et la meilleure approche dès l’appel.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href={`mailto:contact@smarterlogicweb.com?subject=Prise de RDV SLW&body=${encodeURIComponent(
                  `Bonjour,\n\nJe souhaite prendre rendez-vous pour discuter de mon projet.${formData.project ? `\nType de projet: ${formData.project}` : ''}${formData.budget ? `\nBudget: ${formData.budget}` : ''}\n\nCréneau préféré: __/__/____ à __:__\n\nMerci,`
                )}`}
                className="block"
              >
                <Button className="w-full bg-gradient-rose text-white hover:opacity-90">
                  <Calendar className="w-4 h-4 mr-2" />
                  Proposer un créneau
                </Button>
              </a>

              <a href="tel:+33600000000" className="block">
                <Button variant="outline" className="w-full border-magenta text-magenta hover:bg-magenta hover:text-white">
                  <Phone className="w-4 h-4 mr-2" />
                  Être rappelé(e)
                </Button>
              </a>

              <Link href="#contact" className="block">
                <Button variant="ghost" className="w-full text-magenta hover:text-magenta/80">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Continuer par message
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mt-24">
          <h2 className="font-playfair text-4xl font-bold text-center text-charcoal mb-12">
            Questions Fréquentes
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                question: "Combien coûte un site web ?",
                answer: "Les tarifs varient selon vos besoins. Un site vitrine commence à 3 360€, un e-commerce à 8 000€. Devis gratuit et personnalisé."
              },
              {
                question: "Combien de temps pour créer mon site ?",
                answer: "Généralement 2-4 semaines pour un site vitrine, 6-8 semaines pour un e-commerce. Délais garantis dans le devis."
              },
              {
                question: "Proposez-vous la maintenance ?",
                answer: "Oui, maintenance incluse 6 mois puis forfaits mensuels. Mises à jour, sauvegardes et support technique inclus."
              },
              {
                question: "Puis-je modifier mon site moi-même ?",
                answer: "Absolument ! Formation incluse pour gérer votre contenu. Interface simple et intuitive, pas besoin d'être technique."
              }
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-rose-powder/30 hover:border-magenta transition-all duration-300 hover:shadow-rose"
              >
                <h4 className="font-playfair text-lg font-bold text-charcoal mb-3">
                  {faq.question}
                </h4>
                <p className="text-charcoal/80 text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
