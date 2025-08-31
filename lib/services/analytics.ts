import { prisma } from '@/lib/db/client';

// Types pour les analytics
export interface PageView {
  page: string;
  referrer?: string;
  userAgent?: string;
  sessionId: string;
  userId?: string;
  timestamp: Date;
  duration?: number;
}

export interface ConversionEvent {
  type: 'contact_form' | 'checkout' | 'newsletter' | 'download';
  value?: number;
  properties?: Record<string, any>;
  sessionId: string;
  userId?: string;
}

export interface PerformanceMetrics {
  page: string;
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
  sessionId: string;
}

export interface AnalyticsReport {
  period: {
    start: Date;
    end: Date;
  };
  pageViews: {
    total: number;
    unique: number;
    topPages: Array<{ page: string; views: number }>;
  };
  conversions: {
    total: number;
    rate: number;
    byType: Record<string, number>;
    value: number;
  };
  performance: {
    avgFCP: number;
    avgLCP: number;
    avgFID: number;
    avgCLS: number;
    avgTTFB: number;
    coreWebVitalsScore: number;
  };
  traffic: {
    sources: Array<{ source: string; visits: number; percentage: number }>;
    devices: Array<{ device: string; visits: number; percentage: number }>;
    browsers: Array<{ browser: string; visits: number; percentage: number }>;
  };
}

// Entrée d'événement utilisée par ce service (inclut sessionId, page, etc.)
interface AnalyticsEventInput {
  name: string;
  category: string;
  properties?: Record<string, any>;
  sessionId?: string;
  userId?: string;
  userAgent?: string;
  ipAddress?: string;
  referrer?: string;
  page?: string;
  timestamp?: Date;
}

/**
 * Classe principale pour les analytics
 */
export class AnalyticsService {
  private static instance: AnalyticsService;

  private constructor() {}

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  /**
   * Enregistrer un événement analytics
   */
  async trackEvent(event: AnalyticsEventInput): Promise<void> {
    try {
      await prisma.analyticsEvent.create({
        data: {
          name: event.name,
          category: event.category,
          properties: event.properties || {},
          sessionId: event.sessionId,
          userId: event.userId,
          userAgent: event.userAgent,
          ipAddress: event.ipAddress,
          referrer: event.referrer,
          page: event.page,
          createdAt: event.timestamp, // facultatif
        }
      });
    } catch (error) {
      console.error('Erreur tracking event:', error);
    }
  }

  /**
   * Enregistrer une page vue
   */
  async trackPageView(pageView: PageView): Promise<void> {
    await this.trackEvent({
      name: 'page_view',
      category: 'page_view',
      properties: {
        duration: pageView.duration,
      },
      sessionId: pageView.sessionId,
      userId: pageView.userId,
      userAgent: pageView.userAgent,
      referrer: pageView.referrer,
      page: pageView.page,
      timestamp: pageView.timestamp,
    });
  }

  /**
   * Enregistrer une conversion
   */
  async trackConversion(conversion: ConversionEvent): Promise<void> {
    await this.trackEvent({
      name: `conversion_${conversion.type}`,
      category: 'form_submission',
      properties: {
        value: conversion.value,
        ...conversion.properties,
      },
      sessionId: conversion.sessionId,
      userId: conversion.userId,
      timestamp: new Date(),
    });
  }

  /**
   * Enregistrer des métriques de performance
   */
  async trackPerformance(metrics: PerformanceMetrics): Promise<void> {
    await this.trackEvent({
      name: 'performance_metrics',
      category: 'page_view',
      properties: {
        fcp: metrics.fcp,
        lcp: metrics.lcp,
        fid: metrics.fid,
        cls: metrics.cls,
        ttfb: metrics.ttfb,
        coreWebVitalsScore: this.calculateCoreWebVitalsScore(metrics),
      },
      sessionId: metrics.sessionId,
      page: metrics.page,
      timestamp: new Date(),
    });
  }

  /**
   * Calculer le score Core Web Vitals
   */
  private calculateCoreWebVitalsScore(metrics: PerformanceMetrics): number {
    let score = 0;
    
    // LCP (Largest Contentful Paint)
    if (metrics.lcp <= 2500) score += 33;
    else if (metrics.lcp <= 4000) score += 16;
    
    // FID (First Input Delay)
    if (metrics.fid <= 100) score += 33;
    else if (metrics.fid <= 300) score += 16;
    
    // CLS (Cumulative Layout Shift)
    if (metrics.cls <= 0.1) score += 34;
    else if (metrics.cls <= 0.25) score += 17;
    
    return score;
  }

