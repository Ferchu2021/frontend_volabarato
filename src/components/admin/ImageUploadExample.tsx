import { useState } from 'react'
import ImageUpload from '../common/ImageUpload'
import MultipleImageUpload from '../common/MultipleImageUpload'
import ImageGallery from '../common/ImageGallery'
import './ImageUploadExample.css'

const ImageUploadExample = () => {
  const [singleImage, setSingleImage] = useState<string>('')
  const [multipleImages, setMultipleImages] = useState<string[]>([])

  const handleSingleImageChange = (imageData: string) => {
    setSingleImage(imageData)
    console.log('Single image changed:', imageData ? 'Image uploaded' : 'Image removed')
  }

  const handleMultipleImagesChange = (images: string[]) => {
    setMultipleImages(images)
    console.log('Multiple images changed:', images.length, 'images')
  }

  const handleRemoveImage = (index: number) => {
    const newImages = multipleImages.filter((_, i) => i !== index)
    setMultipleImages(newImages)
  }

  return (
    <div className="image-upload-example">
      <h2>Ejemplos de Carga de Imágenes</h2>
      
      <div className="example-section">
        <h3>1. Carga de Imagen Única</h3>
        <p>Componente para subir una sola imagen con preview y validación.</p>
        
        <ImageUpload
          onImageSelect={handleSingleImageChange}
          currentImage={singleImage}
          label="Imagen Principal del Viaje"
          required={true}
          maxSize={3}
        />
        
        {singleImage && (
          <div className="preview-section">
            <h4>Imagen Seleccionada:</h4>
            <img src={singleImage} alt="Preview" className="preview-image" />
          </div>
        )}
      </div>

      <div className="example-section">
        <h3>2. Carga de Múltiples Imágenes</h3>
        <p>Componente para subir varias imágenes con galería y límite configurable.</p>
        
        <MultipleImageUpload
          onImagesChange={handleMultipleImagesChange}
          currentImages={multipleImages}
          label="Galería de Imágenes del Viaje"
          maxImages={5}
          maxSize={2}
        />
        
        {multipleImages.length > 0 && (
          <div className="preview-section">
            <h4>Galería de Imágenes:</h4>
            <ImageGallery
              images={multipleImages}
              onImageRemove={handleRemoveImage}
              editable={true}
              maxImages={5}
            />
          </div>
        )}
      </div>

      <div className="example-section">
        <h3>3. Galería de Solo Lectura</h3>
        <p>Componente para mostrar imágenes sin opción de edición.</p>
        
        {multipleImages.length > 0 ? (
          <ImageGallery
            images={multipleImages}
            editable={false}
            maxImages={5}
          />
        ) : (
          <p className="no-images">No hay imágenes para mostrar. Sube algunas imágenes arriba.</p>
        )}
      </div>

      <div className="example-section">
        <h3>4. Información del Sistema</h3>
        <div className="info-grid">
          <div className="info-item">
            <h4>Formato de Imágenes</h4>
            <ul>
              <li>JPG / JPEG</li>
              <li>PNG</li>
              <li>WebP</li>
            </ul>
          </div>
          
          <div className="info-item">
            <h4>Límites</h4>
            <ul>
              <li>Imagen única: 3MB</li>
              <li>Múltiples: 2MB por imagen</li>
              <li>Máximo: 5 imágenes</li>
            </ul>
          </div>
          
          <div className="info-item">
            <h4>Funcionalidades</h4>
            <ul>
              <li>Drag & Drop</li>
              <li>Preview en tiempo real</li>
              <li>Validación automática</li>
              <li>Lightbox para visualización</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageUploadExample
