import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles, Calendar } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { Crystal } from '@/types';

interface CrystalCardProps {
  crystal: Crystal;
  onPress?: () => void;
}

export const CrystalCard: React.FC<CrystalCardProps> = ({ crystal, onPress }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getGradientColors = (visualType: string) => {
    const gradients = {
      'courage': ['#FFD700', '#FFA500'],
      'wisdom': ['#4A90E2', '#7B68EE'],
      'growth': ['#32CD32', '#228B22'],
      'clarity': ['#FF69B4', '#FF1493'],
      'strength': ['#DC143C', '#B22222'],
      default: ['#FFD700', '#FFA500'],
    };
    
    return gradients[visualType as keyof typeof gradients] || gradients.default;
  };

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <LinearGradient
        colors={getGradientColors(crystal.visual_type)}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Sparkles size={20} color={theme.colors.background} />
            <Text style={styles.title}>{crystal.name}</Text>
          </View>
          
          <Text style={styles.insight} numberOfLines={2}>
            {crystal.key_insight}
          </Text>
          
          <View style={styles.actionContainer}>
            <Text style={styles.actionLabel}>第一步行动:</Text>
            <Text style={styles.action} numberOfLines={1}>
              {crystal.first_action}
            </Text>
          </View>
          
          <View style={styles.footer}>
            <View style={styles.dateContainer}>
              <Calendar size={12} color={theme.colors.background} />
              <Text style={styles.date}>
                {formatDate(crystal.created_at)}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.xs,
  },
  gradient: {
    padding: theme.spacing.md,
  },
  content: {
    gap: theme.spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  title: {
    fontSize: theme.typography.lg,
    fontFamily: theme.typography.semiBold,
    color: theme.colors.background,
    flex: 1,
  },
  insight: {
    fontSize: theme.typography.sm,
    fontFamily: theme.typography.regular,
    color: theme.colors.background,
    opacity: 0.9,
    lineHeight: 18,
  },
  actionContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
  },
  actionLabel: {
    fontSize: theme.typography.xs,
    fontFamily: theme.typography.medium,
    color: theme.colors.background,
    opacity: 0.8,
    marginBottom: theme.spacing.xs,
  },
  action: {
    fontSize: theme.typography.sm,
    fontFamily: theme.typography.medium,
    color: theme.colors.background,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  date: {
    fontSize: theme.typography.xs,
    fontFamily: theme.typography.regular,
    color: theme.colors.background,
    opacity: 0.8,
  },
});