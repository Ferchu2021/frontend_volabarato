# 🔧 Configurar Variables de Entorno en Vercel para Todos los Ambientes

## Problema

Las variables de entorno solo están configuradas para "Production" pero no para "Preview" o "Pre-Production", por eso ves menos variables en Pre-Production.

## Solución: Agregar Variables a Todos los Ambientes

### Paso 1: Ir a Environment Variables
1. Ve a tu proyecto en Vercel
2. Ve a **Settings** → **Environment Variables**

### Paso 2: Editar Cada Variable
Para cada variable de entorno que ya tienes:

1. Haz clic en el **lápiz (✏️)** o en los **3 puntos (⋯)** de la variable
2. Verás checkboxes para seleccionar los ambientes:
   - ☑️ **Production**
   - ☑️ **Preview** 
   - ☑️ **Development**
   - ☑️ **Pre-Production** (si está disponible)

3. **Marca TODOS los checkboxes** para cada variable
4. Haz clic en **Save**

### Paso 3: Variables Requeridas

Asegúrate de tener estas variables configuradas para **TODOS los ambientes**:

```
VITE_API_BASE_URL
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

### Paso 4: Verificar

1. Ve a **Settings** → **Environments** → **Preview** (o **Pre-Production**)
2. Verifica que todas las variables estén listadas
3. Si faltan, repite el Paso 2

---

## ⚠️ Nota Importante

**Vercel está usando el commit `e2e90a3` (antiguo)** en lugar del más reciente.

**Solución**: 
1. Espera a que Vercel detecte el nuevo commit automáticamente, O
2. Ve a **Deployments** → Haz clic en los 3 puntos (⋯) → **Redeploy**

El código local ya tiene todas las correcciones. Solo necesita usar el commit más reciente.

