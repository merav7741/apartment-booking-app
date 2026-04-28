import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { AuthState, LoginCredentials, RegisterData, AuthResponse } from '../types/user.types'

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/auth`

const loadAuthFromStorage = (): Pick<AuthState, 'user' | 'token' | 'isAuthenticated'> => {
  const token = localStorage.getItem('token')
  const userStr = localStorage.getItem('user')
  
  if (token && userStr) {
    try {
      const user = JSON.parse(userStr)
      return { user, token, isAuthenticated: true }
    } catch {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }
  
  return { user: null, token: null, isAuthenticated: false }
}

// Login Thunk
export const loginUser = createAsyncThunk<AuthResponse, LoginCredentials>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      })

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data.message || 'שגיאה בהתחברות')
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      return data
    } catch (error) {
      return rejectWithValue('שגיאה בחיבור לשרת')
    }
  }
)

// Register Thunk
export const registerUser = createAsyncThunk<AuthResponse, RegisterData>(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data.message || 'שגיאה ברישום')
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      return data
    } catch (error) {
      return rejectWithValue('שגיאה בחיבור לשרת')
    }
  }
)

const initialState: AuthState = {
  ...loadAuthFromStorage(),
  loading: false,
  error: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      state.error = null
    })
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // Register
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      state.error = null
    })
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })
  }
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
