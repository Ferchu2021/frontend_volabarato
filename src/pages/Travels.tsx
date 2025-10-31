import { useState, useEffect } from 'react'
import { FaSearch, FaFilter, FaMapMarkerAlt, FaClock, FaTag } from 'react-icons/fa'
import './Travels.css'

interface Travel {
  id: string
  title: string
  destination: string
  price: number
  duration: string
  images: string[]
  description: string
  category: string
}

const Travels = () => {
  const [travels, setTravels] = useState<Travel[]>([])
  const [filteredTravels, setFilteredTravels] = useState<Travel[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 })
  const [loading, setLoading] = useState(true)

  // Mock data - en un entorno real esto vendría del backend
  useEffect(() => {
    const mockTravels: Travel[] = [
      {
        id: '1',
        title: 'La Ruta del Helado en Rosario',
        destination: 'Rosario, Argentina',
        price: 15000,
        duration: '2 días',
        images: [
          'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500',
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500'
        ],
        description: 'Descubrí la capital nacional del helado con un recorrido por las mejores heladerías artesanales. Incluye degustaciones, visitas a fábricas y experiencias gastronómicas únicas.',
        category: 'Gastronomía'
      },
      {
        id: '2',
        title: 'Solos y Solas',
        destination: 'Varios destinos',
        price: 25000,
        duration: '3-5 días',
        images: [
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500',
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500'
        ],
        description: 'Viajes diseñados especialmente para viajeros solos que quieren conocer gente nueva. Grupos reducidos, actividades sociales y alojamiento compartido.',
        category: 'Social'
      },
      {
        id: '3',
        title: 'Team Building en la Naturaleza',
        destination: 'Sierras de Córdoba',
        price: 18000,
        duration: '2 días',
        images: [
          'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500',
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500'
        ],
        description: 'Experiencias corporativas que fortalecen equipos y crean vínculos duraderos. Actividades outdoor, talleres de liderazgo y momentos de conexión.',
        category: 'Corporativo'
      },
      {
        id: '4',
        title: 'Conocé Rosario, la ciudad del fútbol',
        destination: 'Rosario, Argentina',
        price: 12000,
        duration: '1 día',
        images: [
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500',
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500'
        ],
        description: 'Un recorrido por la historia futbolística de la ciudad que vio nacer a Messi. Visita al Monumento a la Bandera, estadios y museos deportivos.',
        category: 'Deportes'
      },
      {
        id: '5',
        title: 'Aventura en las Cataratas',
        destination: 'Puerto Iguazú, Argentina',
        price: 35000,
        duration: '4 días',
        images: [
          'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500',
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500'
        ],
        description: 'Explorá una de las maravillas naturales del mundo. Trekking, navegación por el río Iguazú y experiencias en la selva misionera.',
        category: 'Aventura'
      },
      {
        id: '6',
        title: 'Cultura y Vinos en Mendoza',
        destination: 'Mendoza, Argentina',
        price: 28000,
        duration: '3 días',
        images: [
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500',
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500'
        ],
        description: 'Recorré las mejores bodegas de la región, degustá vinos premium y disfrutá de la gastronomía local en un entorno de montaña.',
        category: 'Cultural'
      }
    ]

    setTravels(mockTravels)
    setFilteredTravels(mockTravels)
    setLoading(false)
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
    filtered = filtered.filter(travel => 
      travel.price >= priceRange.min && travel.price <= priceRange.max
    )

    setFilteredTravels(filtered)
  }, [searchTerm, selectedCategory, priceRange, travels])

  const categories = ['Caribe', 'Europa', 'Estados Unidos', 'Sudamérica', 'Asia', 'África', 'Cruceros', 'Hoteles', 'Actividades', 'Trenes', 'Alquileres de autos', 'Seguro al viajero']

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
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
                      <span className="price-label">Desde</span>
                      <span className="price-amount">{formatPrice(travel.price)}</span>
                    </div>
                    
                    <button className="btn btn-primary">
                      Ver Detalles
                    </button>
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
