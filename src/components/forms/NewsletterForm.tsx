import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAppDispatch } from '../../store/hooks'
import { addSubscriber } from '../../store/slices/subscriberSlice'
import { FaPaperPlane, FaCheck } from 'react-icons/fa'
import './NewsletterForm.css'

interface NewsletterFormData {
  firstName: string
  lastName: string
  country: string
  city: string
  email: string
}

const NewsletterForm = () => {
  const dispatch = useAppDispatch()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<NewsletterFormData>()

  const onSubmit = async (data: NewsletterFormData) => {
    setIsSubmitting(true)
    setError(null)
    
    try {
      // Enviar al backend real usando Redux
      await dispatch(addSubscriber({
        nombre: data.firstName,
        apellido: data.lastName,
        email: data.email,
        pais: data.country,
        ciudad: data.city
      })).unwrap()
      
      setIsSubmitted(true)
      reset()
      
      // Resetear el estado después de 3 segundos
      setTimeout(() => {
        setIsSubmitted(false)
      }, 3000)
      
    } catch (error: any) {
      console.error('Error al enviar el formulario:', error)
      setError(error || 'Error al suscribirse. Por favor, intenta nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="newsletter-success">
        <FaCheck className="success-icon" />
        <h3>¡Gracias por suscribirte!</h3>
        <p>Te enviaremos las mejores ofertas y novedades de viajes.</p>
      </div>
    )
  }

  return (
    <form className="newsletter-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="form-row">
        <div className="form-group">
          <input
            type="text"
            placeholder="Nombre"
            className={`form-input ${errors.firstName ? 'error' : ''}`}
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
          <input
            type="text"
            placeholder="Apellido"
            className={`form-input ${errors.lastName ? 'error' : ''}`}
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
          <input
            type="text"
            placeholder="País"
            className={`form-input ${errors.country ? 'error' : ''}`}
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
          <input
            type="text"
            placeholder="Localidad"
            className={`form-input ${errors.city ? 'error' : ''}`}
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
        <input
          type="email"
          placeholder="Email"
          className={`form-input ${errors.email ? 'error' : ''}`}
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
      
      {error && (
        <div className="error-message" style={{ marginBottom: '1rem', color: '#e74c3c' }}>
          {error}
        </div>
      )}
      
      <button 
        type="submit" 
        className="btn btn-primary newsletter-submit-btn"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <div className="spinner"></div>
            Suscribiendo...
          </>
        ) : (
          <>
            <FaPaperPlane />
            Suscribirme
          </>
        )}
      </button>
    </form>
  )
}

export default NewsletterForm
