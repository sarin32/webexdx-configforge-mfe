# syntax=docker/dockerfile:1.4

# ---- Stage 1: Builder ----
FROM node:22-alpine AS builder

WORKDIR /app

ENV corepack_enable_download_prompt=0
RUN corepack enable

# Configure pnpm to use cache directory
RUN pnpm config set store-dir /pnpm/store

# Copy dependency manifests and install all dependencies
COPY package.json pnpm-lock.yaml ./
# Use BuildKit cache mount for pnpm store
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile

# Copy the full source code
COPY . .

ARG ENVIRONMENT=dev

# Build the app
RUN pnpm run build:${ENVIRONMENT}


# ---- Stage 2: Production image ----
FROM nginx:alpine

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy your web files to the nginx html directory
COPY --from=builder /app/dist/webexdx-configforge-mfe/browser /usr/share/nginx/html

# Copy custom nginx config if you have one
COPY nginx-default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
