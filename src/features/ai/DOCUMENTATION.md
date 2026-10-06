# Aura Intelligence (Milestone 19) — System Architecture Documentation

## Overview
Aura Intelligence serves as the central brain and executive assistant for Aura LIFE OS. It connects all 8 core life domains (Tasks, Habits, Goals, Calendar, Journal, Finance, Health, and Settings) without duplicating data.

---

## 1. Provider Layer Architecture
Aura Intelligence uses a unified Provider Abstraction Layer that decouples AI models from UI logic.

```
[ Aura AI UI Components ]
           │
  (Provider Adapter)
           │
 ┌─────────┴─────────┬─────────────────┬───────────────┬────────────┐
 ▼                   ▼                 ▼               ▼            ▼
Google Gemini     OpenAI          Anthropic       OpenRouter     Ollama / LM Studio
(Server Proxy) (GPT-4o, o1)  (Claude 3.5 Sonnet) (Multi-Model)    (Local LLMs)
```

- **Pluggable Architecture**: Providers implement `IAIProviderAdapter`.
- **Model Capabilities**: Models specify context windows, vision support, function calling, and streaming capabilities.
- **Local LLM Support**: Native connection to `http://localhost:11434` (Ollama) and `http://localhost:1234` (LM Studio).

---

## 2. Structured Memory Engine
The Memory Engine manages long-term and short-term facts, schedules, preferences, and style guides.

```
┌─────────────────────────────────────────────────────────────┐
│                    Memory Engine Storage                     │
├───────────────────┬───────────────────┬─────────────────────┤
│ User Preferences  │  Working Hours    │  Workout Routines   │
│ Sleep Schedule    │ Long-Term Facts   │   Writing Styles    │
└───────────────────┴───────────────────┴─────────────────────┘
                               │
                      [ Semantic Search ]
                               │
                       [ Prompt Context ]
```

- **Categories**: `user_preference`, `working_hours`, `workout_routine`, `sleep_schedule`, `long_term_preference`, `favorite_modules`.
- **Importance Levels**: `low`, `medium`, `high`, `critical`.
- **CRUD & Pinning**: Full memory management and search filtering.

---

## 3. Real-Time Context Engine (`ContextGatherer`)
Reads live snapshot data directly from active Zustand module stores without duplicating state.

```
               ┌───────────────────────┐
               │ Context Gathering API │
               └───────────┬───────────┘
                           │
 ┌──────────────┬──────────┴───┬──────────────┬──────────────┐
 ▼              ▼              ▼              ▼              ▼
Tasks Store   Habits Store   Goals Store   Finance Store   Journal Store
```

- **Zero Data Duplication**: Reads directly from `getState()` of `useTaskStore`, `useHabitStore`, `useGoalStore`, `useCalendarStore`, `useJournalStore`, `useFinanceStore`.
- **Automatic Formatting**: Synthesizes clean markdown text strings injected directly into the system prompt payload.

---

## 4. Agent System & Workflow Engine
Dedicated agent modules coordinate multi-step workflows.

- **Tasks Agent**: Priority sorting, task decomposition, due date analysis.
- **Habit Agent**: Streak integrity checks and missed habit alerts.
- **Goal Agent**: Milestone progress tracking.
- **Finance Agent**: Net worth evaluation and spending analysis.
- **Journal Agent**: Emotional mood analysis and note summarization.
- **Calendar Agent**: Intelligent schedule block allocation.

### Pre-packaged Workflows:
1. **Plan My Day**: Synthesizes morning focus, events, and top 3 priorities.
2. **Review My Week**: Produces weekly velocity score, budget breakdown, and habit stats.
3. **Analyze Spending**: Evaluates monthly cashflow and budget categories.
4. **Summarize Journal**: Extracts emotional trends and key insights from reflections.

---

## 5. Reusable AI Tools Engine
Declarative tool definitions matching function calling schemas:
- `TaskTool`: Create, list, and complete tasks.
- `HabitTool`: Check in habits and audit streaks.
- `CalendarTool`: Schedule focus blocks and query events.
- `JournalTool`: Summarize reflections and log mood.
- `FinanceTool`: Query net worth and cashflow.
- `HealthTool`: Read health recovery score and sleep hours.
- `SearchTool`: Cross-module semantic keyword search.

---

## 6. RAG & Voice Foundations
- **RAG Foundation**: Vector provider interface and Knowledge Base placeholder structure ready for vector database bindings.
- **Voice Engine**: Built-in Speech-To-Text dictation using standard `SpeechRecognition` web APIs and Text-To-Speech playback via `window.speechSynthesis`.

---

## 7. Folder Structure
```
src/features/ai/
├── components/
│   ├── AuraAIHome.tsx            # AI Home Briefing & Sector Snapshots
│   ├── AuraAIChat.tsx            # Desktop Streaming Chat Experience
│   ├── AIMemoryManager.tsx       # Structured Memory Engine CRUD
│   ├── AIContextInspector.tsx    # Real-Time Live OS Context Payload
│   ├── AIWorkflowManager.tsx     # Automated Workflows Runner
│   ├── AIPromptRegistryView.tsx  # Prompt Template Management
│   ├── AIProviderSettings.tsx    # Multi-Provider & Model Setup
│   ├── AIInsightsDashboard.tsx   # Sector Intelligence Scores
│   ├── AIRagPlaceholderView.tsx  # Knowledge Base & Vector Index
│   ├── AIVoicePlaceholderView.tsx# Speech-to-Text & Text-to-Speech
│   └── AIAutomationsView.tsx     # Scheduled OS Triggers
├── context/
│   └── contextGatherer.ts        # Direct Zustand Store Reader
├── memory/
│   └── memoryEngine.ts           # Memory Management System
├── prompts/
│   └── promptRegistry.ts         # Prompt Versioning & Templates
├── providers/
│   └── providerAdapter.ts        # Gemini, OpenAI, Anthropic, Ollama, LM Studio
├── workflows/
│   └── workflowEngine.ts         # Multi-Step Execution Runner
├── tools/
│   └── index.ts                  # Cross-Module Reusable Tools
├── stores/                       # Zustand Store Hooks
├── hooks/                        # React Integration Hooks
├── constants/                    # Default Prompts & Mock Datasets
├── types/                        # Global AI TypeScript Interfaces
├── routes.ts                     # Navigation Routes
├── module.ts                     # Module SDK Registration
└── index.ts                      # Master Feature Exports
```
