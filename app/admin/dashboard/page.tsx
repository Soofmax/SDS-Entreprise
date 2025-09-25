'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { 
  Users, 
  Mail, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  Eye,
  Phone,
  MessageSquare,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

// Types pour les données du dashboard
interface DashboardStats {
  contacts: {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
    conversionRate: number;
  };
  projects: {
    active: number;
    completed: number;
    revenue: number;
    avgValue: number;
  };
  performance: {
    responseTime: number;
    satisfaction: number;
    repeatClients: number;
  };
}

interface RecentContact {
  id: string;
  name: string;
  email: string;
  projectType: string;
  budget: string;
  status: string;
  createdAt: string;
  priority: string;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
  }[];
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentContacts, setRecentContacts] = useState<RecentContact[]>([]);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  // Charger les données du dashboard (les hooks doivent être appelés avant tout return conditionnel)
  useEffect(() => {
    // Ne pas charger tant que non authentifié
    if (status !== 'authenticated' || !session || session.user.role !== 'ADMIN') {
      return;
    }

    async function loadDashboardData() {
      try {
        setLoading(true);
        
        const [statsRes, contactsRes, chartRes] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/admin/contacts/recent'),
          fetch(`/api/admin/analytics/chart?range=${timeRange}`)
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData.data);
        }

        if (contactsRes.ok) {
          const contactsData = await contactsRes.json();
          setRecentContacts(contactsData.data);
        }

        if (chartRes.ok) {
          const chartData = await chartRes.json();
          setChartData(chartData.data);
        }

      } catch (error) {
        console.error('Erreur chargement dashboard:', error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [timeRange, status, session]);

  // Redirection si non authentifié
  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-magenta"></div>
    </div>;
  }

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/signin');
  }

  if (loading) {
    return <AdminDashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-white border-b border-rose-powder/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-playfair font-bold text-charcoal">
                Dashboard Admin
              </h1>
              <p className="text-charcoal/70 mt-1">
                Bienvenue, {session.user.name}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-rose-powder/30 rounded-xl focus:ring-2 focus:ring-magenta/20"
              >
                <option value="7d">7 derniers jours</option>
                <option value="30d">30 derniers jours</option>
                <option value="90d">90 derniers jours</option>
                <option value="1y">Cette année</option>
              </select>
              
              <button className="bg-gradient-rose text-white px-6 py-2 rounded-xl hover:opacity-90 transition-opacity">
                Exporter
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Contacts Total"
            value={stats?.contacts.total || 0}
            change={`+${stats?.contacts.today || 0} aujourd'hui`}
            icon={<Users className="w-6 h-6" />}
            color="blue"
          />
          
          <StatsCard
            title="Projets Actifs"
            value={stats?.projects.active || 0}
            change={`${stats?.projects.completed || 0} terminés`}
            icon={<Activity className="w-6 h-6" />}
            color="green"
          />
          
          <StatsCard
            title="Chiffre d'Affaires"
            value={`${stats?.projects.revenue || 0}€`}
            change={`Moy: ${stats?.projects.avgValue || 0}€`}
            icon={<DollarSign className="w-6 h-6" />}
            color="purple"
          />
          
          <StatsCard
            title="Taux de Conversion"
            value={`${stats?.contacts.conversionRate || 0}%`}
            change={`${stats?.performance.satisfaction || 0}% satisfaction`}
            icon={<TrendingUp className="w-6 h-6" />}
            color="rose"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Graphique principal */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-6 shadow-rose border border-rose-powder/30">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-playfair font-bold text-charcoal">
                  Évolution des Contacts
                </h3>
                <div className="flex space-x-2">
                  <button className="p-2 text-charcoal/70 hover:text-charcoal">
                    <BarChart3 className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-charcoal/70 hover:text-charcoal">
                    <PieChart className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {chartData ? (
                <ContactsChart data={chartData} />
              ) : (
                <div className="h-64 flex items-center justify-center text-charcoal/50">
                  Aucune donnée disponible
                </div>
              )}
            </div>
          </div>

          {/* Contacts récents */}
          <div>
            <div className="bg-white rounded-3xl p-6 shadow-rose border border-rose-powder/30">
              <h3 className="text-xl font-playfair font-bold text-charcoal mb-6">
                Contacts Récents
              </h3>
              
              <div className="space-y-4">
                {recentContacts.map((contact) => (
                  <ContactCard key={contact.id} contact={contact} />
                ))}
              </div>
              
              <button className="w-full mt-4 text-magenta hover:text-magenta/80 font-medium">
                Voir tous les contacts →
              </button>
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="mt-8">
          <h3 className="text-xl font-playfair font-bold text-charcoal mb-6">
            Actions Rapides
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <QuickAction
              title="Nouveau Contact"
              icon={<Users className="w-6 h-6" />}
              href="/admin/contacts/new"
            />
            <QuickAction
              title="Ajouter Projet"
              icon={<Calendar className="w-6 h-6" />}
              href="/admin/projects/new"
            />
            <QuickAction
              title="Envoyer Email"
              icon={<Mail className="w-6 h-6" />}
              href="/admin/emails/compose"
            />
            <QuickAction
              title="Voir Analytics"
              icon={<BarChart3 className="w-6 h-6" />}
              href="/admin/analytics"
            />
            <QuickAction
              title="Gérer Portfolio"
              icon={<Eye className="w-6 h-6" />}
              href="/admin/portfolio"
            />
            <QuickAction
              title="Paramètres"
              icon={<Activity className="w-6 h-6" />}
              href="/admin/settings"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant pour les cartes de statistiques
function StatsCard({ 
  title, 
  value, 
  change, 
  icon, 
  color 
}: {
  title: string;
  value: string | number;
  change: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'rose';
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    rose: 'bg-rose-100 text-rose-600',
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-rose border border-rose-powder/30">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-charcoal/70 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-charcoal mt-1">{value}</p>
          <p className="text-charcoal/50 text-xs mt-1">{change}</p>
        </div>
        <div className={`p-3 rounded-2xl ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// Composant pour les contacts récents
function ContactCard({ contact }: { contact: RecentContact }) {
  const statusColors = {
    NEW: 'bg-blue-100 text-blue-800',
    CONTACTED: 'bg-yellow-100 text-yellow-800',
    QUALIFIED: 'bg-green-100 text-green-800',
    WON: 'bg-emerald-100 text-emerald-800',
    LOST: 'bg-red-100 text-red-800',
  };

  const priorityIcons = {
    LOW: <Clock className="w-3 h-3" />,
    MEDIUM: <AlertCircle className="w-3 h-3" />,
    HIGH: <Star className="w-3 h-3" />,
    URGENT: <Star className="w-3 h-3 text-red-500" />,
  };

  return (
    <div className="flex items-center space-x-3 p-3 hover:bg-cream/50 rounded-xl transition-colors">
      <div className="w-10 h-10 bg-gradient-rose rounded-full flex items-center justify-center text-white font-bold">
        {contact.name.charAt(0).toUpperCase()}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="font-medium text-charcoal truncate">{contact.name}</p>
        <p className="text-xs text-charcoal/70 truncate">{contact.email}</p>
        <div className="flex items-center space-x-2 mt-1">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[contact.status as keyof typeof statusColors]}`}>
            {contact.status}
          </span>
          <span className="text-charcoal/50">
            {priorityIcons[contact.priority as keyof typeof priorityIcons]}
          </span>
        </div>
      </div>
    </div>
  );
}

// Composant pour les actions rapides
function QuickAction({ 
  title, 
  icon, 
  href 
}: {
  title: string;
  icon: React.ReactNode;
  href: string;
}) {
  return (
    <a
      href={href}
      className="flex flex-col items-center p-4 bg-white rounded-2xl shadow-rose border border-rose-powder/30 hover:shadow-rose-lg transition-all duration-300 group"
    >
      <div className="p-3 bg-gradient-rose text-white rounded-xl group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <span className="text-sm font-medium text-charcoal mt-2 text-center">
        {title}
      </span>
    </a>
  );
}

// Composant graphique (simplifié)
function ContactsChart({ data }: { data: ChartData }) {
  return (
    <div className="h-64 flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl font-bold text-magenta mb-2">
          {data.datasets[0]?.data.reduce((a, b) => a + b, 0) || 0}
        </div>
        <div className="text-charcoal/70">
          Contacts ce mois
        </div>
      </div>
    </div>
  );
}

// Skeleton de chargement
function AdminDashboardSkeleton() {
  return (
    <div className="min-h-screen bg-cream animate-pulse">
      <div className="bg-white border-b border-rose-powder/30 h-24"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 h-32"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-3xl h-96"></div>
          <div className="bg-white rounded-3xl h-96"></div>
        </div>
      </div>
    </div>
  );
}

