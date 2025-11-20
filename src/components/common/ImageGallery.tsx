import { useState } from 'react'
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa'
import './ImageGallery.css'

interface ImageGalleryProps {
  images: string[]
  alt?: string
  showThumbnails?: boolean
}

const ImageGallery = ({ images, alt = 'Imagen', showThumbnails = false }: ImageGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  if (!images || images.length === 0) {
    return (
      <div className="image-gallery-empty">
        <img src="/images/travel-1.jpg" alt={alt} />
      </div>
    )
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const openLightbox = () => {
    if (images.length > 1) {
      setIsLightboxOpen(true)
    }
  }

  const closeLightbox = () => {
    setIsLightboxOpen(false)
  }

  return (
    <>
      <div className="image-gallery">
        <div className="image-gallery-main" onClick={openLightbox}>
          <img 
            src={images[currentIndex]} 
            alt={`${alt} ${currentIndex + 1}`}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/travel-1.jpg'
            }}
          />
          {images.length > 1 && (
            <>
              <button 
                className="gallery-nav gallery-nav-prev" 
                onClick={(e) => {
                  e.stopPropagation()
                  prevImage()
                }}
                aria-label="Imagen anterior"
              >
                <FaChevronLeft />
              </button>
              <button 
                className="gallery-nav gallery-nav-next" 
                onClick={(e) => {
                  e.stopPropagation()
                  nextImage()
                }}
                aria-label="Siguiente imagen"
              >
                <FaChevronRight />
              </button>
              <div className="gallery-indicator">
                {currentIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>
        
        {showThumbnails && images.length > 1 && (
          <div className="image-gallery-thumbnails">
            {images.map((image, index) => (
              <button
                key={index}
                className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
              >
                <img 
                  src={image} 
                  alt={`${alt} thumbnail ${index + 1}`}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/travel-1.jpg'
                  }}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {isLightboxOpen && (
        <div className="lightbox" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox} aria-label="Cerrar">
            <FaTimes />
          </button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img 
              src={images[currentIndex]} 
              alt={`${alt} ${currentIndex + 1}`}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/travel-1.jpg'
              }}
            />
            {images.length > 1 && (
              <>
                <button 
                  className="lightbox-nav lightbox-nav-prev" 
                  onClick={prevImage}
                  aria-label="Imagen anterior"
                >
                  <FaChevronLeft />
                </button>
                <button 
                  className="lightbox-nav lightbox-nav-next" 
                  onClick={nextImage}
                  aria-label="Siguiente imagen"
                >
                  <FaChevronRight />
                </button>
                <div className="lightbox-indicator">
                  {currentIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default ImageGallery
