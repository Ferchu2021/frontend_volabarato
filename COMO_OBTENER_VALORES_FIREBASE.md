# 🔥 Cómo Obtener los Valores de Firebase para .env

## 📋 Paso a Paso

### Paso 1: Ir a Firebase Console
1. Ve a https://console.firebase.google.com/
2. Selecciona tu proyecto: **volabarato**

### Paso 2: Ir a Project Settings
1. Haz clic en el ícono de engranaje ⚙️ (arriba a la izquierda)
2. Selecciona **"Project settings"** o **"Configuración del proyecto"**

### Paso 3: Ir a la Sección "Your apps"
1. Baja hasta la sección **"Your apps"** o **"Tus aplicaciones"**
2. Si ya tienes una app web, haz clic en ella
3. Si NO tienes una app web:
   - Haz clic en el ícono de web `</>`
   - O haz clic en **"Add app"** → **"Web"**

### Paso 4: Registrar App (Si es nueva)
1. Ingresa un nombre: `VolaBarato Frontend`
2. **NO marques** "Also set up Firebase Hosting" (por ahora)
3. Haz clic en **"Register app"** o **"Registrar aplicación"**

### Paso 5: Copiar la Configuración
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

### Paso 6: Mapear Valores al .env

Copia cada valor y pégalo en el archivo `.env`:

| Valor en Firebase Config | Variable en .env |
|-------------------------|------------------|
| `apiKey` | `VITE_FIREBASE_API_KEY` |
| `authDomain` | `VITE_FIREBASE_AUTH_DOMAIN` |
| `projectId` | `VITE_FIREBASE_PROJECT_ID` |
| `storageBucket` | `VITE_FIREBASE_STORAGE_BUCKET` |
| `messagingSenderId` | `VITE_FIREBASE_MESSAGING_SENDER_ID` |
| `appId` | `VITE_FIREBASE_APP_ID` |

### Ejemplo:

**Si en Firebase ves:**
```javascript
apiKey: "AIzaSyC1234567890abcdefghijklmnop"
```

**En .env debería ser:**
```env
VITE_FIREBASE_API_KEY=AIzaSyC1234567890abcdefghijklmnop
```

---

## ✅ Ejemplo Completo

### Configuración de Firebase:
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

### Archivo .env correspondiente:
```env
VITE_FIREBASE_API_KEY=AIzaSyC1234567890abcdefghijklmnop
VITE_FIREBASE_AUTH_DOMAIN=volabarato-12345.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=volabarato-12345
VITE_FIREBASE_STORAGE_BUCKET=volabarato-12345.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=987654321
VITE_FIREBASE_APP_ID=1:987654321:web:abcdef1234567890
```

---

## ⚠️ Importante

1. **NO incluyas comillas** en el archivo .env
2. **NO incluyas espacios** antes o después del `=`
3. **Copia exactamente** los valores (sin comillas)
4. **Guarda el archivo** después de editar

---

## 🔍 Verificar que Funciona

Después de configurar el `.env`:

1. Reinicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

2. Abre la consola del navegador (F12)
3. No deberías ver errores relacionados con Firebase
4. Si ves un warning, verifica que los valores sean correctos

---

¿Necesitas ayuda para obtener los valores? Avísame y te guío paso a paso.

