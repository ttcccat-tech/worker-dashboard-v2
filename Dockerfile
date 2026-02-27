FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY server/package*.json ./server/

# Install server dependencies
RUN npm install

# Copy client package files
COPY client/package*.json ./client/
WORKDIR /app/client

# Install client dependencies
RUN npm install

# Copy client source code and build
WORKDIR /app
COPY client/src ./client/src
COPY client/public ./client/public

# Build React app
WORKDIR /app/client
RUN npm run build

# Copy server code
WORKDIR /app
COPY server ./server

# Expose port
EXPOSE 3004

# Start server
CMD ["node", "server/index.js"]
