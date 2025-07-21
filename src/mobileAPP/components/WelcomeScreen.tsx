import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles, ArrowRight, Heart } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat, 
  withSequence 
} from 'react-native-reanimated';
import { theme } from '@/constants/theme';

interface WelcomeScreenProps {
  onComplete: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const sparkleScale = useSharedValue(1);
  const heartScale = useSharedValue(1);

  const steps = [
    {
      icon: Sparkles,
      title: '与心一对话',
      subtitle: '发现行动卡点',
      description: '通过温暖的对话，识别内心的困惑与阻碍',
    },
    {
      icon: ArrowRight,
      title: '拆解微行动',
      subtitle: '迈出第一步',
      description: '将大目标分解为5分钟可完成的小行动',
    },
    {
      icon: Heart,
      title: '积累成就结晶',
      subtitle: '见证成长',
      description: '每次突破都会凝结成专属的成长见证',
    },
  ];

  useEffect(() => {
    // Sparkle animation
    sparkleScale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );

    // Heart animation
    heartScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 800 }),
        withTiming(1, { duration: 800 })
      ),
      -1,
      true
    );
  }, []);

  const sparkleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sparkleScale.value }],
  }));

  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const currentStepData = steps[currentStep];
  const IconComponent = currentStepData.icon;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.background, '#1A1A2E']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appName}>心一</Text>
          <Text style={styles.tagline}>知行合一，陪你迈出第一步</Text>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            {currentStep === 0 && (
              <Animated.View style={sparkleAnimatedStyle}>
                <IconComponent size={80} color={theme.colors.accent} />
              </Animated.View>
            )}
            {currentStep === 1 && (
              <IconComponent size={80} color={theme.colors.accent} />
            )}
            {currentStep === 2 && (
              <Animated.View style={heartAnimatedStyle}>
                <IconComponent size={80} color={theme.colors.accent} />
              </Animated.View>
            )}
          </View>

          <Text style={styles.stepTitle}>{currentStepData.title}</Text>
          <Text style={styles.stepSubtitle}>{currentStepData.subtitle}</Text>
          <Text style={styles.stepDescription}>{currentStepData.description}</Text>
        </View>

        {/* Progress Indicators */}
        <View style={styles.progressContainer}>
          {steps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                index === currentStep && styles.progressDotActive,
              ]}
            />
          ))}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Pressable style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>跳过</Text>
          </Pressable>

          <Pressable style={styles.nextButton} onPress={handleNext}>
            <LinearGradient
              colors={[theme.colors.accent, '#FFE55C']}
              style={styles.nextButtonGradient}
            >
              <Text style={styles.nextButtonText}>
                {currentStep === steps.length - 1 ? '开始体验' : '下一步'}
              </Text>
              <ArrowRight size={20} color={theme.colors.background} />
            </LinearGradient>
          </Pressable>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginTop: theme.spacing['2xl'],
    marginBottom: theme.spacing.xl,
  },
  appName: {
    fontSize: theme.typography['3xl'],
    fontFamily: theme.typography.bold,
    color: theme.colors.accent,
    marginBottom: theme.spacing.sm,
  },
  tagline: {
    fontSize: theme.typography.base,
    fontFamily: theme.typography.regular,
    color: theme.colors.secondary,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  iconContainer: {
    marginBottom: theme.spacing.xl,
  },
  stepTitle: {
    fontSize: theme.typography['2xl'],
    fontFamily: theme.typography.bold,
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  stepSubtitle: {
    fontSize: theme.typography.lg,
    fontFamily: theme.typography.semiBold,
    color: theme.colors.accent,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  stepDescription: {
    fontSize: theme.typography.base,
    fontFamily: theme.typography.regular,
    color: theme.colors.secondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: theme.spacing.md,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.surface2,
  },
  progressDotActive: {
    backgroundColor: theme.colors.accent,
    width: 24,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  skipButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  skipButtonText: {
    fontSize: theme.typography.base,
    fontFamily: theme.typography.medium,
    color: theme.colors.secondary,
  },
  nextButton: {
    flex: 1,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  nextButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  nextButtonText: {
    fontSize: theme.typography.base,
    fontFamily: theme.typography.semiBold,
    color: theme.colors.background,
  },
});