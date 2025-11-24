# 🚀 Deployment del Frontend en Vercel - Paso a Paso

## ✅ Estado Actual

**Backend desplegado y funcionando:**
- URL: `https://backup-volabarato-1.onrender.com`
- API: `https://backup-volabarato-1.onrender.com/api`
- Status: ✅ Running

---

## PASO 1: Crear Cuenta en Vercel

1. Ve a https://vercel.com
2. Haz clic en **"Sign Up"** o **"Log In"**
3. Elige una de estas opciones:
   - **Continue with GitHub** (recomendado - más fácil)
   - **Continue with Email**
4. Si eliges GitHub, autoriza Vercel para acceder a tus repositorios

---

## PASO 2: Conectar Repositorio y Crear Proyecto

### 2.1. Importar Proyecto
1. En el dashboard de Vercel, haz clic en **"Add New..."** → **"Project"**
2. Si es la primera vez, Vercel te pedirá conectar tu cuenta de GitHub
3. Autoriza Vercel para acceder a tus repositorios
4. Busca y selecciona: **`frontend_volabarato`** (o `Ferchu2021/frontend_volabarato`)

### 2.2. Configurar el Proyecto
Vercel detectará automáticamente que es un proyecto Vite. Verifica estos valores:

- **Framework Preset**: `Vite` (debe detectarse automáticamente)
- **Root Directory**: `./` (raíz del repositorio)
- **Build Command**: `npm run build` (ya configurado en package.json)
- **Output Directory**: `dist` (ya configurado en package.json)
- **Install Command**: `npm install` (automático)

**⚠️ NO hagas clic en "Deploy" todavía** - primero necesitamos configurar las variables de entorno.

---

## PASO 3: Configurar Variables de Entorno

### 3.1. Agregar Variable de Entorno
Antes de hacer deploy, haz clic en **"Environment Variables"** o busca la sección de variables.

### 3.2. Agregar VITE_API_BASE_URL
1. Haz clic en **"Add"** o **"New"**
2. Completa:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://backup-volabarato-1.onrender.com/api`
   - **Environment**: Selecciona todas las opciones:
     - ☑️ Production
     - ☑️ Preview
     - ☑️ Development

3. Haz clic en **"Save"**

**⚠️ IMPORTANTE:**
- La URL debe terminar en `/api` (no solo `/`)
- No debe tener espacios al inicio o final
- Debe usar `https://` (no `http://`)

---

## PASO 4: Deploy

### 4.1. Iniciar Deployment
1. Verifica que la variable de entorno esté configurada
2. Haz clic en **"Deploy"**
3. Vercel comenzará a construir y desplegar tu aplicación

### 4.2. Monitorear el Proceso
Verás una pantalla con el log del build:
- **Cloning repository...**
- **Installing dependencies...**
- **Building application...**
- **Deploying...**

El proceso puede tardar 2-5 minutos.

---

## PASO 5: Verificar el Deployment

### 5.1. Obtener la URL
Una vez que el deployment termine, verás:
- **Status**: `Ready` (en verde)
- **URL**: `https://frontend-volabarato.vercel.app` (ejemplo - será única para tu proyecto)

### 5.2. Probar el Sitio
1. Abre la URL en tu navegador
2. Verifica que:
   - ✅ El sitio carga correctamente
   - ✅ No hay errores en la consola del navegador (F12)
   - ✅ Los paquetes se cargan desde el backend
   - ✅ La página de inicio muestra contenido

### 5.3. Verificar Conexión con Backend
1. Abre la consola del navegador (F12)
2. Ve a la pestaña **"Network"**
3. Recarga la página
4. Busca peticiones a `/api/paquetes` o similar
5. Verifica que:
   - ✅ Las peticiones van a `https://backup-volabarato-1.onrender.com/api`
   - ✅ No hay errores de CORS
   - ✅ Las respuestas son exitosas (status 200)

---

## PASO 6: Actualizar CORS en el Backend

### 6.1. Obtener la URL del Frontend
Una vez que tengas la URL de Vercel (ej: `https://frontend-volabarato.vercel.app`):

### 6.2. Actualizar CORS en Render
1. Ve a https://render.com
2. Selecciona tu servicio: `backup-volabarato-1` (o el nombre que tenga)
3. Ve a la pestaña **"Environment"**
4. Busca la variable `CORS_ORIGIN`
5. Actualiza el valor con la URL de tu frontend:
   ```
   https://frontend-volabarato.vercel.app,https://www.frontend-volabarato.vercel.app
   ```
   O si tienes un dominio personalizado:
   ```
   https://volabarato.com,https://www.volabarato.com
   ```
