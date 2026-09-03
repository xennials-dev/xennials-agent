---
name: hermes-documentation
description: Navigate and apply the official Hermes Agent documentation for configuration, providers, models, keys, skills, plugins, MCP, dashboard, and localhost troubleshooting. Use when a Hermes setup, provider, model, key, skill, or dashboard task needs authoritative guidance.
---

# Hermes Documentation

## Overview

Use the official Hermes Agent documentation as the source of truth for runtime behavior, supported providers, model selection, credentials, skills, plugins, MCP, and dashboard operations.

Official documentation index: https://hermes-agent.nousresearch.com/docs/

## Workflow

1. Identify the requested feature and open the closest official guide.
2. For provider or model work, read Configuration, Configuring Models, Provider Routing, Provider Runtime, and Adding Providers as applicable.
3. For keys, use the documented environment variable and store its value in Hermes's secret source. Never put a key in source, committed YAML, browser storage, or this skill.
4. For skills, read Skills System, Creating Skills, and the Skills Catalog. Preserve the `SKILL.md` frontmatter and validate referenced files.
5. For plugins or MCP, read the relevant integration guide before creating configuration. Do not invent endpoint URLs or configuration keys.
6. For localhost failures, check the frontend, Hermes dashboard/API, and any model backend separately.

## Provider and model checks

- Confirm the active provider and model with `hermes status`.
- Select a persistent provider/model with `hermes model`.
- Verify the provider's documented environment-variable name.
- Check that the selected backend is listening before diagnosing credentials:
  - Hermes dashboard/API: `http://127.0.0.1:9119`
  - Ollama: `http://127.0.0.1:11434`
  - LiteLLM playground gateway: `http://127.0.0.1:4000`
- A recognized key does not automatically add models. The provider must expose or be configured with supported model IDs.

## Localhost troubleshooting

| Symptom | Check | Fix |
|---|---|---|
| `ERR_CONNECTION_REFUSED` on `/api/*` port 9119 | `Invoke-RestMethod http://127.0.0.1:9119/api/status` | Start `hermes dashboard --no-open`. |
| `/models` or `/api/tags` refuses port 11434 | `Invoke-RestMethod http://127.0.0.1:11434/api/tags` | Start `ollama serve`, or select a non-Ollama provider. |
| Key is set but provider is not selectable | `hermes status` then `hermes model` | Use the documented variable name and select a supported provider/model. |
| Dashboard changes are missing | Check whether the page is served by Vite or `hermes dashboard` | Run `npm run build` before serving the packaged dashboard; use Vite for source development. |

## Official guides

- Configuration: https://hermes-agent.nousresearch.com/docs/user-guide/configuration
- Configuring models: https://hermes-agent.nousresearch.com/docs/user-guide/configuring-models
- Providers: https://hermes-agent.nousresearch.com/docs/integrations/providers
- Provider runtime: https://hermes-agent.nousresearch.com/docs/developer-guide/provider-runtime
- Adding providers: https://hermes-agent.nousresearch.com/docs/developer-guide/adding-providers
- Skills: https://hermes-agent.nousresearch.com/docs/user-guide/features/skills
- Creating skills: https://hermes-agent.nousresearch.com/docs/developer-guide/creating-skills
- MCP: https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp
- Web dashboard: https://hermes-agent.nousresearch.com/docs/user-guide/features/web-dashboard
- Native Windows: https://hermes-agent.nousresearch.com/docs/user-guide/windows-native

## Validation

Run `hermes doctor` for configuration diagnostics and `hermes status` for provider/key recognition. For this workspace, use `npm test`, `npm run build`, and the localhost endpoint checks above. Report warnings separately from blocking errors.
