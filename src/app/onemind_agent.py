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
from typing import Any

from google.adk.agents import LlmAgent
from google.adk.tools import FunctionTool
from pydantic import BaseModel, Field
from supabase import Client, create_client

from .config import onemind_config

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
            # 1. Try to fetch the existing session
            session_data = (
                supabase.table("sessions")
                .select("current_stage")
                .eq("session_id", session_input.session_id)
                .eq("user_id", session_input.user_id)
                .execute()
            )

            stage = "stage_1_awareness"  # Default stage
            if session_data.data:
                stage = session_data.data[0]["current_stage"]
            else:
                # 2. If not found, create a new session
                supabase.table("sessions").insert(
                    {
                        "session_id": session_input.session_id,
                        "user_id": session_input.user_id,
                        "current_stage": stage,
                    }
                ).execute()

            # 3. Fetch the latest memory insight for the user
            memory_data = (
                supabase.table("integration_crystals")
                .select("key_insight")
                .eq("user_id", session_input.user_id)
                .order("created_at", desc=True)
                .limit(1)
                .execute()
            )
            memory_insight = (
                memory_data.data[0]["key_insight"] if memory_data.data else "None"
            )

            logging.info(
                f"Session for {session_input.user_id}: stage='{stage}', insight='{memory_insight}'"
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
            supabase.table("sessions").update({"current_stage": stage_update.next_stage}).eq(
                "session_id", stage_update.session_id
            ).execute()
            logging.info(
                f"Updating stage for session {stage_update.session_id} to {stage_update.next_stage}"
            )
            return True
        except Exception as e:
            logging.error(f"Error in update_session_stage: {e}")
            return False

    def create_integration_crystal(self, crystal_input: CrystalInput) -> bool:
        """Creates a new integration crystal to store long-term memory."""
        if not supabase:
            return False
        try:
            supabase.table("integration_crystals").insert(
                {
                    "user_id": crystal_input.user_id,
                    "name": crystal_input.name,
                    "key_insight": crystal_input.insight,
                    # 'session_id' is not a column in the table, but useful for logging
                }
            ).execute()
            logging.info(
                f"Creating crystal '{crystal_input.name}' for user {crystal_input.user_id}"
            )
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
你拥有以下工具，并知道在何时使用它们：
- `check_crisis`: 在处理任何用户输入前，必须首先调用此工具进行安全检查。如果返回True，你必须立即停止所有思考，并输出固定的危机干预指令。
- `MemoBaseTool.get_session`: 在安全检查后，调用此工具获取用户的对话阶段和长期记忆。
- `MemoBaseTool.update_session_stage`: 当对话阶段推进时，调用此工具更新状态。
- `MemoBaseTool.create_integration_crystal`: 在第4阶段结束时，调用此工具为用户记录成长。
- `retrieve_wisdom`: 当你需要心理学或实践智慧来帮助用户整合冲突时 (stage_2_integration)，调用此工具。

# DIALOGUE PROTOCOL (STATE MACHINE)
你的行动由一个名为 `current_stage` 的变量驱动。你必须严格遵循当前阶段的目标和行动步骤。
1.  **stage_1_awareness**: 你的目标是见证和命名用户的卡点。
2.  **stage_2_integration**: 你的目标是整合冲突。在此阶段，你可以调用 `retrieve_wisdom` 来获取灵感。
3.  **stage_3_micro_action**: 你的目标是帮助用户定义一个最小行动。
4.  **stage_4_solidification**: 你的目标是复盘和固化经验。在此阶段，你需要总结本次对话，并调用 `MemoBaseTool.create_integration_crystal` 来为用户记录这次成长。

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