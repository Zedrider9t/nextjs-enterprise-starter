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
- Typed API response and error helpers
- Request validation with Zod
- Request IDs for API traceability
- Provider-agnostic authentication contracts
- Role-based authorization helper
- Structured logging contracts with sensitive-field redaction
- Provider-agnostic audit event and sink contracts
- Vendor-neutral repository abstraction example
- Repository-backed application service example
- Vendor-neutral rate-limiting contract and fixed-window example
- Multi-stage production Docker build
- Non-root standalone Next.js container runtime
- Container health check through `/api/health`
- Responsive enterprise-style starter UI
- Node.js automated tests
- GitHub Actions validation for typecheck, tests, production build and container build
- Safe `.env.example`
- MIT license

## Architecture

```text
src/
├── app/
│   ├── api/
│   │   ├── health/route.ts          # service health endpoint
│   │   └── v1/contacts/route.ts     # validated, rate-limited API example
│   ├── globals.css                  # minimal enterprise UI styling
│   ├── layout.tsx                   # application shell and metadata
│   └── page.tsx                     # starter landing page
├── auth/
│   ├── authorization.ts             # reusable role authorization logic
│   └── types.ts                     # provider-agnostic auth contracts
├── config/
│   └── env.ts                       # typed environment validation
├── domain/
│   └── customer.ts                  # domain model and write inputs
├── lib/
│   └── api/                          # API responses, errors and validation
├── observability/
│   ├── audit.ts                     # audit event and sink contracts
│   └── logger.ts                    # structured logging and redaction
├── repositories/
│   ├── customer-repository.ts       # persistence boundary
│   └── in-memory-customer-repository.ts
├── security/
│   └── rate-limit.ts                # rate-limit contract and demo store
└── services/
    └── customer-service.ts          # business logic using repository contract

tests/
├── authorization.test.ts            # RBAC decision tests
├── env.test.ts                      # configuration validation tests
├── observability.test.ts            # logging and audit tests
├── rate-limit.test.ts               # rate-limit behavior tests
├── repository.test.ts               # repository/service behavior tests
└── request-validation.test.ts       # API parsing tests

Dockerfile                            # production multi-stage image
.dockerignore                         # constrained Docker build context
docs/DEPLOYMENT.md                    # container deployment guidance
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
docker build -t nextjs-enterprise-starter .
```

The same application validation and container build run in GitHub Actions for pull requests targeting `main`.

## Environment configuration

```env
NEXT_PUBLIC_APP_NAME=Enterprise Starter
APP_ENV=development
APP_URL=http://localhost:3000
```

Environment values are parsed centrally through `src/config/env.ts`. Invalid production configuration should fail explicitly rather than silently propagating through application code.

## Security baseline

The starter disables the default `X-Powered-By` response header and applies baseline security headers including content-type sniffing protection, frame denial, a strict referrer policy, and restrictive browser permissions.

Authentication is intentionally provider-agnostic. The repository defines application-level principal and provider contracts instead of embedding credentials, tokens, or vendor-specific authentication logic. Authorization decisions are explicit and testable.

Structured logging redacts common sensitive fields such as passwords, tokens, authorization headers, cookies, secrets and API keys before context is emitted. This is a defense-in-depth baseline; applications should still avoid placing unnecessary personal or secret data into logs.

The rate-limit example deliberately avoids trusting client-supplied IP headers. The contact endpoint demonstrates per-identifier limiting using the validated email address. Production systems should normally combine application-level limits with trusted edge/proxy controls and a shared rate-limit backend.

The production container runs as a non-root user and uses Next.js standalone output to keep the runtime image smaller and independent of development tooling. Secrets are expected to be injected at runtime rather than copied into the image.

This is a starting point, not a replacement for application-specific threat modeling, identity-provider configuration, authorization policy review, CSP design, distributed rate limiting, secrets management, dependency review, container scanning or infrastructure controls.

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

## API validation example

```http
POST /api/v1/contacts
Content-Type: application/json
```

The example endpoint demonstrates controlled handling of malformed JSON, unsupported content types, schema validation errors, per-email request limiting and unexpected failures without introducing a database or external service.

## Authentication and authorization

`AuthenticationProvider` defines the boundary where an application can integrate Auth.js, Clerk, Supabase Auth, an enterprise OIDC provider, or another identity system. The starter does not pretend that any of those providers is configured out of the box.

`authorizeRoles()` demonstrates deterministic role checks against application-level roles: `viewer`, `member`, `manager`, and `admin`.

## Observability and audit logging

`createLogRecord()` creates structured records with timestamps, levels, request IDs and recursively redacted context. `ConsoleJsonLogger` is a minimal sink that can be replaced by an application-specific transport.

`AuditEvent` and `AuditSink` define a separate audit trail contract for security- and business-relevant actions. The included in-memory sink exists for testing and examples; production applications should use durable storage with appropriate access controls and retention policies.

## Repository and persistence abstraction

`CustomerRepository` defines a persistence boundary independently of any ORM, SQL dialect, database service or cloud vendor. `CustomerService` depends only on that contract and contains application-level behavior such as normalization, uniqueness checks and active-customer filtering.

The included `InMemoryCustomerRepository` exists for tests and examples. A production application can provide a Prisma, Drizzle, Supabase, PostgreSQL, DynamoDB or other adapter without moving persistence details into the service layer.

## Rate limiting and abuse protection

`RateLimitStore` defines the application boundary for rate limiting. `InMemoryFixedWindowRateLimitStore` provides a deterministic fixed-window implementation for local development, tests and examples, while `createRateLimitKey()` normalizes namespaced identifiers.

The `/api/v1/contacts` example allows five accepted requests per validated email address per minute and returns a typed `RATE_LIMITED` API error when that limit is exceeded.

The in-memory store is not a distributed production limiter: separate processes, containers, regions or serverless instances will not share state. Production deployments should replace it with an appropriate shared backend or managed edge/gateway rate limiter and should derive network identity only from infrastructure they explicitly trust.

## Container deployment

Build the production image:

```bash
docker build -t nextjs-enterprise-starter .
```

Run it locally:

```bash
docker run --rm \
  -p 3000:3000 \
  -e NEXT_PUBLIC_APP_NAME="Enterprise Starter" \
  -e APP_ENV=production \
  -e APP_URL="https://example.com" \
  nextjs-enterprise-starter
```

The image uses a multi-stage Node.js 20 Alpine build, Next.js standalone output, a non-root runtime user and a health check against `/api/health`. See `docs/DEPLOYMENT.md` for production considerations and platform-neutral guidance.

## Roadmap

- [x] Next.js + TypeScript foundation
- [x] Environment validation
- [x] Security headers
- [x] Health API
- [x] Automated CI
- [x] Structured API response/error helpers
- [x] Request validation examples
- [x] Authentication abstraction
- [x] Role-based authorization example
- [x] Observability and audit logging foundation
- [x] Database/repository abstraction example
- [x] Rate limiting example
- [x] Container deployment example
- [ ] Production authentication adapter example
- [ ] Durable database adapter example
- [ ] Distributed rate-limit adapter example

## Maintainer

**Mohammed Mohsin**  
Founder & CEO, Implement Media Solutions Pvt Ltd  
[Website](https://implementmediasolutions.com) · [LinkedIn](https://www.linkedin.com/in/mohammed-mohsin-ims/)

## License

MIT
