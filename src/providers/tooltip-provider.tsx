import { TooltipProvider as RadixTooltipProvider } from "@/components/ui/tooltip"
import type { ReactNode } from "react"

interface Props {
  children: ReactNode
}

export function TooltipProvider({ children }: Props) {
  return <RadixTooltipProvider delayDuration={150}>{children}</RadixTooltipProvider>
}
