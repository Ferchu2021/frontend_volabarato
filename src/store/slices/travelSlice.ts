import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

export interface Travel {
  id: string
  title: string
  destination: string
  description: string
  price: number
  duration: string
  departureDate: string
  returnDate: string
  image: string
  category: string
  maxTravelers: number
  availableSpots: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface TravelState {
  travels: Travel[]
  loading: boolean
  error: string | null
  selectedTravel: Travel | null
  filters: {
    destination: string
    category: string
    minPrice: number
    maxPrice: number
    departureDate: string
  }
}

const initialState: TravelState = {
  travels: [],
  loading: false,
  error: null,
  selectedTravel: null,
  filters: {
    destination: '',
    category: '',
    minPrice: 0,
    maxPrice: 10000,
    departureDate: '',
  },
}

// Async thunks
export const fetchTravels = createAsyncThunk(
  'travels/fetchTravels',
  async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Get from localStorage or return mock data
    const stored = localStorage.getItem('travels')
    if (stored) {
      return JSON.parse(stored)
    }
    
    // Return mock data for demo
    return [
      {
        id: '1',
        title: 'Aventura en Bariloche',
        destination: 'Bariloche, Argentina',
        description: 'Disfruta de la nieve y los lagos de Bariloche',
        price: 45000,
        duration: '5 días / 4 noches',
        departureDate: '2024-07-15',
        returnDate: '2024-07-19',
        image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500',
        category: 'Aventura',
        maxTravelers: 20,
        availableSpots: 15,
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        title: 'Playa en Cancún',
        destination: 'Cancún, México',
        description: 'Relájate en las hermosas playas del Caribe',
        price: 65000,
        duration: '7 días / 6 noches',
        departureDate: '2024-08-20',
        returnDate: '2024-08-26',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500',
        category: 'Playa',
        maxTravelers: 25,
        availableSpots: 20,
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      }
    ]
  }
)

export const createTravel = createAsyncThunk(
  'travels/createTravel',
  async (travelData: Omit<Travel, 'id' | 'createdAt' | 'updatedAt'>) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newTravel: Travel = {
      ...travelData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    // Save to localStorage
    const stored = localStorage.getItem('travels')
    const travels = stored ? JSON.parse(stored) : []
    travels.push(newTravel)
    localStorage.setItem('travels', JSON.stringify(travels))
    
    return newTravel
  }
)

export const updateTravel = createAsyncThunk(
  'travels/updateTravel',
  async ({ id, travelData }: { id: string; travelData: Partial<Travel> }) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Update in localStorage
    const stored = localStorage.getItem('travels')
    const travels = stored ? JSON.parse(stored) : []
    const index = travels.findIndex((t: Travel) => t.id === id)
    
    if (index !== -1) {
      travels[index] = {
        ...travels[index],
        ...travelData,
        updatedAt: new Date().toISOString()
      }
      localStorage.setItem('travels', JSON.stringify(travels))
      return travels[index]
    }
    
    throw new Error('Travel not found')
  }
)

export const deleteTravel = createAsyncThunk(
  'travels/deleteTravel',
  async (id: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Remove from localStorage
    const stored = localStorage.getItem('travels')
    const travels = stored ? JSON.parse(stored) : []
    const filtered = travels.filter((t: Travel) => t.id !== id)
    localStorage.setItem('travels', JSON.stringify(filtered))
    
    return id
  }
)

const travelSlice = createSlice({
  name: 'travels',
  initialState,
  reducers: {
    setSelectedTravel: (state, action: PayloadAction<Travel | null>) => {
      state.selectedTravel = action.payload
    },
    setFilters: (state, action: PayloadAction<Partial<TravelState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = initialState.filters
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch travels
      .addCase(fetchTravels.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTravels.fulfilled, (state, action) => {
        state.loading = false
        state.travels = action.payload
      })
      .addCase(fetchTravels.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch travels'
      })
      // Create travel
      .addCase(createTravel.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createTravel.fulfilled, (state, action) => {
        state.loading = false
        state.travels.push(action.payload)
      })
      .addCase(createTravel.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to create travel'
      })
      // Update travel
      .addCase(updateTravel.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateTravel.fulfilled, (state, action) => {
        state.loading = false
        const index = state.travels.findIndex(travel => travel.id === action.payload.id)
        if (index !== -1) {
          state.travels[index] = action.payload
        }
      })
      .addCase(updateTravel.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to update travel'
      })
      // Delete travel
      .addCase(deleteTravel.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteTravel.fulfilled, (state, action) => {
        state.loading = false
        state.travels = state.travels.filter(travel => travel.id !== action.payload)
      })
      .addCase(deleteTravel.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to delete travel'
      })
  },
})

export const { setSelectedTravel, setFilters, clearFilters, clearError } = travelSlice.actions
export default travelSlice.reducer
