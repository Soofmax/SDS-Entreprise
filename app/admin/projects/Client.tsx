'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Building, 
  Euro,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  ArrowLeft,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';

// Types
type ProjectStatus = 'planifie' | 'en_cours' | 'revision' | 'attente' | 'termine' | 'annule';
type ProjectType = 'Site Vitrine' | 'E-commerce' | 'Landing Page' | 'Portfolio' | 'Site + Booking';

interface ProjectTask {
  name: string;
  completed: boolean;
}

interface Project {
  id: number;
  name: string;
  client: string;
  company: string;
  type: ProjectType;
  budget: number;
  progress: number;
  status: ProjectStatus;
  startDate: string; // ISO date
  deadline: string; // ISO date
  description: string;
  tasks: ProjectTask[];
}

// Mock data pour les projets
const mockProjects: Project[] = [
  {
    id: 1,
    name: 'Site E-commerce Studio Créatif',
    client: 'Marie Dubois',
    company: 'Studio Créatif',
    type: 'E-commerce',
    budget: 8000,
    progress: 75,
    status: 'en_cours',
    startDate: '2024-08-15',
    deadline: '2024-09-15',
    description: 'Création d\'un site e-commerce complet pour une boutique de créations artisanales avec gestion des stocks et paiements.',
    tasks: [
      { name: 'Design & Maquettes', completed: true },
      { name: 'Développement Frontend', completed: true },
      { name: 'Intégration E-commerce', completed: false },
      { name: 'Tests & Optimisation', completed: false }
    ]
  },
  {
    id: 2,
    name: 'Landing Page TechStart',
    client: 'Thomas Martin',
    company: 'TechStart',
    type: 'Landing Page',
    budget: 3500,
    progress: 90,
    status: 'revision',
    startDate: '2024-08-20',
    deadline: '2024-09-05',
    description: 'Landing page moderne et convertissante pour le lancement d\'une nouvelle application mobile.',
    tasks: [
      { name: 'Stratégie & Wireframes', completed: true },
      { name: 'Design UI/UX', completed: true },
      { name: 'Développement', completed: true },
      { name: 'Révisions Client', completed: false }
    ]
  },
  {
    id: 3,
    name: 'Site Vitrine Marketing Plus',
    client: 'Sophie Laurent',
    company: 'Marketing Plus',
    type: 'Site Vitrine',
    budget: 4200,
    progress: 100,
    status: 'termine',
    startDate: '2024-07-10',
    deadline: '2024-08-10',
    description: 'Refonte complète du site vitrine avec une approche moderne et optimisation SEO avancée.',
    tasks: [
      { name: 'Audit & Stratégie', completed: true },
      { name: 'Design Responsive', completed: true },
      { name: 'Développement', completed: true },
      { name: 'SEO & Livraison', completed: true }
    ]
  },
  {
    id: 4,
    name: 'Portfolio Photographe',
    client: 'Pierre Durand',
    company: 'Freelance',
    type: 'Portfolio',
    budget: 2500,
    progress: 25,
    status: 'attente',
    startDate: '2024-08-25',
    deadline: '2024-09-20',
    description: 'Portfolio en ligne élégant pour présenter le travail d\'un photographe professionnel.',
    tasks: [
      { name: 'Sélection Photos', completed: true },
      { name: 'Design Portfolio', completed: false },
      { name: 'Développement', completed: false },
      { name: 'Optimisation Images', completed: false }
    ]
  },
  {
    id: 5,
    name: 'Site + Réservation Wellness Spa',
    client: 'Amélie Rousseau',
    company: 'Wellness Spa',
    type: 'Site + Booking',
    budget: 6500,
    progress: 10,
    status: 'planifie',
    startDate: '2024-09-01',
    deadline: '2024-10-15',
    description: 'Site vitrine avec système de réservation en ligne intégré pour un spa de luxe.',
    tasks: [
      { name: 'Analyse Besoins', completed: false },
      { name: 'Design & UX', completed: false },
      { name: 'Système Réservation', completed: false },
      { name: 'Tests & Formation', completed: false }
    ]
  }
];

