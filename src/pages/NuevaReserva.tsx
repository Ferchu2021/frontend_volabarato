import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../store/store'
import { createBooking } from '../store/slices/bookingSlice'
import { apiService, Paquete } from '../services/api'
import { motion } from 'framer-motion'
import { 
  FaCalendarAlt, 
  FaUsers, 
  FaCreditCard, 
  FaPhone, 
  FaEnvelope,
  FaUser,
  FaCheck,
  FaTimes,
  FaSpinner,
  FaExchangeAlt
} from 'react-icons/fa'
import { convertCurrency, formatCurrency, CURRENCY_OPTIONS, Currency } from '../utils/currency'
import './NuevaReserva.css'

interface FormData {
  paquete: string
  fechaViaje: string
  cantidadPersonas: number
  precioTotal: number
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia'
  observaciones: string
  datosContacto: {
    nombre: string
    email: string
    telefono: string
  }
}

const NuevaReserva: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { loading, error } = useSelector((state: RootState) => state.bookings)
  
  const [paquetes, setPaquetes] = useState<Paquete[]>([])
  const [selectedPaquete, setSelectedPaquete] = useState<Paquete | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('ARS')
  const [formData, setFormData] = useState<FormData>({
    paquete: '',
    fechaViaje: '',
    cantidadPersonas: 1,
    precioTotal: 0,
    metodoPago: 'efectivo',
    observaciones: '',
    datosContacto: {
      nombre: '',
      email: '',
      telefono: ''
    }
  })

  useEffect(() => {
    loadPaquetes()
  }, [])

  useEffect(() => {
    if (selectedPaquete) {
      setFormData(prev => ({
        ...prev,
        precioTotal: selectedPaquete.precio * formData.cantidadPersonas
      }))
    }
  }, [selectedPaquete, formData.cantidadPersonas])

  const loadPaquetes = async () => {
    try {
      const paquetesData = await apiService.getPaquetes()
      setPaquetes(paquetesData)
    } catch (error) {
      console.error('Error loading paquetes:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    if (name.startsWith('datosContacto.')) {
      const field = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        datosContacto: {
          ...prev.datosContacto,
          [field]: value
        }
      }))
    } else if (name === 'paquete') {
      const paquete = paquetes.find(p => p._id === value)
      setSelectedPaquete(paquete || null)
      setFormData(prev => ({
        ...prev,
        [name]: value,
        precioTotal: paquete ? paquete.precio * prev.cantidadPersonas : 0
      }))
    } else if (name === 'cantidadPersonas') {
      const cantidad = parseInt(value)
      setFormData(prev => ({
        ...prev,
        [name]: cantidad,
        precioTotal: selectedPaquete ? selectedPaquete.precio * cantidad : 0
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.paquete || !formData.fechaViaje || !formData.datosContacto.nombre || 
        !formData.datosContacto.email || !formData.datosContacto.telefono) {
      return
    }

    try {
      // No incluir usuario, el backend lo obtiene del token JWT
      const bookingData = {
        paquete: formData.paquete,
        fechaViaje: formData.fechaViaje,
        cantidadPersonas: formData.cantidadPersonas,
        precioTotal: formData.precioTotal,
        metodoPago: formData.metodoPago,
        observaciones: formData.observaciones,
        datosContacto: formData.datosContacto
      }
      await dispatch(createBooking(bookingData)).unwrap()
      setShowSuccess(true)
      // Reset form
      setFormData({
        paquete: '',
        fechaViaje: '',
        cantidadPersonas: 1,
        precioTotal: 0,
        metodoPago: 'efectivo',
        observaciones: '',
        datosContacto: {
          nombre: '',
          email: '',
          telefono: ''
        }
      })
      setSelectedPaquete(null)
    } catch (error) {
      console.error('Error creating booking:', error)
    }
  }

  const formatPrice = (amount: number) => {
    const converted = convertCurrency(amount, 'ARS', selectedCurrency)
    return formatCurrency(converted, selectedCurrency)
  }

  const getMinDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  if (showSuccess) {
    return (
      <div className="nueva-reserva-container">
        <motion.div 
          className="success-message"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <FaCheck size={64} color="#10b981" />
          <h2>¡Reserva creada exitosamente!</h2>
          <p>Tu reserva ha sido procesada y recibirás un email de confirmación.</p>
          <button 
            className="btn-primary"
            onClick={() => setShowSuccess(false)}
          >
            Hacer otra reserva
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="nueva-reserva-container">
      <div className="nueva-reserva-header">
        <h1>Nueva Reserva</h1>
        <p>Completa los datos para hacer tu reserva</p>
      </div>

      {/* Selector de moneda */}
      <div className="currency-selector-section">
        <label htmlFor="currency-select-reserva">
          <FaExchangeAlt /> Moneda de visualización:
        </label>
        <select 
          id="currency-select-reserva"
          value={selectedCurrency} 
          onChange={(e) => setSelectedCurrency(e.target.value as Currency)}
          className="currency-select"
        >
          {CURRENCY_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.symbol} {option.label}
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={handleSubmit} className="reserva-form">
        <div className="form-grid">
          {/* Selección de paquete */}
          <div className="form-group">
            <label htmlFor="paquete">
              <FaCalendarAlt /> Paquete de viaje *
            </label>
            <select
              id="paquete"
              name="paquete"
              value={formData.paquete}
              onChange={handleInputChange}
              required
            >
              <option value="">Selecciona un paquete</option>
              {paquetes.map(paquete => (
                <option key={paquete._id} value={paquete._id}>
                  {paquete.nombre} - {paquete.destino} ({formatPrice(paquete.precio)})
                </option>
              ))}
            </select>
          </div>

          {/* Fecha de viaje */}
          <div className="form-group">
            <label htmlFor="fechaViaje">
              <FaCalendarAlt /> Fecha de viaje *
            </label>
            <input
              type="date"
              id="fechaViaje"
              name="fechaViaje"
              value={formData.fechaViaje}
              onChange={handleInputChange}
              min={getMinDate()}
              required
            />
          </div>

          {/* Cantidad de personas */}
          <div className="form-group">
            <label htmlFor="cantidadPersonas">
              <FaUsers /> Cantidad de personas *
            </label>
            <input
              type="number"
              id="cantidadPersonas"
              name="cantidadPersonas"
              value={formData.cantidadPersonas}
              onChange={handleInputChange}
              min="1"
              max="20"
              required
            />
          </div>

          {/* Método de pago */}
          <div className="form-group">
            <label htmlFor="metodoPago">
              <FaCreditCard /> Método de pago *
            </label>
            <select
              id="metodoPago"
              name="metodoPago"
              value={formData.metodoPago}
              onChange={handleInputChange}
              required
            >
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta</option>
              <option value="transferencia">Transferencia</option>
            </select>
          </div>
        </div>

        {/* Información de contacto */}
        <div className="contact-section">
          <h3>Información de contacto</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="nombre">
                <FaUser /> Nombre completo *
              </label>
              <input
                type="text"
                id="nombre"
                name="datosContacto.nombre"
                value={formData.datosContacto.nombre}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">
                <FaEnvelope /> Email *
              </label>
              <input
                type="email"
                id="email"
                name="datosContacto.email"
                value={formData.datosContacto.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="telefono">
                <FaPhone /> Teléfono *
              </label>
              <input
                type="tel"
                id="telefono"
                name="datosContacto.telefono"
                value={formData.datosContacto.telefono}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Observaciones */}
        <div className="form-group">
          <label htmlFor="observaciones">
            Observaciones especiales
          </label>
          <textarea
            id="observaciones"
            name="observaciones"
            value={formData.observaciones}
            onChange={handleInputChange}
            rows={4}
            placeholder="Cualquier solicitud especial o información adicional..."
          />
        </div>

        {/* Resumen de precio */}
        {selectedPaquete && (
          <div className="price-summary">
            <h3>Resumen de precio</h3>
            <div className="price-details">
              <div className="price-item">
                <span>Precio por persona:</span>
                <div className="price-conversion">
                  <span className="main-price">{formatPrice(selectedPaquete.precio)}</span>
                  {selectedCurrency !== 'ARS' && (
                    <span className="original-price">
                      ({formatCurrency(selectedPaquete.precio, 'ARS')})
                    </span>
                  )}
                </div>
              </div>
              <div className="price-item">
                <span>Cantidad de personas:</span>
                <span>{formData.cantidadPersonas}</span>
              </div>
              <div className="price-item total">
                <span>Total:</span>
                <div className="price-conversion">
                  <span className="main-price">{formatPrice(formData.precioTotal)}</span>
                  {selectedCurrency !== 'ARS' && (
                    <span className="original-price">
                      ({formatCurrency(formData.precioTotal, 'ARS')})
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Botones */}
        <div className="form-actions">
          <button 
            type="button" 
            className="btn-secondary"
            onClick={() => window.history.back()}
          >
            <FaTimes /> Cancelar
          </button>
          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading || !formData.paquete || !formData.fechaViaje}
          >
            {loading ? (
              <>
                <FaSpinner className="spinner" /> Procesando...
              </>
            ) : (
              <>
                <FaCheck /> Confirmar reserva
              </>
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
    </div>
  )
}

export default NuevaReserva
