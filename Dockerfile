# Dockerfile for Node.js App
FROM node:16

# Create and set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose port
EXPOSE 3000

# Start the Node.js server
CMD ["node", "server.js"]
