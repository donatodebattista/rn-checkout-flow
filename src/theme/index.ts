export const theme = {
  colors: {
    primary: '#3498db',
    background: '#ffffff',
    backgroundAlt: '#f8f8f8',
    textDark: '#1a1a1a',
    textMuted: '#8e8e93',
    highlightBg: '#fff9e6',
    highlightText: '#5c5c5c',
    destructive: '#ff3b30',
    border: '#e8e8e8',
    borderAlt: '#d1d1d6',
    white: '#ffffff',
    buttonDisabled: '#b2daf3',
    cardBg: '#f8f8fa',
    badgeGreen: '#0e9f6e',
  },
  typography: {
    fontFamily: undefined, // System font
    weights: {
      regular: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
    },
    sizes: {
      xs: 11,
      sm: 13,
      base: 15,
      md: 17,
      lg: 19,
      xl: 22,
    },
  },
  borderRadius: {
    sm: 4,
    md: 6,
    lg: 8,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },
};

export type Theme = typeof theme;
