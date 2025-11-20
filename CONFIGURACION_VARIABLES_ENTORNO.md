# 🔧 Configuración de Variables de Entorno

## 📋 Descripción

El proyecto ahora usa variables de entorno para configurar la URL base del API backend. Esto permite cambiar la configuración sin modificar el código, facilitando el despliegue en diferentes ambientes (desarrollo, producción, etc.).

## 🚀 Configuración

### 1. Archivo `.env`

El archivo `.env` contiene las variables de entorno para el proyecto. Este archivo **NO debe subirse a Git** (ya está en `.gitignore`).

### 2. Archivo `env.example`

El archivo `env.example` es una plantilla que muestra todas las variables disponibles. Este archivo **SÍ debe estar en Git** para que otros desarrolladores sepan qué variables configurar.

## 📝 Variables Disponibles

### `VITE_API_BASE_URL`

URL base del API backend.

- **Desarrollo local**: `http://localhost:4000/api`
- **Producción**: `https://api.volabarato.com/api` (o la URL de tu servidor)

**Ejemplo en `.env`**:
```env
VITE_API_BASE_URL=http://localhost:4000/api
```

## 🔄 Cómo Funciona

1. El archivo `src/services/api.ts` lee la variable `VITE_API_BASE_URL` desde `import.meta.env`
2. Si la variable no está definida, usa el valor por defecto: `http://localhost:4000/api`
3. Vite expone automáticamente las variables que empiezan con `VITE_` al código del cliente

## 📦 Instalación

1. Copia el archivo `env.example` a `.env`:
   ```bash
   cp env.example .env
   ```

2. Edita el archivo `.env` y configura las variables según tu ambiente:
   ```env
   VITE_API_BASE_URL=http://localhost:4000/api
   ```

3. Reinicia el servidor de desarrollo si está corriendo:
   ```bash
   npm run dev
   ```

## 🌍 Configuración por Ambiente

### Desarrollo Local
```env
VITE_API_BASE_URL=http://localhost:4000/api
```

### Producción
```env
VITE_API_BASE_URL=https://api.volabarato.com/api
```

### Staging (si aplica)
```env
VITE_API_BASE_URL=https://staging-api.volabarato.com/api
```

## ⚠️ Importante

- **Nunca subas el archivo `.env` a Git** - contiene información sensible
- **Sí sube `env.example`** - es solo una plantilla
- Las variables deben empezar con `VITE_` para que Vite las exponga al cliente
- Reinicia el servidor después de cambiar variables de entorno

## 🔍 Verificación

Para verificar que la configuración funciona:

1. Abre la consola del navegador (F12)
2. En la pestaña "Console", escribe:
   ```javascript
   console.log(import.meta.env.VITE_API_BASE_URL)
   ```
3. Deberías ver la URL configurada

## 📚 Referencias

- [Documentación de Vite - Variables de Entorno](https://vitejs.dev/guide/env-and-mode.html)
- [Documentación de Vite - import.meta.env](https://vitejs.dev/guide/env-and-mode.html#env-variables)

