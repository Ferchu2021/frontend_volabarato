import React, { useState, useRef } from 'react'
import { FiUpload, FiPlus } from 'react-icons/fi'
import ImageGallery from './ImageGallery'
import './MultipleImageUpload.css'

interface MultipleImageUploadProps {
  onImagesChange: (images: string[]) => void
  currentImages?: string[]
  label?: string
  required?: boolean
  maxImages?: number
  maxSize?: number // in MB
  acceptedTypes?: string[]
  className?: string
}

const MultipleImageUpload: React.FC<MultipleImageUploadProps> = ({
  onImagesChange,
  currentImages = [],
  label = 'Subir imágenes',
  required = false,
  maxImages = 10,
  maxSize = 5, // 5MB default
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  className = ''
}) => {
  const [images, setImages] = useState<string[]>(currentImages)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): boolean => {
    // Check file type
    if (!acceptedTypes.includes(file.type)) {
      setError('Tipo de archivo no soportado. Solo se permiten imágenes.')
      return false
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`El archivo es muy grande. Máximo ${maxSize}MB.`)
      return false
    }

    // Check max images limit
    if (images.length >= maxImages) {
      setError(`Máximo ${maxImages} imágenes permitidas.`)
      return false
    }

    setError(null)
    return true
  }

  const processImage = (file: File) => {
    if (!validateFile(file)) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      const newImages = [...images, result]
      setImages(newImages)
      onImagesChange(newImages)
    }
    reader.readAsDataURL(file)
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    files.forEach(processImage)
    
    // Reset input value
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = Array.from(e.dataTransfer.files)
    files.forEach(processImage)
  }

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)
    onImagesChange(newImages)
  }

  const handleClick = () => {
    if (images.length < maxImages) {
      fileInputRef.current?.click()
    }
  }

  const canAddMore = images.length < maxImages

  return (
    <div className={`multiple-image-upload ${className}`}>
      {label && (
        <label className="multiple-image-upload__label">
          {label}
          {required && <span className="required">*</span>}
          <span className="image-count">
            ({images.length}/{maxImages})
          </span>
        </label>
      )}

      {/* Image Gallery */}
      {images.length > 0 && (
        <div className="multiple-image-upload__gallery">
          <ImageGallery
            images={images}
          />
        </div>
      )}

      {/* Upload Area */}
      {canAddMore && (
        <div
          className={`multiple-image-upload__area ${dragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <div className="multiple-image-upload__placeholder">
            <FiPlus className="multiple-image-upload__icon" />
            <p className="multiple-image-upload__text">
              <FiUpload className="upload-icon" />
              Arrastra imágenes aquí o haz clic para seleccionar
            </p>
            <p className="multiple-image-upload__info">
              Formatos: JPG, PNG, WebP • Máximo: {maxSize}MB por imagen
            </p>
            <p className="multiple-image-upload__limit">
              Puedes agregar {maxImages - images.length} imagen{maxImages - images.length !== 1 ? 'es' : ''} más
            </p>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(',')}
        onChange={handleFileSelect}
        className="multiple-image-upload__input"
      />

      {error && <p className="multiple-image-upload__error">{error}</p>}
      
      {!canAddMore && (
        <p className="multiple-image-upload__limit-reached">
          Has alcanzado el límite máximo de {maxImages} imágenes
        </p>
      )}
    </div>
  )
}

export default MultipleImageUpload
