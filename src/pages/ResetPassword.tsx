import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { apiService } from '../services/api'
import { FaLock, FaEye, FaEyeSlash, FaCheck, FaTimes, FaArrowLeft } from 'react-icons/fa'
import { motion } from 'framer-motion'
import './ResetPassword.css'

interface ResetPasswordFormData {
  newPassword: string
  confirmPassword: string
}

const ResetPassword = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [tokenValid, setTokenValid] = useState<boolean | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<ResetPasswordFormData>()

  const newPassword = watch('newPassword')

  useEffect(() => {
    if (!token) {
      setTokenValid(false)
      setError('Token de recuperación no válido')
    } else {
      setTokenValid(true)
    }
  }, [token])

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setError('Token de recuperación no válido')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await apiService.resetPassword(token, data.newPassword)
      setSuccess(true)
      setTimeout(() => {
        navigate('/login', { 
          state: { message: 'Contraseña restablecida exitosamente. Por favor inicia sesión.' }
        })
      }, 2000)
    } catch (error: any) {
      setError(error.message || 'Error al restablecer la contraseña')
    } finally {
      setLoading(false)
    }
  }

  if (tokenValid === false) {
    return (
      <div className="reset-password-container">
        <div className="reset-password-card error-card">
          <FaTimes size={64} color="#ef4444" />
          <h2>Token Inválido</h2>
          <p>El enlace de recuperación no es válido o ha expirado.</p>
          <div className="form-actions">
            <Link to="/forgot-password" className="btn btn-primary">
              Solicitar Nuevo Enlace
            </Link>
            <Link to="/login" className="btn btn-secondary">
              Volver al Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="reset-password-container">
        <motion.div
          className="reset-password-card success-card"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <FaCheck size={64} color="#10b981" />
          <h2>¡Contraseña Restablecida!</h2>
          <p>Tu contraseña ha sido restablecida exitosamente.</p>
          <p>Serás redirigido al login en unos segundos...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <div className="reset-password-header">
          <Link to="/login" className="back-link">
            <FaArrowLeft /> Volver al Login
          </Link>
          <h1>Restablecer Contraseña</h1>
          <p>Ingresá tu nueva contraseña</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="reset-password-form">
          {error && (
            <div className="error-message">
              <FaTimes />
              <p>{error}</p>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="newPassword" className="form-label">
              <FaLock /> Nueva Contraseña *
            </label>
            <div className="password-input-wrapper">
              <input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                className={`form-input ${errors.newPassword ? 'error' : ''}`}
                placeholder="Mínimo 6 caracteres"
                {...register('newPassword', {
                  required: 'La nueva contraseña es requerida',
                  minLength: {
                    value: 6,
                    message: 'La contraseña debe tener al menos 6 caracteres'
                  }
                })}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.newPassword && (
              <span className="error-message">{errors.newPassword.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              <FaLock /> Confirmar Nueva Contraseña *
            </label>
            <div className="password-input-wrapper">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                placeholder="Repetí la nueva contraseña"
                {...register('confirmPassword', {
                  required: 'Por favor confirma tu nueva contraseña',
                  validate: value =>
                    value === newPassword || 'Las contraseñas no coinciden'
                })}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword.message}</span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading || !token}
          >
            {loading ? 'Restableciendo...' : (
              <>
                <FaCheck /> Restablecer Contraseña
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
          </div>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword

