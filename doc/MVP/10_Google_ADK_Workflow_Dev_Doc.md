# “心一” Google ADK 工作流开发文档

> **版本**: 1.0
> **日期**: 2025-07-09
> **状态**: 草案
> **关联文档**: `9_supabase_schema.sql`, `7_AI_System_Prompt.md`, `4_AI对话设计SOP.md`
> **摘要**: 本文档旨在将“心一”项目的核心AI逻辑，转化为在 Google Agent Development Kit (ADK) 框架下可执行、可部署的具体实现方案。它为开发者定义了核心 Agent、Tools 以及与外部服务（如 Supabase）的交互方式。

---

## 1. 核心理念：以 Agent 和 Tools 重新定义“内在整合”

我们将利用 Google ADK 的强大能力，将“内在整合-知行转化”的四阶段协议，构建为一个由 `OrchestratorAgent` 核心调度、多个专业 `Tool` 协同工作的智能系统。

**核心实现思路**:

1.  **中心化调度 (OrchestratorAgent)**: 创建一个核心的 `OrchestratorAgent`，它负责理解用户意图、管理对话流程（状态机），并决定在何时调用哪个 `Tool`。
2.  **工具化能力 (Tools)**: 将所有外部交互和复杂逻辑，封装成独立的、可复用的 `Tool`。
    *   `MemoBaseTool`: 负责与 Supabase 数据库交互，管理短期会话状态和长期记忆。
    *   `WisdomTool`: 负责执行 RAG 操作，从知识库中检索智慧。
    *   `CrisisInterventionTool`: 负责执行最高优先级的安全检查。
3.  **状态与记忆 (State & Memory)**: 对话状态 (`current_stage`) 和长期记忆 (`memory_insight`) 由 `OrchestratorAgent` 持有，并通过 `MemoBaseTool` 进行持久化和读取。

---

## 2. Google ADK 架构概览图

```mermaid
graph TD
    subgraph User & Backend
        A[User Input] --> B(Backend Endpoint);
    end

    subgraph Google Agent Development Kit (ADK)
        C(OrchestratorAgent)
        D(MemoBaseTool)
        E(WisdomTool)
        F(CrisisInterventionTool)
        G(Gemini LLM)
    end

    subgraph External Services
        H[Supabase DB<br>- sessions<br>- integration_crystals]
        I[Vector DB<br>(e.g., Vertex AI Vector Search)]
    end

    %% Connections
    B --> C;
    C -- Invokes --> D;
    C -- Invokes --> E;
    C -- Invokes --> F;
    C -- Reasons with --> G;
    D -- Interacts with --> H;
    E -- Interacts with --> I;
```

---

## 3. 工具 (Tools) 定义与实现

在 ADK 中，`Tool` 是 Agent 可以调用的函数。我们需要定义以下核心工具：

### 3.1. `CrisisInterventionTool`

*   **职责**: 执行最高优先级的安全检查。
*   **函数签名**: `check(user_input: str) -> bool`
*   **逻辑**:
    1.  内部维护一个危机干预关键词列表。
    2.  检查 `user_input` 是否包含任何关键词。
    3.  如果包含，返回 `True`，否则返回 `False`。
*   **调用时机**: `OrchestratorAgent` 在处理任何用户输入之前，必须首先调用此工具。

### 3.2. `MemoBaseTool`

*   **职责**: 封装所有与 Supabase 数据库的交互，管理状态和记忆。
*   **函数签名**:
    *   `get_session(session_id: str, user_id: str) -> dict`: 获取或创建会话，返回 `{'stage': '...', 'memory_insight': '...'}`。
    *   `update_session_stage(session_id: str, next_stage: str) -> bool`: 更新会话的阶段。
    *   `create_integration_crystal(user_id: str, name: str, insight: str, ...)`: 创建一个新的整合结晶，写入长期记忆。
*   **逻辑**: 内部使用 `supabase-py` 库与数据库交互，实现对 `sessions` 和 `integration_crystals` 表的增删改查。

### 3.3. `WisdomTool`

