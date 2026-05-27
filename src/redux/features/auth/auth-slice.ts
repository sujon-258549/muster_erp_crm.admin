import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { User } from "@/types/user"
import { baseApi } from "@/redux/api/base-api"
import type { AppDispatch } from "@/redux/store"

export interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    credentialsSet: (
      state,
      action: PayloadAction<{
        user: User
        accessToken: string
        refreshToken: string
      }>,
    ) => {
      state.user = action.payload.user
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
      state.isAuthenticated = true
    },
    tokensRefreshed: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken?: string }>,
    ) => {
      state.accessToken = action.payload.accessToken
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken
      }
    },
    userUpdated: (state, action: PayloadAction<User>) => {
      state.user = action.payload
    },
    loggedOut: (state) => {
      state.user = null
      state.accessToken = null
      state.refreshToken = null
      state.isAuthenticated = false
    },
  },
})

export const { credentialsSet, tokensRefreshed, userUpdated, loggedOut } =
  authSlice.actions
export default authSlice.reducer

// Thunks — use these instead of dispatching `credentialsSet` / `loggedOut`
// directly. They also wipe the RTK Query cache so cached responses from a
// previous user don't leak into the new session.
export const performLogin =
  (payload: { user: User; accessToken: string; refreshToken: string }) =>
  (dispatch: AppDispatch) => {
    // Wipe any cached data from the previous session BEFORE setting new
    // credentials, so the new user fetches everything fresh.
    dispatch(baseApi.util.resetApiState())
    dispatch(credentialsSet(payload))
  }

export const performLogout = () => (dispatch: AppDispatch) => {
  dispatch(loggedOut())
  // Drop every cached query so the next login (or guest view) starts clean.
  dispatch(baseApi.util.resetApiState())
}
