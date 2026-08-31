# Container deployment

The starter includes a production-oriented multi-stage Docker build based on Node.js 20 Alpine and Next.js standalone output.

## Build

```bash
docker build -t nextjs-enterprise-starter .
```

## Run

```bash
docker run --rm \
  -p 3000:3000 \
  -e NEXT_PUBLIC_APP_NAME="Enterprise Starter" \
  -e APP_ENV=production \
  -e APP_URL="https://example.com" \
  nextjs-enterprise-starter
```

The container listens on port `3000` and runs as a non-root user. A Docker health check calls `GET /api/health`.

## Production notes

- Inject secrets and environment-specific values at runtime; do not bake them into the image.
- Terminate TLS at a trusted reverse proxy, load balancer or ingress layer.
- Use a shared rate-limit backend or trusted edge limiter for multi-instance deployments.
- Persist audit data outside the container when durable audit history is required.
- Apply resource limits, image scanning, dependency review and platform-specific network policies in the deployment environment.
- Treat the included Dockerfile as a portable baseline, not a complete infrastructure security policy.

## Platform examples

The image can be used as a base for container platforms such as AWS ECS/Fargate, Google Cloud Run, Azure Container Apps, Kubernetes, Fly.io, Render or similar services. Platform-specific manifests and credentials are intentionally not embedded in this starter.
