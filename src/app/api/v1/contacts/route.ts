import { z } from "zod";
import { ApiError } from "@/lib/api/error";
import { createRequestId, jsonError, jsonSuccess } from "@/lib/api/response";
import { parseWithSchema } from "@/lib/api/validation";

const contactRequestSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  company: z.string().trim().min(2).max(120).optional(),
  message: z.string().trim().min(10).max(2000),
});

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
