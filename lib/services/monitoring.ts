import { prisma } from '@/lib/db/client';
import { AppError } from '@/lib/types';

// Types pour le monitoring
export interface HealthCheck {
  service: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime: number;
  timestamp: Date;
  details?: Record<string, any>;
}

export interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  timestamp: Date;
  resolved: boolean;
  metadata?: Record<string, any>;
}

export interface SystemMetrics {
  timestamp: Date;
  cpu: number;
  memory: number;
  disk: number;
  network: {
    incoming: number;
    outgoing: number;
  };
  database: {
    connections: number;
    queryTime: number;
  };
  api: {
    requestsPerMinute: number;
    averageResponseTime: number;
    errorRate: number;
  };
}

/**
 * Classe principale pour le monitoring
 */
export class MonitoringService {
  private static instance: MonitoringService;
  private alerts: Alert[] = [];
  private healthChecks: Map<string, HealthCheck> = new Map();

  private constructor() {
    // Démarrer les vérifications périodiques
    this.startPeriodicChecks();
  }

  static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  /**
   * Vérifier la santé d'un service
   */
  async checkHealth(serviceName: string): Promise<HealthCheck> {
    const startTime = Date.now();
    let status: HealthCheck['status'] = 'healthy';
    let details: Record<string, any> = {};

    try {
      switch (serviceName) {
        case 'database':
          await this.checkDatabaseHealth();
          break;
          
        case 'api':
          await this.checkApiHealth();
          break;
          
        case 'email':
          await this.checkEmailHealth();
          break;
          
        case 'storage':
          await this.checkStorageHealth();
          break;
          
        default:
          throw new Error(`Service inconnu: ${serviceName}`);
      }
    } catch (error) {
      status = 'unhealthy';
      details.error = error instanceof Error ? error.message : 'Erreur inconnue';
    }

    const responseTime = Date.now() - startTime;
    
    // Déterminer le statut basé sur le temps de réponse
    if (status === 'healthy' && responseTime > 5000) {
      status = 'degraded';
    }

    const healthCheck: HealthCheck = {
      service: serviceName,
      status,
      responseTime,
      timestamp: new Date(),
      details,
    };

    this.healthChecks.set(serviceName, healthCheck);
    
    // Créer une alerte si le service est en panne
    if (status === 'unhealthy') {
      await this.createAlert({
        type: 'error',
        title: `Service ${serviceName} en panne`,
        message: `Le service ${serviceName} ne répond pas correctement`,
        severity: 'high',
        source: 'health_check',
        metadata: { service: serviceName, details },
      });
    }

    return healthCheck;
  }

  /**
   * Vérifier la santé de la base de données
   */
  private async checkDatabaseHealth(): Promise<void> {
    await prisma.$queryRaw`SELECT 1`;
    
    // Vérifier les connexions actives
    const result = await prisma.$queryRaw`
      SELECT count(*) as connections 
      FROM pg_stat_activity 
      WHERE state = 'active'
    ` as any[];
    
    const connections = parseInt(result[0]?.connections || '0');
    
    if (connections > 50) {
      throw new Error(`Trop de connexions actives: ${connections}`);
    }
  }

