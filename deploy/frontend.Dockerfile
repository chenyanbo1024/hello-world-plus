# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build production
RUN npm run build

# Stage 2: Runtime
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config (will be mounted in docker-compose)
# EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
