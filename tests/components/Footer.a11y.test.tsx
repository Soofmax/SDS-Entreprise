import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from '@/components/layout/Footer';

describe('Footer accessibility', () => {
  it('renders content information and links', () => {
    render(<Footer />);

    // Footer landmark
    const contentinfo = screen.getByRole('contentinfo');
    expect(contentinfo).toBeInTheDocument();

    // Ensure legal and company links are present
    expect(screen.getByRole('link', { name: /À propos/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Portfolio/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Contact/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Mentions Légales/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Confidentialité/i })).toBeInTheDocument();
  });
});