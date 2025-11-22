import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useAppDispatch } from './store/hooks'
import { checkAuthStatus } from './store/slices/authSlice'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Travels from './pages/Travels'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import Admin from './pages/Admin'
import MisReservas from './pages/MisReservas'
import NuevaReserva from './pages/NuevaReserva'
import Pago from './pages/Pago'
import ChangePassword from './pages/ChangePassword'
import ProtectedRoute from './components/auth/ProtectedRoute'
import AdminRoute from './components/auth/AdminRoute'
import './App.css'

function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(checkAuthStatus())
  }, [dispatch])

  return (
    <div className="App">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/viajes" element={<Travels />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            } 
          />
          <Route 
            path="/mis-reservas" 
            element={
              <ProtectedRoute>
                <MisReservas />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/nueva-reserva" 
            element={
              <ProtectedRoute>
                <NuevaReserva />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/pago/:reservaId" 
            element={
              <ProtectedRoute>
                <Pago />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/cambiar-contraseña" 
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
