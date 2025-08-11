import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaInstagram, FaWhatsapp, FaFacebook, FaPaperPlane } from 'react-icons/fa'
import './Contact.css'

interface ContactFormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContactFormData>()

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    
    try {
      // Aquí se enviaría la información al backend
      // Por ahora simulamos el envío
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Enviar notificación por email
      const emailBody = `
        Nuevo mensaje de contacto:
        
        Nombre: ${data.name}
        Email: ${data.email}
        Teléfono: ${data.phone}
        Asunto: ${data.subject}
        Mensaje: ${data.message}
        
        Fecha: ${new Date().toLocaleDateString('es-AR')}
      `
      
      // En un entorno real, esto se enviaría al backend
      console.log('Datos del formulario:', data)
      console.log('Email a enviar:', emailBody)
      
      setIsSubmitted(true)
      reset()
      
      // Resetear el estado después de 5 segundos
      setTimeout(() => {
        setIsSubmitted(false)
      }, 5000)
      
    } catch (error) {
      console.error('Error al enviar el formulario:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="contact-success">
        <div className="container">
          <div className="success-content">
            <FaPaperPlane className="success-icon" />
            <h2>¡Mensaje enviado con éxito!</h2>
            <p>Gracias por contactarnos. Te responderemos a la brevedad posible.</p>
            <button 
              className="btn btn-primary"
              onClick={() => setIsSubmitted(false)}
            >
              Enviar otro mensaje
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="contact-page">
      <div className="hero-section">
        <div className="container">
          <h1>Contacto</h1>
          <p>Estamos aquí para ayudarte a planificar tu próxima aventura</p>
        </div>
      </div>

      <div className="container">
        <div className="contact-content">
          <div className="contact-info">
            <h2>Información de Contacto</h2>
            <p>
              ¿Tenés alguna pregunta sobre nuestros viajes? ¿Querés hacer una reserva? 
              ¿Necesitás información personalizada? No dudes en contactarnos.
            </p>
            
            <div className="contact-methods">
              <div className="contact-method">
                <div className="contact-icon">
                  <FaEnvelope />
                </div>
                <div className="contact-details">
                  <h4>Email</h4>
                  <a href="mailto:info@volabarato.com.ar">info@volabarato.com.ar</a>
                  <p>Respondemos en menos de 24 horas</p>
                </div>
              </div>

              <div className="contact-method">
                <div className="contact-icon">
                  <FaPhone />
                </div>
                <div className="contact-details">
                  <h4>WhatsApp</h4>
                  <a href="https://wa.me/+5493412163431" target="_blank" rel="noopener noreferrer">
                    +54 9 341 216-3431
                  </a>
                  <p>Chat directo y respuestas rápidas</p>
                </div>
              </div>

              <div className="contact-method">
                <div className="contact-icon">
                  <FaMapMarkerAlt />
                </div>
                <div className="contact-details">
                  <h4>Ubicación</h4>
                  <p>Rosario, Santa Fe, Argentina</p>
                  <p>Servicios en todo el país</p>
                </div>
              </div>
            </div>

            <div className="social-links">
              <h4>Seguinos en redes sociales</h4>
              <div className="social-buttons">
                <a 
                  href="https://instagram.com/volabaratooficial" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-btn instagram"
                >
                  <FaInstagram />
                  Instagram
                </a>
                <a 
                  href="https://wa.me/+5493412163431" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-btn whatsapp"
                >
                  <FaWhatsapp />
                  WhatsApp
                </a>
                <a 
                  href="https://www.facebook.com/profile.php?id=61577465587884" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-btn facebook"
                >
                  <FaFacebook />
                  Facebook
                </a>
              </div>
            </div>
          </div>

          <div className="contact-form-container">
            <h2>Envianos un mensaje</h2>
            <form className="contact-form" onSubmit={handleSubmit(onSubmit)}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Nombre completo *</label>
                  <input
                    id="name"
                    type="text"
                    className={`form-input ${errors.name ? 'error' : ''}`}
                    placeholder="Tu nombre completo"
                    {...register('name', { 
                      required: 'El nombre es requerido',
                      minLength: { value: 2, message: 'El nombre debe tener al menos 2 caracteres' }
                    })}
                  />
                  {errors.name && (
                    <span className="error-message">{errors.name.message}</span>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email *</label>
                  <input
                    id="email"
                    type="email"
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="tu@email.com"
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
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone" className="form-label">Teléfono</label>
                  <input
                    id="phone"
                    type="tel"
                    className={`form-input ${errors.phone ? 'error' : ''}`}
                    placeholder="+54 9 341 123-4567"
                    {...register('phone', { 
                      minLength: { value: 10, message: 'El teléfono debe tener al menos 10 caracteres' }
                    })}
                  />
                  {errors.phone && (
                    <span className="error-message">{errors.phone.message}</span>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="subject" className="form-label">Asunto *</label>
                  <input
                    id="subject"
                    type="text"
                    className={`form-input ${errors.subject ? 'error' : ''}`}
                    placeholder="¿En qué podemos ayudarte?"
                    {...register('subject', { 
                      required: 'El asunto es requerido',
                      minLength: { value: 5, message: 'El asunto debe tener al menos 5 caracteres' }
                    })}
                  />
                  {errors.subject && (
                    <span className="error-message">{errors.subject.message}</span>
                  )}
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="message" className="form-label">Mensaje *</label>
                <textarea
                  id="message"
                  className={`form-input form-textarea ${errors.message ? 'error' : ''}`}
                  placeholder="Cuéntanos más detalles sobre tu consulta..."
                  rows={5}
                  {...register('message', { 
                    required: 'El mensaje es requerido',
                    minLength: { value: 20, message: 'El mensaje debe tener al menos 20 caracteres' }
                  })}
                />
                {errors.message && (
                  <span className="error-message">{errors.message.message}</span>
                )}
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary contact-submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    Enviar Mensaje
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
