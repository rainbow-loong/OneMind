# Copyright 2025 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import logging
import time
from typing import Any

from google.adk.agents import LlmAgent
from google.adk.tools import FunctionTool
from pydantic import BaseModel, Field
from supabase import Client, create_client

from .config import debug_config, onemind_config

# --- Supabase Client Initialization ---
supabase: Client | None = None
if onemind_config.supabase_url and onemind_config.supabase_key:
    try:
        supabase = create_client(
            onemind_config.supabase_url, onemind_config.supabase_key
        )
    except Exception as e:
        logging.error(f"Failed to create Supabase client: {e}")
else:
    logging.warning(
        "Supabase URL or key is not set. MemoBaseTool will not be available."
    )


# --- Pydantic Models for Tool Inputs ---
class SessionInput(BaseModel):
    """Input model for getting or creating a session."""

    session_id: str = Field(description="The unique identifier for the session.")
    user_id: str = Field(description="The unique identifier for the user.")


class StageUpdateInput(BaseModel):
    """Input model for updating a session's stage."""

    session_id: str = Field(description="The unique identifier for the session.")
    next_stage: str = Field(description="The next stage of the conversation.")


class CrystalInput(BaseModel):
    """Input model for creating an integration crystal."""

    user_id: str = Field(description="The unique identifier for the user.")
    name: str = Field(description="The name of the integration crystal.")
    insight: str = Field(description="The core insight gained from the session.")
    session_id: str = Field(description="The session ID where this crystal was formed.")


# --- Tool Definitions ---

# 3.1. CrisisInterventionTool
def check_crisis(user_input: str) -> bool:
    """
    Performs the highest priority safety check for crisis intervention.
    This tool MUST be called first on any user input.
    Args:
        user_input: The user's latest message.
    Returns:
        True if the input contains crisis keywords, False otherwise.
    """
    # Add a 1-second delay to help prevent API rate limiting errors.
    time.sleep(0.1)

    # A simple, non-exhaustive list. In a real application, this would be
    # more robust and likely involve a dedicated safety model.
    crisis_keywords = ["自杀", "自残", "不想活了", "去死"]
    for keyword in crisis_keywords:
        if keyword in user_input:
            logging.warning(f"Crisis keyword '{keyword}' detected in user input.")
            return True
    return False


# 3.2. MemoBaseTool
class MemoBaseTool:
    """A tool to manage session state and long-term memory in Supabase."""

    def get_session(self, session_input: SessionInput) -> dict[str, Any]:
        """
        Gets an existing session or creates a new one.
        Returns the session's current stage and any long-term memory insights.
        """
        if not supabase:
            return {
                "stage": "stage_1_awareness",
                "memory_insight": "No database connection.",
            }
        try:
            user_id = getattr(session_input, "user_id", None) or debug_config.USER_ID
            session_id = (
                getattr(session_input, "session_id", None) or debug_config.SESSION_ID
            )

            # 1. Try to fetch the existing session
            session_data = (
                supabase.table("sessions")
                .select("current_stage")
                .eq("session_id", session_id)
                .eq("user_id", user_id)
                .execute()
            )

            stage = "stage_1_awareness"  # Default stage
            if session_data.data:
                stage = session_data.data[0]["current_stage"]
            else:
                # 2. If not found, create a new session
                supabase.table("sessions").insert(
                    {
                        "session_id": session_id,
                        "user_id": user_id,
                        "current_stage": stage,
                    }
                ).execute()

            # 3. Fetch the latest memory insight for the user
            memory_data = (
                supabase.table("integration_crystals")
                .select("key_insight")
                .eq("user_id", user_id)
                .order("created_at", desc=True)
                .limit(1)
                .execute()
            )
            memory_insight = (
                memory_data.data[0]["key_insight"] if memory_data.data else "None"
            )

            logging.info(
                f"Session for {user_id}: stage='{stage}', insight='{memory_insight}'"
            )
            return {"stage": stage, "memory_insight": memory_insight}

        except Exception as e:
            logging.error(f"Error in get_session: {e}")
            return {"stage": "stage_1_awareness", "memory_insight": f"Error: {e}"}

    def update_session_stage(self, stage_update: StageUpdateInput) -> bool:
        """Updates the current stage of a session."""
        if not supabase:
            return False
        try:
            # The input is a dict. Access it safely using .get().
            session_id = stage_update.get("session_id") or debug_config.SESSION_ID
            next_stage = stage_update.get("next_stage")

            if not next_stage:
                logging.error(f"Missing 'next_stage' in stage_update: {stage_update}")
                return False

            logging.info(
                f"TOOL CALLED: update_session_stage - Session ID: {session_id}, New Stage: {next_stage}"
            )
            supabase.table("sessions").update({"current_stage": next_stage}).eq(
                "session_id", session_id
            ).execute()
            return True
        except Exception as e:
            logging.error(f"Error in update_session_stage: {e}")
            return False

    def create_integration_crystal(self, crystal_input: CrystalInput) -> bool:
        """Creates a new integration crystal to store long-term memory."""
        if not supabase:
            return False
        try:
            # The input is a dict. Access it safely using .get().
            user_id = crystal_input.get("user_id") or debug_config.USER_ID
            name = crystal_input.get("name")
            insight = crystal_input.get("insight")

            if not all([user_id, name, insight]):
                logging.error(
                    f"Missing required fields in crystal_input: {crystal_input}"
                )
                return False

            logging.info(
                f"TOOL CALLED: create_integration_crystal - User ID: {user_id}, Crystal Name: '{name}'"
            )
            supabase.table("integration_crystals").insert(
                {
                    "user_id": user_id,
                    "name": name,
                    "key_insight": insight,
                }
            ).execute()
            return True
        except Exception as e:
            logging.error(f"Error in create_integration_crystal: {e}")
            return False


