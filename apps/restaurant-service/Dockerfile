FROM node:20-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY libs/ ./libs/
COPY apps/restaurant-service/ ./apps/restaurant-service/

# Install dependencies
RUN npm ci

# Build the application
RUN npm run build restaurant-service

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy only necessary files from the build stage
COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

# Expose the port the app runs on
EXPOSE 3002

# Command to run the app
CMD ["node", "dist/apps/restaurant-service/main"]
