# 7-Agent Autonomous Workforce Architecture (LangGraph State Machine)

## 1. System Overview
This specification defines the standard multi-agent orchestration architecture for autonomous content generation, deep research, media synthesis, and automated client delivery.

The workforce is managed via a **LangGraph state machine**, ensuring stateful task execution, resilient step transitions, and automated quality checkpoints.

---

## 2. 7-Agent Workforce Matrix & Roles

| Agent | Core Responsibility | Primary State Transitions | Tool / Model Stack |
| :--- | :--- | :--- | :--- |
| **1. Orchestrator** | Coordinates swarm execution, parses user goals, delegates tasks, routes outputs, and handles failure recovery. | `IDLE` → `DISPATCH` → `EVALUATE` → `COMPLETE` | LangGraph StateGraph, Claude 3.7 Sonnet / GPT-4o |
| **2. Deep Research** | Performs multi-source web retrieval, competitor analysis, citation extraction, and structured synthesis. | `RESEARCH_PENDING` → `SEARCHING` → `SYNTHESIZING` | Perplexity Sonar, Tavily API, PubMed, arXiv |
| **3. Content Writer** | Crafts structured scripts, viral hooks, SEO articles, and platform-tailored copy. | `WRITING` → `REVISING` → `SCRIPT_READY` | DeepSeek V3/R1, Qwen 2.5 Coder, Claude |
| **4. Visuals** | Generates high-fidelity imagery, infographics, thumbnails, and visual assets. | `PROMPTING` → `RENDERING_IMAGE` → `ASSET_SAVED` | FLUX.1 [schnell], Krea 2, Midjourney API |
| **5. Voice** | Converts scripts to studio-grade voiceovers with natural prosody and cadence. | `SYNTHESIZING_VOICE` → `AUDIO_PROCESSED` | ElevenLabs Turbo v2, AudioCraft, Play.ht |
| **6. Video Editor** | Assembles video timelines, typography, motion graphics, audio sync, and rendering. | `STORYBOARDING` → `RENDERING_VIDEO` → `EXPORTED` | JSON2Video, Remotion, FFmpeg, Runway Gen-3 |
| **7. QA / Evaluator** | Conducts LLM-as-a-judge quality checks, audio loudness compliance (-14 LUFS), and deliverable verification. | `AUDITING` → `APPROVED` / `REJECTED_RETRY` | DeepSeek R1 Judge, FFmpeg Loudness Audit |

---

## 3. LangGraph State Machine Architecture

### State Schema (`TypedDict`)
```python
from typing import TypedDict, List, Dict, Any, Optional
from typing_extensions import Annotated
import operator

class WorkforceState(TypedDict):
    task_id: str
    topic: str
    client_id: str
    current_step: str
    research_summary: Optional[Dict[str, Any]]
    script: Optional[str]
    visual_assets: Annotated[List[str], operator.add]
    audio_path: Optional[str]
    video_master_url: Optional[str]
    qa_score: float
    qa_feedback: Optional[str]
    retry_count: int
    execution_logs: Annotated[List[str], operator.add]
```

### State Machine Implementation & Routing Graph
```python
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.sqlite import SqliteSaver

# Define node handlers
def orchestrator_node(state: WorkforceState) -> Dict[str, Any]:
    return {"current_step": "research", "execution_logs": ["Orchestrator initialized task."]}

def research_node(state: WorkforceState) -> Dict[str, Any]:
    # Multi-source retrieval & synthesis
    return {"current_step": "writing", "research_summary": {"key_facts": []}}

def writer_node(state: WorkforceState) -> Dict[str, Any]:
    # Generates hook, body, and CTA script
    return {"current_step": "media_synthesis", "script": "Generated script content"}

def visuals_node(state: WorkforceState) -> Dict[str, Any]:
    return {"visual_assets": ["https://cdn.xennials.dev/assets/frame_01.png"]}

def voice_node(state: WorkforceState) -> Dict[str, Any]:
    return {"audio_path": "s3://xennials-audio/master_voice.mp3"}

def video_editor_node(state: WorkforceState) -> Dict[str, Any]:
    return {"video_master_url": "s3://xennials-video/final_render_1080p.mp4"}

def qa_evaluator_node(state: WorkforceState) -> Dict[str, Any]:
    # Automated evaluation (Score 0.0 - 1.0)
    score = 0.94
    return {"qa_score": score, "qa_feedback": "Meets quality standards"}

# Conditional routing edge for QA check
def evaluate_deliverable(state: WorkforceState) -> str:
    if state.get("qa_score", 0) >= 0.85:
        return "approved"
    elif state.get("retry_count", 0) < 3:
        return "retry_writer"
    else:
        return "failed"

# Assemble Graph
workflow = StateGraph(WorkforceState)

workflow.add_node("orchestrator", orchestrator_node)
workflow.add_node("researcher", research_node)
workflow.add_node("writer", writer_node)
workflow.add_node("visuals", visuals_node)
workflow.add_node("voice", voice_node)
workflow.add_node("editor", video_editor_node)
workflow.add_node("qa_evaluator", qa_evaluator_node)

workflow.set_entry_point("orchestrator")
workflow.add_edge("orchestrator", "researcher")
workflow.add_edge("researcher", "writer")
workflow.add_edge("writer", "visuals")
workflow.add_edge("writer", "voice")
workflow.add_edge("visuals", "editor")
workflow.add_edge("voice", "editor")
workflow.add_edge("editor", "qa_evaluator")

workflow.add_conditional_edges(
    "qa_evaluator",
    evaluate_deliverable,
    {
        "approved": END,
        "retry_writer": "writer",
        "failed": END
    }
)

# Persistent checkpointer for durable execution
memory = SqliteSaver.from_conn_string(":memory:")
app = workflow.compile(checkpointer=memory)
```

---

## 4. Mandatory Guidelines
1. **Durable State Storage**: Use persistent checkpointers (`SqliteSaver` / PostgresSaver).
2. **Deterministic Fallbacks**: Every agent node must implement a structured fallback.
3. **Loudness & Compliance**: Voice deliverables must conform to standard audio broadcast standards (-14 to -16 LUFS).
4. **Autonomous Notification**: Dispatch output packages to client portals, Cloud Storage, or Notion boards.
