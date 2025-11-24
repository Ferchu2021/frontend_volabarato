import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiService, Suscriptor, CreateSuscriptorRequest, UpdateSuscriptorRequest } from '../../services/api'

// Usar la interfaz del backend
export type Subscriber = Suscriptor

interface SubscriberState {
  subscribers: Subscriber[]
  loading: boolean
  error: string | null
  totalSubscribers: number
  activeSubscribers: number
  stats: {
    totalSuscriptores: number
    suscriptoresActivos: number
    suscriptoresInactivos: number
    porPais: any[]
  } | null
}

const initialState: SubscriberState = {
  subscribers: [],
  loading: false,
  error: null,
  totalSubscribers: 0,
  activeSubscribers: 0,
  stats: null,
}

// Async thunks - Conectados con el backend real
export const fetchSubscribers = createAsyncThunk(
  'subscribers/fetchSubscribers',
  async (params: { activo?: boolean; limit?: number; page?: number } | undefined = undefined, { rejectWithValue }) => {
    try {
      const response = await apiService.getSuscriptores(params)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al cargar suscriptores')
    }
  }
)

export const addSubscriber = createAsyncThunk(
  'subscribers/addSubscriber',
  async (subscriberData: CreateSuscriptorRequest, { rejectWithValue }) => {
    try {
      const response = await apiService.createSuscriptor(subscriberData)
      return response.suscriptor
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al agregar suscriptor')
    }
  }
)

export const updateSubscriber = createAsyncThunk(
  'subscribers/updateSubscriber',
  async ({ id, data }: { id: string; data: UpdateSuscriptorRequest }, { rejectWithValue }) => {
    try {
      const response = await apiService.updateSuscriptor(id, data)
      return response.suscriptor
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al actualizar suscriptor')
    }
  }
)

export const unsubscribeSubscriber = createAsyncThunk(
  'subscribers/unsubscribeSubscriber',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiService.desuscribirSuscriptor(id)
      return response.suscriptor
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al desuscribir')
    }
  }
)

export const deleteSubscriber = createAsyncThunk(
  'subscribers/deleteSubscriber',
  async (id: string, { rejectWithValue }) => {
    try {
      await apiService.deleteSuscriptor(id)
      return id
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al eliminar suscriptor')
    }
  }
)

export const fetchSubscriberStats = createAsyncThunk(
  'subscribers/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const stats = await apiService.getSuscriptoresStats()
      return stats
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al cargar estadísticas')
    }
  }
)

const subscriberSlice = createSlice({
  name: 'subscribers',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    updateSubscriberStats: (state) => {
      state.totalSubscribers = state.subscribers.length
      state.activeSubscribers = state.subscribers.filter(sub => sub.activo).length
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch subscribers
      .addCase(fetchSubscribers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSubscribers.fulfilled, (state, action) => {
        state.loading = false
        state.subscribers = action.payload
        state.totalSubscribers = action.payload.length
        state.activeSubscribers = action.payload.filter((sub: Subscriber) => sub.activo).length
      })
      .addCase(fetchSubscribers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string || 'Failed to fetch subscribers'
      })
      // Add subscriber
      .addCase(addSubscriber.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addSubscriber.fulfilled, (state, action) => {
        state.loading = false
        state.subscribers.push(action.payload)
        state.totalSubscribers += 1
        if (action.payload.activo) {
          state.activeSubscribers += 1
        }
      })
      .addCase(addSubscriber.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string || 'Failed to add subscriber'
      })
      // Update subscriber
      .addCase(updateSubscriber.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateSubscriber.fulfilled, (state, action) => {
        state.loading = false
        const index = state.subscribers.findIndex(sub => sub._id === action.payload._id)
        if (index !== -1) {
          const wasActive = state.subscribers[index].activo
          const isActive = action.payload.activo
          state.subscribers[index] = action.payload
          if (wasActive && !isActive) {
            state.activeSubscribers -= 1
          } else if (!wasActive && isActive) {
            state.activeSubscribers += 1
          }
        }
      })
      .addCase(updateSubscriber.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string || 'Failed to update subscriber'
      })
      // Unsubscribe subscriber
      .addCase(unsubscribeSubscriber.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(unsubscribeSubscriber.fulfilled, (state, action) => {
        state.loading = false
        const index = state.subscribers.findIndex(sub => sub._id === action.payload._id)
        if (index !== -1) {
          state.subscribers[index] = action.payload
          if (state.subscribers[index].activo === false) {
            state.activeSubscribers -= 1
          }
        }
      })
      .addCase(unsubscribeSubscriber.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string || 'Failed to unsubscribe'
      })
      // Delete subscriber
      .addCase(deleteSubscriber.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteSubscriber.fulfilled, (state, action) => {
        state.loading = false
        const deletedSubscriber = state.subscribers.find(sub => sub._id === action.payload)
        if (deletedSubscriber) {
          state.totalSubscribers -= 1
          if (deletedSubscriber.activo) {
            state.activeSubscribers -= 1
          }
        }
        state.subscribers = state.subscribers.filter(sub => sub._id !== action.payload)
      })
      .addCase(deleteSubscriber.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string || 'Failed to delete subscriber'
      })
      // Fetch stats
      .addCase(fetchSubscriberStats.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSubscriberStats.fulfilled, (state, action) => {
        state.loading = false
        state.stats = action.payload
      })
      .addCase(fetchSubscriberStats.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string || 'Failed to fetch stats'
      })
  },
})

export const { clearError, updateSubscriberStats } = subscriberSlice.actions
export default subscriberSlice.reducer
