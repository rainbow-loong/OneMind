import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Send, Plus } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';
import { MessageBubble } from '@/components/MessageBubble';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function DialogueScreen() {
  const { state, actions } = useAppContext();
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);
  const mounted = useRef(false);

  const handleSend = async () => {
    if (inputText.trim() && state.user) {
      await actions.sendMessage(inputText.trim());
      setInputText('');
    }
  };

  const handleNewSession = async () => {
    await actions.startNewSession();
  };

  const handleMessageFeedback = async (messageId: string, feedback: 'good' | 'bad') => {
    // In a real app, this would update the feedback in the database
    console.log('Feedback:', messageId, feedback);
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (state.session.messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [state.session.messages]);

  // Auto sign in anonymously if no user
  useEffect(() => {
    mounted.current = true;
    if (!state.user && !state.ui.loading) {
      actions.signInAnonymously();
    }
    
    return () => {
      mounted.current = false;
    };
  }, []);

  // Show welcome screen if not shown before
  if (!state.ui.welcomeShown) {
    return (
      <WelcomeScreen 
        onComplete={() => actions.setWelcomeShown(true)} 
      />
    );
  }

  if (!state.user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <LoadingSpinner size={32} />
          <Text style={styles.loadingText}>正在初始化心一...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>心一</Text>
          <Text style={styles.headerSubtitle}>陪你迈出第一步</Text>
          <Pressable style={styles.newSessionButton} onPress={handleNewSession}>
            <Plus size={16} color={theme.colors.secondary} />
            <Text style={styles.newSessionText}>新对话</Text>
          </Pressable>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {state.session.messages.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                我在这里陪伴你{'\n'}随时开始对话吧
              </Text>
            </View>
          ) : (
            state.session.messages.map((message, index) => (
              <MessageBubble
                key={message.id || index}
                message={message}
                onFeedback={handleMessageFeedback}
              />
            ))
          )}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="说说你的困扰..."
              placeholderTextColor={theme.colors.tertiary}
              multiline
              maxLength={500}
            />
            <Pressable
              style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
              onPress={handleSend}
              disabled={!inputText.trim()}
            >
              <LinearGradient
                colors={inputText.trim() ? [theme.colors.accent, '#FFE55C'] : [theme.colors.tertiary, theme.colors.tertiary]}
                style={styles.sendButtonGradient}
              >
                <Send size={20} color={inputText.trim() ? theme.colors.background : theme.colors.secondary} />
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  loadingText: {
    fontSize: theme.typography.base,
    color: theme.colors.secondary,
    fontFamily: theme.typography.regular,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surface2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: theme.typography['2xl'],
    fontFamily: theme.typography.bold,
    color: theme.colors.accent,
  },
  headerSubtitle: {
    fontSize: theme.typography.sm,
    fontFamily: theme.typography.regular,
    color: theme.colors.secondary,
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  newSessionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.surface2,
    borderRadius: theme.borderRadius.sm,
    gap: theme.spacing.xs,
  },
  newSessionText: {
    fontSize: theme.typography.sm,
    fontFamily: theme.typography.medium,
    color: theme.colors.secondary,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: theme.spacing.md,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  emptyStateText: {
    fontSize: theme.typography.lg,
    fontFamily: theme.typography.regular,
    color: theme.colors.secondary,
    textAlign: 'center',
    lineHeight: 28,
  },
  inputContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surface2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: theme.spacing.sm,
  },
  textInput: {
    flex: 1,
    backgroundColor: theme.colors.surface2,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.typography.base,
    fontFamily: theme.typography.regular,
    color: theme.colors.primary,
    maxHeight: 100,
    textAlignVertical: 'top',
  },
  sendButton: {
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonGradient: {
    width: 44,
    height: 44,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
});