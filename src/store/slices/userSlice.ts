import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiService, handleApiError } from '../../services/api'

export interface User {
  _id: string
  usuario: string
  rol?: 'admin' | 'cliente'
}

interface UserState {
  users: User[]
  loading: boolean
  error: string | null
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
}

// Async thunks
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      return await apiService.getUsers()
    } catch (error) {
      return rejectWithValue(handleApiError(error))
    }
  }
)

export const createUser = createAsyncThunk(
  'users/createUser',
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
    rol?: 'admin' | 'cliente'
  }, { rejectWithValue }) => {
    try {
      const response = await apiService.registerUser(userData)
      return response.user
    } catch (error) {
      return rejectWithValue(handleApiError(error))
    }
  }
)

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async (userData: { id: string; usuario?: string; password?: string; rol?: 'admin' | 'cliente' }, { rejectWithValue }) => {
    try {
      const response = await apiService.updateUserById(userData.id, {
        usuario: userData.usuario,
        password: userData.password,
        rol: userData.rol
      })
      return response.user
    } catch (error) {
      return rejectWithValue(handleApiError(error))
    }
  }
)

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      await apiService.deleteUserById(userId)
      return userId
    } catch (error) {
      return rejectWithValue(handleApiError(error))
    }
  }
)

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.users = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Create user
      .addCase(createUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false
        state.users.push(action.payload)
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false
        const index = state.users.findIndex(user => user._id === action.payload._id)
        if (index !== -1) {
          state.users[index] = action.payload
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false
        state.users = state.users.filter(user => user._id !== action.payload)
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError } = userSlice.actions
export default userSlice.reducer

