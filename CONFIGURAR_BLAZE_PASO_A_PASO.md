# 🔥 Configurar Blaze con Tier Gratuito - Paso a Paso

## ✅ Paso 1: Actualizar Plan a Blaze

### 1.1. En la Pantalla de Storage
1. Verás el mensaje: **"Para usar Storage, actualiza el plan de facturación de tu proyecto"**
2. Haz clic en el botón naranja **"Actualizar proyecto"**

### 1.2. Seleccionar Plan Blaze
1. Se abrirá una nueva pantalla con información sobre los planes
2. Verás dos opciones:
   - **Spark** (gratuito, pero sin Storage)
   - **Blaze** (pago por uso, con tier gratuito)
3. Selecciona **"Blaze"** o **"Pay as you go"**
4. Haz clic en **"Continuar"** o **"Continue"**

### 1.3. Revisar Información del Plan
1. Firebase te mostrará información sobre el plan Blaze
2. Verás que menciona el **tier gratuito** disponible
3. Haz clic en **"Continuar"** o **"Continue"**

---

## ✅ Paso 2: Configurar Método de Pago

### 2.1. Agregar Método de Pago
1. Si es la primera vez, te pedirá agregar un método de pago
2. **NO te preocupes**: No se te cobrará nada hasta que superes el tier gratuito
3. Haz clic en **"Agregar método de pago"** o **"Add payment method"**

### 2.2. Ingresar Información de Pago
1. Selecciona el tipo de método:
   - **Tarjeta de crédito** (más común)
   - **Cuenta bancaria** (si está disponible en tu país)
2. Ingresa la información:
   - Número de tarjeta
   - Fecha de vencimiento
   - CVV
   - Nombre en la tarjeta
   - Dirección de facturación
3. Haz clic en **"Guardar"** o **"Save"**

### 2.3. Confirmar
1. Firebase puede pedirte confirmar el método de pago
2. Sigue las instrucciones en pantalla
3. Una vez confirmado, volverás a la pantalla principal

---

## ✅ Paso 3: Configurar Alertas de Presupuesto (Recomendado)

### 3.1. Ir a Usage and Billing
1. En Firebase Console, haz clic en el ícono de engranaje ⚙️ (arriba a la izquierda)
2. Selecciona **"Usage and billing"** o **"Uso y facturación"**

### 3.2. Configurar Alerta de Presupuesto
1. Busca la sección **"Budget alerts"** o **"Alertas de presupuesto"**
2. Haz clic en **"Set budget alert"** o **"Configurar alerta de presupuesto"**
3. Configura:
   - **Presupuesto**: `1` USD (o el monto que prefieras)
   - **Alertas**: 
     - ☑️ Al 50% del presupuesto
     - ☑️ Al 90% del presupuesto
     - ☑️ Al 100% del presupuesto
4. Haz clic en **"Save"** o **"Guardar"**

**Esto te protegerá**: Te avisará por email si hay uso inesperado.

---

## ✅ Paso 4: Habilitar Firebase Storage

### 4.1. Volver a Storage
1. En el menú lateral izquierdo, haz clic en **"Storage"**
2. Ahora deberías ver el botón **"Get started"** o **"Comenzar"**
3. Si no lo ves, refresca la página (F5)

### 4.2. Iniciar Storage
1. Haz clic en **"Get started"** o **"Comenzar"**
2. Se abrirá un asistente de configuración

### 4.3. Configurar Storage
1. **Modo de seguridad**: Selecciona **"Start in test mode"**
   - Esto permite lectura y escritura sin autenticación (solo para desarrollo)
   - Podemos cambiar esto después para producción
2. **Ubicación del bucket**: Selecciona una ubicación
   - **Recomendado**: `us-central` (Estados Unidos Central)
   - O la ubicación más cercana a tus usuarios
3. Haz clic en **"Done"** o **"Listo"**

### 4.4. Esperar Configuración
1. Firebase configurará Storage (puede tardar 1-2 minutos)
2. Verás un mensaje de "Configurando Storage..."
3. Cuando termine, verás la interfaz de Storage

---

## ✅ Paso 5: Configurar Reglas de Seguridad

### 5.1. Ir a Rules
1. En Storage, ve a la pestaña **"Rules"** o **"Reglas"**
2. Verás las reglas por defecto en modo test

### 5.2. Actualizar Reglas
1. Reemplaza el código con este:

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

2. **Copia y pega** este código en el editor

### 5.3. Publicar Reglas
1. Haz clic en **"Publish"** o **"Publicar"**
2. Espera a que se publiquen (puede tardar unos segundos)
3. Verás un mensaje de confirmación

---

## ✅ Paso 6: Verificar que Storage Esté Funcionando

### 6.1. Verificar Interfaz
1. En Storage, deberías ver:
   - Una lista vacía (porque aún no hay archivos)
   - Un botón **"Upload file"** o **"Subir archivo"**
   - Las pestañas: **"Files"**, **"Rules"**, **"Usage"**

### 6.2. Probar Subida (Opcional)
1. Haz clic en **"Upload file"** o **"Subir archivo"**
2. Selecciona una imagen de prueba (cualquier imagen pequeña)
3. Haz clic en **"Upload"** o **"Subir"**
4. La imagen debería aparecer en la lista
5. Puedes eliminarla después haciendo clic en los tres puntos → **"Delete"**

