import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
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
  metodoPago: 'tarjeta' | 'transferencia' | 'deposito'
  observaciones: string
  datosContacto: {
    nombre: string
    email: string
    telefono: string
  }
  // Datos para tarjeta
  tipoTarjeta?: 'credito' | 'debito'
  marcaTarjeta?: 'visa' | 'mastercard' | 'american-express' | 'otra'
  numeroTarjeta?: string
  nombreTitular?: string
  mesVencimiento?: string
  anioVencimiento?: string
  cvv?: string
  // Datos para transferencia
  numeroComprobante?: string
  banco?: string
  cuenta?: string
  // Datos para depósito
  numeroComprobanteDeposito?: string
  bancoDeposito?: string
  sucursalDeposito?: string
  fechaDeposito?: string
}

const NuevaReserva: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [searchParams] = useSearchParams()
  const { loading, error } = useSelector((state: RootState) => state.bookings)
  const { user } = useSelector((state: RootState) => state.auth)
  
  const [paquetes, setPaquetes] = useState<Paquete[]>([])
  const [selectedPaquete, setSelectedPaquete] = useState<Paquete | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('ARS')
  const [formData, setFormData] = useState<FormData>({
    paquete: '',
    fechaViaje: '',
    cantidadPersonas: 1,
    precioTotal: 0,
    metodoPago: 'tarjeta',
    observaciones: '',
    datosContacto: {
      nombre: '',
      email: '',
      telefono: ''
    },
    // Datos para tarjeta
    tipoTarjeta: 'credito',
    marcaTarjeta: 'visa',
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
    fechaDeposito: ''
  })

  useEffect(() => {
    loadPaquetes()
  }, [])

  // Preseleccionar paquete desde query params
  useEffect(() => {
    const paqueteId = searchParams.get('paquete')
    if (paqueteId && paquetes.length > 0) {
      const paquete = paquetes.find(p => p._id === paqueteId)
      if (paquete) {
        setSelectedPaquete(paquete)
        setFormData(prev => ({
          ...prev,
          paquete: paqueteId,
          precioTotal: paquete.precio * prev.cantidadPersonas
        }))
      }
    }
  }, [searchParams, paquetes])

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

    if (!user?._id) {
      alert('Debes estar autenticado para hacer una reserva')
      return
    }

    try {
      const bookingData = {
        paquete: formData.paquete,
        fechaViaje: formData.fechaViaje,
        cantidadPersonas: formData.cantidadPersonas,
        precioTotal: formData.precioTotal,
        metodoPago: formData.metodoPago,
        observaciones: formData.observaciones,
        usuario: user._id,
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
        metodoPago: 'tarjeta',
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

  const formatPrice = (amount: number, currencyFrom?: string) => {
    // Usar la moneda del paquete si está disponible, sino asumir ARS
    const sourceCurrency = currencyFrom || selectedPaquete?.moneda || 'ARS'
    const converted = convertCurrency(amount, sourceCurrency as any, selectedCurrency)
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
                  {paquete.nombre} - {paquete.destino} ({formatPrice(paquete.precio, paquete.moneda)})
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
              <option value="deposito">Depósito Bancario</option>
              <option value="tarjeta">Tarjeta de Crédito/Débito</option>
              <option value="transferencia">Transferencia Bancaria</option>
            </select>
          </div>
        </div>

        {/* Campos condicionales según método de pago */}
        {formData.metodoPago === 'tarjeta' && (
          <div className="payment-method-section">
            <h3>Datos de Tarjeta</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="tipoTarjeta">Tipo de Tarjeta *</label>
                <select
                  id="tipoTarjeta"
                  name="tipoTarjeta"
                  value={formData.tipoTarjeta || 'credito'}
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
                  value={formData.marcaTarjeta || 'visa'}
                  onChange={handleInputChange}
                  required
                >
                  <option value="visa">Visa</option>
                  <option value="mastercard">Mastercard</option>
                  <option value="american-express">American Express</option>
                  <option value="otra">Otra</option>
                </select>
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="numeroTarjeta">Número de Tarjeta *</label>
                <input
                  type="text"
                  id="numeroTarjeta"
                  name="numeroTarjeta"
                  value={formData.numeroTarjeta || ''}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\s/g, '').replace(/\D/g, '')
                    const formatted = value.match(/.{1,4}/g)?.join(' ') || value
                    setFormData(prev => ({ ...prev, numeroTarjeta: formatted }))
                  }}
                  maxLength={19}
                  placeholder="1234 5678 9012 3456"
                  required
                />
                <small style={{ display: 'block', marginTop: '0.25rem', color: '#666', fontSize: '0.875rem' }}>
                  Ingresá el número completo de tu tarjeta
                </small>
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="nombreTitular">Nombre como aparece en la tarjeta *</label>
                <input
                  type="text"
                  id="nombreTitular"
                  name="nombreTitular"
                  value={formData.nombreTitular || ''}
                  onChange={handleInputChange}
                  placeholder="JUAN PEREZ"
                  style={{ textTransform: 'uppercase' }}
                  required
                />
                <small style={{ display: 'block', marginTop: '0.25rem', color: '#666', fontSize: '0.875rem' }}>
                  Ingresá el nombre exactamente como aparece en la tarjeta
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="mesVencimiento">Mes de Vencimiento *</label>
                <select
                  id="mesVencimiento"
                  name="mesVencimiento"
                  value={formData.mesVencimiento || ''}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccionar mes</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                    <option key={month} value={month.toString().padStart(2, '0')}>
                      {month.toString().padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="anioVencimiento">Año de Vencimiento *</label>
                <select
                  id="anioVencimiento"
                  name="anioVencimiento"
                  value={formData.anioVencimiento || ''}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccionar año</option>
                  {Array.from({ length: 20 }, (_, i) => new Date().getFullYear() + i).map(year => (
                    <option key={year} value={year.toString().slice(-2)}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="cvv">CVV *</label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  value={formData.cvv || ''}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '')
                    const maxLength = formData.marcaTarjeta === 'american-express' ? 4 : 3
                    setFormData(prev => ({ ...prev, cvv: value.slice(0, maxLength) }))
                  }}
                  maxLength={formData.marcaTarjeta === 'american-express' ? 4 : 3}
                  pattern={formData.marcaTarjeta === 'american-express' ? '[0-9]{4}' : '[0-9]{3}'}
                  placeholder={formData.marcaTarjeta === 'american-express' ? '1234' : '123'}
                  required
                />
                <small style={{ display: 'block', marginTop: '0.25rem', color: '#666', fontSize: '0.875rem' }}>
                  {formData.marcaTarjeta === 'american-express' ? '4 dígitos en el frente' : '3 o 4 dígitos en el dorso'}
                </small>
              </div>
            </div>
          </div>
        )}

        {formData.metodoPago === 'transferencia' && (
          <div className="payment-method-section">
            <h3>Datos de Transferencia Bancaria</h3>
            
            {/* Información bancaria */}
            <div className="bank-info-section">
              <h4>Información Bancaria para Transferencia</h4>
              <div className="bank-info-content">
                <div className="bank-info-general">
                  <p><strong>Titular:</strong> Aero SRL</p>
                  <p><strong>CUIT:</strong> 30-70736214-2</p>
                </div>

                <div className="bank-accounts">
                  <div className="bank-account-card">
                    <h5>🏦 Banco Macro</h5>
                    <div className="account-details">
                      <p><strong>Cuenta Corriente Especial en Pesos</strong></p>
                      <p className="account-note">Solo para pagos por transferencia. (Para depósitos en efectivo, informar acuerdo de recaudación 84338, caso contrario aplicará gasto de 1%)</p>
                      <p><strong>Sucursal:</strong> 530</p>
                      <p><strong>Nro de Cta:</strong> 453009462845103</p>
                      <p><strong>CBU:</strong> 2850530540094628451038</p>
                      <p><strong>Alias Pesos:</strong> <span className="alias">AERO.BANCO.MACRO</span></p>
                      <p className="account-note">Exclusivamente para cheques: Cuenta Corriente Nro 353009407650146</p>
                    </div>
                  </div>

                  <div className="bank-account-card">
                    <h5>🏦 Banco Macro - Dólares</h5>
                    <div className="account-details">
                      <p><strong>Cuenta Corriente en Dólares</strong></p>
                      <p className="account-note">Solo para pagos por transferencia - (Para depósitos en efectivo, informar el acuerdo de recaudación 89761, caso contrario aplicará gasto de 1%)</p>
                      <p><strong>Sucursal:</strong> 530</p>
                      <p><strong>Nro de Cta:</strong> 253009462845099</p>
                      <p><strong>CBU:</strong> 2850530520094628450994</p>
                      <p><strong>Alias Dolares:</strong> <span className="alias">AERO.MACRO.DOLAR</span></p>
                    </div>
                  </div>

                  <div className="bank-account-card">
                    <h5>🏦 Banco Provincia</h5>
                    <div className="account-details">
                      <p><strong>Cuenta Corriente en Pesos</strong></p>
                      <p className="account-note">Solo para pagos por transferencia (para depósitos en efectivo aplicará gasto de 1%)</p>
                      <p><strong>Sucursal:</strong> 2000</p>
                      <p><strong>Nro de Cta:</strong> 001/051456/5</p>
                      <p><strong>CBU:</strong> 01409998 01200005145657</p>
                      <p><strong>Alias Pesos:</strong> <span className="alias">AERO.PROVINCIA.PESOS</span></p>
                    </div>
                  </div>

                  <div className="bank-account-card">
                    <h5>🏦 Banco Galicia</h5>
                    <div className="account-details">
                      <p><strong>Cuenta Corriente en Pesos</strong></p>
                      <p className="account-note">Solo para pagos por transferencia (para depósitos en efectivo aplicará gasto de 1%)</p>
                      <p><strong>Nro de Cta:</strong> 10885-8 172-9</p>
                      <p><strong>CBU:</strong> 00701729-20000010885891</p>
                      <p><strong>Alias Pesos:</strong> <span className="alias">AERO.BANCO.GALICIA</span></p>
                    </div>
                  </div>

                  <div className="bank-account-card">
                    <h5>🏦 Banco Santander - Pesos</h5>
                    <div className="account-details">
                      <p><strong>Cuenta Corriente en Pesos</strong></p>
                      <p className="account-note">Solo para pagos por transferencia (para depósitos en efectivo aplicará gasto de 1%)</p>
                      <p><strong>Sucursal:</strong> 099</p>
                      <p><strong>Nro de Cuenta:</strong> 002528/1</p>
                      <p><strong>CBU:</strong> 0720099120000000252818</p>
                      <p><strong>Alias Pesos:</strong> <span className="alias">AERO.SANTANDER.PESOS</span></p>
                    </div>
                  </div>

                  <div className="bank-account-card">
                    <h5>🏦 Banco Santander - Dólares</h5>
                    <div className="account-details">
                      <p><strong>Cuenta Corriente en Dólares</strong></p>
                      <p className="account-note">Solo para pagos por transferencia</p>
                      <p><strong>Sucursal:</strong> 099</p>
                      <p><strong>Nro de Cuenta:</strong> 002529/8</p>
                      <p><strong>CBU:</strong> 0720099121000000252987</p>
                      <p><strong>Alias Dolares:</strong> <span className="alias">AERO.BCOSANTANDER</span></p>
                    </div>
                  </div>

                  <div className="bank-account-card">
                    <h5>🏦 Banco Francés - Pesos</h5>
                    <div className="account-details">
                      <p><strong>Cuenta Corriente en Pesos</strong></p>
                      <p className="account-note">Solo para pagos por transferencia (para depósitos en efectivo aplicará gasto de 1%)</p>
                      <p><strong>Sucursal:</strong> 486</p>
                      <p><strong>Nro de Cta:</strong> 001578/3</p>
                      <p><strong>CBU:</strong> 0170486420000000157830</p>
                    </div>
                  </div>

                  <div className="bank-account-card">
                    <h5>🏦 Banco Francés - Dólares</h5>
                    <div className="account-details">
                      <p><strong>Cuenta Corriente en Dólares</strong></p>
                      <p className="account-note">Solo para pagos por transferencia</p>
                      <p><strong>Sucursal:</strong> 361</p>
                      <p><strong>Nro de Cuenta:</strong> 091397/3</p>
                      <p><strong>CBU:</strong> 0170361826000009139732</p>
                    </div>
                  </div>
                </div>

                <div className="bank-info-warning">
                  <p><strong>⚠️ Importante:</strong></p>
                  <ul>
                    <li>Para el pago de aéreos emitidos en ARS, se deducirá el 1,2% - Imp. Ley 25413.</li>
                    <li>Para el pago de aéreos emitidos en USD, se deducirá el 1,2% - Imp. Ley 25413 y el 0,15% asociado al gasto de la cuenta recaudadora de IATA en dicha moneda.</li>
                    <li>Las transferencias bancarias están sujetas a plazos de acreditación.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Formulario para datos de la transferencia */}
            <div className="deposit-form-section">
              <h4>Completar Datos de la Transferencia</h4>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="banco">Banco *</label>
                  <select
                    id="banco"
                    name="banco"
                    value={formData.banco || ''}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccionar banco</option>
                    <option value="Banco Macro">Banco Macro</option>
                    <option value="Banco Provincia">Banco Provincia</option>
                    <option value="Banco Galicia">Banco Galicia</option>
                    <option value="Banco Santander">Banco Santander</option>
                    <option value="Banco Francés">Banco Francés</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="cuenta">Número de Cuenta *</label>
                  <input
                    type="text"
                    id="cuenta"
                    name="cuenta"
                    value={formData.cuenta || ''}
                    onChange={handleInputChange}
                    placeholder="Número de cuenta utilizada"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="numeroComprobante">Número de Comprobante *</label>
                  <input
                    type="text"
                    id="numeroComprobante"
                    name="numeroComprobante"
                    value={formData.numeroComprobante || ''}
                    onChange={handleInputChange}
                    placeholder="Número del comprobante de transferencia"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {formData.metodoPago === 'deposito' && (
          <div className="payment-method-section">
            <h3>Datos de Depósito Bancario</h3>
            
            {/* Información bancaria */}
            <div className="bank-info-section">
              <h4>Información Bancaria para Depósito</h4>
              <div className="bank-info-content">
                <div className="bank-info-general">
                  <p><strong>Titular:</strong> Aero SRL</p>
                  <p><strong>CUIT:</strong> 30-70736214-2</p>
                </div>

                <div className="bank-accounts">
                  <div className="bank-account-card">
                    <h5>🏦 Banco Macro</h5>
                    <div className="account-details">
                      <p><strong>Cuenta Corriente Especial en Pesos</strong></p>
                      <p className="account-note">Solo para pagos por transferencia. (Para depósitos en efectivo, informar acuerdo de recaudación 84338, caso contrario aplicará gasto de 1%)</p>
                      <p><strong>Sucursal:</strong> 530</p>
                      <p><strong>Nro de Cta:</strong> 453009462845103</p>
                      <p><strong>CBU:</strong> 2850530540094628451038</p>
                      <p><strong>Alias Pesos:</strong> <span className="alias">AERO.BANCO.MACRO</span></p>
                      <p className="account-note">Exclusivamente para cheques: Cuenta Corriente Nro 353009407650146</p>
                    </div>
                  </div>

                  <div className="bank-account-card">
                    <h5>🏦 Banco Macro - Dólares</h5>
                    <div className="account-details">
                      <p><strong>Cuenta Corriente en Dólares</strong></p>
                      <p className="account-note">Solo para pagos por transferencia - (Para depósitos en efectivo, informar el acuerdo de recaudación 89761, caso contrario aplicará gasto de 1%)</p>
                      <p><strong>Sucursal:</strong> 530</p>
                      <p><strong>Nro de Cta:</strong> 253009462845099</p>
                      <p><strong>CBU:</strong> 2850530520094628450994</p>
                      <p><strong>Alias Dolares:</strong> <span className="alias">AERO.MACRO.DOLAR</span></p>
                    </div>
                  </div>

                  <div className="bank-account-card">
                    <h5>🏦 Banco Provincia</h5>
                    <div className="account-details">
                      <p><strong>Cuenta Corriente en Pesos</strong></p>
                      <p className="account-note">Solo para pagos por transferencia (para depósitos en efectivo aplicará gasto de 1%)</p>
                      <p><strong>Sucursal:</strong> 2000</p>
                      <p><strong>Nro de Cta:</strong> 001/051456/5</p>
                      <p><strong>CBU:</strong> 01409998 01200005145657</p>
                      <p><strong>Alias Pesos:</strong> <span className="alias">AERO.PROVINCIA.PESOS</span></p>
                    </div>
                  </div>

                  <div className="bank-account-card">
                    <h5>🏦 Banco Galicia</h5>
                    <div className="account-details">
                      <p><strong>Cuenta Corriente en Pesos</strong></p>
                      <p className="account-note">Solo para pagos por transferencia (para depósitos en efectivo aplicará gasto de 1%)</p>
                      <p><strong>Nro de Cta:</strong> 10885-8 172-9</p>
                      <p><strong>CBU:</strong> 00701729-20000010885891</p>
                      <p><strong>Alias Pesos:</strong> <span className="alias">AERO.BANCO.GALICIA</span></p>
                    </div>
                  </div>

                  <div className="bank-account-card">
                    <h5>🏦 Banco Santander - Pesos</h5>
                    <div className="account-details">
                      <p><strong>Cuenta Corriente en Pesos</strong></p>
                      <p className="account-note">Solo para pagos por transferencia (para depósitos en efectivo aplicará gasto de 1%)</p>
                      <p><strong>Sucursal:</strong> 099</p>
                      <p><strong>Nro de Cuenta:</strong> 002528/1</p>
                      <p><strong>CBU:</strong> 0720099120000000252818</p>
                      <p><strong>Alias Pesos:</strong> <span className="alias">AERO.SANTANDER.PESOS</span></p>
                    </div>
                  </div>

                  <div className="bank-account-card">
                    <h5>🏦 Banco Santander - Dólares</h5>
                    <div className="account-details">
                      <p><strong>Cuenta Corriente en Dólares</strong></p>
                      <p className="account-note">Solo para pagos por transferencia</p>
                      <p><strong>Sucursal:</strong> 099</p>
                      <p><strong>Nro de Cuenta:</strong> 002529/8</p>
                      <p><strong>CBU:</strong> 0720099121000000252987</p>
                      <p><strong>Alias Dolares:</strong> <span className="alias">AERO.BCOSANTANDER</span></p>
                    </div>
                  </div>

                  <div className="bank-account-card">
                    <h5>🏦 Banco Francés - Pesos</h5>
                    <div className="account-details">
                      <p><strong>Cuenta Corriente en Pesos</strong></p>
                      <p className="account-note">Solo para pagos por transferencia (para depósitos en efectivo aplicará gasto de 1%)</p>
                      <p><strong>Sucursal:</strong> 486</p>
                      <p><strong>Nro de Cta:</strong> 001578/3</p>
                      <p><strong>CBU:</strong> 0170486420000000157830</p>
                    </div>
                  </div>

                  <div className="bank-account-card">
                    <h5>🏦 Banco Francés - Dólares</h5>
                    <div className="account-details">
                      <p><strong>Cuenta Corriente en Dólares</strong></p>
                      <p className="account-note">Solo para pagos por transferencia</p>
                      <p><strong>Sucursal:</strong> 361</p>
                      <p><strong>Nro de Cuenta:</strong> 091397/3</p>
                      <p><strong>CBU:</strong> 0170361826000009139732</p>
                    </div>
                  </div>
                </div>

                <div className="bank-info-warning">
                  <p><strong>⚠️ Importante:</strong></p>
                  <ul>
                    <li>Para el pago de aéreos emitidos en ARS, se deducirá el 1,2% - Imp. Ley 25413.</li>
                    <li>Para el pago de aéreos emitidos en USD, se deducirá el 1,2% - Imp. Ley 25413 y el 0,15% asociado al gasto de la cuenta recaudadora de IATA en dicha moneda.</li>
                    <li>Las transferencias bancarias están sujetas a plazos de acreditación.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Formulario para datos del depósito */}
            <div className="deposit-form-section">
              <h4>Completar Datos del Depósito</h4>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="bancoDeposito">Banco *</label>
                  <select
                    id="bancoDeposito"
                    name="bancoDeposito"
                    value={formData.bancoDeposito || ''}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccionar banco</option>
                    <option value="Banco Macro">Banco Macro</option>
                    <option value="Banco Provincia">Banco Provincia</option>
                    <option value="Banco Galicia">Banco Galicia</option>
                    <option value="Banco Santander">Banco Santander</option>
                    <option value="Banco Francés">Banco Francés</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="sucursalDeposito">Sucursal</label>
                  <input
                    type="text"
                    id="sucursalDeposito"
                    name="sucursalDeposito"
                    value={formData.sucursalDeposito || ''}
                    onChange={handleInputChange}
                    placeholder="Número de sucursal"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="numeroComprobanteDeposito">Número de Comprobante *</label>
                  <input
                    type="text"
                    id="numeroComprobanteDeposito"
                    name="numeroComprobanteDeposito"
                    value={formData.numeroComprobanteDeposito || ''}
                    onChange={handleInputChange}
                    placeholder="Número del comprobante de depósito"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="fechaDeposito">Fecha del Depósito *</label>
                  <input
                    type="date"
                    id="fechaDeposito"
                    name="fechaDeposito"
                    value={formData.fechaDeposito || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        )}

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
                  <span className="main-price">{formatPrice(selectedPaquete.precio, selectedPaquete.moneda)}</span>
                  {selectedCurrency !== (selectedPaquete.moneda || 'ARS') && (
                    <span className="original-price">
                      ({formatCurrency(selectedPaquete.precio, selectedPaquete.moneda || 'ARS')})
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
