import { useState, useEffect } from 'react'
import { FaSearch, FaFilter, FaMapMarkerAlt, FaClock, FaTag } from 'react-icons/fa'
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
        title: 'Caribe',
        destination: 'Caribe',
        price: 2702,
        currency: 'USD',
        duration: '7 días',
        images: [
          '/images/caribe.jpg',
          '/images/travel-1.jpg'
        ],
        description: 'Descubrí los paraísos caribeños con playas de arena blanca y aguas turquesa. Perfecto para relajarse y disfrutar del sol.',
        category: 'Caribe'
      },
      {
        id: '2',
        title: 'Europa',
        destination: 'Europa',
        price: 2245,
        currency: 'EUR',
        duration: '10 días',
        images: [
          '/images/europa.png',
          '/images/travel-2.jpg'
        ],
        description: 'Explorá la rica historia y cultura de Europa. Visita ciudades icónicas, monumentos históricos y disfruta de la gastronomía local.',
        category: 'Europa'
      },
      {
        id: '3',
        title: 'Asia',
        destination: 'Asia',
        price: 35000,
        currency: 'USD',
        duration: '14 días',
        images: [
          '/images/asia.jpg',
          '/images/travel-3.jpg'
        ],
        description: 'Sumergite en el misticismo de Asia. Desde templos antiguos hasta ciudades modernas, una experiencia cultural única.',
        category: 'Asia'
      },
      {
        id: '4',
        title: 'África',
        destination: 'África',
        price: 1310,
        currency: 'USD',
        duration: '12 días',
        images: [
          '/images/africa.jpg',
          '/images/travel-4.jpg'
        ],
        description: 'Viví la aventura de safari africano con observación de la fauna salvaje y paisajes increíbles.',
        category: 'África'
      },
      {
        id: '5',
        title: 'Estados Unidos',
        destination: 'Estados Unidos',
        price: 638,
        currency: 'USD',
        duration: '10 días',
        images: [
          '/images/usa.png',
          '/images/travel-1.jpg'
        ],
        description: 'Descubrí las ciudades más emblemáticas de Estados Unidos y sus iconos culturales.',
        category: 'Estados Unidos'
      },
      {
        id: '6',
        title: 'Sudamérica',
        destination: 'Sudamérica',
        price: 859,
        currency: 'USD',
        duration: '8 días',
        images: [
          '/images/sudamerica.jpg',
          '/images/travel-2.jpg'
        ],
        description: 'Conocé la diversidad de Sudamérica: paisajes andinos, selvas tropicales y ciudades vibrantes.',
        category: 'Sudamérica'
      },
      {
        id: '7',
        title: 'Trenes',
        destination: 'Varios destinos',
        price: 18000,
        currency: 'USD',
        duration: '5 días',
        images: [
          '/images/trenes.jpg',
          '/images/travel-3.jpg'
        ],
        description: 'Viví experiencias únicas en trenes de lujo a través de paisajes espectaculares.',
        category: 'Trenes'
      },
      {
        id: '8',
        title: 'Actividades',
        destination: 'Varios destinos',
        price: 15000,
        currency: 'USD',
        duration: '3 días',
        images: [
          '/images/actividades.jpg',
          '/images/travel-4.jpg'
        ],
        description: 'Disfrutá de actividades emocionantes y aventureras en destinos únicos.',
        category: 'Actividades'
      },
      {
        id: '9',
        title: 'Hoteles',
        destination: 'Varios destinos',
        price: 12000,
        currency: 'USD',
        duration: 'Noches a medida',
        images: [
          '/images/hoteles.jpg',
          '/images/travel-1.jpg'
        ],
        description: 'Encontramos el alojamiento perfecto para tu viaje. Hoteles de lujo, boutique y económicos.',
        category: 'Hoteles'
      },
      {
        id: '10',
        title: 'Asistencia al viajero',
        destination: 'Global',
        price: 5000,
        currency: 'USD',
        duration: 'Anual',
        images: [
          '/images/asistenciaalviajero.jpg',
          '/images/travel-2.jpg'
        ],
        description: 'Protegete durante tus viajes con nuestra cobertura de asistencia médica y de viaje internacional.',
        category: 'Seguro al viajero'
      },
      {
        id: '11',
        title: 'Cruceros',
        destination: 'Múltiples destinos',
        price: 30000,
        currency: 'USD',
        duration: '7 días',
        images: [
          '/images/crucero.jpg',
          '/images/travel-3.jpg'
        ],
        description: 'Navegá por destinos espectaculares en cruceros de lujo con todas las comodidades.',
        category: 'Cruceros'
      },
      {
        id: '12',
        title: 'Alquiler de autos',
        destination: 'Varios destinos',
        price: 8000,
        currency: 'USD',
        duration: 'Por día',
        images: [
          '/images/auto.jpg',
          '/images/travel-4.jpg'
        ],
        description: 'Tené libertad de movimiento con nuestros alquileres de autos en todo el mundo.',
        category: 'Alquileres de autos'
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
                      <span className="price-label">Desde</span>
                      <span className="price-amount">{formatPrice(travel.price, travel.currency)}</span>
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
