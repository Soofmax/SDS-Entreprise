'use client';

import { useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Lock, User, Mail, Eye, EyeOff } from 'lucide-react';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream via-rose-powder/20 to-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-rose mx-auto mb-4 flex items-center justify-center animate-pulse">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <p className="text-charcoal/60">Chargement...</p>
        </div>
      </div>
    );
  }

  if (session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream via-rose-powder/20 to-cream">
        {/* Header Admin */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-rose-powder/20 sticky top-0 z-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-rose flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-playfair text-xl font-bold text-charcoal">
                    Dashboard Admin
                  </h1>
                  <p className="text-sm text-charcoal/60">Salwa Dev Studio</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-charcoal">
                    {session.user?.name || 'Admin'}
                  </p>
                  <p className="text-xs text-charcoal/60">
                    {session.user?.email}
                  </p>
                </div>
                <Button
                  onClick={() => signOut()}
                  variant="outline"
                  size="sm"
                  className="border-magenta/20 text-magenta hover:bg-magenta/10"
                >
                  Déconnexion
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Stats Cards */}
            <Card className="bg-white/80 backdrop-blur-sm border-rose-powder/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-charcoal/60">
                  Nouveaux Contacts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-magenta">12</div>
                <p className="text-xs text-charcoal/60">+20% ce mois</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-rose-powder/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-charcoal/60">
                  Projets Actifs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-magenta">5</div>
                <p className="text-xs text-charcoal/60">3 en cours</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-rose-powder/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-charcoal/60">
                  Revenus Mois
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-magenta">8 400€</div>
                <p className="text-xs text-charcoal/60">+15% vs mois dernier</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-rose-powder/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-charcoal/60">
                  Taux Conversion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-magenta">68%</div>
                <p className="text-xs text-charcoal/60">Excellent !</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-white/80 backdrop-blur-sm border-rose-powder/20">
              <CardHeader>
                <CardTitle className="font-playfair text-lg text-charcoal">
                  Actions Rapides
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-gradient-rose text-white hover:opacity-90">
                  Nouveau Projet
                </Button>
                <Button variant="outline" className="w-full border-magenta/20 text-magenta hover:bg-magenta/10">
                  Gérer Contacts
                </Button>
                <Button variant="outline" className="w-full border-magenta/20 text-magenta hover:bg-magenta/10">
                  Créer Devis
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-rose-powder/20">
              <CardHeader>
                <CardTitle className="font-playfair text-lg text-charcoal">
                  Derniers Contacts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-2 rounded-lg bg-rose-powder/10">
                    <div className="w-8 h-8 rounded-full bg-gradient-rose flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-charcoal">Marie Dubois</p>
                      <p className="text-xs text-charcoal/60">Site e-commerce</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-2 rounded-lg bg-rose-powder/10">
                    <div className="w-8 h-8 rounded-full bg-gradient-rose flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-charcoal">Thomas Martin</p>
                      <p className="text-xs text-charcoal/60">Landing page</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-rose-powder/20">
              <CardHeader>
                <CardTitle className="font-playfair text-lg text-charcoal">
                  Projets en Cours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-gradient-to-r from-rose-powder/20 to-magenta/10">
                    <p className="text-sm font-medium text-charcoal">Studio Créatif</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-charcoal/60">75% terminé</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        En cours
                      </span>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-gradient-to-r from-rose-powder/20 to-magenta/10">
                    <p className="text-sm font-medium text-charcoal">TechStart</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-charcoal/60">90% terminé</span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Révision
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  // Login Form
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-rose-powder/20 to-cream flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm border-rose-powder/20 shadow-xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-rose mx-auto mb-4 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="font-playfair text-2xl text-charcoal">
            Espace Admin
          </CardTitle>
          <CardDescription className="text-charcoal/60">
            Connectez-vous pour accéder au dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-charcoal">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-charcoal/40" />
              <Input
                type="email"
                placeholder="admin@sds-studio.fr"
                value={credentials.email}
                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                className="pl-10 border-rose-powder/20 focus:border-magenta"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-charcoal">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-charcoal/40" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                className="pl-10 pr-10 border-rose-powder/20 focus:border-magenta"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-charcoal/40 hover:text-charcoal"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            onClick={() => signIn('credentials', credentials)}
            className="w-full bg-gradient-rose text-white hover:opacity-90"
          >
            Se connecter
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-rose-powder/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-charcoal/60">Ou</span>
            </div>
          </div>

          <Button
            onClick={() => signIn('google')}
            variant="outline"
            className="w-full border-rose-powder/20 text-charcoal hover:bg-rose-powder/10"
          >
            Continuer avec Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

