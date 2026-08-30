import { useEffect, useState } from "react";
import {
  getBackendTargetInfo,
  getResolvedBackendUrl,
  probeBackend,
  setBackendTarget,
  getCustomAuthToken,
  setCustomAuthToken,
  isDemoModeActive,
  setDemoModeActive,
  TUNNEL_PRESETS,
  type BackendProbeResult,
  type BackendTargetInfo,
} from "@/lib/backend-router";
import { Button } from "@nous-research/ui/ui/components/button";
import { Input } from "@nous-research/ui/ui/components/input";
import { Spinner } from "@nous-research/ui/ui/components/spinner";
import {
  Activity,
  CheckCircle2,
  Globe,
  KeyRound,
  Laptop,
  Radio,
  RefreshCw,
  Server,
  Sparkles,
  Workflow,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BackendRouterModalProps {
  open: boolean;
  onClose(): void;
}

export function BackendRouterModal({ open, onClose }: BackendRouterModalProps) {
  const [targetInfo, setTargetInfo] = useState<BackendTargetInfo>(getBackendTargetInfo);
  const [customUrl, setCustomUrl] = useState(getResolvedBackendUrl() || "http://127.0.0.1:9119");
  const [authToken, setAuthToken] = useState(getCustomAuthToken() || "");
  const [demoMode, setDemoMode] = useState(isDemoModeActive());
  const [probing, setProbing] = useState(false);
  const [probeResult, setProbeResult] = useState<BackendProbeResult | null>(null);

  const runProbe = async (urlToTest: string) => {
    if (demoMode) {
      setProbeResult({
        ok: true,
        url: "Simulated Backend",
        latencyMs: 12,
        gatewayState: "running",
        activeSessions: 2,
        version: "hermes-agent (Demo Mode)",
      });
      return;
    }
    setProbing(true);
    try {
      const res = await probeBackend(urlToTest);
      setProbeResult(res);
    } finally {
      setProbing(false);
    }
  };

  useEffect(() => {
    if (open) {
      const info = getBackendTargetInfo();
      setTargetInfo(info);
      const active = getResolvedBackendUrl() || "http://127.0.0.1:9119";
      setCustomUrl(active);
      setAuthToken(getCustomAuthToken() || "");
      setDemoMode(isDemoModeActive());
      void runProbe(active);
    }
  }, [open]);

  if (!open) return null;

  const handleApply = (url: string) => {
    setDemoModeActive(demoMode);
    setCustomAuthToken(authToken);
    setBackendTarget(url);
    const updated = getBackendTargetInfo();
    setTargetInfo(updated);
    onClose();
    window.location.reload();
  };

  const handleReset = () => {
    setDemoModeActive(false);
    setCustomAuthToken(null);
    setBackendTarget(null);
    const updated = getBackendTargetInfo();
    setTargetInfo(updated);
    onClose();
    window.location.reload();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-xl border border-border bg-background p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150 my-auto max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Server className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold tracking-wide text-foreground">
                Backend Connection Router
              </h2>
              <p className="text-xs text-muted-foreground">
                Configure remote tunnels, local PTY bridge, or standalone Demo Mode
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground text-sm font-mono px-2 py-1 rounded"
          >
            ✕
          </button>
        </div>

        {/* Demo Mode Banner */}
        <div className="mt-4 rounded-lg border border-primary/30 bg-primary/5 p-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-4 w-4 text-primary shrink-0" />
            <div>
              <div className="text-xs font-semibold text-foreground">Disconnected Demo Mode</div>
              <div className="text-[11px] text-muted-foreground">
                Preview dashboard features, analytics, and simulated sessions with no backend required.
              </div>
            </div>
          </div>
          <Button
            outlined={!demoMode}
            className={cn(
              "h-7 text-xs px-3 shrink-0 font-medium",
              demoMode
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-foreground hover:bg-muted/50",
            )}
            onClick={() => {
              const next = !demoMode;
              setDemoMode(next);
              if (next) {
                setProbeResult({
                  ok: true,
                  url: "Simulated Backend",
                  latencyMs: 8,
                  gatewayState: "running",
                  activeSessions: 2,
                  version: "hermes-agent (Demo Mode)",
                });
              } else {
                void runProbe(customUrl);
              }
            }}
          >
            {demoMode ? "Demo Active" : "Enable Demo"}
          </Button>
        </div>

        {/* Live Status Card */}
        <div className="my-4 rounded-lg border border-border/80 bg-muted/40 p-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground font-mono">Current Host:</span>
            <span className="font-mono font-medium text-foreground">
              {demoMode
                ? "Simulated Client Engine (Demo)"
                : targetInfo.url || `${window?.location?.origin || "Local Origin"} (Same-Origin)`}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground font-mono">Target Type:</span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-primary/10 text-primary">
              {demoMode ? (
                <Sparkles className="h-3 w-3" />
              ) : targetInfo.type === "local-default" ? (
                <Laptop className="h-3 w-3" />
              ) : targetInfo.type === "remote-custom" ? (
                <Globe className="h-3 w-3" />
              ) : (
                <Activity className="h-3 w-3" />
              )}
              {demoMode ? "demo-simulation" : targetInfo.type}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground font-mono">Build Context:</span>
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              {targetInfo.buildType}
            </span>
          </div>

          {/* Probe Status */}
          <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              {probing ? (
                <>
                  <Spinner className="h-3.5 w-3.5 text-primary" />
                  <span className="text-muted-foreground">Testing endpoint…</span>
                </>
              ) : probeResult?.ok ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span className="text-success font-medium">
                    {demoMode ? "Simulated Ready" : "Connected"}
                  </span>
                  {probeResult.latencyMs !== undefined && (
                    <span className="text-[11px] text-muted-foreground font-mono">
                      ({probeResult.latencyMs}ms)
                    </span>
                  )}
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-destructive" />
                  <span className="text-destructive font-medium">
                    {probeResult?.error || "Offline / Unreachable"}
                  </span>
                </>
              )}
            </div>

            <Button
              outlined
              className="h-7 text-xs gap-1.5 px-2.5"
              onClick={() => void runProbe(customUrl)}
              disabled={probing || demoMode}
            >
              <RefreshCw className={cn("h-3 w-3", probing && "animate-spin")} />
              Probe
            </Button>
          </div>
        </div>

        {/* Quick Remote Tunnel Presets */}
        <div className="space-y-2 mb-4">
          <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <Workflow className="h-3.5 w-3.5" />
            Quick Tunnel Presets
          </label>
          <div className="grid grid-cols-2 gap-2">
            {TUNNEL_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  setCustomUrl(preset.example);
                  void runProbe(preset.example);
                }}
                className={cn(
                  "flex items-center gap-2 p-2.5 rounded-lg border text-left text-xs transition-colors",
                  customUrl === preset.example
                    ? "border-primary bg-primary/5 text-foreground"
                    : "border-border hover:bg-muted/50 text-muted-foreground",
                )}
              >
                {preset.id === "tailscale" && <Globe className="h-4 w-4 text-primary shrink-0" />}
                {preset.id === "ngrok" && <Radio className="h-4 w-4 text-primary shrink-0" />}
                {preset.id === "cloudflare" && <Activity className="h-4 w-4 text-primary shrink-0" />}
                {preset.id === "ssh" && <Laptop className="h-4 w-4 text-primary shrink-0" />}
                <div className="min-w-0">
                  <div className="font-medium text-foreground truncate">{preset.label}</div>
                  <div className="text-[10px] text-muted-foreground truncate">{preset.example}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input */}
        <div className="space-y-2 mb-4">
          <label htmlFor="backend-url" className="text-xs font-medium text-muted-foreground">
            Custom Host / IP & Port
          </label>
          <Input
            id="backend-url"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            disabled={demoMode}
            placeholder="e.g. https://xyz.ngrok-free.app or http://192.168.1.50:9119"
            className="h-9 text-xs font-mono"
          />
        </div>

        {/* Custom Auth Token */}
        <div className="space-y-2 mb-6">
          <label htmlFor="auth-token" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <KeyRound className="h-3.5 w-3.5" />
            Session / Auth Token (Optional for remote tunnels)
          </label>
          <Input
            id="auth-token"
            type="password"
            value={authToken}
            onChange={(e) => setAuthToken(e.target.value)}
            disabled={demoMode}
            placeholder="Paste __HERMES_SESSION_TOKEN__ or API Gateway key"
            className="h-9 text-xs font-mono"
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-border">
          <Button outlined onClick={handleReset} className="text-xs px-3">
            Reset to Default
          </Button>

          <div className="flex items-center gap-2">
            <Button outlined onClick={onClose} className="text-xs px-3">
              Cancel
            </Button>
            <Button
              onClick={() => handleApply(customUrl)}
              className="text-xs gap-1.5 px-3"
            >
              Apply & Switch
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
