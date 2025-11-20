import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { FaTimes, FaSave } from 'react-icons/fa'
import ImageUpload from '../common/ImageUpload'
import './TravelModal.css'

interface Travel {
  id?: string
  title: string
  destination: string
  price: number
  currency?: string
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
  const [imageData, setImageData] = useState<string>('')
  const [imageError, setImageError] = useState<string>('')
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<Travel>({
    defaultValues: travel || {
      title: '',
      destination: '',
      price: 0,
      currency: 'ARS',
      duration: '',
      image: '',
      description: '',
      category: ''
    }
  })
  
  // Actualizar imageData cuando cambie travel
  useEffect(() => {
    if (travel?.image) {
      setImageData(travel.image)
      setImageError('')
    } else if (!travel && action === 'create') {
      setImageData('')
      setImageError('')
    }
  }, [travel, action])

  const onSubmit = (data: Travel) => {
    // Validar que haya imagen
    if (!imageData && !data.image) {
      setImageError('La imagen es requerida')
      return
    }
    
    setImageError('')
    
    const travelData = {
      ...data,
      id: travel?.id || Date.now().toString(),
      price: Number(data.price),
      image: imageData || data.image
    }
    onSave(travelData)
    reset()
    setImageData('')
    setImageError('')
  }
  
  const handleImageSelect = (image: string) => {
    setImageData(image)
    setImageError('')
    setValue('image', image, { shouldValidate: false })
  }
  
  const handleClose = () => {
    reset()
    setImageData('')
    setImageError('')
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
                <label className="form-label">Precio *</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="number"
                    step="0.01"
                    className={`form-input ${errors.price ? 'error' : ''}`}
                    placeholder="0.00"
                    min="0"
                    style={{ flex: '1' }}
                    {...register('price', { 
                      required: 'El precio es requerido',
                      min: { value: 0.01, message: 'El precio debe ser mayor a 0' }
                    })}
                  />
                  <select
                    className={`form-input ${errors.currency ? 'error' : ''}`}
                    style={{ width: '120px' }}
                    {...register('currency', { required: 'La moneda es requerida' })}
                  >
                    <option value="ARS">ARS</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
                {errors.price && (
                  <span className="error-message">{errors.price.message}</span>
                )}
                {errors.currency && (
                  <span className="error-message">{errors.currency.message}</span>
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
              <ImageUpload
                label="Imagen *"
                onImageSelect={handleImageSelect}
                currentImage={imageData || travel?.image}
                required={true}
                maxSize={10}
              />
              {imageError && (
                <span className="error-message" style={{ marginTop: '8px', display: 'block' }}>{imageError}</span>
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
                <option value="Caribe">Caribe</option>
                <option value="Europa">Europa</option>
                <option value="Estados Unidos">Estados Unidos</option>
                <option value="Sudamérica">Sudamérica</option>
                <option value="Asia">Asia</option>
                <option value="África">África</option>
                <option value="Cruceros">Cruceros</option>
                <option value="Hoteles">Hoteles</option>
                <option value="Actividades">Actividades</option>
                <option value="Trenes">Trenes</option>
                <option value="Alquileres de autos">Alquileres de autos</option>
                <option value="Seguro al viajero">Seguro al viajero</option>
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
