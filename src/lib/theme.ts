import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    tokens: {
      fonts: {
        heading: { value: "var(--font-geist-sans), system-ui, sans-serif" },
        body: { value: "var(--font-geist-sans), system-ui, sans-serif" },
        mono: { value: "monospace" },
      },
      colors: {
        brand: {
          subtle: { value: "#f0fdf4" },
          default: { value: "#1fb355" },
          hover: { value: "#16a34a" },
          disabled: { value: "#a7f3d0" },
        },
        accent: {
          subtle: { value: "#eff6ff" },
          default: { value: "#3483fa" },
          hover: { value: "#2563eb" },
          disabled: { value: "#93c5fd" },
        },
        secondary: {
          default: { value: "#f59e0b" },
        },
        neutral: {
          50: { value: "#fafafa" },
          100: { value: "#e0e0e0" },
          200: { value: "#c6c5c5" },
          400: { value: "#958e8e" },
          600: { value: "#615858" },
          900: { value: "#0f0d0d" },
        },
        canvas: {
          default: { value: "#eff3f6" },
        },
        feedback: {
          success: { value: "#16a34a" },
          warning: { value: "#d00416" },
          error: { value: "#d00416" },
          info: { value: "#3483fa" },
        },
      },
      fontSizes: {
        xs: { value: "0.75rem" },
        sm: { value: "0.875rem" },
        md: { value: "1rem" },
        lg: { value: "1.25rem" },
        xl: { value: "1.5rem" },
      },
      fontWeights: {
        normal: { value: 400 },
        medium: { value: 500 },
        bold: { value: 700 },
      },
      spacing: {
        1: { value: "4px" },
        2: { value: "8px" },
        3: { value: "12px" },
        4: { value: "16px" },
        5: { value: "20px" },
        6: { value: "24px" },
        8: { value: "32px" },
        9: { value: "36px" },
        12: { value: "48px" },
      },
      radii: {
        sm: { value: "4px" },
        md: { value: "8px" },
        lg: { value: "12px" },
        full: { value: "9999px" },
      },
      shadows: {
        base: { value: "0 2px 12px 0 rgba(0,0,0,0.10)" },
        focus: { value: "0 0 0 2px rgba(34, 197, 94, 0.35)" },
      },
    },
    semanticTokens: {
      colors: {
        bg: {
          canvas: { value: "{colors.canvas.default}" },
          card: { value: "white" },
          muted: { value: "{colors.neutral.50}" },
        },
        fg: {
          DEFAULT: { value: "{colors.neutral.900}" },
          muted: { value: "{colors.neutral.600}" },
          subtle: { value: "{colors.neutral.400}" },
          inverted: { value: "white" },
        },
        border: {
          subtle: { value: "{colors.neutral.100}" },
          DEFAULT: { value: "{colors.neutral.200}" },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
