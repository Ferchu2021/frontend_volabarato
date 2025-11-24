import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { apiService, CreateReservaRequest, UpdateReservaRequest, handleApiError } from '../../services/api'

// Interface compatible con el backend
export interface Booking {
  _id: string
  numeroReserva: string
  usuario: string
  paquete: {
    _id: string
    nombre: string
    destino: string
    precio: number
  }
  fechaReserva: string
  fechaViaje: string
  cantidadPersonas: number
  precioTotal: number
  estado: 'pendiente' | 'confirmada' | 'cancelada' | 'completada'
  metodoPago: 'tarjeta' | 'transferencia' | 'deposito'
  observaciones?: string
  datosContacto: {
    nombre: string
    email: string
    telefono: string
  }
  fechaCreacion: string
  fechaActualizacion: string
}

interface BookingState {
  bookings: Booking[]
  loading: boolean
  error: string | null
  selectedBooking: Booking | null
  filters: {
    estado: string
    usuario: string
    paquete: string
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
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

const initialState: BookingState = {
  bookings: [],
  loading: false,
  error: null,
  selectedBooking: null,
  filters: {
    estado: '',
    usuario: '',
    paquete: '',
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
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
}

// Async thunks
export const fetchBookings = createAsyncThunk(
  'bookings/fetchBookings',
  async (params: {
    estado?: string
    usuario?: string
    paquete?: string
    limit?: number
    page?: number
  } = {}, { rejectWithValue }) => {
    try {
      const response = await apiService.getReservas(params)
      return response
    } catch (error) {
      return rejectWithValue(handleApiError(error))
    }
  }
)

export const fetchMisReservas = createAsyncThunk(
  'bookings/fetchMisReservas',
  async (params: {
    estado?: string
    usuarioId?: string
    limit?: number
    page?: number
  } = {}, { rejectWithValue, getState }) => {
    try {
      // Obtener el usuario del estado de autenticación si no se proporciona
      const state = getState() as any
      const usuarioId = params.usuarioId || state.auth?.user?._id
      
      const response = await apiService.getMisReservas({
        ...params,
        usuarioId
      })
      return response
    } catch (error) {
      return rejectWithValue(handleApiError(error))
    }
  }
)

export const fetchBookingById = createAsyncThunk(
  'bookings/fetchBookingById',
  async (id: string, { rejectWithValue }) => {
    try {
      const booking = await apiService.getReservaById(id)
      return booking
    } catch (error) {
      return rejectWithValue(handleApiError(error))
    }
  }
)

export const createBooking = createAsyncThunk(
  'bookings/createBooking',
  async (bookingData: CreateReservaRequest, { rejectWithValue, getState }) => {
    try {
      // Obtener el usuario del estado de autenticación
      const state = getState() as any
      const usuarioId = bookingData.usuario || state.auth?.user?._id
      
      if (!usuarioId) {
        return rejectWithValue('Usuario no autenticado')
      }
      
      const response = await apiService.createReserva({
        ...bookingData,
        usuario: usuarioId
      })
      return response.reserva
    } catch (error) {
      return rejectWithValue(handleApiError(error))
    }
  }
)

export const updateBooking = createAsyncThunk(
  'bookings/updateBooking',
  async ({ id, data }: { id: string; data: UpdateReservaRequest }, { rejectWithValue }) => {
    try {
      const response = await apiService.updateReserva(id, data)
      return response.reserva
    } catch (error) {
      return rejectWithValue(handleApiError(error))
    }
  }
)

export const updateBookingStatus = createAsyncThunk(
  'bookings/updateBookingStatus',
  async ({ id, status }: { id: string; status: Booking['estado'] }, { rejectWithValue }) => {
    try {
      let response
      if (status === 'cancelada') {
        response = await apiService.cancelarReserva(id)
      } else if (status === 'confirmada') {
        response = await apiService.confirmarReserva(id)
      } else {
        response = await apiService.updateReserva(id, { estado: status })
      }
      return response.reserva
    } catch (error) {
      return rejectWithValue(handleApiError(error))
    }
  }
)

export const deleteBooking = createAsyncThunk(
  'bookings/deleteBooking',
  async (id: string, { rejectWithValue }) => {
    try {
      await apiService.deleteReserva(id)
      return id
    } catch (error) {
      return rejectWithValue(handleApiError(error))
    }
  }
)

export const fetchBookingStats = createAsyncThunk(
  'bookings/fetchBookingStats',
  async (params: {
    fechaInicio?: string
    fechaFin?: string
  } = {}, { rejectWithValue }) => {
    try {
      const stats = await apiService.getReservasStats(params)
      return stats
    } catch (error) {
      return rejectWithValue(handleApiError(error))
    }
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
    setPagination: (state, action: PayloadAction<Partial<BookingState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload }
    },
    updateStats: (state) => {
      const totalBookings = state.bookings.length
      const pendingBookings = state.bookings.filter(b => b.estado === 'pendiente').length
      const confirmedBookings = state.bookings.filter(b => b.estado === 'confirmada').length
      const cancelledBookings = state.bookings.filter(b => b.estado === 'cancelada').length
      const completedBookings = state.bookings.filter(b => b.estado === 'completada').length
      const totalRevenue = state.bookings
        .filter(b => b.estado === 'confirmada' || b.estado === 'completada')
        .reduce((sum, b) => sum + b.precioTotal, 0)

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
        state.bookings = action.payload.data || []
        state.pagination = action.payload.pagination || initialState.pagination
        // Update stats after fetching
        const bookings = action.payload.data || []
        const totalBookings = bookings.length
        const pendingBookings = bookings.filter((b: Booking) => b.estado === 'pendiente').length
        const confirmedBookings = bookings.filter((b: Booking) => b.estado === 'confirmada').length
        const cancelledBookings = bookings.filter((b: Booking) => b.estado === 'cancelada').length
        const completedBookings = bookings.filter((b: Booking) => b.estado === 'completada').length
        const totalRevenue = bookings
          .filter((b: Booking) => b.estado === 'confirmada' || b.estado === 'completada')
          .reduce((sum: number, b: Booking) => sum + b.precioTotal, 0)

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
        state.error = action.payload as string || 'Failed to fetch bookings'
      })
      
      // Fetch mis reservas
      .addCase(fetchMisReservas.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMisReservas.fulfilled, (state, action) => {
        state.loading = false
        state.bookings = action.payload.data || []
        state.pagination = action.payload.pagination || initialState.pagination
      })
      .addCase(fetchMisReservas.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string || 'Failed to fetch my reservations'
      })
      
      // Fetch booking by ID
      .addCase(fetchBookingById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.loading = false
        state.selectedBooking = action.payload
      })
      .addCase(fetchBookingById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string || 'Failed to fetch booking'
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
        state.error = action.payload as string || 'Failed to create booking'
      })
      
      // Update booking
      .addCase(updateBooking.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        state.loading = false
        const index = state.bookings.findIndex(booking => booking._id === action.payload._id)
        if (index !== -1) {
          state.bookings[index] = action.payload
        }
      })
      .addCase(updateBooking.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string || 'Failed to update booking'
      })
      
      // Update booking status
      .addCase(updateBookingStatus.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        state.loading = false
        const index = state.bookings.findIndex(booking => booking._id === action.payload._id)
        if (index !== -1) {
          const oldStatus = state.bookings[index].estado
          const newStatus = action.payload.estado
          
          // Update the booking
          state.bookings[index] = action.payload
          
          // Update stats
          if (oldStatus === 'pendiente' && newStatus !== 'pendiente') {
            state.stats.pendingBookings -= 1
          }
          if (oldStatus === 'confirmada' && newStatus !== 'confirmada') {
            state.stats.confirmedBookings -= 1
          }
          if (oldStatus === 'cancelada' && newStatus !== 'cancelada') {
            state.stats.cancelledBookings -= 1
          }
          if (oldStatus === 'completada' && newStatus !== 'completada') {
            state.stats.completedBookings -= 1
          }
          
          if (newStatus === 'pendiente') state.stats.pendingBookings += 1
          if (newStatus === 'confirmada') state.stats.confirmedBookings += 1
          if (newStatus === 'cancelada') state.stats.cancelledBookings += 1
          if (newStatus === 'completada') state.stats.completedBookings += 1
          
          // Recalculate revenue
          state.stats.totalRevenue = state.bookings
            .filter(b => b.estado === 'confirmada' || b.estado === 'completada')
            .reduce((sum, b) => sum + b.precioTotal, 0)
        }
      })
      .addCase(updateBookingStatus.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string || 'Failed to update booking status'
      })
      
      // Delete booking
      .addCase(deleteBooking.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.loading = false
        const deletedBooking = state.bookings.find(b => b._id === action.payload)
        if (deletedBooking) {
          // Update stats
          state.stats.totalBookings -= 1
          if (deletedBooking.estado === 'pendiente') state.stats.pendingBookings -= 1
          if (deletedBooking.estado === 'confirmada') state.stats.confirmedBookings -= 1
          if (deletedBooking.estado === 'cancelada') state.stats.cancelledBookings -= 1
          if (deletedBooking.estado === 'completada') state.stats.completedBookings -= 1
          
          // Recalculate revenue
          state.stats.totalRevenue = state.bookings
            .filter(b => b._id !== action.payload && (b.estado === 'confirmada' || b.estado === 'completada'))
            .reduce((sum, b) => sum + b.precioTotal, 0)
        }
        state.bookings = state.bookings.filter(booking => booking._id !== action.payload)
      })
      .addCase(deleteBooking.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string || 'Failed to delete booking'
      })
      
      // Fetch booking stats
      .addCase(fetchBookingStats.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBookingStats.fulfilled, (state, action) => {
        state.loading = false
        const stats = action.payload
        state.stats = {
          totalBookings: stats.totalReservas,
          pendingBookings: stats.estadisticas.find(s => s._id === 'pendiente')?.count || 0,
          confirmedBookings: stats.estadisticas.find(s => s._id === 'confirmada')?.count || 0,
          cancelledBookings: stats.estadisticas.find(s => s._id === 'cancelada')?.count || 0,
          completedBookings: stats.estadisticas.find(s => s._id === 'completada')?.count || 0,
          totalRevenue: stats.totalIngresos,
        }
      })
      .addCase(fetchBookingStats.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string || 'Failed to fetch booking stats'
      })
  },
})

export const { 
  setSelectedBooking, 
  setFilters, 
  clearFilters, 
  clearError, 
  setPagination,
  updateStats 
} = bookingSlice.actions
export default bookingSlice.reducer
