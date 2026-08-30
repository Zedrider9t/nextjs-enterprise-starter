import type {
  AppRole,
  AuthenticatedPrincipal,
  AuthorizationDecision,
} from "./types.js";

export function authorizeRoles(
  principal: AuthenticatedPrincipal | null,
  requiredRoles: readonly AppRole[],
): AuthorizationDecision {
  if (!principal) {
    return {
      allowed: false,
      reason: "unauthenticated",
      requiredRoles: [...requiredRoles],
    };
  }

  if (requiredRoles.length === 0) {
    return {
      allowed: true,
      reason: "allowed",
      requiredRoles: [],
    };
  }

  const allowed = requiredRoles.some((role) => principal.roles.includes(role));

  return {
    allowed,
    reason: allowed ? "allowed" : "missing-role",
    requiredRoles: [...requiredRoles],
  };
}
