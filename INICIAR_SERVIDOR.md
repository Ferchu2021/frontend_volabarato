# 🚀 Cómo Iniciar el Servidor del Frontend

## ❌ Problema: ERR_CONNECTION_REFUSED

Este error significa que **el servidor de desarrollo del frontend no está corriendo**.

---

## ✅ Solución: Iniciar el Servidor

### Paso 1: Abrir Terminal en la Carpeta del Frontend

1. Abre PowerShell o CMD
2. Navega a la carpeta del frontend:
   ```powershell
   cd "C:\Users\Administrator\Desktop\volabarato_frontend"
   ```

### Paso 2: Iniciar el Servidor

Ejecuta este comando:

```bash
npm run dev
```

### Paso 3: Esperar a que Inicie

Deberías ver un mensaje como:

```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

### Paso 4: Abrir en el Navegador

1. El servidor debería abrir automáticamente el navegador
2. Si no, ve manualmente a: `http://localhost:3000`

---

## 🔧 Si Hay Errores al Iniciar

### Error: "Cannot find module"
**Solución:**
```bash
npm install
```

### Error: "Port 3000 is already in use"
**Solución:**
1. Busca qué proceso está usando el puerto:
   ```powershell
   netstat -ano | findstr :3000
   ```
2. O cambia el puerto en `vite.config.ts`

### Error: "EADDRINUSE"
**Solución:**
- Cierra otros procesos que usen el puerto 3000
- O reinicia la computadora

---

## ✅ Verificación

Una vez que el servidor esté corriendo:

1. ✅ Deberías ver el mensaje "VITE ready"
2. ✅ El navegador debería abrirse automáticamente
3. ✅ Deberías ver la aplicación cargando
4. ✅ No deberías ver "ERR_CONNECTION_REFUSED"

---

## 📝 Notas Importantes

1. **Mantén la terminal abierta**: El servidor debe seguir corriendo
2. **No cierres la terminal**: Si la cierras, el servidor se detiene
3. **Reinicia después de cambios en .env**: Si cambias variables de entorno, reinicia el servidor

---

¿Necesitas ayuda para iniciar el servidor? Avísame y te guío paso a paso.

