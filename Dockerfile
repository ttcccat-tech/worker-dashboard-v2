FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy client package files
COPY client/package*.json ./client/
WORKDIR /app/client
RUN npm install

# Back to app directory
WORKDIR /app

# Copy source code
COPY server ./server
COPY client/src ./client/src
COPY client/public ./client/public
COPY client/build ./client/build

# Build React app
WORKDIR /app/client
RUN npm run build

# Back to app directory
WORKDIR /app

# Expose port
EXPOSE 3004

# Start server
CMD ["node", "server/index.js"]
