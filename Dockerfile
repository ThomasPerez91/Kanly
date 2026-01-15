############################################
# Base
############################################
FROM node:20-alpine AS base
WORKDIR /app

# libs utiles (bcrypt, sharp, etc. selon deps)
RUN apk add --no-cache libc6-compat

############################################
# Deps (cache)
############################################
FROM base AS deps
COPY package*.json ./
# Si tu es en npm:
RUN npm ci

############################################
# Dev (pour docker-compose target: dev)
############################################
FROM base AS dev
ENV NODE_ENV=development
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3333 5173
CMD ["node", "ace", "serve", "--watch"]

############################################
# Build (compile TS + build assets)
############################################
FROM base AS build
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Build Adonis (génère /build)
RUN node ace build --production

############################################
# Prod runtime (image légère)
############################################
FROM node:20-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production

# user non-root (optionnel mais recommandé)
RUN addgroup -S nodejs && adduser -S adonis -G nodejs

# Copie du build (et uniquement ce qu’il faut)
COPY --from=build /app/build ./

# Si tu as besoin d'assets statiques, ils sont déjà dans build/ pour Adonis.
# Adonis prod démarre via build/bin/server.js
EXPOSE 3333
USER adonis
CMD ["node", "bin/server.js"]
