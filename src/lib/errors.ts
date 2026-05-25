// Shared helper for extracting a human-readable message from an RTK Query
// (or thrown) error. Avoids `(err as any).data.message` sprinkled everywhere.

interface MessageData {
  message?: unknown
}

interface ErrorWithDataMessage {
  data?: MessageData
}

export function getErrorMessage(err: unknown, fallback: string): string {
  if (typeof err === "string") return err
  if (err && typeof err === "object") {
    const e = err as ErrorWithDataMessage & { message?: unknown }
    if (typeof e.data?.message === "string") return e.data.message
    if (typeof e.message === "string") return e.message
  }
  return fallback
}
