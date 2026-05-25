import { useEffect, type ReactNode } from "react"
import { useAppSelector } from "@/redux/hooks"
import { colorPresets, type ColorPreset } from "@/config/color-presets"
import type { Theme } from "@/redux/features/ui/ui-slice"

interface ThemeProviderProps {
  children: ReactNode
}

const DEFAULT_PRESET: ColorPreset = "neutral"

const resolveTheme = (theme: Theme): "light" | "dark" =>
  theme === "system"
    ? window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
    : theme

const resolvePreset = (preset: ColorPreset | undefined): ColorPreset =>
  preset && preset in colorPresets ? preset : DEFAULT_PRESET

export function ThemeProvider({ children }: ThemeProviderProps) {
  const theme = useAppSelector((s) => s.ui?.theme ?? "system")
  const colorPreset = useAppSelector((s) => s.ui?.colorPreset)

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    const resolved = resolveTheme(theme)
    root.classList.add(resolved)
  }, [theme])

  useEffect(() => {
    const root = window.document.documentElement
    const resolved = resolveTheme(theme)
    const preset = resolvePreset(colorPreset)
    const tokens = colorPresets[preset][resolved]
    root.style.setProperty("--primary", tokens.primary)
    root.style.setProperty("--primary-foreground", tokens.primaryForeground)
    root.style.setProperty("--ring", tokens.ring)
    root.style.setProperty("--sidebar-primary", tokens.primary)
    root.style.setProperty("--sidebar-primary-foreground", tokens.primaryForeground)
    root.style.setProperty("--sidebar-ring", tokens.ring)
  }, [theme, colorPreset])

  return <>{children}</>
}
