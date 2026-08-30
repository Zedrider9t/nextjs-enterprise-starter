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
- Responsive enterprise-style starter UI
- Node.js automated tests
- GitHub Actions validation for typecheck, tests and production build
- Safe `.env.example`
- MIT license

## Architecture

```text
src/
├── app/
│   ├── api/
│   │   ├── health/route.ts          # service health endpoint
│   │   └── v1/contacts/route.ts     # validated API example
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
└── services/
    └── customer-service.ts          # business logic using repository contract

tests/
├── authorization.test.ts            # RBAC decision tests
├── env.test.ts                      # configuration validation tests
├── observability.test.ts            # logging and audit tests
├── repository.test.ts               # repository/service behavior tests
└── request-validation.test.ts       # API parsing tests
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

Authentication is intentionally provider-agnostic. The repository defines application-level principal and provider contracts instead of embedding credentials, tokens, or vendor-specific authentication logic. Authorization decisions are explicit and testable.

Structured logging redacts common sensitive fields such as passwords, tokens, authorization headers, cookies, secrets and API keys before context is emitted. This is a defense-in-depth baseline; applications should still avoid placing unnecessary personal or secret data into logs.

This is a starting point, not a replacement for application-specific threat modeling, identity-provider configuration, authorization policy review, CSP design, rate limiting, secrets management, dependency review or infrastructure controls.

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

The example endpoint demonstrates controlled handling of malformed JSON, unsupported content types, schema validation errors and unexpected failures without introducing a database or external service.

## Authentication and authorization

`AuthenticationProvider` defines the boundary where an application can integrate Auth.js, Clerk, Supabase Auth, an enterprise OIDC provider, or another identity system. The starter does not pretend that any of those providers is configured out of the box.

`authorizeRoles()` demonstrates deterministic role checks against application-level roles: `viewer`, `member`, `manager`, and `admin`.

## Observability and audit logging

`createLogRecord()` creates structured records with timestamps, levels, request IDs and recursively redacted context. `ConsoleJsonLogger` is a minimal sink that can be replaced by an application-specific transport.

`AuditEvent` and `AuditSink` define a separate audit trail contract for security- and business-relevant actions. The included in-memory sink exists for testing and examples; production applications should use durable storage with appropriate access controls and retention policies.

## Repository and persistence abstraction

`CustomerRepository` defines a persistence boundary independently of any ORM, SQL dialect, database service or cloud vendor. `CustomerService` depends only on that contract and contains application-level behavior such as normalization, uniqueness checks and active-customer filtering.

The included `InMemoryCustomerRepository` exists for tests and examples. A production application can provide a Prisma, Drizzle, Supabase, PostgreSQL, DynamoDB or other adapter without moving persistence details into the service layer.

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
- [ ] Rate limiting example
- [ ] Container deployment example

## Maintainer

**Mohammed Mohsin**  
Founder & CEO, Implement Media Solutions Pvt Ltd  
[Website](https://implementmediasolutions.com) · [LinkedIn](https://www.linkedin.com/in/mohammed-mohsin-ims/)

## License

MIT
