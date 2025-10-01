import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from '@/components/layout/Header';

describe('Header accessibility', () => {
  it('renders a banner landmark with navigation links', () => {
    render(<Header />);

    // Header landmark
    const banner = screen.getByRole('banner');
    expect(banner).toBeInTheDocument();

    // Navigation links
    expect(screen.getByRole('link', { name: /Accueil/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Services/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Portfolio/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /À propos/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Contact/i })).toBeInTheDocument();

    // Mobile menu button has accessible label
    const menuButton = screen.getByRole('button', { name: /Menu/i });
    expect(menuButton).toBeInTheDocument();
  });
});