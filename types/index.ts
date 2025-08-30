// types/index.ts

// Le contrat pour un objet "Service"
export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  subCategory: string;
  category: 'base' | 'addon'; // On peut même être très précis sur les valeurs possibles
  duration?: string; // Le '?' signifie que cette propriété est optionnelle
  features: { title: string; description: string }[];
  dependencies?: string[];
  testimonials?: Testimonial[]; // On réutilise notre autre interface !
}

// Le contrat pour un objet "Testimonial" (Témoignage)
export interface Testimonial {
  name: string;
  role: string;
  quote: string;
  avatar: string;
}

// Le contrat pour un objet "User" (Utilisateur)
export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'admin' | 'user';
}
