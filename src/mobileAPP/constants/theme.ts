export const theme = {
  colors: {
    // Base colors
    background: '#121212',
    surface: '#1E1E1E',
    surface2: '#2A2A2A',
    
    // Text colors
    primary: '#E0E0E0',
    secondary: '#A0A0A0',
    tertiary: '#666666',
    
    // Accent colors
    accent: '#FFD700',
    accentSoft: '#FFF9C4',
    
    // System colors
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    
    // AI assistant colors
    aiBackground: '#2A2A3E',
    aiText: '#B8B8D4',
    
    // User message colors
    userBackground: '#FFD700',
    userText: '#121212',
  },
  
  typography: {
    // Font families
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semiBold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
    
    // Sizes
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
  },
  
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
} as const;