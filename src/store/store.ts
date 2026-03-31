import { configureStore } from "@reduxjs/toolkit"
import uiReducer from "./slices/uiSlice"

export const store = configureStore({
  reducer: {
    ui: uiReducer,
  },
})

// Infer the `RootState`, `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store