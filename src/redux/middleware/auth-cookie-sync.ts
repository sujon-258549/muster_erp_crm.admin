import { createListenerMiddleware, isAnyOf, type PayloadAction } from "@reduxjs/toolkit"
import {
  credentialsSet,
  loggedOut,
  tokensRefreshed,
} from "@/redux/features/auth/auth-slice"
import { COOKIE, deleteCookie, setCookie } from "@/lib/cookies"

// Mirrors the auth.refreshToken value into a browser cookie. accessToken
// is intentionally kept in memory + sent via the Authorization header.

type SyncAction = PayloadAction<{ refreshToken?: string }>

export const authCookieSync = createListenerMiddleware()

authCookieSync.startListening({
  matcher: isAnyOf(credentialsSet, tokensRefreshed),
  effect: (action) => {
    const refreshToken = (action as SyncAction).payload?.refreshToken
    if (typeof refreshToken === "string" && refreshToken.length > 0) {
      setCookie(COOKIE.REFRESH_TOKEN, refreshToken)
    }
  },
})

authCookieSync.startListening({
  matcher: loggedOut.match,
  effect: () => {
    deleteCookie(COOKIE.REFRESH_TOKEN)
  },
})
