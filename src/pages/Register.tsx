import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { registerUser } from '../store/slices/authSlice'
import { 
  FaUser, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaArrowLeft,
  FaIdCard,
  FaCalendarAlt,
  FaGlobe,
  FaPassport,
  FaPhone,
  FaEnvelope
} from 'react-icons/fa'
import './Register.css'

interface RegisterFormData {
  usuario: string
  password: string
  confirmPassword: string
  nombreLegal: string
  fechaNacimiento: string
  nacionalidad: string
  dni: string
  cuilCuit: string
  numeroPasaporte: string
  telefono: string
  telefonoContacto: string
  email: string
}

const Register = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector(state => state.auth)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<RegisterFormData>()

  const password = watch('password')

  const onSubmit = async (data: RegisterFormData) => {
    try {
      // Preparar datos para el backend
      const cleanedData: any = {
        usuario: data.usuario.trim(),
        password: data.password,
        nombreLegal: data.nombreLegal.trim(),
        fechaNacimiento: data.fechaNacimiento, // Se envía como string "YYYY-MM-DD", el backend lo convierte a Date
        nacionalidad: data.nacionalidad.trim(),
        dni: data.dni.trim(),
        numeroPasaporte: data.numeroPasaporte.trim(),
        telefono: data.telefono.trim(),
        telefonoContacto: data.telefonoContacto.trim(),
        email: data.email.trim().toLowerCase()
      }
      
      // Solo agregar cuilCuit si tiene valor (no string vacío)
      if (data.cuilCuit && data.cuilCuit.trim() !== '') {
        cleanedData.cuilCuit = data.cuilCuit.trim()
      }
      
      await dispatch(registerUser(cleanedData)).unwrap()
      // Redirigir al login después del registro exitoso
      navigate('/login', { 
        state: { message: 'Cuenta creada exitosamente. Por favor inicia sesión.' }
      })
    } catch (error: any) {
      console.error('Error en registro:', error)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <Link to="/" className="back-link">
            <FaArrowLeft /> Volver al inicio
          </Link>
          <h1>Crear Cuenta</h1>
          <p>Unite a Volá Barato y comenzá a planear tu próximo viaje</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="register-form">
      {error && (
        <div className="error-message">
          <p><strong>{error}</strong></p>
          {error.includes('ya existe') || error.includes('ya está registrado') ? (
            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
              ¿Ya tenés una cuenta? <Link to="/login" className="link">Iniciá sesión aquí</Link>
            </p>
          ) : null}
        </div>
      )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nombreLegal" className="form-label">
                <FaUser /> Nombre Legal *
              </label>
              <input
                id="nombreLegal"
                type="text"
                className={`form-input ${errors.nombreLegal ? 'error' : ''}`}
                placeholder="Nombre completo"
                {...register('nombreLegal', {
                  required: 'El nombre legal es requerido',
                  minLength: {
                    value: 2,
                    message: 'El nombre debe tener al menos 2 caracteres'
                  },
                  maxLength: {
                    value: 100,
                    message: 'El nombre no puede tener más de 100 caracteres'
                  }
                })}
              />
              {errors.nombreLegal && (
                <span className="error-message">{errors.nombreLegal.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="fechaNacimiento" className="form-label">
                <FaCalendarAlt /> Fecha de Nacimiento *
              </label>
              <input
                id="fechaNacimiento"
                type="date"
                className={`form-input ${errors.fechaNacimiento ? 'error' : ''}`}
                {...register('fechaNacimiento', {
                  required: 'La fecha de nacimiento es requerida',
                  validate: (value) => {
                    const fecha = new Date(value)
                    const hoy = new Date()
                    if (fecha >= hoy) {
                      return 'La fecha de nacimiento debe ser anterior a hoy'
                    }
                    const edad = hoy.getFullYear() - fecha.getFullYear()
                    if (edad < 18) {
                      return 'Debes ser mayor de 18 años'
                    }
                    return true
                  }
                })}
              />
              {errors.fechaNacimiento && (
                <span className="error-message">{errors.fechaNacimiento.message}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nacionalidad" className="form-label">
                <FaGlobe /> Nacionalidad *
              </label>
              <input
                id="nacionalidad"
                type="text"
                className={`form-input ${errors.nacionalidad ? 'error' : ''}`}
                placeholder="Ej: Argentina"
                {...register('nacionalidad', {
                  required: 'La nacionalidad es requerida',
                  minLength: {
                    value: 2,
                    message: 'La nacionalidad debe tener al menos 2 caracteres'
                  }
                })}
              />
              {errors.nacionalidad && (
                <span className="error-message">{errors.nacionalidad.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="dni" className="form-label">
                <FaIdCard /> DNI *
              </label>
              <input
                id="dni"
                type="text"
                className={`form-input ${errors.dni ? 'error' : ''}`}
                placeholder="12345678"
                {...register('dni', {
                  required: 'El DNI es requerido',
                  minLength: {
                    value: 7,
                    message: 'El DNI debe tener al menos 7 caracteres'
                  },
                  maxLength: {
                    value: 10,
                    message: 'El DNI no puede tener más de 10 caracteres'
                  },
                  pattern: {
                    value: /^[0-9]+$/,
                    message: 'El DNI solo puede contener números'
                  }
                })}
              />
              {errors.dni && (
                <span className="error-message">{errors.dni.message}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cuilCuit" className="form-label">
                <FaIdCard /> CUIL o CUIT
              </label>
              <input
                id="cuilCuit"
                type="text"
                className={`form-input ${errors.cuilCuit ? 'error' : ''}`}
                placeholder="20-12345678-9 (opcional)"
                {...register('cuilCuit', {
                  minLength: {
                    value: 10,
                    message: 'El CUIL/CUIT debe tener al menos 10 caracteres'
                  },
                  maxLength: {
                    value: 13,
                    message: 'El CUIL/CUIT no puede tener más de 13 caracteres'
                  }
                })}
              />
              {errors.cuilCuit && (
                <span className="error-message">{errors.cuilCuit.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="numeroPasaporte" className="form-label">
                <FaPassport /> Número de Pasaporte *
              </label>
              <input
                id="numeroPasaporte"
                type="text"
                className={`form-input ${errors.numeroPasaporte ? 'error' : ''}`}
                placeholder="ABC123456"
                {...register('numeroPasaporte', {
                  required: 'El número de pasaporte es requerido',
                  minLength: {
                    value: 5,
                    message: 'El número de pasaporte debe tener al menos 5 caracteres'
                  },
                  maxLength: {
                    value: 20,
                    message: 'El número de pasaporte no puede tener más de 20 caracteres'
                  }
                })}
              />
              {errors.numeroPasaporte && (
                <span className="error-message">{errors.numeroPasaporte.message}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="telefono" className="form-label">
                <FaPhone /> Teléfono *
              </label>
              <input
                id="telefono"
                type="tel"
                className={`form-input ${errors.telefono ? 'error' : ''}`}
                placeholder="+54 11 1234-5678"
                {...register('telefono', {
                  required: 'El teléfono es requerido',
                  minLength: {
                    value: 8,
                    message: 'El teléfono debe tener al menos 8 caracteres'
                  },
                  maxLength: {
                    value: 20,
                    message: 'El teléfono no puede tener más de 20 caracteres'
                  }
                })}
              />
              {errors.telefono && (
                <span className="error-message">{errors.telefono.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="telefonoContacto" className="form-label">
                <FaPhone /> Teléfono de Contacto *
              </label>
              <input
                id="telefonoContacto"
                type="tel"
                className={`form-input ${errors.telefonoContacto ? 'error' : ''}`}
                placeholder="+54 11 1234-5678"
                {...register('telefonoContacto', {
                  required: 'El teléfono de contacto es requerido',
                  minLength: {
                    value: 8,
                    message: 'El teléfono de contacto debe tener al menos 8 caracteres'
                  },
                  maxLength: {
                    value: 20,
                    message: 'El teléfono de contacto no puede tener más de 20 caracteres'
                  }
                })}
              />
              {errors.telefonoContacto && (
                <span className="error-message">{errors.telefonoContacto.message}</span>
              )}
            </div>
          </div>

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

          <div className="form-group">
            <label htmlFor="usuario" className="form-label">
              <FaUser /> Usuario *
            </label>
            <input
              id="usuario"
              type="text"
              className={`form-input ${errors.usuario ? 'error' : ''}`}
              placeholder="tu_usuario"
              {...register('usuario', {
                required: 'El usuario es requerido',
                minLength: {
                  value: 4,
                  message: 'El usuario debe tener al menos 4 caracteres'
                },
                maxLength: {
                  value: 30,
                  message: 'El usuario no puede tener más de 30 caracteres'
                },
                pattern: {
                  value: /^[a-zA-Z0-9_]+$/,
                  message: 'El usuario solo puede contener letras, números y guiones bajos'
                }
              })}
            />
            {errors.usuario && (
              <span className="error-message">{errors.usuario.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              <FaLock /> Contraseña
            </label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="Mínimo 6 caracteres"
                {...register('password', {
                  required: 'La contraseña es requerida',
                  minLength: {
                    value: 6,
                    message: 'La contraseña debe tener al menos 6 caracteres'
                  }
                })}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <span className="error-message">{errors.password.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              <FaLock /> Confirmar Contraseña
            </label>
            <div className="password-input-wrapper">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                placeholder="Repetí tu contraseña"
                {...register('confirmPassword', {
                  required: 'Por favor confirma tu contraseña',
                  validate: value =>
                    value === password || 'Las contraseñas no coinciden'
                })}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={toggleConfirmPasswordVisibility}
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
            disabled={loading}
          >
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>

          <div className="register-footer">
            <p>
              ¿Ya tenés una cuenta?{' '}
              <Link to="/login" className="link">
                Iniciá sesión
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register