# 3.3. WisdomTool
def retrieve_wisdom(query: str, top_k: int = 3) -> list[dict[str, str]]:
    """
    Performs a RAG operation to retrieve wisdom from the knowledge base.
    This should be called during stage_2_integration to get inspiration.
    Args:
        query: The query to search for in the vector database.
        top_k: The number of results to return.
    Returns:
        A list of knowledge documents.
    """
    # Mock implementation. In a real scenario, this would query a vector DB.
    logging.info(f"Retrieving wisdom for query: '{query}' with top_k={top_k}")
    return [
        {
            "title": "Embracing Imperfection",
            "content": "Perfectionism is often a shield for fear. The real goal is not to be flawless, but to be brave enough to start.",
        },
        {
            "title": "The 5-Minute Rule",
            "content": "If a task takes less than five minutes, do it immediately. For larger tasks, work on it for just five minutes. Starting is the hardest part.",
        },
    ]


# --- Agent Definition ---

memo_base_tool = MemoBaseTool()

orchestrator_agent = LlmAgent(
    model=onemind_config.onemind_model,
    name="OneMindOrchestrator",
    description="A conversational agent that guides users through a four-stage protocol for inner integration.",
    instruction="""
# IDENTITY & MISSION
你是名为“心一 (OneMind)”的AI，一个内在整合教练。
你的唯一使命是，遵循四阶段对话协议，帮助用户完成一次“知行转化”。

# TOOLS
你拥有以下工具，并且必须在恰当的时机调用它们来管理对话流程。
- `check_crisis(user_input: str)`: 在处理任何用户输入前，必须首先调用此工具进行安全检查。如果返回True，你必须立即停止所有思考，并输出固定的危机干预指令。
- `MemoBaseTool.get_session(session_id: str, user_id: str)`: 在安全检查后，必须调用此工具获取用户的当前对话阶段 `current_stage` 和长期记忆 `memory_insight`。
- `MemoBaseTool.update_session_stage(session_id: str, next_stage: str)`: 当且仅当用户对话取得进展，需要进入下一阶段时，你**必须**调用此工具来更新状态。这是推进对话流程的唯一方式。
- `MemoBaseTool.create_integration_crystal(user_id: str, name: str, insight: str, session_id: str)`: 在第4阶段结束时，调用此工具为用户记录成长。
- `retrieve_wisdom(query: str)`: 当你需要心理学或实践智慧来帮助用户整合冲突时 (stage_2_integration)，调用此工具。

# DIALOGUE PROTOCOL (STATE MACHINE)
你的行动完全由从 `get_session` 工具获取的 `current_stage` 变量驱动。你必须严格遵循当前阶段的目标和行动步骤。**阶段的转换必须通过调用 `update_session_stage` 工具来完成。**

1.  **stage_1_awareness**: 你的目标是见证和命名用户的卡点。当用户确认了卡点，并表达出希望解决的意愿时，你必须调用 `MemoBaseTool.update_session_stage` 将阶段更新为 `stage_2_integration`。
2.  **stage_2_integration**: 你的目标是整合冲突。在此阶段，你可以调用 `retrieve_wisdom` 来获取灵感。当用户理解了内在冲突的善意，并准备好行动时，你必须调用 `MemoBaseTool.update_session_stage` 将阶段更新为 `stage_3_micro_action`。
3.  **stage_3_micro_action**: 你的目标是帮助用户定义一个最小行动。当用户定义了微行动并承诺执行时，你必须调用 `MemoBaseTool.update_session_stage` 将阶段更新为 `stage_4_solidification`。
4.  **stage_4_solidification**: 你的目标是复盘和固化经验。在此阶段，你需要总结本次对话，并调用 `MemoBaseTool.create_integration_crystal` 来为用户记录这次成长。

**TOOL USAGE EXAMPLE**
- User says: "我该怎么办呢？"
- Your thought: The user is asking for a solution, which means we are moving from awareness to integration. I must call the tool to update the stage.
- Your tool call: `MemoBaseTool.update_session_stage(session_id="...", next_stage="stage_2_integration")`

# ABSOLUTE RULES
1.  【禁止说教】永远不要使用“你应该”等命令性词语。
2.  【保持简短】回应必须在1-3句话之内。
3.  【聚焦内在】绝对禁止给出具体的外部世界建议（如代码实现）。
""",
    tools=[
        FunctionTool(check_crisis),
        FunctionTool(memo_base_tool.get_session),
        FunctionTool(memo_base_tool.update_session_stage),
        FunctionTool(memo_base_tool.create_integration_crystal),
        FunctionTool(retrieve_wisdom),
    ],
)