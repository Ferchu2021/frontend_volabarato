import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { apiService } from '../services/api'
import { FaEnvelope, FaArrowLeft, FaCheck, FaSpinner } from 'react-icons/fa'
import { motion } from 'framer-motion'
import './ForgotPassword.css'

interface ForgotPasswordFormData {
  email: string
}

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ForgotPasswordFormData>()

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setLoading(true)
    setError(null)

    try {
      await apiService.requestPasswordReset(data.email.trim().toLowerCase())
      setSuccess(true)
    } catch (error: any) {
      setError(error.message || 'Error al solicitar recuperación de contraseña')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="forgot-password-container">
        <motion.div
          className="forgot-password-card success-card"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <FaCheck size={64} color="#10b981" />
          <h2>¡Email enviado!</h2>
          <p>
            Si el email existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña.
          </p>
          <p className="info-text">
            Revisá tu bandeja de entrada y seguí las instrucciones del email.
          </p>
          <div className="form-actions">
            <Link to="/login" className="btn btn-primary">
              Volver al Login
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="forgot-password-header">
          <Link to="/login" className="back-link">
            <FaArrowLeft /> Volver al Login
          </Link>
          <h1>Recuperar Contraseña</h1>
          <p>Ingresá tu email y te enviaremos un enlace para restablecer tu contraseña</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="forgot-password-form">
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              <FaEnvelope /> Email *
            </label>
            <input
              id="email"
              type="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="tu@email.com"
              {...register('email', {
                required: 'El email es requerido',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'El email no es válido'
                }
              })}
            />
            {errors.email && (
              <span className="error-message">{errors.email.message}</span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? (
              <>
                <FaSpinner className="spinner" /> Enviando...
              </>
            ) : (
              <>
                <FaEnvelope /> Enviar Enlace de Recuperación
              </>
            )}
          </button>

          <div className="form-footer">
            <p>
              ¿Recordaste tu contraseña?{' '}
              <Link to="/login" className="link">
                Iniciar sesión
              </Link>
            </p>
            <p>
              ¿No tenés una cuenta?{' '}
              <Link to="/registro" className="link">
                Crear cuenta
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ForgotPassword

