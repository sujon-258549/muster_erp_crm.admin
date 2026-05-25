import { Component, type ErrorInfo, type ReactNode } from "react"
import { Button } from "@/components/ui/button"

interface State {
  hasError: boolean
  error?: Error
}

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary:", error, info)
  }

  reset = () => this.setState({ hasError: false, error: undefined })

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div className="grid min-h-[60vh] place-items-center p-6 text-center">
          <div className="max-w-md space-y-4">
            <h2 className="text-2xl font-semibold">Something went wrong</h2>
            <p className="text-sm text-muted-foreground">
              {this.state.error?.message ?? "An unexpected error occurred."}
            </p>
            <Button onClick={this.reset}>Try again</Button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
