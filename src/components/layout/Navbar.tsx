import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import { logoutUser } from '../../store/slices/authSlice'
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaCalendarAlt, FaPlus, FaLock } from 'react-icons/fa'
import './Navbar.css'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isAuthenticated, user } = useAppSelector(state => state.auth)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await dispatch(logoutUser())
    navigate('/')
    setIsMenuOpen(false)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <img
            src="/images/logo1.jpeg"
            alt="Volá Barato"
            className="navbar-logo"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        </Link>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Inicio
          </Link>
          <Link to="/viajes" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Viajes
          </Link>
          <Link to="/contacto" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Contacto
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/mis-reservas" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                <FaCalendarAlt className="nav-icon" />
                Mis Reservas
              </Link>
              <Link to="/nueva-reserva" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                <FaPlus className="nav-icon" />
                Nueva Reserva
              </Link>
              {user?.rol === 'admin' && (
                <Link to="/admin" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  <FaUser className="nav-icon" />
                  Admin
                </Link>
              )}
              <Link to="/cambiar-contraseña" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                <FaLock className="nav-icon" />
                Cambiar Contraseña
              </Link>
              <button className="nav-link logout-btn" onClick={handleLogout}>
                <FaSignOutAlt className="nav-icon" />
                Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/registro" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Crear Cuenta
              </Link>
              <Link to="/login" className="nav-link login-btn" onClick={() => setIsMenuOpen(false)}>
                Iniciar Sesión
              </Link>
            </>
          )}
        </div>

        <button className="navbar-toggle" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </nav>
  )
}

export default Navbar
