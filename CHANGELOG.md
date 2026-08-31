# Changelog

All notable changes to this project are documented in this file.

The format is based on Keep a Changelog, and this project follows Semantic Versioning.

## [0.1.0] - 2026-08-31

### Added

- Production-oriented Next.js App Router and React 19 foundation.
- Strict TypeScript configuration and runtime environment validation with Zod.
- Baseline security headers and disabled `X-Powered-By` response header.
- Health endpoint at `/api/health`.
- Typed API success/error envelopes, request IDs and reusable Zod request parsing.
- Validated `/api/v1/contacts` example endpoint.
- Provider-agnostic authentication contracts and role-based authorization helpers.
- Structured logging contracts with sensitive-field redaction.
- Provider-agnostic audit event and sink contracts.
- Vendor-neutral repository abstraction and repository-backed customer service example.
- Vendor-neutral rate-limiting contract with fixed-window in-memory implementation.
- Typed `RATE_LIMITED` API errors and per-email contact endpoint limiting.
- Multi-stage Node.js 20 Alpine Dockerfile with Next.js standalone output.
- Non-root container runtime and health check against `/api/health`.
- Platform-neutral deployment guidance in `docs/DEPLOYMENT.md`.
- Automated tests covering configuration, validation, authorization, observability, repositories and rate limiting.
- GitHub Actions validation for typecheck, tests, production build and Docker image build.
- MIT license and safe environment template.

### Notes

The included in-memory repository, audit sink and rate-limit store are examples for local development and tests. Production systems should provide durable or distributed adapters appropriate to their deployment architecture.
