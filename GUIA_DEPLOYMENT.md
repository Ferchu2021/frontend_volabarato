# 🚀 Guía de Deployment - VolaBarato

Esta guía te ayudará a deployar el frontend en **Vercel** y el backend en **Render**.

---

## 📋 Prerequisitos

1. ✅ Cuenta en [Vercel](https://vercel.com) (gratis)
2. ✅ Cuenta en [Render](https://render.com) (gratis)
3. ✅ MongoDB Atlas configurado
4. ✅ Repositorios en GitHub

---

## 🎨 PARTE 1: Deploy del Frontend en Vercel

### Paso 1: Conectar repositorio a Vercel

1. Ve a [vercel.com](https://vercel.com) e inicia sesión con GitHub
2. Haz clic en **"Add New Project"**
3. Selecciona el repositorio: `frontend_volabarato`
4. Vercel detectará automáticamente que es un proyecto Vite

### Paso 2: Configurar el proyecto

**Framework Preset**: Vite (debería detectarse automáticamente)

**Build Settings**:
- **Build Command**: `npm run build` (ya configurado)
- **Output Directory**: `dist` (ya configurado)
- **Install Command**: `npm install` (ya configurado)

### Paso 3: Configurar Variables de Entorno

En la sección **"Environment Variables"**, agrega:

```
VITE_API_BASE_URL=https://tu-backend-en-render.onrender.com/api
```

**⚠️ IMPORTANTE**: Reemplaza `tu-backend-en-render.onrender.com` con la URL real de tu backend en Render (la obtendrás después de deployar el backend).

### Paso 4: Deploy

1. Haz clic en **"Deploy"**
2. Espera a que termine el build (2-3 minutos)
3. ¡Listo! Tu frontend estará disponible en una URL como: `https://frontend-volabarato.vercel.app`

### Paso 5: Actualizar URL del Backend (después de deployar backend)

Una vez que tengas la URL del backend en Render:
1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Edita `VITE_API_BASE_URL` con la URL correcta del backend
4. Haz un nuevo deploy

---

## ⚙️ PARTE 2: Deploy del Backend en Render

### Paso 1: Conectar repositorio a Render

1. Ve a [render.com](https://render.com) e inicia sesión con GitHub
2. Haz clic en **"New +"** → **"Web Service"**
3. Conecta el repositorio: `backup_volabarato`
4. Render detectará automáticamente el archivo `render.yaml`

### Paso 2: Configurar el servicio

**Configuración automática** (desde render.yaml):
- **Name**: `volabarato-backend`
- **Environment**: `Node`
- **Region**: Elige la más cercana (ej: `Oregon (US West)`)
- **Branch**: `main`
- **Root Directory**: (dejar vacío)
- **Build Command**: `npm install && npm run build` (ya configurado)
- **Start Command**: `npm start` (ya configurado)

### Paso 3: Configurar Variables de Entorno

En la sección **"Environment"**, agrega estas variables:

#### Variables Requeridas:

```
NODE_ENV=production
PORT=10000
MONGO_URI=tu_connection_string_de_mongodb_atlas
JWT_SECRET=tu_secret_key_super_segura_aqui
```

**Cómo obtener MONGO_URI**:
1. Ve a [MongoDB Atlas](https://cloud.mongodb.com)
2. Selecciona tu cluster
3. Click en "Connect"
4. Selecciona "Connect your application"
5. Copia la connection string
6. Reemplaza `<password>` con tu contraseña
7. Reemplaza `<dbname>` con el nombre de tu base de datos (ej: `volabarato`)

**Ejemplo de MONGO_URI**:
```
mongodb+srv://usuario:password@cluster0.xxxxx.mongodb.net/volabarato?retryWrites=true&w=majority
```

**Cómo generar JWT_SECRET**:
Puedes usar cualquier string largo y aleatorio. Ejemplo:
```bash
# En tu terminal (opcional):
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

O simplemente usa un string largo y seguro como:
```
mi_super_secret_key_volabarato_2024_segura_123456789
```

### Paso 4: Deploy

1. Haz clic en **"Create Web Service"**
2. Render comenzará a construir y deployar tu backend
3. Espera 5-10 minutos (primera vez puede tardar más)
4. Una vez completado, obtendrás una URL como: `https://volabarato-backend.onrender.com`

### Paso 5: Verificar que funciona

1. Abre la URL del backend en tu navegador
2. Deberías ver un JSON con el mensaje: `"message": "Backend VolaBarato API"`

---

## 🔄 PARTE 3: Conectar Frontend con Backend

### Paso 1: Actualizar variable de entorno en Vercel

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Edita `VITE_API_BASE_URL`:
   ```
   VITE_API_BASE_URL=https://volabarato-backend.onrender.com/api
   ```
   (Reemplaza con tu URL real de Render)

### Paso 2: Nuevo deploy del frontend

1. En Vercel, ve a la pestaña "Deployments"
2. Haz clic en los tres puntos del último deployment
3. Selecciona "Redeploy"
4. O simplemente haz un push a GitHub (si tienes auto-deploy activado)

---

## ✅ Verificación Final

### Frontend
- ✅ Debe cargar correctamente en la URL de Vercel
- ✅ Debe poder hacer login
- ✅ Debe poder crear reservas
- ✅ Debe conectarse al backend

### Backend
- ✅ Debe responder en la URL de Render
- ✅ Debe conectarse a MongoDB Atlas
- ✅ Debe aceptar peticiones del frontend (CORS configurado)

---

## 🔧 Solución de Problemas

### Frontend no se conecta al backend

**Problema**: Error de CORS o conexión rechazada

**Solución**:
1. Verifica que `VITE_API_BASE_URL` en Vercel tenga la URL correcta del backend
2. Verifica que el backend esté corriendo en Render
3. Verifica que CORS esté configurado en el backend (ya está configurado)

### Backend no inicia

**Problema**: Error al iniciar el servicio en Render

**Solución**:
1. Verifica que todas las variables de entorno estén configuradas
2. Revisa los logs en Render (pestaña "Logs")
3. Verifica que `MONGO_URI` sea correcta
4. Verifica que `JWT_SECRET` esté configurado

### MongoDB no conecta

**Problema**: Error de conexión a MongoDB

**Solución**:
1. Verifica que la IP de Render esté en la whitelist de MongoDB Atlas:
   - Ve a MongoDB Atlas → Network Access
   - Agrega `0.0.0.0/0` (permite todas las IPs) o la IP específica de Render
2. Verifica que el usuario de MongoDB tenga permisos
3. Verifica que la connection string sea correcta

---

## 📝 URLs de Ejemplo

Después del deployment, tendrás URLs como:

- **Frontend**: `https://frontend-volabarato.vercel.app`
- **Backend**: `https://volabarato-backend.onrender.com`
- **API**: `https://volabarato-backend.onrender.com/api`

---

## 🔐 Seguridad

### Variables Sensibles

**NUNCA** subas estas variables a Git:
- `MONGO_URI`
- `JWT_SECRET`
- Cualquier API key o secret

Solo configúralas en las plataformas de deployment (Vercel/Render).

### CORS

El backend ya tiene CORS configurado para aceptar peticiones del frontend. Si necesitas agregar más dominios, edita `src/index.ts` en el backend.

---

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en Vercel y Render
2. Verifica que todas las variables de entorno estén configuradas
3. Verifica que los repositorios estén actualizados en GitHub

---

## 🎉 ¡Listo!

Una vez completados todos los pasos, tu aplicación estará completamente deployada y funcionando en producción.

**Frontend**: Disponible en Vercel  
**Backend**: Disponible en Render  
**Base de Datos**: MongoDB Atlas

¡Disfruta de tu aplicación en producción! 🚀

