// Analytics en temps réel pour SDS
import { trackEvent } from './gtag';
import { useEffect, useState } from 'react';

export interface RealTimeMetrics {
  activeUsers: number;
  pageViews: number;
  topPages: Array<{ page: string; views: number }>;
  topSources: Array<{ source: string; users: number }>;
  events: Array<{ event: string; count: number }>;
  lastUpdated: Date;
}

export interface AnalyticsEvent {
  timestamp: Date;
  event: string;
  page: string;
  user_id?: string;
  session_id: string;
  properties: Record<string, any>;
}

class RealTimeAnalytics {
  private events: AnalyticsEvent[] = [];
  private metrics: RealTimeMetrics = {
    activeUsers: 0,
    pageViews: 0,
    topPages: [],
    topSources: [],
    events: [],
    lastUpdated: new Date(),
  };

  private listeners: Array<(metrics: RealTimeMetrics) => void> = [];

  constructor() {
    // Nettoyer les anciens événements toutes les minutes
    setInterval(() => {
      this.cleanOldEvents();
      this.updateMetrics();
    }, 60000);
  }

  // Ajouter un événement
  addEvent(event: Omit<AnalyticsEvent, 'timestamp'>) {
    const analyticsEvent: AnalyticsEvent = {
      ...event,
      timestamp: new Date(),
    };

    this.events.push(analyticsEvent);
    this.updateMetrics();
    this.notifyListeners();

    // Envoyer à Google Analytics si configuré
    if (event.event !== 'page_view') {
      trackEvent({
        action: event.event,
        category: 'realtime',
        label: event.page,
        custom_parameters: event.properties,
      });
    }
  }

  // Nettoyer les événements de plus de 30 minutes
  private cleanOldEvents() {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    this.events = this.events.filter(event => event.timestamp > thirtyMinutesAgo);
  }

