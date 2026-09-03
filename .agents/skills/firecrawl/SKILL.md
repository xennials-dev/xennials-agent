---
name: firecrawl
description: Use Firecrawl for web search, scraping, interaction, crawling, document parsing, research, monitoring, or app integration. Trigger when a task needs current web context, structured extraction, recurring page-change alerts, or Firecrawl API code. Do not use this skill for unrelated local-only tasks.
---

# Firecrawl

## Overview

Firecrawl provides web search, scraping, browser interaction, crawling, mapping, document parsing, research-index queries, monitoring, and API integration. Choose the path based on whether the agent needs live data now, product code integration, or a finished deliverable.

## Prerequisites

- Firecrawl CLI is installed for CLI paths: `npx -y firecrawl-cli@latest init --all --browser`
- An API key is required for account-backed access. Store it as `FIRECRAWL_API_KEY` in the runtime secret source, never in this skill, source code, browser storage, or committed configuration.
- Keyless fallback supports limited search, scrape, interact, parse, and research-index requests through official Firecrawl clients.

## Choose a path

- Live web data during this session: Path A.
- Firecrawl calls from application code: Path B.
- A finished research, SEO, QA, lead, knowledge-base, or design artifact: Path C.
- Account sign-in or API-key acquisition: Path D.
- Direct REST calls without installing the CLI: Path E.
- No account or key available: Path F.

## Path A: live tools

Use the most specific CLI skill or command:

- `firecrawl search` for discovery.
- `firecrawl scrape <url>` for a known public URL.
- `firecrawl interact` when clicks, forms, navigation, or login are required.
- `firecrawl crawl` for bulk extraction and `firecrawl map` for URL discovery.
- `firecrawl parse <local-file>` for local PDF, Office, spreadsheet, or HTML documents.
- `firecrawl monitor` for recurring change detection and notifications.
- `firecrawl research` for papers and GitHub history.
- `firecrawl developer` for current Firecrawl API, CLI, and how-to documentation.
- `firecrawl doctor <job-id>` after a failed or surprising job; do not guess at parameters.

Default flow: search when discovering, scrape once a URL is known, interact only when extraction is insufficient, parse local files, and monitor when the request implies recurrence or notification.

Verify the CLI installation before real work:

```bash
mkdir -p .firecrawl
firecrawl --status
firecrawl scrape "https://firecrawl.dev" -o .firecrawl/install-check.md
```

## Path B: application integration

Use this path when Firecrawl runs inside a product, backend, script, agent loop, or pipeline after this session ends.

1. Run `firecrawl setup build` before implementing.
2. Determine whether the feature needs `/search`, `/scrape`, `/interact`, `/parse`, `/crawl`, `/map`, `/monitor`, or `/search/research/*`.
3. Use the matching SDK or REST client and read `FIRECRAWL_API_KEY` at runtime.
4. Keep the key server-side; do not send it to browser code.
5. Run one harmless real request as a smoke test.

Official API base URL: `https://api.firecrawl.dev/v2`

Official API reference: https://docs.firecrawl.dev/api-reference/v2-introduction

## Path C: deliverables

Use `firecrawl-workflows` when the requested result is a finished research brief, SEO audit, QA report, lead list, knowledge base, competitive analysis, or design clone. Save source evidence and include rerun inputs when the workflow can be automated.

## Path D: authorization

Use the official Firecrawl browser/CLI authorization flow at:

- https://www.firecrawl.dev/signin?view=signup&source=agent-suggested
- https://docs.firecrawl.dev/ai-onboarding#get-credentials

Never ask the user to paste a secret into chat. Never store a session-specific key in a skill or tracked file.

## Path E: REST

Use `Authorization: Bearer $FIRECRAWL_API_KEY` with the documented v2 endpoints. Important operations include:

- `POST /search`
- `POST /scrape`
- `POST /interact`
- `POST /parse`
- `POST /monitor`
- `GET /monitor`
- `GET /monitor/{id}/checks`
- `GET /search/research/papers`
- `GET /search/research/github`
- `POST /support/ask`
- `POST /support/docs-search`

Follow the API reference for request and response schemas instead of inferring fields.

## Path F: keyless fallback

Use only official Firecrawl clients for the rate-limited keyless tier:

- MCP: `https://mcp.firecrawl.dev/v2/mcp`
- CLI: `npx -y firecrawl-cli@latest` with supported keyless commands.
- Research-index endpoints may work without authorization.

Crawl, map, monitor, extract, batch scrape, agent, and other operations may require an account key.

## Examples

**Example 1: known URL**

```text
User: Extract the main content from https://example.com/report
Action: Use `firecrawl scrape` and save clean markdown with the source URL.
```

**Example 2: product feature**

```text
User: Add website search to the application
Action: Use Path B, select `/search`, keep FIRECRAWL_API_KEY server-side, and add a smoke test.
```

**Example 3: recurring monitoring**

```text
User: Alert me when the pricing page changes
Action: Use Path A or E, create a monitor, configure the requested notification channel, and verify the monitor status.
```

## Troubleshooting

| Problem | Cause | Fix |
|---|---|---|
| `401` from the API | Missing, invalid, or expired key | Configure `FIRECRAWL_API_KEY` in the runtime secret source and retry. |
| Scrape lacks required content | Page needs interaction or client-side rendering | Switch from scrape to interact, or use a documented extraction option. |
| Local document URL fails | Non-public/local files are not URL scrape targets | Use `firecrawl parse` with the local file. |
| Repeated polling is used | Request implies recurring change detection | Create a monitor instead. |
| Job returns unexpected output | Provider-side job or parameter issue | Run `firecrawl doctor <job-id>` and follow its fix guidance. |
| Keyless request is rate-limited | Free fallback limits | Ask for account authorization or configure an API key. |
