/** @type {import('tailwindcss').Config} */
module.exports = {
  // Tell Tailwind where to look for class names so unused styles get purged
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./hooks/**/*.{js,jsx,ts,tsx}",
  ],

  // nativewind/preset converts Tailwind utilities to React Native-compatible values
  presets: [require("nativewind/preset")],

  theme: {
    extend: {
      colors: {
        // ─── Brand palette (Duolingo-inspired) ───────────────────────────
        // Use these as: className="bg-primary text-background"

        primary: "#58CC02",   // Green — success, CTAs, XP
        secondary: "#1CB0F6", // Blue — info, links, streaks
        error: "#FF4B4B",     // Red — mistakes, health loss
        warning: "#FFC800",   // Yellow/Gold — warnings, coins, gems

        // ─── Surfaces & text ─────────────────────────────────────────────
        background: "#001d3d", // Deep navy — main app background
        surface: "#1A2E35",    // Slightly lighter — cards, modals, inputs

        // Text colors (use as text-foreground, text-muted)
        foreground: "#FFFFFF",  // Primary text
        muted: "#AFAFAF",       // Secondary / placeholder text

        // ─── Semantic shades (useful for hover/active states) ─────────────
        "primary-dark": "#46A302",   // Pressed green
        "secondary-dark": "#0A8FCF", // Pressed blue
        "surface-alt": "#243B44",    // Elevated surface (popovers, tooltips)
        border: "#2C4551",           // Subtle borders and dividers
      },

      // Spacing scale extensions — add any custom values here
      // spacing: { 18: '4.5rem' }

      // Border radius presets
      borderRadius: {
        "4xl": "2rem",
      },

      // Font families — add after loading with expo-font
      // fontFamily: {
      //   sans: ['Nunito_400Regular'],
      //   bold: ['Nunito_700Bold'],
      // }
    },
  },

  plugins: [],
};
