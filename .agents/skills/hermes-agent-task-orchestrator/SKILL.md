---
name: hermes-agent-task-orchestrator
description: >-
  Proactively guides, configures, and executes multi-step tasks with Nous Hermes AI Agent and CodeGraph.
  Prompt the user for missing task objectives, model endpoints, or repository paths. Automatically
  orchestrates CodeGraph AST indexing for 57% token reduction, Mission Control task decomposition,
  visual artifact generation (5-word titles + 14-word summaries), and live /steer steering protocols.
---

# Hermes Agent Task Orchestration & Proactive Execution Skill

This skill teaches the agent how to proactively orchestrate, configure, and execute software engineering, business automation, and document generation tasks using **Nous Hermes AI Agent**, **CodeGraph Knowledge Graph**, and the **Hermes Agentic OS**.

---

## 🎯 Proactive Operational Philosophy

**NEVER proceed blindly on underspecified user tasks.** 
When activated, you must **PROACTIVELY INTERVIEW** the user if any required parameters are missing:
1. **Target Task / Deliverable**: What exact objective or artifact are we building? (e.g. Invoice, API, Web Interface, Growth Roadmap).
2. **Repository / Working Directory**: Where is the project root to index with CodeGraph?
3. **Model Backend / Tier**: Local Ollama (MiMo / Qwen / Llama), OpenRouter, Nous Portal, or Anthropic / OpenAI?
4. **Channel Preference**: CLI / Terminal, Web Workspace (`http://localhost:3000`), or Telegram / Discord Gateway?

---

## 📋 6-Stage Task Execution Workflow

### Stage 1: Proactive User Intake & Requirements Discovery

If the user gives a high-level command (e.g. *"build an invoice"*, *"refactor this repo"*, *"set up Hermes"*), immediately prompt for:
- Scope and specifications
- Target directory path
- Output format (HTML, Markdown, Python, JSON)
- Desired autonomy level (Autonomous vs Step-by-Step Steering)

---

### Stage 2: Gateway & Model Provider Verification

Verify or guide the user through setting up their Hermes brain and channels:

```bash
# 1. Install Hermes Agent (macOS / Linux / WSL2)
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash

# 2. Configure model backend (OpenRouter, Nous Portal, Anthropic, or Local Ollama)
hermes setup
hermes model

# 3. (Optional) Connect messaging channels (Telegram, Discord, Slack)
hermes gateway setup
```

---

### Stage 3: CodeGraph Knowledge Graph Indexing (MANDATORY for Repositories)

Before allowing Hermes or Claude to scan files recursively, **always initialize CodeGraph** to prevent token waste:

**Benefits**:
- **-57% Token Burn**: Queries symbols directly from pre-indexed AST graph.
- **-71% Tool Calls Eliminated**: Eliminates trial-and-error grep/file searching.
- **+46% Faster Task Velocity**: Completes codebase modifications in a single pass.

```bash
# Install CodeGraph CLI
# macOS / Linux:
curl -fsSL https://raw.githubusercontent.com/colbymchenry/codegraph/main/install.sh | sh

# Windows PowerShell:
irm https://raw.githubusercontent.com/colbymchenry/codegraph/main/install.ps1 | iex

# Connect CodeGraph MCP Server to Hermes
codegraph install

# Initialize AST Graph in the Target Project
cd /path/to/project
codegraph init
```

---

### Stage 4: Mission Control Task Decomposition & Steering

When executing multi-phase objectives, format the prompt into two distinct lanes:

1. **👤 Human Creator Deliverables**: Critical approvals, credentials, recording voice/video, or live testing.
2. **🤖 Hermes Autonomous Agent Deliverables**: Research, scaffolding code, schema generation, test drafting, and document compilation.

#### Mid-Task Live Steering Protocol (`/steer`):
Instruct the user on how to use `/steer` to course-correct the agent in real time without cancelling the active run:
```bash
/steer focus on clean HTML5 semantic structure and export to the Hermes assets folder
```

---

### Stage 5: Visual Document & Artifact Management Standard

Whenever generating documents, invoices, reports, or HTML overviews, **enforce the Hermes 5/14 Standard**:
- **Title**: Exactly **5 words** bold overview title (e.g. *"Enterprise Client Billing Invoice Template"*).
- **Summary**: No more than **13 to 14 words** description (e.g. *"Automated professional 50k billing invoice with dynamic currency formatting and company tax IDs."*).
- **Storage Location**: Save artifacts in designated persistent directories (`assets/`, `docs/`, or `.hermes/documents/`).
- **Supported Formats**: Code (`.py`, `.ts`, `.js`), Data (`.json`), HTML (`.html`), Markdown (`.md`), and Plain Text (`.txt`).

---

### Stage 6: 24/7 Nightly Dreaming & Pantheon Persona Routing

1. **Nightly Dreaming Engine**:
   - Synthesizes session transcripts from Claude Code, Hermes CLI, and AntiGravity.
   - Detects weak surface patterns, redundant tool calls, and API plan downgrade savings.
   - Delivers a 3-bullet morning brief with actionable recommendations.
2. **Pantheon Personas**:
   - **Athena**: Strategic system architecture & LangGraph state machines (High-reasoning models).
   - **Mercury**: Autopilot cron jobs, data formatting, and regex transforms (Low-cost/local models).
   - **Apollo**: Visual design, UI styling, and frontend layout engines.
