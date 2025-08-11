import React, { useState } from 'react'
import { FiX, FiChevronLeft, FiChevronRight, FiZoomIn } from 'react-icons/fi'
import './ImageGallery.css'

interface ImageGalleryProps {
  images: string[]
  onImageRemove?: (index: number) => void
  editable?: boolean
  maxImages?: number
  className?: string
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  onImageRemove,
  editable = false,
  maxImages = 10,
  className = ''
}) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  const openLightbox = (index: number) => {
    setSelectedImage(index)
  }

  const closeLightbox = () => {
    setSelectedImage(null)
  }

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % images.length)
    }
  }

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeLightbox()
    } else if (e.key === 'ArrowRight') {
      nextImage()
    } else if (e.key === 'ArrowLeft') {
      prevImage()
    }
  }

  if (images.length === 0) {
    return (
      <div className={`image-gallery empty ${className}`}>
        <p>No hay imágenes disponibles</p>
      </div>
    )
  }

  return (
    <>
      <div className={`image-gallery ${className}`}>
        {images.map((image, index) => (
          <div key={index} className="image-gallery__item">
            <div className="image-gallery__image-container">
              <img
                src={image}
                alt={`Imagen ${index + 1}`}
                onClick={() => openLightbox(index)}
                className="image-gallery__image"
              />
              
              <div className="image-gallery__overlay">
                <button
                  className="image-gallery__zoom-btn"
                  onClick={() => openLightbox(index)}
                  title="Ampliar imagen"
                >
                  <FiZoomIn />
                </button>
                
                {editable && onImageRemove && (
                  <button
                    className="image-gallery__remove-btn"
                    onClick={() => onImageRemove(index)}
                    title="Eliminar imagen"
                  >
                    <FiX />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedImage !== null && (
        <div
          className="image-gallery__lightbox"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div className="image-gallery__lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="image-gallery__lightbox-close" onClick={closeLightbox}>
              <FiX />
            </button>
            
            <button className="image-gallery__lightbox-nav image-gallery__lightbox-prev" onClick={prevImage}>
              <FiChevronLeft />
            </button>
            
            <button className="image-gallery__lightbox-nav image-gallery__lightbox-next" onClick={nextImage}>
              <FiChevronRight />
            </button>
            
            <img
              src={images[selectedImage]}
              alt={`Imagen ${selectedImage + 1}`}
              className="image-gallery__lightbox-image"
            />
            
            <div className="image-gallery__lightbox-counter">
              {selectedImage + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ImageGallery
