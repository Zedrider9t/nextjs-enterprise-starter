# v0.1.0 Release Notes

`v0.1.0` is the first public milestone of Next.js Enterprise Starter: a production-oriented Next.js and TypeScript baseline for secure business applications, APIs and SaaS foundations.

## Highlights

- Next.js App Router with React 19 and strict TypeScript.
- Runtime environment validation with Zod.
- Baseline security headers, typed API responses and request IDs.
- Provider-neutral authentication and role-based authorization contracts.
- Structured logging with sensitive-field redaction and explicit audit event contracts.
- Repository abstraction with a repository-backed service-layer example.
- Application-level rate limiting with a provider-neutral store contract.
- Production container baseline using Next.js standalone output and a non-root runtime user.
- CI validation covering typecheck, automated tests, production build and Docker image build.

## Intended use

This release is designed as a reusable engineering foundation rather than a fully configured application. Teams can connect their preferred identity provider, database, durable audit storage, distributed rate limiter and deployment platform while keeping the application architecture decoupled from those vendors.

## Production boundaries

The included in-memory repository, audit sink and rate-limit store are intentionally non-production examples. Production deployments should use durable/shared implementations, trusted infrastructure for network identity and appropriate secrets, TLS, monitoring and container-scanning controls.

## Validation before tagging

Before publishing the `v0.1.0` tag/release:

1. Merge the release-preparation pull request after the required `validate` check succeeds.
2. Confirm `main` CI is green.
3. Confirm no existing `v0.1.0` tag or GitHub Release is present.
4. Create the `v0.1.0` tag from the validated `main` commit.
5. Publish a GitHub Release using these notes.
