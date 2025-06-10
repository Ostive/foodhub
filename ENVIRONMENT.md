# Environment Configuration Guide

This guide explains how to use environment-specific configuration in the FoodHub project.

## Overview

The project uses environment-specific configuration files to manage different settings for development and production environments. This approach allows you to:

- Keep sensitive information secure
- Use different configuration values for development and production
- Easily switch between environments

## Environment Files

The project uses the following environment files:

- `.env.example` - Template with example values (committed to Git)
- `.env.development` - Development environment settings (not committed to Git)
- `.env.production` - Production environment settings (not committed to Git)

## How to Use

### Backend Services (NestJS)

The backend services automatically load the appropriate environment file based on the `NODE_ENV` value:

```typescript
// This is done in each service's main.ts file
import { loadEnvConfig, getConfig } from '../../../libs/config';

async function bootstrap() {
  // Load environment configuration based on NODE_ENV
  loadEnvConfig();
  
  // Get the configuration
  const config = getConfig();
  
  // Use config values
  await app.listen(config.api.port);
}
```

To access configuration values in your services:

```typescript
import { getConfig } from '../../../libs/config';

@Injectable()
export class YourService {
  private config = getConfig();
  
  someMethod() {
    // Access configuration
    const apiUrl = this.config.api.host;
    const dbUrl = this.config.database.url;
  }
}
```

### Frontend Application (Next.js)

Next.js automatically loads environment variables from `.env.development` or `.env.production` based on the build environment. To use these variables in your components:

```typescript
// Server Components
import { getFrontendConfig } from '../utils/env';

export default function YourServerComponent() {
  const config = getFrontendConfig();
  
  return <div>Welcome to {config.appName}</div>;
}

// Client Components
'use client';
import { getClientConfig } from '../utils/env';

export default function YourClientComponent() {
  const config = getClientConfig();
  
  return <div>API URL: {config.apiUrl}</div>;
}
```

> **Note**: Only variables prefixed with `NEXT_PUBLIC_` are available in client-side code.

## Running with Different Environments

### Development

```bash
# Backend
NODE_ENV=development npm run start:dev

# Frontend
npm run dev
```

### Production

```bash
# Backend
NODE_ENV=production npm run start:prod

# Frontend
npm run build
npm run start
```

## Adding New Environment Variables

1. Add the variable to `.env.example` with a placeholder value
2. Add the variable to your `.env.development` and `.env.production` files
3. Update the configuration interfaces in `libs/config/index.ts` or `apps/web/src/utils/env.ts`
4. Use the variable in your code through the configuration utilities

## Security Best Practices

- Never commit `.env.development` or `.env.production` to Git
- Use strong, unique values for secrets in production
- Rotate secrets regularly
- Use different secrets for development and production
