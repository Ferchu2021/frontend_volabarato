import { useState, useEffect } from 'react'
import { FaSearch, FaFilter, FaMapMarkerAlt, FaClock, FaTag } from 'react-icons/fa'
import { apiService } from '../services/api'
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
}

const Travels = () => {
  const [travels, setTravels] = useState<Travel[]>([])
  const [filteredTravels, setFilteredTravels] = useState<Travel[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 })
  const [loading, setLoading] = useState(true)

  // Cargar paquetes reales desde el backend
  useEffect(() => {
    const loadPaquetes = async () => {
      try {
        setLoading(true)
        const paquetes = await apiService.getPaquetes()
        
        // Convertir paquetes a formato Travel
        const travelsFromPaquetes: Travel[] = paquetes.map((paquete) => ({
          id: paquete._id,
          title: paquete.nombre,
          destination: paquete.destino,
          price: paquete.precio,
          currency: 'ARS',
          duration: paquete.descripcion || 'Consultar',
          images: ['/images/travel-1.jpg'], // Por ahora una imagen, se puede mejorar
          description: paquete.descripcion || `Descubrí ${paquete.destino} con este increíble paquete de viaje.`,
          category: paquete.destino.split(',')[0] || 'General'
        }))
        
        setTravels(travelsFromPaquetes)
        setFilteredTravels(travelsFromPaquetes)
        setLoading(false)
      } catch (error) {
        console.error('Error cargando paquetes:', error)
        // Si no hay paquetes en el backend, mostrar mensaje
        setTravels([])
        setFilteredTravels([])
        setLoading(false)
      }
    }
    
    loadPaquetes()
  }, [])

  useEffect(() => {
    let filtered = travels

    // Filtro por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(travel =>
        travel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        travel.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
        travel.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtro por categoría
    if (selectedCategory) {
      filtered = filtered.filter(travel => travel.category === selectedCategory)
    }

    // Filtro por rango de precio
    filtered = filtered.filter(travel => {
      // Si el viaje tiene precio de consulta, no aplicar filtro de precio
      if (travel.consultPrice) {
        return true
      }
      return travel.price >= priceRange.min && travel.price <= priceRange.max
    })

    setFilteredTravels(filtered)
  }, [searchTerm, selectedCategory, priceRange, travels])

  const categories = ['Caribe', 'Europa', 'Estados Unidos', 'Sudamérica', 'Asia', 'África', 'Cruceros', 'Hoteles', 'Actividades', 'Trenes', 'Alquileres de autos', 'Seguro al viajero']

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: currency
    }).format(price)
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando viajes...</p>
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

        <div className="results-info">
          <p>Mostrando {filteredTravels.length} de {travels.length} viajes</p>
        </div>

        {filteredTravels.length === 0 ? (
          <div className="no-results">
            <h3>No se encontraron viajes</h3>
            <p>Intenta ajustar los filtros de búsqueda</p>
          </div>
        ) : (
          <div className="travels-grid">
            {filteredTravels.map(travel => (
              <div key={travel.id} className="travel-card">
                <div className="travel-image">
                  <img src={travel.images[0]} alt={travel.title} />
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
                  </div>
                  
                  <p className="travel-description">{travel.description}</p>
                  
                  <div className="travel-footer">
                    <div className="travel-price">
                      {travel.consultPrice ? (
                        <span className="price-amount">Cotización a solicitud</span>
                      ) : (
                        <>
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
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Travels