const statusConfig: Record<ProjectStatus, { label: string; color: string; icon: LucideIcon }> = {
  planifie: { label: 'Planifié', color: 'bg-gray-100 text-gray-800', icon: Calendar },
  en_cours: { label: 'En cours', color: 'bg-blue-100 text-blue-800', icon: Clock },
  revision: { label: 'En révision', color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
  attente: { label: 'En attente', color: 'bg-orange-100 text-orange-800', icon: Clock },
  termine: { label: 'Terminé', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  annule: { label: 'Annulé', color: 'bg-red-100 text-red-800', icon: AlertCircle }
};

const typeConfig: Record<ProjectType, string> = {
  'Site Vitrine': 'bg-purple-100 text-purple-800',
  'E-commerce': 'bg-green-100 text-green-800',
  'Landing Page': 'bg-blue-100 text-blue-800',
  'Portfolio': 'bg-pink-100 text-pink-800',
  'Site + Booking': 'bg-indigo-100 text-indigo-800'
};

export default function ProjectsPage() {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('tous');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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

  const filteredProjects = mockProjects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'tous' || project.status === (statusFilter as ProjectStatus);
    return matchesSearch && matchesStatus;
  });

  const getDaysRemaining = (deadline: string | Date) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = +deadlineDate - +today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

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
                  Gestion des Projets
                </h1>
                <p className="text-sm text-charcoal/60">
                  {filteredProjects.length} projet{filteredProjects.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <Button className="bg-gradient-rose text-white hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Projet
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-rose-powder/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-charcoal/60">En cours</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {mockProjects.filter(p => p.status === 'en_cours').length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-rose-powder/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-charcoal/60">En révision</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {mockProjects.filter(p => p.status === 'revision').length}
                  </p>
                </div>
                <AlertCircle className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-rose-powder/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-charcoal/60">Terminés</p>
                  <p className="text-2xl font-bold text-green-600">
                    {mockProjects.filter(p => p.status === 'termine').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-rose-powder/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-charcoal/60">Revenus</p>
                  <p className="text-2xl font-bold text-magenta">
                    {mockProjects.reduce((sum, p) => sum + p.budget, 0).toLocaleString()}€
                  </p>
                </div>
                <Euro className="w-8 h-8 text-magenta" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-charcoal/40" />
            <Input
              placeholder="Rechercher par nom, client ou entreprise..."
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
            <option value="planifie">Planifié</option>
            <option value="en_cours">En cours</option>
            <option value="revision">En révision</option>
            <option value="attente">En attente</option>
            <option value="termine">Terminé</option>
          </select>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map((project) => {
            const StatusIcon = statusConfig[project.status].icon;
            const daysRemaining = getDaysRemaining(project.deadline);
            
            return (
              <Card key={project.id} className="bg-white/80 backdrop-blur-sm border-rose-powder/20 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-playfair text-charcoal mb-2">
                        {project.name}
                      </CardTitle>
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={statusConfig[project.status].color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusConfig[project.status].label}
                        </Badge>
                        <Badge className={typeConfig[project.type] || 'bg-gray-100 text-gray-800'}>
                          {project.type}
                        </Badge>
                      </div>
                      <CardDescription className="text-charcoal/60">
                        {project.client} • {project.company}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-charcoal">Progression</span>
                      <span className="text-sm text-charcoal/60">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>

                  {/* Project Info */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2 text-charcoal/70">
                      <Euro className="w-4 h-4" />
                      <span className="font-medium text-magenta">{project.budget.toLocaleString()}€</span>
                    </div>
                    <div className="flex items-center space-x-2 text-charcoal/70">
                      <Calendar className="w-4 h-4" />
                      <span className={daysRemaining < 7 && daysRemaining > 0 ? 'text-orange-600 font-medium' : 
                                     daysRemaining < 0 ? 'text-red-600 font-medium' : ''}>
                        {daysRemaining > 0 ? `${daysRemaining}j restants` : 
                         daysRemaining === 0 ? 'Échéance aujourd\'hui' : 
                         `${Math.abs(daysRemaining)}j de retard`}
                      </span>
                    </div>
                  </div>

                  {/* Tasks Preview */}
                  <div>
                    <h4 className="text-sm font-medium text-charcoal mb-2">Tâches</h4>
                    <div className="space-y-1">
                      {project.tasks.slice(0, 2).map((task, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <div className={`w-3 h-3 rounded-full ${task.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                          <span className={task.completed ? 'text-charcoal/60 line-through' : 'text-charcoal'}>
                            {task.name}
                          </span>
                        </div>
                      ))}
                      {project.tasks.length > 2 && (
                        <p className="text-xs text-charcoal/60 ml-5">
                          +{project.tasks.length - 2} autres tâches
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 pt-2 border-t border-rose-powder/20">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-magenta/20 text-magenta hover:bg-magenta/10"
                      onClick={() => setSelectedProject(project)}
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
            );
          })}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-rose-powder/20 mx-auto mb-4 flex items-center justify-center">
              <Search className="w-8 h-8 text-charcoal/40" />
            </div>
            <h3 className="font-playfair text-lg text-charcoal mb-2">
              Aucun projet trouvé
            </h3>
            <p className="text-charcoal/60">
              Essayez de modifier vos critères de recherche.
            </p>
          </div>
        )}
      </main>

      {/* Modal de détail du projet */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl bg-white max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-playfair text-xl text-charcoal">
                    {selectedProject.name}
                  </CardTitle>
                  <CardDescription>
                    {selectedProject.client} • {selectedProject.company}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedProject(null)}
                  className="text-charcoal/60 hover:text-charcoal"
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <h4 className="font-medium text-charcoal mb-2">Description</h4>
                  <p className="text-sm text-charcoal/80 leading-relaxed mb-4">
                    {selectedProject.description}
                  </p>
                  
                  <h4 className="font-medium text-charcoal mb-3">Tâches du projet</h4>
                  <div className="space-y-2">
                    {selectedProject.tasks.map((task, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-rose-powder/10">
                        <div className={`w-4 h-4 rounded-full ${task.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span className={`flex-1 ${task.completed ? 'text-charcoal/60 line-through' : 'text-charcoal'}`}>
                          {task.name}
                        </span>
                        {task.completed && <CheckCircle className="w-4 h-4 text-green-500" />}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-charcoal mb-3">Informations du projet</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-charcoal/60">Budget</span>
                      <span className="font-medium text-magenta">{selectedProject.budget.toLocaleString()}€</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-charcoal/60">Progression</span>
                      <span className="font-medium">{selectedProject.progress}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-charcoal/60">Début</span>
                      <span>{new Date(selectedProject.startDate).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-charcoal/60">Échéance</span>
                      <span>{new Date(selectedProject.deadline).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-charcoal/60">Statut</span>
                      <Badge className={statusConfig[selectedProject.status].color}>
                        {statusConfig[selectedProject.status].label}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Progress value={selectedProject.progress} className="h-3" />
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-rose-powder/20">
                <Button className="bg-gradient-rose text-white hover:opacity-90">
                  <Edit className="w-4 h-4 mr-2" />
                  Modifier Projet
                </Button>
                <Button variant="outline" className="border-magenta/20 text-magenta hover:bg-magenta/10">
                  <User className="w-4 h-4 mr-2" />
                  Contacter Client
                </Button>
                <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                  Générer Rapport
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}