import { NextResponse } from "next/server";
import { ApiError } from "./error";

export interface ApiSuccess<T> {
  ok: true;
  data: T;
  requestId: string;
}

export interface ApiFailure {
  ok: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  requestId: string;
}

export function createRequestId(): string {
  return crypto.randomUUID();
}

export function jsonSuccess<T>(data: T, requestId: string, status = 200) {
  return NextResponse.json<ApiSuccess<T>>({ ok: true, data, requestId }, { status });
}

export function jsonError(error: unknown, requestId: string) {
  if (error instanceof ApiError) {
    return NextResponse.json<ApiFailure>(
      {
        ok: false,
        error: {
          code: error.code,
          message: error.message,
          ...(error.details === undefined ? {} : { details: error.details }),
        },
        requestId,
      },
      { status: error.status },
    );
  }

  return NextResponse.json<ApiFailure>(
    {
      ok: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "An unexpected error occurred.",
      },
      requestId,
    },
    { status: 500 },
  );
}
