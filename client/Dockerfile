# ==========================================
# Build Stage
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Build arguments for Vite client environment variables
ARG VITE_API_URL=http://localhost:5000/api
ARG VITE_AUTH_URL=http://localhost:5000

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_AUTH_URL=$VITE_AUTH_URL

# Copy dependency manifests
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy project files
COPY index.html tsconfig*.json vite.config.ts ./
COPY public/ ./public/
COPY src/ ./src/

# Build static production assets
RUN npm run build

# ==========================================
# Production Runtime Stage (Nginx)
# ==========================================
FROM nginx:alpine AS runner

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Health check
HEALTHCHECK --interval=15s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
