<<<<<<< HEAD
FROM node:18-lts-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY server.js .
COPY public ./public
COPY data ./data
EXPOSE 8080
ENV NODE_ENV=production
ENV PORT=8080
=======
# Use an official Node.js LTS image as a parent image
FROM node:18-lts-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install app dependencies
RUN npm ci --only=production

# Bundle app source inside Docker image
# Copy server, public directory, and initial data logic handling
COPY server.js .
COPY public ./public
COPY data ./data

# Make port 8080 available to the world outside this container
# (Azure App Service will map its internal port to this)
EXPOSE 8080

# Define environment variable for the Node environment
ENV NODE_ENV=production
ENV PORT=8080

# Define the command to run your app using CMD
>>>>>>> origin/main
CMD [ "node", "server.js" ]
