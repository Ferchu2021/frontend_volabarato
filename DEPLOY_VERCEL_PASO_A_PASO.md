# 🚀 Deploy del Frontend en Vercel - Paso a Paso

## 📋 Resumen

Esta guía te llevará paso a paso para desplegar el frontend en Vercel.

**URL del Backend:** `https://backup-volabarato-1.onrender.com/api`

---

## PASO 1: Crear Cuenta en Vercel

1. Ve a https://vercel.com
2. Haz clic en **"Sign Up"** o **"Log In"**
3. Elige **"Continue with GitHub"** (recomendado)
4. Autoriza Vercel para acceder a tus repositorios

---

## PASO 2: Importar Proyecto

### 2.1. Crear Nuevo Proyecto
1. En el dashboard de Vercel, haz clic en **"Add New..."** → **"Project"**
2. Si es la primera vez, Vercel te pedirá conectar tu cuenta de GitHub
3. Autoriza Vercel para acceder a tus repositorios

### 2.2. Seleccionar Repositorio
1. Busca y selecciona: **`frontend_volabarato`** (o `Ferchu2021/frontend_volabarato`)
2. Haz clic en **"Import"**

---

## PASO 3: Configurar el Proyecto

Vercel detectará automáticamente que es un proyecto Vite. Verifica estos valores:

- **Framework Preset**: `Vite` (debe detectarse automáticamente)
- **Root Directory**: `./` (raíz del repositorio)
- **Build Command**: `npm run build` (ya configurado)
- **Output Directory**: `dist` (ya configurado)
- **Install Command**: `npm install` (automático)

**⚠️ NO hagas clic en "Deploy" todavía** - primero necesitamos configurar las variables de entorno.

---

## PASO 4: Configurar Variables de Entorno

### 4.1. Ir a Environment Variables
1. En la pantalla de configuración del proyecto, busca la sección **"Environment Variables"**
2. O después de crear el proyecto, ve a **Settings** → **Environment Variables**

### 4.2. Agregar Variables
Agrega cada variable una por una. Haz clic en **"Add"** o **"Add Another"** para cada una:

#### Variable 1: VITE_API_BASE_URL
- **Key**: `VITE_API_BASE_URL`
- **Value**: `https://backup-volabarato-1.onrender.com/api`
- **Environment**: Selecciona todas:
  - ☑️ Production
  - ☑️ Preview
  - ☑️ Development

#### Variable 2: VITE_FIREBASE_API_KEY
- **Key**: `VITE_FIREBASE_API_KEY`
- **Value**: `AIzaSyD9rzm1vj6tLXbcEJqJ3TIvG1ZbNoPaH2A`
- **Environment**: ☑️ Production, ☑️ Preview, ☑️ Development

#### Variable 3: VITE_FIREBASE_AUTH_DOMAIN
- **Key**: `VITE_FIREBASE_AUTH_DOMAIN`
- **Value**: `volabarato-c8c5a.firebaseapp.com`
- **Environment**: ☑️ Production, ☑️ Preview, ☑️ Development

#### Variable 4: VITE_FIREBASE_PROJECT_ID
- **Key**: `VITE_FIREBASE_PROJECT_ID`
- **Value**: `volabarato-c8c5a`
- **Environment**: ☑️ Production, ☑️ Preview, ☑️ Development

#### Variable 5: VITE_FIREBASE_STORAGE_BUCKET
- **Key**: `VITE_FIREBASE_STORAGE_BUCKET`
- **Value**: `volabarato-c8c5a.firebasestorage.app`
- **Environment**: ☑️ Production, ☑️ Preview, ☑️ Development

#### Variable 6: VITE_FIREBASE_MESSAGING_SENDER_ID
- **Key**: `VITE_FIREBASE_MESSAGING_SENDER_ID`
- **Value**: `300565876308`
- **Environment**: ☑️ Production, ☑️ Preview, ☑️ Development

