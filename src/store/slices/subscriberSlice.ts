import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export interface Subscriber {
  id: string
  email: string
  name: string
  isActive: boolean
  subscribedAt: string
  unsubscribedAt?: string
}

interface SubscriberState {
  subscribers: Subscriber[]
  loading: boolean
  error: string | null
  totalSubscribers: number
  activeSubscribers: number
}

const initialState: SubscriberState = {
  subscribers: [],
  loading: false,
  error: null,
  totalSubscribers: 0,
  activeSubscribers: 0,
}

// Async thunks
export const fetchSubscribers = createAsyncThunk(
  'subscribers/fetchSubscribers',
  async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600))
    
    // Get from localStorage or return mock data
    const stored = localStorage.getItem('subscribers')
    if (stored) {
      return JSON.parse(stored)
    }
    
    // Return mock data for demo
    return [
      {
        id: '1',
        email: 'maria@email.com',
        name: 'María González',
        isActive: true,
        subscribedAt: '2024-01-10T10:00:00Z'
      },
      {
        id: '2',
        email: 'juan@email.com',
        name: 'Juan Pérez',
        isActive: true,
        subscribedAt: '2024-01-12T14:30:00Z'
      }
    ]
  }
)

export const addSubscriber = createAsyncThunk(
  'subscribers/addSubscriber',
  async (subscriberData: { email: string; name: string }) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const newSubscriber: Subscriber = {
      ...subscriberData,
      id: Date.now().toString(),
      isActive: true,
      subscribedAt: new Date().toISOString()
    }
    
    // Save to localStorage
    const stored = localStorage.getItem('subscribers')
    const subscribers = stored ? JSON.parse(stored) : []
    subscribers.push(newSubscriber)
    localStorage.setItem('subscribers', JSON.stringify(subscribers))
    
    return newSubscriber
  }
)

export const unsubscribeSubscriber = createAsyncThunk(
  'subscribers/unsubscribeSubscriber',
  async (email: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600))
    
    // Update in localStorage
    const stored = localStorage.getItem('subscribers')
    const subscribers = stored ? JSON.parse(stored) : []
    const subscriber = subscribers.find((s: Subscriber) => s.email === email)
    
    if (subscriber) {
      subscriber.isActive = false
      subscriber.unsubscribedAt = new Date().toISOString()
      localStorage.setItem('subscribers', JSON.stringify(subscribers))
      return subscriber
    }
    
    throw new Error('Subscriber not found')
  }
)

export const deleteSubscriber = createAsyncThunk(
  'subscribers/deleteSubscriber',
  async (id: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600))
    
    // Remove from localStorage
    const stored = localStorage.getItem('subscribers')
    const subscribers = stored ? JSON.parse(stored) : []
    const filtered = subscribers.filter((s: Subscriber) => s.id !== id)
    localStorage.setItem('subscribers', JSON.stringify(filtered))
    
    return id
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
      state.activeSubscribers = state.subscribers.filter(sub => sub.isActive).length
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
        state.activeSubscribers = action.payload.filter((sub: Subscriber) => sub.isActive).length
      })
      .addCase(fetchSubscribers.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch subscribers'
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
        state.activeSubscribers += 1
      })
      .addCase(addSubscriber.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to add subscriber'
      })
      // Unsubscribe subscriber
      .addCase(unsubscribeSubscriber.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(unsubscribeSubscriber.fulfilled, (state, action) => {
        state.loading = false
        const subscriber = state.subscribers.find(sub => sub.email === action.payload.email)
        if (subscriber) {
          subscriber.isActive = false
          subscriber.unsubscribedAt = action.payload.unsubscribedAt
          state.activeSubscribers -= 1
        }
      })
      .addCase(unsubscribeSubscriber.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to unsubscribe'
      })
      // Delete subscriber
      .addCase(deleteSubscriber.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteSubscriber.fulfilled, (state, action) => {
        state.loading = false
        const deletedSubscriber = state.subscribers.find(sub => sub.id === action.payload)
        if (deletedSubscriber) {
          state.totalSubscribers -= 1
          if (deletedSubscriber.isActive) {
            state.activeSubscribers -= 1
          }
        }
        state.subscribers = state.subscribers.filter(sub => sub.id !== action.payload)
      })
      .addCase(deleteSubscriber.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to delete subscriber'
      })
  },
})

export const { clearError, updateSubscriberStats } = subscriberSlice.actions
export default subscriberSlice.reducer
