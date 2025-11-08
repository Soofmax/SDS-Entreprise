import { OpenAPIRegistry, OpenApiGeneratorV3 } from 'zod-to-openapi';
import { z } from 'zod';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import path from 'path';

const registry = new OpenAPIRegistry();

// Contact schema (aligné avec app/api/contact/route.ts)
const contactSchema = z.object({
  name: z.string().min(2).max(50).regex(/^[a-zA-ZÀ-ÿ\s'-]+$/),
  email: z.string().email().max(100),
  phone: z.string().optional(),
  company: z.string().max(100).optional(),
  projectType: z.enum(['vitrine', 'ecommerce', 'application', 'refonte', 'seo', 'maintenance']),
  budget: z.string().min(1),
  timeline: z.string().min(1),
  message: z.string().min(10).max(1000),
  source: z.string().optional(),
  website: z.string().max(0).optional(),
});

registry.register('ContactRequest', contactSchema);

const api = new OpenApiGeneratorV3(registry.definitions);

const doc = api.generateDocument({
  openapi: '3.0.3',
  info: {
    title: 'SDS Enterprise API',
    version: '1.0.0',
    description: 'OpenAPI spec (initial) générée depuis Zod',
  },
  servers: [{ url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000' }],
  paths: {
    '/api/contact': {
      post: {
        summary: 'Soumettre le formulaire de contact',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: registry.getSchema('ContactRequest'),
            },
          },
        },
        responses: {
          '201': { description: 'Créé' },
          '400': { description: 'Erreur de validation' },
          '429': { description: 'Rate limit' },
        },
      },
      get: {
        summary: 'Statistiques contact (admin)',
        responses: {
          '200': { description: 'OK' },
          '401': { description: 'Non autorisé' },
        },
      },
    },
  },
});

const outDir = path.join(process.cwd(), 'public');
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
writeFileSync(path.join(outDir, 'openapi.json'), JSON.stringify(doc, null, 2));
console.log('✅ OpenAPI spec generated at public/openapi.json');