-- Prisma Init Migration - Postgres (aligned with prisma/schema.prisma)

-- Enums
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'EDITOR');
CREATE TYPE "ContactStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL_SENT', 'NEGOTIATING', 'WON', 'LOST');
CREATE TYPE "ProjectStatus" AS ENUM ('PLANNING', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'DELIVERED', 'CANCELLED');
CREATE TYPE "ProjectType" AS ENUM ('SITE_VITRINE', 'ECOMMERCE', 'LANDING_PAGE', 'BLOG', 'PORTFOLIO', 'APPLICATION', 'WEB3', 'MOBILE', 'OTHER');
CREATE TYPE "TaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'REVIEW', 'DONE', 'CANCELLED');
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'PENDING', 'PROCESSING', 'SENT', 'PAID', 'FAILED', 'OVERDUE', 'CANCELLED');
CREATE TYPE "NewsletterStatus" AS ENUM ('SUBSCRIBED', 'UNSUBSCRIBED', 'BOUNCED');

-- Users
CREATE TABLE "users" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT,
  "email" TEXT NOT NULL UNIQUE,
  "emailVerified" TIMESTAMP,
  "image" TEXT,
  "password" TEXT,
  "passwordHash" TEXT,
  "role" "Role" NOT NULL DEFAULT 'USER',
  "active" BOOLEAN NOT NULL DEFAULT TRUE,
  "lastLoginAt" TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Accounts
CREATE TABLE "accounts" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  "refresh_token" TEXT,
  "access_token" TEXT,
  "expires_at" INTEGER,
  "token_type" TEXT,
  "scope" TEXT,
  "id_token" TEXT,
  "session_state" TEXT
);
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider","providerAccountId");
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Sessions
CREATE TABLE "sessions" (
  "id" TEXT PRIMARY KEY,
  "sessionToken" TEXT NOT NULL UNIQUE,
  "userId" TEXT NOT NULL,
  "expires" TIMESTAMP NOT NULL
);
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Verification Tokens
CREATE TABLE "verification_tokens" (
  "identifier" TEXT NOT NULL,
  "token" TEXT NOT NULL,
  "expires" TIMESTAMP NOT NULL
);
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier","token");
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- Contacts
CREATE TABLE "contacts" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "company" TEXT,
  "message" TEXT NOT NULL,
  "projectType" "ProjectType" NOT NULL,
  "budget" INTEGER,
  "timeline" TEXT,
  "status" "ContactStatus" NOT NULL DEFAULT 'NEW',
  "source" TEXT,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "referrer" TEXT,
  "userId" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX "contacts_createdAt_idx" ON "contacts"("createdAt");
CREATE INDEX "contacts_status_idx" ON "contacts"("status");
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Projects
CREATE TABLE "projects" (
  "id" TEXT PRIMARY KEY,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "status" "ProjectStatus" NOT NULL DEFAULT 'PLANNING',
  "type" "ProjectType" NOT NULL,
  "contactId" TEXT NOT NULL UNIQUE,
  "budget" INTEGER NOT NULL,
  "timeline" INTEGER NOT NULL,
  "startDate" TIMESTAMP,
  "endDate" TIMESTAMP,
  "deliveryDate" TIMESTAMP,
  "technologies" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "features" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "repositoryUrl" TEXT,
  "stagingUrl" TEXT,
  "productionUrl" TEXT,
  "progress" INTEGER NOT NULL DEFAULT 0,
  "userId" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX "projects_createdAt_idx" ON "projects"("createdAt");
ALTER TABLE "projects" ADD CONSTRAINT "projects_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "projects" ADD CONSTRAINT "projects_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Project Tasks
CREATE TABLE "project_tasks" (
  "id" TEXT PRIMARY KEY,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "status" "TaskStatus" NOT NULL DEFAULT 'TODO',
  "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
  "estimatedHours" INTEGER,
  "actualHours" INTEGER,
  "projectId" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "completedAt" TIMESTAMP
);
CREATE INDEX "project_tasks_projectId_idx" ON "project_tasks"("projectId");
ALTER TABLE "project_tasks" ADD CONSTRAINT "project_tasks_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Testimonials
CREATE TABLE "testimonials" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "company" TEXT,
  "position" TEXT,
  "content" TEXT NOT NULL,
  "rating" INTEGER NOT NULL DEFAULT 5,
  "avatar" TEXT,
  "projectId" TEXT NOT NULL UNIQUE,
  "isPublic" BOOLEAN NOT NULL DEFAULT FALSE,
  "featured" BOOLEAN NOT NULL DEFAULT FALSE,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Invoices
CREATE TABLE "invoices" (
  "id" TEXT PRIMARY KEY,
  "number" TEXT NOT NULL UNIQUE,
  "status" "InvoiceStatus" NOT NULL DEFAULT 'DRAFT',
  "subtotal" INTEGER NOT NULL,
  "taxRate" INTEGER NOT NULL DEFAULT 2000,
  "taxAmount" INTEGER NOT NULL,
  "total" INTEGER NOT NULL,
  "issueDate" TIMESTAMP NOT NULL DEFAULT NOW(),
  "dueDate" TIMESTAMP NOT NULL,
  "paidDate" TIMESTAMP,
  "projectId" TEXT NOT NULL,
  "stripePaymentIntentId" TEXT,
  "stripeInvoiceId" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX "invoices_projectId_idx" ON "invoices"("projectId");
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Analytics
CREATE TABLE "analytics" (
  "id" TEXT PRIMARY KEY,
  "event" TEXT NOT NULL,
  "page" TEXT NOT NULL,
  "sessionId" TEXT NOT NULL,
  "userId" TEXT,
  "properties" JSONB,
  "userAgent" TEXT,
  "ipAddress" TEXT,
  "referrer" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX "analytics_createdAt_idx" ON "analytics"("createdAt");
CREATE INDEX "analytics_event_idx" ON "analytics"("event");

-- Newsletter
CREATE TABLE "newsletter" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "status" "NewsletterStatus" NOT NULL DEFAULT 'SUBSCRIBED',
  "source" TEXT,
  "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "subscribedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "unsubscribedAt" TIMESTAMP
);

-- Error Logs
CREATE TABLE "error_logs" (
  "id" TEXT PRIMARY KEY,
  "code" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "severity" TEXT NOT NULL,
  "details" JSONB,
  "userAgent" TEXT,
  "ipAddress" TEXT,
  "referrer" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX "error_logs_createdAt_idx" ON "error_logs"("createdAt");

-- Analytics Events
CREATE TABLE "analytics_events" (
  "id" TEXT PRIMARY KEY,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "name" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "properties" JSONB,
  "sessionId" TEXT,
  "userId" TEXT,
  "userAgent" TEXT,
  "ipAddress" TEXT,
  "referrer" TEXT,
  "page" TEXT
);
CREATE INDEX "analytics_events_createdAt_idx" ON "analytics_events"("createdAt");