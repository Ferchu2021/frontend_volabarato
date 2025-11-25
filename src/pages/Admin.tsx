import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { logoutUser } from '../store/slices/authSlice'
import { 
  fetchBookings, 
  createBooking,
  updateBooking,
  updateBookingStatus, 
  deleteBooking,
  fetchBookingStats,
  Booking 
} from '../store/slices/bookingSlice'
import { 
  fetchUsers, 
  createUser, 
  updateUser,
  deleteUser
} from '../store/slices/userSlice'
import { 
  fetchSubscribers,
  deleteSubscriber
} from '../store/slices/subscriberSlice'
import { useNavigate } from 'react-router-dom'
import { FaSignOutAlt, FaPlus, FaEdit, FaTrash, FaEye, FaCheck, FaUsers, FaFileExcel } from 'react-icons/fa'
import * as XLSX from 'xlsx'
import TravelModal from '../components/admin/TravelModal'
import BookingModal from '../components/admin/BookingModal'
import SubscriberModal from '../components/admin/SubscriberModal'
import UserModal from '../components/admin/UserModal'
import ConfirmModal from '../components/common/ConfirmModal'
import { apiService, Paquete } from '../services/api'
import { convertCurrency } from '../utils/currency'
import { getCategoryFromDestination } from '../utils/categoryUtils'
import './Admin.css'


interface Subscriber {
  id: string
  firstName: string
  lastName: string
  country: string
  city: string
  email: string
  subscribedAt: string
}

