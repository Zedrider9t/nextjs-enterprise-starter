export type AppRole = "viewer" | "member" | "manager" | "admin";

export interface AuthenticatedPrincipal {
  id: string;
  roles: AppRole[];
  email?: string;
  tenantId?: string;
  metadata?: Readonly<Record<string, string>>;
}

export interface AuthenticationContext {
  authorizationHeader?: string | null;
  cookieHeader?: string | null;
}

export interface AuthenticationProvider {
  readonly name: string;
  authenticate(context: AuthenticationContext): Promise<AuthenticatedPrincipal | null>;
}

export interface AuthorizationDecision {
  allowed: boolean;
  reason: "allowed" | "unauthenticated" | "missing-role";
  requiredRoles: AppRole[];
}
