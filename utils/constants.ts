/**
 * utils/constants.ts — App-wide constants
 *
 * Single source of truth for:
 *   - Color palette (mirrors tailwind.config.js — keep in sync)
 *   - Spacing / sizing scale
 *   - Typography
 *   - Animation durations
 *   - App config
 *
 * Usage:
 *   import { COLORS, SPACING } from '@/utils/constants';
 *   <View style={{ backgroundColor: COLORS.background }} />
 *
 * Prefer NativeWind className props over inline styles when possible.
 * These constants are most useful for StyleSheet, Animated, or Reanimated values.
 */

// ─── Colors ───────────────────────────────────────────────────────────────────
// Keep in sync with tailwind.config.js → theme.extend.colors

export const COLORS = {
  // Brand
  primary: "#58CC02",       // Green — success, CTAs, XP
  primaryDark: "#46A302",   // Pressed/active green
  secondary: "#1CB0F6",     // Blue — info, links, streaks
  secondaryDark: "#0A8FCF", // Pressed blue

  // Semantic
  error: "#FF4B4B",    // Red — mistakes, health loss
  warning: "#FFC800",  // Yellow/Gold — coins, gems, warnings
  success: "#58CC02",  // Alias for primary

  // Surfaces
  background: "#131F24", // Main app background
  surface: "#1A2E35",    // Cards, modals, inputs
  surfaceAlt: "#243B44", // Elevated surface (popovers)
  border: "#2C4551",     // Subtle borders and dividers

  // Text
  foreground: "#FFFFFF", // Primary text
  muted: "#AFAFAF",      // Secondary / placeholder text

  // Transparent utilities
  overlay: "rgba(0, 0, 0, 0.5)",
  overlayLight: "rgba(0, 0, 0, 0.2)",
} as const;

export type Color = (typeof COLORS)[keyof typeof COLORS];

// ─── Spacing ──────────────────────────────────────────────────────────────────
// Base unit: 4px (matches Tailwind's default scale)

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 48,
  "3xl": 64,
} as const;

// ─── Sizing ───────────────────────────────────────────────────────────────────

export const SIZES = {
  // Minimum accessible touch target (Apple HIG / Android guidelines: 48pt)
  touchTarget: 48,

  // Border radius
  radiusSm: 8,
  radiusMd: 12,
  radiusLg: 16,
  radiusXl: 24,
  radiusFull: 9999,

  // Common icon sizes
  iconSm: 16,
  iconMd: 24,
  iconLg: 32,
} as const;

// ─── Typography ───────────────────────────────────────────────────────────────

export const FONT_SIZE = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
  "4xl": 36,
} as const;

export const FONT_WEIGHT = {
  regular: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
  extrabold: "800" as const,
} as const;

// ─── Animation ────────────────────────────────────────────────────────────────

export const ANIMATION = {
  fast: 150,    // Micro-interactions, button feedback
  normal: 300,  // Standard transitions
  slow: 500,    // Page transitions, celebratory animations
  spring: {
    damping: 15,
    stiffness: 150,
    mass: 1,
  },
} as const;

// ─── App config ───────────────────────────────────────────────────────────────

export const APP_CONFIG = {
  name: "base-template",
  version: "1.0.0",
} as const;
