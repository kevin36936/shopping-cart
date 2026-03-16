FROM node:20-alpine

WORKDIR /app

# Install PostgreSQL client (for pg_isready)
RUN apk add --no-cache postgresql-client

# Copy backend package files
COPY backend/package*.json .
RUN npm ci --only=production

# Copy backend source
COPY backend/ .

# Copy built frontend from root context
COPY frontend/dist ./public

EXPOSE 3000
CMD ["sh", "start.sh"]