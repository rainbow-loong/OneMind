-- =================================================================
-- 1. 创建 sessions (会话状态表)
-- =================================================================

-- 创建 sessions 表
CREATE TABLE public.sessions (
    session_id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    current_stage TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 添加表和列的注释
COMMENT ON TABLE public.sessions IS '会话状态表，用于跟踪用户的对话阶段';
COMMENT ON COLUMN public.sessions.session_id IS '会话唯一标识符 (主键)';
COMMENT ON COLUMN public.sessions.user_id IS '用户唯一标识符，关联到 Supabase 的 auth.users 表';
COMMENT ON COLUMN public.sessions.current_stage IS '当前对话阶段，如 stage_1_awareness';
COMMENT ON COLUMN public.sessions.created_at IS '创建时间';
COMMENT ON COLUMN public.sessions.updated_at IS '最后更新时间';

-- 创建一个函数来自动更新 updated_at 时间戳
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 创建一个触发器，在 sessions 表每次更新时调用上述函数
CREATE TRIGGER on_sessions_updated
BEFORE UPDATE ON public.sessions
FOR EACH ROW
EXECUTE PROCEDURE public.handle_updated_at();

-- 启用行级安全 (RLS)
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- 创建 RLS 策略，确保用户只能访问和操作自己的会话数据
CREATE POLICY "Allow individual access to own sessions"
ON public.sessions
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- =================================================================
-- 2. 创建 integration_crystals (整合结晶/长期记忆表)
-- =================================================================

-- 创建 integration_crystals 表
CREATE TABLE public.integration_crystals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    related_message_ids UUID[],
    blocker_description TEXT,
    key_insight TEXT,
    first_action TEXT,
    visual_type TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 添加表和列的注释
COMMENT ON TABLE public.integration_crystals IS '整合结晶/长期记忆表';
COMMENT ON COLUMN public.integration_crystals.id IS '结晶唯一标识符 (主键)';
COMMENT ON COLUMN public.integration_crystals.user_id IS '所属用户，关联到 Supabase 的 auth.users 表';
COMMENT ON COLUMN public.integration_crystals.name IS '用户为本次整合体验的命名';
COMMENT ON COLUMN public.integration_crystals.related_message_ids IS '关联的对话消息ID数组';
COMMENT ON COLUMN public.integration_crystals.blocker_description IS '用户遇到的卡点简述';
COMMENT ON COLUMN public.integration_crystals.key_insight IS '用户获得的关键洞察';
COMMENT ON COLUMN public.integration_crystals.first_action IS '用户完成的第一个微行动';
COMMENT ON COLUMN public.integration_crystals.visual_type IS '结晶的视觉类型，由规则引擎生成';
COMMENT ON COLUMN public.integration_crystals.created_at IS '创建时间';

-- 启用行级安全 (RLS)
ALTER TABLE public.integration_crystals ENABLE ROW LEVEL SECURITY;

-- 创建 RLS 策略，确保用户只能访问和操作自己的整合结晶
CREATE POLICY "Allow individual access to own integration crystals"
ON public.integration_crystals
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
