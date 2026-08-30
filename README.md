# Next.js Enterprise Starter

Production-oriented Next.js and TypeScript starter for secure enterprise web applications, APIs and SaaS foundations.

## Why this repository exists

Most starter projects optimize for speed of scaffolding. This one is intended as a cleaner baseline for business applications where structure, validation, security defaults, maintainability and deployment readiness matter from the beginning.

## Current foundation

- Next.js App Router
- React 19
- Strict TypeScript configuration
- Runtime environment validation with Zod
- Security response headers
- Health API endpoint
- Responsive enterprise-style starter UI
- Node.js test coverage for environment validation
- GitHub Actions validation for typecheck, tests and production build
- Safe `.env.example`
- MIT license

## Architecture

```text
src/
├── app/
│   ├── api/health/route.ts   # service health endpoint
│   ├── globals.css           # minimal enterprise UI styling
│   ├── layout.tsx            # application shell and metadata
│   └── page.tsx              # starter landing page
└── config/
    └── env.ts                # typed environment validation

tests/
└── env.test.ts               # configuration validation tests
```

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Validation

```bash
npm run typecheck
npm test
npm run build
```

The same validation runs in GitHub Actions for pull requests targeting `main`.

## Environment configuration

```env
NEXT_PUBLIC_APP_NAME=Enterprise Starter
APP_ENV=development
APP_URL=http://localhost:3000
```

Environment values are parsed centrally through `src/config/env.ts`. Invalid production configuration should fail explicitly rather than silently propagating through application code.

## Security baseline

The starter disables the default `X-Powered-By` response header and applies baseline security headers including content-type sniffing protection, frame denial, a strict referrer policy, and restrictive browser permissions.

This is a starting point, not a replacement for application-specific threat modeling, authentication, authorization, CSP design, rate limiting, secrets management, dependency review or infrastructure controls.

## Health endpoint

```http
GET /api/health
```

Example response:

```json
{
  "ok": true,
  "service": "Enterprise Starter",
  "environment": "development",
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```

## Roadmap

- [x] Next.js + TypeScript foundation
- [x] Environment validation
- [x] Security headers
- [x] Health API
- [x] Automated CI
- [ ] Authentication abstraction
- [ ] Role-based authorization example
- [ ] Structured API response/error helpers
- [ ] Request validation examples
- [ ] Observability and audit logging foundation
- [ ] Database/repository abstraction example
- [ ] Container deployment example

## Maintainer

**Mohammed Mohsin**  
Founder & CEO, Implement Media Solutions Pvt Ltd  
[Website](https://implementmediasolutions.com) · [LinkedIn](https://www.linkedin.com/in/mohammed-mohsin-ims/)

## License

MIT
