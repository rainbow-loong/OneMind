import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { ThumbsUp, ThumbsDown } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { Message } from '@/types';

interface MessageBubbleProps {
  message: Message;
  onFeedback?: (messageId: string, feedback: 'good' | 'bad') => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onFeedback }) => {
  const [showFeedback, setShowFeedback] = useState(false);
  const isUser = message.sender === 'user';
  const scale = useSharedValue(1);

  const handleLongPress = () => {
    if (!isUser && onFeedback) {
      setShowFeedback(true);
    }
  };

  const handleFeedback = (feedback: 'good' | 'bad') => {
    if (onFeedback) {
      onFeedback(message.id, feedback);
    }
    setShowFeedback(false);
    
    if (feedback === 'bad') {
      // Show feedback options
      Alert.alert(
        '反馈选项',
        '帮助我们改进，选择具体问题：',
        [
          { text: '答非所问', onPress: () => {} },
          { text: '过于刻板', onPress: () => {} },
          { text: '没有帮到我', onPress: () => {} },
          { text: '取消', style: 'cancel' }
        ]
      );
    }
  };

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.aiContainer]}>
      <Pressable 
        onLongPress={handleLongPress} 
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        delayLongPress={500}
      >
        <Animated.View style={animatedStyle}>
        {isUser ? (
          <LinearGradient
            colors={[theme.colors.accent, '#FFE55C']}
            style={styles.bubble}
          >
            <Text style={[styles.text, styles.userText]}>{message.content}</Text>
          </LinearGradient>
        ) : (
          <View style={[styles.bubble, styles.aiBubble]}>
            <Text style={[styles.text, styles.aiText]}>{message.content}</Text>
          </View>
        )}
        </Animated.View>
      </Pressable>
      
      {showFeedback && !isUser && (
        <View style={styles.feedbackContainer}>
          <Pressable 
            style={styles.feedbackButton}
            onPress={() => handleFeedback('good')}
          >
            <ThumbsUp size={16} color={theme.colors.success} />
            <Text style={styles.feedbackText}>很有帮助</Text>
          </Pressable>
          <Pressable 
            style={styles.feedbackButton}
            onPress={() => handleFeedback('bad')}
          >
            <ThumbsDown size={16} color={theme.colors.warning} />
            <Text style={styles.feedbackText}>有点奇怪</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  aiContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
  },
  aiBubble: {
    backgroundColor: theme.colors.aiBackground,
  },
  text: {
    fontSize: theme.typography.base,
    lineHeight: 22,
  },
  userText: {
    color: theme.colors.userText,
    fontFamily: theme.typography.medium,
  },
  aiText: {
    color: theme.colors.aiText,
    fontFamily: theme.typography.regular,
  },
  feedbackContainer: {
    flexDirection: 'row',
    marginTop: theme.spacing.xs,
    gap: theme.spacing.sm,
  },
  feedbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface2,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    gap: theme.spacing.xs,
  },
  feedbackText: {
    fontSize: theme.typography.sm,
    color: theme.colors.secondary,
    fontFamily: theme.typography.regular,
  },
});