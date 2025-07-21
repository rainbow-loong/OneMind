import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Pressable,
  Alert,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles, Plus, Share, Trophy } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';
import { CrystalCard } from '@/components/CrystalCard';
import { Crystal } from '@/types';

export default function CrystalsScreen() {
  const { state, actions } = useAppContext();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await actions.loadUserCrystals();
    setRefreshing(false);
  };

  const handleCreateCrystal = () => {
    Alert.alert(
      '创建成就结晶',
      '完成一次完整的对话流程后，系统会自动为你生成专属的成就结晶。',
      [{ text: '了解了' }]
    );
  };

  const handleCrystalPress = (crystal: Crystal) => {
    Alert.alert(
      crystal.name,
      `✨ 核心洞察：${crystal.key_insight}\n\n🎯 第一步行动：${crystal.first_action}\n\n📝 突破描述：${crystal.blocker_description}`,
      [
        {
          text: '分享结晶',
          onPress: () => handleShareCrystal(crystal)
        },
        {
          text: '关闭',
          style: 'cancel'
        }
      ]
    );
  };

  const handleShareCrystal = (crystal: Crystal) => {
    // In a real app, this would open the share dialog
    Alert.alert(
      '分享成功',
      '你的成就结晶已经复制到剪贴板，可以分享给朋友了！',
      [{ text: '好的' }]
    );
  };

  useEffect(() => {
    if (state.user) {
      actions.loadUserCrystals();
    }
  }, [state.user]);

  // Mock data for demonstration
  const mockCrystals: Crystal[] = [
    {
      id: '1',
      user_id: state.user?.id || '',
      name: '拖延克星',
      related_message_ids: [],
      blocker_description: '害怕开始学习任务',
      key_insight: '原来完美主义让我害怕失败，所以一直拖延',
      first_action: '只学习5分钟，不求完美',
      visual_type: 'courage',
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      user_id: state.user?.id || '',
      name: '专注力量',
      related_message_ids: [],
      blocker_description: '容易被手机分心',
      key_insight: '我需要给注意力一个明确的方向',
      first_action: '手机放远处，设置5分钟专注时间',
      visual_type: 'strength',
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
  ];

  const crystalsToShow = state.crystals.list.length > 0 ? state.crystals.list : mockCrystals;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>成就结晶</Text>
          <Text style={styles.headerSubtitle}>
            每一次突破都值得纪念
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <LinearGradient
            colors={['#4A90E2', '#7B68EE']}
            style={styles.statsGradient}
          >
            <Trophy size={24} color={theme.colors.background} />
            <Text style={styles.statsNumber}>{crystalsToShow.length}</Text>
            <Text style={styles.statsLabel}>收集的结晶</Text>
          </LinearGradient>
          
          <Pressable style={styles.createButton} onPress={handleCreateCrystal}>
            <Plus size={20} color={theme.colors.accent} />
            <Text style={styles.createButtonText}>创建结晶</Text>
          </Pressable>
        </View>

        {/* Crystals List */}
        <View style={styles.crystalsSection}>
          {crystalsToShow.length === 0 ? (
            <View style={styles.emptyState}>
              <Sparkles size={48} color={theme.colors.secondary} />
              <Text style={styles.emptyStateTitle}>还没有成就结晶</Text>
              <Text style={styles.emptyStateText}>
                完成一次完整的对话流程，{'\n'}
                系统会为你生成专属的成就结晶
              </Text>
            </View>
          ) : (
            crystalsToShow.map((crystal, index) => (
              <CrystalCard
                key={crystal.id || index}
                crystal={crystal}
                onPress={() => handleCrystalPress(crystal)}
              />
            ))
          )}
        </View>

        {/* How it works */}
        <View style={styles.howItWorksSection}>
          <Text style={styles.sectionTitle}>成就结晶是什么？</Text>
          <View style={styles.explanationCard}>
            <Text style={styles.explanationText}>
              🌟 每当你完成一次"从困惑到行动"的完整对话{'\n\n'}
              💎 系统会将你的突破过程凝结成一颗专属结晶{'\n\n'}
              📚 包含你的核心洞察、第一步行动和成长记录{'\n\n'}
              🎁 这些结晶是你内在成长的珍贵见证
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
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  statsGradient: {
    flex: 1,
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
  createButton: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    minWidth: 100,
  },
  createButtonText: {
    fontSize: theme.typography.sm,
    fontFamily: theme.typography.semiBold,
    color: theme.colors.accent,
  },
  crystalsSection: {
    marginBottom: theme.spacing.lg,
  },
  emptyState: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing['2xl'],
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  emptyStateTitle: {
    fontSize: theme.typography.lg,
    fontFamily: theme.typography.semiBold,
    color: theme.colors.primary,
  },
  emptyStateText: {
    fontSize: theme.typography.base,
    fontFamily: theme.typography.regular,
    color: theme.colors.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  howItWorksSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.lg,
    fontFamily: theme.typography.semiBold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
  },
  explanationCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
  },
  explanationText: {
    fontSize: theme.typography.sm,
    fontFamily: theme.typography.regular,
    color: theme.colors.secondary,
    lineHeight: 22,
  },
});