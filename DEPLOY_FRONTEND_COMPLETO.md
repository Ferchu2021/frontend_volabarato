# 🚀 Deploy del Frontend - Guía Completa

## 📋 Opciones de Deployment

Tienes dos opciones principales para desplegar el frontend:

1. **Vercel** (Recomendado - Más fácil y rápido)
2. **Firebase Hosting** (Integrado con Firebase)

---

## 🌐 OPCIÓN 1: Deploy en Vercel (Recomendado)

### Paso 1: Crear Cuenta en Vercel

1. Ve a https://vercel.com
2. Haz clic en **"Sign Up"** o **"Log In"**
3. Elige **"Continue with GitHub"** (recomendado)
4. Autoriza Vercel para acceder a tus repositorios

### Paso 2: Importar Proyecto

1. En el dashboard de Vercel, haz clic en **"Add New..."** → **"Project"**
2. Si es la primera vez, Vercel te pedirá conectar tu cuenta de GitHub
3. Busca y selecciona: **`frontend_volabarato`** (o `Ferchu2021/frontend_volabarato`)

### Paso 3: Configurar el Proyecto

Vercel detectará automáticamente que es un proyecto Vite. Verifica:

- **Framework Preset**: `Vite` (debe detectarse automáticamente)
- **Root Directory**: `./` (raíz del repositorio)
- **Build Command**: `npm run build` (ya configurado)
- **Output Directory**: `dist` (ya configurado)
- **Install Command**: `npm install` (automático)

### Paso 4: Configurar Variables de Entorno

**⚠️ IMPORTANTE**: Antes de hacer deploy, configura las variables de entorno:

1. En la sección **"Environment Variables"**, haz clic en **"Add"**
2. Agrega estas variables:

```
VITE_API_BASE_URL = https://backup-volabarato-1.onrender.com/api
VITE_FIREBASE_API_KEY = AIzaSyD9rzm1vj6tLXbcEJqJ3TIvG1ZbNoPaH2A
VITE_FIREBASE_AUTH_DOMAIN = volabarato-c8c5a.firebaseapp.com
VITE_FIREBASE_PROJECT_ID = volabarato-c8c5a
VITE_FIREBASE_STORAGE_BUCKET = volabarato-c8c5a.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID = 300565876308
VITE_FIREBASE_APP_ID = 1:300565876308:web:b2777261b4069ad23967c1
```

3. Selecciona los ambientes:
   - ☑️ Production
   - ☑️ Preview
   - ☑️ Development

### Paso 5: Deploy

1. Haz clic en **"Deploy"**
2. Vercel comenzará a construir y desplegar
3. El proceso puede tardar 2-5 minutos
4. Obtendrás una URL como: `https://volabarato.vercel.app`

### Paso 6: Verificar Deployment

1. Abre la URL que Vercel te proporciona
2. Verifica que la aplicación carga correctamente
3. Abre la consola del navegador (F12)
4. No deberías ver errores relacionados con Firebase o la API

---

## 🔥 OPCIÓN 2: Deploy en Firebase Hosting

### Paso 1: Instalar Firebase CLI

```bash
npm install -g firebase-tools
```

### Paso 2: Iniciar Sesión en Firebase

```bash
firebase login
```

Esto abrirá tu navegador para autenticarte.

### Paso 3: Inicializar Firebase Hosting

```bash
cd volabarato_frontend
firebase init hosting
```

Sigue las preguntas:
1. **"What do you want to use as your public directory?"** → `dist`
2. **"Configure as a single-page app?"** → `Yes`
3. **"Set up automatic builds and deploys with GitHub?"** → `No` (por ahora)
4. **"File dist/index.html already exists. Overwrite?"** → `No`

### Paso 4: Configurar firebase.json

El archivo `firebase.json` se creará automáticamente. Debería verse así:

```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### Paso 5: Configurar Variables de Entorno en Firebase

Firebase Hosting no soporta variables de entorno directamente. Necesitas:

1. **Opción A**: Crear un archivo `.env.production` y usar un script de build
2. **Opción B**: Configurar las variables en el código (no recomendado para producción)

**Mejor opción**: Usa Vercel que soporta variables de entorno nativamente.

### Paso 6: Build del Frontend

```bash
npm run build
```

### Paso 7: Deploy a Firebase Hosting

```bash
firebase deploy --only hosting
```

### Paso 8: Verificar Deployment

Firebase te dará una URL como: `https://volabarato-c8c5a.web.app`

