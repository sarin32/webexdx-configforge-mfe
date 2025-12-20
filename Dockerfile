# ---- Stage 1: Builder ----
FROM node:22-alpine AS builder

WORKDIR /app

ENV corepack_enable_download_prompt=0
RUN corepack enable

ENV PNPM_STORE_PATH=/pnpm/store

# Copy dependency manifests and install all dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

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
