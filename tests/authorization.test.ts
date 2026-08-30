import test from "node:test";
import assert from "node:assert/strict";
import { authorizeRoles } from "../src/auth/authorization.js";
import type { AuthenticatedPrincipal } from "../src/auth/types.js";

const principal: AuthenticatedPrincipal = {
  id: "test-user",
  roles: ["member", "manager"],
  tenantId: "test-tenant",
};

test("rejects unauthenticated access", () => {
  const decision = authorizeRoles(null, ["member"]);
  assert.equal(decision.allowed, false);
  assert.equal(decision.reason, "unauthenticated");
});

test("allows authenticated access when no roles are required", () => {
  const decision = authorizeRoles(principal, []);
  assert.equal(decision.allowed, true);
  assert.equal(decision.reason, "allowed");
});

test("allows access when the principal has any required role", () => {
  const decision = authorizeRoles(principal, ["admin", "manager"]);
  assert.equal(decision.allowed, true);
  assert.equal(decision.reason, "allowed");
});

test("rejects access when required roles are missing", () => {
  const decision = authorizeRoles(principal, ["admin"]);
  assert.equal(decision.allowed, false);
  assert.equal(decision.reason, "missing-role");
});
