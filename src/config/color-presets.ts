// Color presets — each provides --primary + --primary-foreground + --ring
// values for both light and dark themes. Applied at runtime by ThemeProvider.

export type ColorPreset =
  | "neutral"
  | "blue"
  | "green"
  | "violet"
  | "rose"
  | "orange"

interface ColorTokens {
  primary: string
  primaryForeground: string
  ring: string
}

interface PresetDefinition {
  label: string
  light: ColorTokens
  dark: ColorTokens
}

export const colorPresets: Record<ColorPreset, PresetDefinition> = {
  neutral: {
    label: "Neutral",
    light: {
      primary: "oklch(0.205 0 0)",
      primaryForeground: "oklch(0.985 0 0)",
      ring: "oklch(0.708 0 0)",
    },
    dark: {
      primary: "oklch(0.922 0 0)",
      primaryForeground: "oklch(0.205 0 0)",
      ring: "oklch(0.556 0 0)",
    },
  },
  blue: {
    label: "Blue",
    light: {
      primary: "oklch(0.546 0.215 262.881)",
      primaryForeground: "oklch(0.985 0 0)",
      ring: "oklch(0.546 0.215 262.881)",
    },
    dark: {
      primary: "oklch(0.623 0.214 259.815)",
      primaryForeground: "oklch(0.985 0 0)",
      ring: "oklch(0.623 0.214 259.815)",
    },
  },
  green: {
    label: "Green",
    light: {
      primary: "oklch(0.527 0.154 150.069)",
      primaryForeground: "oklch(0.985 0 0)",
      ring: "oklch(0.527 0.154 150.069)",
    },
    dark: {
      primary: "oklch(0.696 0.17 162.48)",
      primaryForeground: "oklch(0.145 0 0)",
      ring: "oklch(0.696 0.17 162.48)",
    },
  },
  violet: {
    label: "Violet",
    light: {
      primary: "oklch(0.541 0.281 293.009)",
      primaryForeground: "oklch(0.985 0 0)",
      ring: "oklch(0.541 0.281 293.009)",
    },
    dark: {
      primary: "oklch(0.627 0.265 303.9)",
      primaryForeground: "oklch(0.985 0 0)",
      ring: "oklch(0.627 0.265 303.9)",
    },
  },
  rose: {
    label: "Rose",
    light: {
      primary: "oklch(0.586 0.249 17.078)",
      primaryForeground: "oklch(0.985 0 0)",
      ring: "oklch(0.586 0.249 17.078)",
    },
    dark: {
      primary: "oklch(0.645 0.246 16.439)",
      primaryForeground: "oklch(0.985 0 0)",
      ring: "oklch(0.645 0.246 16.439)",
    },
  },
  orange: {
    label: "Orange",
    light: {
      primary: "oklch(0.646 0.222 41.116)",
      primaryForeground: "oklch(0.985 0 0)",
      ring: "oklch(0.646 0.222 41.116)",
    },
    dark: {
      primary: "oklch(0.769 0.188 70.08)",
      primaryForeground: "oklch(0.145 0 0)",
      ring: "oklch(0.769 0.188 70.08)",
    },
  },
}

export const colorPresetList = Object.entries(colorPresets).map(
  ([key, value]) => ({
    key: key as ColorPreset,
    label: value.label,
    swatch: value.light.primary,
  }),
)
