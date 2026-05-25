import type { ReactNode } from "react"
import ErrorBoundary from "@/components/common/error-boundary"
import { ReduxProvider } from "./redux-provider"
import { ThemeProvider } from "./theme-provider"
import { AuthProvider } from "./auth-provider"
import { TooltipProvider } from "./tooltip-provider"
import { ToastProvider } from "./toast-provider"

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ErrorBoundary>
      <ReduxProvider>
        <ThemeProvider>
          <AuthProvider>
            <TooltipProvider>
              {children}
              <ToastProvider />
            </TooltipProvider>
          </AuthProvider>
        </ThemeProvider>
      </ReduxProvider>
    </ErrorBoundary>
  )
}
