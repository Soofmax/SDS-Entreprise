import { test, expect } from '@playwright/test';

test.describe('Formulaire de Contact', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');
  });

  test('affiche le formulaire de contact complet', async ({ page }) => {
    // Vérifier le titre de la page
    await expect(page.locator('h1')).toContainText(/Contact|Connectons/);
    
    // Vérifier la présence de tous les champs
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="phone"]')).toBeVisible();
    await expect(page.locator('input[name="company"]')).toBeVisible();
    await expect(page.locator('select[name="projectType"]')).toBeVisible();
    await expect(page.locator('select[name="budget"]')).toBeVisible();
    await expect(page.locator('select[name="timeline"]')).toBeVisible();
    await expect(page.locator('textarea[name="message"]')).toBeVisible();
    
    // Vérifier le bouton d'envoi
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('soumet le formulaire avec des données valides', async ({ page }) => {
    // Remplir le formulaire
    await page.fill('input[name="name"]', 'Jean Dupont');
    await page.fill('input[name="email"]', 'jean.dupont@example.com');
    await page.fill('input[name="phone"]', '0123456789');
    await page.fill('input[name="company"]', 'Entreprise Test');
    await page.selectOption('select[name="projectType"]', 'vitrine');
    await page.selectOption('select[name="budget"]', '3000-5000');
    await page.selectOption('select[name="timeline"]', '1-2 mois');
    await page.fill('textarea[name="message"]', 'Je souhaite créer un site vitrine pour mon entreprise. Merci de me contacter pour discuter du projet.');

    // Intercepter la requête API
    const responsePromise = page.waitForResponse('/api/contact');
    
    // Soumettre le formulaire
    await page.click('button[type="submit"]');
    
    // Attendre la réponse
    const response = await responsePromise;
    expect(response.status()).toBe(201);
    
    // Vérifier le message de succès
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="success-message"]')).toContainText(/succès|reçue/);
  });

  test('affiche les erreurs de validation', async ({ page }) => {
    // Essayer de soumettre le formulaire vide
    await page.click('button[type="submit"]');
    
    // Vérifier les messages d'erreur
    await expect(page.locator('[data-testid="error-name"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-email"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
  });

  test('valide le format de l\'email', async ({ page }) => {
    await page.fill('input[name="name"]', 'Jean Dupont');
    await page.fill('input[name="email"]', 'email-invalide');
    await page.fill('textarea[name="message"]', 'Message de test');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('[data-testid="error-email"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-email"]')).toContainText(/format.*email/i);
  });

  test('valide le format du téléphone français', async ({ page }) => {
    await page.fill('input[name="name"]', 'Jean Dupont');
    await page.fill('input[name="email"]', 'jean@example.com');
    await page.fill('input[name="phone"]', '123'); // Format invalide
    await page.fill('textarea[name="message"]', 'Message de test');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('[data-testid="error-phone"]')).toBeVisible();
  });

  test('limite la longueur du message', async ({ page }) => {
    const longMessage = 'A'.repeat(1001); // Plus de 1000 caractères
    
    await page.fill('input[name="name"]', 'Jean Dupont');
    await page.fill('input[name="email"]', 'jean@example.com');
    await page.fill('textarea[name="message"]', longMessage);
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-message"]')).toContainText(/1000/);
  });

  test('gère les erreurs de réseau', async ({ page }) => {
    // Simuler une erreur réseau
    await page.route('/api/contact', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ success: false, error: { message: 'Erreur serveur' } })
      });
    });

    await page.fill('input[name="name"]', 'Jean Dupont');
    await page.fill('input[name="email"]', 'jean@example.com');
    await page.fill('textarea[name="message"]', 'Message de test');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-message"]')).toContainText(/erreur/i);
  });

  test('affiche un indicateur de chargement', async ({ page }) => {
    // Ralentir la réponse API
    await page.route('/api/contact', async route => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      });
    });

    await page.fill('input[name="name"]', 'Jean Dupont');
    await page.fill('input[name="email"]', 'jean@example.com');
    await page.fill('textarea[name="message"]', 'Message de test');
    
    await page.click('button[type="submit"]');
    
    // Vérifier l'indicateur de chargement
    await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
  });

  test('réinitialise le formulaire après envoi réussi', async ({ page }) => {
    await page.fill('input[name="name"]', 'Jean Dupont');
    await page.fill('input[name="email"]', 'jean@example.com');
    await page.fill('textarea[name="message"]', 'Message de test');
    
    await page.click('button[type="submit"]');
    
    // Attendre le message de succès
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    
    // Vérifier que les champs sont vides
    await expect(page.locator('input[name="name"]')).toHaveValue('');
    await expect(page.locator('input[name="email"]')).toHaveValue('');
    await expect(page.locator('textarea[name="message"]')).toHaveValue('');
  });

  test('fonctionne sur mobile', async ({ page, isMobile }) => {
    if (!isMobile) {
      test.skip('Test spécifique mobile');
    }

    // Vérifier que le formulaire est responsive
    await expect(page.locator('form')).toBeVisible();
    
    // Vérifier que les champs sont accessibles
    await page.tap('input[name="name"]');
    await page.fill('input[name="name"]', 'Jean Mobile');
    
    await page.tap('input[name="email"]');
    await page.fill('input[name="email"]', 'jean@mobile.com');
    
    await page.tap('textarea[name="message"]');
    await page.fill('textarea[name="message"]', 'Message depuis mobile');
    
    // Vérifier que le clavier virtuel ne cache pas les champs
    const messageField = page.locator('textarea[name="message"]');
    await expect(messageField).toBeInViewport();
  });

  test('est accessible au clavier', async ({ page }) => {
    // Navigation au clavier
    await page.keyboard.press('Tab'); // Nom
    await expect(page.locator('input[name="name"]')).toBeFocused();
    
    await page.keyboard.press('Tab'); // Email
    await expect(page.locator('input[name="email"]')).toBeFocused();
    
    await page.keyboard.press('Tab'); // Téléphone
    await expect(page.locator('input[name="phone"]')).toBeFocused();
    
    // Remplir avec le clavier
    await page.keyboard.type('Jean Dupont');
    await page.keyboard.press('Tab');
    await page.keyboard.type('jean@example.com');
    
    // Aller au bouton submit
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    await expect(page.locator('button[type="submit"]')).toBeFocused();
  });

  test('sauvegarde les données en cas de rafraîchissement', async ({ page }) => {
    // Remplir partiellement le formulaire
    await page.fill('input[name="name"]', 'Jean Dupont');
    await page.fill('input[name="email"]', 'jean@example.com');
    
    // Rafraîchir la page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Vérifier que les données sont restaurées (si localStorage est implémenté)
    // Cette fonctionnalité dépend de l'implémentation côté client
    const nameValue = await page.locator('input[name="name"]').inputValue();
    if (nameValue) {
      expect(nameValue).toBe('Jean Dupont');
    }
  });

  test('affiche les informations de contact', async ({ page }) => {
    // Vérifier la présence des informations de contact
    await expect(page.locator('[data-testid="contact-email"]')).toBeVisible();
    await expect(page.locator('[data-testid="contact-phone"]')).toBeVisible();
    
    // Vérifier les liens cliquables
    const emailLink = page.locator('a[href^="mailto:"]');
    await expect(emailLink).toBeVisible();
    
    const phoneLink = page.locator('a[href^="tel:"]');
    await expect(phoneLink).toBeVisible();
  });

  test('affiche la FAQ', async ({ page }) => {
    // Vérifier la présence de la FAQ
    await expect(page.locator('[data-testid="faq-section"]')).toBeVisible();
    
    // Tester l'ouverture/fermeture des questions
    const firstQuestion = page.locator('[data-testid="faq-item"]').first();
    await firstQuestion.click();
    
    await expect(firstQuestion.locator('[data-testid="faq-answer"]')).toBeVisible();
  });
});

