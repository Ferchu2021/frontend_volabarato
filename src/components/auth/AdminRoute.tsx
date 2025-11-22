import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../store/hooks'

interface AdminRouteProps {
  children: React.ReactNode
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { isAuthenticated, loading, user } = useAppSelector(state => state.auth)
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        navigate('/login')
      } else if (user?.rol !== 'admin') {
        navigate('/')
      }
    }
  }, [isAuthenticated, loading, user, navigate])

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Verificando permisos...</p>
      </div>
    )
  }

  if (!isAuthenticated || user?.rol !== 'admin') {
    return null
  }

  return <>{children}</>
}

export default AdminRoute

