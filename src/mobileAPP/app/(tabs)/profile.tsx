import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Pressable,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, MessageSquare, Clock, Settings, CircleHelp as HelpCircle, Share2, LogOut, Sparkles } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';

export default function ProfileScreen() {
  const { state } = useAppContext();

  const handleWeChatLogin = () => {
    Alert.alert(
      '微信登录',
      '微信登录功能正在开发中，敬请期待！',
      [{ text: '好的' }]
    );
  };

  const handleSettings = () => {
    Alert.alert(
      '设置',
      '设置功能正在开发中',
      [{ text: '好的' }]
    );
  };

  const handleHelp = () => {
    Alert.alert(
      '帮助与反馈',
      '如有问题或建议，请联系我们：\nsupport@onemind.app',
      [{ text: '好的' }]
    );
  };

  const handleShare = () => {
    Alert.alert(
      '分享应用',
      '邀请朋友一起使用心一，实现知行合一！',
      [{ text: '好的' }]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      '退出登录',
      '确定要退出当前账户吗？',
      [
        { text: '取消', style: 'cancel' },
        { text: '退出', style: 'destructive', onPress: () => {} }
      ]
    );
  };

  // Mock stats
  const stats = {
    totalSessions: 12,
    totalActions: 28,
    totalCrystals: 2,
    daysUsed: 7,
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>我的</Text>
        </View>

        {/* User Info */}
        <View style={styles.userSection}>
          <LinearGradient
            colors={[theme.colors.accent, '#FFE55C']}
            style={styles.userCard}
          >
            <View style={styles.userInfo}>
              <View style={styles.avatar}>
                <User size={32} color={theme.colors.background} />
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>
                  {state.user?.isAnonymous ? '匿名用户' : '微信用户'}
                </Text>
                <Text style={styles.userStatus}>
                  已使用 {stats.daysUsed} 天
                </Text>
              </View>
            </View>
            
            {state.user?.isAnonymous && (
              <Pressable style={styles.loginButton} onPress={handleWeChatLogin}>
                <Text style={styles.loginButtonText}>绑定微信</Text>
              </Pressable>
            )}
          </LinearGradient>
        </View>

        {/* Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>我的数据</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <MessageSquare size={24} color={theme.colors.accent} />
              <Text style={styles.statNumber}>{stats.totalSessions}</Text>
              <Text style={styles.statLabel}>对话次数</Text>
            </View>
            <View style={styles.statCard}>
              <Clock size={24} color={theme.colors.success} />
              <Text style={styles.statNumber}>{stats.totalActions}</Text>
              <Text style={styles.statLabel}>完成行动</Text>
            </View>
            <View style={styles.statCard}>
              <Sparkles size={24} color={theme.colors.warning} />
              <Text style={styles.statNumber}>{stats.totalCrystals}</Text>
              <Text style={styles.statLabel}>成就结晶</Text>
            </View>
          </View>
        </View>

        {/* Menu */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>功能</Text>
          <View style={styles.menuList}>
            <Pressable style={styles.menuItem} onPress={handleSettings}>
              <Settings size={20} color={theme.colors.secondary} />
              <Text style={styles.menuItemText}>设置</Text>
              <Text style={styles.menuItemArrow}>›</Text>
            </Pressable>
            
            <Pressable style={styles.menuItem} onPress={handleHelp}>
              <HelpCircle size={20} color={theme.colors.secondary} />
              <Text style={styles.menuItemText}>帮助与反馈</Text>
              <Text style={styles.menuItemArrow}>›</Text>
            </Pressable>
            
            <Pressable style={styles.menuItem} onPress={handleShare}>
              <Share2 size={20} color={theme.colors.secondary} />
              <Text style={styles.menuItemText}>分享应用</Text>
              <Text style={styles.menuItemArrow}>›</Text>
            </Pressable>
            
            {!state.user?.isAnonymous && (
              <Pressable style={styles.menuItem} onPress={handleLogout}>
                <LogOut size={20} color={theme.colors.error} />
                <Text style={[styles.menuItemText, { color: theme.colors.error }]}>
                  退出登录
                </Text>
                <Text style={styles.menuItemArrow}>›</Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* About */}
        <View style={styles.aboutSection}>
          <Text style={styles.aboutTitle}>关于心一</Text>
          <Text style={styles.aboutText}>
            心一致力于帮助你实现"知行合一"，通过AI引导和微行动实践，
            让你从"知道"到"做到"，在行动中找到内在的平静与力量。
          </Text>
          <Text style={styles.versionText}>版本 1.0.0</Text>
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
  },
  headerTitle: {
    fontSize: theme.typography['2xl'],
    fontFamily: theme.typography.bold,
    color: theme.colors.primary,
  },
  userSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  userCard: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: theme.borderRadius.full,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: theme.typography.lg,
    fontFamily: theme.typography.semiBold,
    color: theme.colors.background,
    marginBottom: theme.spacing.xs,
  },
  userStatus: {
    fontSize: theme.typography.sm,
    fontFamily: theme.typography.regular,
    color: theme.colors.background,
    opacity: 0.8,
  },
  loginButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
  },
  loginButtonText: {
    fontSize: theme.typography.sm,
    fontFamily: theme.typography.semiBold,
    color: theme.colors.background,
  },
  statsSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.lg,
    fontFamily: theme.typography.semiBold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  statNumber: {
    fontSize: theme.typography.xl,
    fontFamily: theme.typography.bold,
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: theme.typography.xs,
    fontFamily: theme.typography.regular,
    color: theme.colors.secondary,
    textAlign: 'center',
  },
  menuSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  menuList: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surface2,
    gap: theme.spacing.md,
  },
  menuItemText: {
    flex: 1,
    fontSize: theme.typography.base,
    fontFamily: theme.typography.medium,
    color: theme.colors.primary,
  },
  menuItemArrow: {
    fontSize: theme.typography.lg,
    color: theme.colors.tertiary,
  },
  aboutSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  aboutTitle: {
    fontSize: theme.typography.lg,
    fontFamily: theme.typography.semiBold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
  },
  aboutText: {
    fontSize: theme.typography.sm,
    fontFamily: theme.typography.regular,
    color: theme.colors.secondary,
    lineHeight: 22,
    marginBottom: theme.spacing.lg,
  },
  versionText: {
    fontSize: theme.typography.xs,
    fontFamily: theme.typography.regular,
    color: theme.colors.tertiary,
    textAlign: 'center',
  },
});