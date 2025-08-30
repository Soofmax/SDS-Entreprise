// Types de base pour l'application SDS
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Types pour les services
export interface Service extends BaseEntity {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: ServiceCategory;
  features: string[];
  deliveryTime: string;
  revisions: string;
  guarantee: string;
  popular?: boolean;
  icon?: string;
}

export type ServiceCategory = 
  | 'vitrine'
  | 'ecommerce'
  | 'application'
  | 'refonte'
  | 'seo'
  | 'maintenance';

// Types pour les packages
export interface Package extends BaseEntity {
  name: string;
  subtitle: string;
  description: string;
  originalPrice: number;
  finalPrice: number;
  savings: number;
  monthlyEquivalent: number;
  features: string[];
  deliveryTime: string;
  revisions: string;
  guarantee: string;
  popular: boolean;
  color: string;
  icon: string;
}

// Types pour les projets portfolio
export interface Project extends BaseEntity {
  title: string;
  description: string;
  category: ProjectCategory;
  technologies: Technology[];
  imageUrl: string;
  liveUrl?: string;
  githubUrl?: string;
  status: ProjectStatus;
  metrics?: ProjectMetrics;
}

export type ProjectCategory = 
  | 'vitrine'
  | 'ecommerce'
  | 'web3'
  | 'mobile'
  | 'application';

export type ProjectStatus = 'completed' | 'in-progress' | 'planned';

export interface ProjectMetrics {
  performanceScore?: number;
  seoScore?: number;
  accessibilityScore?: number;
  conversionRate?: number;
}

export interface Technology {
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'tool' | 'design';
  icon?: string;
}

// Types pour les témoignages
export interface Testimonial extends BaseEntity {
  content: string;
  author: {
    name: string;
    position: string;
    company: string;
    avatar?: string;
  };
  rating: number;
  project?: {
    title: string;
    category: ProjectCategory;
  };
  featured?: boolean;
}

// Types pour les formulaires
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  project: ServiceCategory | '';
  budget: string;
  timeline: string;
  message: string;
}

export interface FranceNumFormData {
  companySize: CompanySize | '';
  sector: BusinessSector | '';
  location: string;
  projectType: ServiceCategory | '';
  budget: string;
}

export type CompanySize = 'tpe' | 'pme' | 'eti' | 'ge';
export type BusinessSector = 
  | 'commerce'
  | 'artisanat'
  | 'services'
  | 'industrie'
  | 'agriculture'
  | 'autre';

// Types pour les aides publiques
export interface AidCalculationResult {
  aid: number;
  percentage: number;
  maxAid: number;
  finalCost: number;
  eligible: boolean;
  conditions?: string[];
}

// Types pour l'accessibilité
export interface AccessibilitySettings {
  darkMode: boolean;
  fontSize: FontSize;
  highContrast: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
}

export type FontSize = 'small' | 'medium' | 'large' | 'xl';

// Types pour les erreurs
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: Date;
}

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

// Types pour les API responses
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: AppError;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

// Types pour les hooks
export interface UseAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: AppError | null;
  refetch: () => Promise<void>;
}

// Types pour les animations
export interface AnimationConfig {
  duration: number;
  delay?: number;
  easing?: string;
  repeat?: boolean;
}

// Types pour le SEO
export interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
  noindex?: boolean;
}

// Types pour les statistiques
export interface BusinessStats {
  projectsCompleted: number;
  clientsSatisfied: number;
  averageDeliveryTime: string;
  satisfactionRate: number;
  technologies: number;
  coffeeCups: number | '∞';
}

// Types pour la configuration
export interface AppConfig {
  api: {
    baseUrl: string;
    timeout: number;
  };
  features: {
    blog: boolean;
    ecommerce: boolean;
    analytics: boolean;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  social: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}

// Types pour les événements analytics
export interface AnalyticsEvent {
  name: string;
  category: 'user_interaction' | 'form_submission' | 'page_view' | 'error';
  properties?: Record<string, any>;
  timestamp: Date;
}

// Types pour les notifications
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: () => void;
  style?: 'primary' | 'secondary';
}

