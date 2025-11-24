# 📍 Cómo Seleccionar Ambientes en Vercel

## 🔍 Dónde Encontrar la Opción de Ambientes

### Opción 1: Al Agregar una Variable Nueva

1. Cuando haces clic en **"+ Add More"** o **"Add"** para agregar una variable nueva
2. Aparecerá un formulario con:
   - **Key** (nombre de la variable)
   - **Value** (valor de la variable)
   - **Ambientes** ← **AQUÍ están los checkboxes**
3. Verás 3 checkboxes:
   - ☐ **Production**
   - ☐ **Preview**
   - ☐ **Development**
4. Marca los 3 checkboxes ✅
5. Haz clic en **"Save"** o **"Guardar"**

### Opción 2: Al Editar una Variable Existente

1. Si ya agregaste la variable, haz clic en el **icono de lápiz** ✏️ al lado de la variable
2. O haz clic directamente en la variable para editarla
3. Se abrirá un modal o formulario de edición
4. Verás los checkboxes de ambientes:
   - ☐ **Production**
   - ☐ **Preview**
   - ☐ **Development**
5. Marca los 3 checkboxes ✅
6. Haz clic en **"Save"** o **"Guardar"**

### Opción 3: Si No Ves los Checkboxes

1. Haz clic en el **icono de los 3 puntos** (⋯) al lado de cada variable
2. O haz clic derecho en la variable
3. Selecciona **"Edit"** o **"Editar"**
4. Ahí verás los checkboxes de ambientes

---

## 📝 Pasos Detallados

### Para Variables Nuevas:

1. Haz clic en **"+ Add More"**
2. Completa:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://backup-volabarato-1.onrender.com/api`
3. **Busca los checkboxes debajo** del campo Value:
   ```
   ☐ Production
   ☐ Preview
   ☐ Development
   ```
4. **Marca los 3** ✅
5. Haz clic en **"Save"** o **"Add"**

### Para Variables Existentes:

1. **Haz clic en el icono de lápiz** ✏️ al lado de la variable
2. O **haz clic en la variable** misma
3. Se abrirá un modal de edición
4. Verás los checkboxes de ambientes
5. **Marca los 3** ✅
6. Haz clic en **"Save"**

---

## 🎯 Ubicación Visual

```
Environment Variables
├── Variable 1
│   ├── Key: VITE_API_BASE_URL
│   ├── Value: https://...
│   └── ✏️ [Edit] ← Haz clic aquí
│       └── Ambientes:
│           ☐ Production
│           ☐ Preview
│           ☐ Development
```

---

## ⚠️ Si No Aparecen los Checkboxes

**Puede ser que:**
1. La variable ya está guardada y necesitas editarla
2. El modal de edición está minimizado
3. Necesitas hacer scroll hacia abajo en el formulario

**Solución:**
- Haz clic en el **icono de lápiz** ✏️ de cada variable
- O haz clic directamente en la variable para editarla
- Los checkboxes deberían aparecer en el modal de edición

---

## ✅ Verificación

Después de configurar cada variable, deberías ver:
- ✅ Production marcado
- ✅ Preview marcado
- ✅ Development marcado

---

**Los checkboxes de ambientes aparecen cuando agregas o editas una variable.** 📍