  /**
   * Vérifier la santé de l'API
   */
  private async checkApiHealth(): Promise<void> {
    // Vérifier les erreurs récentes
    const recentErrors = await prisma.errorLog.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes
        },
        severity: 'critical',
      },
    });

    if (recentErrors > 10) {
      throw new Error(`Trop d'erreurs critiques récentes: ${recentErrors}`);
    }
  }

  /**
   * Vérifier la santé du service email
   */
  private async checkEmailHealth(): Promise<void> {
    // Simuler une vérification email
    // En production, on pourrait envoyer un email de test
    if (!process.env.RESEND_API_KEY) {
      throw new Error('Clé API Resend manquante');
    }
  }

  /**
   * Vérifier la santé du stockage
   */
  private async checkStorageHealth(): Promise<void> {
    // Vérifier l'espace disque disponible
    // En production, on utiliserait des APIs système
    const freeSpace = 85; // Pourcentage d'utilisation simulé
    
    if (freeSpace > 90) {
      throw new Error(`Espace disque faible: ${freeSpace}% utilisé`);
    }
  }

  /**
   * Créer une alerte
   */
  async createAlert(alertData: Omit<Alert, 'id' | 'timestamp' | 'resolved'>): Promise<Alert> {
    const alert: Alert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      resolved: false,
      ...alertData,
    };

    this.alerts.push(alert);

    // Enregistrer en base de données
    try {
      await prisma.errorLog.create({
        data: {
          code: `ALERT_${alert.type.toUpperCase()}`,
          message: alert.message,
          severity: alert.severity,
          details: {
            alertId: alert.id,
            title: alert.title,
            source: alert.source,
            metadata: alert.metadata,
          },
        },
      });
    } catch (error) {
      console.error('Erreur sauvegarde alerte:', error);
    }

    // Envoyer des notifications selon la gravité
    if (alert.severity === 'critical' || alert.severity === 'high') {
      await this.sendAlertNotification(alert);
    }

    return alert;
  }

  /**
   * Résoudre une alerte
   */
  async resolveAlert(alertId: string): Promise<void> {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
    }

    // Mettre à jour en base: marquer l'alerte comme résolue dans le JSON details
    try {
      const logs = await prisma.errorLog.findMany({
        where: {
          details: {
            path: ['alertId'],
            equals: alertId,
          },
        },
        select: { id: true, details: true },
      });

      for (const log of logs) {
        const merged = JSON.parse(JSON.stringify({ ...(log.details as any), resolved: true }));
        await prisma.errorLog.update({
          where: { id: log.id },
          data: { details: merged as any },
        });
      }
    } catch (error) {
      console.error('Erreur résolution alerte:', error);
    }
  }

  /**
   * Envoyer une notification d'alerte
   */
  private async sendAlertNotification(alert: Alert): Promise<void> {
    // En production, on enverrait des emails, SMS, ou notifications Slack
    console.error(`🚨 ALERTE ${alert.severity.toUpperCase()}: ${alert.title}`);
    console.error(`Message: ${alert.message}`);
    console.error(`Source: ${alert.source}`);
    
    // TODO: Intégrer avec des services de notification
    // - Email aux administrateurs
    // - Webhook Slack/Discord
    // - SMS pour les alertes critiques
  }

  /**
   * Obtenir toutes les alertes actives
   */
  getActiveAlerts(): Alert[] {
    return this.alerts.filter(alert => !alert.resolved);
  }

  /**
   * Obtenir le statut global du système
   */
  getSystemStatus(): {
    status: 'healthy' | 'degraded' | 'unhealthy';
    services: HealthCheck[];
    activeAlerts: number;
    lastCheck: Date;
  } {
    const services = Array.from(this.healthChecks.values());
    const activeAlerts = this.getActiveAlerts().length;
    
    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    
    if (services.some(s => s.status === 'unhealthy')) {
      status = 'unhealthy';
    } else if (services.some(s => s.status === 'degraded') || activeAlerts > 0) {
      status = 'degraded';
    }

    return {
      status,
      services,
      activeAlerts,
      lastCheck: new Date(),
    };
  }

  /**
   * Collecter les métriques système
   */
  async collectMetrics(): Promise<SystemMetrics> {
    const now = new Date();
    
    // Métriques de base de données
    const dbMetrics = await this.getDatabaseMetrics();
    
    // Métriques API
    const apiMetrics = await this.getApiMetrics();

    return {
      timestamp: now,
      cpu: Math.random() * 100, // Simulé
      memory: Math.random() * 100, // Simulé
      disk: Math.random() * 100, // Simulé
      network: {
        incoming: Math.random() * 1000,
        outgoing: Math.random() * 1000,
      },
      database: dbMetrics,
      api: apiMetrics,
    };
  }

  /**
   * Obtenir les métriques de base de données
   */
  private async getDatabaseMetrics(): Promise<SystemMetrics['database']> {
    try {
      // Nombre de connexions actives
      const connectionsResult = await prisma.$queryRaw`
        SELECT count(*) as connections 
        FROM pg_stat_activity 
        WHERE state = 'active'
      ` as any[];
      
      const connections = parseInt(connectionsResult[0]?.connections || '0');

      // Temps de requête moyen (simulé)
      const queryTime = Math.random() * 100;

      return { connections, queryTime };
    } catch (error) {
      console.error('Erreur métriques DB:', error);
      return { connections: 0, queryTime: 0 };
    }
  }

  /**
   * Obtenir les métriques API
   */
  private async getApiMetrics(): Promise<SystemMetrics['api']> {
    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);

    try {
      // Requêtes par minute
      const requestsPerMinute = await prisma.analyticsEvent.count({
        where: {
          createdAt: { gte: oneMinuteAgo },
        },
      });

      // Erreurs récentes
      const errors = await prisma.errorLog.count({
        where: {
          createdAt: { gte: oneMinuteAgo },
        },
      });

      const errorRate = requestsPerMinute > 0 ? (errors / requestsPerMinute) * 100 : 0;

      return {
        requestsPerMinute,
        averageResponseTime: Math.random() * 500, // Simulé
        errorRate,
      };
    } catch (error) {
      console.error('Erreur métriques API:', error);
      return {
        requestsPerMinute: 0,
        averageResponseTime: 0,
        errorRate: 0,
      };
    }
  }

  /**
   * Démarrer les vérifications périodiques
   */
  private startPeriodicChecks(): void {
    // Vérifications de santé toutes les 5 minutes
    setInterval(async () => {
      const services = ['database', 'api', 'email', 'storage'];
      
      for (const service of services) {
        try {
          await this.checkHealth(service);
        } catch (error) {
          console.error(`Erreur vérification ${service}:`, error);
        }
      }
    }, 5 * 60 * 1000);

    // Collecte de métriques toutes les minutes
    setInterval(async () => {
      try {
        const metrics = await this.collectMetrics();
        
        // Enregistrer les métriques en base (optionnel)
        await prisma.analyticsEvent.create({
          data: {
            name: 'system_metrics',
            category: 'system',
            properties: JSON.parse(JSON.stringify(metrics)),
          },
        });
      } catch (error) {
        console.error('Erreur collecte métriques:', error);
      }
    }, 60 * 1000);

    // Nettoyage des anciennes alertes toutes les heures
    setInterval(() => {
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      this.alerts = this.alerts.filter(
        alert => alert.timestamp > oneWeekAgo || !alert.resolved
      );
    }, 60 * 60 * 1000);
  }

  /**
   * Générer un rapport de santé
   */
  async generateHealthReport(): Promise<{
    summary: {
      status: string;
      uptime: string;
      totalAlerts: number;
      resolvedAlerts: number;
    };
    services: HealthCheck[];
    recentAlerts: Alert[];
    metrics: SystemMetrics;
  }> {
    const systemStatus = this.getSystemStatus();
    const metrics = await this.collectMetrics();
    const recentAlerts = this.alerts
      .filter(alert => alert.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000))
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10);

    return {
      summary: {
        status: systemStatus.status,
        uptime: '99.9%', // Calculé en production
        totalAlerts: this.alerts.length,
        resolvedAlerts: this.alerts.filter(a => a.resolved).length,
      },
      services: systemStatus.services,
      recentAlerts,
      metrics,
    };
  }
}

