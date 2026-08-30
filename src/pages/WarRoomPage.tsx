import { useState } from "react";
import {
  Layers,
  Pause,
  Play,
  RefreshCw,
  Send,
  Terminal,
  Workflow,
} from "lucide-react";
import { Button } from "@nous-research/ui/ui/components/button";
import { Input } from "@nous-research/ui/ui/components/input";
import { Badge } from "@nous-research/ui/ui/components/badge";
import { useToast } from "@nous-research/ui/hooks/use-toast";
import { cn } from "@/lib/utils";
import { isDemoModeActive } from "@/lib/backend-router";

export interface SwarmAgentNode {
  id: string;
  name: string;
  role: "coordinator" | "worker" | "critic" | "evaluator";
  status: "running" | "waiting_tool" | "completed" | "error" | "paused";
  model: string;
  parentId?: string;
  iterationsUsed: number;
  iterationsMax: number;
  tokensUsed: number;
  currentTask: string;
  lastToolCall?: {
    name: string;
    args: string;
    result?: string;
  };
  messagesCount: number;
}

const DEMO_SWARM: SwarmAgentNode[] = [
  {
    id: "agent-coord-0",
    name: "Swarm Coordinator",
    role: "coordinator",
    status: "running",
    model: "claude-3-7-sonnet",
    iterationsUsed: 14,
    iterationsMax: 50,
    tokensUsed: 8420,
    currentTask: "Orchestrating microservice deployment & E2E verification",
    lastToolCall: {
      name: "delegate_task",
      args: '{"target": "worker-k8s", "task": "Validate k8s cluster ingress manifests"}',
      result: "Task accepted by worker-k8s",
    },
    messagesCount: 18,
  },
  {
    id: "worker-k8s",
    name: "K8s Ingress Worker",
    role: "worker",
    parentId: "agent-coord-0",
    status: "running",
    model: "gemini-2.5-pro",
    iterationsUsed: 8,
    iterationsMax: 20,
    tokensUsed: 4120,
    currentTask: "Writing ingress.yaml and configuring cert-manager annotations",
    lastToolCall: {
      name: "write_file",
      args: '{"path": "k8s/ingress.yaml"}',
      result: "File written successfully (42 lines)",
    },
    messagesCount: 10,
  },
  {
    id: "worker-tester",
    name: "Integration Test Worker",
    role: "worker",
    parentId: "agent-coord-0",
    status: "waiting_tool",
    model: "claude-3-7-sonnet",
    iterationsUsed: 5,
    iterationsMax: 20,
    tokensUsed: 2950,
    currentTask: "Running vitest e2e connectivity suites against local endpoint",
    lastToolCall: {
      name: "terminal",
      args: '{"command": "vitest run --testPathPattern=e2e"}',
    },
    messagesCount: 7,
  },
  {
    id: "worker-docs",
    name: "Doc Sync Critic",
    role: "critic",
    parentId: "agent-coord-0",
    status: "completed",
    model: "gpt-4o-mini",
    iterationsUsed: 3,
    iterationsMax: 10,
    tokensUsed: 1240,
    currentTask: "Updated OpenAPI schema references and deployment guide",
    lastToolCall: {
      name: "patch",
      args: '{"path": "docs/deployment.md"}',
      result: "1 hunk applied",
    },
    messagesCount: 6,
  },
];