const Admin = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { bookings, loading, error, stats } = useAppSelector(state => state.bookings)
  const { users: adminUsers, loading: usersLoading } = useAppSelector(state => state.users)
  const { subscribers: reduxSubscribers } = useAppSelector(state => state.subscribers)
  
  const [activeTab, setActiveTab] = useState<'travels' | 'bookings' | 'subscribers' | 'users'>('bookings')
  const [showTravelModal, setShowTravelModal] = useState(false)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [showSubscriberModal, setShowSubscriberModal] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [action, setAction] = useState<'create' | 'edit' | 'delete'>('create')
  const [paquetes, setPaquetes] = useState<Paquete[]>([])

  useEffect(() => {
    dispatch(fetchBookings({}))
    dispatch(fetchBookingStats({}))
    dispatch(fetchUsers())
    dispatch(fetchSubscribers())
    
    // Cargar paquetes disponibles del backend
    const loadPaquetes = async () => {
      try {
        const paquetesData = await apiService.getPaquetes()
        setPaquetes(paquetesData)
      } catch (error) {
        console.error('Error al cargar paquetes:', error)
      }
    }
    loadPaquetes()
  }, [dispatch])

  const handleStatusChange = (bookingId: string, newStatus: Booking['estado']) => {
    dispatch(updateBookingStatus({ id: bookingId, status: newStatus }))
  }

  const handleDeleteBooking = (bookingId: string) => {
    dispatch(deleteBooking(bookingId))
  }

  // Función para exportar ventas a Excel
  const exportSalesToExcel = () => {
    // Filtrar solo reservas confirmadas y completadas (ventas realizadas)
    const sales = bookings.filter(b => b.estado === 'confirmada' || b.estado === 'completada')
    
    const salesData = sales.map(booking => ({
      'Número de Reserva': booking.numeroReserva || 'N/A',
      'Fecha de Reserva': formatDate(booking.fechaReserva),
      'Fecha de Viaje': formatDate(booking.fechaViaje),
      'Cliente': booking.datosContacto.nombre,
      'Email': booking.datosContacto.email,
      'Teléfono': booking.datosContacto.telefono,
      'Paquete': booking.paquete?.nombre || 'N/A',
      'Destino': booking.paquete?.destino || 'N/A',
      'Cantidad de Personas': booking.cantidadPersonas,
      'Precio Total': booking.precioTotal,
      'Método de Pago': getPaymentMethodText(booking.metodoPago),
      'Estado': getStatusText(booking.estado),
      'Observaciones': booking.observaciones || ''
    }))

    // Agregar resumen al final
    const totalSales = sales.reduce((sum, b) => sum + b.precioTotal, 0)
    const summaryData = [
      {},
      { 'Número de Reserva': 'RESUMEN', 'Fecha de Reserva': '', 'Fecha de Viaje': '', 'Cliente': '', 'Email': '', 'Teléfono': '', 'Paquete': '', 'Destino': '', 'Cantidad de Personas': '', 'Precio Total': '', 'Método de Pago': '', 'Estado': '', 'Observaciones': '' },
      { 'Número de Reserva': 'Total de Ventas', 'Fecha de Reserva': '', 'Fecha de Viaje': '', 'Cliente': '', 'Email': '', 'Teléfono': '', 'Paquete': '', 'Destino': '', 'Cantidad de Personas': sales.length, 'Precio Total': totalSales, 'Método de Pago': '', 'Estado': '', 'Observaciones': '' },
      { 'Número de Reserva': 'Promedio por Venta', 'Fecha de Reserva': '', 'Fecha de Viaje': '', 'Cliente': '', 'Email': '', 'Teléfono': '', 'Paquete': '', 'Destino': '', 'Cantidad de Personas': '', 'Precio Total': sales.length > 0 ? (totalSales / sales.length).toFixed(2) : 0, 'Método de Pago': '', 'Estado': '', 'Observaciones': '' }
    ]

    const worksheet = XLSX.utils.json_to_sheet([...salesData, ...summaryData])
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Ventas')
    
    const fileName = `Ventas_${new Date().toISOString().split('T')[0]}.xlsx`
    XLSX.writeFile(workbook, fileName)
  }

  // Función para exportar estados de reservas a Excel
  const exportReservationsToExcel = () => {
    const reservationsData = bookings.map(booking => ({
      'Número de Reserva': booking.numeroReserva || 'N/A',
      'Fecha de Reserva': formatDate(booking.fechaReserva),
      'Fecha de Viaje': formatDate(booking.fechaViaje),
      'Cliente': booking.datosContacto.nombre,
      'Email': booking.datosContacto.email,
      'Teléfono': booking.datosContacto.telefono,
      'Paquete': booking.paquete?.nombre || 'N/A',
      'Destino': booking.paquete?.destino || 'N/A',
      'Cantidad de Personas': booking.cantidadPersonas,
      'Precio Total': booking.precioTotal,
      'Método de Pago': getPaymentMethodText(booking.metodoPago),
      'Estado': getStatusText(booking.estado),
      'Observaciones': booking.observaciones || ''
    }))

    // Agregar resumen por estado
    const summaryByStatus = [
      {},
      { 'Número de Reserva': 'RESUMEN POR ESTADO', 'Fecha de Reserva': '', 'Fecha de Viaje': '', 'Cliente': '', 'Email': '', 'Teléfono': '', 'Paquete': '', 'Destino': '', 'Cantidad de Personas': '', 'Precio Total': '', 'Método de Pago': '', 'Estado': '', 'Observaciones': '' },
      { 'Número de Reserva': 'Pendientes', 'Fecha de Reserva': '', 'Fecha de Viaje': '', 'Cliente': '', 'Email': '', 'Teléfono': '', 'Paquete': '', 'Destino': '', 'Cantidad de Personas': bookings.filter(b => b.estado === 'pendiente').length, 'Precio Total': bookings.filter(b => b.estado === 'pendiente').reduce((sum, b) => sum + b.precioTotal, 0), 'Método de Pago': '', 'Estado': '', 'Observaciones': '' },
      { 'Número de Reserva': 'Confirmadas', 'Fecha de Reserva': '', 'Fecha de Viaje': '', 'Cliente': '', 'Email': '', 'Teléfono': '', 'Paquete': '', 'Destino': '', 'Cantidad de Personas': bookings.filter(b => b.estado === 'confirmada').length, 'Precio Total': bookings.filter(b => b.estado === 'confirmada').reduce((sum, b) => sum + b.precioTotal, 0), 'Método de Pago': '', 'Estado': '', 'Observaciones': '' },
      { 'Número de Reserva': 'Canceladas', 'Fecha de Reserva': '', 'Fecha de Viaje': '', 'Cliente': '', 'Email': '', 'Teléfono': '', 'Paquete': '', 'Destino': '', 'Cantidad de Personas': bookings.filter(b => b.estado === 'cancelada').length, 'Precio Total': bookings.filter(b => b.estado === 'cancelada').reduce((sum, b) => sum + b.precioTotal, 0), 'Método de Pago': '', 'Estado': '', 'Observaciones': '' },
      { 'Número de Reserva': 'Completadas', 'Fecha de Reserva': '', 'Fecha de Viaje': '', 'Cliente': '', 'Email': '', 'Teléfono': '', 'Paquete': '', 'Destino': '', 'Cantidad de Personas': bookings.filter(b => b.estado === 'completada').length, 'Precio Total': bookings.filter(b => b.estado === 'completada').reduce((sum, b) => sum + b.precioTotal, 0), 'Método de Pago': '', 'Estado': '', 'Observaciones': '' },
      { 'Número de Reserva': 'TOTAL', 'Fecha de Reserva': '', 'Fecha de Viaje': '', 'Cliente': '', 'Email': '', 'Teléfono': '', 'Paquete': '', 'Destino': '', 'Cantidad de Personas': bookings.length, 'Precio Total': bookings.reduce((sum, b) => sum + b.precioTotal, 0), 'Método de Pago': '', 'Estado': '', 'Observaciones': '' }
    ]

    const worksheet = XLSX.utils.json_to_sheet([...reservationsData, ...summaryByStatus])
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reservas')
    
    const fileName = `Reservas_${new Date().toISOString().split('T')[0]}.xlsx`
    XLSX.writeFile(workbook, fileName)
  }

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'tarjeta': return 'Tarjeta'
      case 'transferencia': return 'Transferencia'
      case 'deposito': return 'Depósito Bancario'
      default: return method
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
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

  const handleLogout = async () => {
    await dispatch(logoutUser())
    navigate('/')
  }

  // Usar paquetes reales del backend (ya cargados en paquetes)
  // Los "travels" ahora son los paquetes del backend
  const travels = paquetes.map(p => ({
    id: p._id,
    title: p.nombre,
    destination: p.destino,
    price: p.precio,
    currency: 'ARS',
    duration: p.duracion || p.descripcion || 'Consultar',
    image: p.imagenes && p.imagenes.length > 0 ? p.imagenes[0] : '/images/travel-1.jpg',
    description: p.descripcion || `Paquete de viaje a ${p.destino}`,
    category: getCategoryFromDestination(p.destino || '', p.categoria)
  }))

  // Usar suscriptores de Redux (conectados con backend real)
  const subscribers: Subscriber[] = reduxSubscribers.map(sub => ({
    id: sub._id,
    firstName: sub.nombre,
    lastName: sub.apellido,
    country: sub.pais,
    city: sub.ciudad,
    email: sub.email,
    subscribedAt: sub.fechaSuscripcion
  }))

  const handleCreate = () => {
    setAction('create')
    setSelectedItem(null)
    if (activeTab === 'travels') setShowTravelModal(true)
    else if (activeTab === 'bookings') setShowBookingModal(true)
    else if (activeTab === 'subscribers') setShowSubscriberModal(true)
    else if (activeTab === 'users') setShowUserModal(true)
  }

  const handleEdit = (item: any) => {
    setAction('edit')
    setSelectedItem(item)
    if (activeTab === 'travels') setShowTravelModal(true)
    else if (activeTab === 'bookings') setShowBookingModal(true)
    else if (activeTab === 'subscribers') setShowSubscriberModal(true)
    else if (activeTab === 'users') setShowUserModal(true)
  }

  const handleDelete = (item: any) => {
    setAction('delete')
    setSelectedItem(item)
    setShowConfirmModal(true)
  }

  const confirmDelete = () => {
    if (activeTab === 'travels') {
      // Los travels ahora son paquetes del backend, se manejan desde TravelModal
      // Esta funcionalidad se manejará cuando se implemente CRUD de paquetes
      console.log('Eliminación de paquetes se maneja desde el modal')
    } else if (activeTab === 'bookings') {
      // Para reservas reales, usar la acción de Redux
      if (selectedItem._id) {
        dispatch(deleteBooking(selectedItem._id))
      }
    } else if (activeTab === 'subscribers') {
      // Usar Redux para eliminar suscriptor
      if (selectedItem.id) {
        dispatch(deleteSubscriber(selectedItem.id))
      }
    } else if (activeTab === 'users') {
      // Eliminar usuario usando Redux
      if (selectedItem._id) {
        dispatch(deleteUser(selectedItem._id))
      }
    }
    setShowConfirmModal(false)
    setSelectedItem(null)
  }


  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="container">
          <h1>Panel de Administración</h1>
          <p>Gestioná viajes, reservas y suscriptores de Volá Barato</p>
        </div>
      </div>

      <div className="container">
        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-number">{paquetes.length}</div>
            <div className="stat-label">Paquetes Activos</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.totalBookings}</div>
            <div className="stat-label">Reservas Totales</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.pendingBookings}</div>
            <div className="stat-label">Reservas Pendientes</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {formatCurrency(stats.totalRevenue)}
            </div>
            <div className="stat-label">Ingresos Totales</div>
          </div>
        </div>

        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === 'travels' ? 'active' : ''}`}
            onClick={() => setActiveTab('travels')}
          >
            Viajes
          </button>
          <button
            className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            Reservas
          </button>
          <button
            className={`tab-btn ${activeTab === 'subscribers' ? 'active' : ''}`}
            onClick={() => setActiveTab('subscribers')}
          >
            Suscriptores
          </button>
          <button
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <FaUsers /> Usuarios
          </button>
        </div>

        <div className="admin-actions">
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button className="btn btn-primary" onClick={handleCreate}>
              <FaPlus />
              Crear Nuevo
            </button>
            {activeTab === 'bookings' && (
              <>
                <button className="btn-export" onClick={exportSalesToExcel}>
                  <FaFileExcel /> Exportar Ventas
                </button>
                <button className="btn-export" onClick={exportReservationsToExcel}>
                  <FaFileExcel /> Exportar Reservas
                </button>
              </>
            )}
          </div>
          <button className="btn btn-outline" onClick={handleLogout}>
            <FaSignOutAlt />
            Cerrar Sesión
          </button>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        <div className="admin-content">
          {activeTab === 'travels' && (
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Imagen</th>
                    <th>Título</th>
                    <th>Destino</th>
                    <th>Precio</th>
                    <th>Duración</th>
                    <th>Categoría</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {travels.map(travel => (
                    <tr key={travel.id}>
                      <td>
                        <img src={travel.image} alt={travel.title} className="table-image" />
                      </td>
                      <td>{travel.title}</td>
                      <td>{travel.destination}</td>
                      <td>${travel.price.toLocaleString()}</td>
                      <td>{travel.duration}</td>
                      <td>{travel.category}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn-icon" onClick={() => handleEdit(travel)}>
                            <FaEdit />
                          </button>
                          <button className="btn-icon danger" onClick={() => handleDelete(travel)}>
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Email</th>
                    <th>Teléfono</th>
                    <th>Fecha Viaje</th>
                    <th>Pasajeros</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '2rem' }}>
                        <div className="spinner"></div>
                        <p>Cargando reservas...</p>
                      </td>
                    </tr>
                  ) : bookings.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '2rem' }}>
                        <p>No hay reservas disponibles</p>
                      </td>
                    </tr>
                  ) : (
                    bookings.map(booking => (
                      <tr key={booking._id}>
                        <td>{booking.datosContacto.nombre}</td>
                        <td>{booking.datosContacto.email}</td>
                        <td>{booking.datosContacto.telefono}</td>
                        <td>{formatDate(booking.fechaViaje)}</td>
                        <td>{booking.cantidadPersonas}</td>
                        <td>{formatCurrency(booking.precioTotal)}</td>
                        <td>
                          <span 
                            className="status-badge" 
                            style={{ backgroundColor: getStatusColor(booking.estado) }}
                          >
                            {getStatusText(booking.estado)}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="btn-icon" 
                              onClick={() => {
                                console.log('👁️ Click en ver detalles de reserva:', booking)
                                setSelectedItem(booking)
                                setAction('view')
                                setShowBookingModal(true)
                                console.log('✅ Modal debería abrirse ahora')
                              }}
                              title="Ver detalles"
                            >
                              <FaEye />
                            </button>
                            {booking.estado === 'pendiente' && (
                              <button 
                                className="btn-icon success" 
                                onClick={() => handleStatusChange(booking._id, 'confirmada')}
                                title="Confirmar reserva"
                              >
                                <FaCheck />
                              </button>
                            )}
                            {booking.estado !== 'completada' && (
                              <button 
                                className="btn-icon danger" 
                                onClick={() => handleDeleteBooking(booking._id)}
                                title="Eliminar reserva"
                              >
                                <FaTrash />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'subscribers' && (
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>País</th>
                    <th>Localidad</th>
                    <th>Email</th>
                    <th>Fecha Suscripción</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map(subscriber => (
                    <tr key={subscriber.id}>
                      <td>{subscriber.firstName}</td>
                      <td>{subscriber.lastName}</td>
                      <td>{subscriber.country}</td>
                      <td>{subscriber.city}</td>
                      <td>{subscriber.email}</td>
                      <td>{new Date(subscriber.subscribedAt).toLocaleDateString('es-AR')}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn-icon" onClick={() => handleEdit(subscriber)}>
                            <FaEdit />
                          </button>
                          <button className="btn-icon danger" onClick={() => handleDelete(subscriber)}>
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Usuario</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usersLoading ? (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', padding: '2rem' }}>
                        <div className="spinner"></div>
                        <p>Cargando usuarios...</p>
                      </td>
                    </tr>
                  ) : adminUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', padding: '2rem' }}>
                        <p>No hay usuarios disponibles</p>
                      </td>
                    </tr>
                  ) : (
                    adminUsers.map(user => (
                      <tr key={user._id}>
                        <td>{user._id}</td>
                        <td>{user.usuario}</td>
                        <td>{user.rol || 'cliente'}</td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn-icon" onClick={() => handleEdit(user)}>
                              <FaEdit />
                            </button>
                            <button className="btn-icon danger" onClick={() => handleDelete(user)}>
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showTravelModal && (
        <TravelModal
          isOpen={showTravelModal}
          onClose={() => setShowTravelModal(false)}
          travel={selectedItem}
          action={action === 'delete' ? 'edit' : action}
          onSave={async () => {
            try {
              // El modal maneja la creación/actualización internamente
              // Solo cerramos el modal y recargamos los paquetes
              setShowTravelModal(false)
              const paquetesData = await apiService.getPaquetes()
              setPaquetes(paquetesData)
            } catch (error) {
              console.error('Error al guardar viaje:', error)
            }
          }}
        />
      )}

      {showBookingModal && (
        <BookingModal
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          booking={selectedItem ? {
            _id: selectedItem._id,
            id: selectedItem._id,
            travelId: selectedItem.paquete?._id || selectedItem.travelId || '',
            customerName: selectedItem.datosContacto?.nombre || selectedItem.customerName || '',
            customerEmail: selectedItem.datosContacto?.email || selectedItem.customerEmail || '',
            customerPhone: selectedItem.datosContacto?.telefono || selectedItem.customerPhone || '',
            travelDate: selectedItem.fechaViaje || selectedItem.travelDate || '',
            passengers: selectedItem.cantidadPersonas || selectedItem.passengers || 1,
            totalPrice: selectedItem.precioTotal || selectedItem.totalPrice || 0,
            status: (selectedItem.estado === 'pendiente' ? 'pending' : selectedItem.estado === 'confirmada' ? 'confirmed' : 'cancelled') as any,
            paymentMethod: selectedItem.metodoPago,
            notes: selectedItem.observaciones
          } : null}
          action={action === 'delete' ? 'edit' : action}
          travels={paquetes}
          onSave={async (bookingData: any) => {
            // Si está en modo 'view', no hacer nada
            if (action === 'view') {
              return
            }
            try {
              if (action === 'create') {
                // Mapear los datos del formulario a CreateReservaRequest
                // Convertir el precio a ARS si la moneda seleccionada no es ARS
                const currencyFrom = bookingData.currency || 'ARS'
                const precioEnARS = currencyFrom === 'ARS' 
                  ? Number(bookingData.totalPrice) 
                  : convertCurrency(Number(bookingData.totalPrice), currencyFrom as any, 'ARS')
                
                const reservaData = {
                  paquete: bookingData.travelId,
                  fechaViaje: bookingData.travelDate,
                  cantidadPersonas: Number(bookingData.passengers),
                  precioTotal: precioEnARS,
                  metodoPago: bookingData.paymentMethod || 'tarjeta',
                  observaciones: bookingData.notes || '',
                  datosContacto: {
                    nombre: bookingData.customerName,
                    email: bookingData.customerEmail,
                    telefono: bookingData.customerPhone
                  }
                }
                console.log('Datos de la reserva que se enviarán:', reservaData)
                const result = await dispatch(createBooking(reservaData))
                if (createBooking.rejected.match(result)) {
                  console.error('Error al crear reserva:', result.payload)
                  alert('Error al crear la reserva: ' + (result.payload || 'Error desconocido'))
                  return
                }
                console.log('Reserva creada exitosamente:', result.payload)
                await dispatch(fetchBookings({}))
                await dispatch(fetchBookingStats({}))
              } else if (action === 'edit') {
                // Mapear para actualización
                // Convertir el precio a ARS si la moneda seleccionada no es ARS
                const currencyFrom = bookingData.currency || 'ARS'
                const precioEnARS = currencyFrom === 'ARS' 
                  ? Number(bookingData.totalPrice) 
                  : convertCurrency(Number(bookingData.totalPrice), currencyFrom as any, 'ARS')
                
                const updateData = {
                  fechaViaje: bookingData.travelDate,
                  cantidadPersonas: Number(bookingData.passengers),
                  precioTotal: precioEnARS,
                  metodoPago: bookingData.paymentMethod || 'tarjeta',
                  observaciones: bookingData.notes || '',
                  datosContacto: {
                    nombre: bookingData.customerName,
                    email: bookingData.customerEmail,
                    telefono: bookingData.customerPhone
                  }
                }
                await dispatch(updateBooking({ id: selectedItem._id || selectedItem.id, data: updateData }))
                await dispatch(fetchBookings({}))
                await dispatch(fetchBookingStats({}))
              }
              setShowBookingModal(false)
            } catch (error) {
              console.error('Error al guardar la reserva:', error)
            }
          }}
        />
      )}

      {showSubscriberModal && (
        <SubscriberModal
          isOpen={showSubscriberModal}
          onClose={() => setShowSubscriberModal(false)}
          subscriber={selectedItem}
          action={action === 'delete' ? 'edit' : action}
          onSave={async () => {
            try {
              // El modal maneja la creación/actualización internamente
              // Solo cerramos el modal y recargamos los suscriptores
              setShowSubscriberModal(false)
              dispatch(fetchSubscribers())
            } catch (error) {
              console.error('Error al guardar suscriptor:', error)
            }
          }}
        />
      )}

      {showUserModal && (
        <UserModal
          isOpen={showUserModal}
          onClose={() => setShowUserModal(false)}
          user={selectedItem}
          action={action === 'delete' ? 'edit' : action}
          onSave={async (userData: any) => {
            try {
              if (action === 'create') {
                await dispatch(createUser(userData)).unwrap()
                await dispatch(fetchUsers())
              } else if (action === 'edit') {
                await dispatch(updateUser({ 
                  id: selectedItem._id, 
                  ...userData 
                })).unwrap()
                await dispatch(fetchUsers())
              }
            } catch (error) {
              console.error('Error guardando usuario:', error)
              alert('Error al guardar el usuario: ' + (error as any)?.message || 'Error desconocido')
            }
          }}
        />
      )}

      {showConfirmModal && (
        <ConfirmModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={confirmDelete}
          title="Confirmar Eliminación"
          message={`¿Estás seguro de que querés eliminar este ${activeTab === 'travels' ? 'viaje' : activeTab === 'bookings' ? 'reserva' : 'suscriptor'}? Esta acción no se puede deshacer.`}
        />
      )}
    </div>
  )
}

export default Admin
