// Lightweight cookie helpers. Used for storing the refresh token so it
// outlives a page reload without sitting in localStorage. NOTE: a JS-set
// cookie cannot be HttpOnly — for that the backend must use Set-Cookie.
//
// Defaults: 7-day expiry, path=/, SameSite=Lax, Secure in production.

interface SetCookieOptions {
  days?: number
  path?: string
  sameSite?: "Strict" | "Lax" | "None"
  secure?: boolean
}

const isProd = import.meta.env.PROD

export function setCookie(
  name: string,
  value: string,
  opts: SetCookieOptions = {},
): void {
  const { days = 7, path = "/", sameSite = "Lax", secure = isProd } = opts

  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)

  const segments = [
    `${name}=${encodeURIComponent(value)}`,
    `expires=${expires.toUTCString()}`,
    `path=${path}`,
    `SameSite=${sameSite}`,
  ]
  if (secure) segments.push("Secure")

  document.cookie = segments.join("; ")
}

export function getCookie(name: string): string | null {
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name.replace(/[.$?*|{}()[\]\\/+^]/g, "\\$&")}=([^;]*)`),
  )
  return match ? decodeURIComponent(match[1]) : null
}

export function deleteCookie(name: string, path = "/"): void {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`
}

// Centralized cookie names — single source of truth.
export const COOKIE = {
  REFRESH_TOKEN: "refresh_token",
} as const
