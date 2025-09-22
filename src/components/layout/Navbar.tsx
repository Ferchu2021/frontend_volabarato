import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import { logoutUser } from '../../store/slices/authSlice'
import { FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa'
import './Navbar.css'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isAuthenticated } = useAppSelector(state => state.auth)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  // Logo image - puedes cambiar esta URL por tu logo
  const logoImage = '/images/logo-transparent.svg' // Logo transparente optimizado

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
          <img src={logoImage} alt="Logo" className="navbar-logo" />
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
              <Link to="/admin" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                <FaUser className="nav-icon" />
                Admin
              </Link>
              <button className="nav-link logout-btn" onClick={handleLogout}>
                <FaSignOutAlt className="nav-icon" />
                Salir
              </button>
            </>
          ) : (
            <Link to="/login" className="nav-link login-btn" onClick={() => setIsMenuOpen(false)}>
              Iniciar Sesión
            </Link>
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
