import { defineConfig, devices } from '@playwright/test';

/**
 * Configuration Playwright pour les tests E2E
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Répertoire des tests E2E
  testDir: './tests/e2e',
  
  // Timeout global pour les tests
  timeout: 30 * 1000,
  
  // Timeout pour les assertions
  expect: {
    timeout: 5000,
  },
  
  // Exécuter les tests en parallèle
  fullyParallel: true,
  
  // Échouer la build si des tests sont marqués comme .only
  forbidOnly: !!process.env.CI,
  
  // Nombre de tentatives en cas d'échec
  retries: process.env.CI ? 2 : 0,
  
  // Nombre de workers en parallèle
  workers: process.env.CI ? 1 : undefined,
  
  // Configuration des rapports
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    process.env.CI ? ['github'] : ['list'],
  ],
  
  // Répertoire pour les artefacts de test
  outputDir: 'test-results/',
  
  // Configuration globale pour tous les projets
  use: {
    // URL de base pour les tests
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    
    // Tracer les tests en cas d'échec
    trace: 'on-first-retry',
    
    // Capturer les screenshots en cas d'échec
    screenshot: 'only-on-failure',
    
    // Capturer les vidéos en cas d'échec
    video: 'retain-on-failure',
    
    // Timeout pour les actions
    actionTimeout: 10000,
    
    // Timeout pour la navigation
    navigationTimeout: 30000,
    
    // Ignorer les erreurs HTTPS
    ignoreHTTPSErrors: true,
    
    // Locale et timezone
    locale: 'fr-FR',
    timezoneId: 'Europe/Paris',
    
    // Configuration des permissions
    permissions: ['geolocation', 'notifications'],
    
    // Headers par défaut
    extraHTTPHeaders: {
      'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
    },
  },

  // Configuration des projets (navigateurs)
  projects: [
    // Tests de setup (authentification, etc.)
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    
    // Desktop Chrome
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Utiliser les données de session du setup
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },

    // Desktop Firefox
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },

    // Desktop Safari
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },

    // Mobile Chrome
    {
      name: 'Mobile Chrome',
      use: { 
        ...devices['Pixel 5'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },

    // Mobile Safari
    {
      name: 'Mobile Safari',
      use: { 
        ...devices['iPhone 12'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },

    // Tablet
    {
      name: 'Tablet',
      use: { 
        ...devices['iPad Pro'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },

    // Tests sans JavaScript (pour l'accessibilité)
    {
      name: 'no-js',
      use: { 
        ...devices['Desktop Chrome'],
        javaScriptEnabled: false,
      },
    },

    // Tests avec connexion lente
    {
      name: 'slow-network',
      use: { 
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
        // Simuler une connexion 3G lente
        launchOptions: {
          args: ['--force-effective-connection-type=3g'],
        },
      },
      dependencies: ['setup'],
    },
  ],

  // Configuration du serveur de développement
  webServer: process.env.CI ? undefined : {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    env: {
      NODE_ENV: 'test',
    },
  },

  // Configuration des métadonnées
  metadata: {
    'test-type': 'e2e',
    'project': 'sds-website',
    'environment': process.env.NODE_ENV || 'test',
  },

  // Configuration globale des fixtures
  globalSetup: require.resolve('./tests/e2e/global-setup.ts'),
  globalTeardown: require.resolve('./tests/e2e/global-teardown.ts'),
});

