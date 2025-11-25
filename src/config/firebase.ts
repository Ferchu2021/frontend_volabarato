import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

// Configuración de Firebase
// IMPORTANTE: Reemplaza estos valores con los de tu proyecto Firebase
// Los obtienes en: Firebase Console → Project Settings → Your apps → Web app
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

// Verificar que la configuración esté completa
if (!firebaseConfig.apiKey || !firebaseConfig.storageBucket) {
  console.warn('⚠️ Firebase no está configurado. Agrega las variables de entorno en .env');
}

// Inicializar Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error('Error al inicializar Firebase:', error);
}

// Inicializar Storage
export const storage = app ? getStorage(app) : null;

export default app;

