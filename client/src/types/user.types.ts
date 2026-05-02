export interface User {
  _id: string
  name: string
  email: string
  phone: string
  role: 'Guest' | 'Subscriber' | 'Admin'
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  phone: string
  password: string
  role: string
  adminCode?: string
}

export interface AuthResponse {
  token: string
  user: User
}
