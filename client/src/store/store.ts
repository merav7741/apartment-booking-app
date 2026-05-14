import { configureStore } from '@reduxjs/toolkit'
import apartmentReducer from './apartmentSlice'
import authReducer from './authSlice'
import bookingReducer from './bookingSlice'

export const store = configureStore({
  reducer: {
    apartments: apartmentReducer,
    auth: authReducer,
    bookings: bookingReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch



