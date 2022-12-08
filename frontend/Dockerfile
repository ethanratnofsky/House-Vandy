# Author(s): Ethan Ratnofsky

# Base off NodeJS image
FROM node

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files from current directory to container
COPY . .

# Expose port 8080
EXPOSE 8080

# Start the frontend server
CMD [ "npm", "start" ]
