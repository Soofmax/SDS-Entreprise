-- Prisma Migration: add_user_auth_fields
-- Adds passwordHash, active, lastLoginAt columns to users table

ALTER TABLE "users"
ADD COLUMN IF NOT EXISTS "passwordHash" TEXT,
ADD COLUMN IF NOT EXISTS "active" BOOLEAN NOT NULL DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS "lastLoginAt" TIMESTAMP(3);