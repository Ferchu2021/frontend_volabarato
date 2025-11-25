import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { apiService, Pago as PagoType, CreatePagoRequest, Reserva } from '../services/api'
import { motion } from 'framer-motion'
import { 
  FaCreditCard, 
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
    metodoPago: 'tarjeta' as 'tarjeta' | 'transferencia' | 'deposito',
    // Datos para tarjeta
    tipoTarjeta: 'credito' as 'credito' | 'debito',
    marcaTarjeta: 'visa' as 'visa' | 'mastercard' | 'american-express' | 'otra',
    numeroTarjeta: '',
    nombreTitular: '',
    mesVencimiento: '',
    anioVencimiento: '',
    cvv: '',
    // Datos para transferencia
    numeroComprobante: '',
    banco: '',
    cuenta: '',
    // Datos para depósito
    numeroComprobanteDeposito: '',
    bancoDeposito: '',
    sucursalDeposito: '',
    fechaDeposito: '',
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
      
      // NO establecer método de pago desde la reserva - el usuario debe seleccionarlo
      // El método de pago por defecto ya está establecido en el estado inicial ('tarjeta')
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
      
      // Si existe un pago con datos de tarjeta, cargar los datos en el formulario
      if (pagoData.datosPago && formData.metodoPago === 'tarjeta') {
        setFormData(prev => ({
          ...prev,
          tipoTarjeta: (pagoData.datosPago?.tipoTarjeta as any) || 'credito',
          marcaTarjeta: (pagoData.datosPago?.marcaTarjeta as any) || 'visa',
          nombreTitular: pagoData.datosPago?.nombreTitular || '',
          mesVencimiento: pagoData.datosPago?.mesVencimiento || '',
          anioVencimiento: pagoData.datosPago?.anioVencimiento || ''
        }))
      }
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
            numeroTarjeta: formData.numeroTarjeta.replace(/\s/g, '').slice(-4), // Solo últimos 4 dígitos para almacenar
            tipoTarjeta: formData.tipoTarjeta, // crédito o débito
            marcaTarjeta: formData.marcaTarjeta, // visa, mastercard, etc.
            nombreTitular: formData.nombreTitular,
            mesVencimiento: formData.mesVencimiento,
            anioVencimiento: formData.anioVencimiento
          }),
          ...(formData.metodoPago === 'transferencia' && {
            numeroComprobante: formData.numeroComprobante,
            banco: formData.banco,
            cuenta: formData.cuenta
          }),
          ...(formData.metodoPago === 'deposito' && {
            numeroComprobanteDeposito: formData.numeroComprobanteDeposito,
            bancoDeposito: formData.bancoDeposito,
            sucursalDeposito: formData.sucursalDeposito,
            fechaDeposito: formData.fechaDeposito
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
              formData.metodoPago === 'tarjeta' ? 'Tarjeta' :
              formData.metodoPago === 'transferencia' ? 'Transferencia' : 'Depósito Bancario'
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
        {/* Selector de método de pago */}
        <div className="payment-method-selector">
          <h3>Seleccionar Método de Pago</h3>
          <div className="payment-method-options">
            <label className={`payment-method-option ${formData.metodoPago === 'tarjeta' ? 'active' : ''}`}>
              <input
                type="radio"
                name="metodoPago"
                value="tarjeta"
                checked={formData.metodoPago === 'tarjeta'}
                onChange={(e) => setFormData(prev => ({ ...prev, metodoPago: e.target.value as 'tarjeta' }))}
              />
              <FaCreditCard />
              <span>Tarjeta</span>
            </label>
            <label className={`payment-method-option ${formData.metodoPago === 'transferencia' ? 'active' : ''}`}>
              <input
                type="radio"
                name="metodoPago"
                value="transferencia"
                checked={formData.metodoPago === 'transferencia'}
                onChange={(e) => setFormData(prev => ({ ...prev, metodoPago: e.target.value as 'transferencia' }))}
              />
              <FaExchangeAlt />
              <span>Transferencia</span>
            </label>
            <label className={`payment-method-option ${formData.metodoPago === 'deposito' ? 'active' : ''}`}>
              <input
                type="radio"
                name="metodoPago"
                value="deposito"
                checked={formData.metodoPago === 'deposito'}
                onChange={(e) => setFormData(prev => ({ ...prev, metodoPago: e.target.value as 'deposito' }))}
              />
              <FaFileInvoiceDollar />
              <span>Depósito Bancario</span>
            </label>
          </div>
        </div>

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
                  <option value="credito">Tarjeta de Crédito</option>
                  <option value="debito">Tarjeta de Débito</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="marcaTarjeta">Marca de Tarjeta *</label>
                <select
                  id="marcaTarjeta"
                  name="marcaTarjeta"
                  value={formData.marcaTarjeta}
                  onChange={handleInputChange}
                  required
                >
                  <option value="visa">Visa</option>
                  <option value="mastercard">Mastercard</option>
                  <option value="american-express">American Express</option>
                  <option value="otra">Otra</option>
                </select>
              </div>

              <div className="form-group form-group-full">
                <label htmlFor="numeroTarjeta">Número de Tarjeta *</label>
                <input
                  type="text"
                  id="numeroTarjeta"
                  name="numeroTarjeta"
                  value={formData.numeroTarjeta}
                  onChange={(e) => {
                    // Formatear número de tarjeta con espacios cada 4 dígitos
                    const value = e.target.value.replace(/\s/g, '').replace(/\D/g, '')
                    const formatted = value.match(/.{1,4}/g)?.join(' ') || value
                    setFormData(prev => ({ ...prev, numeroTarjeta: formatted }))
                  }}
                  maxLength={19} // 16 dígitos + 3 espacios
                  placeholder="1234 5678 9012 3456"
                  required
                />
                <small className="form-hint">Ingresá el número completo de tu tarjeta</small>
              </div>

              <div className="form-group form-group-full">
                <label htmlFor="nombreTitular">Nombre como aparece en la tarjeta *</label>
                <input
                  type="text"
                  id="nombreTitular"
                  name="nombreTitular"
                  value={formData.nombreTitular}
                  onChange={handleInputChange}
                  placeholder="JUAN PEREZ"
                  style={{ textTransform: 'uppercase' }}
                  required
                />
                <small className="form-hint">Ingresá el nombre exactamente como aparece en la tarjeta</small>
              </div>

              <div className="form-group">
                <label htmlFor="mesVencimiento">Mes de Vencimiento *</label>
                <select
                  id="mesVencimiento"
                  name="mesVencimiento"
                  value={formData.mesVencimiento}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccionar mes</option>
                  <option value="01">01 - Enero</option>
                  <option value="02">02 - Febrero</option>
                  <option value="03">03 - Marzo</option>
                  <option value="04">04 - Abril</option>
                  <option value="05">05 - Mayo</option>
                  <option value="06">06 - Junio</option>
                  <option value="07">07 - Julio</option>
                  <option value="08">08 - Agosto</option>
                  <option value="09">09 - Septiembre</option>
                  <option value="10">10 - Octubre</option>
                  <option value="11">11 - Noviembre</option>
                  <option value="12">12 - Diciembre</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="anioVencimiento">Año de Vencimiento *</label>
                <select
                  id="anioVencimiento"
                  name="anioVencimiento"
                  value={formData.anioVencimiento}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccionar año</option>
                  {Array.from({ length: 15 }, (_, i) => {
                    const year = new Date().getFullYear() + i
                    return (
                      <option key={year} value={year.toString().slice(-2)}>
                        {year}
                      </option>
                    )
                  })}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="cvv">Números en cara posterior (CVV) *</label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  value={formData.cvv}
                  onChange={(e) => {
                    // Solo permitir números y limitar longitud según tipo de tarjeta
                    const value = e.target.value.replace(/\D/g, '')
                    const maxLength = formData.marcaTarjeta === 'american-express' ? 4 : 3
                    setFormData(prev => ({ ...prev, cvv: value.slice(0, maxLength) }))
                  }}
                  maxLength={formData.marcaTarjeta === 'american-express' ? 4 : 3}
                  pattern={formData.marcaTarjeta === 'american-express' ? '[0-9]{4}' : '[0-9]{3}'}
                  placeholder={formData.marcaTarjeta === 'american-express' ? '1234' : '123'}
                  required
                />
                <small className="form-hint">Los 3 o 4 dígitos en el reverso de tu tarjeta</small>
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

        {formData.metodoPago === 'deposito' && (
          <div className="payment-method-section">
            <h3>Datos de Depósito Bancario</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="bancoDeposito">Banco *</label>
                <input
                  type="text"
                  id="bancoDeposito"
                  name="bancoDeposito"
                  value={formData.bancoDeposito}
                  onChange={handleInputChange}
                  placeholder="Nombre del banco"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="sucursalDeposito">Sucursal</label>
                <input
                  type="text"
                  id="sucursalDeposito"
                  name="sucursalDeposito"
                  value={formData.sucursalDeposito}
                  onChange={handleInputChange}
                  placeholder="Número o nombre de sucursal"
                />
              </div>

              <div className="form-group">
                <label htmlFor="numeroComprobanteDeposito">Número de Comprobante *</label>
                <input
                  type="text"
                  id="numeroComprobanteDeposito"
                  name="numeroComprobanteDeposito"
                  value={formData.numeroComprobanteDeposito}
                  onChange={handleInputChange}
                  placeholder="Número de comprobante de depósito"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="fechaDeposito">Fecha de Depósito</label>
                <input
                  type="date"
                  id="fechaDeposito"
                  name="fechaDeposito"
                  value={formData.fechaDeposito}
                  onChange={handleInputChange}
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

