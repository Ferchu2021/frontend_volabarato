import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { logoutUser } from '../store/slices/authSlice'
import { 
  fetchBookings, 
  updateBookingStatus, 
  deleteBooking,
  fetchBookingStats,
  Booking 
} from '../store/slices/bookingSlice'
import { useNavigate } from 'react-router-dom'
import { FaSignOutAlt, FaPlus, FaEdit, FaTrash, FaEye, FaCheck } from 'react-icons/fa'
import TravelModal from '../components/admin/TravelModal'
import BookingModal from '../components/admin/BookingModal'
import SubscriberModal from '../components/admin/SubscriberModal'
import ConfirmModal from '../components/common/ConfirmModal'
import './Admin.css'

interface Travel {
  id: string
  title: string
  destination: string
  price: number
  duration: string
  image: string
  description: string
  category: string
}

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
  
  const [activeTab, setActiveTab] = useState<'travels' | 'bookings' | 'subscribers'>('bookings')
  const [showTravelModal, setShowTravelModal] = useState(false)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [showSubscriberModal, setShowSubscriberModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [action, setAction] = useState<'create' | 'edit' | 'delete'>('create')

  useEffect(() => {
    dispatch(fetchBookings())
    dispatch(fetchBookingStats())
  }, [dispatch])

  const handleStatusChange = (bookingId: string, newStatus: Booking['estado']) => {
    dispatch(updateBookingStatus({ id: bookingId, status: newStatus }))
  }

  const handleDeleteBooking = (bookingId: string) => {
    dispatch(deleteBooking(bookingId))
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

  // Mock data para travels y subscribers (mantener por ahora)
  const [travels, setTravels] = useState<Travel[]>([
    {
      id: '1',
      title: 'La Ruta del Helado en Rosario',
      destination: 'Rosario, Argentina',
      price: 15000,
      duration: '2 días',
      image: '/images/helado-rosario.jpg',
      description: 'Descubrí la capital nacional del helado con un recorrido por las mejores heladerías artesanales.',
      category: 'Gastronomía'
    },
    {
      id: '2',
      title: 'Solos y Solas',
      destination: 'Varios destinos',
      price: 25000,
      duration: '3-5 días',
      image: '/images/solos-solas.jpg',
      description: 'Viajes diseñados especialmente para viajeros solos que quieren conocer gente nueva.',
      category: 'Social'
    }
  ])

  const [subscribers, setSubscribers] = useState<Subscriber[]>([
    {
      id: '1',
      firstName: 'Juan',
      lastName: 'Pérez',
      country: 'Argentina',
      city: 'Buenos Aires',
      email: 'juan@email.com',
      subscribedAt: '2024-01-10'
    }
  ])

  const handleCreate = () => {
    setAction('create')
    setSelectedItem(null)
    if (activeTab === 'travels') setShowTravelModal(true)
    else if (activeTab === 'bookings') setShowBookingModal(true)
    else if (activeTab === 'subscribers') setShowSubscriberModal(true)
  }

  const handleEdit = (item: any) => {
    setAction('edit')
    setSelectedItem(item)
    if (activeTab === 'travels') setShowTravelModal(true)
    else if (activeTab === 'bookings') setShowBookingModal(true)
    else if (activeTab === 'subscribers') setShowSubscriberModal(true)
  }

  const handleDelete = (item: any) => {
    setAction('delete')
    setSelectedItem(item)
    setShowConfirmModal(true)
  }

  const confirmDelete = () => {
    if (activeTab === 'travels') {
      setTravels(prev => prev.filter(t => t.id !== selectedItem.id))
    } else if (activeTab === 'bookings') {
      // Para reservas reales, usar la acción de Redux
      if (selectedItem._id) {
        dispatch(deleteBooking(selectedItem._id))
      }
    } else if (activeTab === 'subscribers') {
      setSubscribers(prev => prev.filter(s => s.id !== selectedItem.id))
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
            <div className="stat-number">{travels.length}</div>
            <div className="stat-label">Viajes Activos</div>
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
        </div>

        <div className="admin-actions">
          <button className="btn btn-primary" onClick={handleCreate}>
            <FaPlus />
            Crear Nuevo
          </button>
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
                              onClick={() => setSelectedItem(booking)}
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
        </div>
      </div>

      {/* Modals */}
      {showTravelModal && (
        <TravelModal
          isOpen={showTravelModal}
          onClose={() => setShowTravelModal(false)}
          travel={selectedItem}
          action={action === 'delete' ? 'edit' : action}
          onSave={(travelData) => {
            if (action === 'create') {
              setTravels(prev => [...prev, { ...travelData, id: Date.now().toString() }])
            } else {
              setTravels(prev => prev.map(t => t.id === String(travelData.id) ? { ...travelData, id: String(travelData.id) } : t))
            }
            setShowTravelModal(false)
          }}
        />
      )}

      {showBookingModal && (
        <BookingModal
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          booking={selectedItem}
          action={action === 'delete' ? 'edit' : action}
          onSave={() => {
            // Para reservas reales, las acciones se manejan a través de Redux
            setShowBookingModal(false)
          }}
        />
      )}

      {showSubscriberModal && (
        <SubscriberModal
          isOpen={showSubscriberModal}
          onClose={() => setShowSubscriberModal(false)}
          subscriber={selectedItem}
          action={action === 'delete' ? 'edit' : action}
          onSave={(subscriberData) => {
            if (action === 'create') {
              setSubscribers(prev => [
                ...prev,
                { ...subscriberData, id: Date.now().toString(), subscribedAt: new Date().toISOString() }
              ])
            } else {
              setSubscribers(prev => prev.map(s => 
                s.id === subscriberData.id 
                  ? { ...subscriberData, id: String(subscriberData.id), subscribedAt: s.subscribedAt } 
                  : s
              ))
            }
            setShowSubscriberModal(false)
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
