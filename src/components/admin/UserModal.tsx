import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { User } from '../../store/slices/userSlice'
import './UserModal.css'

interface UserModalProps {
  isOpen: boolean
  onClose: () => void
  user: User | null
  action: 'create' | 'edit'
  onSave: (userData: any) => void
}

interface UserFormData {
  usuario: string
  password: string
  confirmPassword: string
  rol: 'admin' | 'cliente'
}

const UserModal = ({ isOpen, onClose, user, action, onSave }: UserModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<UserFormData>({
    defaultValues: {
      usuario: '',
      password: '',
      confirmPassword: '',
      rol: 'cliente'
    }
  })

  useEffect(() => {
    if (user && action === 'edit') {
      reset({
        usuario: user.usuario,
        password: '',
        confirmPassword: '',
        rol: user.rol || 'cliente'
      })
    } else {
      reset({
        usuario: '',
        password: '',
        confirmPassword: '',
        rol: 'cliente'
      })
    }
  }, [user, action, reset])

  const password = watch('password')

  const onSubmit = async (data: UserFormData) => {
    setIsSubmitting(true)
    try {
      const userData: any = { 
        usuario: data.usuario,
        rol: data.rol
      }
      if (action === 'create' || data.password) {
        userData.password = data.password
      }
      await onSave(userData)
      onClose()
    } catch (error) {
      console.error('Error guardando usuario:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-content user-modal">
        <div className="modal-header">
          <h2>{action === 'create' ? 'Crear Usuario' : 'Editar Usuario'}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="usuario">Usuario</label>
            <input
              id="usuario"
              type="text"
              className={errors.usuario ? 'error' : ''}
              {...register('usuario', {
                required: 'El usuario es requerido',
                minLength: {
                  value: 4,
                  message: 'El usuario debe tener al menos 4 caracteres'
                }
              })}
            />
            {errors.usuario && (
              <span className="error-message">{errors.usuario.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Contraseña {action === 'edit' && '(dejar en blanco para no cambiar)'}
            </label>
            <input
              id="password"
              type="password"
              className={errors.password ? 'error' : ''}
              {...register('password', {
                required: action === 'create' ? 'La contraseña es requerida' : false,
                minLength: {
                  value: 6,
                  message: 'La contraseña debe tener al menos 6 caracteres'
                }
              })}
            />
            {errors.password && (
              <span className="error-message">{errors.password.message}</span>
            )}
          </div>

          {action === 'create' && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Contraseña</label>
              <input
                id="confirmPassword"
                type="password"
                className={errors.confirmPassword ? 'error' : ''}
                {...register('confirmPassword', {
                  required: 'Por favor confirma la contraseña',
                  validate: value =>
                    value === password || 'Las contraseñas no coinciden'
                })}
              />
              {errors.confirmPassword && (
                <span className="error-message">{errors.confirmPassword.message}</span>
              )}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="rol">Rol</label>
            <select
              id="rol"
              className={errors.rol ? 'error' : ''}
              {...register('rol', {
                required: 'El rol es requerido'
              })}
            >
              <option value="cliente">Cliente</option>
              <option value="admin">Administrador</option>
            </select>
            {errors.rol && (
              <span className="error-message">{errors.rol.message}</span>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : action === 'create' ? 'Crear' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserModal

