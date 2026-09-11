# ==========================================
# Build Stage
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install all dependencies (including devDependencies for building TypeScript)
RUN npm ci

# Copy TypeScript configuration and source files
COPY tsconfig.json ./
COPY src/ ./src/

# Compile TypeScript and copy data assets
RUN npm run build

# ==========================================
# Production Runtime Stage
# ==========================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install curl for healthcheck
RUN apk add --no-cache curl

# Copy dependency manifests and install production-only dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled artifacts and static data from builder
COPY --from=builder /app/dist ./dist

# Create non-root user and set permissions
USER node

# Expose server port
EXPOSE 5000

# Container healthcheck
HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:5000/api/hello || exit 1

# Start the application
CMD ["node", "dist/index.js"]
