import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Pause, RotateCcw, Check } from 'lucide-react-native';
import { theme } from '@/constants/theme';

interface MicroActionTimerProps {
  onComplete?: () => void;
}

export const MicroActionTimer: React.FC<MicroActionTimerProps> = ({ onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(300);
    setIsCompleted(false);
  };

  const handleComplete = () => {
    setIsCompleted(true);
    setIsRunning(false);
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.timerDisplay}>
        <Text style={styles.timeText}>{formatTime(timeLeft)}</Text>
        <Text style={styles.labelText}>专注时间</Text>
      </View>
      
      <View style={styles.controls}>
        {!isCompleted ? (
          <>
            <Pressable
              style={styles.controlButton}
              onPress={isRunning ? handlePause : handleStart}
            >
              <LinearGradient
                colors={[theme.colors.accent, '#FFE55C']}
                style={styles.primaryButton}
              >
                {isRunning ? (
                  <Pause size={20} color={theme.colors.background} />
                ) : (
                  <Play size={20} color={theme.colors.background} />
                )}
                <Text style={styles.primaryButtonText}>
                  {isRunning ? '暂停' : '开始'}
                </Text>
              </LinearGradient>
            </Pressable>
            
            <Pressable style={styles.secondaryButton} onPress={handleReset}>
              <RotateCcw size={16} color={theme.colors.secondary} />
              <Text style={styles.secondaryButtonText}>重置</Text>
            </Pressable>
            
            <Pressable style={styles.secondaryButton} onPress={handleComplete}>
              <Check size={16} color={theme.colors.success} />
              <Text style={[styles.secondaryButtonText, { color: theme.colors.success }]}>
                完成
              </Text>
            </Pressable>
          </>
        ) : (
          <View style={styles.completedContainer}>
            <Check size={24} color={theme.colors.success} />
            <Text style={styles.completedText}>恭喜完成！</Text>
            <Pressable style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetButtonText}>再来一次</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    margin: theme.spacing.md,
    alignItems: 'center',
  },
  timerDisplay: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  timeText: {
    fontSize: 48,
    fontFamily: theme.typography.bold,
    color: theme.colors.accent,
    letterSpacing: 2,
  },
  labelText: {
    fontSize: theme.typography.sm,
    fontFamily: theme.typography.regular,
    color: theme.colors.secondary,
    marginTop: theme.spacing.xs,
  },
  controls: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  controlButton: {
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  primaryButtonText: {
    fontSize: theme.typography.base,
    fontFamily: theme.typography.semiBold,
    color: theme.colors.background,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface2,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.xs,
  },
  secondaryButtonText: {
    fontSize: theme.typography.sm,
    fontFamily: theme.typography.medium,
    color: theme.colors.secondary,
  },
  completedContainer: {
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  completedText: {
    fontSize: theme.typography.lg,
    fontFamily: theme.typography.semiBold,
    color: theme.colors.success,
  },
  resetButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface2,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.sm,
  },
  resetButtonText: {
    fontSize: theme.typography.sm,
    fontFamily: theme.typography.medium,
    color: theme.colors.secondary,
  },
});