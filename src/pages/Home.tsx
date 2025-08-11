import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaPlane, FaMapMarkedAlt, FaHeart, FaStar } from 'react-icons/fa'
import NewsletterForm from '../components/forms/NewsletterForm'
import './Home.css'

const Home = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const carouselImages = [
    {
      src: '/images/travel-1.jpg',
      alt: 'Destino turístico paradisíaco',
      title: 'Descubrí Destinos Únicos'
    },
    {
      src: '/images/travel-2.jpg',
      alt: 'Experiencia de viaje inolvidable',
      title: 'Viví Experiencias Inolvidables'
    },
    {
      src: '/images/travel-3.jpg',
      alt: 'Aventura y exploración',
      title: 'Aventuras que Inspiran'
    },
    {
      src: '/images/travel-4.jpg',
      alt: 'Cultura y tradiciones',
      title: 'Sumergite en Nuevas Culturas'
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [carouselImages.length])

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
          <div className="hero-logo">
            <img 
              src="/images/logo.svg" 
              alt="Volá Barato Logo" 
              className="hero-logo-image"
            />
          </div>
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
          <div className="proposals-grid">
            <div className="proposal-card">
              <div className="proposal-image">
                <img src="/images/helado-rosario.jpg" alt="La Ruta del Helado en Rosario" />
              </div>
              <div className="proposal-content">
                <h3>La Ruta del Helado en Rosario</h3>
                <p>Descubrí la capital nacional del helado con un recorrido por las mejores heladerías artesanales.</p>
                <span className="proposal-tag">Gastronomía</span>
              </div>
            </div>
            <div className="proposal-card">
              <div className="proposal-image">
                <img src="/images/solos-solas.jpg" alt="Solos y Solas" />
              </div>
              <div className="proposal-content">
                <h3>Solos y Solas</h3>
                <p>Viajes diseñados especialmente para viajeros solos que quieren conocer gente nueva.</p>
                <span className="proposal-tag">Social</span>
              </div>
            </div>
            <div className="proposal-card">
              <div className="proposal-image">
                <img src="/images/team-building.jpg" alt="Team Building" />
              </div>
              <div className="proposal-content">
                <h3>Team Building</h3>
                <p>Experiencias corporativas que fortalecen equipos y crean vínculos duraderos.</p>
                <span className="proposal-tag">Corporativo</span>
              </div>
            </div>
            <div className="proposal-card">
              <div className="proposal-image">
                <img src="/images/rosario-futbol.jpg" alt="Conocé Rosario, la ciudad del fútbol" />
              </div>
              <div className="proposal-content">
                <h3>Conocé Rosario, la ciudad del fútbol</h3>
                <p>Un recorrido por la historia futbolística de la ciudad que vio nacer a Messi.</p>
                <span className="proposal-tag">Deportes</span>
              </div>
            </div>
          </div>
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
