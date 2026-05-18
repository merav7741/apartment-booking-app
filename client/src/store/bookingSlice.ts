import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState } from './store'

export interface Booking {
  _id: string
  customerId: { _id: string; name: string; email: string; phone?: string }
  landlordID: { _id: string; name: string; email: string }
  apartmentId: {
    _id: string
    name: string
    price: number
    address: string
  }
  startDate: string
  endDate: string
  totalPrice: number
  numberOfNights: number
  status: 'Canceled' | 'Pending Approval' | 'Approved'
  createdAt: string
  updatedAt: string
}

export interface BookingState {
  myBookings: Booking[]
  incomingBookings: Booking[]
  allBookings: Booking[]
  bookedDates: { start: string; end: string }[]
  loading: boolean
  error: string | null
}

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/orders`

export const createBooking = createAsyncThunk<
  Booking,
  {
    apartmentId: string
    startDate: string
    endDate: string
  },
  { state: RootState }
>('bookings/create', async (data, { rejectWithValue, getState }) => {
  try {
    const token = getState().auth.token
    if (!token) {
      return rejectWithValue('נדרש להתחבר')
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })

    const result = await response.json()
    if (!response.ok) {
      return rejectWithValue(result.message || 'שגיאה ביצירת הזמנה')
    }

    return result
  } catch (error) {
    return rejectWithValue('שגיאה בחיבור לשרת')
  }
})

export const fetchMyBookings = createAsyncThunk<
  Booking[],
  void,
  { state: RootState }
>('bookings/fetchMy', async (_, { rejectWithValue, getState }) => {
  try {
    const token = getState().auth.token
    if (!token) {
      return rejectWithValue('נדרש להתחבר')
    }

    const response = await fetch(`${API_URL}/by-customer`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      return rejectWithValue('שגיאה בטעינת הזמנות')
    }

    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    return rejectWithValue('שגיאה בחיבור לשרת')
  }
})

export const fetchIncomingBookings = createAsyncThunk<
  Booking[],
  void,
  { state: RootState }
>('bookings/fetchIncoming', async (_, { rejectWithValue, getState }) => {
  try {
    const token = getState().auth.token
    if (!token) {
      return rejectWithValue('נדרש להתחבר')
    }

    const response = await fetch(`${API_URL}/by-landlord`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      return rejectWithValue('שגיאה בטעינת הזמנות')
    }

    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    return rejectWithValue('שגיאה בחיבור לשרת')
  }
})

export const fetchBookedDates = createAsyncThunk<
  { start: string; end: string }[],
  string
>('bookings/fetchBookedDates', async (apartmentId, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/booked-dates/${apartmentId}`)

    if (!response.ok) {
      return rejectWithValue('שגיאה בטעינת תאריכים תפוסים')
    }

    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    return rejectWithValue('שגיאה בחיבור לשרת')
  }
})

export const fetchAllBookings = createAsyncThunk<
  Booking[],
  void,
  { state: RootState }
>('bookings/fetchAll', async (_, { rejectWithValue, getState }) => {
  try {
    const token = getState().auth.token
    if (!token) {
      return rejectWithValue('נדרש להתחבר')
    }

    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (!response.ok) {
      return rejectWithValue('שגיאה בטעינת כל ההזמנות')
    }

    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    return rejectWithValue('שגיאה בחיבור לשרת')
  }
})

export const updateBookingStatus = createAsyncThunk<
  Booking,
  { bookingId: string; status: string },
  { state: RootState }
>('bookings/updateStatus', async ({ bookingId, status }, { rejectWithValue, getState }) => {
  try {
    const token = getState().auth.token
    if (!token) {
      return rejectWithValue('נדרש להתחבר')
    }

    const response = await fetch(`${API_URL}/${bookingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    })

    const result = await response.json()
    if (!response.ok) {
      return rejectWithValue(result.message || 'שגיאה בעדכון הזמנה')
    }

    return result
  } catch (error) {
    return rejectWithValue('שגיאה בחיבור לשרת')
  }
})

const initialState: BookingState = {
  myBookings: [],
  incomingBookings: [],
  allBookings: [],
  bookedDates: [],
  loading: false,
  error: null
}

const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false
        state.myBookings.push(action.payload)
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    builder
      .addCase(fetchMyBookings.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.loading = false
        state.myBookings = action.payload
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    builder
      .addCase(fetchIncomingBookings.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchIncomingBookings.fulfilled, (state, action) => {
        state.loading = false
        state.incomingBookings = action.payload
      })
      .addCase(fetchIncomingBookings.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    builder
      .addCase(fetchBookedDates.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBookedDates.fulfilled, (state, action) => {
        state.loading = false
        state.bookedDates = action.payload
      })
      .addCase(fetchBookedDates.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    builder
      .addCase(fetchAllBookings.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllBookings.fulfilled, (state, action) => {
        state.loading = false
        state.allBookings = action.payload
      })
      .addCase(fetchAllBookings.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    builder
      .addCase(updateBookingStatus.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        state.loading = false
        const incomingIndex = state.incomingBookings.findIndex((b) => b._id === action.payload._id)
        if (incomingIndex !== -1) {
          state.incomingBookings[incomingIndex] = action.payload
        }
        const myIndex = state.myBookings.findIndex((b) => b._id === action.payload._id)
        if (myIndex !== -1) {
          state.myBookings[myIndex] = action.payload
        }
      })
      .addCase(updateBookingStatus.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export const { clearError } = bookingSlice.actions
export default bookingSlice.reducer
