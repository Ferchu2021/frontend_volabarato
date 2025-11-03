import { useForm } from 'react-hook-form'
import { FaTimes, FaSave } from 'react-icons/fa'
import { Paquete } from '../../services/api'
import './BookingModal.css'

interface Booking {
  id?: string
  _id?: string
  travelId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  travelDate: string
  passengers: number
  totalPrice: number
  status: 'pending' | 'confirmed' | 'cancelled'
  paymentMethod?: 'efectivo' | 'tarjeta' | 'transferencia'
  notes?: string
}

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  booking?: Booking | null
  action: 'create' | 'edit'
  onSave: (booking: Booking) => void
  travels?: Paquete[]
}

const BookingModal = ({ isOpen, onClose, booking, action, onSave, travels = [] }: BookingModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<Booking>({
    defaultValues: booking || {
      travelId: '',
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      travelDate: '',
      passengers: 1,
      totalPrice: 0,
      status: 'pending',
      paymentMethod: 'tarjeta',
      notes: ''
    }
  })

  const onSubmit = (data: Booking) => {
    const bookingData = {
      ...data,
      id: booking?.id || Date.now().toString(),
      passengers: Number(data.passengers),
      totalPrice: Number(data.totalPrice)
    }
    onSave(bookingData)
    reset()
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{action === 'create' ? 'Crear Nueva Reserva' : 'Editar Reserva'}</h3>
          <button className="modal-close" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal-body">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Viaje *</label>
                <select
                  className={`form-input ${errors.travelId ? 'error' : ''}`}
                  {...register('travelId', { 
                    required: 'El viaje es requerido'
                  })}
                >
                  <option value="">Selecciona un viaje</option>
                  {travels.map(travel => (
                    <option key={travel._id} value={travel._id}>
                      {travel.nombre} - {travel.destino}
                    </option>
                  ))}
                </select>
                {errors.travelId && (
                  <span className="error-message">{errors.travelId.message}</span>
                )}
              </div>
              
              <div className="form-group">
                <label className="form-label">Nombre del Cliente *</label>
                <input
                  type="text"
                  className={`form-input ${errors.customerName ? 'error' : ''}`}
                  placeholder="Nombre completo"
                  {...register('customerName', { 
                    required: 'El nombre del cliente es requerido',
                    minLength: { value: 2, message: 'El nombre debe tener al menos 2 caracteres' }
                  })}
                />
                {errors.customerName && (
                  <span className="error-message">{errors.customerName.message}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Email del Cliente *</label>
                <input
                  type="email"
                  className={`form-input ${errors.customerEmail ? 'error' : ''}`}
                  placeholder="cliente@email.com"
                  {...register('customerEmail', { 
                    required: 'El email es requerido',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Ingresa un email válido'
                    }
                  })}
                />
                {errors.customerEmail && (
                  <span className="error-message">{errors.customerEmail.message}</span>
                )}
              </div>
              
              <div className="form-group">
                <label className="form-label">Teléfono del Cliente *</label>
                <input
                  type="tel"
                  className={`form-input ${errors.customerPhone ? 'error' : ''}`}
                  placeholder="+54 9 341 123-4567"
                  {...register('customerPhone', { 
                    required: 'El teléfono es requerido',
                    minLength: { value: 10, message: 'El teléfono debe tener al menos 10 caracteres' }
                  })}
                />
                {errors.customerPhone && (
                  <span className="error-message">{errors.customerPhone.message}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Fecha del Viaje *</label>
                <input
                  type="date"
                  className={`form-input ${errors.travelDate ? 'error' : ''}`}
                  {...register('travelDate', { 
                    required: 'La fecha del viaje es requerida'
                  })}
                />
                {errors.travelDate && (
                  <span className="error-message">{errors.travelDate.message}</span>
                )}
              </div>
              
              <div className="form-group">
                <label className="form-label">Número de Pasajeros *</label>
                <input
                  type="number"
                  className={`form-input ${errors.passengers ? 'error' : ''}`}
                  placeholder="1"
                  min="1"
                  max="50"
                  {...register('passengers', { 
                    required: 'El número de pasajeros es requerido',
                    min: { value: 1, message: 'Debe haber al menos 1 pasajero' },
                    max: { value: 50, message: 'Máximo 50 pasajeros' }
                  })}
                />
                {errors.passengers && (
                  <span className="error-message">{errors.passengers.message}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Precio Total (ARS) *</label>
                <input
                  type="number"
                  className={`form-input ${errors.totalPrice ? 'error' : ''}`}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  {...register('totalPrice', { 
                    required: 'El precio total es requerido',
                    min: { value: 0, message: 'El precio debe ser mayor a 0' }
                  })}
                />
                {errors.totalPrice && (
                  <span className="error-message">{errors.totalPrice.message}</span>
                )}
              </div>
              
              <div className="form-group">
                <label className="form-label">Método de Pago *</label>
                <select
                  className={`form-input ${errors.paymentMethod ? 'error' : ''}`}
                  {...register('paymentMethod', { 
                    required: 'El método de pago es requerido'
                  })}
                >
                  <option value="efectivo">Efectivo</option>
                  <option value="tarjeta">Tarjeta</option>
                  <option value="transferencia">Transferencia</option>
                </select>
                {errors.paymentMethod && (
                  <span className="error-message">{errors.paymentMethod.message}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Observaciones</label>
              <textarea
                className="form-input form-textarea"
                placeholder="Notas adicionales sobre la reserva..."
                rows={3}
                {...register('notes')}
              />
            </div>
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={handleClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              <FaSave />
              {action === 'create' ? 'Crear Reserva' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BookingModal
