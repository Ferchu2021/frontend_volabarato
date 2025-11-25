import { ref, uploadBytes, getDownloadURL, deleteObject, UploadResult } from 'firebase/storage';
import { storage } from '../config/firebase';

/**
 * Sube una imagen a Firebase Storage
 * @param file - Archivo de imagen
 * @param folder - Carpeta donde guardar (ej: 'paquetes', 'usuarios', 'destinos')
 * @returns URL de la imagen subida
 */
export const uploadImage = async (
  file: File,
  folder: string = 'paquetes'
): Promise<string> => {
  if (!storage) {
    throw new Error('Firebase Storage no está configurado. Verifica las variables de entorno.');
  }

  try {
    // Crear referencia única para el archivo
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileName = `${folder}/${timestamp}_${randomString}_${file.name}`;
    const storageRef = ref(storage, fileName);

    // Subir el archivo
    const uploadResult: UploadResult = await uploadBytes(storageRef, file);

    // Obtener la URL de descarga
    const downloadURL = await getDownloadURL(uploadResult.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error al subir imagen a Firebase Storage:', error);
    throw new Error('Error al subir la imagen. Por favor, intenta nuevamente.');
  }
};

/**
 * Sube múltiples imágenes a Firebase Storage
 * @param files - Array de archivos de imagen
 * @param folder - Carpeta donde guardar
 * @returns Array de URLs de las imágenes subidas
 */
export const uploadMultipleImages = async (
  files: File[],
  folder: string = 'paquetes'
): Promise<string[]> => {
  if (!storage) {
    throw new Error('Firebase Storage no está configurado. Verifica las variables de entorno.');
  }

  try {
    const uploadPromises = files.map(file => uploadImage(file, folder));
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error('Error al subir múltiples imágenes:', error);
    throw new Error('Error al subir las imágenes. Por favor, intenta nuevamente.');
  }
};

/**
 * Elimina una imagen de Firebase Storage
 * @param imageUrl - URL de la imagen a eliminar
 */
export const deleteImage = async (imageUrl: string): Promise<void> => {
  if (!storage) {
    throw new Error('Firebase Storage no está configurado. Verifica las variables de entorno.');
  }

  try {
    // Extraer la ruta del archivo de la URL de Firebase Storage
    // Las URLs de Firebase Storage tienen el formato:
    // https://firebasestorage.googleapis.com/v0/b/BUCKET_NAME/o/PATH?alt=media&token=TOKEN
    const url = new URL(imageUrl);
    
    // Si es una URL de Firebase Storage, extraer el path
    if (url.hostname.includes('firebasestorage.googleapis.com')) {
      const pathMatch = url.pathname.match(/\/o\/(.+)\?/);
      if (pathMatch && pathMatch[1]) {
        const filePath = decodeURIComponent(pathMatch[1]);
        const imageRef = ref(storage, filePath);
        await deleteObject(imageRef);
        return;
      }
    }
    
    // Si no es una URL de Firebase Storage, no hacer nada
    console.warn('La URL proporcionada no es de Firebase Storage:', imageUrl);
  } catch (error) {
    console.error('Error al eliminar imagen de Firebase Storage:', error);
    throw new Error('Error al eliminar la imagen.');
  }
};

/**
 * Verifica si una URL es de Firebase Storage
 * @param url - URL a verificar
 * @returns true si es una URL de Firebase Storage
 */
export const isFirebaseStorageUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.includes('firebasestorage.googleapis.com');
  } catch {
    return false;
  }
};