// Instance globale
export const monitoring = MonitoringService.getInstance();

// Middleware pour capturer les erreurs automatiquement
export function withMonitoring<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context: string
): T {
  return (async (...args: any[]) => {
    const startTime = Date.now();
    
    try {
      const result = await fn(...args);
      
      // Enregistrer les métriques de performance
      const duration = Date.now() - startTime;
      if (duration > 1000) {
        await monitoring.createAlert({
          type: 'warning',
          title: 'Performance dégradée',
          message: `${context} a pris ${duration}ms à s'exécuter`,
          severity: 'medium',
          source: 'performance',
          metadata: { context, duration },
        });
      }
      
      return result;
    } catch (error) {
      // Créer une alerte pour l'erreur
      await monitoring.createAlert({
        type: 'error',
        title: `Erreur dans ${context}`,
        message: error instanceof Error ? error.message : 'Erreur inconnue',
        severity: 'high',
        source: 'application',
        metadata: { 
          context, 
          error: error instanceof Error ? error.stack : error,
          args: JSON.stringify(args).slice(0, 1000),
        },
      });
      
      throw error;
    }
  }) as T;
}

// Hook React pour le monitoring
export function useMonitoring() {
  const reportError = async (error: Error, context: string) => {
    await monitoring.createAlert({
      type: 'error',
      title: `Erreur client: ${context}`,
      message: error.message,
      severity: 'medium',
      source: 'client',
      metadata: { 
        context,
        stack: error.stack,
        userAgent: navigator.userAgent,
        url: window.location.href,
      },
    });
  };

  const reportPerformance = async (metric: string, value: number, threshold: number) => {
    if (value > threshold) {
      await monitoring.createAlert({
        type: 'warning',
        title: `Performance client dégradée`,
        message: `${metric}: ${value}ms (seuil: ${threshold}ms)`,
        severity: 'low',
        source: 'client_performance',
        metadata: { metric, value, threshold },
      });
    }
  };

  return { reportError, reportPerformance };
}

