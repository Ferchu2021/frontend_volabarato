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
  images: string[]
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
    // Importar dinámicamente para evitar dependencias circulares
    const { apiService } = await import('../../services/api')
    const paquetes = await apiService.getPaquetes()
    
    // Convertir paquetes a formato Travel
    return paquetes.map((paquete) => ({
      id: paquete._id,
      title: paquete.nombre,
      destination: paquete.destino,
      description: paquete.descripcion || `Descubrí ${paquete.destino} con este increíble paquete de viaje.`,
      price: paquete.precio,
      duration: paquete.duracion || 'Consultar',
      departureDate: paquete.fechaSalida ? new Date(paquete.fechaSalida).toISOString().split('T')[0] : '',
      returnDate: paquete.fechaRegreso ? new Date(paquete.fechaRegreso).toISOString().split('T')[0] : '',
      images: paquete.imagenes && paquete.imagenes.length > 0 ? paquete.imagenes : ['/images/travel-1.jpg'],
      category: paquete.categoria || 'Cultural',
      maxTravelers: paquete.cuposDisponibles || 0,
      availableSpots: paquete.cuposDisponibles || 0,
      isActive: paquete.activo !== false,
      createdAt: paquete.fecha ? new Date(paquete.fecha).toISOString() : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }))
  }
)

export const createTravel = createAsyncThunk(
  'travels/createTravel',
  async (travelData: Omit<Travel, 'id' | 'createdAt' | 'updatedAt'>) => {
    // Importar dinámicamente para evitar dependencias circulares
    const { apiService } = await import('../../services/api')
    
    // Convertir Travel a formato Paquete
    const paqueteData = {
      nombre: travelData.title,
      destino: travelData.destination,
      descripcion: travelData.description,
      precio: travelData.price,
      duracion: travelData.duration,
      fechaSalida: travelData.departureDate ? new Date(travelData.departureDate) : new Date(),
      fechaRegreso: travelData.returnDate ? new Date(travelData.returnDate) : undefined,
      imagenes: travelData.images,
      categoria: travelData.category,
      cuposDisponibles: travelData.availableSpots,
      activo: travelData.isActive,
      fecha: travelData.departureDate ? new Date(travelData.departureDate) : new Date()
    }
    
    const nuevoPaquete = await apiService.createPaquete(paqueteData)
    
    // Convertir de vuelta a Travel
    return {
      id: nuevoPaquete._id,
      title: nuevoPaquete.nombre,
      destination: nuevoPaquete.destino,
      description: nuevoPaquete.descripcion || '',
      price: nuevoPaquete.precio,
      duration: nuevoPaquete.duracion || '',
      departureDate: nuevoPaquete.fechaSalida ? new Date(nuevoPaquete.fechaSalida).toISOString().split('T')[0] : '',
      returnDate: nuevoPaquete.fechaRegreso ? new Date(nuevoPaquete.fechaRegreso).toISOString().split('T')[0] : '',
      images: nuevoPaquete.imagenes || [],
      category: nuevoPaquete.categoria || 'Cultural',
      maxTravelers: nuevoPaquete.cuposDisponibles || 0,
      availableSpots: nuevoPaquete.cuposDisponibles || 0,
      isActive: nuevoPaquete.activo !== false,
      createdAt: nuevoPaquete.fecha ? new Date(nuevoPaquete.fecha).toISOString() : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }
)

export const updateTravel = createAsyncThunk(
  'travels/updateTravel',
  async ({ id, travelData }: { id: string; travelData: Partial<Travel> }) => {
    // Importar dinámicamente para evitar dependencias circulares
    const { apiService } = await import('../../services/api')
    
    // Convertir Travel a formato Paquete para actualización
    const updateData: any = {}
    if (travelData.title) updateData.nombre = travelData.title
    if (travelData.destination) updateData.destino = travelData.destination
    if (travelData.description) updateData.descripcion = travelData.description
    if (travelData.price !== undefined) updateData.precio = travelData.price
    if (travelData.duration) updateData.duracion = travelData.duration
    if (travelData.departureDate) updateData.fechaSalida = new Date(travelData.departureDate)
    if (travelData.returnDate) updateData.fechaRegreso = new Date(travelData.returnDate)
    if (travelData.images) updateData.imagenes = travelData.images
    if (travelData.category) updateData.categoria = travelData.category
    if (travelData.availableSpots !== undefined) updateData.cuposDisponibles = travelData.availableSpots
    if (travelData.isActive !== undefined) updateData.activo = travelData.isActive
    
    const paqueteActualizado = await apiService.updatePaquete(id, updateData)
    
    // Convertir de vuelta a Travel
    return {
      id: paqueteActualizado._id,
      title: paqueteActualizado.nombre,
      destination: paqueteActualizado.destino,
      description: paqueteActualizado.descripcion || '',
      price: paqueteActualizado.precio,
      duration: paqueteActualizado.duracion || '',
      departureDate: paqueteActualizado.fechaSalida ? new Date(paqueteActualizado.fechaSalida).toISOString().split('T')[0] : '',
      returnDate: paqueteActualizado.fechaRegreso ? new Date(paqueteActualizado.fechaRegreso).toISOString().split('T')[0] : '',
      images: paqueteActualizado.imagenes || [],
      category: paqueteActualizado.categoria || 'Cultural',
      maxTravelers: paqueteActualizado.cuposDisponibles || 0,
      availableSpots: paqueteActualizado.cuposDisponibles || 0,
      isActive: paqueteActualizado.activo !== false,
      createdAt: paqueteActualizado.fecha ? new Date(paqueteActualizado.fecha).toISOString() : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }
)

export const deleteTravel = createAsyncThunk(
  'travels/deleteTravel',
  async (id: string) => {
    // Importar dinámicamente para evitar dependencias circulares
    const { apiService } = await import('../../services/api')
    await apiService.deletePaquete(id)
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
