// Tailwind CSS v4 uses CSS-based configuration
// This file exports shared theme tokens for use in packages
export const theme = {
  colors: {
    primary: {
      50: "#f0fdf4",
      100: "#dcfce7",
      200: "#bbf7d0",
      300: "#86efac",
      400: "#4ade80",
      500: "#22c55e",
      600: "#16a34a",
      700: "#15803d",
      800: "#166534",
      900: "#14532d",
      950: "#052e16",
    },
    gold: {
      50: "#fffbeb",
      100: "#fef3c7",
      200: "#fde68a",
      300: "#fcd34d",
      400: "#fbbf24",
      500: "#f59e0b",
      600: "#d97706",
      700: "#b45309",
      800: "#92400e",
      900: "#78350f",
    },
  },
  fontFamily: {
    arabic: ["KFGQPC Uthmani Hafs", "Scheherazade New", "serif"],
    sans: ["Inter", "SF Pro Display", "SF Pro Text", "-apple-system", "system-ui", "sans-serif"],
  },
} as const;
