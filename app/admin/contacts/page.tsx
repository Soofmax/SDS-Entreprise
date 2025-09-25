'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  Calendar, 
  User, 
  Building, 
  Euro,
  Eye,
  Edit,
  Trash2,
  Download,
  Plus,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

// Types
type ContactStatus = 'nouveau' | 'en_cours' | 'devis_envoye' | 'termine' | 'annule';

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  project: string;
  budget: string;
  status: ContactStatus;
  date: string; // ISO date string
  message: string;
}

// Mock data pour les contacts
const mockContacts: Contact[] = [
  {
    id: 1,
    name: 'Marie Dubois',
    email: 'marie.dubois@email.com',
    phone: '+33 6 12 34 56 78',
    company: 'Studio Créatif',
    project: 'Site e-commerce',
    budget: '8000€',
    status: 'nouveau',
    date: '2024-08-29',
    message: 'Bonjour, je souhaite créer un site e-commerce pour ma boutique de créations artisanales...'
  },
  {
    id: 2,
    name: 'Thomas Martin',
    email: 'thomas.martin@techstart.fr',
    phone: '+33 6 98 76 54 32',
    company: 'TechStart',
    project: 'Landing page',
    budget: '3500€',
    status: 'en_cours',
    date: '2024-08-28',
    message: 'Nous avons besoin d\'une landing page moderne pour notre nouvelle application...'
  },
  {
    id: 3,
    name: 'Sophie Laurent',
    email: 'sophie@marketing-plus.com',
    phone: '+33 6 45 67 89 12',
    company: 'Marketing Plus',
    project: 'Site vitrine',
    budget: '4200€',
    status: 'termine',
    date: '2024-08-25',
    message: 'Refonte complète de notre site vitrine avec une approche moderne...'
  },
  {
    id: 4,
    name: 'Pierre Durand',
    email: 'pierre.durand@gmail.com',
    phone: '+33 6 23 45 67 89',
    company: 'Freelance',
    project: 'Portfolio',
    budget: '2500€',
    status: 'devis_envoye',
    date: '2024-08-27',
    message: 'Je suis photographe et j\'aimerais un portfolio en ligne pour présenter mon travail...'
  },
  {
    id: 5,
    name: 'Amélie Rousseau',
    email: 'amelie@wellness-spa.fr',
    phone: '+33 6 78 90 12 34',
    company: 'Wellness Spa',
    project: 'Site + réservation',
    budget: '6500€',
    status: 'nouveau',
    date: '2024-08-29',
    message: 'Nous souhaitons un site avec système de réservation en ligne pour notre spa...'
  }
];

const statusConfig: Record<ContactStatus, { label: string; color: string }> = {
  nouveau: { label: 'Nouveau', color: 'bg-blue-100 text-blue-800' },
  en_cours: { label: 'En cours', color: 'bg-green-100 text-green-800' },
  devis_envoye: { label: 'Devis envoyé', color: 'bg-yellow-100 text-yellow-800' },
  termine: { label: 'Terminé', color: 'bg-gray-100 text-gray-800' },
  annule: { label: 'Annulé', color: 'bg-red-100 text-red-800' }
};

