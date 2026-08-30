import test from "node:test";
import assert from "node:assert/strict";
import { z } from "zod";
import { ApiError } from "../src/lib/api/error.js";
import { parseWithSchema } from "../src/lib/api/validation.js";

const schema = z.object({
  email: z.string().email(),
  message: z.string().min(10),
});

test("returns validated data for a valid request", () => {
  const result = parseWithSchema(schema, {
    email: "contact@example.com",
    message: "Please contact me about this project.",
  });

  assert.equal(result.email, "contact@example.com");
});

test("throws a typed 422 API error for invalid input", () => {
  assert.throws(
    () => parseWithSchema(schema, { email: "bad", message: "short" }),
    (error: unknown) => {
      assert.ok(error instanceof ApiError);
      assert.equal(error.status, 422);
      assert.equal(error.code, "VALIDATION_ERROR");
      return true;
    },
  );
});
