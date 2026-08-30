import { useEffect, useState } from "react";
import { getCurrentUserRole, setCurrentUserRole, type UserRole } from "@/lib/rbac";
import { Shield, ShieldCheck, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function RbacRoleSwitcher({ className }: { className?: string }) {
  const [role, setRole] = useState<UserRole>(getCurrentUserRole());
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleRoleChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ role: UserRole }>;
      if (customEvent.detail?.role) {
        setRole(customEvent.detail.role);
      }
    };
    window.addEventListener("hermes:role-change", handleRoleChange);
    return () => window.removeEventListener("hermes:role-change", handleRoleChange);
  }, []);

  const handleSelectRole = (newRole: UserRole) => {
    setCurrentUserRole(newRole);
    setRole(newRole);
    setMenuOpen(false);
  };

  return (
    <div className={cn("relative inline-block", className)}>
      <button
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
        className={cn(
          "flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-mono border transition-colors",
          role === "admin" && "border-primary/40 bg-primary/10 text-primary",
          role === "operator" && "border-warning/40 bg-warning/10 text-warning",
          role === "viewer" && "border-border/80 bg-muted/40 text-muted-foreground",
        )}
        title="Role-Based Access Control Scope (Click to switch)"
      >
        {role === "admin" && <ShieldCheck className="h-3 w-3" />}
        {role === "operator" && <Shield className="h-3 w-3" />}
        {role === "viewer" && <User className="h-3 w-3" />}
        <span className="uppercase font-semibold tracking-wider text-[10px]">{role}</span>
      </button>

      {menuOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-0 mt-1 w-52 rounded-lg border border-border bg-background p-1.5 shadow-xl z-50 animate-in fade-in-50 zoom-in-95 duration-100 text-xs">
            <div className="px-2 py-1 text-[10px] font-mono text-muted-foreground uppercase tracking-wider border-b border-border/60 mb-1">
              Select RBAC Scope
            </div>

            <button
              type="button"
              onClick={() => handleSelectRole("admin")}
              className={cn(
                "w-full flex items-center justify-between p-2 rounded-md text-left transition-colors",
                role === "admin" ? "bg-primary/15 text-primary font-medium" : "hover:bg-muted/60 text-foreground",
              )}
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Admin</span>
              </div>
              <span className="text-[10px] text-muted-foreground">Full PTY & Keys</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectRole("operator")}
              className={cn(
                "w-full flex items-center justify-between p-2 rounded-md text-left transition-colors",
                role === "operator" ? "bg-warning/15 text-warning font-medium" : "hover:bg-muted/60 text-foreground",
              )}
            >
              <div className="flex items-center gap-2">
                <Shield className="h-3.5 w-3.5" />
                <span>Operator</span>
              </div>
              <span className="text-[10px] text-muted-foreground">Chat & Approvals</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectRole("viewer")}
              className={cn(
                "w-full flex items-center justify-between p-2 rounded-md text-left transition-colors",
                role === "viewer" ? "bg-muted text-foreground font-medium" : "hover:bg-muted/60 text-foreground",
              )}
            >
              <div className="flex items-center gap-2">
                <User className="h-3.5 w-3.5" />
                <span>Viewer</span>
              </div>
              <span className="text-[10px] text-muted-foreground">Read-Only Logs</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
