import { useLayoutEffect } from "react";
import { ExternalLink } from "lucide-react";
import { useI18n } from "@/i18n";
import { usePageHeader } from "@/contexts/usePageHeader";
import { cn } from "@/lib/utils";
import { PluginSlot } from "@/plugins";

export const HERMES_DOCS_URL = "https://hermes-agent.nousresearch.com/docs/";

const HERMES_DOC_LINKS = [
  ["Configuration", "https://hermes-agent.nousresearch.com/docs/user-guide/configuration"],
  ["Configuring Models", "https://hermes-agent.nousresearch.com/docs/user-guide/configuring-models"],
  ["Providers", "https://hermes-agent.nousresearch.com/docs/integrations/providers"],
  ["Skills", "https://hermes-agent.nousresearch.com/docs/user-guide/features/skills"],
  ["MCP", "https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp"],
  ["Windows Setup", "https://hermes-agent.nousresearch.com/docs/user-guide/windows-native"],
] as const;

const DS_BUTTON_OUTLINED_LINK_CN = cn(
  "group relative inline-grid grid-cols-[auto_1fr_auto] items-center",
  "px-[.9em_.75em] py-[1.25em] gap-2",
  "leading-0 font-bold tracking-[0.2em] uppercase",
  "text-midground bg-transparent shadow-midground",
  "shadow-[inset_-1px_-1px_0_0_#00000080,inset_1px_1px_0_0_#ffffff80]",
);

export default function DocsPage() {
  const { t } = useI18n();
  const { setEnd } = usePageHeader();

  useLayoutEffect(() => {
    setEnd(
      <a
        href={HERMES_DOCS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={DS_BUTTON_OUTLINED_LINK_CN}
      >
        <ExternalLink className="size-3.5" />
        {t.app.openDocumentation}
      </a>,
    );
    return () => {
      setEnd(null);
    };
  }, [setEnd, t]);

  return (
    <div
      className={cn(
        "flex min-h-0 w-full min-w-0 flex-1 flex-col",
        "pt-1 sm:pt-2",
      )}
    >
      <PluginSlot name="docs:top" />
      <section className="mb-3 border border-border bg-card p-3" aria-labelledby="official-hermes-guides">
        <div className="mb-2 flex items-center justify-between gap-3">
          <h2 id="official-hermes-guides" className="text-display text-xs font-medium tracking-wider text-text-secondary">
            Official Hermes guides
          </h2>
          <span className="text-xs text-text-tertiary">Source of truth</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {HERMES_DOC_LINKS.map(([label, href]) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 border border-border px-2 py-1 text-xs text-text-secondary transition-colors hover:border-primary hover:text-primary"
            >
              {label}
              <ExternalLink className="size-3" />
            </a>
          ))}
        </div>
      </section>
      <iframe
        title={t.app.nav.documentation}
        src={HERMES_DOCS_URL}
        className={cn(
          "min-h-0 w-full min-w-0 flex-1",
          "rounded-sm border border-current/20",
          // Docusaurus paints over a transparent <html> / <body> and
          // relies on the browser's canvas color (light by default) to
          // fill the viewport. Inheriting the dashboard's dark color
          // scheme makes that canvas dark, so the docs body text — which
          // is tuned for a light canvas — becomes near-invisible. Force a
          // light color scheme + white background on the iframe element so
          // the docs render cleanly regardless of the active dashboard
          // theme or the user's prefers-color-scheme.
          "[color-scheme:light] bg-white",
        )}
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <PluginSlot name="docs:bottom" />
    </div>
  );
}
