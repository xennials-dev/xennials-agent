# Repository Guide

## Project Shape

- The current dashboard is a Vite + React 19 + TypeScript app rooted in `src/`; start at [src/main.tsx](src/main.tsx) and [src/App.tsx](src/App.tsx).
- Route-level features belong in [src/pages](src/pages). Shared UI and dialogs belong in [src/components](src/components); cross-cutting state belongs in [src/contexts](src/contexts).
- Backend requests belong in [src/lib/api.ts](src/lib/api.ts). Prefer its typed helpers (`fetchJSON`, `authedFetch`, and WebSocket URL helpers) over direct `fetch` calls.
- Profile scope is part of the management state and API contract. Use [src/contexts/ProfileProvider.tsx](src/contexts/ProfileProvider.tsx) and the API client's profile helpers rather than manually constructing profile query parameters.
- Runtime plugin behavior is isolated in [src/plugins](src/plugins). Preserve manifest loading, SRI checks, registration timing, and `/dashboard-plugins` delivery when changing plugins.

## Validation

- Install dependencies with `npm install` when needed.
- Run focused tests with `npm test`.
- Run the production build with `npm run build`.
- For a strict TypeScript check, run `npx tsc -b`; there is no dedicated npm typecheck script.
- A successful build may copy output to the sibling `../hermes_cli/web_dist` directory; this is expected for dashboard packaging.

## Entrypoints And Pitfalls

- Confirm the target surface before editing: [vite.config.ts](vite.config.ts) is the current React dashboard configuration, while [vite.config.js](vite.config.js) supports older static/multi-page behavior.
- The root static pages (`index.html`, `blog.html`, `deeptutor.html`, `playground.html`, and `skills.html`) are separate browser experiences. Do not assume they use the React dashboard entry.
- [README.md](README.md) contains useful project context but parts of its structure and development paths are stale; verify against the current files and Vite config.
- Dashboard development needs the Hermes backend; proxy and token behavior are controlled by `HERMES_DASHBOARD_URL` in [vite.config.ts](vite.config.ts).
- `docker-compose.ai.yml` and `litellm_config.yaml` describe the separate LiteLLM/Ollama/Open WebUI playground stack, not the React dashboard backend.

## Style

- Use `@/*` imports for source files and follow existing `@nous-research/ui` plus Tailwind CSS v4 patterns.
- Preserve the typography, semantic color-token, opacity, and minimum text-size rules in [README.md](README.md).
- Keep changes focused, preserve existing public APIs, and add colocated tests for pure behavior helpers or risky shared behavior.
- Never commit API keys, tokens, cookies, or other credentials. Keep secrets in the runtime environment or secret store.

## Skills

Workspace-local reusable skills live under [.agents/skills](.agents/skills). Review [skill-library-importer](.agents/skills/skill-library-importer/SKILL.md) before importing external skills and [skill-creator-flagos](.agents/skills/skill-creator-flagos/SKILL.md) when creating or validating skill definitions.

## Official Hermes Documentation

- Use the [Hermes documentation](https://hermes-agent.nousresearch.com/docs/) as the source of truth for runtime behavior.
- For provider/model changes, consult [Configuring Models](https://hermes-agent.nousresearch.com/docs/user-guide/configuring-models), [Providers](https://hermes-agent.nousresearch.com/docs/integrations/providers), and [Provider Runtime](https://hermes-agent.nousresearch.com/docs/developer-guide/provider-runtime).
- For skills and integrations, consult [Skills](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills), [Creating Skills](https://hermes-agent.nousresearch.com/docs/developer-guide/creating-skills), and [MCP](https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp).
- For native Windows setup, use the [Windows guide](https://hermes-agent.nousresearch.com/docs/user-guide/windows-native).
- When the dashboard reports `ERR_CONNECTION_REFUSED`, check the frontend, Hermes API at `127.0.0.1:9119`, and model backend at `127.0.0.1:11434` independently.
- `hermes status` verifies recognized credentials and active provider/model; `hermes model` changes the persistent provider/model selection.
