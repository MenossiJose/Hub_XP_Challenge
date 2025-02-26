FROM node:20-alpine

WORKDIR /usr/src/app

# Copy package files first to leverage Docker cache
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Set environment variables if not provided via docker-compose
ENV PORT=3000
ENV NODE_ENV=production

# Build the application
RUN npm run build

# Expose the API port
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "start:prod"]