export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogRecord {
  level: LogLevel;
  message: string;
  timestamp: string;
  requestId?: string;
  context?: Record<string, unknown>;
}

const sensitiveKeyPattern = /password|secret|token|authorization|cookie|api[-_]?key/i;

export function redactValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(redactValue);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, nestedValue]) => [
        key,
        sensitiveKeyPattern.test(key) ? "[REDACTED]" : redactValue(nestedValue),
      ]),
    );
  }

  return value;
}

export function createLogRecord(input: Omit<LogRecord, "timestamp"> & { timestamp?: string }): LogRecord {
  return {
    ...input,
    timestamp: input.timestamp ?? new Date().toISOString(),
    context: input.context ? (redactValue(input.context) as Record<string, unknown>) : undefined,
  };
}

export interface Logger {
  write(record: LogRecord): void | Promise<void>;
}

export class ConsoleJsonLogger implements Logger {
  write(record: LogRecord): void {
    const output = JSON.stringify(record);

    if (record.level === "error") {
      console.error(output);
      return;
    }

    if (record.level === "warn") {
      console.warn(output);
      return;
    }

    console.log(output);
  }
}
