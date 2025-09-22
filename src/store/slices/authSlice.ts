import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

// Mock admin user for demo purposes
const MOCK_ADMIN = {
  id: '1',
  email: 'admin@volabarato.com',
  name: 'Administrador',
  role: 'admin' as const
}

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Simple authentication logic
    if (email === 'admin@volabarato.com' && password === 'admin123') {
      const user = MOCK_ADMIN
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(user))
      return user
    } else {
      throw new Error('Credenciales inválidas')
    }
  }
)

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    // Remove from localStorage
    localStorage.removeItem('user')
  }
)

export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async () => {
    // Check localStorage for existing user
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        return JSON.parse(userStr) as User
      } catch {
        localStorage.removeItem('user')
        return null
      }
    }
    return null
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Error en el login'
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.isAuthenticated = false
        state.error = null
      })
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = !!action.payload
      })
  },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer
