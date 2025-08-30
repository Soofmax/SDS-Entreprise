/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    // Configuration de l'environnement de test
    environment: 'jsdom',
    
    // Fichiers de setup
    setupFiles: ['./tests/setup.ts'],
    
    // Patterns de fichiers de test
    include: [
      'tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'lib/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'components/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'app/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
    ],
    
    // Fichiers à exclure
    exclude: [
      'node_modules',
      'dist',
      '.next',
      'coverage',
      'tests/e2e',
    ],
    
    // Configuration des globals
    globals: true,
    
    // Configuration du coverage
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.{js,ts}',
        '**/coverage/**',
        '**/.next/**',
        '**/dist/**',
        'prisma/',
        'public/',
        '**/*.stories.{js,ts,jsx,tsx}',
        '**/*.test.{js,ts,jsx,tsx}',
        '**/*.spec.{js,ts,jsx,tsx}',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
    
    // Configuration des mocks
    mockReset: true,
    clearMocks: true,
    restoreMocks: true,
    
    // Timeout pour les tests
    testTimeout: 10000,
    
    // Configuration des reporters
    reporters: ['verbose', 'json', 'html'],
    
    // Configuration de l'interface utilisateur
    ui: true,
    open: false,
    
    // Configuration des variables d'environnement
    env: {
      NODE_ENV: 'test',
      DATABASE_URL: 'postgresql://test:test@localhost:5432/test_db',
      NEXTAUTH_SECRET: 'test-secret',
      NEXTAUTH_URL: 'http://localhost:3000',
    },
  },
  
  // Configuration des alias de résolution
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@/components': path.resolve(__dirname, './components'),
      '@/lib': path.resolve(__dirname, './lib'),
      '@/app': path.resolve(__dirname, './app'),
      '@/types': path.resolve(__dirname, './lib/types'),
      '@/utils': path.resolve(__dirname, './lib/utils'),
      '@/hooks': path.resolve(__dirname, './lib/hooks'),
      '@/services': path.resolve(__dirname, './lib/services'),
    },
  },
  
  // Configuration pour les dépendances externes
  define: {
    'process.env': process.env,
  },
});

