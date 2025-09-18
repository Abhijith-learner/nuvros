# Build stage
FROM node:18-alpine

WORKDIR /app



# Copy package files and install dependencies
COPY package*.json ./
RUN npm install
RUN npm install express

# Copy source code
COPY . ./

# Build the React app
RUN npm run build

# Expose port for the web server
EXPOSE 80

# Start the express server to serve the build
CMD ["node", "--experimental-modules", "server.mjs"]