#### Variable 7: VITE_FIREBASE_APP_ID
- **Key**: `VITE_FIREBASE_APP_ID`
- **Value**: `1:300565876308:web:b2777261b4069ad23967c1`
- **Environment**: ☑️ Production, ☑️ Preview, ☑️ Development

### 4.3. Verificar Variables
Después de agregar todas, deberías ver 7 variables en la lista.

---

## PASO 5: Deploy

### 5.1. Iniciar Deployment
1. Verifica que todas las variables estén configuradas
2. Haz clic en **"Deploy"**
3. Vercel comenzará a construir y desplegar tu aplicación

### 5.2. Monitorear el Proceso
Verás una pantalla con el log del build:
- **Cloning repository...**
- **Installing dependencies...**
- **Building application...**
- **Deploying...**

El proceso puede tardar 2-5 minutos.

### 5.3. Verificar Build
Busca en los logs:
- ✅ `npm install` completado sin errores
- ✅ `npm run build` completado
- ✅ `Deploying...` completado
- ✅ Sin errores críticos

---

## PASO 6: Obtener URL y Verificar

### 6.1. Obtener la URL
Una vez que el deployment termine, verás:
- **Status**: `Ready` (en verde)
- **URL**: `https://volabarato.vercel.app` (ejemplo - será única para tu proyecto)

### 6.2. Probar el Sitio
1. Abre la URL en tu navegador
2. Verifica que:
   - ✅ El sitio carga correctamente
   - ✅ No hay errores en la consola del navegador (F12)
   - ✅ Los paquetes se cargan desde el backend
   - ✅ La página de inicio muestra contenido

### 6.3. Verificar Conexión con Backend
1. Abre la consola del navegador (F12)
2. Ve a la pestaña **"Network"**
3. Recarga la página
4. Busca peticiones a `/api/paquetes` o similar
5. Verifica que:
   - ✅ Las peticiones van a `https://backup-volabarato-1.onrender.com/api`
   - ✅ No hay errores de CORS
   - ✅ Las respuestas son exitosas (status 200)

---

## PASO 7: Actualizar CORS en el Backend

### 7.1. Obtener la URL del Frontend
Una vez que tengas la URL de Vercel (ej: `https://volabarato.vercel.app`):

### 7.2. Actualizar CORS en Render
1. Ve a https://render.com
2. Selecciona tu servicio: `backup-volabarato-1` (o el nombre que tenga)
3. Ve a la pestaña **"Environment"**
4. Busca la variable `CORS_ORIGIN`
5. Actualiza el valor con la URL de tu frontend:
   ```
   https://volabarato.vercel.app,https://www.volabarato.vercel.app
   ```
   O si tienes un dominio personalizado:
   ```
   https://volabarato.com,https://www.volabarato.com
   ```
6. Haz clic en **"Save Changes"**
7. Render reiniciará automáticamente el servicio

### 7.3. Verificar CORS
1. Recarga el frontend
2. Abre la consola del navegador
3. Verifica que no haya errores de CORS
4. Las peticiones al backend deben funcionar correctamente

---

## ✅ Checklist de Deployment

- [ ] Cuenta creada en Vercel
- [ ] Repositorio conectado
- [ ] Proyecto configurado
- [ ] 7 variables de entorno configuradas
- [ ] Deploy iniciado
- [ ] Build completado sin errores
- [ ] URL de producción obtenida
- [ ] Sitio funcionando correctamente
- [ ] Sin errores en la consola del navegador
- [ ] CORS actualizado en Render
- [ ] Peticiones al backend funcionando

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
- Vercel ejecutará `npm install` automáticamente

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

## 🎯 Próximo Paso

Una vez que el frontend esté desplegado:

1. ✅ **Actualizar CORS** en Render con la URL del frontend
2. ⏭️ **Configurar reglas de seguridad** de Firebase Storage
3. ⏭️ **Probar todas las funcionalidades** en producción

---

¡Sigue estos pasos y tendrás el frontend desplegado! 🚀

¿Necesitas ayuda con algún paso específico? Avísame.

