import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

export interface Booking {
  id: string
  travelId: string
  travelTitle: string
  customerName: string
  customerEmail: string
  customerPhone: string
  numberOfTravelers: number
  totalPrice: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  specialRequests?: string
  createdAt: string
  updatedAt: string
}

interface BookingState {
  bookings: Booking[]
  loading: boolean
  error: string | null
  selectedBooking: Booking | null
  filters: {
    status: string
    customerName: string
    travelTitle: string
    dateRange: {
      start: string
      end: string
    }
  }
  stats: {
    totalBookings: number
    pendingBookings: number
    confirmedBookings: number
    cancelledBookings: number
    completedBookings: number
    totalRevenue: number
  }
}

const initialState: BookingState = {
  bookings: [],
  loading: false,
  error: null,
  selectedBooking: null,
  filters: {
    status: '',
    customerName: '',
    travelTitle: '',
    dateRange: {
      start: '',
      end: '',
    },
  },
  stats: {
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    cancelledBookings: 0,
    completedBookings: 0,
    totalRevenue: 0,
  },
}

// Async thunks
export const fetchBookings = createAsyncThunk(
  'bookings/fetchBookings',
  async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 700))
    
    // Get from localStorage or return mock data
    const stored = localStorage.getItem('bookings')
    if (stored) {
      return JSON.parse(stored)
    }
    
    // Return mock data for demo
    return [
      {
        id: '1',
        travelId: '1',
        travelTitle: 'Aventura en Bariloche',
        customerName: 'Carlos López',
        customerEmail: 'carlos@email.com',
        customerPhone: '+54 9 11 1234-5678',
        numberOfTravelers: 2,
        totalPrice: 90000,
        status: 'confirmed' as const,
        specialRequests: 'Habitación con vista al lago',
        createdAt: '2024-01-10T10:00:00Z',
        updatedAt: '2024-01-12T15:30:00Z'
      },
      {
        id: '2',
        travelId: '2',
        travelTitle: 'Playa en Cancún',
        customerName: 'Ana Martínez',
        customerEmail: 'ana@email.com',
        customerPhone: '+54 9 11 9876-5432',
        numberOfTravelers: 3,
        totalPrice: 195000,
        status: 'pending' as const,
        createdAt: '2024-01-13T14:20:00Z',
        updatedAt: '2024-01-13T14:20:00Z'
      }
    ]
  }
)

export const createBooking = createAsyncThunk(
  'bookings/createBooking',
  async (bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newBooking: Booking = {
      ...bookingData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    // Save to localStorage
    const stored = localStorage.getItem('bookings')
    const bookings = stored ? JSON.parse(stored) : []
    bookings.push(newBooking)
    localStorage.setItem('bookings', JSON.stringify(bookings))
    
    return newBooking
  }
)

export const updateBookingStatus = createAsyncThunk(
  'bookings/updateBookingStatus',
  async ({ id, status }: { id: string; status: Booking['status'] }) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Update in localStorage
    const stored = localStorage.getItem('bookings')
    const bookings = stored ? JSON.parse(stored) : []
    const index = bookings.findIndex((b: Booking) => b.id === id)
    
    if (index !== -1) {
      bookings[index] = {
        ...bookings[index],
        status,
        updatedAt: new Date().toISOString()
      }
      localStorage.setItem('bookings', JSON.stringify(bookings))
      return bookings[index]
    }
    
    throw new Error('Booking not found')
  }
)

export const deleteBooking = createAsyncThunk(
  'bookings/deleteBooking',
  async (id: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 700))
    
    // Remove from localStorage
    const stored = localStorage.getItem('bookings')
    const bookings = stored ? JSON.parse(stored) : []
    const filtered = bookings.filter((b: Booking) => b.id !== id)
    localStorage.setItem('bookings', JSON.stringify(filtered))
    
    return id
  }
)

