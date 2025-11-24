# 📋 Pasos Después de Crear Google Analytics

## ✅ Paso 1: Completar Configuración de Google Analytics

Después de seleccionar "Crear una cuenta nueva":

1. **Nombre de la cuenta**: Ingresa `VolaBarato Analytics` (o el nombre que prefieras)
2. **Nombre de la propiedad**: Ingresa `VolaBarato` (o el nombre que prefieras)
3. **Zona horaria**: Selecciona tu zona horaria (ej: `America/Argentina/Buenos_Aires`)
4. **Moneda**: Selecciona tu moneda (ej: `ARS` o `USD`)
5. Haz clic en **"Crear cuenta"** o **"Create account"**

---

## ✅ Paso 2: Configurar Firebase Storage

Una vez que el proyecto de Firebase esté creado:

### 2.1. Habilitar Storage
1. En el menú lateral izquierdo, haz clic en **"Storage"**
2. Haz clic en **"Get started"** o **"Comenzar"**
3. Selecciona **"Start in test mode"** (modo de prueba)
4. Selecciona la ubicación del bucket:
   - **Recomendado**: `us-central` (Estados Unidos Central)
   - O la ubicación más cercana a tus usuarios
5. Haz clic en **"Done"** o **"Listo"**

### 2.2. Configurar Reglas de Seguridad
1. En Storage, ve a la pestaña **"Rules"** o **"Reglas"**
2. Reemplaza el código con:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Permitir lectura pública de todas las imágenes
    match /{allPaths=**} {
      allow read: if true;
      // Permitir escritura (por ahora sin autenticación para pruebas)
      // En producción, cambiar a: allow write: if request.auth != null;
      allow write: if true;
    }
  }
}
```

3. Haz clic en **"Publish"** o **"Publicar"**

---

## ✅ Paso 3: Obtener Configuración de Firebase

### 3.1. Crear App Web
1. En Firebase Console, haz clic en el ícono de engranaje ⚙️ (arriba a la izquierda)
2. Selecciona **"Project settings"** o **"Configuración del proyecto"**
3. Baja hasta **"Your apps"** o **"Tus aplicaciones"**
4. Haz clic en el ícono de web `</>` (o en **"Add app"** → **"Web"**)
5. Ingresa un nombre: `VolaBarato Frontend`
6. **NO marques** "Also set up Firebase Hosting" (por ahora)
7. Haz clic en **"Register app"** o **"Registrar aplicación"**

### 3.2. Copiar Configuración
Verás un código como este:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "volabarato.firebaseapp.com",
  projectId: "volabarato",
  storageBucket: "volabarato.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

**⚠️ IMPORTANTE**: Copia estos valores, los necesitarás en el siguiente paso.

---

## ✅ Paso 4: Configurar Variables de Entorno

### 4.1. Crear Archivo .env
1. Ve a la carpeta del frontend: `volabarato_frontend`
2. Crea un archivo llamado `.env` (si no existe)
3. Abre el archivo `.env` en un editor de texto

### 4.2. Agregar Variables de Firebase
Agrega estas líneas al archivo `.env`, reemplazando los valores con los de tu configuración:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyC... (tu apiKey completo)
VITE_FIREBASE_AUTH_DOMAIN=volabarato.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=volabarato
VITE_FIREBASE_STORAGE_BUCKET=volabarato.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# API Backend (ya deberías tener esto)
VITE_API_BASE_URL=http://localhost:4000/api
```

**Ejemplo completo:**
```env
VITE_FIREBASE_API_KEY=AIzaSyC1234567890abcdefghijklmnop
VITE_FIREBASE_AUTH_DOMAIN=volabarato-12345.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=volabarato-12345
VITE_FIREBASE_STORAGE_BUCKET=volabarato-12345.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=987654321
VITE_FIREBASE_APP_ID=1:987654321:web:abcdef1234567890

VITE_API_BASE_URL=http://localhost:4000/api
```

### 4.3. Guardar el Archivo
Guarda el archivo `.env` en la raíz del proyecto frontend.

---

## ✅ Paso 5: Verificar la Configuración

### 5.1. Reiniciar el Servidor
1. Si el servidor de desarrollo está corriendo, deténlo (Ctrl+C)
2. Reinicia el servidor:
   ```bash
   cd volabarato_frontend
   npm run dev
   ```

### 5.2. Verificar en la Consola
1. Abre el navegador en `http://localhost:3000` (o el puerto que uses)
2. Abre la consola del navegador (F12)
3. Ve a la pestaña **"Console"**
4. **No deberías ver errores** relacionados con Firebase
5. Si ves un warning sobre Firebase no configurado, verifica que las variables de entorno estén correctas

---

## ✅ Paso 6: Probar Firebase Storage

### 6.1. Probar Subida de Imagen
1. Ve al panel de administración (si tienes uno)
2. Intenta crear o editar un paquete
3. Usa el componente de subida de imágenes
4. Selecciona una imagen
5. La imagen debería subirse a Firebase Storage

### 6.2. Verificar en Firebase Console
1. Ve a Firebase Console → **Storage**
2. Deberías ver una carpeta `paquetes/` (o la carpeta que hayas configurado)
3. Dentro debería estar la imagen que subiste

---

## 🔧 Solución de Problemas

### Error: "Firebase Storage no está configurado"
**Solución:**
1. Verifica que el archivo `.env` esté en la raíz del proyecto frontend
2. Verifica que las variables empiecen con `VITE_`
3. Reinicia el servidor de desarrollo
4. Verifica que no haya espacios extra en las variables

### Error: "Permission denied"
**Solución:**
1. Ve a Firebase Console → Storage → Rules
2. Verifica que las reglas permitan escritura: `allow write: if true;`
3. Haz clic en "Publish"

### Las imágenes no se suben
**Solución:**
1. Abre la consola del navegador (F12)
2. Revisa los errores en la pestaña "Console"
3. Verifica que Storage esté habilitado en Firebase Console
4. Verifica que las variables de entorno sean correctas

### No veo las variables de entorno
**Solución:**
1. Asegúrate de que el archivo se llame exactamente `.env` (con el punto al inicio)
2. Asegúrate de que esté en la raíz del proyecto frontend
3. Reinicia el servidor de desarrollo

---

## ✅ Checklist Final

- [ ] Google Analytics configurado
- [ ] Firebase Storage habilitado
- [ ] Reglas de seguridad configuradas
- [ ] App web creada en Firebase
- [ ] Configuración de Firebase copiada
- [ ] Variables de entorno configuradas en `.env`
- [ ] Servidor de desarrollo reiniciado
- [ ] Sin errores en la consola del navegador
- [ ] Subida de imágenes probada y funcionando
- [ ] Imágenes visibles en Firebase Console → Storage

---

## 🎯 Próximos Pasos

Una vez que todo esté funcionando:

1. ✅ **Probar subida de imágenes** en el panel de administración
2. ⏭️ **Actualizar componentes existentes** para usar Firebase Storage
3. ⏭️ **Configurar reglas de seguridad** para producción (requerir autenticación)
4. ⏭️ **Configurar Firebase Hosting** (opcional, para deployment)

---

## 📝 Notas Importantes

1. **Archivo .env**: NO debe subirse a Git (ya está en `.gitignore`)
2. **Reglas de Seguridad**: En producción, cambia `allow write: if true;` por `allow write: if request.auth != null;`
3. **Límites**: Plan gratuito de Firebase Storage: 5 GB de almacenamiento, 1 GB de transferencia/día

---

¡Sigue estos pasos y tendrás Firebase Storage funcionando! 🚀

Si tienes algún problema en algún paso, avísame y te ayudo.

