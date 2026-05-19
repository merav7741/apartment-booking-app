import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { Apartment, ApartmentState } from '../types/apartment.types'
import type { RootState } from './store'
const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/apartments`

export const fetchAllApartments = createAsyncThunk<Apartment[]>(
  'apartments/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL)
      if (!response.ok) {
        return rejectWithValue('שגיאה בטעינת דירות')
      }
      const data = await response.json()
      return Array.isArray(data) ? data : []
    } catch (error) {
      return rejectWithValue('שגיאה בחיבור לשרת')
    }
  }
)



export const fetchMyApartments = createAsyncThunk<Apartment[], void, { state: RootState }>(
  'apartments/fetchMy',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token
      console.log('🔍 Token from Redux:', token) 
      if (!token) {
        return rejectWithValue('נדרש להתחבר')
      }
      
      const response = await fetch(`${API_URL}/my-apartments`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        return rejectWithValue('שגיאה בטעינת הדירות שלך')
      }
      
      const data = await response.json()
      return Array.isArray(data) ? data : []
    } catch (error) {
      return rejectWithValue('שגיאה בחיבור לשרת')
    }
  }
)

const initialState: ApartmentState = {
  allApartments: [],
  myApartments: [],
  currentApartment: null,
  loading: false,
  error: null
}

const apartmentSlice = createSlice({
  name: 'apartments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCurrentApartment: (state, action) => {
      state.currentApartment = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllApartments.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(fetchAllApartments.fulfilled, (state, action) => {
      state.loading = false
      state.allApartments = action.payload
    })
    builder.addCase(fetchAllApartments.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })
    
    builder.addCase(fetchMyApartments.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(fetchMyApartments.fulfilled, (state, action) => {
      state.loading = false
      state.myApartments = action.payload
    })
    builder.addCase(fetchMyApartments.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })
  }
})

export const { clearError, setCurrentApartment } = apartmentSlice.actions
export default apartmentSlice.reducer
