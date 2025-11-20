import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaPlane, FaMapMarkedAlt, FaHeart, FaStar } from 'react-icons/fa'
import { apiService, Paquete } from '../services/api'
import ImageGallery from '../components/common/ImageGallery'
import NewsletterForm from '../components/forms/NewsletterForm'
import './Home.css'

const Home = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [destacados, setDestacados] = useState<Paquete[]>([])
  const [loadingDestacados, setLoadingDestacados] = useState(true)

  const carouselImages = [
    {
      src: '/images/mikonos.png',
      alt: 'Descubrí Destinos Únicos',
      title: 'Descubrí Destinos Únicos'
    },
    {
      src: '/images/safari.png',
      alt: 'Viví Experiencias Inolvidables',
      title: 'Viví Experiencias Inolvidables'
    },
    {
      src: '/images/Honolulu.png',
      alt: 'Aventuras que Inspiran',
      title: 'Aventuras que Inspiran'
    },
    {
      src: '/images/egipto.png',
      alt: 'Sumergite en Nuevas Culturas',
      title: 'Sumergite en Nuevas Culturas'
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [carouselImages.length])

  // Cargar paquetes destacados del backend
  useEffect(() => {
    const loadDestacados = async () => {
      try {
        setLoadingDestacados(true)
        const paquetes = await apiService.getPaquetes()
        // Filtrar solo los paquetes destacados y activos
        const destacadosData = paquetes.filter(p => p.destacado && p.activo)
        // Limitar a 4 para mostrar en el grid
        setDestacados(destacadosData.slice(0, 4))
      } catch (error) {
        console.error('Error cargando paquetes destacados:', error)
        setDestacados([])
      } finally {
        setLoadingDestacados(false)
      }
    }
    
    loadDestacados()
  }, [])

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? carouselImages.length - 1 : prev - 1
    )
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Volá Barato</h1>
          <p>
            Volá Barato es para quienes viajan con el cuerpo y también con la imaginación. 
            No importa si te movés por tierra, mar o aire: lo importante es animarte a ir, 
            descubrir, soñar y sentir la libertad de elegir tu próxima aventura. Más que destinos, 
            somos movimiento, sueños y nuevas historias. Volá como quieras—nosotros te acompañamos.
          </p>
          <div className="hero-buttons">
            <Link to="/viajes" className="btn btn-primary">
              Ver Ofertas
            </Link>
            <Link to="/contacto" className="btn btn-outline">
              Contactanos
            </Link>
          </div>
        </div>
      </section>

      {/* Image Carousel */}
      <section className="carousel-section">
        <div className="container">
          <div className="carousel-container">
            <div className="carousel">
              <img 
                src={carouselImages[currentImageIndex].src} 
                alt={carouselImages[currentImageIndex].alt}
                className="carousel-image"
              />
              <div className="carousel-overlay">
                <h2>{carouselImages[currentImageIndex].title}</h2>
              </div>
            </div>
            <button className="carousel-btn carousel-btn-prev" onClick={prevImage}>
              ‹
            </button>
            <button className="carousel-btn carousel-btn-next" onClick={nextImage}>
              ›
            </button>
            <div className="carousel-indicators">
              {carouselImages.map((_, index) => (
                <button
                  key={index}
                  className={`carousel-indicator ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features section">
        <div className="container">
          <h2 className="section-title">¿Por qué elegirnos?</h2>
          <p className="section-subtitle">
          En Volá Barato creemos que viajar no tiene por qué costar tanto. Te ofrecemos experiencias de calidad, a precios que se ajustan a vos, para que descubras y te conectes con la magia de cada destino.
          </p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FaPlane />
              </div>
              <h3>Destinos Únicos</h3>
              <p>
                Descubrimos lugares extraordinarios que van más allá de los destinos turísticos convencionales.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaMapMarkedAlt />
              </div>
              <h3>Experiencias Personalizadas</h3>
              <p>
                Cada viaje está diseñado para satisfacer tus intereses específicos y crear recuerdos inolvidables.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaHeart />
              </div>
              <h3>Pasión por el Viaje</h3>
              <p>
                Nuestro equipo comparte tu entusiasmo por explorar y descubrir nuevas culturas y lugares.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaStar />
              </div>
              <h3>Calidad Garantizada</h3>
              <p>
                Trabajamos solo con los mejores proveedores para asegurar experiencias de primera clase.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Proposals Section */}
      <section className="proposals section">
        <div className="container">
          <h2 className="section-title">Próximas Propuestas</h2>
          <p className="section-subtitle">
            Preparate para vivir experiencias únicas en los próximos meses
          </p>
          {loadingDestacados ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>Cargando propuestas destacadas...</p>
            </div>
          ) : destacados.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>No hay propuestas destacadas disponibles en este momento.</p>
            </div>
          ) : (
            <div className="proposals-grid">
              {destacados.map((paquete) => {
                const hasDiscount = paquete.precioAnterior && paquete.precioAnterior > paquete.precio
                const discountPercent = hasDiscount 
                  ? Math.round(((paquete.precioAnterior! - paquete.precio) / paquete.precioAnterior!) * 100)
                  : 0
                
                return (
                  <Link 
                    key={paquete._id} 
                    to="/viajes" 
                    className="proposal-card"
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <div className="proposal-image">
                      {paquete.imagenes && paquete.imagenes.length > 0 ? (
                        <img 
                          src={paquete.imagenes[0]} 
                          alt={paquete.nombre}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/travel-1.jpg'
                          }}
                        />
                      ) : (
                        <img src="/images/travel-1.jpg" alt={paquete.nombre} />
                      )}
                      {hasDiscount && (
                        <div style={{
                          position: 'absolute',
                          top: '0.5rem',
                          right: '0.5rem',
                          background: '#ef4444',
                          color: 'white',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '1rem',
                          fontSize: '0.75rem',
                          fontWeight: '600'
                        }}>
                          -{discountPercent}%
                        </div>
                      )}
                    </div>
                    <div className="proposal-content">
                      <h3>{paquete.nombre}</h3>
                      <p>{paquete.descripcion || `Descubrí ${paquete.destino} con este increíble paquete de viaje.`}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                        <span className="proposal-tag">{paquete.categoria || 'General'}</span>
                        {paquete.precio && (
                          <span style={{ 
                            fontWeight: '600', 
                            color: 'var(--primary-color, #2563eb)',
                            fontSize: '1.125rem'
                          }}>
                            Desde {new Intl.NumberFormat('es-AR', {
                              style: 'currency',
                              currency: 'ARS'
                            }).format(paquete.precio)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter">
        <div className="container">
          <h2>¡Subscribite a novedades!</h2>
          <p>Recibí las mejores ofertas y novedades de viajes directamente en tu email</p>
          <NewsletterForm />
        </div>
      </section>
    </div>
  )
}

export default Home
