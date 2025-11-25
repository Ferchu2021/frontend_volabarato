# 🔥 Configurar Firebase Storage - Paso a Paso

## 📋 Resumen

Esta guía te ayudará a configurar Firebase Storage para subir imágenes de paquetes.

---

## PASO 1: Crear Proyecto en Firebase

1. Ve a https://console.firebase.google.com/
2. Haz clic en **"Add project"** o **"Crear proyecto"**
3. Ingresa el nombre: `volabarato` (o el que prefieras)
4. (Opcional) Desactiva Google Analytics si no lo necesitas
5. Haz clic en **"Create project"** o **"Crear proyecto"**
6. Espera a que se cree el proyecto (puede tardar 1-2 minutos)

---

## PASO 2: Habilitar Firebase Storage

1. En el menú lateral izquierdo, haz clic en **"Storage"**
2. Haz clic en **"Get started"** o **"Comenzar"**
3. Selecciona **"Start in test mode"** (por ahora, luego ajustaremos las reglas)
4. Selecciona la ubicación del bucket (elige la más cercana a tus usuarios, ej: `us-central`)
5. Haz clic en **"Done"** o **"Listo"**

---

## PASO 3: Configurar Reglas de Seguridad

1. En Storage, ve a la pestaña **"Rules"** o **"Reglas"**
2. Reemplaza las reglas con este código:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Permitir lectura pública de todas las imágenes
    match /{allPaths=**} {
      allow read: if true;
      // Solo usuarios autenticados pueden escribir
      // Por ahora, permitimos escritura para pruebas
      // En producción, deberías requerir autenticación
      allow write: if true; // Cambiar a: if request.auth != null; en producción
    }
  }
}
```

3. Haz clic en **"Publish"** o **"Publicar"**

**⚠️ IMPORTANTE**: Las reglas actuales permiten escritura sin autenticación. En producción, cambia `allow write: if true;` por `allow write: if request.auth != null;`

---

## PASO 4: Obtener Configuración de Firebase

1. En Firebase Console, haz clic en el ícono de engranaje ⚙️ (arriba a la izquierda)
2. Selecciona **"Project settings"** o **"Configuración del proyecto"**
3. Baja hasta la sección **"Your apps"** o **"Tus aplicaciones"**
4. Haz clic en el ícono de web `</>` (si no hay ninguna app web, haz clic en **"Add app"** → **"Web"**)
5. Ingresa un nombre para la app: `VolaBarato Frontend`
6. **NO marques** "Also set up Firebase Hosting" (por ahora)
7. Haz clic en **"Register app"** o **"Registrar aplicación"**
8. **Copia** la configuración que aparece (firebaseConfig)

Se verá así:
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

---

## PASO 5: Configurar Variables de Entorno

1. En el frontend, crea o edita el archivo `.env` (en la raíz del proyecto)
2. Agrega estas variables con los valores de tu configuración de Firebase:

```env
VITE_FIREBASE_API_KEY=AIzaSyC... (tu apiKey)
VITE_FIREBASE_AUTH_DOMAIN=volabarato.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=volabarato
VITE_FIREBASE_STORAGE_BUCKET=volabarato.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

3. Guarda el archivo `.env`

**⚠️ IMPORTANTE**: 
- El archivo `.env` NO debe subirse a Git (ya está en `.gitignore`)
- Usa `.env.example` como plantilla para otros desarrolladores

---

## PASO 6: Verificar la Configuración

1. Reinicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

2. Abre la consola del navegador (F12)
3. No deberías ver errores relacionados con Firebase
4. Si ves un warning sobre Firebase no configurado, verifica que las variables de entorno estén correctas

---

## PASO 7: Probar la Subida de Imágenes

1. Ve al panel de administración
2. Intenta crear o editar un paquete
3. Sube una imagen usando el componente `ImageUploadWithFirebase`
4. La imagen debería subirse a Firebase Storage
5. Verifica en Firebase Console → Storage que la imagen se haya subido

---

## ✅ Checklist de Verificación

- [ ] Proyecto creado en Firebase Console
- [ ] Storage habilitado
- [ ] Reglas de seguridad configuradas
- [ ] Configuración de Firebase obtenida
- [ ] Variables de entorno configuradas en `.env`
- [ ] Servidor de desarrollo reiniciado
- [ ] Sin errores en la consola del navegador
- [ ] Subida de imágenes probada y funcionando

---

## 🔧 Solución de Problemas

### Error: "Firebase Storage no está configurado"
**Solución**: Verifica que las variables de entorno estén en `.env` y que el servidor se haya reiniciado.

### Error: "Permission denied"
**Solución**: Verifica las reglas de seguridad en Firebase Storage. Asegúrate de que `allow write: if true;` esté configurado.

### Error: "Network request failed"
**Solución**: Verifica que la conexión a internet funcione y que Firebase Storage esté habilitado.

### Las imágenes no se suben
**Solución**: 
1. Abre la consola del navegador (F12)
2. Revisa los errores
3. Verifica que las variables de entorno sean correctas
4. Verifica que el bucket de Storage esté creado

---

## 📝 Notas Importantes

1. **Reglas de Seguridad**: En producción, cambia las reglas para requerir autenticación:
   ```javascript
   allow write: if request.auth != null;
   ```

2. **Límites de Firebase Storage**:
   - Plan gratuito: 5 GB de almacenamiento
   - 1 GB de transferencia/día
   - Para más, necesitarás el plan Blaze (pago por uso)

3. **Organización de Archivos**: Las imágenes se guardan en carpetas:
   - `paquetes/` - Imágenes de paquetes
   - `usuarios/` - Imágenes de usuarios (si se implementa)
   - `destinos/` - Imágenes de destinos (si se implementa)

---

## 🎯 Próximos Pasos

Una vez configurado Firebase Storage:

1. ✅ Probar subida de imágenes
2. ⏭️ Actualizar componentes existentes para usar Firebase Storage
3. ⏭️ Configurar Firebase Hosting (opcional)
4. ⏭️ Configurar reglas de seguridad para producción

---

¡Listo! Firebase Storage está configurado. 🚀

