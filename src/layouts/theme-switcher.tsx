import { Check, Monitor, Moon, Palette, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import {
  colorPresetSet,
  themeSet,
  type Theme,
} from "@/redux/features/ui/ui-slice"
import {
  colorPresetList,
  type ColorPreset,
} from "@/config/color-presets"
import { cn } from "@/lib/utils"

const themeOptions: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
]

export default function ThemeSwitcher() {
  const dispatch = useAppDispatch()
  const theme = useAppSelector((s) => s.ui.theme)
  const colorPreset = useAppSelector((s) => s.ui.colorPreset)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Customize theme">
          <Palette className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        {themeOptions.map(({ value, label, icon: Icon }) => (
          <DropdownMenuItem key={value} onClick={() => dispatch(themeSet(value))}>
            <Icon className="size-4" />
            <span>{label}</span>
            {theme === value && <Check className="ml-auto size-4" />}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuLabel>Accent color</DropdownMenuLabel>
        <div className="grid grid-cols-3 gap-2 p-2">
          {colorPresetList.map(({ key, label, swatch }) => (
            <button
              key={key}
              type="button"
              onClick={() => dispatch(colorPresetSet(key as ColorPreset))}
              className={cn(
                "flex flex-col items-center gap-1 rounded-md border p-2 text-xs transition-colors hover:bg-accent",
                colorPreset === key && "border-primary",
              )}
              aria-label={label}
            >
              <span
                className="size-5 rounded-full ring-2 ring-offset-2 ring-offset-background"
                style={{
                  backgroundColor: swatch,
                  // @ts-expect-error custom property
                  "--tw-ring-color": colorPreset === key ? swatch : "transparent",
                }}
              />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
