import { configureStore } from "@reduxjs/toolkit"
import {
  persistReducer,
  persistStore,
  createMigrate,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  type PersistedState,
} from "redux-persist"
import { setupListeners } from "@reduxjs/toolkit/query"
import { rootReducer } from "./root-reducer"
import { baseApi } from "./api/base-api"
import { storage } from "./storage"
import { authCookieSync } from "./middleware/auth-cookie-sync"
import { tokensRefreshed } from "./features/auth/auth-slice"
import { COOKIE, getCookie } from "@/lib/cookies"

const CURRENT_VERSION = 5

// Schema-change migrations. Bumping CURRENT_VERSION + adding an entry here
// safely resets stale persisted state from older clients (e.g. when the
// auth slice replaced `token` with `accessToken` + `refreshToken`, or when
// the ui slice gained `colorPreset`).
const migrations = {
  2: (state: PersistedState) => {
    if (!state) return state
    return {
      ...state,
      auth: {
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
      },
    }
  },
  3: (state: PersistedState) => {
    if (!state) return state
    const prev = state as PersistedState & { ui?: Record<string, unknown> }
    const prevUi = prev.ui ?? {}
    return {
      ...state,
      ui: {
        theme: "system",
        sidebarOpen: true,
        ...prevUi,
        colorPreset:
          typeof prevUi.colorPreset === "string"
            ? prevUi.colorPreset
            : "neutral",
      },
    }
  },
  4: (state: PersistedState) => {
    if (!state) return state
    const prev = state as PersistedState & { ui?: Record<string, unknown> }
    const prevUi = prev.ui ?? {}
    return {
      ...state,
      ui: {
        ...prevUi,
        theme: "light",
      },
    }
  },
  5: (state: PersistedState) => {
    if (!state) return state
    // User shape changed: added `permissions: ModuleKey[]` + new "super-admin"
    // role. Existing sessions are reset so users re-authenticate cleanly.
    return {
      ...state,
      auth: {
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
      },
    }
  },
}

const persistConfig = {
  key: "muster-root",
  version: CURRENT_VERSION,
  storage,
  whitelist: ["auth", "ui"],
  migrate: createMigrate(migrations, { debug: import.meta.env.DEV }),
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .prepend(authCookieSync.middleware)
      .concat(baseApi.middleware),
  devTools: import.meta.env.DEV,
})

export const persistor = persistStore(store, undefined, () => {
  // After rehydration: if the persisted refreshToken is missing but the
  // cookie still holds one, hydrate state from the cookie (single source
  // of truth for refresh credentials).
  const cookieRefresh = getCookie(COOKIE.REFRESH_TOKEN)
  const currentState = store.getState()
  if (cookieRefresh && !currentState.auth.refreshToken) {
    store.dispatch(tokensRefreshed({
      accessToken: currentState.auth.accessToken ?? "",
      refreshToken: cookieRefresh,
    }))
  }
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
