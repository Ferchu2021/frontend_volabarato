# ⚠️ Variables de Entorno Faltantes en Pre-Production

## Problema

En Pre-Production solo hay **2 variables** (`JWT_SECRET` y `MONGO_URI`), pero estas son variables del **BACKEND**, no del frontend.

## Variables que FALTAN en Pre-Production

El frontend necesita estas **7 variables** para funcionar correctamente:

### 1. Variables de Firebase (6 variables)
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

### 2. Variable de API (1 variable)
```
VITE_API_BASE_URL
```

## Solución: Agregar Variables al Frontend

### Paso 1: Ir a Environment Variables
1. Ve a tu proyecto en Vercel
2. Ve a **Settings** → **Environment Variables**

### Paso 2: Agregar Cada Variable

Para cada una de las 7 variables, haz clic en **"Add Environment Variable"** y completa:

#### Variable 1: VITE_API_BASE_URL
- **Name**: `VITE_API_BASE_URL`
- **Value**: `https://backup-volabarato-1.onrender.com/api` (o la URL de tu backend)
- **Ambientes**: Marca todos los checkboxes (Production, Preview, Development, Pre-Production)

#### Variable 2: VITE_FIREBASE_API_KEY
- **Name**: `VITE_FIREBASE_API_KEY`
- **Value**: `AIzaSyD9rzm1vj6tLXbcEJqJ3TIvG1ZbNoPaH2A`
- **Ambientes**: Marca todos los checkboxes

#### Variable 3: VITE_FIREBASE_AUTH_DOMAIN
- **Name**: `VITE_FIREBASE_AUTH_DOMAIN`
- **Value**: `volabarato-c8c5a.firebaseapp.com`
- **Ambientes**: Marca todos los checkboxes

#### Variable 4: VITE_FIREBASE_PROJECT_ID
- **Name**: `VITE_FIREBASE_PROJECT_ID`
- **Value**: `volabarato-c8c5a`
- **Ambientes**: Marca todos los checkboxes

#### Variable 5: VITE_FIREBASE_STORAGE_BUCKET
- **Name**: `VITE_FIREBASE_STORAGE_BUCKET`
- **Value**: `volabarato-c8c5a.firebasestorage.app`
- **Ambientes**: Marca todos los checkboxes

#### Variable 6: VITE_FIREBASE_MESSAGING_SENDER_ID
- **Name**: `VITE_FIREBASE_MESSAGING_SENDER_ID`
- **Value**: `300565876308`
- **Ambientes**: Marca todos los checkboxes

#### Variable 7: VITE_FIREBASE_APP_ID
- **Name**: `VITE_FIREBASE_APP_ID`
- **Value**: `1:300565876308:web:b2777261b4069ad23967c1`
- **Ambientes**: Marca todos los checkboxes

### Paso 3: Verificar

1. Ve a **Settings** → **Environments** → **Pre-Production**
2. Deberías ver **9 variables en total**:
   - 2 del backend (JWT_SECRET, MONGO_URI) - estas pueden quedarse o eliminarse si no son necesarias
   - 7 del frontend (las que acabamos de agregar)

## ⚠️ Nota Importante

Las variables `JWT_SECRET` y `MONGO_URI` son del **backend** y probablemente no son necesarias en el proyecto de frontend de Vercel. Si quieres, puedes eliminarlas del proyecto frontend, ya que el backend las maneja en Render.

---

## Resumen

**Estado Actual**: 2 variables (solo backend) ❌  
**Estado Correcto**: 7 variables (frontend) ✅  
**Total Recomendado**: 7 variables del frontend (puedes dejar las 2 del backend si quieres, pero no son necesarias)

