/**
 * Hermes Agent - Standalone Demo & Disconnected Simulation Engine
 *
 * Provides high-fidelity mock datasets, simulated telemetry, synthetic streaming
 * responses, and offline capabilities when the dashboard runs on Netlify or without
 * a local backend instance.
 */

export interface MockSessionMessage {
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  timestamp: string;
  reasoning?: string;
  tool_calls?: Array<{
    name: string;
    args: Record<string, unknown>;
    result?: string;
  }>;
}

export interface MockSession {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  model: string;
  platform: string;
  total_tokens: number;
  cost_estimate_usd: number;
  messages: MockSessionMessage[];
  file_modifications?: Array<{
    turn_index: number;
    file_path: string;
    action: "create" | "modify" | "delete";
    diff: string;
    timestamp: string;
  }>;
}

const DEMO_MODE_STORAGE_KEY = "hermes_demo_mode_active";

export function isDemoModeActive(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(DEMO_MODE_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function setDemoModeActive(active: boolean): void {
  if (typeof window === "undefined") return;
  try {
    if (active) {
      localStorage.setItem(DEMO_MODE_STORAGE_KEY, "true");
    } else {
      localStorage.removeItem(DEMO_MODE_STORAGE_KEY);
    }
  } catch {
    /* ignore */
  }
}

export const MOCK_SESSIONS: MockSession[] = [
  {
    id: "demo-swarm-orchestration-01",
    title: "Deploy Microservice Cluster with Kubernetes",
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 1800000).toISOString(),
    model: "claude-3-7-sonnet",
    platform: "cli",
    total_tokens: 14280,
    cost_estimate_usd: 0.042,
    messages: [
      {
        role: "user",
        content: "Set up the Kubernetes deployment manifests and verify cluster ingress routing.",
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        role: "assistant",
        content: "I'll inspect the current manifests, configure the Ingress controller, and patch the service definitions.",
        timestamp: new Date(Date.now() - 3600000 * 2 + 5000).toISOString(),
        reasoning: "First checking existing helm charts and k8s directory structure before writing new ingress configurations.",
        tool_calls: [
          {
            name: "terminal",
            args: { command: "kubectl get nodes -o wide" },
            result: "NAME           STATUS   ROLES           AGE   VERSION\nnode-worker-1  Ready    control-plane   14d   v1.30.2\nnode-worker-2  Ready    worker          14d   v1.30.2",
          },
          {
            name: "write_file",
            args: { path: "k8s/ingress.yaml" },
            result: "File k8s/ingress.yaml successfully written (42 lines).",
          },
        ],
      },
      {
        role: "user",
        content: "Great! Now verify TLS certificate issuance with cert-manager.",
        timestamp: new Date(Date.now() - 1800000).toISOString(),
      },
      {
        role: "assistant",
        content: "Certificate request submitted and validated. HTTPS ingress endpoint is live on `https://api.hermes-cluster.dev`.",
        timestamp: new Date(Date.now() - 1790000).toISOString(),
        reasoning: "Checking Certificate CRD status. Status is Ready=True.",
      },
    ],
    file_modifications: [
      {
        turn_index: 1,
        file_path: "k8s/ingress.yaml",
        action: "create",
        diff: "--- /dev/null\n+++ b/k8s/ingress.yaml\n@@ -0,0 +1,18 @@\n+apiVersion: networking.k8s.io/v1\n+kind: Ingress\n+metadata:\n+  name: hermes-ingress\n+  annotations:\n+    cert-manager.io/cluster-issuer: letsencrypt-prod\n+spec:\n+  rules:\n+  - host: api.hermes-cluster.dev\n+    http:\n+      paths:\n+      - path: /\n+        pathType: Prefix\n+        backend:\n+          service:\n+            name: hermes-gateway\n+            port:\n+              number: 80",
        timestamp: new Date(Date.now() - 3600000 * 2 + 6000).toISOString(),
      },
    ],
  },
  {
    id: "demo-bugfix-refactor-02",
    title: "Fix Context Compression Token Boundary Leak",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 82000000).toISOString(),
    model: "gemini-2.5-pro",
    platform: "telegram",
    total_tokens: 28910,
    cost_estimate_usd: 0.086,
    messages: [
      {
        role: "user",
        content: "Debug the memory leak when context compression runs on conversations over 100 turns.",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        role: "assistant",
        content: "Found the issue: `conversation_compression.py` was holding references to pruned turn vectors in the memoized cache. Patched and verified.",
        timestamp: new Date(Date.now() - 85000000).toISOString(),
        reasoning: "Trace showed that _cache dictionary was growing unboundedly during multi-turn compaction loops.",
      },
    ],
    file_modifications: [
      {
        turn_index: 1,
        file_path: "agent/conversation_compression.py",
        action: "modify",
        diff: "--- a/agent/conversation_compression.py\n+++ b/agent/conversation_compression.py\n@@ -142,4 +142,6 @@\n-    self._cache[turn_id] = full_embedding\n+    if len(self._cache) > 50:\n+        self._cache.pop(next(iter(self._cache)))\n+    self._cache[turn_id] = full_embedding",
        timestamp: new Date(Date.now() - 85000000).toISOString(),
      },
    ],
  },
];

export const MOCK_STATUS = {
  gateway_running: true,
  gateway_state: "running",
  active_sessions: 2,
  version: "hermes-agent 2.4.0 (Demo Mode)",
  platform: "demo",
  uptime_seconds: 42819,
  metrics: {
    cpu_percent: 12.4,
    memory_used_mb: 248.6,
    memory_total_mb: 16384,
    active_subagents: 3,
    total_turns_today: 184,
  },
};

export const MOCK_ANALYTICS = {
  total_tokens: 3849120,
  prompt_tokens: 2894100,
  completion_tokens: 955020,
  total_cost_usd: 12.48,
  daily_stats: [
    { date: "2026-08-22", tokens: 412000, cost: 1.34 },
    { date: "2026-08-23", tokens: 520000, cost: 1.68 },
    { date: "2026-08-24", tokens: 680000, cost: 2.19 },
    { date: "2026-08-25", tokens: 490000, cost: 1.58 },
    { date: "2026-08-26", tokens: 810000, cost: 2.62 },
    { date: "2026-08-27", tokens: 937120, cost: 3.07 },
  ],
  models_breakdown: [
    { model: "claude-3-7-sonnet", usage_percent: 58 },
    { model: "gemini-2.5-pro", usage_percent: 26 },
    { model: "gpt-4o", usage_percent: 16 },
  ],
};
