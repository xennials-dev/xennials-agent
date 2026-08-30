/**
 * Role-Based Access Control (RBAC) System for Hermes Dashboard
 *
 * Defines user roles, permission matrices, and security guards.
 */

export type UserRole = "viewer" | "operator" | "admin";

export interface RolePermissions {
  canViewDashboard: boolean;
  canViewLogs: boolean;
  canViewAnalytics: boolean;
  canChat: boolean;
  canApproveTools: boolean;
  canEditFiles: boolean;
  canManageCron: boolean;
  canAccessPty: boolean;
  canViewSecrets: boolean;
  canEditSecrets: boolean;
  canModifyConfig: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  viewer: {
    canViewDashboard: true,
    canViewLogs: true,
    canViewAnalytics: true,
    canChat: false,
    canApproveTools: false,
    canEditFiles: false,
    canManageCron: false,
    canAccessPty: false,
    canViewSecrets: false,
    canEditSecrets: false,
    canModifyConfig: false,
  },
  operator: {
    canViewDashboard: true,
    canViewLogs: true,
    canViewAnalytics: true,
    canChat: true,
    canApproveTools: true,
    canEditFiles: true,
    canManageCron: true,
    canAccessPty: false,
    canViewSecrets: false,
    canEditSecrets: false,
    canModifyConfig: false,
  },
  admin: {
    canViewDashboard: true,
    canViewLogs: true,
    canViewAnalytics: true,
    canChat: true,
    canApproveTools: true,
    canEditFiles: true,
    canManageCron: true,
    canAccessPty: true,
    canViewSecrets: true,
    canEditSecrets: true,
    canModifyConfig: true,
  },
};

const RBAC_STORAGE_KEY = "hermes_user_role";

export function getCurrentUserRole(): UserRole {
  if (typeof window === "undefined") return "admin";
  try {
    const saved = localStorage.getItem(RBAC_STORAGE_KEY) as UserRole;
    if (saved && ["viewer", "operator", "admin"].includes(saved)) {
      return saved;
    }
  } catch {
    /* ignore */
  }
  return "admin";
}

export function setCurrentUserRole(role: UserRole): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(RBAC_STORAGE_KEY, role);
    window.dispatchEvent(new CustomEvent("hermes:role-change", { detail: { role } }));
  } catch {
    /* ignore */
  }
}

export function hasPermission(permission: keyof RolePermissions, role?: UserRole): boolean {
  const activeRole = role || getCurrentUserRole();
  return ROLE_PERMISSIONS[activeRole][permission] ?? false;
}
