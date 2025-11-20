import { useState, useEffect } from 'react'
import { FaSearch, FaFilter, FaMapMarkerAlt, FaClock, FaTag, FaUsers } from 'react-icons/fa'
import { apiService, Paquete } from '../services/api'
import ImageGallery from '../components/common/ImageGallery'
import Badge from '../components/common/Badge'
import SkeletonLoader from '../components/common/SkeletonLoader'
import './Travels.css'

interface Travel {
  id: string
  title: string
  destination: string
  price: number
  currency: string
  duration: string
  images: string[]
  description: string
  category: string
  consultPrice?: boolean
  // Nuevos campos del paquete
  destacado?: boolean
  precioAnterior?: number
  cuposDisponibles?: number
  incluye?: string[]
  paquete?: Paquete // Referencia al paquete completo
}

const Travels = () => {
  const [travels, setTravels] = useState<Travel[]>([])
  const [filteredTravels, setFilteredTravels] = useState<Travel[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500000 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cargar paquetes reales desde el backend
  useEffect(() => {
    const loadPaquetes = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log('Cargando paquetes desde:', import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api')
        const paquetes = await apiService.getPaquetes()
        console.log('Paquetes cargados:', paquetes)
        
        // Convertir paquetes a formato Travel
        const travelsFromPaquetes: Travel[] = paquetes.map((paquete) => ({
          id: paquete._id,
          title: paquete.nombre,
          destination: paquete.destino,
          price: paquete.precio,
          currency: paquete.moneda || 'USD', // Usar la moneda del paquete
          duration: paquete.duracion || paquete.descripcion || 'Consultar',
          images: paquete.imagenes && paquete.imagenes.length > 0 
            ? paquete.imagenes 
            : ['/images/travel-1.jpg'], // Fallback si no hay imágenes
          description: paquete.descripcion || `Descubrí ${paquete.destino} con este increíble paquete de viaje.`,
          category: paquete.categoria || paquete.destino.split(',')[0] || 'General',
          destacado: paquete.destacado,
          precioAnterior: paquete.precioAnterior,
          cuposDisponibles: paquete.cuposDisponibles,
          incluye: paquete.incluye,
          paquete: paquete // Guardar referencia completa
        }))
        
        setTravels(travelsFromPaquetes)
        setFilteredTravels(travelsFromPaquetes)
        
        // Ajustar rango de precio automáticamente basado en los paquetes
        if (travelsFromPaquetes.length > 0) {
          const maxPrice = Math.max(...travelsFromPaquetes.map(t => t.price))
          const minPrice = Math.min(...travelsFromPaquetes.map(t => t.price))
          setPriceRange(prev => ({
            min: prev.min,
            max: Math.max(prev.max, maxPrice + 50000) // Agregar margen
          }))
        }
        
        setLoading(false)
      } catch (error: any) {
        console.error('Error cargando paquetes:', error)
        console.error('Error details:', {
          message: error?.message,
          response: error?.response,
          status: error?.response?.status,
          data: error?.response?.data
        })
        const errorMessage = error?.message || 'Error al cargar los paquetes. Verifica que el backend esté corriendo en http://localhost:4000'
        setError(errorMessage)
        setTravels([])
        setFilteredTravels([])
        setLoading(false)
      }
    }
    
    loadPaquetes()
  }, [])

  useEffect(() => {
    let filtered = travels

    console.log('🔍 Aplicando filtros:', {
      totalTravels: travels.length,
      searchTerm,
      selectedCategory,
      priceRange
    })

    // Filtro por término de búsqueda
    if (searchTerm) {
      const beforeSearch = filtered.length
      filtered = filtered.filter(travel => {
        const titleMatch = travel.title.toLowerCase().includes(searchTerm.toLowerCase())
        const destMatch = travel.destination.toLowerCase().includes(searchTerm.toLowerCase())
        const descMatch = travel.description.toLowerCase().includes(searchTerm.toLowerCase())
        const categoryMatch = travel.category?.toLowerCase().includes(searchTerm.toLowerCase())
        return titleMatch || destMatch || descMatch || categoryMatch
      })
      console.log(`🔍 Búsqueda "${searchTerm}": ${beforeSearch} -> ${filtered.length} resultados`)
    }

    // Filtro por categoría
    if (selectedCategory) {
      const beforeCategory = filtered.length
      filtered = filtered.filter(travel => travel.category === selectedCategory)
      console.log(`🏷️ Categoría "${selectedCategory}": ${beforeCategory} -> ${filtered.length} resultados`)
    }

    // Filtro por rango de precio
    const beforePrice = filtered.length
    filtered = filtered.filter(travel => {
      // Si el viaje tiene precio de consulta, no aplicar filtro de precio
      if (travel.consultPrice) {
        return true
      }
      const inRange = travel.price >= priceRange.min && travel.price <= priceRange.max
      if (!inRange) {
        console.log(`💰 Precio fuera de rango: ${travel.title} (${travel.price}) no está en [${priceRange.min}, ${priceRange.max}]`)
      }
      return inRange
    })
    console.log(`💰 Precio [${priceRange.min}-${priceRange.max}]: ${beforePrice} -> ${filtered.length} resultados`)

    console.log('✅ Resultados finales:', filtered.length)
    setFilteredTravels(filtered)
  }, [searchTerm, selectedCategory, priceRange, travels])

  // Generar categorías dinámicamente desde los paquetes cargados
  const categories = Array.from(new Set(travels.map(t => t.category).filter(Boolean))).sort()

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: currency
    }).format(price)
  }

  if (loading) {
    return (
      <div className="travels-page">
        <div className="hero-section">
          <div className="container">
            <SkeletonLoader height="3rem" width="300px" />
            <SkeletonLoader height="1.5rem" width="400px" className="mt-2" />
          </div>
        </div>
        <div className="container">
          <div className="search-filters">
            <SkeletonLoader height="3rem" />
            <div className="filters mt-4">
              <SkeletonLoader height="3rem" />
              <SkeletonLoader height="3rem" />
            </div>
          </div>
          <div className="travels-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="travel-card">
                <SkeletonLoader height="200px" variant="rectangular" />
                <div className="travel-content">
                  <SkeletonLoader height="1.5rem" width="80%" className="mb-2" />
                  <SkeletonLoader height="1rem" width="60%" className="mb-4" />
                  <SkeletonLoader height="1rem" />
                  <SkeletonLoader height="1rem" width="90%" className="mt-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="travels-page">
      <div className="hero-section">
        <div className="container">
          <h1>Catálogo de Viajes</h1>
          <p>Descubrí destinos únicos y experiencias inolvidables</p>
        </div>
      </div>

      <div className="container">
        <div className="search-filters">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Buscar por destino, título o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filters">
            <div className="filter-group">
              <label className="filter-label">
                <FaFilter />
                Categoría
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="filter-select"
              >
                <option value="">Todas las categorías</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">
                <FaTag />
                Rango de Precio
              </label>
              <div className="price-range">
                <input
                  type="number"
                  placeholder="Mín"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                  className="price-input"
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Máx"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                  className="price-input"
                />
              </div>
            </div>
          </div>
        </div>

        {!error && (
          <div className="results-info">
            <p>Mostrando {filteredTravels.length} de {travels.length} viajes</p>
          </div>
        )}

        {error && (
          <div className="no-results">
            <h3>Error al cargar viajes</h3>
            <p>{error}</p>
            <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#666' }}>
              Verifica que el backend esté corriendo en http://localhost:4000
            </p>
          </div>
        )}
        {!error && filteredTravels.length === 0 && (
          <div className="no-results">
            <h3>No se encontraron viajes</h3>
            <p>Intenta ajustar los filtros de búsqueda</p>
          </div>
        )}
        {!error && filteredTravels.length > 0 && (
          <div className="travels-grid">
            {filteredTravels.map(travel => {
              const hasDiscount = travel.precioAnterior && travel.precioAnterior > travel.price
              const discountPercent = hasDiscount 
                ? Math.round(((travel.precioAnterior! - travel.price) / travel.precioAnterior!) * 100)
                : 0
              const lowStock = travel.cuposDisponibles !== undefined && travel.cuposDisponibles > 0 && travel.cuposDisponibles <= 5
              
              return (
                <div key={travel.id} className="travel-card">
                  <div className="travel-image-wrapper">
                    <ImageGallery images={travel.images} alt={travel.title} />
                    <div className="travel-badges">
                      {travel.destacado && (
                        <Badge variant="warning" size="sm">Destacado</Badge>
                      )}
                      {hasDiscount && (
                        <Badge variant="danger" size="sm">-{discountPercent}%</Badge>
                      )}
                      {lowStock && (
                        <Badge variant="info" size="sm">Últimos {travel.cuposDisponibles} cupos</Badge>
                      )}
                    </div>
                    <div className="travel-category">{travel.category}</div>
                  </div>
                  
                  <div className="travel-content">
                    <h3 className="travel-title">{travel.title}</h3>
                    
                    <div className="travel-meta">
                      <div className="meta-item">
                        <FaMapMarkerAlt />
                        <span>{travel.destination}</span>
                      </div>
                      <div className="meta-item">
                        <FaClock />
                        <span>{travel.duration}</span>
                      </div>
                      {travel.cuposDisponibles !== undefined && travel.cuposDisponibles > 0 && (
                        <div className="meta-item">
                          <FaUsers />
                          <span>{travel.cuposDisponibles} cupos disponibles</span>
                        </div>
                      )}
                    </div>
                    
                    {travel.incluye && travel.incluye.length > 0 && (
                      <div className="travel-includes">
                        <strong>Incluye:</strong> {travel.incluye.slice(0, 3).join(', ')}
                        {travel.incluye.length > 3 && ` +${travel.incluye.length - 3} más`}
                      </div>
                    )}
                    
                    <p className="travel-description">{travel.description}</p>
                    
                    <div className="travel-footer">
                      <div className="travel-price">
                        {travel.consultPrice ? (
                          <span className="price-amount">Cotización a solicitud</span>
                        ) : (
                          <>
                            {hasDiscount && (
                              <span className="price-old">{formatPrice(travel.precioAnterior!, travel.currency)}</span>
                            )}
                            <span className="price-label">Desde</span>
                            <span className="price-amount">{formatPrice(travel.price, travel.currency)}</span>
                          </>
                        )}
                      </div>
                      
                      <a 
                        href="https://web.whatsapp.com/send?phone=543412163431"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                      >
                        Contactanos
                      </a>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Travels