export default function ContactsPage() {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('tous');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream via-rose-powder/20 to-cream flex items-center justify-center">
        <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm border-rose-powder/20">
          <CardHeader className="text-center">
            <CardTitle className="font-playfair text-xl text-charcoal">
              Accès Restreint
            </CardTitle>
            <CardDescription>
              Vous devez être connecté pour accéder à cette page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin">
              <Button className="w-full bg-gradient-rose text-white">
                Se connecter
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredContacts = mockContacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'tous' || contact.status === (statusFilter as ContactStatus);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-rose-powder/20 to-cream">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-rose-powder/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <Button variant="ghost" size="sm" className="text-charcoal hover:bg-rose-powder/20">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="font-playfair text-2xl font-bold text-charcoal">
                  Gestion des Contacts
                </h1>
                <p className="text-sm text-charcoal/60">
                  {filteredContacts.length} contact{filteredContacts.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <Button className="bg-gradient-rose text-white hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Contact
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-charcoal/40" />
            <Input
              placeholder="Rechercher par nom, email ou entreprise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-rose-powder/20 focus:border-magenta"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-rose-powder/20 rounded-md focus:border-magenta focus:outline-none bg-white"
          >
            <option value="tous">Tous les statuts</option>
            <option value="nouveau">Nouveau</option>
            <option value="en_cours">En cours</option>
            <option value="devis_envoye">Devis envoyé</option>
            <option value="termine">Terminé</option>
            <option value="annule">Annulé</option>
          </select>
          <Button variant="outline" className="border-magenta/20 text-magenta hover:bg-magenta/10">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>

        {/* Contacts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredContacts.map((contact) => (
            <Card key={contact.id} className="bg-white/80 backdrop-blur-sm border-rose-powder/20 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-rose flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-playfair text-charcoal">
                        {contact.name}
                      </CardTitle>
                      <CardDescription className="text-charcoal/60">
                        {contact.company}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={statusConfig[contact.status]?.color || 'bg-gray-100 text-gray-800'}>
                    {statusConfig[contact.status]?.label || contact.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-charcoal/70">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{contact.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-charcoal/70">
                    <Phone className="w-4 h-4" />
                    <span>{contact.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-charcoal/70">
                    <Building className="w-4 h-4" />
                    <span>{contact.project}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-charcoal/70">
                    <Euro className="w-4 h-4" />
                    <span className="font-medium text-magenta">{contact.budget}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-charcoal/70">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(contact.date).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-rose-powder/20">
                  <p className="text-sm text-charcoal/60 line-clamp-2">
                    {contact.message}
                  </p>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-magenta/20 text-magenta hover:bg-magenta/10"
                    onClick={() => setSelectedContact(contact)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Voir
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredContacts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-rose-powder/20 mx-auto mb-4 flex items-center justify-center">
              <Search className="w-8 h-8 text-charcoal/40" />
            </div>
            <h3 className="font-playfair text-lg text-charcoal mb-2">
              Aucun contact trouvé
            </h3>
            <p className="text-charcoal/60">
              Essayez de modifier vos critères de recherche.
            </p>
          </div>
        )}
      </main>

      {/* Modal de détail du contact */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-playfair text-xl text-charcoal">
                    {selectedContact.name}
                  </CardTitle>
                  <CardDescription>
                    {selectedContact.company} • {selectedContact.project}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedContact(null)}
                  className="text-charcoal/60 hover:text-charcoal"
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-charcoal mb-2">Informations de contact</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-charcoal/60" />
                      <span>{selectedContact.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-charcoal/60" />
                      <span>{selectedContact.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Building className="w-4 h-4 text-charcoal/60" />
                      <span>{selectedContact.company}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-charcoal mb-2">Détails du projet</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Building className="w-4 h-4 text-charcoal/60" />
                      <span>{selectedContact.project}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Euro className="w-4 h-4 text-charcoal/60" />
                      <span className="font-medium text-magenta">{selectedContact.budget}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-charcoal/60" />
                      <span>{new Date(selectedContact.date).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-charcoal mb-2">Message</h4>
                <div className="p-4 bg-rose-powder/10 rounded-lg">
                  <p className="text-sm text-charcoal/80 leading-relaxed">
                    {selectedContact.message}
                  </p>
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-rose-powder/20">
                <Button className="bg-gradient-rose text-white hover:opacity-90">
                  <Mail className="w-4 h-4 mr-2" />
                  Répondre
                </Button>
                <Button variant="outline" className="border-magenta/20 text-magenta hover:bg-magenta/10">
                  <Edit className="w-4 h-4 mr-2" />
                  Modifier
                </Button>
                <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                  Créer Devis
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