  // Mettre à jour les métriques
  private updateMetrics() {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    
    // Événements des 5 dernières minutes
    const recentEvents = this.events.filter(event => event.timestamp > fiveMinutesAgo);
    
    // Utilisateurs actifs (sessions uniques dans les 5 dernières minutes)
    const activeSessions = new Set(recentEvents.map(e => e.session_id));
    this.metrics.activeUsers = activeSessions.size;

    // Pages vues
    this.metrics.pageViews = recentEvents.filter(e => e.event === 'page_view').length;

    // Top pages
    const pageViews = new Map<string, number>();
    recentEvents
      .filter(e => e.event === 'page_view')
      .forEach(e => {
        pageViews.set(e.page, (pageViews.get(e.page) || 0) + 1);
      });
    
    this.metrics.topPages = Array.from(pageViews.entries())
      .map(([page, views]) => ({ page, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    // Top sources (simulé pour la démo)
    this.metrics.topSources = [
      { source: 'Recherche organique', users: Math.floor(this.metrics.activeUsers * 0.4) },
      { source: 'Accès direct', users: Math.floor(this.metrics.activeUsers * 0.3) },
      { source: 'Réseaux sociaux', users: Math.floor(this.metrics.activeUsers * 0.2) },
      { source: 'Email', users: Math.floor(this.metrics.activeUsers * 0.1) },
    ];

    // Top événements
    const eventCounts = new Map<string, number>();
    recentEvents
      .filter(e => e.event !== 'page_view')
      .forEach(e => {
        eventCounts.set(e.event, (eventCounts.get(e.event) || 0) + 1);
      });
    
    this.metrics.events = Array.from(eventCounts.entries())
      .map(([event, count]) => ({ event, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    this.metrics.lastUpdated = now;
  }

  // Ajouter un listener pour les mises à jour
  addListener(callback: (metrics: RealTimeMetrics) => void) {
    this.listeners.push(callback);
    // Envoyer immédiatement les métriques actuelles
    callback(this.metrics);
  }

  // Supprimer un listener
  removeListener(callback: (metrics: RealTimeMetrics) => void) {
    this.listeners = this.listeners.filter(l => l !== callback);
  }

  // Notifier tous les listeners
  private notifyListeners() {
    this.listeners.forEach(callback => callback(this.metrics));
  }

  // Obtenir les métriques actuelles
  getMetrics(): RealTimeMetrics {
    return { ...this.metrics };
  }

  // Méthodes de tracking spécifiques
  trackPageView(page: string, sessionId: string, properties: Record<string, any> = {}) {
    this.addEvent({
      event: 'page_view',
      page,
      session_id: sessionId,
      properties,
    });
  }

  trackFormSubmit(formType: string, page: string, sessionId: string, properties: Record<string, any> = {}) {
    this.addEvent({
      event: 'form_submit',
      page,
      session_id: sessionId,
      properties: { form_type: formType, ...properties },
    });
  }

  trackButtonClick(buttonName: string, page: string, sessionId: string, properties: Record<string, any> = {}) {
    this.addEvent({
      event: 'button_click',
      page,
      session_id: sessionId,
      properties: { button_name: buttonName, ...properties },
    });
  }

  trackCalculatorUsage(result: number, page: string, sessionId: string, properties: Record<string, any> = {}) {
    this.addEvent({
      event: 'calculator_used',
      page,
      session_id: sessionId,
      properties: { result, ...properties },
    });
  }

  trackPackageSelection(packageName: string, price: number, page: string, sessionId: string) {
    this.addEvent({
      event: 'package_selected',
      page,
      session_id: sessionId,
      properties: { package_name: packageName, price },
    });
  }

  // Obtenir des statistiques détaillées
  getDetailedStats(timeRange: '5m' | '30m' | '1h' | '24h' = '30m') {
    const now = new Date();
    const timeRanges = {
      '5m': 5 * 60 * 1000,
      '30m': 30 * 60 * 1000,
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
    };
    
    const cutoff = new Date(now.getTime() - timeRanges[timeRange]);
    const filteredEvents = this.events.filter(event => event.timestamp > cutoff);
    
    return {
      totalEvents: filteredEvents.length,
      uniqueSessions: new Set(filteredEvents.map(e => e.session_id)).size,
      eventsByType: this.groupEventsByType(filteredEvents),
      eventsByPage: this.groupEventsByPage(filteredEvents),
      timeline: this.createTimeline(filteredEvents, timeRange),
    };
  }

  private groupEventsByType(events: AnalyticsEvent[]) {
    const groups = new Map<string, number>();
    events.forEach(event => {
      groups.set(event.event, (groups.get(event.event) || 0) + 1);
    });
    return Array.from(groups.entries()).map(([event, count]) => ({ event, count }));
  }

  private groupEventsByPage(events: AnalyticsEvent[]) {
    const groups = new Map<string, number>();
    events.forEach(event => {
      groups.set(event.page, (groups.get(event.page) || 0) + 1);
    });
    return Array.from(groups.entries()).map(([page, count]) => ({ page, count }));
  }

  private createTimeline(events: AnalyticsEvent[], timeRange: string) {
    const bucketSize = timeRange === '5m' ? 30000 : timeRange === '30m' ? 120000 : 300000; // 30s, 2min, 5min
    const buckets = new Map<number, number>();
    
    events.forEach(event => {
      const bucket = Math.floor(event.timestamp.getTime() / bucketSize) * bucketSize;
      buckets.set(bucket, (buckets.get(bucket) || 0) + 1);
    });
    
    return Array.from(buckets.entries())
      .map(([timestamp, count]) => ({ timestamp: new Date(timestamp), count }))
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }
}

// Instance singleton
export const realTimeAnalytics = new RealTimeAnalytics();

// Hook pour React
export function useRealTimeAnalytics() {
  const [metrics, setMetrics] = useState<RealTimeMetrics>(realTimeAnalytics.getMetrics());

  useEffect(() => {
    const callback = (newMetrics: RealTimeMetrics) => {
      setMetrics(newMetrics);
    };

    realTimeAnalytics.addListener(callback);
    
    return () => {
      realTimeAnalytics.removeListener(callback);
    };
  }, []);

  return {
    metrics,
    trackPageView: realTimeAnalytics.trackPageView.bind(realTimeAnalytics),
    trackFormSubmit: realTimeAnalytics.trackFormSubmit.bind(realTimeAnalytics),
    trackButtonClick: realTimeAnalytics.trackButtonClick.bind(realTimeAnalytics),
    trackCalculatorUsage: realTimeAnalytics.trackCalculatorUsage.bind(realTimeAnalytics),
    trackPackageSelection: realTimeAnalytics.trackPackageSelection.bind(realTimeAnalytics),
    getDetailedStats: realTimeAnalytics.getDetailedStats.bind(realTimeAnalytics),
  };
}

