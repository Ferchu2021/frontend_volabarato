# 🔄 Mapeo de Valores de Firebase a .env - Guía Visual

## 📋 Paso a Paso Detallado

### Paso 1: Tener Abiertos Ambos Archivos

1. **Firebase Console** (en tu navegador)
   - Firebase Console → ⚙️ → Project settings → Your apps → Web app
   - Verás el código `firebaseConfig`

2. **Archivo .env** (en tu editor)
   - Ubicación: `C:\Users\Administrator\Desktop\volabarato_frontend\.env`
   - Ábrelo con Notepad o tu editor favorito

---

## 🔄 Mapeo Visual

### Ejemplo de Firebase Config (lo que ves en Firebase Console):

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

### Archivo .env (lo que debes escribir):

```env
VITE_FIREBASE_API_KEY=AIzaSyC1234567890abcdefghijklmnop
VITE_FIREBASE_AUTH_DOMAIN=volabarato-12345.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=volabarato-12345
VITE_FIREBASE_STORAGE_BUCKET=volabarato-12345.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=987654321
VITE_FIREBASE_APP_ID=1:987654321:web:abcdef1234567890
```

---

## 📝 Instrucciones Detalladas

### Valor 1: apiKey

**En Firebase:**
```javascript
apiKey: "AIzaSyC1234567890abcdefghijklmnop"
```

**En .env:**
```env
VITE_FIREBASE_API_KEY=AIzaSyC1234567890abcdefghijklmnop
```

**Pasos:**
1. En Firebase, copia el valor entre las comillas: `AIzaSyC1234567890abcdefghijklmnop`
2. En .env, busca la línea: `VITE_FIREBASE_API_KEY=REEMPLAZA_CON_TU_API_KEY`
3. Reemplaza `REEMPLAZA_CON_TU_API_KEY` con el valor que copiaste
4. **NO incluyas las comillas**

---

### Valor 2: authDomain

**En Firebase:**
```javascript
authDomain: "volabarato-12345.firebaseapp.com"
```

**En .env:**
```env
VITE_FIREBASE_AUTH_DOMAIN=volabarato-12345.firebaseapp.com
```

**Pasos:**
1. En Firebase, copia el valor entre las comillas: `volabarato-12345.firebaseapp.com`
2. En .env, busca: `VITE_FIREBASE_AUTH_DOMAIN=REEMPLAZA_CON_TU_AUTH_DOMAIN`
3. Reemplaza `REEMPLAZA_CON_TU_AUTH_DOMAIN` con el valor copiado
4. **NO incluyas las comillas**

---

### Valor 3: projectId

**En Firebase:**
```javascript
projectId: "volabarato-12345"
```

**En .env:**
```env
VITE_FIREBASE_PROJECT_ID=volabarato-12345
```

**Pasos:**
1. En Firebase, copia el valor entre las comillas: `volabarato-12345`
2. En .env, busca: `VITE_FIREBASE_PROJECT_ID=REEMPLAZA_CON_TU_PROJECT_ID`
3. Reemplaza `REEMPLAZA_CON_TU_PROJECT_ID` con el valor copiado
4. **NO incluyas las comillas**

---

### Valor 4: storageBucket

**En Firebase:**
```javascript
storageBucket: "volabarato-12345.appspot.com"
```

**En .env:**
```env
VITE_FIREBASE_STORAGE_BUCKET=volabarato-12345.appspot.com
```

**Pasos:**
1. En Firebase, copia el valor entre las comillas: `volabarato-12345.appspot.com`
2. En .env, busca: `VITE_FIREBASE_STORAGE_BUCKET=REEMPLAZA_CON_TU_STORAGE_BUCKET`
3. Reemplaza `REEMPLAZA_CON_TU_STORAGE_BUCKET` con el valor copiado
4. **NO incluyas las comillas**

---

### Valor 5: messagingSenderId

**En Firebase:**
```javascript
messagingSenderId: "987654321"
```

**En .env:**
```env
VITE_FIREBASE_MESSAGING_SENDER_ID=987654321
```

**Pasos:**
1. En Firebase, copia el valor entre las comillas: `987654321`
2. En .env, busca: `VITE_FIREBASE_MESSAGING_SENDER_ID=REEMPLAZA_CON_TU_MESSAGING_SENDER_ID`
3. Reemplaza `REEMPLAZA_CON_TU_MESSAGING_SENDER_ID` con el valor copiado
4. **NO incluyas las comillas**

---

### Valor 6: appId

**En Firebase:**
```javascript
appId: "1:987654321:web:abcdef1234567890"
```

**En .env:**
```env
VITE_FIREBASE_APP_ID=1:987654321:web:abcdef1234567890
```

**Pasos:**
1. En Firebase, copia el valor entre las comillas: `1:987654321:web:abcdef1234567890`
2. En .env, busca: `VITE_FIREBASE_APP_ID=REEMPLAZA_CON_TU_APP_ID`
3. Reemplaza `REEMPLAZA_CON_TU_APP_ID` con el valor copiado
4. **NO incluyas las comillas**

---

## ✅ Checklist de Verificación

Después de completar el mapeo, verifica que:

- [ ] Todas las líneas tienen el formato: `VARIABLE=valor` (sin espacios)
- [ ] No hay comillas en los valores
- [ ] No hay espacios antes o después del `=`
- [ ] Todos los valores `REEMPLAZA_CON_TU_...` fueron reemplazados
- [ ] El archivo se guardó correctamente

---

## 📝 Ejemplo Completo Final

### Archivo .env Completo (después del mapeo):

```env
# Variables de entorno para el frontend VolaBarato

# ===========================================
# FIREBASE CONFIGURATION
# ===========================================
VITE_FIREBASE_API_KEY=AIzaSyC1234567890abcdefghijklmnop
VITE_FIREBASE_AUTH_DOMAIN=volabarato-12345.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=volabarato-12345
VITE_FIREBASE_STORAGE_BUCKET=volabarato-12345.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=987654321
VITE_FIREBASE_APP_ID=1:987654321:web:abcdef1234567890

# ===========================================
# API BACKEND CONFIGURATION
# ===========================================
VITE_API_BASE_URL=http://localhost:4000/api
```

---

## ⚠️ Errores Comunes a Evitar

### ❌ INCORRECTO:
```env
VITE_FIREBASE_API_KEY="AIzaSyC1234567890abcdefghijklmnop"  # ❌ Con comillas
VITE_FIREBASE_API_KEY = AIzaSyC1234567890abcdefghijklmnop  # ❌ Con espacios
VITE_FIREBASE_API_KEY=AIzaSyC1234567890abcdefghijklmnop   # ❌ Con espacios al final
```

### ✅ CORRECTO:
```env
VITE_FIREBASE_API_KEY=AIzaSyC1234567890abcdefghijklmnop
```

---

## 🎯 Resumen Rápido

1. **Copia** cada valor de Firebase (sin comillas)
2. **Pega** en el archivo .env reemplazando `REEMPLAZA_CON_TU_...`
3. **Verifica** que no haya comillas ni espacios extra
4. **Guarda** el archivo

---

¿Necesitas ayuda con algún valor específico? Avísame y te ayudo.

