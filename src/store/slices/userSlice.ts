import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiService, handleApiError } from '../../services/api'

export interface User {
  _id: string
  usuario: string
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
  async (userData: { usuario: string; password: string }, { rejectWithValue }) => {
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
  async (userData: Partial<{ usuario: string }>, { rejectWithValue }) => {
    try {
      const response = await apiService.updateCurrentUser(userData)
      return response.user
    } catch (error) {
      return rejectWithValue(handleApiError(error))
    }
  }
)

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (_, { rejectWithValue }) => {
    try {
      await apiService.deleteCurrentUser()
      return true
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
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user._id === action.payload._id)
        if (index !== -1) {
          state.users[index] = action.payload
        }
      })
      // Delete user
      .addCase(deleteUser.fulfilled, (state) => {
        state.loading = false
      })
  },
})

export const { clearError } = userSlice.actions
export default userSlice.reducer

