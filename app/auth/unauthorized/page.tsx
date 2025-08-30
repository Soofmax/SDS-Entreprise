'use client';

import Link from 'next/link';
import { Shield, Home, LogIn } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-rose-50 to-magenta-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* Icône */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl mb-6">
          <Shield className="w-10 h-10 text-white" />
        </div>

        {/* Titre */}
        <h1 className="text-3xl font-playfair font-bold text-gray-900 mb-4">
          Accès non autorisé
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-8 leading-relaxed">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page. 
          Seuls les administrateurs et éditeurs peuvent accéder à l'espace d'administration.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-magenta-600 text-white rounded-xl font-semibold hover:from-rose-600 hover:to-magenta-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Home className="w-5 h-5" />
            Retour à l'accueil
          </Link>

          <Link
            href="/auth/signin"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-rose-300 text-rose-600 rounded-xl font-semibold hover:bg-rose-50 transition-all duration-300"
          >
            <LogIn className="w-5 h-5" />
            Se connecter
          </Link>
        </div>

        {/* Contact */}
        <div className="mt-8 p-4 bg-white rounded-xl border border-rose-100">
          <p className="text-sm text-gray-600">
            Besoin d'un accès administrateur ?<br/>
            Contactez-nous à{' '}
            <a 
              href="mailto:admin@salwadevstudio.com" 
              className="text-rose-600 hover:text-rose-700 font-semibold"
            >
              admin@salwadevstudio.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

