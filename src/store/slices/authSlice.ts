import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { apiService, LoginRequest, LoginResponse, handleApiError } from '../../services/api'

interface User {
  _id: string
  usuario: string
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

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await apiService.login(credentials)
      
      // Decodificar el token para obtener información del usuario
      const tokenPayload = JSON.parse(atob(response.token.split('.')[1]))
      
      const user: User = {
        _id: tokenPayload._id,
        usuario: tokenPayload.usuario
      }
      
      return user
    } catch (error) {
      return rejectWithValue(handleApiError(error))
    }
  }
)

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    await apiService.logout()
  }
)

export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async () => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        // Decodificar el token para obtener información del usuario
        const tokenPayload = JSON.parse(atob(token.split('.')[1]))
        
        // Verificar si el token no ha expirado
        if (tokenPayload.exp && tokenPayload.exp < Date.now() / 1000) {
          localStorage.removeItem('token')
          return null
        }
        
        const user: User = {
          _id: tokenPayload._id,
          usuario: tokenPayload.usuario
        }
        
        return user
      } catch (error) {
        localStorage.removeItem('token')
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
