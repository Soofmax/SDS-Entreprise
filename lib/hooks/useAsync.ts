import { useState, useCallback, useEffect } from 'react';
import { AppError, UseAsyncState } from '@/lib/types';

interface UseAsyncOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: AppError) => void;
}

/**
 * Hook personnalisé pour gérer les opérations asynchrones
 * Fournit un état de chargement, de données et d'erreur
 */
export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  options: UseAsyncOptions = {}
): UseAsyncState<T> & { execute: () => Promise<void> } {
  const { immediate = false, onSuccess, onError } = options;
  
  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    loading: false,
    error: null,
    refetch: () => Promise.resolve(),
  });

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await asyncFunction();
      setState(prev => ({ ...prev, data, loading: false }));
      onSuccess?.(data);
    } catch (error) {
      const appError: AppError = {
        code: 'ASYNC_ERROR',
        message: error instanceof Error ? error.message : 'Une erreur est survenue',
        timestamp: new Date(),
        details: { originalError: error }
      };
      
      setState(prev => ({ ...prev, error: appError, loading: false }));
      onError?.(appError);
    }
  }, [asyncFunction, onSuccess, onError]);

  const refetch = useCallback(async () => {
    await execute();
  }, [execute]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    ...state,
    refetch,
    execute,
  };
}

/**
 * Hook spécialisé pour les formulaires avec validation
 */
export function useAsyncForm<T, R>(
  submitFunction: (data: T) => Promise<R>,
  validationSchema?: (data: T) => Promise<boolean> | boolean
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<AppError | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const submit = useCallback(async (data: T) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      // Validation optionnelle
      if (validationSchema) {
        const isValid = await validationSchema(data);
        if (!isValid) {
          throw new Error('Données de formulaire invalides');
        }
      }

      const result = await submitFunction(data);
      setSubmitSuccess(true);
      return result;
    } catch (error) {
      const appError: AppError = {
        code: 'FORM_SUBMIT_ERROR',
        message: error instanceof Error ? error.message : 'Erreur lors de la soumission',
        timestamp: new Date(),
        details: { formData: data, originalError: error }
      };
      
      setSubmitError(appError);
      throw appError;
    } finally {
      setIsSubmitting(false);
    }
  }, [submitFunction, validationSchema]);

  const reset = useCallback(() => {
    setSubmitError(null);
    setSubmitSuccess(false);
    setIsSubmitting(false);
  }, []);

  return {
    submit,
    reset,
    isSubmitting,
    submitError,
    submitSuccess,
  };
}

/**
 * Hook pour gérer les données avec cache local
 */
export function useAsyncWithCache<T>(
  key: string,
  asyncFunction: () => Promise<T>,
  options: UseAsyncOptions & { cacheTime?: number } = {}
) {
  const { cacheTime = 5 * 60 * 1000 } = options; // 5 minutes par défaut
  
  const getCachedData = useCallback(() => {
    try {
      const cached = localStorage.getItem(`cache_${key}`);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < cacheTime) {
          return data;
        }
      }
    } catch (error) {
      console.warn('Erreur lors de la lecture du cache:', error);
    }
    return null;
  }, [key, cacheTime]);

  const setCachedData = useCallback((data: T) => {
    try {
      localStorage.setItem(`cache_${key}`, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.warn('Erreur lors de la sauvegarde du cache:', error);
    }
  }, [key]);

  const asyncFunctionWithCache = useCallback(async () => {
    const cachedData = getCachedData();
    if (cachedData) {
      return cachedData;
    }
    
    const freshData = await asyncFunction();
    setCachedData(freshData);
    return freshData;
  }, [asyncFunction, getCachedData, setCachedData]);

  return useAsync(asyncFunctionWithCache, options);
}

