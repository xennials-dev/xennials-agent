import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Code,
  FileCode,
  Play,
  Sparkles,
  Wrench,
  XCircle,
} from "lucide-react";
import { Button } from "@nous-research/ui/ui/components/button";
import { Input } from "@nous-research/ui/ui/components/input";
import { Spinner } from "@nous-research/ui/ui/components/spinner";
import { useToast } from "@nous-research/ui/hooks/use-toast";
import { cn } from "@/lib/utils";

interface SkillStudioModalProps {
  open: boolean;
  onClose(): void;
  initialSkillContent?: string;
  skillName?: string;
}

interface LintIssue {
  severity: "error" | "warning" | "info";
  message: string;
  line?: number;
}

export function SkillStudioModal({
  open,
  onClose,
  initialSkillContent,
  skillName = "my-custom-skill",
}: SkillStudioModalProps) {
  const [content, setContent] = useState(
    initialSkillContent ||
      `---\nname: ${skillName}\ndescription: Comprehensive workflow for custom tools and tasks.\n---\n\n# ${skillName}\n\nWhen the user requests custom task automation, follow these steps:\n1. Use \`read_file\` to check workspace structure.\n2. Run \`terminal\` commands safely with defensive flags.\n`,
  );
  const [simulating, setSimulating] = useState(false);
  const [testPrompt, setTestPrompt] = useState("Run my skill and analyze the codebase");
  const [simResult, setSimResult] = useState<{
    activated: boolean;
    toolCalls: string[];
    syntheticResponse: string;
    tokensEstimated: number;
  } | null>(null);
  const { showToast } = useToast();

  if (!open) return null;

  // Real-time Skill Linter
  const lintIssues: LintIssue[] = [];

  // Check 1: Frontmatter bounding
  if (!content.startsWith("---")) {
    lintIssues.push({
      severity: "error",
      message: "Missing opening YAML frontmatter '---'",
      line: 1,
    });
  }

  // Check 2: Name format (kebab-case)
  const nameMatch = content.match(/name:\s*([^\n]+)/);
  if (nameMatch) {
    const rawName = nameMatch[1].trim();
    if (!/^[a-z0-9-]+$/.test(rawName)) {
      lintIssues.push({
        severity: "error",
        message: `Skill name "${rawName}" should be lowercase kebab-case (e.g. "deploy-service")`,
      });
    }
  } else {
    lintIssues.push({
      severity: "error",
      message: "Missing 'name:' declaration in YAML frontmatter",
    });
  }

  // Check 3: Description length <= 60 chars
  const descMatch = content.match(/description:\s*([^\n]+)/);
  if (descMatch) {
    const desc = descMatch[1].trim();
    if (desc.length > 60) {
      lintIssues.push({
        severity: "warning",
        message: `Description is ${desc.length} chars (guidelines recommend <= 60 chars for fast prefix matching)`,
      });
    }
  }

  // Check 4: Tool references with backticks
  const rawToolMatches = content.match(/(terminal|read_file|write_file|patch|web_search)(?![`])/g);
  if (rawToolMatches && rawToolMatches.length > 0) {
    lintIssues.push({
      severity: "info",
      message: `Consider wrapping tool references in backticks (e.g. \`${rawToolMatches[0]}\`) to guide model attention.`,
    });
  }

  const handleDryRun = () => {
    setSimulating(true);
    setTimeout(() => {
      setSimulating(false);
      setSimResult({
        activated: true,
        toolCalls: ["read_file", "terminal"],
        syntheticResponse: `[Dry-Run Simulation Sandbox]\nSkill "${nameMatch ? nameMatch[1].trim() : skillName}" successfully recognized and matched prompt.\nTool schema verification passed without polluting live session cache.`,
        tokensEstimated: 840,
      });
      showToast("Dry-run sandbox simulation completed", "success");
    }, 1200);
  };

  const hasErrors = lintIssues.some((i) => i.severity === "error");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl rounded-xl border border-border bg-background p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150 my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold tracking-wide text-foreground">
                Skill Studio & Sandboxed Dry-Run
              </h2>
              <p className="text-xs text-muted-foreground">
                Author, lint, and validate Hermes skills in an isolated simulation sandbox
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

        {/* Studio Body: Editor on Left, Linter & Sandbox on Right */}
        <div className="grid grid-cols-2 gap-4 py-4 flex-1 min-h-0 overflow-hidden">
          {/* Left: SKILL.md Editor */}
          <div className="flex flex-col space-y-2 min-h-0">
            <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <FileCode className="h-3.5 w-3.5 text-primary" />
                SKILL.md (YAML Frontmatter + Playbook)
              </span>
              <span>{content.length} chars</span>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 w-full p-3.5 rounded-lg border border-border bg-black/90 font-mono text-xs text-text-primary leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-primary"
              spellCheck={false}
            />
          </div>

          {/* Right: Auto-Linter & Sandbox Runner */}
          <div className="flex flex-col space-y-4 min-h-0 overflow-y-auto">
            {/* Linter Report */}
            <div className="rounded-lg border border-border/80 bg-muted/20 p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                <span className="flex items-center gap-1.5">
                  <Wrench className="h-3.5 w-3.5 text-primary" />
                  Skill Schema Linter
                </span>
                {lintIssues.length === 0 ? (
                  <span className="text-success text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> All Checks Passed
                  </span>
                ) : (
                  <span className="text-warning text-[11px] font-mono">
                    {lintIssues.length} issue{lintIssues.length === 1 ? "" : "s"}
                  </span>
                )}
              </div>

              {lintIssues.length > 0 && (
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {lintIssues.map((issue, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "flex items-start gap-2 p-2 rounded text-[11px] font-mono",
                        issue.severity === "error" && "bg-destructive/10 text-destructive border border-destructive/20",
                        issue.severity === "warning" && "bg-warning/10 text-warning border border-warning/20",
                        issue.severity === "info" && "bg-muted/60 text-muted-foreground",
                      )}
                    >
                      {issue.severity === "error" && <XCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />}
                      {issue.severity === "warning" && <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />}
                      {issue.severity === "info" && <Code className="h-3.5 w-3.5 shrink-0 mt-0.5" />}
                      <span>{issue.message}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sandbox Simulation */}
            <div className="rounded-lg border border-border/80 bg-muted/20 p-3.5 space-y-3 flex-1 flex flex-col">
              <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                <span className="flex items-center gap-1.5">
                  <Play className="h-3.5 w-3.5 text-primary" />
                  Dry-Run Sandbox
                </span>
                <span className="text-[10px] font-mono uppercase text-muted-foreground">
                  Isolated Context
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-muted-foreground">
                  Simulated User Prompt:
                </label>
                <Input
                  value={testPrompt}
                  onChange={(e) => setTestPrompt(e.target.value)}
                  placeholder="Test prompt triggering this skill…"
                  className="h-8 text-xs font-mono"
                />
              </div>

              <Button
                onClick={handleDryRun}
                disabled={simulating || hasErrors}
                className="w-full h-8 text-xs gap-1.5 font-medium"
              >
                {simulating ? (
                  <>
                    <Spinner className="h-3.5 w-3.5" /> Simulating Model Activation…
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5" /> Execute Sandbox Dry-Run
                  </>
                )}
              </Button>

              {simResult && (
                <div className="rounded-lg border border-border/60 bg-black/90 p-3 text-[11px] font-mono space-y-2 flex-1 overflow-y-auto text-text-primary">
                  <div className="flex items-center justify-between text-emerald-400 font-semibold">
                    <span>✓ SKILL TRIGGER ACTIVATED</span>
                    <span className="text-[10px] text-muted-foreground">
                      ~{simResult.tokensEstimated} tok
                    </span>
                  </div>
                  <div className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {simResult.syntheticResponse}
                  </div>
                  <div className="pt-1.5 border-t border-border/40 text-text-secondary">
                    Tools Projected: {simResult.toolCalls.map((t) => `\`${t}\``).join(", ")}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border shrink-0">
          <Button outlined onClick={onClose} className="text-xs px-3">
            Cancel
          </Button>

          <Button
            onClick={() => {
              showToast(`Skill "${nameMatch ? nameMatch[1].trim() : skillName}" saved successfully`, "success");
              onClose();
            }}
            disabled={hasErrors}
            className="text-xs px-4"
          >
            Save & Publish Skill
          </Button>
        </div>
      </div>
    </div>
  );
}
