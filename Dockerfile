FROM node:20-alpine as builder

WORKDIR /app

# Installa le dipendenze necessarie per la compilazione
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Installa solo le dipendenze necessarie per il build
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Final image
FROM node:20-alpine

WORKDIR /app

# Installa le dipendenze necessarie per la compilazione
RUN apk add --no-cache python3 make g++ curl

# Copy package.json e package-lock.json
COPY package*.json ./

# Copia il codice compilato
COPY --from=builder /app/dist ./dist

# Installa DIRETTAMENTE bcrypt evitando problemi di architettura
RUN npm uninstall bcrypt --no-save && \
    npm i bcrypt --save

# Installa tutte le altre dipendenze
RUN npm ci --only=production

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Expose application port
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/src/main.js"]