const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    setSelectedBooking: (state, action: PayloadAction<Booking | null>) => {
      state.selectedBooking = action.payload
    },
    setFilters: (state, action: PayloadAction<Partial<BookingState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = initialState.filters
    },
    clearError: (state) => {
      state.error = null
    },
    updateStats: (state) => {
      const totalBookings = state.bookings.length
      const pendingBookings = state.bookings.filter(b => b.status === 'pending').length
      const confirmedBookings = state.bookings.filter(b => b.status === 'confirmed').length
      const cancelledBookings = state.bookings.filter(b => b.status === 'cancelled').length
      const completedBookings = state.bookings.filter(b => b.status === 'completed').length
      const totalRevenue = state.bookings
        .filter(b => b.status === 'confirmed' || b.status === 'completed')
        .reduce((sum, b) => sum + b.totalPrice, 0)

      state.stats = {
        totalBookings,
        pendingBookings,
        confirmedBookings,
        cancelledBookings,
        completedBookings,
        totalRevenue,
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch bookings
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false
        state.bookings = action.payload
        // Update stats after fetching
        const totalBookings = action.payload.length
        const pendingBookings = action.payload.filter((b: Booking) => b.status === 'pending').length
        const confirmedBookings = action.payload.filter((b: Booking) => b.status === 'confirmed').length
        const cancelledBookings = action.payload.filter((b: Booking) => b.status === 'cancelled').length
        const completedBookings = action.payload.filter((b: Booking) => b.status === 'completed').length
        const totalRevenue = action.payload
          .filter((b: Booking) => b.status === 'confirmed' || b.status === 'completed')
          .reduce((sum: number, b: Booking) => sum + b.totalPrice, 0)

        state.stats = {
          totalBookings,
          pendingBookings,
          confirmedBookings,
          cancelledBookings,
          completedBookings,
          totalRevenue,
        }
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch bookings'
      })
      // Create booking
      .addCase(createBooking.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false
        state.bookings.push(action.payload)
        // Update stats
        state.stats.totalBookings += 1
        state.stats.pendingBookings += 1
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to create booking'
      })
      // Update booking status
      .addCase(updateBookingStatus.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        state.loading = false
        const index = state.bookings.findIndex(booking => booking.id === action.payload.id)
        if (index !== -1) {
          const oldStatus = state.bookings[index].status
          const newStatus = action.payload.status
          
          // Update the booking
          state.bookings[index] = action.payload
          
          // Update stats
          if (oldStatus === 'pending' && newStatus !== 'pending') {
            state.stats.pendingBookings -= 1
          }
          if (oldStatus === 'confirmed' && newStatus !== 'confirmed') {
            state.stats.confirmedBookings -= 1
          }
          if (oldStatus === 'cancelled' && newStatus !== 'cancelled') {
            state.stats.cancelledBookings -= 1
          }
          if (oldStatus === 'completed' && newStatus !== 'completed') {
            state.stats.completedBookings -= 1
          }
          
          if (newStatus === 'pending') state.stats.pendingBookings += 1
          if (newStatus === 'confirmed') state.stats.confirmedBookings += 1
          if (newStatus === 'cancelled') state.stats.cancelledBookings += 1
          if (newStatus === 'completed') state.stats.completedBookings += 1
          
          // Recalculate revenue
          state.stats.totalRevenue = state.bookings
            .filter(b => b.status === 'confirmed' || b.status === 'completed')
            .reduce((sum, b) => sum + b.totalPrice, 0)
        }
      })
      .addCase(updateBookingStatus.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to update booking status'
      })
      // Delete booking
      .addCase(deleteBooking.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.loading = false
        const deletedBooking = state.bookings.find(b => b.id === action.payload)
        if (deletedBooking) {
          // Update stats
          state.stats.totalBookings -= 1
          if (deletedBooking.status === 'pending') state.stats.pendingBookings -= 1
          if (deletedBooking.status === 'confirmed') state.stats.confirmedBookings -= 1
          if (deletedBooking.status === 'cancelled') state.stats.cancelledBookings -= 1
          if (deletedBooking.status === 'completed') state.stats.completedBookings -= 1
          
          // Recalculate revenue
          state.stats.totalRevenue = state.bookings
            .filter(b => b.id !== action.payload && (b.status === 'confirmed' || b.status === 'completed'))
            .reduce((sum, b) => sum + b.totalPrice, 0)
        }
        state.bookings = state.bookings.filter(booking => booking.id !== action.payload)
      })
      .addCase(deleteBooking.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to delete booking'
      })
  },
})

export const { 
  setSelectedBooking, 
  setFilters, 
  clearFilters, 
  clearError, 
  updateStats 
} = bookingSlice.actions
export default bookingSlice.reducer
