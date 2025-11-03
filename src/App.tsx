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
import Admin from './pages/Admin'
import MisReservas from './pages/MisReservas'
import NuevaReserva from './pages/NuevaReserva'
import ProtectedRoute from './components/auth/ProtectedRoute'
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
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
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
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
