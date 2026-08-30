import { z } from "zod";
import { ApiError } from "./error";

export function parseWithSchema<TSchema extends z.ZodType>(
  schema: TSchema,
  input: unknown,
): z.output<TSchema> {
  const result = schema.safeParse(input);

  if (!result.success) {
    throw new ApiError(
      422,
      "VALIDATION_ERROR",
      "Request validation failed.",
      result.error.flatten(),
    );
  }

  return result.data;
}
