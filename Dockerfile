# ── Stage 1: Build the Vite SPA ──────────────────────────────────────────────
FROM node:24-alpine AS builder

WORKDIR /app

# Install dependencies first (cache-friendly)
COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps

# Copy source needed for the client build
COPY client/ client/
COPY shared/ shared/
COPY attached_assets/ attached_assets/
COPY vite.config.ts tsconfig.json tailwind.config.ts postcss.config.js components.json ./

# Build arg — set at build time via --build-arg or GitHub Actions
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npx vite build

# ── Stage 2: Serve with nginx ────────────────────────────────────────────────
FROM nginx:alpine

# Remove default nginx page
RUN rm -rf /usr/share/nginx/html/*

# Copy built SPA assets
COPY --from=builder /app/dist/public /usr/share/nginx/html

# Create sites-enabled directory and copy config
RUN mkdir -p /etc/nginx/sites-enabled && \
    sed -i 's|include /etc/nginx/conf.d/\*.conf;|include /etc/nginx/sites-enabled/*.conf;|' /etc/nginx/nginx.conf
COPY nginx.conf /etc/nginx/sites-enabled/admin.hodlearn.io.conf
RUN rm -f /etc/nginx/conf.d/default.conf

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
