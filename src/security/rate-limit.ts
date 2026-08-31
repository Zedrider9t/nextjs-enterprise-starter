export interface RateLimitPolicy {
  limit: number;
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
}

interface WindowState {
  count: number;
  resetAt: number;
}

export interface RateLimitStore {
  consume(key: string, policy: RateLimitPolicy, now?: number): RateLimitResult;
  clear?(key?: string): void;
}

export class InMemoryFixedWindowRateLimitStore implements RateLimitStore {
  private readonly windows = new Map<string, WindowState>();

  consume(key: string, policy: RateLimitPolicy, now = Date.now()): RateLimitResult {
    validatePolicy(policy);

    const normalizedKey = key.trim();
    if (!normalizedKey) {
      throw new Error("Rate-limit key must not be empty.");
    }

    const existing = this.windows.get(normalizedKey);
    const state = !existing || now >= existing.resetAt
      ? { count: 0, resetAt: now + policy.windowMs }
      : existing;

    state.count += 1;
    this.windows.set(normalizedKey, state);

    const allowed = state.count <= policy.limit;
    const remaining = Math.max(policy.limit - state.count, 0);
    const retryAfterSeconds = allowed
      ? 0
      : Math.max(Math.ceil((state.resetAt - now) / 1000), 1);

    return {
      allowed,
      limit: policy.limit,
      remaining,
      resetAt: state.resetAt,
      retryAfterSeconds,
    };
  }

  clear(key?: string): void {
    if (key === undefined) {
      this.windows.clear();
      return;
    }

    this.windows.delete(key.trim());
  }
}

export function createRateLimitKey(namespace: string, identifier: string): string {
  const normalizedNamespace = namespace.trim().toLowerCase();
  const normalizedIdentifier = identifier.trim().toLowerCase();

  if (!normalizedNamespace || !normalizedIdentifier) {
    throw new Error("Rate-limit namespace and identifier are required.");
  }

  return `${normalizedNamespace}:${normalizedIdentifier}`;
}

function validatePolicy(policy: RateLimitPolicy): void {
  if (!Number.isInteger(policy.limit) || policy.limit <= 0) {
    throw new Error("Rate-limit policy limit must be a positive integer.");
  }

  if (!Number.isFinite(policy.windowMs) || policy.windowMs <= 0) {
    throw new Error("Rate-limit policy windowMs must be positive.");
  }
}
