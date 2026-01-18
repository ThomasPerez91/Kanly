# syntax=docker/dockerfile:1

############################################
# Base
############################################
FROM node:25-alpine3.22 AS base
WORKDIR /app

# Libs système + patchs sécurité Alpine
RUN apk add --no-cache libc6-compat \
  && apk upgrade --no-cache

############################################
# Deps (cache npm)
############################################
FROM base AS deps
COPY package*.json ./
RUN npm ci

############################################
# Dev (docker-compose target: dev)
############################################
FROM base AS dev
ENV NODE_ENV=development
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3333 5173
CMD ["node", "ace", "serve", "--watch"]

############################################
# Build (TS + Vite + Adonis)
############################################
FROM base AS build
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN node ace build --production

############################################
# Prod runtime (HARDENED)
############################################
FROM node:25-alpine3.22 AS prod
WORKDIR /app
ENV NODE_ENV=production

# Patch OS + user non-root
RUN apk upgrade --no-cache \
  && addgroup -S nodejs \
  && adduser -S adonis -G nodejs

# Copie uniquement le build
COPY --from=build /app/build ./

# Installer uniquement deps prod + nettoyer npm
RUN npm ci --omit=dev \
  && npm cache clean --force \
  && rm -rf /root/.npm

EXPOSE 3333
USER adonis
CMD ["node", "bin/server.js"]
