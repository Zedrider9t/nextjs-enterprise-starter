import assert from "node:assert/strict";
import test from "node:test";
import {
  createRateLimitKey,
  InMemoryFixedWindowRateLimitStore,
} from "../src/security/rate-limit";

test("allows requests until the policy limit is reached", () => {
  const store = new InMemoryFixedWindowRateLimitStore();
  const policy = { limit: 2, windowMs: 60_000 };

  const first = store.consume("contact:user@example.com", policy, 1_000);
  const second = store.consume("contact:user@example.com", policy, 2_000);
  const third = store.consume("contact:user@example.com", policy, 3_000);

  assert.equal(first.allowed, true);
  assert.equal(first.remaining, 1);
  assert.equal(second.allowed, true);
  assert.equal(second.remaining, 0);
  assert.equal(third.allowed, false);
  assert.equal(third.remaining, 0);
  assert.equal(third.retryAfterSeconds, 58);
});

test("starts a fresh window after the reset time", () => {
  const store = new InMemoryFixedWindowRateLimitStore();
  const policy = { limit: 1, windowMs: 1_000 };

  assert.equal(store.consume("key", policy, 0).allowed, true);
  assert.equal(store.consume("key", policy, 500).allowed, false);

  const nextWindow = store.consume("key", policy, 1_000);
  assert.equal(nextWindow.allowed, true);
  assert.equal(nextWindow.remaining, 0);
  assert.equal(nextWindow.resetAt, 2_000);
});

test("creates normalized namespaced keys", () => {
  assert.equal(
    createRateLimitKey(" Contact Form ", " User@Example.COM "),
    "contact form:user@example.com",
  );
});

test("rejects invalid policy values", () => {
  const store = new InMemoryFixedWindowRateLimitStore();

  assert.throws(() => store.consume("key", { limit: 0, windowMs: 1_000 }, 0));
  assert.throws(() => store.consume("key", { limit: 1, windowMs: 0 }, 0));
});
