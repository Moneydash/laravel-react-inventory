# Use a Node.js base image
FROM node:20

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
        wget \
        git \
        sudo \
        nano \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install -g npm@10.2.4

# Copy the rest of the application code to the container
COPY . .

# Expose the port on which the app will run
EXPOSE 3000

# Build the React app
RUN npm run build

# Install serve globally
RUN npm install -g serve

# Command to run the React app in build mode (for production)
ENTRYPOINT ["serve", "-s", "build"]