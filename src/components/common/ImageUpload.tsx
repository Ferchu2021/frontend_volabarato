import React, { useState, useRef } from 'react'
import { FiUpload, FiX, FiImage } from 'react-icons/fi'
import './ImageUpload.css'

interface ImageUploadProps {
  onImageSelect: (imageData: string) => void
  currentImage?: string
  label?: string
  required?: boolean
  maxSize?: number // in MB
  acceptedTypes?: string[]
  className?: string
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelect,
  currentImage,
  label = 'Subir imagen',
  required = false,
  maxSize = 5, // 5MB default
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  className = ''
}) => {
  const [preview, setPreview] = useState<string | null>(currentImage || null)
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

    setError(null)
    return true
  }

  const processImage = (file: File) => {
    if (!validateFile(file)) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setPreview(result)
      onImageSelect(result)
    }
    reader.readAsDataURL(file)
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      processImage(file)
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

    const file = e.dataTransfer.files?.[0]
    if (file) {
      processImage(file)
    }
  }

  const handleRemoveImage = () => {
    setPreview(null)
    onImageSelect('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`image-upload ${className}`}>
      {label && (
        <label className="image-upload__label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}

      <div
        className={`image-upload__area ${dragActive ? 'drag-active' : ''} ${
          preview ? 'has-preview' : ''
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        {preview ? (
          <div className="image-upload__preview">
            <img src={preview} alt="Preview" />
            <button
              type="button"
              className="image-upload__remove"
              onClick={(e) => {
                e.stopPropagation()
                handleRemoveImage()
              }}
            >
              <FiX />
            </button>
          </div>
        ) : (
          <div className="image-upload__placeholder">
            <FiImage className="image-upload__icon" />
            <p className="image-upload__text">
              <FiUpload className="upload-icon" />
              Arrastra una imagen aquí o haz clic para seleccionar
            </p>
            <p className="image-upload__info">
              Formatos: JPG, PNG, WebP • Máximo: {maxSize}MB
            </p>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleFileSelect}
        className="image-upload__input"
      />

      {error && <p className="image-upload__error">{error}</p>}
    </div>
  )
}

export default ImageUpload
