import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Pressable,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, Target, Clock } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { MicroActionTimer } from '@/components/MicroActionTimer';

export default function TimerScreen() {
  const [showTaskInput, setShowTaskInput] = useState(false);
  const [currentTask, setCurrentTask] = useState('');
  const [taskInput, setTaskInput] = useState('');
  const [completedActions, setCompletedActions] = useState(0);

  const handleAddTask = () => {
    if (taskInput.trim()) {
      setCurrentTask(taskInput.trim());
      setTaskInput('');
      setShowTaskInput(false);
    }
  };

  const handleTimerComplete = () => {
    setCompletedActions(prev => prev + 1);
    Alert.alert(
      '太棒了！',
      '你完成了一个5分钟的专注时间。这种坚持就是改变的开始！',
      [
        {
          text: '继续努力',
          onPress: () => {}
        }
      ]
    );
  };

  const handleTaskComplete = () => {
    Alert.alert(
      '任务完成',
      '恭喜你完成了这个微行动！感觉怎么样？',
      [
        {
          text: '很有成就感',
          onPress: () => {
            setCompletedActions(prev => prev + 1);
            setCurrentTask('');
          }
        },
        {
          text: '还需要继续',
          onPress: () => {}
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>微行动启动器</Text>
          <Text style={styles.headerSubtitle}>
            将大目标分解，从5分钟开始
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <LinearGradient
            colors={[theme.colors.accent, '#FFE55C']}
            style={styles.statsGradient}
          >
            <Clock size={24} color={theme.colors.background} />
            <Text style={styles.statsNumber}>{completedActions}</Text>
            <Text style={styles.statsLabel}>完成的微行动</Text>
          </LinearGradient>
        </View>

        {/* Current Task */}
        <View style={styles.taskSection}>
          <Text style={styles.sectionTitle}>当前任务</Text>
          {currentTask ? (
            <View style={styles.currentTaskCard}>
              <Target size={20} color={theme.colors.accent} />
              <Text style={styles.currentTaskText}>{currentTask}</Text>
              <Pressable style={styles.completeTaskButton} onPress={handleTaskComplete}>
                <Text style={styles.completeTaskText}>完成</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable 
              style={styles.addTaskCard}
              onPress={() => setShowTaskInput(true)}
            >
              <Plus size={24} color={theme.colors.secondary} />
              <Text style={styles.addTaskText}>设置一个微行动目标</Text>
            </Pressable>
          )}
        </View>

        {/* Task Input Modal */}
        {showTaskInput && (
          <View style={styles.taskInputCard}>
            <Text style={styles.inputLabel}>今天想完成什么？</Text>
            <TextInput
              style={styles.taskInputField}
              value={taskInput}
              onChangeText={setTaskInput}
              placeholder="例如：读书5分钟、整理桌面、写100字..."
              placeholderTextColor={theme.colors.tertiary}
              multiline
              autoFocus
            />
            <View style={styles.inputActions}>
              <Pressable 
                style={styles.cancelButton}
                onPress={() => {
                  setShowTaskInput(false);
                  setTaskInput('');
                }}
              >
                <Text style={styles.cancelButtonText}>取消</Text>
              </Pressable>
              <Pressable 
                style={[styles.confirmButton, !taskInput.trim() && styles.confirmButtonDisabled]}
                onPress={handleAddTask}
                disabled={!taskInput.trim()}
              >
                <Text style={styles.confirmButtonText}>确定</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Timer */}
        <View style={styles.timerSection}>
          <Text style={styles.sectionTitle}>专注计时器</Text>
          <MicroActionTimer onComplete={handleTimerComplete} />
        </View>

        {/* Tips */}
        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>小贴士</Text>
          <View style={styles.tipCard}>
            <Text style={styles.tipText}>
              🎯 设定一个非常具体且小的目标{'\n'}
              ⏰ 专注5分钟，不被任何事情打断{'\n'}
              🎉 完成后给自己一个小奖励{'\n'}
              🔄 每天重复，养成行动习惯
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: theme.typography['2xl'],
    fontFamily: theme.typography.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  headerSubtitle: {
    fontSize: theme.typography.base,
    fontFamily: theme.typography.regular,
    color: theme.colors.secondary,
    textAlign: 'center',
  },
  statsContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  statsGradient: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  statsNumber: {
    fontSize: theme.typography['3xl'],
    fontFamily: theme.typography.bold,
    color: theme.colors.background,
  },
  statsLabel: {
    fontSize: theme.typography.sm,
    fontFamily: theme.typography.medium,
    color: theme.colors.background,
    opacity: 0.9,
  },
  taskSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.lg,
    fontFamily: theme.typography.semiBold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
  },
  currentTaskCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  currentTaskText: {
    flex: 1,
    fontSize: theme.typography.base,
    fontFamily: theme.typography.medium,
    color: theme.colors.primary,
  },
  completeTaskButton: {
    backgroundColor: theme.colors.success,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  completeTaskText: {
    fontSize: theme.typography.sm,
    fontFamily: theme.typography.semiBold,
    color: theme.colors.background,
  },
  addTaskCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
    gap: theme.spacing.sm,
    borderWidth: 2,
    borderColor: theme.colors.surface2,
    borderStyle: 'dashed',
  },
  addTaskText: {
    fontSize: theme.typography.base,
    fontFamily: theme.typography.medium,
    color: theme.colors.secondary,
  },
  taskInputCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    margin: theme.spacing.lg,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  inputLabel: {
    fontSize: theme.typography.base,
    fontFamily: theme.typography.semiBold,
    color: theme.colors.primary,
  },
  taskInputField: {
    backgroundColor: theme.colors.surface2,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.typography.base,
    fontFamily: theme.typography.regular,
    color: theme.colors.primary,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputActions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: theme.colors.surface2,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: theme.typography.base,
    fontFamily: theme.typography.medium,
    color: theme.colors.secondary,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: theme.colors.accent,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    opacity: 0.5,
  },
  confirmButtonText: {
    fontSize: theme.typography.base,
    fontFamily: theme.typography.semiBold,
    color: theme.colors.background,
  },
  timerSection: {
    marginBottom: theme.spacing.lg,
  },
  tipsSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  tipCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
  },
  tipText: {
    fontSize: theme.typography.sm,
    fontFamily: theme.typography.regular,
    color: theme.colors.secondary,
    lineHeight: 22,
  },
});