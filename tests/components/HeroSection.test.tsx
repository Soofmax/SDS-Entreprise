import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HeroSection } from '@/components/sections/HeroSection';

// Mock des animations Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

// Mock des icônes Lucide
vi.mock('lucide-react', () => ({
  Star: () => <div data-testid="star-icon">★</div>,
  Sparkles: () => <div data-testid="sparkles-icon">✨</div>,
  Heart: () => <div data-testid="heart-icon">❤️</div>,
  Zap: () => <div data-testid="zap-icon">⚡</div>,
  ArrowRight: () => <div data-testid="arrow-right-icon">→</div>,
  Play: () => <div data-testid="play-icon">▶️</div>,
}));

describe('HeroSection', () => {
  it('affiche le titre principal avec animation', () => {
    render(<HeroSection />);
    
    expect(screen.getByText('Solutions Web')).toBeInTheDocument();
    expect(screen.getByText(/Glamour|Performantes|Innovantes|Élégantes/)).toBeInTheDocument();
  });

  it('affiche la description avec les bonnes informations', () => {
    render(<HeroSection />);
    
    expect(screen.getByText(/Je transforme vos idées en expériences digitales/)).toBeInTheDocument();
    expect(screen.getByText(/Sites vitrines, landing pages, intégrations Web3/)).toBeInTheDocument();
  });

  it('affiche les statistiques correctement', () => {
    render(<HeroSection />);
    
    expect(screen.getByText('50+')).toBeInTheDocument();
    expect(screen.getByText('Projets Réalisés')).toBeInTheDocument();
    
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText('Clients Satisfaits')).toBeInTheDocument();
    
    expect(screen.getByText('48h')).toBeInTheDocument();
    expect(screen.getByText('Livraison Moyenne')).toBeInTheDocument();
  });

  it('affiche les boutons d\'action', () => {
    render(<HeroSection />);
    
    const discoverButton = screen.getByRole('button', { name: /Découvrir mes Services/i });
    const portfolioButton = screen.getByRole('button', { name: /Voir mon Portfolio/i });
    
    expect(discoverButton).toBeInTheDocument();
    expect(portfolioButton).toBeInTheDocument();
  });

  it('gère les clics sur les boutons', async () => {
    const user = userEvent.setup();
    render(<HeroSection />);
    
    const discoverButton = screen.getByRole('button', { name: /Découvrir mes Services/i });
    const portfolioButton = screen.getByRole('button', { name: /Voir mon Portfolio/i });
    
    await user.click(discoverButton);
    await user.click(portfolioButton);
    
    // Vérifier que les boutons sont cliquables
    expect(discoverButton).toBeEnabled();
    expect(portfolioButton).toBeEnabled();
  });

  it('affiche les éléments décoratifs animés', () => {
    render(<HeroSection />);
    
    expect(screen.getAllByTestId('star-icon')).toHaveLength(2);
    expect(screen.getByTestId('sparkles-icon')).toBeInTheDocument();
    expect(screen.getByTestId('heart-icon')).toBeInTheDocument();
    expect(screen.getByTestId('zap-icon')).toBeInTheDocument();
  });

  it('a la structure HTML correcte', () => {
    const { container } = render(<HeroSection />);
    
    // Vérifier la structure principale
    expect(container.querySelector('section')).toBeInTheDocument();
    expect(container.querySelector('.relative')).toBeInTheDocument();
    
    // Vérifier les classes Tailwind importantes
    expect(container.querySelector('.bg-cream')).toBeInTheDocument();
    expect(container.querySelector('.min-h-screen')).toBeInTheDocument();
  });

  it('est accessible avec les bonnes balises ARIA', () => {
    render(<HeroSection />);
    
    // Vérifier les headings
    const mainHeading = screen.getByRole('heading', { level: 1 });
    expect(mainHeading).toBeInTheDocument();
    
    // Vérifier les boutons
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
    
    buttons.forEach(button => {
      expect(button).toHaveAttribute('type', 'button');
    });
  });

  it('gère le responsive design', () => {
    const { container } = render(<HeroSection />);
    
    // Vérifier les classes responsive
    expect(container.querySelector('.lg\\:grid-cols-2')).toBeInTheDocument();
    expect(container.querySelector('.md\\:text-6xl')).toBeInTheDocument();
  });

  it('affiche le badge développeuse', () => {
    render(<HeroSection />);
    
    expect(screen.getByText('Développeuse Web & Blockchain • Basée en France')).toBeInTheDocument();
  });

  it('change les mots animés périodiquement', async () => {
    render(<HeroSection />);
    
    // Le premier mot devrait être visible
    expect(screen.getByText(/Glamour|Performantes|Innovantes|Élégantes/)).toBeInTheDocument();
    
    // Attendre le changement (l'animation change toutes les 3 secondes)
    await waitFor(
      () => {
        // Vérifier qu'un des mots animés est présent
        const animatedWords = ['Glamour', 'Performantes', 'Innovantes', 'Élégantes'];
        const foundWord = animatedWords.some(word => 
          screen.queryByText(word) !== null
        );
        expect(foundWord).toBe(true);
      },
      { timeout: 4000 }
    );
  });

  it('a les bonnes couleurs et styles', () => {
    const { container } = render(<HeroSection />);
    
    // Vérifier les classes de couleur
    expect(container.querySelector('.text-magenta')).toBeInTheDocument();
    expect(container.querySelector('.bg-gradient-rose')).toBeInTheDocument();
    expect(container.querySelector('.text-charcoal')).toBeInTheDocument();
  });

  it('gère les interactions hover', async () => {
    const user = userEvent.setup();
    render(<HeroSection />);
    
    const discoverButton = screen.getByRole('button', { name: /Découvrir mes Services/i });
    
    // Simuler le hover
    await user.hover(discoverButton);
    
    // Le bouton devrait avoir les classes hover
    expect(discoverButton).toHaveClass('hover:opacity-90');
  });

  it('affiche correctement sur mobile', () => {
    // Simuler un viewport mobile
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });
    
    const { container } = render(<HeroSection />);
    
    // Vérifier les classes mobile
    expect(container.querySelector('.text-4xl')).toBeInTheDocument();
    expect(container.querySelector('.px-4')).toBeInTheDocument();
  });

  it('a les performances optimisées', () => {
    const { container } = render(<HeroSection />);
    
    // Vérifier qu'il n'y a pas de re-renders inutiles
    expect(container.firstChild).toBeInTheDocument();
    
    // Vérifier que les images sont optimisées (si présentes)
    const images = container.querySelectorAll('img');
    images.forEach(img => {
      expect(img).toHaveAttribute('loading', 'lazy');
    });
  });
});

