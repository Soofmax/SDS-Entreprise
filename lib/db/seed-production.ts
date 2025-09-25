import { PrismaClient, Role, ContactStatus, ProjectStatus, ProjectType, TaskStatus, Priority } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedProduction() {
  console.log('🌱 Début du seeding production...');

  try {
    // Créer l'utilisateur admin principal
    const hashedPassword = await bcrypt.hash('SDS2024!Admin', 12);
    
    const admin = await prisma.user.upsert({
      where: { email: 'admin@salwadevstudio.com' },
      update: {
        password: hashedPassword, // Mettre à jour le mot de passe
      },
      create: {
        name: 'Salwa Admin',
        email: 'admin@salwadevstudio.com',
        password: hashedPassword,
        role: Role.ADMIN,
      },
    });

    console.log('✅ Utilisateur admin créé/mis à jour:', admin.email);

    // Créer quelques contacts de démonstration (optionnel en production)
    const demoContacts = [
      {
        name: 'Marie Dubois',
        email: 'marie.demo@example.com',
        phone: '+33 6 12 34 56 78',
        company: 'Studio Créatif Demo',
        message: 'Projet de démonstration pour le portfolio',
        projectType: ProjectType.SITE_VITRINE,
        budget: 4200,
        status: ContactStatus.WON,
        source: 'demo_data',
      },
      {
        name: 'Thomas Martin',
        email: 'thomas.demo@example.com',
        phone: '+33 6 98 76 54 32',
        company: 'TechStart Demo',
        message: 'Exemple de projet e-commerce pour démonstration',
        projectType: ProjectType.ECOMMERCE,
        budget: 8500,
        status: ContactStatus.WON,
        source: 'demo_data',
      },
    ];

    for (const contactData of demoContacts) {
      // upsert basé sur email (non unique) -> find/update/create
      const existingContact = await prisma.contact.findFirst({
        where: { email: contactData.email },
      });

      const contact = existingContact
        ? await prisma.contact.update({
            where: { id: existingContact.id },
            data: contactData,
          })
        : await prisma.contact.create({
            data: {
              ...contactData,
              userId: admin.id,
            },
          });

      // Créer un projet pour les contacts gagnés
      if (contact.status === ContactStatus.WON) {
        const project = await prisma.project.upsert({
          where: { contactId: contact.id },
          update: {},
          create: {
            title: `Projet ${contact.company}`,
            description: `Projet de démonstration pour ${contact.company}`,
            status: ProjectStatus.DELIVERED,
            type: contact.projectType,
            contactId: contact.id,
            budget: contact.budget || 5000,
            timeline: 14,
            startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
            technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Prisma'],
            features: ['Design responsive', 'SEO optimisé', 'Analytics'],
            progress: 100,
            userId: admin.id,
          },
        });

        // Créer des tâches pour le projet
        const tasks = [
          {
            title: 'Analyse des besoins',
            description: 'Définir les spécifications',
            status: TaskStatus.DONE,
            priority: Priority.HIGH,
          },
          {
            title: 'Design et maquettes',
            description: 'Créer les maquettes',
            status: TaskStatus.DONE,
            priority: Priority.HIGH,
          },
          {
            title: 'Développement',
            description: 'Développement des fonctionnalités',
            status: TaskStatus.DONE,
            priority: Priority.HIGH,
          },
        ];

        for (const taskData of tasks) {
          const existingTask = await prisma.projectTask.findFirst({
            where: {
              projectId: project.id,
              title: taskData.title,
            },
          });

          if (existingTask) {
            await prisma.projectTask.update({
              where: { id: existingTask.id },
              data: taskData,
            });
          } else {
            await prisma.projectTask.create({
              data: {
                ...taskData,
                projectId: project.id,
              },
            });
          }
        }

        // Créer un témoignage pour les projets terminés
        if (project.status === ProjectStatus.DELIVERED) {
          await prisma.testimonial.upsert({
            where: { projectId: project.id },
            update: {},
            create: {
              name: contact.name,
              company: contact.company,
              position: 'CEO',
              content: `Excellent travail de SDS ! Le site dépasse nos attentes et l'équipe a été très professionnelle.`,
              rating: 5,
              projectId: project.id,
              isPublic: true,
              featured: true,
            },
          });
        }

        console.log('✅ Projet de démo créé:', project.title);
      }
    }

    // Créer quelques événements analytics de base
    const analyticsEvents = [
      { event: 'page_view', page: '/' },
      { event: 'page_view', page: '/services' },
      { event: 'page_view', page: '/portfolio' },
      { event: 'form_submit', page: '/contact' },
    ];

    for (let i = 0; i < 20; i++) {
      const randomEvent = analyticsEvents[Math.floor(Math.random() * analyticsEvents.length)];
      await prisma.analytics.create({
        data: {
          event: randomEvent.event,
          page: randomEvent.page,
          sessionId: `session_${Math.random().toString(36).substring(7)}`,
          properties: {
            demo: true,
            timestamp: new Date().toISOString(),
          },
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Dernière semaine
        },
      });
    }

    console.log('✅ Événements analytics de base créés');

    // Créer quelques abonnés newsletter
    const newsletterEmails = [
      'newsletter1@example.com',
      'newsletter2@example.com',
      'newsletter3@example.com',
    ];

    for (const email of newsletterEmails) {
      await prisma.newsletter.upsert({
        where: { email },
        update: {},
        create: {
          email,
          source: 'website_footer',
          tags: ['prospects', 'web_development'],
        },
      });
    }

    console.log('✅ Abonnés newsletter créés');
    console.log('🎉 Seeding production terminé avec succès !');

  } catch (error) {
    console.error('❌ Erreur lors du seeding production:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le seed si appelé directement
if (require.main === module) {
  seedProduction()
    .catch((error) => {
      console.error('Erreur fatale:', error);
      process.exit(1);
    });
}

export { seedProduction };

