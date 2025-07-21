import React, { createContext, useContext, useReducer, useEffect, useRef, ReactNode } from 'react';
import { AppState, User, Message, Crystal } from '@/types';
import { supabase, dbHelpers } from '@/utils/supabase';
import { AIResponseGenerator } from '@/utils/aiResponses';

type AppAction = 
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'SET_MESSAGES'; payload: Message[] }
  | { type: 'SET_SESSION'; payload: { sessionId: string; stage: string } }
  | { type: 'SET_CRYSTALS'; payload: Crystal[] }
  | { type: 'ADD_CRYSTAL'; payload: Crystal }
  | { type: 'SET_ACTIVE_TAB'; payload: string }
  | { type: 'SET_WELCOME_SHOWN'; payload: boolean };

const initialState: AppState = {
  user: null,
  session: {
    currentId: null,
    stage: 'stage_1_awareness',
    status: 'idle',
    messages: [],
  },
  ui: {
    loading: false,
    activeTab: 'dialogue',
    welcomeShown: false,
    notifications: [],
  },
  crystals: {
    list: [],
    currentViewing: null,
  },
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_LOADING':
      return { ...state, ui: { ...state.ui, loading: action.payload } };
    case 'ADD_MESSAGE':
      return {
        ...state,
        session: {
          ...state.session,
          messages: [...state.session.messages, action.payload],
        },
      };
    case 'SET_MESSAGES':
      return {
        ...state,
        session: { ...state.session, messages: action.payload },
      };
    case 'SET_SESSION':
      return {
        ...state,
        session: {
          ...state.session,
          currentId: action.payload.sessionId,
          stage: action.payload.stage,
        },
      };
    case 'SET_CRYSTALS':
      return {
        ...state,
        crystals: { ...state.crystals, list: action.payload },
      };
    case 'ADD_CRYSTAL':
      return {
        ...state,
        crystals: {
          ...state.crystals,
          list: [action.payload, ...state.crystals.list],
        },
      };
    case 'SET_ACTIVE_TAB':
      return { ...state, ui: { ...state.ui, activeTab: action.payload } };
    case 'SET_WELCOME_SHOWN':
      return { ...state, ui: { ...state.ui, welcomeShown: action.payload } };
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  actions: {
    signInAnonymously: () => Promise<void>;
    sendMessage: (content: string) => Promise<void>;
    startNewSession: () => Promise<void>;
    loadUserCrystals: () => Promise<void>;
    createCrystal: (crystal: Omit<Crystal, 'id' | 'created_at'>) => Promise<void>;
    setWelcomeShown: (shown: boolean) => void;
  };
} | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const mounted = useRef(false);

  const actions = {
    async signInAnonymously() {
      if (mounted.current) {
        dispatch({ type: 'SET_LOADING', payload: true });
      }
      try {
        const { data, error } = await supabase.auth.signInAnonymously();
        if (error) throw error;
        
        const user: User = {
          id: data.user!.id,
          isAnonymous: true,
          lastLogin: Date.now(),
        };
        
        if (mounted.current) {
          dispatch({ type: 'SET_USER', payload: user });
          await actions.startNewSession();
        }
      } catch (error) {
        console.error('Anonymous sign in error:', error);
      } finally {
        if (mounted.current) {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      }
    },

    async startNewSession() {
      if (!state.user) return;
      
      try {
        const session = await dbHelpers.createSession(state.user.id);
        if (mounted.current) {
          dispatch({
            type: 'SET_SESSION',
            payload: { sessionId: session.session_id, stage: session.current_stage },
          });
        }
        
        // Send initial AI greeting
        const welcomeMessage = "你好！我是心一，很高兴遇见你。最近有什么想做但总是开始不了的事情吗？比如学习、运动，或者其他什么？";
        await dbHelpers.sendMessage(session.session_id, state.user.id, welcomeMessage, 'system');
        
        // Load messages
        const messages = await dbHelpers.getSessionMessages(session.session_id);
        if (mounted.current) {
          dispatch({ type: 'SET_MESSAGES', payload: messages });
        }
      } catch (error) {
        console.error('Start session error:', error);
      }
    },

    async sendMessage(content: string) {
      if (!state.user || !state.session.currentId) return;
      
      try {
        // Add user message
        const userMessage = await dbHelpers.sendMessage(
          state.session.currentId,
          state.user.id,
          content,
          'user'
        );
        if (mounted.current) {
          dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
        }
        
        // Simulate AI response (in a real app, this would be an API call)
        setTimeout(async () => {
          const aiResponse = AIResponseGenerator.generateResponse(
            content, 
            state.session.stage as any,
            {
              messageHistory: state.session.messages.map(m => m.content),
              previousAttempts: state.session.messages.filter(m => m.sender === 'user').length
            }
          );
          const systemMessage = await dbHelpers.sendMessage(
            state.session.currentId!,
            state.user!.id,
            aiResponse,
            'system'
          );
          if (mounted.current) {
            dispatch({ type: 'ADD_MESSAGE', payload: systemMessage });
          }
        }, 1000);
      } catch (error) {
        console.error('Send message error:', error);
      }
    },

    async loadUserCrystals() {
      if (!state.user) return;
      
      try {
        const crystals = await dbHelpers.getUserCrystals(state.user.id);
        if (mounted.current) {
          dispatch({ type: 'SET_CRYSTALS', payload: crystals });
        }
      } catch (error) {
        console.error('Load crystals error:', error);
      }
    },

    async createCrystal(crystal: Omit<Crystal, 'id' | 'created_at'>) {
      try {
        const newCrystal = await dbHelpers.createCrystal(crystal);
        if (mounted.current) {
          dispatch({ type: 'ADD_CRYSTAL', payload: newCrystal });
        }
      } catch (error) {
        console.error('Create crystal error:', error);
      }
    },

    setWelcomeShown: (shown: boolean) => {
      if (mounted.current) {
        dispatch({ type: 'SET_WELCOME_SHOWN', payload: shown });
      }
    },
  };

  // Check for existing session on app start
  useEffect(() => {
    mounted.current = true;
    const checkSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const appUser: User = {
          id: user.id,
          isAnonymous: user.is_anonymous || false,
          lastLogin: Date.now(),
        };
        if (mounted.current) {
          dispatch({ type: 'SET_USER', payload: appUser });
          await actions.loadUserCrystals();
        }
      }
    };
    
    checkSession();
    
    return () => {
      mounted.current = false;
    };
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
