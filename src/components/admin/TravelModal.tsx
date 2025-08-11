import { useForm } from 'react-hook-form'
import { FaTimes, FaSave } from 'react-icons/fa'
import './TravelModal.css'

interface Travel {
  id?: string
  title: string
  destination: string
  price: number
  duration: string
  image: string
  description: string
  category: string
}

interface TravelModalProps {
  isOpen: boolean
  onClose: () => void
  travel?: Travel | null
  action: 'create' | 'edit'
  onSave: (travel: Travel) => void
}

const TravelModal = ({ isOpen, onClose, travel, action, onSave }: TravelModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<Travel>({
    defaultValues: travel || {
      title: '',
      destination: '',
      price: 0,
      duration: '',
      image: '',
      description: '',
      category: ''
    }
  })

  const onSubmit = (data: Travel) => {
    const travelData = {
      ...data,
      id: travel?.id || Date.now().toString(),
      price: Number(data.price)
    }
    onSave(travelData)
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
          <h3>{action === 'create' ? 'Crear Nuevo Viaje' : 'Editar Viaje'}</h3>
          <button className="modal-close" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal-body">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Título *</label>
                <input
                  type="text"
                  className={`form-input ${errors.title ? 'error' : ''}`}
                  placeholder="Nombre del viaje"
                  {...register('title', { 
                    required: 'El título es requerido',
                    minLength: { value: 3, message: 'El título debe tener al menos 3 caracteres' }
                  })}
                />
                {errors.title && (
                  <span className="error-message">{errors.title.message}</span>
                )}
              </div>
              
              <div className="form-group">
                <label className="form-label">Destino *</label>
                <input
                  type="text"
                  className={`form-input ${errors.destination ? 'error' : ''}`}
                  placeholder="Ciudad, País"
                  {...register('destination', { 
                    required: 'El destino es requerido',
                    minLength: { value: 3, message: 'El destino debe tener al menos 3 caracteres' }
                  })}
                />
                {errors.destination && (
                  <span className="error-message">{errors.destination.message}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Precio (ARS) *</label>
                <input
                  type="number"
                  className={`form-input ${errors.price ? 'error' : ''}`}
                  placeholder="0"
                  min="0"
                  {...register('price', { 
                    required: 'El precio es requerido',
                    min: { value: 0, message: 'El precio debe ser mayor a 0' }
                  })}
                />
                {errors.price && (
                  <span className="error-message">{errors.price.message}</span>
                )}
              </div>
              
              <div className="form-group">
                <label className="form-label">Duración *</label>
                <input
                  type="text"
                  className={`form-input ${errors.duration ? 'error' : ''}`}
                  placeholder="ej: 3 días, 1 semana"
                  {...register('duration', { 
                    required: 'La duración es requerida',
                    minLength: { value: 2, message: 'La duración debe tener al menos 2 caracteres' }
                  })}
                />
                {errors.duration && (
                  <span className="error-message">{errors.duration.message}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">URL de la imagen *</label>
              <input
                type="url"
                className={`form-input ${errors.image ? 'error' : ''}`}
                placeholder="https://ejemplo.com/imagen.jpg"
                {...register('image', { 
                  required: 'La URL de la imagen es requerida',
                  pattern: {
                    value: /^https?:\/\/.+/,
                    message: 'Ingresa una URL válida'
                  }
                })}
              />
              {errors.image && (
                <span className="error-message">{errors.image.message}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Categoría *</label>
              <select
                className={`form-input ${errors.category ? 'error' : ''}`}
                {...register('category', { 
                  required: 'La categoría es requerida'
                })}
              >
                <option value="">Selecciona una categoría</option>
                <option value="Gastronomía">Gastronomía</option>
                <option value="Aventura">Aventura</option>
                <option value="Cultural">Cultural</option>
                <option value="Relax">Relax</option>
                <option value="Social">Social</option>
                <option value="Corporativo">Corporativo</option>
                <option value="Deportes">Deportes</option>
              </select>
              {errors.category && (
                <span className="error-message">{errors.category.message}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Descripción *</label>
              <textarea
                className={`form-input form-textarea ${errors.description ? 'error' : ''}`}
                placeholder="Describe el viaje, incluyendo actividades, alojamiento, etc."
                rows={4}
                {...register('description', { 
                  required: 'La descripción es requerida',
                  minLength: { value: 20, message: 'La descripción debe tener al menos 20 caracteres' }
                })}
              />
              {errors.description && (
                <span className="error-message">{errors.description.message}</span>
              )}
            </div>
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={handleClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              <FaSave />
              {action === 'create' ? 'Crear Viaje' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TravelModal
