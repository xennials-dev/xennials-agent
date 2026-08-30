/**
 * Adaptive Backend Connection & Target Router for Hermes Agent
 *
 * Identifies, probes, and dynamically routes API & WebSocket requests
 * based on whether the dashboard is running locally, on Netlify,
 * or connected to a remote custom host/port.
 */

export type BackendTargetType =
  | "same-origin"
  | "local-default"
  | "local-custom"
  | "remote-custom";

export type BuildType =
  | "netlify"
  | "vite-dev"
  | "electron"
  | "production-web";

export interface BackendTargetInfo {
  url: string;
  type: BackendTargetType;
  buildType: BuildType;
  isCrossOrigin: boolean;
  host: string;
  port: string;
  protocol: string;
}

export interface BackendProbeResult {
  ok: boolean;
  url: string;
  latencyMs?: number;
  error?: string;
  gatewayState?: string;
  activeSessions?: number;
  version?: string;
}

const STORAGE_KEY = "hermes_backend_target";
const AUTH_TOKEN_KEY = "hermes_custom_auth_token";
const DEFAULT_LOCAL_URL = "http://127.0.0.1:9119";

export { isDemoModeActive, setDemoModeActive } from "./demo-mode";

export interface TunnelPreset {
  id: string;
  label: string;
  description: string;
  example: string;
  protocol: "http" | "https";
}

export const TUNNEL_PRESETS: TunnelPreset[] = [
  {
    id: "tailscale",
    label: "Tailscale Funnel / MagicDNS",
    description: "Connect via Tailscale IP or MagicDNS node name",
    example: "http://my-machine.tailnet.ts.net:9119",
    protocol: "http",
  },
  {
    id: "ngrok",
    label: "ngrok Tunnel",
    description: "Forwarded public tunnel (ngrok http 9119)",
    example: "https://abcd-12-34.ngrok-free.app",
    protocol: "https",
  },
  {
    id: "cloudflare",
    label: "Cloudflare Tunnel",
    description: "Cloudflare Named or Quick Tunnel",
    example: "https://hermes-gateway.yourdomain.com",
    protocol: "https",
  },
  {
    id: "ssh",
    label: "SSH Port Forward",
    description: "Forwarded local port (ssh -L 9119:localhost:9119)",
    example: "http://127.0.0.1:9119",
    protocol: "http",
  },
];

export function getCustomAuthToken(): string | null {
  return getStorageItem(AUTH_TOKEN_KEY);
}

export function setCustomAuthToken(token: string | null): void {
  if (!token || !token.trim()) {
    setStorageItem(AUTH_TOKEN_KEY, null);
  } else {
    setStorageItem(AUTH_TOKEN_KEY, token.trim());
  }
}

declare global {
  interface Window {
    __HERMES_BACKEND_URL__?: string;
  }
}

function getStorageItem(key: string): string | null {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage.getItem(key);
    }
    if (typeof localStorage !== "undefined") {
      return localStorage.getItem(key);
    }
  } catch {
    /* ignore */
  }
  return null;
}

function setStorageItem(key: string, value: string | null): void {
  try {
    if (value === null) {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem(key);
      }
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem(key);
      }
    } else {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(key, value);
      }
    }
  } catch {
    /* ignore */
  }
}

/**
 * Identify the current build/hosting environment.
 */
export function getBuildType(): BuildType {
  if (typeof window === "undefined") return "production-web";

  // Check for Electron renderer
  if (
    navigator.userAgent?.toLowerCase().includes("electron") ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).electron
  ) {
    return "electron";
  }

  // Check for Netlify hosting
  if (
    window.location?.hostname?.endsWith(".netlify.app") ||
    window.location?.hostname?.includes("netlify")
  ) {
    return "netlify";
  }

  // Check for Vite dev server
  if (typeof import.meta !== "undefined" && import.meta.env?.DEV) {
    return "vite-dev";
  }

  return "production-web";
}

/**
 * Detect the target backend URL following priority rules:
 * 1. URL search param: `?backend=...` or `?api=...`
 * 2. Persistent user override in localStorage
 * 3. Server-injected window.__HERMES_BACKEND_URL__
 * 4. Build-time VITE_HERMES_BACKEND_URL / VITE_HERMES_DASHBOARD_URL
 * 5. Default: same-origin if local, or http://127.0.0.1:9119 if hosted remotely (e.g. Netlify)
 */
export function getResolvedBackendUrl(): string {
  // 1. URL search param override (e.g. ?backend=http://192.168.1.10:9119)
  if (typeof window !== "undefined" && window.location?.search) {
    try {
      const params = new URLSearchParams(window.location.search);
      const paramBackend = params.get("backend") || params.get("api");
      if (paramBackend) {
        const trimmed = paramBackend.trim().replace(/\/+$/, "");
        if (trimmed) return trimmed;
      }
    } catch {
      /* ignore search param parse errors */
    }
  }

  // 2. Persistent user choice in localStorage
  const stored = getStorageItem(STORAGE_KEY);
  if (stored) {
    const trimmed = stored.trim().replace(/\/+$/, "");
    if (trimmed) return trimmed;
  }

  // 3. Injected runtime config
  if (typeof window !== "undefined" && window.__HERMES_BACKEND_URL__) {
    const trimmed = window.__HERMES_BACKEND_URL__.trim().replace(/\/+$/, "");
    if (trimmed) return trimmed;
  }

  // 4. Vite build-time environment variable
  const envUrl =
    typeof import.meta !== "undefined" && import.meta.env
      ? import.meta.env.VITE_HERMES_BACKEND_URL ??
        import.meta.env.VITE_HERMES_DASHBOARD_URL
      : undefined;
  if (envUrl) {
    const trimmed = String(envUrl).trim().replace(/\/+$/, "");
    if (trimmed) return trimmed;
  }

  // 5. Contextual default
  const build = getBuildType();
  if (build === "netlify") {
    // Hosted on Netlify: default to connecting to local user's Hermes Agent instance
    return DEFAULT_LOCAL_URL;
  }

  // Default to relative/same-origin
  return "";
}

