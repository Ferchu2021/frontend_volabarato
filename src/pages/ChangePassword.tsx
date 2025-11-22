import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAppSelector } from '../store/hooks'
import { apiService } from '../services/api'
import { FaLock, FaEye, FaEyeSlash, FaCheck, FaTimes, FaArrowLeft } from 'react-icons/fa'
import { motion } from 'framer-motion'
import './ChangePassword.css'

interface ChangePasswordFormData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

const ChangePassword = () => {
  const navigate = useNavigate()
  const { user } = useAppSelector(state => state.auth)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<ChangePasswordFormData>()

  const newPassword = watch('newPassword')

  const onSubmit = async (data: ChangePasswordFormData) => {
    if (!user?._id) {
      setError('No se pudo identificar al usuario')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await apiService.changePassword({
        id: user._id,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      })

      setSuccess(true)
      setTimeout(() => {
        navigate('/mis-reservas')
      }, 2000)
    } catch (error: any) {
      setError(error.message || 'Error al cambiar la contraseña')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="change-password-container">
        <motion.div
          className="success-message"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <FaCheck size={64} color="#10b981" />
          <h2>¡Contraseña actualizada exitosamente!</h2>
          <p>Tu contraseña ha sido cambiada correctamente.</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="change-password-container">
      <div className="change-password-card">
        <div className="change-password-header">
          <button 
            className="back-button"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft /> Volver
          </button>
          <h1>Cambiar Contraseña</h1>
          <p>Ingresá tu contraseña actual y elegí una nueva contraseña</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="change-password-form">
          {error && (
            <div className="error-message">
              <FaTimes />
              <p>{error}</p>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="currentPassword" className="form-label">
              <FaLock /> Contraseña Actual *
            </label>
            <div className="password-input-wrapper">
              <input
                id="currentPassword"
                type={showCurrentPassword ? 'text' : 'password'}
                className={`form-input ${errors.currentPassword ? 'error' : ''}`}
                placeholder="Ingresá tu contraseña actual"
                {...register('currentPassword', {
                  required: 'La contraseña actual es requerida',
                  minLength: {
                    value: 6,
                    message: 'La contraseña debe tener al menos 6 caracteres'
                  }
                })}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.currentPassword && (
              <span className="error-message">{errors.currentPassword.message}</span>
            )}
          </div>

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

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
            >
              <FaTimes /> Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Cambiando...' : (
                <>
                  <FaCheck /> Cambiar Contraseña
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ChangePassword

