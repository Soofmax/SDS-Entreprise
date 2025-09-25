import { PrismaClient, Role, ContactStatus, ProjectStatus, ProjectType, TaskStatus, Priority } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding...');

  // Créer un utilisateur admin si aucun n'existe (paramétrable via variables d'env)
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@salwadevstudio.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const adminName = process.env.ADMIN_NAME || 'Salwa Admin';

  let admin = await prisma.user.findFirst({ where: { role: Role.ADMIN } });

  if (!admin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    admin = await prisma.user.upsert({
      where: { email: adminEmail },
      update: {},
      create: {
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: Role.ADMIN,
      },
    });
    console.log('✅ Utilisateur admin créé:', admin.email);
  } else {
    console.log('ℹ️ Un utilisateur admin existe déjà:', admin.email);
  }

  // Activer/désactiver les données de démonstration via variable d'environnement
  const seedDemo = (process.env.SEED_DEMO_DATA ?? 'true').toLowerCase() === 'true';
  if (!seedDemo) {
    console.log('ℹ️ SEED_DEMO_DATA=false, seeding des données de démonstration désactivé.');
    console.log('🎉 Seeding terminé avec succès (admin uniquement) !');
    return;
  }

  // Créer des contacts de démonstration
  const contacts = await Promise.all([
    prisma.contact.create({
      data: {
        name: 'Marie Dubois',
        email: 'marie.dubois@studio-creatif.fr',
        phone: '+33 6 12 34 56 78',
        company: 'Studio Créatif',
        message: 'Nous souhaitons refondre notre site vitrine avec un design moderne et élégant.',
        projectType: ProjectType.SITE_VITRINE,
        budget: 4200,
        timeline: '2-3 semaines',
        status: ContactStatus.WON,
        source: 'Google Search',
        userId: admin.id,
      },
    }),
    
    prisma.contact.create({
      data: {
        name: 'Thomas Martin',
        email: 'thomas@techstart.io',
        phone: '+33 6 98 76 54 32',
        company: 'TechStart',
        message: 'Besoin d\'une plateforme e-commerce avec intégration Web3 pour notre startup.',
        projectType: ProjectType.WEB3,
        budget: 8500,
        timeline: '1-2 mois',
        status: ContactStatus.QUALIFIED,
        source: 'Référence client',
        userId: admin.id,
      },
    }),
    
    prisma.contact.create({
      data: {
        name: 'Sophie Laurent',
        email: 'sophie.laurent@marketing-pro.com',
        phone: '+33 6 45 67 89 12',
        company: 'Marketing Pro',
        message: 'Landing page haute conversion pour notre nouvelle campagne marketing.',
        projectType: ProjectType.LANDING_PAGE,
        budget: 2800,
        timeline: '1 semaine',
        status: ContactStatus.WON,
        source: 'LinkedIn',
        userId: admin.id,
      },
    }),
    
    prisma.contact.create({
      data: {
        name: 'Pierre Durand',
        email: 'pierre@restaurant-saveurs.fr',
        phone: '+33 6 23 45 67 89',
        company: 'Restaurant Les Saveurs',
        message: 'Site vitrine avec système de réservation en ligne pour notre restaurant.',
        projectType: ProjectType.SITE_VITRINE,
        budget: 3500,
        timeline: '2 semaines',
        status: ContactStatus.PROPOSAL_SENT,
        source: 'Bouche à oreille',
        userId: admin.id,
      },
    }),
    
    prisma.contact.create({
      data: {
        name: 'Amélie Rousseau',
        email: 'amelie@boutique-mode.fr',
        company: 'Boutique Mode',
        message: 'Boutique e-commerce pour vendre nos créations de mode en ligne.',
        projectType: ProjectType.ECOMMERCE,
        budget: 6200,
        timeline: '3-4 semaines',
        status: ContactStatus.NEW,
        source: 'Instagram',
        userId: admin.id,
      },
    }),
  ]);

  console.log('✅ Contacts créés:', contacts.length);

  // Créer des projets pour les contacts gagnés
  const wonContacts = contacts.filter(c => c.status === ContactStatus.WON);
  
  for (const contact of wonContacts) {
    const project = await prisma.project.create({
      data: {
        title: `Projet ${contact.company}`,
        description: `Développement d'un ${contact.projectType.toLowerCase()} pour ${contact.company}. ${contact.message}`,
        status: ProjectStatus.DELIVERED,
        type: contact.projectType,
        contactId: contact.id,
        budget: contact.budget || 5000,
        timeline: contact.projectType === ProjectType.LANDING_PAGE ? 7 : 14,
        startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // Il y a 10 jours
        endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // Dans 4 jours
        technologies: contact.projectType === ProjectType.WEB3 
          ? ['Next.js', 'TypeScript', 'Tailwind CSS', 'Web3.js', 'Ethereum']
          : ['Next.js', 'TypeScript', 'Tailwind CSS', 'Prisma'],
        features: contact.projectType === ProjectType.ECOMMERCE
          ? ['Catalogue produits', 'Panier', 'Paiement Stripe', 'Gestion commandes']
          : ['Design responsive', 'SEO optimisé', 'Formulaire contact', 'Analytics'],
        progress: 100,
        userId: admin.id,
      },
    });

    // Créer des tâches pour chaque projet
    const tasks = [
      {
        title: 'Analyse des besoins',
        description: 'Définir les spécifications fonctionnelles et techniques',
        status: TaskStatus.DONE,
        priority: Priority.HIGH,
        estimatedHours: 4,
        actualHours: 3,
      },
      {
        title: 'Design et maquettes',
        description: 'Créer les maquettes et définir l\'identité visuelle',
        status: TaskStatus.DONE,
        priority: Priority.HIGH,
        estimatedHours: 8,
        actualHours: 9,
      },
      {
        title: 'Développement frontend',
        description: 'Intégration des maquettes et développement des fonctionnalités',
        status: TaskStatus.DONE,
        priority: Priority.HIGH,
        estimatedHours: 16,
        actualHours: 18,
      },
      {
        title: 'Tests et optimisations',
        description: 'Tests fonctionnels, optimisation des performances',
        status: TaskStatus.DONE,
        priority: Priority.MEDIUM,
        estimatedHours: 4,
        actualHours: 5,
      },
      {
        title: 'Déploiement',
        description: 'Mise en production et configuration du domaine',
        status: TaskStatus.DONE,
        priority: Priority.MEDIUM,
        estimatedHours: 2,
        actualHours: 2,
      },
    ];

    for (const taskData of tasks) {
      await prisma.projectTask.create({
        data: {
          ...taskData,
          projectId: project.id,
          completedAt: new Date(),
        },
      });
    }

    // Créer un témoignage pour les projets terminés
    if (project.status === ProjectStatus.DELIVERED) {
      await prisma.testimonial.create({
        data: {
          name: contact.name,
          company: contact.company,
          position: 'CEO',
          content: `SDS a transformé notre vision en réalité digitale. Son approche créative et sa maîtrise technique ont dépassé toutes nos attentes. Un travail d'exception !`,
          rating: 5,
          projectId: project.id,
          isPublic: true,
          featured: true,
        },
      });
    }

    console.log('✅ Projet créé:', project.title);
  }

  // Créer des données analytics de démonstration
  const analyticsEvents = [
    'page_view', 'form_submit', 'button_click', 'calculator_used', 
    'package_selected', 'portfolio_view', 'service_view'
  ];

  const pages = ['/', '/services', '/portfolio', '/contact', '/a-propos'];

  for (let i = 0; i < 100; i++) {
    await prisma.analytics.create({
      data: {
        event: analyticsEvents[Math.floor(Math.random() * analyticsEvents.length)],
        page: pages[Math.floor(Math.random() * pages.length)],
        sessionId: `session_${Math.random().toString(36).substring(7)}`,
        userId: Math.random() > 0.8 ? admin.id : undefined,
        properties: {
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          referrer: Math.random() > 0.5 ? 'https://google.com' : 'direct',
        },
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      },
    });
  }

  // Créer quelques abonnés newsletter
  const newsletterEmails = [
    'client1@example.com',
    'prospect@startup.io',
    'marketing@agency.fr',
    'dev@freelance.com',
  ];

  for (const email of newsletterEmails) {
    await prisma.newsletter.create({
      data: {
        email,
        source: 'website_footer',
        tags: ['prospects', 'web_development'],
      },
    });
  }

  console.log('✅ Données analytics et newsletter créées');
  console.log('🎉 Seeding terminé avec succès !');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Erreur lors du seeding:', e);
    await prisma.$disconnect();
    process.exit(1);
  });

