export type AuditOutcome = "success" | "denied" | "failure";

export interface AuditActor {
  id?: string;
  type: "user" | "service" | "anonymous";
}

export interface AuditEvent {
  id: string;
  action: string;
  outcome: AuditOutcome;
  occurredAt: string;
  actor: AuditActor;
  requestId?: string;
  resource?: {
    type: string;
    id?: string;
  };
  metadata?: Record<string, string | number | boolean | null>;
}

export interface AuditSink {
  write(event: AuditEvent): void | Promise<void>;
}

export class InMemoryAuditSink implements AuditSink {
  readonly events: AuditEvent[] = [];

  write(event: AuditEvent): void {
    this.events.push(structuredClone(event));
  }
}

export function createAuditEvent(
  input: Omit<AuditEvent, "id" | "occurredAt"> & {
    id?: string;
    occurredAt?: string;
  },
): AuditEvent {
  return {
    ...input,
    id: input.id ?? crypto.randomUUID(),
    occurredAt: input.occurredAt ?? new Date().toISOString(),
  };
}
