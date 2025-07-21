import { createClient } from '@supabase/supabase-js/dist/module';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Crystal } from '@/types';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database helper functions
export const dbHelpers = {
  // Session management
  async createSession(userId: string) {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const { data, error } = await supabase
      .from('sessions')
      .insert([{
        session_id: sessionId,
        user_id: userId,
        current_stage: 'stage_1_awareness'
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Message management
  async sendMessage(sessionId: string, userId: string, content: string, sender: 'user' | 'system') {
    const { data, error } = await supabase
      .from('messages')
      .insert([{
        session_id: sessionId,
        user_id: userId,
        content,
        sender
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getSessionMessages(sessionId: string) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  // Crystal management
  async createCrystal(crystal: Omit<Crystal, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('integration_crystals')
      .insert([crystal])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUserCrystals(userId: string) {
    const { data, error } = await supabase
      .from('integration_crystals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Feedback management
  async updateMessageFeedback(messageId: string, feedback: 'good' | 'bad') {
    const { data, error } = await supabase
      .from('messages')
      .update({ feedback })
      .eq('id', messageId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};