6. Haz clic en **"Save Changes"**
7. Render reiniciará automáticamente el servicio

### 6.3. Verificar CORS
1. Recarga el frontend
2. Abre la consola del navegador
3. Verifica que no haya errores de CORS
4. Las peticiones al backend deben funcionar correctamente

---

## PASO 7: Configurar Dominio Personalizado (Opcional)

### 7.1. Agregar Dominio en Vercel
1. En el dashboard de Vercel, ve a tu proyecto
2. Ve a **"Settings"** → **"Domains"**
3. Ingresa tu dominio: `volabarato.com` (o el que tengas)
4. Sigue las instrucciones de DNS que Vercel te proporciona

### 7.2. Actualizar Variables de Entorno
Después de configurar el dominio:
1. Actualiza `VITE_API_BASE_URL` si es necesario (generalmente no es necesario)
2. Actualiza `CORS_ORIGIN` en Render con el nuevo dominio

---

## ✅ Checklist Final

Antes de considerar el frontend listo:

- [ ] Proyecto creado en Vercel
- [ ] Repositorio conectado
- [ ] Variable `VITE_API_BASE_URL` configurada
- [ ] Build completado sin errores
- [ ] Sitio desplegado y accesible
- [ ] No hay errores en la consola del navegador
- [ ] Los paquetes se cargan desde el backend
- [ ] CORS configurado correctamente en el backend
- [ ] No hay errores de CORS en el frontend
- [ ] Las peticiones a la API funcionan correctamente

---

## 🔧 Solución de Problemas

### Problema: Build falla
**Solución:**
- Revisa los logs en Vercel
- Verifica que `package.json` tenga todas las dependencias
- Verifica que no haya errores de TypeScript

### Problema: "Cannot find module"
**Solución:**
- Verifica que todas las dependencias estén en `package.json`
- Ejecuta `npm install` localmente para verificar

### Problema: CORS Error
**Solución:**
1. Verifica que `CORS_ORIGIN` en Render contenga la URL exacta del frontend
2. Asegúrate de que no haya espacios en `CORS_ORIGIN`
3. Verifica que la URL del frontend sea correcta (con `https://`)
4. Reinicia el servicio en Render después de cambiar `CORS_ORIGIN`

### Problema: Frontend no carga paquetes
**Solución:**
1. Verifica que `VITE_API_BASE_URL` sea correcta
2. Abre la consola del navegador y revisa los errores
3. Verifica que el backend esté corriendo
4. Verifica que las rutas del backend sean correctas

### Problema: "VITE_API_BASE_URL is not defined"
**Solución:**
- Verifica que la variable esté configurada en Vercel
- Verifica que el nombre sea exactamente `VITE_API_BASE_URL` (case-sensitive)
- Verifica que esté configurada para el ambiente correcto (Production, Preview, Development)

---

## 📝 Notas Importantes

1. **Variables de Entorno**: Las variables que empiezan con `VITE_` son expuestas al cliente. No pongas información sensible aquí.

2. **CORS**: En producción, siempre especifica las URLs exactas. Nunca uses `*` en producción.

3. **Actualizaciones**: Cada vez que hagas push a `main`, Vercel desplegará automáticamente los cambios.

4. **Preview Deployments**: Vercel crea un deployment de preview para cada pull request. Esto es útil para probar cambios antes de mergear.

5. **Build Time**: El build puede tardar 2-5 minutos. Sé paciente.

---

## 🎉 ¡Siguiente Paso!

Una vez que el frontend esté funcionando:

1. **Probar todas las funcionalidades:**
   - [ ] Home carga correctamente
   - [ ] Viajes lista todos los paquetes
   - [ ] Login funciona
   - [ ] Registro funciona
   - [ ] Reservas funcionan
   - [ ] Panel de administración funciona

2. **Optimizaciones:**
   - [ ] Configurar dominio personalizado
   - [ ] Configurar SSL/HTTPS (automático en Vercel)
   - [ ] Optimizar imágenes
   - [ ] Configurar analytics (opcional)

3. **Monitoreo:**
   - [ ] Configurar error tracking (Sentry, etc.)
   - [ ] Configurar analytics (Google Analytics, etc.)

---

## 📞 URLs de Referencia

### Desarrollo
- Backend: `http://localhost:4000/api`
- Frontend: `http://localhost:3000`

### Producción
- Backend: `https://backup-volabarato-1.onrender.com/api`
- Frontend: `https://tu-frontend.vercel.app` (se generará automáticamente)

---

¡Buena suerte con el deployment! 🚀

