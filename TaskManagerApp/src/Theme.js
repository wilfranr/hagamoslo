// Theme configuration for the TaskManagerApp
// Provides colors, fonts and base shadow for a minimal neumorphic style

export const theme = {
  // Color palette used across the application
  colors: {
    // Main accent color for buttons or highlights
    primary: '#7CB9E8',

    // Background colors for light and dark mode
    background: {
      light: '#F0F2F5',
      dark: '#303437',
    },

    // Base surface color for cards and list items
    card: '#FFFFFF',

    // Text colors
    textPrimary: '#222222',
    textSecondary: '#555555',

    // Accent color for floating buttons or checkboxes
    accent: '#5A9BD5',
  },

  // Font family and sizes using a modern sans-serif font
  fonts: {
    family: 'Poppins',
    size: {
      title: 22,
      body: 16,
      caption: 12,
    },
  },

  // Base shadow for a subtle neumorphic effect
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
};

// Helper to build a neumorphic style with custom background
export const getNeumorphicStyle = (bgColor) => ({
  backgroundColor: bgColor,
  borderRadius: 12,
  shadowColor: '#000',
  shadowOffset: { width: 4, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 6,
  elevation: 5,
});
