# Stage 1: Build the React frontend
FROM node:20 AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
ENV VITE_API_URL="" 
RUN echo "VITE_API_URL is set to: ${VITE_API_URL}"
RUN npm run build

# Stage 2: Build the backend runtime image
FROM node:20-alpine
WORKDIR /app

# Install PostgreSQL client (optional, for healthchecks)
RUN apk add --no-cache postgresql-client

# Copy backend package files and install dependencies
COPY backend/package*.json ./
RUN npm ci --only=production

# Copy backend source code
COPY backend/ ./

# Copy built frontend from stage 1
COPY --from=frontend-builder /app/frontend/dist ./public

# Ensure start.sh is executable
RUN chmod +x start.sh

EXPOSE 3000
CMD ["./start.sh"]