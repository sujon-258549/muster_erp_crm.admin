import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { ColorPreset } from "@/config/color-presets"

export type Theme = "light" | "dark" | "system"

export interface UIState {
  theme: Theme
  colorPreset: ColorPreset
  sidebarOpen: boolean
}

const initialState: UIState = {
  theme: "light",
  colorPreset: "neutral",
  sidebarOpen: true,
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    themeSet: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload
    },
    colorPresetSet: (state, action: PayloadAction<ColorPreset>) => {
      state.colorPreset = action.payload
    },
    sidebarToggled: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    sidebarSet: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },
  },
})

export const { themeSet, colorPresetSet, sidebarToggled, sidebarSet } =
  uiSlice.actions
export default uiSlice.reducer
