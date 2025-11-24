import React, { useState, useRef } from 'react'
import { FiUpload, FiX, FiImage, FiLoader } from 'react-icons/fi'
import { uploadImage } from '../../services/firebaseStorage'
import './ImageUpload.css'

interface ImageUploadWithFirebaseProps {
  onImageUpload: (imageUrl: string) => void
  currentImage?: string
  label?: string
  required?: boolean
  maxSize?: number // in MB
  acceptedTypes?: string[]
  className?: string
  folder?: string // Carpeta en Firebase Storage
}

const ImageUploadWithFirebase: React.FC<ImageUploadWithFirebaseProps> = ({
  onImageUpload,
  currentImage,
  label = 'Subir imagen',
  required = false,
  maxSize = 5, // 5MB default
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  className = '',
  folder = 'paquetes'
}) => {
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
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

  const handleImageUpload = async (file: File) => {
    if (!validateFile(file)) return

    setUploading(true)
    setError(null)

    try {
      // Mostrar preview local mientras se sube
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setPreview(result)
      }
      reader.readAsDataURL(file)

      // Subir a Firebase Storage
      const imageUrl = await uploadImage(file, folder)
      
      // Actualizar preview con la URL de Firebase
      setPreview(imageUrl)
      
      // Notificar al componente padre
      onImageUpload(imageUrl)
      
      setUploading(false)
    } catch (err) {
      console.error('Error al subir imagen:', err)
      setError(err instanceof Error ? err.message : 'Error al subir la imagen')
      setPreview(null)
      setUploading(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleImageUpload(file)
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
      handleImageUpload(file)
    }
  }

  const handleRemoveImage = () => {
    setPreview(null)
    onImageUpload('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClick = () => {
    if (!uploading) {
      fileInputRef.current?.click()
    }
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
        } ${uploading ? 'uploading' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        {uploading ? (
          <div className="image-upload__uploading">
            <FiLoader className="spinner" />
            <p>Subiendo imagen...</p>
          </div>
        ) : preview ? (
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
        disabled={uploading}
      />

      {error && <p className="image-upload__error">{error}</p>}
    </div>
  )
}

export default ImageUploadWithFirebase

