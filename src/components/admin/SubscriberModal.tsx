import { useForm } from 'react-hook-form'
import { FaTimes, FaSave } from 'react-icons/fa'
import './SubscriberModal.css'

interface Subscriber {
  id?: string
  firstName: string
  lastName: string
  country: string
  city: string
  email: string
}

interface SubscriberModalProps {
  isOpen: boolean
  onClose: () => void
  subscriber?: Subscriber | null
  action: 'create' | 'edit'
  onSave: (subscriber: Subscriber) => void
}

const SubscriberModal = ({ isOpen, onClose, subscriber, action, onSave }: SubscriberModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<Subscriber>({
    defaultValues: subscriber || {
      firstName: '',
      lastName: '',
      country: '',
      city: '',
      email: ''
    }
  })

  const onSubmit = (data: Subscriber) => {
    const subscriberData = {
      ...data,
      id: subscriber?.id || Date.now().toString()
    }
    onSave(subscriberData)
    reset()
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{action === 'create' ? 'Crear Nuevo Suscriptor' : 'Editar Suscriptor'}</h3>
          <button className="modal-close" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal-body">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Nombre *</label>
                <input
                  type="text"
                  className={`form-input ${errors.firstName ? 'error' : ''}`}
                  placeholder="Nombre"
                  {...register('firstName', { 
                    required: 'El nombre es requerido',
                    minLength: { value: 2, message: 'El nombre debe tener al menos 2 caracteres' }
                  })}
                />
                {errors.firstName && (
                  <span className="error-message">{errors.firstName.message}</span>
                )}
              </div>
              
              <div className="form-group">
                <label className="form-label">Apellido *</label>
                <input
                  type="text"
                  className={`form-input ${errors.lastName ? 'error' : ''}`}
                  placeholder="Apellido"
                  {...register('lastName', { 
                    required: 'El apellido es requerido',
                    minLength: { value: 2, message: 'El apellido debe tener al menos 2 caracteres' }
                  })}
                />
                {errors.lastName && (
                  <span className="error-message">{errors.lastName.message}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">País *</label>
                <input
                  type="text"
                  className={`form-input ${errors.country ? 'error' : ''}`}
                  placeholder="País"
                  {...register('country', { 
                    required: 'El país es requerido',
                    minLength: { value: 2, message: 'El país debe tener al menos 2 caracteres' }
                  })}
                />
                {errors.country && (
                  <span className="error-message">{errors.country.message}</span>
                )}
              </div>
              
              <div className="form-group">
                <label className="form-label">Localidad *</label>
                <input
                  type="text"
                  className={`form-input ${errors.city ? 'error' : ''}`}
                  placeholder="Ciudad, Provincia"
                  {...register('city', { 
                    required: 'La localidad es requerida',
                    minLength: { value: 2, message: 'La localidad debe tener al menos 2 caracteres' }
                  })}
                />
                {errors.city && (
                  <span className="error-message">{errors.city.message}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email *</label>
              <input
                type="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="suscriptor@email.com"
                {...register('email', { 
                  required: 'El email es requerido',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Ingresa un email válido'
                  }
                })}
              />
              {errors.email && (
                <span className="error-message">{errors.email.message}</span>
              )}
            </div>
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={handleClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              <FaSave />
              {action === 'create' ? 'Crear Suscriptor' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SubscriberModal
