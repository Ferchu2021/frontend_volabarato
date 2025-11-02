import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../store/store'
import { 
  fetchMisReservas, 
  updateBookingStatus, 
  deleteBooking,
  setFilters,
  clearFilters,
  setPagination,
  Booking 
} from '../store/slices/bookingSlice'
import { motion } from 'framer-motion'
import { 
  FaCalendarAlt, 
  FaUsers, 
  FaDollarSign, 
  FaCreditCard, 
  FaPhone, 
  FaEnvelope,
  FaTimes,
  FaCheck,
  FaEye,
  FaFilter,
  FaTimesCircle,
  FaTrash,
  FaHashtag,
  FaExchangeAlt
} from 'react-icons/fa'
import { convertCurrency, formatCurrency, CURRENCY_OPTIONS, Currency } from '../utils/currency'
import './MisReservas.css'

const MisReservas: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { bookings, loading, error, filters, pagination } = useSelector((state: RootState) => state.bookings)
  
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('ARS')
  const [actionToConfirm, setActionToConfirm] = useState<{
    type: 'cancel' | 'delete'
    booking: Booking | null
  }>({ type: 'cancel', booking: null })

  useEffect(() => {
    dispatch(fetchMisReservas({ 
      estado: filters.estado,
      limit: pagination.limit,
      page: pagination.page 
    }))
  }, [dispatch, filters.estado, pagination.page])

  const handleStatusChange = (bookingId: string, _newStatus: Booking['estado']) => {
    setActionToConfirm({ type: 'cancel', booking: bookings.find((b: Booking) => b._id === bookingId) || null })
    setShowConfirmModal(true)
  }

  const handleDelete = (bookingId: string) => {
    setActionToConfirm({ type: 'delete', booking: bookings.find((b: Booking) => b._id === bookingId) || null })
    setShowConfirmModal(true)
  }

  const confirmAction = () => {
    if (!actionToConfirm.booking) return

    if (actionToConfirm.type === 'cancel') {
      dispatch(updateBookingStatus({ 
        id: actionToConfirm.booking._id, 
        status: 'cancelada' 
      }))
    } else if (actionToConfirm.type === 'delete') {
      dispatch(deleteBooking(actionToConfirm.booking._id))
    }

    setShowConfirmModal(false)
    setActionToConfirm({ type: 'cancel', booking: null })
  }

  const handleFilterChange = (key: string, value: string) => {
    dispatch(setFilters({ [key]: value }))
  }

  const clearAllFilters = () => {
    dispatch(clearFilters())
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatPrice = (amount: number) => {
    const converted = convertCurrency(amount, 'ARS', selectedCurrency)
    return formatCurrency(converted, selectedCurrency)
  }

  const getStatusColor = (status: Booking['estado']) => {
    switch (status) {
      case 'pendiente': return '#f59e0b'
      case 'confirmada': return '#10b981'
      case 'cancelada': return '#ef4444'
      case 'completada': return '#6366f1'
      default: return '#6b7280'
    }
  }

  const getStatusText = (status: Booking['estado']) => {
    switch (status) {
      case 'pendiente': return 'Pendiente'
      case 'confirmada': return 'Confirmada'
      case 'cancelada': return 'Cancelada'
      case 'completada': return 'Completada'
      default: return status
    }
  }

  const getPaymentMethodText = (method: Booking['metodoPago']) => {
    switch (method) {
      case 'efectivo': return 'Efectivo'
      case 'tarjeta': return 'Tarjeta'
      case 'transferencia': return 'Transferencia'
      default: return method
    }
  }

  if (loading && bookings.length === 0) {
    return (
      <div className="mis-reservas-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando tus reservas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mis-reservas-container">
      <div className="mis-reservas-header">
        <h1>Mis Reservas</h1>
        <p>Gestiona todas tus reservas de viaje</p>
      </div>

      {/* Selector de moneda */}
      <div className="currency-selector-section">
        <label htmlFor="currency-select">
          <FaExchangeAlt /> Moneda de visualización:
        </label>
        <select 
          id="currency-select"
          value={selectedCurrency} 
          onChange={(e) => setSelectedCurrency(e.target.value as Currency)}
          className="currency-select"
        >
          {CURRENCY_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.symbol} {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Filtros */}
      <div className="filters-section">
        <button 
          className="filter-toggle"
          onClick={() => setShowFilters(!showFilters)}
        >
          <FaFilter /> Filtros
        </button>
        
        {showFilters && (
          <motion.div 
            className="filters-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="filter-group">
              <label>Estado:</label>
              <select 
                value={filters.estado}
                onChange={(e) => handleFilterChange('estado', e.target.value)}
              >
                <option value="">Todos los estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="confirmada">Confirmada</option>
                <option value="cancelada">Cancelada</option>
                <option value="completada">Completada</option>
              </select>
            </div>
            
            <button className="clear-filters" onClick={clearAllFilters}>
              <FaTimesCircle /> Limpiar filtros
            </button>
          </motion.div>
        )}
      </div>

      {/* Lista de reservas */}
      <div className="reservas-grid">
        {bookings.length === 0 ? (
          <div className="no-reservas">
            <FaCalendarAlt size={48} />
            <h3>No tienes reservas</h3>
            <p>Cuando hagas una reserva, aparecerá aquí.</p>
          </div>
        ) : (
          bookings.map((booking: Booking) => (
            <motion.div
              key={booking._id}
              className="reserva-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="reserva-header">
                <div className="reserva-title-section">
                  <h3>{booking.paquete.nombre}</h3>
                  {booking.numeroReserva && (
                    <div className="numero-reserva">
                      <FaHashtag />
                      <span>{booking.numeroReserva}</span>
                    </div>
                  )}
                </div>
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(booking.estado) }}
                >
                  {getStatusText(booking.estado)}
                </span>
              </div>

              <div className="reserva-info">
                <div className="info-item">
                  <FaCalendarAlt />
                  <span>Viaje: {formatDate(booking.fechaViaje)}</span>
                </div>
                
                <div className="info-item">
                  <FaUsers />
                  <span>{booking.cantidadPersonas} persona{booking.cantidadPersonas > 1 ? 's' : ''}</span>
                </div>
                
                <div className="info-item price-item">
                  <FaDollarSign />
                  <div className="price-conversion">
                    <span className="main-price">{formatPrice(booking.precioTotal)}</span>
                    {selectedCurrency !== 'ARS' && (
                      <span className="original-price">
                        ({formatCurrency(booking.precioTotal, 'ARS')})
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="info-item">
                  <FaCreditCard />
                  <span>{getPaymentMethodText(booking.metodoPago)}</span>
                </div>
              </div>

              <div className="contact-info">
                <h4>Información de contacto:</h4>
                <div className="contact-item">
                  <FaEnvelope />
                  <span>{booking.datosContacto.email}</span>
                </div>
                <div className="contact-item">
                  <FaPhone />
                  <span>{booking.datosContacto.telefono}</span>
                </div>
              </div>

              {booking.observaciones && (
                <div className="observaciones">
                  <h4>Observaciones:</h4>
                  <p>{booking.observaciones}</p>
                </div>
              )}

              <div className="reserva-actions">
                <button 
                  className="btn-view"
                  onClick={() => setSelectedBooking(booking)}
                >
                  <FaEye /> Ver detalles
                </button>
                
                {booking.estado === 'pendiente' && (
                  <button 
                    className="btn-cancel"
                    onClick={() => handleStatusChange(booking._id, 'cancelada')}
                  >
                    <FaTimes /> Cancelar
                  </button>
                )}
                
                {booking.estado !== 'completada' && (
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(booking._id)}
                  >
                    <FaTrash /> Eliminar
                  </button>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Paginación */}
      {pagination.pages > 1 && (
        <div className="pagination">
          <button 
            disabled={pagination.page === 1}
            onClick={() => dispatch(setPagination({ page: pagination.page - 1 }))}
          >
            Anterior
          </button>
          
          <span>
            Página {pagination.page} de {pagination.pages}
          </span>
          
          <button 
            disabled={pagination.page === pagination.pages}
            onClick={() => dispatch(setPagination({ page: pagination.page + 1 }))}
          >
            Siguiente
          </button>
        </div>
      )}

      {/* Modal de confirmación */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirmar acción</h3>
            <p>
              ¿Estás seguro de que quieres {actionToConfirm.type === 'cancel' ? 'cancelar' : 'eliminar'} esta reserva?
            </p>
            <div className="modal-actions">
              <button 
                className="btn-cancel"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancelar
              </button>
              <button 
                className="btn-confirm"
                onClick={confirmAction}
              >
                <FaCheck /> Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de detalles */}
      {selectedBooking && (
        <div className="modal-overlay">
          <div className="modal details-modal">
            <div className="modal-header">
              <h3>Detalles de la reserva</h3>
              <button 
                className="close-btn"
                onClick={() => setSelectedBooking(null)}
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-content">
              <div className="detail-section">
                <h4>Información del viaje</h4>
                {selectedBooking.numeroReserva && (
                  <p><strong>Número de reserva:</strong> {selectedBooking.numeroReserva}</p>
                )}
                <p><strong>Paquete:</strong> {selectedBooking.paquete.nombre}</p>
                <p><strong>Destino:</strong> {selectedBooking.paquete.destino}</p>
                <p><strong>Fecha de viaje:</strong> {formatDate(selectedBooking.fechaViaje)}</p>
                <p><strong>Cantidad de personas:</strong> {selectedBooking.cantidadPersonas}</p>
                <p><strong>Precio total:</strong> 
                  <span className="main-price"> {formatPrice(selectedBooking.precioTotal)}</span>
                  {selectedCurrency !== 'ARS' && (
                    <span className="original-price"> ({formatCurrency(selectedBooking.precioTotal, 'ARS')})</span>
                  )}
                </p>
              </div>
              
              <div className="detail-section">
                <h4>Información de contacto</h4>
                <p><strong>Nombre:</strong> {selectedBooking.datosContacto.nombre}</p>
                <p><strong>Email:</strong> {selectedBooking.datosContacto.email}</p>
                <p><strong>Teléfono:</strong> {selectedBooking.datosContacto.telefono}</p>
              </div>
              
              <div className="detail-section">
                <h4>Información de pago</h4>
                <p><strong>Método de pago:</strong> {getPaymentMethodText(selectedBooking.metodoPago)}</p>
                <p><strong>Estado:</strong> 
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(selectedBooking.estado) }}
                  >
                    {getStatusText(selectedBooking.estado)}
                  </span>
                </p>
              </div>
              
              {selectedBooking.observaciones && (
                <div className="detail-section">
                  <h4>Observaciones</h4>
                  <p>{selectedBooking.observaciones}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
    </div>
  )
}

export default MisReservas
