import { z } from "zod";
import { ApiError } from "@/lib/api/error";
import { createRequestId, jsonError, jsonSuccess } from "@/lib/api/response";
import { parseWithSchema } from "@/lib/api/validation";
import {
  createRateLimitKey,
  InMemoryFixedWindowRateLimitStore,
} from "@/security/rate-limit";

const contactRequestSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  company: z.string().trim().min(2).max(120).optional(),
  message: z.string().trim().min(10).max(2000),
});

const contactRateLimitStore = new InMemoryFixedWindowRateLimitStore();
const contactRateLimitPolicy = { limit: 5, windowMs: 60_000 } as const;

export async function POST(request: Request) {
  const requestId = createRequestId();

  try {
    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      throw new ApiError(400, "BAD_REQUEST", "Content-Type must be application/json.");
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      throw new ApiError(400, "BAD_REQUEST", "Request body must contain valid JSON.");
    }

    const contact = parseWithSchema(contactRequestSchema, body);
    const rateLimit = contactRateLimitStore.consume(
      createRateLimitKey("contact", contact.email),
      contactRateLimitPolicy,
    );

    if (!rateLimit.allowed) {
      throw new ApiError(
        429,
        "RATE_LIMITED",
        "Too many contact requests. Please try again later.",
        {
          retryAfterSeconds: rateLimit.retryAfterSeconds,
          resetAt: new Date(rateLimit.resetAt).toISOString(),
        },
      );
    }

    return jsonSuccess(
      {
        accepted: true,
        contact: {
          name: contact.name,
          email: contact.email,
          company: contact.company ?? null,
        },
      },
      requestId,
      202,
    );
  } catch (error) {
    return jsonError(error, requestId);
  }
}
