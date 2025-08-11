import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { loginUser, clearError } from '../store/slices/authSlice'
import { FaEye, FaEyeSlash, FaSignInAlt } from 'react-icons/fa'
import './Login.css'

interface LoginFormData {
  email: string
  password: string
}

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { isAuthenticated, loading, error } = useAppSelector(state => state.auth)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin')
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    return () => {
      dispatch(clearError())
    }
  }, [dispatch])

  const onSubmit = async (data: LoginFormData) => {
    try {
      await dispatch(loginUser(data)).unwrap()
    } catch (error) {
      console.error('Error en el login:', error)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Iniciando sesión...</p>
      </div>
    )
  }

  return (
    <div className="login-page">
      <div className="container">
        <div className="login-container">
          <div className="login-header">
            <h1>Iniciar Sesión</h1>
            <p>Accedé al panel de administración de Volá Barato</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="error-alert">
                <p>{error}</p>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
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
                    message: 'Ingresa un email válido'
                  }
                })}
              />
              {errors.email && (
                <span className="error-message">{errors.email.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Contraseña
              </label>
              <div className="password-input-container">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="Tu contraseña"
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

            <button type="submit" className="btn btn-primary login-submit-btn">
              <FaSignInAlt />
              Iniciar Sesión
            </button>
          </form>

          <div className="login-footer">
            <p>
              ¿Tenés problemas para acceder?{' '}
              <a href="mailto:info@volabarato.com.ar">Contactanos</a>
            </p>
            <Link to="/" className="back-home">
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