---

## ✅ Recomendación: Usar Vercel

**Ventajas de Vercel:**
- ✅ Soporte nativo para variables de entorno
- ✅ Más fácil de configurar
- ✅ Deploy automático desde GitHub
- ✅ Mejor integración con Vite
- ✅ CDN global automático

**Ventajas de Firebase Hosting:**
- ✅ Integrado con Firebase
- ✅ Mismo proyecto que Storage
- ⚠️ Requiere más configuración para variables de entorno

---

## 🔒 Paso 3: Configurar Reglas de Seguridad de Firebase Storage

### Paso 1: Ir a Firebase Console

1. Ve a https://console.firebase.google.com/
2. Selecciona tu proyecto: `volabarato-c8c5a`
3. En el menú lateral, haz clic en **"Storage"**

### Paso 2: Ir a Rules

1. En Storage, ve a la pestaña **"Rules"** o **"Reglas"**
2. Verás las reglas actuales (probablemente en modo test)

### Paso 3: Actualizar Reglas para Producción

Reemplaza las reglas con este código:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Permitir lectura pública de todas las imágenes
    match /{allPaths=**} {
      allow read: if true;
      
      // Solo usuarios autenticados pueden escribir
      // Esto protege contra subidas no autorizadas
      allow write: if request.auth != null;
      
      // Opcional: Restricciones adicionales
      // Solo permitir imágenes
      // allow write: if request.auth != null 
      //   && request.resource.contentType.matches('image/.*')
      //   && request.resource.size < 5 * 1024 * 1024; // 5MB máximo
    }
  }
}
```

### Paso 4: Publicar Reglas

1. Haz clic en **"Publish"** o **"Publicar"**
2. Espera a que se publiquen (puede tardar unos segundos)
3. Verás un mensaje de confirmación

### Paso 5: Verificar Reglas

1. Intenta subir una imagen sin estar autenticado
2. Debería fallar con un error de permisos
3. Con autenticación, debería funcionar

---

## 🔐 Reglas Avanzadas (Opcional)

Si quieres más control, puedes usar estas reglas:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Reglas para imágenes de paquetes
    match /paquetes/{allPaths=**} {
      allow read: if true; // Lectura pública
      allow write: if request.auth != null 
        && request.resource.contentType.matches('image/.*')
        && request.resource.size < 5 * 1024 * 1024; // 5MB máximo
    }
    
    // Reglas para imágenes de usuarios
    match /usuarios/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null 
        && request.auth.uid == userId; // Solo el propio usuario
    }
    
    // Reglas por defecto
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## ✅ Checklist de Deployment

### Vercel
- [ ] Cuenta creada en Vercel
- [ ] Repositorio conectado
- [ ] Variables de entorno configuradas
- [ ] Deploy realizado
- [ ] URL de producción funcionando
- [ ] Sin errores en la consola del navegador

### Firebase Hosting (si eliges esta opción)
- [ ] Firebase CLI instalado
- [ ] Iniciado sesión (`firebase login`)
- [ ] Firebase inicializado (`firebase init hosting`)
- [ ] `firebase.json` configurado
- [ ] Build realizado (`npm run build`)
- [ ] Deploy realizado (`firebase deploy --only hosting`)
- [ ] URL de Firebase Hosting funcionando

### Reglas de Seguridad
- [ ] Reglas actualizadas en Firebase Console
- [ ] Reglas publicadas
- [ ] Verificado que requieren autenticación para escribir
- [ ] Probado subida con y sin autenticación

---

## 🎯 Próximos Pasos Después del Deploy

1. **Actualizar CORS en el Backend**
   - Ve a Render → Environment
   - Actualiza `CORS_ORIGIN` con la URL del frontend desplegado

2. **Probar Funcionalidades**
   - Login/Registro
   - Carga de paquetes
   - Subida de imágenes
   - Creación de reservas

3. **Configurar Dominio Personalizado** (Opcional)
   - En Vercel o Firebase Hosting
   - Configurar DNS

---

¿Con cuál opción quieres empezar? Te recomiendo Vercel por su facilidad.

