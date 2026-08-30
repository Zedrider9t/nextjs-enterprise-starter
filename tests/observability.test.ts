import assert from "node:assert/strict";
import test from "node:test";

import { createAuditEvent, InMemoryAuditSink } from "../src/observability/audit.js";
import { createLogRecord, redactValue } from "../src/observability/logger.js";

test("redactValue removes nested sensitive values", () => {
  const redacted = redactValue({
    user: "mohsin",
    token: "secret-token",
    nested: {
      apiKey: "provider-key",
      safe: "visible",
    },
  });

  assert.deepEqual(redacted, {
    user: "mohsin",
    token: "[REDACTED]",
    nested: {
      apiKey: "[REDACTED]",
      safe: "visible",
    },
  });
});

test("createLogRecord preserves request context without leaking credentials", () => {
  const record = createLogRecord({
    level: "info",
    message: "request completed",
    requestId: "req-123",
    timestamp: "2026-08-30T12:00:00.000Z",
    context: {
      route: "/api/v1/contacts",
      authorization: "Bearer private-value",
    },
  });

  assert.equal(record.requestId, "req-123");
  assert.deepEqual(record.context, {
    route: "/api/v1/contacts",
    authorization: "[REDACTED]",
  });
});

test("audit events are explicit and can be written to an interchangeable sink", () => {
  const sink = new InMemoryAuditSink();
  const event = createAuditEvent({
    id: "audit-1",
    occurredAt: "2026-08-30T12:00:00.000Z",
    action: "contact.create",
    outcome: "success",
    actor: { type: "user", id: "user-1" },
    requestId: "req-123",
    resource: { type: "contact", id: "contact-1" },
    metadata: { source: "api" },
  });

  sink.write(event);

  assert.equal(sink.events.length, 1);
  assert.deepEqual(sink.events[0], event);
  assert.notEqual(sink.events[0], event);
});
