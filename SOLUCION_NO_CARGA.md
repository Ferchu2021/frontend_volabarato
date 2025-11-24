# 🔧 Solución: "No Carga Nada" - Guía de Diagnóstico

## 🔍 Pasos para Diagnosticar el Problema

### Paso 1: Verificar que el Servidor Esté Corriendo

1. Abre una terminal en la carpeta del frontend
2. Ejecuta:
   ```bash
   npm run dev
   ```
3. Deberías ver un mensaje como:
   ```
   VITE v4.x.x  ready in xxx ms
   ➜  Local:   http://localhost:5173/
   ```

**Si no ves este mensaje:**
- Verifica que no haya errores en la terminal
- Verifica que el puerto no esté ocupado
- Intenta detener otros procesos que usen el puerto

---

### Paso 2: Verificar Variables de Entorno

1. Verifica que el archivo `.env` exista en la raíz del proyecto
2. Verifica que las variables empiecen con `VITE_`
3. **IMPORTANTE**: Reinicia el servidor después de cambiar `.env`

**Para verificar:**
```bash
# En PowerShell
Get-Content .env
```

**Debe mostrar:**
```env
VITE_FIREBASE_API_KEY=AIzaSyD9rzm1vj6tLXbcEJqJ3TIvG1ZbNoPaH2A
VITE_FIREBASE_AUTH_DOMAIN=volabarato-c8c5a.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=volabarato-c8c5a
VITE_FIREBASE_STORAGE_BUCKET=volabarato-c8c5a.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=300565876308
VITE_FIREBASE_APP_ID=1:300565876308:web:b2777261b4069ad23967c1
VITE_API_BASE_URL=http://localhost:4000/api
```

---

### Paso 3: Verificar Consola del Navegador

1. Abre el navegador en `http://localhost:5173` (o el puerto que use Vite)
2. Abre la consola del navegador (F12)
3. Ve a la pestaña **"Console"**
4. Busca errores en rojo

**Errores comunes:**

#### Error: "Firebase no está configurado"
**Solución:**
- Verifica que el archivo `.env` tenga las variables correctas
- Reinicia el servidor de desarrollo
- Verifica que las variables empiecen con `VITE_`

#### Error: "Cannot find module 'firebase/app'"
**Solución:**
```bash
npm install firebase
```

#### Error: "Failed to fetch" o CORS
**Solución:**
- Verifica que el backend esté corriendo en `http://localhost:4000`
- Verifica que `VITE_API_BASE_URL` sea correcta

---

### Paso 4: Verificar que Firebase Esté Inicializado

1. En la consola del navegador, escribe:
   ```javascript
   console.log(import.meta.env.VITE_FIREBASE_API_KEY)
   ```
2. Debería mostrar tu API key (no debería ser `undefined`)

**Si es `undefined`:**
- El archivo `.env` no se está leyendo
- Reinicia el servidor
- Verifica que el archivo esté en la raíz del proyecto

---

### Paso 5: Verificar Errores de Compilación

1. En la terminal donde corre `npm run dev`
2. Busca errores en rojo
3. Los errores comunes son:
   - Errores de TypeScript
   - Módulos no encontrados
   - Errores de sintaxis

---

## 🔧 Soluciones Rápidas

### Solución 1: Reiniciar Servidor

1. Detén el servidor (Ctrl+C)
2. Elimina la carpeta `node_modules/.vite` (si existe)
3. Reinicia:
   ```bash
   npm run dev
   ```

### Solución 2: Verificar Instalación de Firebase

```bash
npm install firebase
```

### Solución 3: Verificar Archivo .env

1. Asegúrate de que el archivo se llame exactamente `.env` (con punto)
2. Asegúrate de que esté en la raíz del proyecto
3. Verifica que no tenga espacios extra

### Solución 4: Limpiar Caché

```bash
# Eliminar node_modules y reinstalar
rm -rf node_modules
npm install

# O en Windows PowerShell:
Remove-Item -Recurse -Force node_modules
npm install
```

---

## 📋 Checklist de Verificación

- [ ] Servidor de desarrollo corriendo (`npm run dev`)
- [ ] Archivo `.env` existe en la raíz del proyecto
- [ ] Variables de entorno empiezan con `VITE_`
- [ ] Firebase instalado (`npm install firebase`)
- [ ] Sin errores en la terminal
- [ ] Sin errores en la consola del navegador
- [ ] Backend corriendo en `http://localhost:4000`

---

## 🆘 Si Nada Funciona

1. **Comparte el error exacto** que ves en:
   - La terminal (donde corre `npm run dev`)
   - La consola del navegador (F12)

2. **Verifica estos archivos:**
   - `package.json` - ¿Firebase está en dependencies?
   - `.env` - ¿Tiene los valores correctos?
   - `src/config/firebase.ts` - ¿Está configurado correctamente?

3. **Intenta un build limpio:**
   ```bash
   npm run build
   npm run preview
   ```

---

¿Qué error específico ves? Compártelo y te ayudo a solucionarlo.

