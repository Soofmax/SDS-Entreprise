'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Eye, 
  MousePointer, 
  Clock, 
  Globe,
  Smartphone,
  Monitor,
  Calendar,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';

// Données de démonstration
const pageViewsData = [
  { name: 'Lun', views: 1200, users: 800 },
  { name: 'Mar', views: 1900, users: 1200 },
  { name: 'Mer', views: 1600, users: 1000 },
  { name: 'Jeu', views: 2200, users: 1400 },
  { name: 'Ven', views: 2800, users: 1800 },
  { name: 'Sam', views: 1800, users: 1100 },
  { name: 'Dim', views: 1400, users: 900 },
];

const topPagesData = [
  { page: '/', views: 5420, bounce: 32 },
  { page: '/services', views: 3280, bounce: 28 },
  { page: '/portfolio', views: 2150, bounce: 35 },
  { page: '/contact', views: 1890, bounce: 22 },
  { page: '/a-propos', views: 1240, bounce: 40 },
];

const deviceData = [
  { name: 'Desktop', value: 45, color: '#ec4899' },
  { name: 'Mobile', value: 40, color: '#f97316' },
  { name: 'Tablet', value: 15, color: '#8b5cf6' },
];

const trafficSourceData = [
  { source: 'Recherche organique', sessions: 3420, percentage: 45 },
  { source: 'Accès direct', sessions: 2280, percentage: 30 },
  { source: 'Réseaux sociaux', sessions: 1140, percentage: 15 },
  { source: 'Email', sessions: 760, percentage: 10 },
];

const conversionData = [
  { name: 'Jan', conversions: 12, taux: 2.4 },
  { name: 'Fév', conversions: 18, taux: 3.2 },
  { name: 'Mar', conversions: 25, taux: 4.1 },
  { name: 'Avr', conversions: 22, taux: 3.8 },
  { name: 'Mai', conversions: 31, taux: 4.9 },
  { name: 'Jun', conversions: 28, taux: 4.3 },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simuler un appel API
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const handleExport = () => {
    // Simuler l'export des données
    const data = {
      period: timeRange,
      exported_at: new Date().toISOString(),
      metrics: {
        page_views: 12680,
        unique_visitors: 8420,
        bounce_rate: 32.5,
        avg_session_duration: '2m 34s',
      }
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-gray-900 dark:text-white mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Suivez les performances de votre site en temps réel
            </p>
          </div>
          
          <div className="flex items-center gap-4 mt-4 lg:mt-0">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            >
              <option value="1d">Aujourd'hui</option>
              <option value="7d">7 derniers jours</option>
              <option value="30d">30 derniers jours</option>
              <option value="90d">3 derniers mois</option>
            </select>
            
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Actualiser
            </button>
            
            <button
              onClick={handleExport}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Exporter
            </button>
          </div>
        </div>

        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-rose-100 dark:border-rose-900">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-magenta-600 rounded-xl flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <span className="text-green-500 text-sm font-semibold">+12.5%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">12,680</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Pages vues</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-rose-100 dark:border-rose-900">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <span className="text-green-500 text-sm font-semibold">+8.3%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">8,420</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Visiteurs uniques</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-rose-100 dark:border-rose-900">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center">
                <MousePointer className="w-6 h-6 text-white" />
              </div>
              <span className="text-red-500 text-sm font-semibold">-2.1%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">32.5%</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Taux de rebond</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-rose-100 dark:border-rose-900">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <span className="text-green-500 text-sm font-semibold">+5.7%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">2m 34s</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Durée moyenne</p>
          </div>
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Vues de pages */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-rose-100 dark:border-rose-900">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Évolution du trafic
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={pageViewsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#ec4899" 
                  fill="url(#colorViews)" 
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#3b82f6" 
                  fill="url(#colorUsers)" 
                  strokeWidth={2}
                />
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Répartition des appareils */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-rose-100 dark:border-rose-900">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Répartition par appareil
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-4">
              {deviceData.map((device, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: device.color }}
                  ></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {device.name} ({device.value}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Conversions */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-rose-100 dark:border-rose-900 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Conversions mensuelles
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={conversionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }} 
              />
              <Bar dataKey="conversions" fill="#ec4899" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tableaux */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pages les plus visitées */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-rose-100 dark:border-rose-900">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Pages les plus visitées
            </h3>
            <div className="space-y-4">
              {topPagesData.map((page, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{page.page}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Rebond: {page.bounce}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">{page.views.toLocaleString()}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">vues</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sources de trafic */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-rose-100 dark:border-rose-900">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Sources de trafic
            </h3>
            <div className="space-y-4">
              {trafficSourceData.map((source, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{source.source}</p>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
                      <div 
                        className="bg-rose-500 h-2 rounded-full" 
                        style={{ width: `${source.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-semibold text-gray-900 dark:text-white">{source.sessions.toLocaleString()}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{source.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

