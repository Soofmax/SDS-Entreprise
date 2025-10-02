import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ContactPage from '@/app/(marketing)/contact/page';

describe('ContactPage accessibility', () => {
  it('renders required fields with accessible labels and aria attributes', () => {
    render(<ContactPage />);

    const name = screen.getByLabelText(/Nom Complet/i);
    const email = screen.getByLabelText(/Email/i);
    const project = screen.getByLabelText(/Type de Projet/i);
    const message = screen.getByLabelText(/Décrivez Votre Projet/i);

    expect(name).toBeInTheDocument();
    expect(email).toBeInTheDocument();
    expect(project).toBeInTheDocument();
    expect(message).toBeInTheDocument();

    expect(name).toHaveAttribute('aria-required', 'true');
    expect(email).toHaveAttribute('aria-required', 'true');
    expect(project).toHaveAttribute('aria-required', 'true');
    expect(message).toHaveAttribute('aria-required', 'true');
  });

  it('shows error messages with role="alert" when submitting empty form', () => {
    render(<ContactPage />);

    const submit = screen.getByRole('button', { name: /Envoyer Mon Message/i });
    fireEvent.click(submit);

    const nameError = screen.getByRole('alert', { name: /Le nom est requis/i });
    const emailError = screen.getByRole('alert', { name: /L'email est requis/i });
    const projectError = screen.getByRole('alert', { name: /Le type de projet est requis/i });
    const messageError = screen.getByRole('alert', { name: /Le message est requis/i });

    expect(nameError).toBeInTheDocument();
    expect(emailError).toBeInTheDocument();
    expect(projectError).toBeInTheDocument();
    expect(messageError).toBeInTheDocument();
  });
});