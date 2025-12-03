# Étape 1 : Construction du frontend avec Vite
FROM node:20-alpine AS builder

WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le projet
COPY . .

# Build pour production (génère /dist)
RUN npm run build

# Étape 2 : Serveur Nginx pour héberger le build
FROM nginx:alpine

# Copier le build vers nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Exposer le port 80 (production)
EXPOSE 80

# Démarrer nginx
CMD ["nginx", "-g", "daemon off;"]
