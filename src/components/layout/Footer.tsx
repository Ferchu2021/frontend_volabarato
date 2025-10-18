import { FaInstagram, FaWhatsapp, FaFacebook, FaEnvelope, FaPhone } from 'react-icons/fa'
import './Footer.css'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <img 
                src="/images/logo.svg" 
                alt="Volá Barato Logo" 
                className="footer-logo-image"
              />
            </div>
            <h3>Volá Barato</h3>
            <p>
              Para quienes viajan con el cuerpo y también con la imaginación. 
              Descubrí destinos únicos y viví experiencias inolvidables.
            </p>
          </div>

          <div className="footer-section">
            <h4>Contacto</h4>
            <div className="contact-item">
              <FaEnvelope className="contact-icon" />
              <a href="mailto:info@volabarato.com.ar">info@volabarato.com.ar</a>
            </div>
            <div className="contact-item">
              <FaPhone className="contact-icon" />
              <a href="tel:+5493412163431">+54 9 341 216-3431</a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Seguinos</h4>
            <div className="social-links">
              <a 
                href="https://instagram.com/volabaratooficial" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
              >
                <FaInstagram />
                <span>Instagram</span>
              </a>
              <a 
                href="https://wa.me/+5493412163431" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
              >
                <FaWhatsapp />
                <span>WhatsApp</span>
              </a>
              <a 
                href="https://www.facebook.com/profile.php?id=61577465587884" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
              >
                <FaFacebook />
                <span>Facebook</span>
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Próximas Propuestas</h4>
            <ul className="proposals-list">
              <li>La Ruta del Helado en Rosario</li>
              <li>Solos y Solas</li>
              <li>Team Building</li>
              <li>Conocé Rosario, la ciudad del fútbol</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Volá Barato. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
