import { configureStore } from '@reduxjs/toolkit'
import apartmentReducer from './apartmentSlice'
import authReducer from './authSlice'

export const store = configureStore({
  reducer: {
    apartments: apartmentReducer,
    auth: authReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
