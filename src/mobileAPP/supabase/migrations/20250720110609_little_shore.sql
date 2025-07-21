/*
  # Create core tables for OneMind app

  1. New Tables
    - `sessions`
      - `session_id` (text, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `current_stage` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `messages`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `session_id` (text, foreign key to sessions)
      - `sender` (text, enum: user/system)
      - `content` (text)
      - `feedback` (text, enum: good/bad)
      - `created_at` (timestamp)
    - `integration_crystals`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `name` (text)
      - `related_message_ids` (uuid array)
      - `blocker_description` (text)
      - `key_insight` (text)
      - `first_action` (text)
      - `visual_type` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
    - Add policies for anonymous users to access their own data

  3. Functions
    - Add trigger for updating updated_at timestamp
*/

-- Create custom types
CREATE TYPE sender_type AS ENUM ('user', 'system');
CREATE TYPE feedback_type AS ENUM ('good', 'bad');

-- Create sessions table
CREATE TABLE IF NOT EXISTS public.sessions (
    session_id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    current_stage TEXT DEFAULT 'stage_1_awareness',
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    session_id TEXT REFERENCES public.sessions(session_id) ON DELETE CASCADE,
    sender sender_type NOT NULL,
    content TEXT NOT NULL,
    feedback feedback_type,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create integration crystals table
CREATE TABLE IF NOT EXISTS public.integration_crystals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    related_message_ids UUID[] DEFAULT '{}',
    blocker_description TEXT,
    key_insight TEXT,
    first_action TEXT,
    visual_type TEXT DEFAULT 'default',
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_crystals ENABLE ROW LEVEL SECURITY;

-- Create policies for sessions
CREATE POLICY "Users can read own sessions"
    ON public.sessions
    FOR SELECT
    TO authenticated, anon
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
    ON public.sessions
    FOR INSERT
    TO authenticated, anon
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
    ON public.sessions
    FOR UPDATE
    TO authenticated, anon
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create policies for messages
CREATE POLICY "Users can read own messages"
    ON public.messages
    FOR SELECT
    TO authenticated, anon
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own messages"
    ON public.messages
    FOR INSERT
    TO authenticated, anon
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own messages"
    ON public.messages
    FOR UPDATE
    TO authenticated, anon
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create policies for integration crystals
CREATE POLICY "Users can read own crystals"
    ON public.integration_crystals
    FOR SELECT
    TO authenticated, anon
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own crystals"
    ON public.integration_crystals
    FOR INSERT
    TO authenticated, anon
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own crystals"
    ON public.integration_crystals
    FOR UPDATE
    TO authenticated, anon
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for sessions table
CREATE TRIGGER update_sessions_updated_at
    BEFORE UPDATE ON public.sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON public.sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_session_id ON public.messages(session_id);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON public.messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at);
CREATE INDEX IF NOT EXISTS idx_crystals_user_id ON public.integration_crystals(user_id);
CREATE INDEX IF NOT EXISTS idx_crystals_created_at ON public.integration_crystals(created_at);