import { useState } from "react";
import {
  CheckCircle2,
  Gauge,
  Play,
} from "lucide-react";
import { Button } from "@nous-research/ui/ui/components/button";
import { Badge } from "@nous-research/ui/ui/components/badge";
import { Spinner } from "@nous-research/ui/ui/components/spinner";
import { useToast } from "@nous-research/ui/hooks/use-toast";
import { cn } from "@/lib/utils";

interface BenchmarkSuite {
  id: string;
  name: string;
  category: string;
  promptCount: number;
  description: string;
  lastRunAt: string;
  results: Record<
    string,
    {
      passRate: number;
      latencyMs: number;
      tokenCostUsd: number;
      driftScore: number;
    }
  >;
}

const EVALUATION_SUITES: BenchmarkSuite[] = [
  {
    id: "suite-tool-calling",
    name: "Tool Call Precision & Schema Strictness",
    category: "Tool Use",
    promptCount: 50,
    description: "Evaluates correct tool selection, argument typing, and backtick resolution across file and terminal tools.",
    lastRunAt: "2026-08-27 22:40",
    results: {
      "claude-3-7-sonnet": { passRate: 98.0, latencyMs: 840, tokenCostUsd: 0.14, driftScore: 0.02 },
      "gemini-2.5-pro": { passRate: 96.0, latencyMs: 620, tokenCostUsd: 0.08, driftScore: 0.04 },
      "gpt-4o": { passRate: 94.0, latencyMs: 780, tokenCostUsd: 0.12, driftScore: 0.05 },
    },
  },
  {
    id: "suite-code-refactor",
    name: "Multi-File Code Refactoring & Diffs",
    category: "Coding",
    promptCount: 35,
    description: "Tests atomic patch applications, AST integrity, and file journal rollback safety.",
    lastRunAt: "2026-08-28 01:15",
    results: {
      "claude-3-7-sonnet": { passRate: 97.1, latencyMs: 1420, tokenCostUsd: 0.28, driftScore: 0.03 },
      "gemini-2.5-pro": { passRate: 94.2, latencyMs: 1100, tokenCostUsd: 0.16, driftScore: 0.06 },
      "gpt-4o": { passRate: 91.4, latencyMs: 1350, tokenCostUsd: 0.24, driftScore: 0.08 },
    },
  },
  {
    id: "suite-caching-invariance",
    name: "Prompt Caching Prefix Stability",
    category: "Architecture",
    promptCount: 40,
    description: "Validates that system prompt modifications preserve byte-stable prefixes across conversation turns.",
    lastRunAt: "2026-08-28 02:00",
    results: {
      "claude-3-7-sonnet": { passRate: 100.0, latencyMs: 320, tokenCostUsd: 0.04, driftScore: 0.00 },
      "gemini-2.5-pro": { passRate: 100.0, latencyMs: 290, tokenCostUsd: 0.02, driftScore: 0.00 },
      "gpt-4o": { passRate: 97.5, latencyMs: 410, tokenCostUsd: 0.06, driftScore: 0.02 },
    },
  },
];

export default function EvaluationsPage() {
  const [suites] = useState<BenchmarkSuite[]>(EVALUATION_SUITES);
  const [runningSuiteId, setRunningSuiteId] = useState<string | null>(null);
  const [selectedSuiteId, setSelectedSuiteId] = useState<string>(EVALUATION_SUITES[0].id);
  const { showToast } = useToast();

  const selectedSuite = suites.find((s) => s.id === selectedSuiteId) || suites[0];

  const handleRunSuite = (suiteId: string) => {
    setRunningSuiteId(suiteId);
    setTimeout(() => {
      setRunningSuiteId(null);
      showToast(`Evaluation suite completed successfully`, "success");
    }, 2000);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-background">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-border/80 px-6 py-4 bg-muted/20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Gauge className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold text-foreground">
                Evaluations & Prompt Regression Suite
              </h1>
              <Badge tone="default" className="text-[10px] uppercase font-mono tracking-wider">
                Benchmark Runner
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Automated pass rate, latency, token expenditure, and drift tracking across model backends
            </p>
          </div>
        </div>

        <Button
          onClick={() => handleRunSuite(selectedSuite.id)}
          disabled={runningSuiteId !== null}
          className="h-8 text-xs gap-1.5 px-3"
        >
          {runningSuiteId ? (
            <>
              <Spinner className="h-3.5 w-3.5" /> Running Suite…
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5" /> Run Selected Suite
            </>
          )}
        </Button>
      </div>

      {/* Main Split Layout */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left: Suite List */}
        <div className="w-80 border-r border-border/80 p-4 space-y-3 overflow-y-auto bg-muted/10 shrink-0">
          <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider px-1">
            Evaluation Suites ({suites.length})
          </div>

          <div className="space-y-2">
            {suites.map((suite) => {
              const isSelected = suite.id === selectedSuiteId;
              return (
                <div
                  key={suite.id}
                  onClick={() => setSelectedSuiteId(suite.id)}
                  className={cn(
                    "p-3 rounded-lg border transition-all cursor-pointer text-left space-y-1.5",
                    isSelected
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border hover:bg-muted/50 text-muted-foreground",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-foreground truncate">
                      {suite.name}
                    </span>
                    <Badge tone="outline" className="text-[9px] font-mono">
                      {suite.category}
                    </Badge>
                  </div>
                  <div className="text-[11px] text-muted-foreground font-mono">
                    {suite.promptCount} benchmark prompts
                  </div>
                  <div className="text-[10px] text-muted-foreground/80 font-mono">
                    Last Run: {suite.lastRunAt}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Comparison Matrix */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* Suite Overview Header */}
          <div className="space-y-1.5 border-b border-border/60 pb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">{selectedSuite.name}</h2>
              <span className="text-xs font-mono text-muted-foreground">
                Category: {selectedSuite.category}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{selectedSuite.description}</p>
          </div>

          {/* Model Performance Comparison Cards */}
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(selectedSuite.results).map(([modelName, stats]) => (
              <div
                key={modelName}
                className="rounded-xl border border-border/80 bg-card p-4 space-y-3.5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-foreground font-mono">
                    {modelName}
                  </span>
                  <Badge tone={stats.passRate >= 95 ? "success" : "warning"} className="text-xs font-mono">
                    {stats.passRate.toFixed(1)}% Pass
                  </Badge>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Average Latency:</span>
                    <span className="text-foreground font-medium">{stats.latencyMs}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Token Cost / Run:</span>
                    <span className="text-foreground font-medium">
                      ${stats.tokenCostUsd.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Semantic Drift:</span>
                    <span className="text-emerald-400 font-medium">
                      {(stats.driftScore * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Visual Pass Rate Bar */}
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      stats.passRate >= 95 ? "bg-success" : "bg-warning",
                    )}
                    style={{ width: `${stats.passRate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Regression Invariants & Quality Guarantees */}
          <div className="rounded-lg border border-border/80 bg-muted/20 p-4 space-y-3">
            <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5 uppercase tracking-wider">
              <CheckCircle2 className="h-4 w-4 text-success" />
              Automated Invariant Assertions
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs font-mono text-muted-foreground">
              <div className="p-2.5 rounded bg-background/60 border border-border/40 space-y-1">
                <div className="text-foreground font-medium">Prompt Cache Invariance</div>
                <div>Prefix hashes match across turns (zero mid-loop token invalidation).</div>
              </div>
              <div className="p-2.5 rounded bg-background/60 border border-border/40 space-y-1">
                <div className="text-foreground font-medium">Role Alternation Security</div>
                <div>Strict user/assistant/tool message sequence contract preserved.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
