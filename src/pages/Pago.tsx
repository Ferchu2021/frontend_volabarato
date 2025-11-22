import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { apiService, Pago as PagoType, CreatePagoRequest, Reserva } from '../services/api'
import { motion } from 'framer-motion'
import { 
  FaCreditCard, 
  FaMoneyBillWave, 
  FaExchangeAlt,
  FaCheck,
  FaTimes,
  FaSpinner,
  FaCalendarAlt,
  FaDollarSign,
  FaFileInvoiceDollar
} from 'react-icons/fa'
import { convertCurrency, formatCurrency, CURRENCY_OPTIONS, Currency } from '../utils/currency'
import './Pago.css'

const Pago: React.FC = () => {
  const { reservaId } = useParams<{ reservaId: string }>()
  const navigate = useNavigate()
  
  const [reserva, setReserva] = useState<Reserva | null>(null)
  const [pago, setPago] = useState<PagoType | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('ARS')
  const [showSuccess, setShowSuccess] = useState(false)
  
  // Datos del formulario según método de pago
  const [formData, setFormData] = useState({
    metodoPago: 'efectivo' as 'efectivo' | 'tarjeta' | 'transferencia',
    // Datos para tarjeta
    numeroTarjeta: '',
    tipoTarjeta: 'visa',
    nombreTitular: '',
    fechaVencimiento: '',
    cvv: '',
    // Datos para transferencia
    numeroComprobante: '',
    banco: '',
    cuenta: '',
    // Datos para efectivo
    lugarPago: '',
    recibidoPor: '',
    observaciones: ''
  })

  useEffect(() => {
    if (reservaId) {
      loadReserva()
      loadPago()
    }
  }, [reservaId])

  const loadReserva = async () => {
    try {
      const reservaData = await apiService.getReservaById(reservaId!)
      setReserva(reservaData)
      
      // Establecer método de pago desde la reserva
      if (reservaData.metodoPago) {
        setFormData(prev => ({ ...prev, metodoPago: reservaData.metodoPago }))
      }
    } catch (error: any) {
      setError('Error al cargar la reserva: ' + (error.message || 'Error desconocido'))
    } finally {
      setLoading(false)
    }
  }

  const loadPago = async () => {
    try {
      const pagoData = await apiService.getPagoByReserva(reservaId!)
      setPago(pagoData)
    } catch (error: any) {
      // Si no existe pago, está bien, se creará uno nuevo
      if (error.message && !error.message.includes('404')) {
        console.error('Error cargando pago:', error)
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!reserva) {
      setError('Reserva no encontrada')
      return
    }

    if (reserva.estado !== 'confirmada') {
      setError('Solo se pueden procesar pagos para reservas confirmadas')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const pagoData: CreatePagoRequest = {
        reserva: reserva._id,
        metodoPago: formData.metodoPago,
        monto: reserva.precioTotal,
        moneda: (reserva.paquete as any)?.moneda || 'ARS',
        datosPago: {
          ...(formData.metodoPago === 'tarjeta' && {
            numeroTarjeta: formData.numeroTarjeta.slice(-4), // Solo últimos 4 dígitos
            tipoTarjeta: formData.tipoTarjeta
          }),
          ...(formData.metodoPago === 'transferencia' && {
            numeroComprobante: formData.numeroComprobante,
            banco: formData.banco,
            cuenta: formData.cuenta
          }),
          ...(formData.metodoPago === 'efectivo' && {
            lugarPago: formData.lugarPago,
            recibidoPor: formData.recibidoPor
          })
        },
        observaciones: formData.observaciones
      }

      if (pago) {
        // Actualizar pago existente
        await apiService.updatePago(pago._id, {
          datosPago: pagoData.datosPago,
          observaciones: pagoData.observaciones
        })
      } else {
        // Crear nuevo pago
        await apiService.createPago(pagoData)
      }

      setShowSuccess(true)
      setTimeout(() => {
        navigate('/mis-reservas')
      }, 2000)
    } catch (error: any) {
      setError('Error al procesar el pago: ' + (error.message || 'Error desconocido'))
    } finally {
      setSubmitting(false)
    }
  }

  const formatPrice = (amount: number, currencyFrom?: string) => {
    const sourceCurrency = currencyFrom || (reserva?.paquete as any)?.moneda || 'ARS'
    const converted = convertCurrency(amount, sourceCurrency as any, selectedCurrency)
    return formatCurrency(converted, selectedCurrency)
  }

  if (loading) {
    return (
      <div className="pago-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando información de pago...</p>
        </div>
      </div>
    )
  }

  if (!reserva) {
    return (
      <div className="pago-container">
        <div className="error-message">
          <p>Reserva no encontrada</p>
          <button onClick={() => navigate('/mis-reservas')}>Volver a mis reservas</button>
        </div>
      </div>
    )
  }

  if (reserva.estado !== 'confirmada') {
    return (
      <div className="pago-container">
        <div className="error-message">
          <p>Esta reserva no está confirmada. Solo se pueden procesar pagos para reservas confirmadas.</p>
          <button onClick={() => navigate('/mis-reservas')}>Volver a mis reservas</button>
        </div>
      </div>
    )
  }

  if (showSuccess) {
    return (
      <div className="pago-container">
        <motion.div 
          className="success-message"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <FaCheck size={64} color="#10b981" />
          <h2>¡Pago registrado exitosamente!</h2>
          <p>Tu información de pago ha sido registrada. Te contactaremos pronto para confirmar el pago.</p>
        </motion.div>
      </div>
    )
  }

  const paquete = reserva.paquete as any

  return (
    <div className="pago-container">
      <div className="pago-header">
        <h1>Procesar Pago</h1>
        <p>Completa la información según el método de pago elegido</p>
      </div>

      {/* Información de la reserva */}
      <div className="reserva-info-card">
        <h3>Información de la Reserva</h3>
        <div className="info-grid">
          <div className="info-item">
            <FaFileInvoiceDollar />
            <span><strong>Número de Reserva:</strong> {reserva.numeroReserva}</span>
          </div>
          <div className="info-item">
            <FaCalendarAlt />
            <span><strong>Paquete:</strong> {paquete?.nombre || 'N/A'}</span>
          </div>
          <div className="info-item">
            <FaDollarSign />
            <span><strong>Monto a Pagar:</strong> {formatPrice(reserva.precioTotal, paquete?.moneda)}</span>
          </div>
          <div className="info-item">
            <FaCreditCard />
            <span><strong>Método Elegido:</strong> {
              formData.metodoPago === 'efectivo' ? 'Efectivo' :
              formData.metodoPago === 'tarjeta' ? 'Tarjeta' : 'Transferencia'
            }</span>
          </div>
        </div>
      </div>

      {/* Selector de moneda */}
      <div className="currency-selector-section">
        <label htmlFor="currency-select-pago">
          <FaExchangeAlt /> Moneda de visualización:
        </label>
        <select 
          id="currency-select-pago"
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

      {/* Formulario de pago según método */}
      <form onSubmit={handleSubmit} className="pago-form">
        {formData.metodoPago === 'tarjeta' && (
          <div className="payment-method-section">
            <h3>Datos de Tarjeta</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="tipoTarjeta">Tipo de Tarjeta *</label>
                <select
                  id="tipoTarjeta"
                  name="tipoTarjeta"
                  value={formData.tipoTarjeta}
                  onChange={handleInputChange}
                  required
                >
                  <option value="visa">Visa</option>
                  <option value="mastercard">Mastercard</option>
                  <option value="american-express">American Express</option>
                  <option value="otra">Otra</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="numeroTarjeta">Número de Tarjeta (últimos 4 dígitos) *</label>
                <input
                  type="text"
                  id="numeroTarjeta"
                  name="numeroTarjeta"
                  value={formData.numeroTarjeta}
                  onChange={handleInputChange}
                  maxLength={4}
                  pattern="[0-9]{4}"
                  placeholder="1234"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="nombreTitular">Nombre del Titular *</label>
                <input
                  type="text"
                  id="nombreTitular"
                  name="nombreTitular"
                  value={formData.nombreTitular}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="fechaVencimiento">Fecha de Vencimiento *</label>
                <input
                  type="month"
                  id="fechaVencimiento"
                  name="fechaVencimiento"
                  value={formData.fechaVencimiento}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="cvv">CVV *</label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  maxLength={4}
                  pattern="[0-9]{3,4}"
                  placeholder="123"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {formData.metodoPago === 'transferencia' && (
          <div className="payment-method-section">
            <h3>Datos de Transferencia</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="banco">Banco *</label>
                <input
                  type="text"
                  id="banco"
                  name="banco"
                  value={formData.banco}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="cuenta">Número de Cuenta *</label>
                <input
                  type="text"
                  id="cuenta"
                  name="cuenta"
                  value={formData.cuenta}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="numeroComprobante">Número de Comprobante *</label>
                <input
                  type="text"
                  id="numeroComprobante"
                  name="numeroComprobante"
                  value={formData.numeroComprobante}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>
        )}

        {formData.metodoPago === 'efectivo' && (
          <div className="payment-method-section">
            <h3>Datos de Pago en Efectivo</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="lugarPago">Lugar de Pago *</label>
                <input
                  type="text"
                  id="lugarPago"
                  name="lugarPago"
                  value={formData.lugarPago}
                  onChange={handleInputChange}
                  placeholder="Oficina, dirección, etc."
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="recibidoPor">Recibido Por</label>
                <input
                  type="text"
                  id="recibidoPor"
                  name="recibidoPor"
                  value={formData.recibidoPor}
                  onChange={handleInputChange}
                  placeholder="Nombre de quien recibirá el pago"
                />
              </div>
            </div>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="observaciones">Observaciones</label>
          <textarea
            id="observaciones"
            name="observaciones"
            value={formData.observaciones}
            onChange={handleInputChange}
            rows={4}
            placeholder="Información adicional sobre el pago..."
          />
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn-secondary"
            onClick={() => navigate('/mis-reservas')}
          >
            <FaTimes /> Cancelar
          </button>
          <button 
            type="submit" 
            className="btn-primary"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <FaSpinner className="spinner" /> Procesando...
              </>
            ) : (
              <>
                <FaCheck /> Registrar Pago
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

      {pago && pago.estado === 'completado' && (
        <div className="pago-completado-banner">
          <FaCheck />
          <span>Este pago ya ha sido completado</span>
        </div>
      )}
    </div>
  )
}

export default Pago

