import { configureStore } from '@reduxjs/toolkit'
import securityReducer from '../features/security/securitySlice'

export const store = configureStore({
  reducer: {
    security: securityReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch