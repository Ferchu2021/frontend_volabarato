# 🚀 Deploy del Frontend en Vercel - Ejecutar Ahora

## ⚡ Inicio Rápido (5 minutos)

### Paso 1: Ir a Vercel
1. Abre: https://vercel.com
2. Inicia sesión con GitHub (recomendado)

### Paso 2: Importar Proyecto
1. Haz clic en **"Add New..."** → **"Project"**
2. Busca: `Ferchu2021/frontend_volabarato`
3. Haz clic en **"Import"**

### Paso 3: Configurar Variables de Entorno
**⚠️ IMPORTANTE: NO hagas clic en "Deploy" todavía**

En la sección **"Environment Variables"**, agrega estas 7 variables:

#### Variable 1:
- **Key**: `VITE_API_BASE_URL`
- **Value**: `https://backup-volabarato-1.onrender.com/api`
- **Environments**: ☑️ Production, ☑️ Preview, ☑️ Development

#### Variable 2:
- **Key**: `VITE_FIREBASE_API_KEY`
- **Value**: `AIzaSyD9rzm1vj6tLXbcEJqJ3TIvG1ZbNoPaH2A`
- **Environments**: ☑️ Production, ☑️ Preview, ☑️ Development

#### Variable 3:
- **Key**: `VITE_FIREBASE_AUTH_DOMAIN`
- **Value**: `volabarato-c8c5a.firebaseapp.com`
- **Environments**: ☑️ Production, ☑️ Preview, ☑️ Development

#### Variable 4:
- **Key**: `VITE_FIREBASE_PROJECT_ID`
- **Value**: `volabarato-c8c5a`
- **Environments**: ☑️ Production, ☑️ Preview, ☑️ Development

#### Variable 5:
- **Key**: `VITE_FIREBASE_STORAGE_BUCKET`
- **Value**: `volabarato-c8c5a.firebasestorage.app`
- **Environments**: ☑️ Production, ☑️ Preview, ☑️ Development

#### Variable 6:
- **Key**: `VITE_FIREBASE_MESSAGING_SENDER_ID`
- **Value**: `300565876308`
- **Environments**: ☑️ Production, ☑️ Preview, ☑️ Development

#### Variable 7:
- **Key**: `VITE_FIREBASE_APP_ID`
- **Value**: `1:300565876308:web:b2777261b4069ad23967c1`
- **Environments**: ☑️ Production, ☑️ Preview, ☑️ Development

### Paso 4: Verificar Configuración del Proyecto
Vercel debería detectar automáticamente:
- **Framework Preset**: `Vite` ✅
- **Root Directory**: `./` ✅
- **Build Command**: `npm run build` ✅
- **Output Directory**: `dist` ✅

### Paso 5: Deploy
1. Verifica que las 7 variables estén agregadas
2. Haz clic en **"Deploy"**
3. Espera 2-5 minutos

### Paso 6: Obtener URL
Una vez completado, verás:
- **Status**: `Ready` ✅
- **URL**: `https://volabarato-xxxxx.vercel.app` (única para tu proyecto)

### Paso 7: Actualizar CORS en Render
1. Copia la URL de Vercel (ej: `https://volabarato-xxxxx.vercel.app`)
2. Ve a: https://render.com
3. Selecciona: `backup-volabarato-1`
4. Ve a **"Environment"**
5. Busca `CORS_ORIGIN`
6. Actualiza con: `https://volabarato-xxxxx.vercel.app,https://www.volabarato-xxxxx.vercel.app`
7. Guarda cambios
8. Render se reiniciará automáticamente

### Paso 8: Verificar
1. Abre la URL de Vercel en el navegador
2. Verifica que:
   - ✅ El sitio carga
   - ✅ Los paquetes se muestran
   - ✅ No hay errores en la consola (F12)

---

## ✅ Checklist de Deployment

- [ ] Cuenta de Vercel creada/iniciada sesión
- [ ] Repositorio importado
- [ ] 7 variables de entorno configuradas
- [ ] Deploy iniciado
- [ ] Build completado sin errores
- [ ] URL de producción obtenida
- [ ] CORS actualizado en Render
- [ ] Sitio funcionando correctamente

---

## 🔧 Solución de Problemas

### Error: "Build failed"
- Verifica que todas las variables estén configuradas
- Revisa los logs en Vercel para ver el error específico

### Error: "Cannot find module"
- Verifica que `package.json` tenga todas las dependencias
- Vercel ejecutará `npm install` automáticamente

### Error: CORS
- Verifica que `CORS_ORIGIN` en Render tenga la URL exacta de Vercel
- Asegúrate de que no haya espacios
- Reinicia el servicio en Render

---

## 📝 Notas

- El deployment puede tardar 2-5 minutos
- Cada push a `main` desplegará automáticamente
- Vercel crea preview deployments para cada PR

---

**¡Listo! Sigue estos pasos y tendrás el frontend desplegado en 5 minutos.** 🚀