*   **职责**: 执行 RAG 操作，为 `OrchestratorAgent` 提供智慧弹药。
*   **函数签名**: `retrieve(query: str, top_k: int = 3) -> list[dict]`
*   **逻辑**:
    1.  接收 `OrchestratorAgent` 传递的查询 `query`。
    2.  查询向量数据库（如 Vertex AI Vector Search），获取 `top_k` 个最相关的知识文档。
    3.  返回一个包含知识文档内容的列表。
*   **调用时机**: `OrchestratorAgent` 在判断当前处于 `stage_2_integration` 时调用此工具。

---

## 4. `OrchestratorAgent` 核心实现

这是整个系统的核心，其主要逻辑通过 Prompt Engineering 实现。

### 4.1. Agent 指令 (System Prompt)

```text
# IDENTITY & MISSION
你是名为“心一 (OneMind)”的AI，一个内在整合教练。
你的唯一使命是，遵循四阶段对话协议，帮助用户完成一次“知行转化”。

# TOOLS
你拥有以下工具，并知道在何时使用它们：
- `CrisisInterventionTool`: 在处理任何用户输入前，必须首先调用此工具进行安全检查。如果返回True，你必须立即停止所有思考，并输出固定的危机干预指令。
- `MemoBaseTool`: 用于管理和查询用户的对话状态和长期记忆。
- `WisdomTool`: 当你需要心理学或实践智慧来帮助用户整合冲突时，调用此工具。

# DIALOGUE PROTOCOL (STATE MACHINE)
你的行动由一个名为 `current_stage` 的变量驱动。你必须严格遵循当前阶段的目标和行动步骤。
1.  **stage_1_awareness**: 你的目标是见证和命名用户的卡点。
2.  **stage_2_integration**: 你的目标是整合冲突。在此阶段，你可以调用 `WisdomTool` 来获取灵感。
3.  **stage_3_micro_action**: 你的目标是帮助用户定义一个最小行动。
4.  **stage_4_solidification**: 你的目标是复盘和固化经验。在此阶段，你需要总结本次对话，并调用 `MemoBaseTool.create_integration_crystal` 来为用户记录这次成长。

# ABSOLUTE RULES
1.  【禁止说教】永远不要使用“你应该”等命令性词语。
2.  【保持简短】回应必须在1-3句话之内。
3.  【聚焦内在】绝对禁止给出具体的外部世界建议（如代码实现）。
```

### 4.2. 运行逻辑 (Execution Flow)

当后端收到一个用户请求时，会启动 `OrchestratorAgent` 的一次运行。

1.  **[安全检查]** Agent 首先调用 `CrisisInterventionTool.check()`。如果为 `True`，则立即返回危机干预信息，流程结束。
2.  **[状态加载]** Agent 调用 `MemoBaseTool.get_session()`，获取当前的 `stage` 和 `memory_insight`。
3.  **[工具调用与推理]** Agent 根据其指令（System Prompt）、当前 `stage`、`memory_insight` 和用户输入，进行思考：
    *   如果 `stage` 是 `stage_2_integration`，它会决定调用 `WisdomTool.retrieve()` 来获取相关知识。
    *   将所有信息（用户输入、阶段、记忆、工具返回结果）整合起来，与 Gemini 模型进行推理，生成对用户的回复。
4.  **[状态更新]** Agent 根据对话进展，决定下一个阶段 `next_stage`。
    *   如果对话未结束，则调用 `MemoBaseTool.update_session_stage()` 更新状态。
    *   如果对话在 `stage_4` 结束，则调用 `MemoBaseTool.create_integration_crystal()` 写入长期记忆，并可能会删除当前会话。
5.  **[返回响应]** Agent 将生成的回复返回给用户。

---

## 5. 总结

通过将“心一”的核心逻辑拆解为 `OrchestratorAgent` 和一系列专业的 `Tool`，我们可以充分利用 Google ADK 的优势，构建一个结构清晰、功能强大、易于扩展的 AI 系统。这种架构不仅完美地复现了我们最初的设计思想，还为未来的功能迭代（如引入更多专用 Agent）打下了坚实的基础。