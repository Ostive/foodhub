# FoodHub

<p align="center">
  <img src="https://via.placeholder.com/200x200?text=FoodHub" width="200" alt="FoodHub Logo" />
</p>

<p align="center">A modern food delivery platform built with NestJS microservices and Next.js</p>

## Project Overview

FoodHub is a comprehensive food delivery platform that connects users with their favorite restaurants. The application is built using a microservices architecture with NestJS for the backend and Next.js for the frontend.

### Key Features

- User authentication and profile management
- Restaurant browsing and menu exploration
- Order placement and tracking
- Payment processing
- Delivery status updates

## Project Structure

```
foodhub/
├── apps/
│   ├── order-service/       # Order management microservice
│   ├── restaurant-service/   # Restaurant management microservice
│   ├── user-service/         # User management microservice
│   └── web/                  # Next.js frontend application
├── libs/                     # Shared libraries and utilities
│   └── config/               # Configuration utilities
├── .github/                  # GitHub Actions workflows
│   └── workflows/
│       ├── development.yml   # CI/CD for development branch
│       └── production.yml    # CI/CD for production branch
└── .env.example             # Example environment variables
```

## Development and Production Environments

This project uses a branch-based strategy for managing development and production environments:

- `main` branch: Production-ready code
- `development` branch: Active development
- Feature branches: Individual features (branch off development)

For more details on environment configuration, see [ENVIRONMENT.md](./ENVIRONMENT.md).

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm (v8 or later)
- PostgreSQL (for local development)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/Ostive/foodhub.git
   cd foodhub
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env.development
   # Edit .env.development with your local settings
   ```

### Running the Services

#### Backend Services

```bash
# Start all microservices in development mode
npm run start:dev

# Start a specific microservice
npm run start:dev order-service
```

#### Frontend Application

```bash
# Navigate to the web app directory
cd apps/web

# Install frontend dependencies
npm install

# Start the Next.js development server
npm run dev
```

## Testing

```bash
# Run unit tests
npm run test

# Run end-to-end tests
npm run test:e2e

# Generate test coverage report
npm run test:cov
```

## Deployment

The project is set up with GitHub Actions workflows for automated CI/CD:

- Push to `development` branch: Triggers the development workflow
- Push to `main` branch: Triggers the production workflow

For manual deployment, follow these steps:

```bash
# Build for production
NODE_ENV=production npm run build

# Start production server
NODE_ENV=production npm run start:prod
```

## Contributing

1. Create a feature branch from development
   ```bash
   git checkout development
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit
   ```bash
   git add .
   git commit -m "Add your feature description"
   ```

3. Push to your branch
   ```bash
   git push origin feature/your-feature-name
   ```

4. Create a pull request to the development branch

## License

This project is licensed under the MIT License - see the LICENSE file for details.