export default function WarRoomPage() {
  const [nodes, setNodes] = useState<SwarmAgentNode[]>(DEMO_SWARM);
  const [selectedNodeId, setSelectedNodeId] = useState<string>("agent-coord-0");
  const [redirectPrompt, setRedirectPrompt] = useState("");
  const { showToast } = useToast();

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  const handleTogglePause = (nodeId: string) => {
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === nodeId) {
          const nextStatus = n.status === "paused" ? "running" : "paused";
          showToast(
            `Subagent "${n.name}" is now ${nextStatus}`,
            "success",
          );
          return { ...n, status: nextStatus };
        }
        return n;
      }),
    );
  };

  const handleInjectGuidance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!redirectPrompt.trim()) return;
    showToast(
      `Injected guidance to "${selectedNode.name}": "${redirectPrompt.trim()}"`,
      "success",
    );
    setRedirectPrompt("");
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-background">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-border/80 px-6 py-4 bg-muted/20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Workflow className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold text-foreground">
                War Room & Live Swarm Visualizer
              </h1>
              <Badge tone="default" className="text-[10px] uppercase font-mono tracking-wider">
                {isDemoModeActive() ? "Simulation Mode" : "Live DAG"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Real-time multi-agent delegation graph, token & iteration budget telemetry, and branch controls
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            outlined
            className="h-8 text-xs gap-1.5 px-3"
            onClick={() => {
              setNodes(DEMO_SWARM);
              showToast("Refreshed active swarm state", "success");
            }}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left: Interactive Swarm DAG Visualizer Canvas */}
        <div className="flex-1 overflow-auto p-6 space-y-6 border-r border-border/80 bg-dot-pattern">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <Layers className="h-4 w-4 text-primary" />
              <span>ACTIVE DELEGATION TREE ({nodes.length} AGENTS)</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-success" /> Running
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-warning" /> Waiting Tool
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-muted" /> Completed
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-primary" /> Paused
              </span>
            </div>
          </div>

          {/* Root Coordinator Node */}
          <div className="space-y-4">
            {nodes
              .filter((n) => !n.parentId)
              .map((coord) => (
                <div key={coord.id} className="space-y-4">
                  {/* Coordinator Card */}
                  <div
                    onClick={() => setSelectedNodeId(coord.id)}
                    className={cn(
                      "p-4 rounded-xl border transition-all cursor-pointer bg-card/90 shadow-md",
                      selectedNodeId === coord.id
                        ? "border-primary ring-2 ring-primary/20 bg-primary/[0.04]"
                        : "border-border hover:border-primary/40",
                    )}
                  >
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="h-2.5 w-2.5 rounded-full bg-success animate-pulse" />
                        <span className="font-semibold text-sm text-foreground">{coord.name}</span>
                        <Badge tone="default" className="text-[10px] font-mono">
                          {coord.model}
                        </Badge>
                      </div>
                      <span className="text-[11px] font-mono text-muted-foreground">
                        {coord.tokensUsed.toLocaleString()} tokens
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground mb-3 font-mono">
                      {coord.currentTask}
                    </p>

                    {/* Progress Budget Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                        <span>Iterations Budget</span>
                        <span>
                          {coord.iterationsUsed} / {coord.iterationsMax}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{
                            width: `${(coord.iterationsUsed / coord.iterationsMax) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Connected Child Branches */}
                  <div className="pl-6 border-l-2 border-dashed border-primary/30 ml-6 space-y-3">
                    {nodes
                      .filter((n) => n.parentId === coord.id)
                      .map((worker) => (
                        <div
                          key={worker.id}
                          onClick={() => setSelectedNodeId(worker.id)}
                          className={cn(
                            "p-3.5 rounded-lg border transition-all cursor-pointer bg-card/80",
                            selectedNodeId === worker.id
                              ? "border-primary ring-2 ring-primary/20 bg-primary/[0.04]"
                              : "border-border hover:border-primary/40",
                          )}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <div className="flex items-center gap-2">
                              <span
                                className={cn(
                                  "h-2 w-2 rounded-full",
                                  worker.status === "running" && "bg-success animate-ping",
                                  worker.status === "waiting_tool" && "bg-warning",
                                  worker.status === "completed" && "bg-muted-foreground",
                                  worker.status === "paused" && "bg-primary",
                                )}
                              />
                              <span className="font-medium text-xs text-foreground">
                                {worker.name}
                              </span>
                              <span className="text-[10px] font-mono uppercase text-muted-foreground">
                                [{worker.role}]
                              </span>
                            </div>

                            <span className="text-[11px] font-mono text-muted-foreground">
                              {worker.tokensUsed.toLocaleString()} tok
                            </span>
                          </div>

                          <div className="text-[11px] text-muted-foreground font-mono truncate mb-2">
                            {worker.currentTask}
                          </div>

                          <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground pt-2 border-t border-border/40">
                            <span>
                              Iter: {worker.iterationsUsed}/{worker.iterationsMax}
                            </span>
                            <span>{worker.status.toUpperCase()}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Right: Subagent Inspector & Live Controller */}
        <div className="w-96 flex flex-col overflow-y-auto bg-muted/10 p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-border/80 pb-3 shrink-0">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Subagent Telemetry</h2>
              <p className="text-[11px] font-mono text-muted-foreground">{selectedNode.id}</p>
            </div>
            <Button
              outlined
              size="icon"
              className={cn(
                "h-8 w-8",
                selectedNode.status === "paused"
                  ? "text-success border-success/40"
                  : "text-warning border-warning/40",
              )}
              title={selectedNode.status === "paused" ? "Resume Agent" : "Pause Agent"}
              onClick={() => handleTogglePause(selectedNode.id)}
            >
              {selectedNode.status === "paused" ? (
                <Play className="h-3.5 w-3.5" />
              ) : (
                <Pause className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>

          {/* Node Summary Specs */}
          <div className="rounded-lg border border-border/80 bg-background/60 p-3 space-y-2.5 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Model:</span>
              <span className="text-foreground font-medium">{selectedNode.model}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Role:</span>
              <span className="uppercase text-primary font-medium">{selectedNode.role}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className="uppercase text-foreground">{selectedNode.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tokens Spent:</span>
              <span className="text-foreground font-medium">
                {selectedNode.tokensUsed.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Messages in Context:</span>
              <span className="text-foreground font-medium">{selectedNode.messagesCount}</span>
            </div>
          </div>

          {/* Latest Tool Call */}
          {selectedNode.lastToolCall && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Terminal className="h-3 w-3" />
                Latest Tool Execution
              </label>
              <div className="rounded-lg border border-border/80 bg-black/90 p-3 text-[11px] font-mono space-y-1.5 text-text-primary">
                <div className="text-primary font-semibold">
                  {selectedNode.lastToolCall.name}()
                </div>
                <div className="text-muted-foreground overflow-x-auto whitespace-pre-wrap">
                  {selectedNode.lastToolCall.args}
                </div>
                {selectedNode.lastToolCall.result && (
                  <div className="pt-1.5 border-t border-border/40 text-emerald-400">
                    → {selectedNode.lastToolCall.result}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Live Steering / Guidance Injection Form */}
          <div className="space-y-2 pt-2 border-t border-border/80">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <Send className="h-3 w-3 text-primary" />
              Inject Mid-Turn Guidance
            </label>
            <form onSubmit={handleInjectGuidance} className="space-y-2">
              <Input
                value={redirectPrompt}
                onChange={(e) => setRedirectPrompt(e.target.value)}
                placeholder="Direct subagent or update prompt constraints…"
                className="h-8 text-xs font-mono"
              />
              <Button type="submit" className="w-full h-8 text-xs gap-1.5">
                <Send className="h-3 w-3" />
                Send Guidance
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
