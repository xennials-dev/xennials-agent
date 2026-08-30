import { Typography } from "@nous-research/ui/ui/components/typography/index";
import type { StatusResponse } from "@/lib/api";
import { BackendStatusBadge } from "@/components/BackendStatusBadge";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n";

export function SidebarFooter({ status }: SidebarFooterProps) {
  const { t } = useI18n();

  return (
    <div
      className={cn(
        "flex shrink-0 flex-col gap-2",
        "px-5 py-2.5",
        "border-t border-current/10",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <BackendStatusBadge />
        <Typography
          className="font-mono-ui text-xs tabular-nums tracking-[0.08em] text-text-tertiary lowercase"
        >
          {status?.version != null ? `v${status.version}` : "—"}
        </Typography>
      </div>

      <div className="flex items-center justify-end">
        <a
          href="https://nousresearch.com"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "font-sans text-display text-[11px] tracking-[0.12em] text-midground/80",
            "transition-opacity hover:opacity-100",
            "focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-midground/40",
          )}
        >
          {t.app.footer.org}
        </a>
      </div>
    </div>
  );
}

interface SidebarFooterProps {
  status: StatusResponse | null;
}