  /**
   * Générer un rapport d'analytics
   */
  async generateReport(
    startDate: Date,
    endDate: Date
  ): Promise<AnalyticsReport> {
    const [
      pageViewsData,
      conversionsData,
      performanceData,
      trafficData
    ] = await Promise.all([
      this.getPageViewsData(startDate, endDate),
      this.getConversionsData(startDate, endDate),
      this.getPerformanceData(startDate, endDate),
      this.getTrafficData(startDate, endDate),
    ]);

    return {
      period: { start: startDate, end: endDate },
      pageViews: pageViewsData,
      conversions: conversionsData,
      performance: performanceData,
      traffic: trafficData,
    };
  }

  /**
   * Obtenir les données de pages vues
   */
  private async getPageViewsData(startDate: Date, endDate: Date) {
    const pageViews = await prisma.analyticsEvent.findMany({
      where: {
        name: 'page_view',
        createdAt: { gte: startDate, lte: endDate },
      },
      select: {
        page: true,
        sessionId: true,
      },
    });

    const total = pageViews.length;
    const unique = new Set(pageViews.map(pv => pv.sessionId)).size;
    
    const pageCount = pageViews.reduce((acc, pv) => {
      acc[pv.page || '/'] = (acc[pv.page || '/'] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topPages = Object.entries(pageCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([page, views]) => ({ page, views }));

    return { total, unique, topPages };
  }

  /**
   * Obtenir les données de conversions
   */
  private async getConversionsData(startDate: Date, endDate: Date) {
    const conversions = await prisma.analyticsEvent.findMany({
      where: {
        category: 'form_submission',
        createdAt: { gte: startDate, lte: endDate },
      },
      select: {
        name: true,
        properties: true,
      },
    });

    const total = conversions.length;
    
    const byType = conversions.reduce((acc, conv) => {
      acc[conv.name] = (acc[conv.name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const value = conversions.reduce((acc, conv) => {
      const convValue = (conv.properties as any)?.value || 0;
      return acc + (typeof convValue === 'number' ? convValue : 0);
    }, 0);

    // Calculer le taux de conversion (conversions / sessions uniques)
    const sessions = await prisma.analyticsEvent.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
      },
      select: { sessionId: true },
      distinct: ['sessionId'],
    });

    const rate = sessions.length > 0 ? (total / sessions.length) * 100 : 0;

    return { total, rate, byType, value };
  }

  /**
   * Obtenir les données de performance
   */
  private async getPerformanceData(startDate: Date, endDate: Date) {
    const performanceEvents = await prisma.analyticsEvent.findMany({
      where: {
        name: 'performance_metrics',
        createdAt: { gte: startDate, lte: endDate },
      },
      select: {
        properties: true,
      },
    });

    if (performanceEvents.length === 0) {
      return {
        avgFCP: 0,
        avgLCP: 0,
        avgFID: 0,
        avgCLS: 0,
        avgTTFB: 0,
        coreWebVitalsScore: 0,
      };
    }

    const metrics = performanceEvents.map(e => e.properties as any);
    
    const avgFCP = metrics.reduce((acc, m) => acc + (m.fcp || 0), 0) / metrics.length;
    const avgLCP = metrics.reduce((acc, m) => acc + (m.lcp || 0), 0) / metrics.length;
    const avgFID = metrics.reduce((acc, m) => acc + (m.fid || 0), 0) / metrics.length;
    const avgCLS = metrics.reduce((acc, m) => acc + (m.cls || 0), 0) / metrics.length;
    const avgTTFB = metrics.reduce((acc, m) => acc + (m.ttfb || 0), 0) / metrics.length;
    const coreWebVitalsScore = metrics.reduce((acc, m) => acc + (m.coreWebVitalsScore || 0), 0) / metrics.length;

    return {
      avgFCP: Math.round(avgFCP),
      avgLCP: Math.round(avgLCP),
      avgFID: Math.round(avgFID),
      avgCLS: Math.round(avgCLS * 1000) / 1000,
      avgTTFB: Math.round(avgTTFB),
      coreWebVitalsScore: Math.round(coreWebVitalsScore),
    };
  }

  /**
   * Obtenir les données de trafic
   */
  private async getTrafficData(startDate: Date, endDate: Date) {
    const events = await prisma.analyticsEvent.findMany({
      where: {
        name: 'page_view',
        createdAt: { gte: startDate, lte: endDate },
      },
      select: {
        referrer: true,
        userAgent: true,
        sessionId: true,
      },
    });

    const totalSessions = new Set(events.map(e => e.sessionId)).size;

    // Sources de trafic
    const sourceCount = events.reduce((acc, event) => {
      let source = 'Direct';
      if (event.referrer) {
        try {
          const url = new URL(event.referrer);
          if (url.hostname.includes('google')) source = 'Google';
          else if (url.hostname.includes('facebook')) source = 'Facebook';
          else if (url.hostname.includes('linkedin')) source = 'LinkedIn';
          else if (url.hostname.includes('twitter')) source = 'Twitter';
          else source = 'Referral';
        } catch {
          source = 'Referral';
        }
      }
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const sources = Object.entries(sourceCount)
      .map(([source, visits]) => ({
        source,
        visits,
        percentage: Math.round((visits / totalSessions) * 100),
      }))
      .sort((a, b) => b.visits - a.visits);

    // Appareils
    const deviceCount = events.reduce((acc, event) => {
      let device = 'Desktop';
      if (event.userAgent) {
        if (/Mobile|Android|iPhone|iPad/.test(event.userAgent)) {
          device = /iPad/.test(event.userAgent) ? 'Tablet' : 'Mobile';
        }
      }
      acc[device] = (acc[device] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const devices = Object.entries(deviceCount)
      .map(([device, visits]) => ({
        device,
        visits,
        percentage: Math.round((visits / totalSessions) * 100),
      }))
      .sort((a, b) => b.visits - a.visits);

    // Navigateurs
    const browserCount = events.reduce((acc, event) => {
      let browser = 'Unknown';
      if (event.userAgent) {
        if (event.userAgent.includes('Chrome')) browser = 'Chrome';
        else if (event.userAgent.includes('Firefox')) browser = 'Firefox';
        else if (event.userAgent.includes('Safari')) browser = 'Safari';
        else if (event.userAgent.includes('Edge')) browser = 'Edge';
      }
      acc[browser] = (acc[browser] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const browsers = Object.entries(browserCount)
      .map(([browser, visits]) => ({
        browser,
        visits,
        percentage: Math.round((visits / totalSessions) * 100),
      }))
      .sort((a, b) => b.visits - a.visits);

    return { sources, devices, browsers };
  }

  /**
   * Obtenir les métriques en temps réel
   */
  async getRealTimeMetrics(): Promise<{
    activeUsers: number;
    pageViewsLast24h: number;
    conversionsToday: number;
    topPagesNow: Array<{ page: string; views: number }>;
  }> {
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [activeUsers, pageViewsLast24h, conversionsToday, topPagesData] = await Promise.all([
      // Utilisateurs actifs (dernière heure)
      prisma.analyticsEvent.findMany({
        where: {
          createdAt: { gte: new Date(now.getTime() - 60 * 60 * 1000) },
        },
        select: { sessionId: true },
        distinct: ['sessionId'],
      }),
      
      // Pages vues dernières 24h
      prisma.analyticsEvent.count({
        where: {
          name: 'page_view',
          createdAt: { gte: last24h },
        },
      }),
      
      // Conversions aujourd'hui
      prisma.analyticsEvent.count({
        where: {
          category: 'form_submission',
          createdAt: { gte: today },
        },
      }),
      
      // Top pages maintenant
      prisma.analyticsEvent.findMany({
        where: {
          name: 'page_view',
          createdAt: { gte: last24h },
        },
        select: { page: true },
      }),
    ]);

    const topPagesCount = topPagesData.reduce((acc, pv) => {
      acc[pv.page || '/'] = (acc[pv.page || '/'] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topPagesNow = Object.entries(topPagesCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([page, views]) => ({ page, views }));

    return {
      activeUsers: activeUsers.length,
      pageViewsLast24h,
      conversionsToday,
      topPagesNow,
    };
  }
}

// Instance globale
export const analytics = AnalyticsService.getInstance();

// Fonction helper pour tracker depuis le client
export async function trackEvent(
  name: string,
  category: string,
  properties?: Record<string, any>
): Promise<void> {
  try {
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        category,
        properties,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (error) {
    console.error('Erreur tracking côté client:', error);
  }
}

// Hook React pour les analytics
export function useAnalytics() {
  const trackPageView = (page: string) => {
    trackEvent('page_view', 'page_view', { page });
  };

  const trackConversion = (type: string, value?: number) => {
    trackEvent(`conversion_${type}`, 'form_submission', { value });
  };

  const trackInteraction = (element: string, action: string) => {
    trackEvent('user_interaction', 'user_interaction', { element, action });
  };

  return {
    trackPageView,
    trackConversion,
    trackInteraction,
  };
}