/**
 * Get comprehensive metadata about the current backend target.
 */
export function getBackendTargetInfo(): BackendTargetInfo {
  const rawUrl = getResolvedBackendUrl();
  const buildType = getBuildType();

  if (!rawUrl) {
    const loc =
      typeof window !== "undefined" && window.location
        ? window.location
        : { protocol: "http:", host: "localhost", hostname: "localhost", port: "" };
    const isLocal = loc.hostname === "localhost" || loc.hostname === "127.0.0.1";
    return {
      url: "",
      type: isLocal ? "local-default" : "same-origin",
      buildType,
      isCrossOrigin: false,
      host: loc.host || "localhost",
      port: loc.port || "",
      protocol: loc.protocol || "http:",
    };
  }

  try {
    const parsed = new URL(rawUrl);
    const loc =
      typeof window !== "undefined" && window.location
        ? window.location
        : { host: "", protocol: "" };
    const isCrossOrigin =
      parsed.host !== loc.host || parsed.protocol !== loc.protocol;
    const isLocalHost =
      parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
    const port = parsed.port || (parsed.protocol === "https:" ? "443" : "80");

    let type: BackendTargetType = "remote-custom";
    if (isLocalHost) {
      type = port === "9119" ? "local-default" : "local-custom";
    }

    return {
      url: rawUrl,
      type,
      buildType,
      isCrossOrigin,
      host: parsed.host,
      port,
      protocol: parsed.protocol,
    };
  } catch {
    return {
      url: rawUrl,
      type: "remote-custom",
      buildType,
      isCrossOrigin: true,
      host: rawUrl,
      port: "",
      protocol: "http:",
    };
  }
}

/** Listeners for backend target changes */
type BackendChangeListener = (info: BackendTargetInfo) => void;
const listeners = new Set<BackendChangeListener>();

/**
 * Update the user's selected backend target URL.
 */
export function setBackendTarget(url: string | null): void {
  if (!url || !url.trim()) {
    setStorageItem(STORAGE_KEY, null);
  } else {
    setStorageItem(STORAGE_KEY, url.trim().replace(/\/+$/, ""));
  }

  const info = getBackendTargetInfo();
  for (const listener of listeners) {
    try {
      listener(info);
    } catch (e) {
      console.error("[backend-router] Listener error:", e);
    }
  }
}

/**
 * Subscribe to backend target updates.
 */
export function onBackendTargetChange(
  listener: BackendChangeListener,
): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Resolve a relative API endpoint path into a fully qualified URL
 * honoring the active backend target router.
 */
export function resolveApiUrl(path: string, basePath = ""): string {
  const target = getResolvedBackendUrl();
  const normalizedBase = basePath
    ? basePath.startsWith("/")
      ? basePath
      : `/${basePath}`
    : "";
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const combinedPath = `${normalizedBase}${normalizedPath}`;

  if (!target) {
    return combinedPath;
  }

  return `${target}${combinedPath}`;
}

/**
 * Probe a backend target for health, latency, and gateway status.
 */
export async function probeBackend(
  targetUrl?: string,
): Promise<BackendProbeResult> {
  const urlToTest = (
    targetUrl !== undefined ? targetUrl : getResolvedBackendUrl()
  )
    .trim()
    .replace(/\/+$/, "");
  const testEndpoint = urlToTest ? `${urlToTest}/api/status` : "/api/status";

  const start = performance.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000);

  try {
    const headers: Record<string, string> = {
      Accept: "application/json",
    };
    const customToken = getCustomAuthToken();
    if (customToken) {
      headers["X-Hermes-Session-Token"] = customToken;
      headers["Authorization"] = `Bearer ${customToken}`;
    }

    const res = await fetch(testEndpoint, {
      method: "GET",
      signal: controller.signal,
      headers,
    });

    clearTimeout(timeoutId);
    const latencyMs = Math.round(performance.now() - start);

    if (!res.ok) {
      return {
        ok: false,
        url:
          urlToTest ||
          (typeof window !== "undefined" ? window.location?.origin : "") ||
          "same-origin",
        latencyMs,
        error: `HTTP ${res.status}: ${res.statusText}`,
      };
    }

    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("text/html")) {
      return {
        ok: false,
        url:
          urlToTest ||
          (typeof window !== "undefined" ? window.location?.origin : "") ||
          "same-origin",
        latencyMs,
        error:
          "Received HTML instead of JSON. Backend service not responding.",
      };
    }

    const data = await res.json();
    return {
      ok: true,
      url:
        urlToTest ||
        (typeof window !== "undefined" ? window.location?.origin : "") ||
        "same-origin",
      latencyMs,
      gatewayState:
        data?.gateway_state || (data?.gateway_running ? "running" : "stopped"),
      activeSessions: data?.active_sessions ?? 0,
      version: data?.version,
    };
  } catch (err) {
    clearTimeout(timeoutId);
    const latencyMs = Math.round(performance.now() - start);
    return {
      ok: false,
      url:
        urlToTest ||
        (typeof window !== "undefined" ? window.location?.origin : "") ||
        "same-origin",
      latencyMs,
      error:
        (err as Error).name === "AbortError"
          ? "Connection timed out (3s)"
          : (err as Error).message,
    };
  }
}