---

## ✅ Paso 7: Obtener Configuración de Firebase

### 7.1. Ir a Project Settings
1. En Firebase Console, haz clic en el ícono de engranaje ⚙️
2. Selecciona **"Project settings"** o **"Configuración del proyecto"**

### 7.2. Crear App Web
1. Baja hasta la sección **"Your apps"** o **"Tus aplicaciones"**
2. Si no hay ninguna app web, haz clic en el ícono de web `</>`
3. Si ya hay una app, haz clic en ella

### 7.3. Registrar App (Si es nueva)
1. Ingresa un nombre: `VolaBarato Frontend`
2. **NO marques** "Also set up Firebase Hosting" (por ahora)
3. Haz clic en **"Register app"** o **"Registrar aplicación"**

### 7.4. Copiar Configuración
Verás un código como este:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC1234567890abcdefghijklmnop",
  authDomain: "volabarato-12345.firebaseapp.com",
  projectId: "volabarato-12345",
  storageBucket: "volabarato-12345.appspot.com",
  messagingSenderId: "987654321",
  appId: "1:987654321:web:abcdef1234567890"
};
```

**⚠️ IMPORTANTE**: 
- **Copia estos valores** (los necesitarás en el siguiente paso)
- Puedes copiar todo el objeto o cada valor individualmente
- Guárdalos en un lugar seguro temporalmente

---

## ✅ Paso 8: Configurar Variables de Entorno

### 8.1. Crear Archivo .env
1. Ve a la carpeta del frontend: `volabarato_frontend`
2. Crea un archivo llamado `.env` (si no existe)
   - **Importante**: El archivo debe llamarse exactamente `.env` (con el punto al inicio)
   - Si usas Windows, puede que necesites crear un archivo de texto y renombrarlo a `.env`

### 8.2. Agregar Variables de Firebase
Abre el archivo `.env` y agrega estas líneas, reemplazando los valores con los que copiaste:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=tu_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain_aqui
VITE_FIREBASE_PROJECT_ID=tu_project_id_aqui
VITE_FIREBASE_STORAGE_BUCKET=tu_storage_bucket_aqui
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id_aqui
VITE_FIREBASE_APP_ID=tu_app_id_aqui

# API Backend
VITE_API_BASE_URL=http://localhost:4000/api
```

**Ejemplo real** (reemplaza con tus valores):
```env
VITE_FIREBASE_API_KEY=AIzaSyC1234567890abcdefghijklmnop
VITE_FIREBASE_AUTH_DOMAIN=volabarato-12345.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=volabarato-12345
VITE_FIREBASE_STORAGE_BUCKET=volabarato-12345.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=987654321
VITE_FIREBASE_APP_ID=1:987654321:web:abcdef1234567890

VITE_API_BASE_URL=http://localhost:4000/api
```

### 8.3. Guardar el Archivo
1. Guarda el archivo `.env`
2. **Asegúrate** de que esté en la raíz del proyecto frontend

---

## ✅ Paso 9: Reiniciar Servidor y Verificar

### 9.1. Reiniciar Servidor de Desarrollo
1. Si el servidor está corriendo, deténlo (Ctrl+C en la terminal)
2. Reinicia el servidor:
   ```bash
   cd volabarato_frontend
   npm run dev
   ```

### 9.2. Verificar en la Consola del Navegador
1. Abre el navegador en `http://localhost:3000` (o el puerto que uses)
2. Abre la consola del navegador (F12)
3. Ve a la pestaña **"Console"**
4. **No deberías ver errores** relacionados con Firebase
5. Si ves un warning sobre Firebase no configurado, verifica que las variables de entorno estén correctas

---

## ✅ Checklist Final

- [ ] Plan Blaze seleccionado
- [ ] Método de pago configurado
- [ ] Alerta de presupuesto configurada (opcional pero recomendado)
- [ ] Storage habilitado
- [ ] Reglas de seguridad configuradas y publicadas
- [ ] Storage funcionando (puedes ver la interfaz)
- [ ] Configuración de Firebase copiada
- [ ] Variables de entorno configuradas en `.env`
- [ ] Servidor de desarrollo reiniciado
- [ ] Sin errores en la consola del navegador

---

## 🎯 Próximo Paso

Una vez completados todos los pasos, estarás listo para:
1. ✅ Usar Firebase Storage en tu aplicación
2. ✅ Subir imágenes desde el frontend
3. ✅ Las imágenes se guardarán en Firebase Storage

---

## 🔧 Si Tienes Problemas

### No veo el botón "Get started" después de actualizar
- Refresca la página (F5)
- Espera 1-2 minutos y vuelve a intentar
- Verifica que el plan se haya actualizado correctamente

### Error al configurar método de pago
- Verifica que la información sea correcta
- Intenta desde otro navegador
- Verifica que tu tarjeta esté activa

### Las variables de entorno no funcionan
- Verifica que el archivo se llame exactamente `.env` (con punto)
- Verifica que esté en la raíz del proyecto frontend
- Reinicia el servidor de desarrollo
- Verifica que no haya espacios extra en las variables

---

¡Sigue estos pasos y tendrás Firebase Storage funcionando! 🚀

¿En qué paso estás ahora? Avísame si necesitas ayuda con algún paso específico.

