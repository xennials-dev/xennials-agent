import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { isDemoModeActive, MOCK_SESSIONS } from "@/lib/demo-mode";
import { Button } from "@nous-research/ui/ui/components/button";
import { Spinner } from "@nous-research/ui/ui/components/spinner";
import { useToast } from "@nous-research/ui/hooks/use-toast";
import {
  FileCode,
  History,
  RotateCcw,
  FilePlus,
  FileEdit,
  FileX,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface JournalEntry {
  turn_index: number;
  file_path: string;
  action: "create" | "modify" | "delete" | string;
  diff: string;
  timestamp: number | string;
  has_changes?: boolean;
}

interface SessionFileJournalModalProps {
  sessionId: string;
  sessionTitle?: string;
  open: boolean;
  onClose(): void;
}

export function SessionFileJournalModal({
  sessionId,
  sessionTitle,
  open,
  onClose,
}: SessionFileJournalModalProps) {
  const [loading, setLoading] = useState(true);
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  const [expandedTurns, setExpandedTurns] = useState<Record<number, boolean>>({});
  const [rollingBackTurn, setRollingBackTurn] = useState<number | null>(null);
  const { showToast } = useToast();

  const loadJournal = async () => {
    if (!sessionId) return;
    setLoading(true);
    try {
      if (isDemoModeActive()) {
        const match = MOCK_SESSIONS.find((s) => s.id === sessionId) || MOCK_SESSIONS[0];
        setJournal(
          (match.file_modifications || []).map((m) => ({
            ...m,
            timestamp: typeof m.timestamp === "string" ? new Date(m.timestamp).getTime() / 1000 : m.timestamp,
            has_changes: true,
          })),
        );
        return;
      }

      const res = await api.getFileJournal(sessionId);
      setJournal(res.journal || []);
      // Expand the latest turn by default
      if (res.journal && res.journal.length > 0) {
        const latestTurn = Math.max(...res.journal.map((j) => j.turn_index));
        setExpandedTurns({ [latestTurn]: true });
      }
    } catch {
      showToast("Failed to load file journal for session", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      void loadJournal();
    }
  }, [open, sessionId]);

  if (!open) return null;

  const handleRollbackTurn = async (turnIndex: number) => {
    if (!window.confirm(`Rollback all file changes made in Turn #${turnIndex}? This will restore files to their pre-turn state.`)) {
      return;
    }
    setRollingBackTurn(turnIndex);
    try {
      if (isDemoModeActive()) {
        showToast(`Turn #${turnIndex} rolled back successfully (Simulated)`, "success");
        setJournal((prev) => prev.filter((j) => j.turn_index !== turnIndex));
        return;
      }

      const res = await api.rollbackTurn(sessionId, turnIndex);
      if (res.success) {
        showToast(
          `Turn #${turnIndex} rolled back: restored ${res.restored_files?.length || 0} file(s)`,
          "success",
        );
        void loadJournal();
      } else {
        showToast(`Rollback failed: ${res.errors?.join(", ") || "Unknown error"}`, "error");
      }
    } catch (e) {
      showToast(`Rollback error: ${e}`, "error");
    } finally {
      setRollingBackTurn(null);
    }
  };

  // Group entries by turn_index
  const turnsMap = new Map<number, JournalEntry[]>();
  for (const entry of journal) {
    const list = turnsMap.get(entry.turn_index) || [];
    list.push(entry);
    turnsMap.set(entry.turn_index, list);
  }
  const turnIndices = Array.from(turnsMap.keys()).sort((a, b) => b - a);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl rounded-xl border border-border bg-background p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150 my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <History className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold tracking-wide text-foreground">
                Session File Change Journal & Rollback
              </h2>
              <p className="text-xs text-muted-foreground truncate max-w-md font-mono">
                {sessionTitle || sessionId}
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

        {/* Modal Content */}
        <div className="py-4 flex-1 overflow-y-auto space-y-4 min-h-[300px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3 text-muted-foreground">
              <Spinner className="h-6 w-6 text-primary" />
              <span className="text-xs">Loading turn file mutations…</span>
            </div>
          ) : turnIndices.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-2 text-center p-6 rounded-lg border border-dashed border-border/80">
              <FileCode className="h-8 w-8 text-muted-foreground/60" />
              <div className="text-sm font-medium text-foreground">No File Mutations Recorded</div>
              <div className="text-xs text-muted-foreground max-w-sm">
                No autonomous file edits (`write_file`, `patch`) were executed in this session, or the files matched their prior state.
              </div>
            </div>
          ) : (
            turnIndices.map((turnIdx) => {
              const entries = turnsMap.get(turnIdx) || [];
              const isExpanded = !!expandedTurns[turnIdx];
              const isRollingBack = rollingBackTurn === turnIdx;

              return (
                <div
                  key={turnIdx}
                  className="rounded-lg border border-border/80 bg-muted/20 overflow-hidden"
                >
                  {/* Turn Header */}
                  <div
                    className="flex items-center justify-between p-3.5 bg-muted/40 cursor-pointer select-none hover:bg-muted/60 transition-colors"
                    onClick={() =>
                      setExpandedTurns((prev) => ({ ...prev, [turnIdx]: !prev[turnIdx] }))
                    }
                  >
                    <div className="flex items-center gap-2">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="font-semibold text-xs text-foreground">
                        Turn #{turnIdx}
                      </span>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        ({entries.length} file{entries.length === 1 ? "" : "s"} modified)
                      </span>
                    </div>

                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <Button
                        outlined
                        className="h-7 text-xs gap-1.5 px-2.5 text-warning border-warning/40 hover:bg-warning/10"
                        onClick={() => void handleRollbackTurn(turnIdx)}
                        disabled={isRollingBack}
                      >
                        <RotateCcw className={cn("h-3 w-3", isRollingBack && "animate-spin")} />
                        {isRollingBack ? "Rolling back…" : "Rollback Turn"}
                      </Button>
                    </div>
                  </div>

                  {/* Turn File List & Diffs */}
                  {isExpanded && (
                    <div className="p-3.5 space-y-3 border-t border-border/60">
                      {entries.map((entry, idx) => (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex items-center gap-2 text-xs font-mono">
                            {entry.action === "create" ? (
                              <FilePlus className="h-3.5 w-3.5 text-success shrink-0" />
                            ) : entry.action === "delete" ? (
                              <FileX className="h-3.5 w-3.5 text-destructive shrink-0" />
                            ) : (
                              <FileEdit className="h-3.5 w-3.5 text-primary shrink-0" />
                            )}
                            <span className="font-medium text-foreground truncate">
                              {entry.file_path}
                            </span>
                            <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-muted text-muted-foreground shrink-0">
                              {entry.action}
                            </span>
                          </div>

                          {entry.diff ? (
                            <pre className="p-2.5 rounded bg-black/80 text-[11px] font-mono text-text-primary overflow-x-auto whitespace-pre leading-relaxed border border-border/40 max-h-56">
                              {entry.diff.split("\n").map((line, lineIdx) => {
                                const isAdd = line.startsWith("+") && !line.startsWith("+++");
                                const isDel = line.startsWith("-") && !line.startsWith("---");
                                return (
                                  <div
                                    key={lineIdx}
                                    className={cn(
                                      isAdd && "text-emerald-400 bg-emerald-950/30",
                                      isDel && "text-rose-400 bg-rose-950/30",
                                      !isAdd && !isDel && "text-muted-foreground",
                                    )}
                                  >
                                    {line}
                                  </div>
                                );
                              })}
                            </pre>
                          ) : (
                            <div className="text-[11px] italic text-muted-foreground font-mono pl-5">
                              No textual diff (binary or identical snapshot).
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end pt-3 border-t border-border shrink-0">
          <Button outlined onClick={onClose} className="text-xs px-4">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
