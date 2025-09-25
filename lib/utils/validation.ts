import { ContactFormData, FranceNumFormData } from '@/lib/types';

// Types pour la validation
export interface ValidationRule<T = any> {
  validate: (value: T) => boolean;
  message: string;
}

export type ValidationSchema<T> = {
  [K in keyof T]?: ValidationRule<T[K]>[];
};

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
}

/**
 * Classe pour créer des règles de validation réutilisables
 */
export class Validator {
  static required<T = any>(message = 'Ce champ est requis'): ValidationRule<T | '' | undefined> {
    return {
      validate: (value: T | '' | undefined) => {
        if (typeof value === 'string') return value.trim().length > 0;
        return value !== null && value !== undefined && value !== '';
      },
      message
    };
  }

  static email(message = 'Adresse email invalide'): ValidationRule<string | undefined> {
    return {
      validate: (value: string | undefined) => {
        if (!value) return false;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
      },
      message
    };
  }

  static phone(message = 'Numéro de téléphone invalide'): ValidationRule<string | undefined> {
    return {
      validate: (value: string | undefined) => {
        if (!value) return false;
        const phoneRegex = /^(?:\+33|0)[1-9](?:[0-9]{8})$/;
        return phoneRegex.test(value.replace(/\s/g, ''));
      },
      message
    };
  }

  static minLength(min: number, message?: string): ValidationRule<string | undefined> {
    return {
      validate: (value: string | undefined) => !!value && value.length >= min,
      message: message || `Minimum ${min} caractères requis`
    };
  }

  static maxLength(max: number, message?: string): ValidationRule<string | undefined> {
    return {
      validate: (value: string | undefined) => (value ?? '').length <= max,
      message: message || `Maximum ${max} caractères autorisés`
    };
  }

  static pattern(regex: RegExp, message: string): ValidationRule<string | undefined> {
    return {
      validate: (value: string | undefined) => !!value && regex.test(value),
      message
    };
  }

  static oneOf<T>(options: T[], message?: string): ValidationRule<T | '' | undefined> {
    return {
      validate: (value: T | '' | undefined) => value !== '' && value !== undefined && options.includes(value as T),
      message: message || `Valeur doit être parmi: ${options.join(', ')}`
    };
  }

  static custom<T>(
    validator: (value: T) => boolean,
    message: string
  ): ValidationRule<T> {
    return {
      validate: validator,
      message
    };
  }
}

/**
 * Fonction pour valider un objet selon un schéma
 */
export function validateSchema<T extends Record<string, any>>(
  data: T,
  schema: ValidationSchema<T>
): ValidationResult {
  const errors: Record<string, string[]> = {};
  let isValid = true;

  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];
    const fieldErrors: string[] = [];

    if (rules && Array.isArray(rules)) {
      for (const rule of rules) {
        if (!rule.validate(value)) {
          fieldErrors.push(rule.message);
          isValid = false;
        }
      }
    }

    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors;
    }
  }

  return { isValid, errors };
}

/**
 * Schémas de validation prédéfinis
 */

// Options typées explicitement pour le champ project ('' | ServiceCategory)
const PROJECT_OPTIONS = (['vitrine', 'ecommerce', 'application', 'refonte', 'seo', 'maintenance'] as const) as unknown as ('' | import('@/lib/types').ServiceCategory)[];

