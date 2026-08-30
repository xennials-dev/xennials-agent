import { useEffect, useState } from "react";
import {
  getBackendTargetInfo,
  probeBackend,
  onBackendTargetChange,
  isDemoModeActive,
  type BackendProbeResult,
  type BackendTargetInfo,
} from "@/lib/backend-router";
import { BackendRouterModal } from "@/components/BackendRouterModal";
import { Globe, Laptop } from "lucide-react";
import { cn } from "@/lib/utils";

export function BackendStatusBadge({ className }: { className?: string }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [targetInfo, setTargetInfo] = useState<BackendTargetInfo>(getBackendTargetInfo);
  const [probeResult, setProbeResult] = useState<BackendProbeResult | null>(null);

  useEffect(() => {
    const check = async () => {
      const res = await probeBackend();
      setProbeResult(res);
    };

    void check();
    const interval = setInterval(check, 30000); // Check every 30s
    const unsubscribe = onBackendTargetChange((info) => {
      setTargetInfo(info);
      void check();
    });

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  const isDemo = isDemoModeActive();
  const isOnline = isDemo || probeResult?.ok;
  const isLocal = targetInfo.type.startsWith("local");

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        title={isDemo ? "Demo Simulation Mode Active (Click to configure)" : `Backend: ${targetInfo.url || "Same-Origin"} (${isOnline ? "Connected" : "Offline"} - Click to configure)`}
        className={cn(
          "inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-mono transition-all",
          isDemo
            ? "border-primary/50 bg-primary/10 text-primary hover:bg-primary/20"
            : "border border-border/80 bg-background/80 hover:bg-muted/80 hover:border-primary/50 text-foreground",
          className,
        )}
      >
        <span className="relative flex h-2 w-2">
          {isOnline && (
            <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", isDemo ? "bg-primary" : "bg-success")} />
          )}
          <span
            className={cn(
              "relative inline-flex rounded-full h-2 w-2",
              isDemo ? "bg-primary" : isOnline ? "bg-success" : "bg-destructive",
            )}
          />
        </span>

        {isDemo ? (
          <span className="font-semibold text-[10px] tracking-wide uppercase">Demo</span>
        ) : isLocal ? (
          <Laptop className="h-3 w-3 text-muted-foreground" />
        ) : (
          <Globe className="h-3 w-3 text-muted-foreground" />
        )}

        <span className="truncate max-w-[120px]">
          {isDemo ? "Simulation" : targetInfo.port ? `:${targetInfo.port}` : targetInfo.host || "Router"}
        </span>

        {probeResult?.latencyMs !== undefined && isOnline && !isDemo && (
          <span className="text-[9px] text-muted-foreground hidden sm:inline">
            {probeResult.latencyMs}ms
          </span>
        )}
      </button>

      <BackendRouterModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
