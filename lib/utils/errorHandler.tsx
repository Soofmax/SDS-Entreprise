import { AppError, ErrorSeverity } from '@/lib/types';

/**
 * Classe pour gérer les erreurs de manière centralisée
 */
export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorListeners: ((error: AppError) => void)[] = [];

  private constructor() {}

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * Ajouter un listener pour les erreurs
   */
  addErrorListener(listener: (error: AppError) => void): () => void {
    this.errorListeners.push(listener);
    
    // Retourner une fonction pour supprimer le listener
    return () => {
      const index = this.errorListeners.indexOf(listener);
      if (index > -1) {
        this.errorListeners.splice(index, 1);
      }
    };
  }

  /**
   * Créer une erreur standardisée
   */
  createError(
    code: string,
    message: string,
    details?: Record<string, any>,
    severity: ErrorSeverity = 'medium'
  ): AppError {
    return {
      code,
      message,
      details: {
        ...details,
        severity,
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
        url: typeof window !== 'undefined' ? window.location.href : 'unknown'
      },
      timestamp: new Date()
    };
  }

  /**
   * Gérer une erreur
   */
  handleError(error: AppError | Error | unknown): AppError {
    let appError: AppError;

    if (this.isAppError(error)) {
      appError = error;
    } else if (error instanceof Error) {
      appError = this.createError(
        'UNKNOWN_ERROR',
        error.message,
        { 
          stack: error.stack,
          name: error.name 
        }
      );
    } else {
      appError = this.createError(
        'UNKNOWN_ERROR',
        'Une erreur inconnue est survenue',
        { originalError: error }
      );
    }

    // Notifier tous les listeners
    this.errorListeners.forEach(listener => {
      try {
        listener(appError);
      } catch (listenerError) {
        console.error('Erreur dans un error listener:', listenerError);
      }
    });

    // Logger l'erreur
    this.logError(appError);

    return appError;
  }

  /**
   * Vérifier si un objet est une AppError
   */
  private isAppError(error: any): error is AppError {
    return error && 
           typeof error.code === 'string' && 
           typeof error.message === 'string' && 
           error.timestamp instanceof Date;
  }

  /**
   * Logger une erreur
   */
  private logError(error: AppError): void {
    const severity = error.details?.severity || 'medium';
    
    const logData = {
      code: error.code,
      message: error.message,
      timestamp: error.timestamp.toISOString(),
      details: error.details
    };

    switch (severity) {
      case 'low':
        console.info('🔵 Erreur faible:', logData);
        break;
      case 'medium':
        console.warn('🟡 Erreur moyenne:', logData);
        break;
      case 'high':
        console.error('🟠 Erreur élevée:', logData);
        break;
      case 'critical':
        console.error('🔴 Erreur critique:', logData);
        // Ici on pourrait envoyer à un service de monitoring
        this.sendToMonitoring(error);
        break;
    }
  }

  /**
   * Envoyer l'erreur à un service de monitoring
   */
  private sendToMonitoring(error: AppError): void {
    // Implémentation pour envoyer à Sentry, LogRocket, etc.
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      // Exemple avec fetch vers un endpoint de monitoring
      fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(error)
      }).catch(err => {
        console.error('Impossible d\'envoyer l\'erreur au monitoring:', err);
      });
    }
  }
}

/**
 * Erreurs prédéfinies communes
 */
export const CommonErrors = {
  NETWORK_ERROR: (details?: Record<string, any>) => 
    ErrorHandler.getInstance().createError(
      'NETWORK_ERROR',
      'Erreur de connexion réseau',
      details,
      'high'
    ),

  VALIDATION_ERROR: (field: string, message: string) =>
    ErrorHandler.getInstance().createError(
      'VALIDATION_ERROR',
      `Erreur de validation: ${message}`,
      { field },
      'low'
    ),

  API_ERROR: (status: number, message: string) =>
    ErrorHandler.getInstance().createError(
      'API_ERROR',
      message,
      { status },
      status >= 500 ? 'high' : 'medium'
    ),

  FORM_SUBMISSION_ERROR: (formName: string, details?: Record<string, any>) =>
    ErrorHandler.getInstance().createError(
      'FORM_SUBMISSION_ERROR',
      `Erreur lors de la soumission du formulaire ${formName}`,
      details,
      'medium'
    ),

  ACCESSIBILITY_ERROR: (feature: string) =>
    ErrorHandler.getInstance().createError(
      'ACCESSIBILITY_ERROR',
      `Erreur d'accessibilité: ${feature}`,
      { feature },
      'low'
    )
};

/**
 * Hook React pour gérer les erreurs
 */
export function useErrorHandler() {
  const errorHandler = ErrorHandler.getInstance();

  const handleError = (error: AppError | Error | unknown): AppError => {
    return errorHandler.handleError(error);
  };

  const createError = (
    code: string,
    message: string,
    details?: Record<string, any>,
    severity: ErrorSeverity = 'medium'
  ): AppError => {
    return errorHandler.createError(code, message, details, severity);
  };

  return { handleError, createError };
}

/**
 * Décorateur pour capturer les erreurs dans les fonctions async
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  errorCode?: string
): T {
  return (async (...args: any[]) => {
    try {
      return await fn(...args);
    } catch (error) {
      const errorHandler = ErrorHandler.getInstance();
      const appError = errorHandler.handleError(error);
      
      if (errorCode) {
        appError.code = errorCode;
      }
      
      throw appError;
    }
  }) as T;
}

/**
 * Boundary d'erreur pour React (à utiliser avec react-error-boundary)
 */
export function createErrorBoundaryFallback(
  title: string = 'Une erreur est survenue'
) {
  return function ErrorFallback({ 
    error, 
    resetErrorBoundary 
  }: { 
    error: Error; 
    resetErrorBoundary: () => void;
  }) {
    const errorHandler = ErrorHandler.getInstance();
    const appError = errorHandler.handleError(error);

    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-rose border border-rose-powder/30 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h2 className="font-playfair text-2xl font-bold text-charcoal mb-4">
            {title}
          </h2>
          
          <p className="text-charcoal/80 mb-6">
            {appError.message}
          </p>
          
          <div className="space-y-3">
            <button
              onClick={resetErrorBoundary}
              className="w-full bg-gradient-rose text-white py-3 rounded-2xl hover:opacity-90 transition-opacity"
            >
              Réessayer
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gray-100 text-charcoal py-3 rounded-2xl hover:bg-gray-200 transition-colors"
            >
              Recharger la page
            </button>
          </div>
          
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-6 text-left">
              <summary className="cursor-pointer text-sm text-charcoal/70 hover:text-charcoal">
                Détails techniques
              </summary>
              <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-auto">
                {JSON.stringify(appError, null, 2)}
              </pre>
            </details>
          )}
        </div>
      </div>
    );
  };
}

