import type { ReactNode } from "react"
import { Label } from "@/components/ui/label"
import { Text } from "./heading"

interface FormFieldProps {
  label: string
  required?: boolean
  hint?: string
  error?: string
  htmlFor?: string
  children: ReactNode
}

// Standardized form field — label + required marker + optional hint/error.
// Pages should wrap every input with this so spacing and label styling
// stay consistent.
export function FormField({
  label,
  required,
  hint,
  error,
  htmlFor,
  children,
}: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      {children}
      {hint && !error && (
        <Text size="xs" tone="muted">
          {hint}
        </Text>
      )}
      {error && (
        <Text size="xs" tone="destructive">
          {error}
        </Text>
      )}
    </div>
  )
}
