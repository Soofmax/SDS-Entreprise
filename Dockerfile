# 🐳 Multi-stage Dockerfile for SDS Enterprise
# Optimized for production with security and performance best practices

# ============================================================================
# Base Stage - Common dependencies
# ============================================================================
FROM node:20-alpine AS base

# Install security updates and required packages
RUN apk update && apk upgrade && \
    apk add --no-cache \
    libc6-compat \
    dumb-init \
    && rm -rf /var/cache/apk/*

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Set working directory
WORKDIR /app

# ============================================================================
# Dependencies Stage - Install all dependencies
# ============================================================================
FROM base AS deps

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies with npm ci for faster, reliable builds
RUN npm ci --only=production --frozen-lockfile && \
    npm cache clean --force

# ============================================================================
# Builder Stage - Build the application
# ============================================================================
FROM base AS builder

# Copy package files
COPY package.json package-lock.json* ./

# Install all dependencies (including devDependencies)
RUN npm ci --frozen-lockfile

# Copy source code
COPY . .

# Copy environment variables for build
COPY .env.example .env.local

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# ============================================================================
# Runner Stage - Production runtime
# ============================================================================
FROM base AS runner

# Set environment to production
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create app directory with correct permissions
RUN mkdir -p /app && chown nextjs:nodejs /app
WORKDIR /app

# Copy built application from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Prisma files
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma

# Copy production dependencies
COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules

# Create uploads directory
RUN mkdir -p /app/uploads && chown nextjs:nodejs /app/uploads

# Health check script
COPY --chown=nextjs:nodejs <<EOF /app/healthcheck.js
const http = require('http');

const options = {
  host: 'localhost',
  port: process.env.PORT || 3000,
  path: '/api/health',
  timeout: 2000,
  method: 'GET'
};

const request = http.request(options, (res) => {
  console.log(\`Health check status: \${res.statusCode}\`);
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

request.on('error', (err) => {
  console.log('Health check failed:', err.message);
  process.exit(1);
});

request.on('timeout', () => {
  console.log('Health check timeout');
  request.destroy();
  process.exit(1);
});

request.end();
EOF

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Set port environment variable
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node /app/healthcheck.js

# Start the application with dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]

# ============================================================================
# Development Stage - For development with hot reload
# ============================================================================
FROM base AS development

# Install all dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Start development server
CMD ["npm", "run", "dev"]

# ============================================================================
# Labels for metadata and security scanning
# ============================================================================
LABEL maintainer="Salwa Dev Studio <dev@salwadevstudio.com>"
LABEL version="2.0.0"
LABEL description="SDS Enterprise - Next.js application for TPE/PME web solutions"
LABEL org.opencontainers.image.title="SDS Enterprise"
LABEL org.opencontainers.image.description="Enterprise-grade web platform for SMB solutions"
LABEL org.opencontainers.image.version="2.0.0"
LABEL org.opencontainers.image.vendor="Salwa Dev Studio"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.source="https://github.com/salwa-dev-studio/sds-enterprise"
LABEL org.opencontainers.image.documentation="https://docs.salwadevstudio.com"

# Security labels
LABEL security.non-root="true"
LABEL security.updates="2024-08-30"
LABEL security.scan="trivy"