export const contactFormSchema: ValidationSchema<ContactFormData> = {
  name: [
    Validator.required('Le nom est requis'),
    Validator.minLength(2, 'Le nom doit contenir au moins 2 caractères'),
    Validator.maxLength(50, 'Le nom ne peut pas dépasser 50 caractères')
  ],
  email: [
    Validator.required('L\'email est requis'),
    Validator.email('Format d\'email invalide')
  ],
  phone: [
    Validator.custom<string | undefined>(
      (value) => !value || Validator.phone().validate(value),
      'Format de téléphone invalide'
    )
  ],
  project: [
    Validator.required<'' | import('@/lib/types').ServiceCategory>('Le type de projet est requis'),
    // Utiliser une règle custom typée exactement pour éviter les soucis d'inférence TS
    Validator.custom<'' | import('@/lib/types').ServiceCategory>(
      (v) =>
        v !== '' &&
        (['vitrine', 'ecommerce', 'application', 'refonte', 'seo', 'maintenance'] as const).includes(
          v as import('@/lib/types').ServiceCategory
        ),
      'Valeur invalide pour le type de projet'
    )
  ],
  budget: [
    Validator.required('Le budget est requis')
  ],
  message: [
    Validator.required('Le message est requis'),
    Validator.minLength(10, 'Le message doit contenir au moins 10 caractères'),
    Validator.maxLength(1000, 'Le message ne peut pas dépasser 1000 caractères')
  ]
};

// Options autorisées pour France Num (sous-ensemble de ServiceCategory)
const FRANCE_NUM_PROJECT_TYPES = ['vitrine', 'ecommerce', 'application', 'refonte'] as const;

export const franceNumFormSchema: ValidationSchema<FranceNumFormData> = {
  companySize: [
    Validator.required('La taille de l\'entreprise est requise'),
    Validator.oneOf(['tpe', 'pme', 'eti', 'ge'])
  ],
  sector: [
    Validator.required('Le secteur d\'activité est requis'),
    Validator.oneOf(['commerce', 'artisanat', 'services', 'industrie', 'agriculture', 'autre'])
  ],
  location: [
    Validator.required('La localisation est requise')
  ],
  projectType: [
    Validator.required<'' | import('@/lib/types').ServiceCategory>('Le type de projet est requis'),
    // Règle custom avec includes typé en string pour éviter l'erreur TS2345
    Validator.custom<'' | import('@/lib/types').ServiceCategory>(
      (v) =>
        v !== '' &&
        (FRANCE_NUM_PROJECT_TYPES as readonly string[]).includes(v as string),
      'Valeur invalide pour le type de projet'
    )
  ],
  budget: [
    Validator.required('Le budget est requis')
  ]
};

/**
 * Hook pour utiliser la validation dans les composants
 */
export function useValidation<T extends Record<string, any>>(
  schema: ValidationSchema<T>
) {
  const validate = (data: T): ValidationResult => {
    return validateSchema(data, schema);
  };

  const validateField = (field: keyof T, value: any): string[] => {
    const rules = schema[field];
    if (!rules) return [];

    const errors: string[] = [];
    for (const rule of rules) {
      if (!rule.validate(value)) {
        errors.push(rule.message);
      }
    }
    return errors;
  };

  return { validate, validateField };
}

/**
 * Utilitaires pour la sanitisation des données
 */
export class Sanitizer {
  static string(value: any): string {
    if (typeof value !== 'string') return '';
    return value.trim();
  }

  static email(value: string): string {
    return this.string(value).toLowerCase();
  }

  static phone(value: string): string {
    return this.string(value).replace(/\s/g, '');
  }

  static html(value: string): string {
    return this.string(value)
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }

  static url(value: string): string {
    const sanitized = this.string(value);
    try {
      new URL(sanitized);
      return sanitized;
    } catch {
      return '';
    }
  }
}

/**
 * Fonction pour sanitiser un objet de données
 */
export function sanitizeFormData<T extends Record<string, any>>(
  data: T,
  sanitizers: Partial<Record<keyof T, (value: any) => any>> = {}
): T {
  const sanitized = { ...data };

  for (const [field, value] of Object.entries(sanitized)) {
    const sanitizer = sanitizers[field as keyof T];
    if (sanitizer) {
      sanitized[field as keyof T] = sanitizer(value);
    } else if (typeof value === 'string') {
      sanitized[field as keyof T] = Sanitizer.string(value) as T[keyof T];
    }
  }

  return sanitized;
}

