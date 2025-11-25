import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiService, LoginRequest, handleApiError } from '../../services/api'

interface User {
  _id: string
  usuario: string
  rol?: 'admin' | 'cliente'
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
        usuario: tokenPayload.usuario,
        rol: tokenPayload.rol || 'cliente'
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

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: {
    usuario: string
    password: string
    nombreLegal: string
    fechaNacimiento: string
    nacionalidad: string
    dni: string
    cuilCuit?: string
    numeroPasaporte: string
    telefono: string
    telefonoContacto: string
    email: string
  }, { rejectWithValue }) => {
    try {
      const response = await apiService.registerUser(userData)
      return response.user
    } catch (error) {
      return rejectWithValue(handleApiError(error))
    }
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
          usuario: tokenPayload.usuario,
          rol: tokenPayload.rol || 'cliente'
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
        // Usar el mensaje de error de rejectWithValue si está disponible
        state.error = (action.payload as string) || action.error.message || 'Error en el login'
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.isAuthenticated = false
        state.error = null
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false
        state.error = null
        // No autenticamos automáticamente después del registro
        // El usuario debe iniciar sesión
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = !!action.payload
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.user = null
        state.isAuthenticated = false
        state.loading = false
      })
  },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer
