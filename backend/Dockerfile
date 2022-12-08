# Author(s): Ethan Ratnofsky

# Base off NodeJS image
FROM node

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy all files from current directory to container
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the backend server
CMD [ "node", "app.js" ]
