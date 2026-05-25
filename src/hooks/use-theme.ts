import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { themeSet, type Theme } from "@/redux/features/ui/ui-slice"

export function useTheme() {
  const theme = useAppSelector((s) => s.ui.theme)
  const dispatch = useAppDispatch()
  return {
    theme,
    setTheme: (next: Theme) => dispatch(themeSet(next)),
  }
}
