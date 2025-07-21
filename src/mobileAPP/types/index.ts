export interface User {
  id: string;
  phone?: string;
  isAnonymous: boolean;
  lastLogin: number;
}

export interface Session {
  session_id: string;
  user_id: string;
  current_stage: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  user_id: string;
  session_id: string;
  sender: 'user' | 'system';
  content: string;
  feedback?: 'good' | 'bad';
  created_at: string;
}

export interface Crystal {
  id: string;
  user_id: string;
  name: string;
  related_message_ids: string[];
  blocker_description: string;
  key_insight: string;
  first_action: string;
  visual_type: string;
  created_at: string;
}

export interface AppState {
  user: User | null;
  session: {
    currentId: string | null;
    stage: string;
    status: 'idle' | 'loading' | 'complete';
    messages: Message[];
  };
  ui: {
    loading: boolean;
    activeTab: string;
    welcomeShown: boolean;
    notifications: any[];
  };
  crystals: {
    list: Crystal[];
    currentViewing: Crystal | null;
  };
}

export type DialogueStage = 
  | 'stage_1_awareness'
  | 'stage_2_integration' 
  | 'stage_3_micro_action'
  | 'stage_4_reflection';