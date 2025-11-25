# 🔥 Cómo Habilitar Firebase Storage - Guía Paso a Paso

## ⚠️ Importante: Plan de Facturación

Firebase Storage requiere el plan **Blaze** (pago por uso), PERO:
- ✅ **Tier gratuito generoso**: 5 GB de almacenamiento y 1 GB de transferencia/día
- ✅ **No hay costo** hasta que superes estos límites
- ✅ **Solo pagas** lo que uses por encima del límite gratuito
- ✅ **Puedes configurar límites** para evitar cargos inesperados

---

## PASO 1: Actualizar Plan de Facturación

### 1.1. En la Pantalla de Storage
1. Verás un mensaje: **"Para usar Storage, actualiza el plan de facturación de tu proyecto"**
2. Haz clic en el botón **"Actualizar proyecto"** (botón naranja)

### 1.2. Seleccionar Plan Blaze
1. Se abrirá una nueva pantalla con los planes disponibles
2. Selecciona el plan **"Blaze"** (Pay as you go / Pago por uso)
3. Haz clic en **"Continuar"** o **"Continue"**

### 1.3. Configurar Facturación (Si es necesario)
1. Si es la primera vez, te pedirá agregar un método de pago
2. **NO te preocupes**: No se te cobrará nada hasta que superes el tier gratuito
3. Agrega tu tarjeta de crédito o método de pago
4. Completa la información de facturación

### 1.4. Configurar Límites de Presupuesto (Recomendado)
1. Firebase te permitirá configurar alertas de presupuesto
2. **Recomendación**: Configura una alerta en $1 USD
3. Esto te avisará si hay algún uso inesperado
4. Puedes configurar un límite de presupuesto para evitar cargos

---

## PASO 2: Habilitar Storage

Una vez que el plan esté actualizado:

### 2.1. Volver a Storage
1. Ve a Firebase Console → **Storage** (menú lateral izquierdo)
2. Ahora deberías ver un botón **"Get started"** o **"Comenzar"**
3. Haz clic en **"Get started"**

### 2.2. Configurar Storage
1. Selecciona **"Start in test mode"** (modo de prueba)
   - Esto permite lectura y escritura sin autenticación (solo para desarrollo)
2. Selecciona la **ubicación del bucket**:
   - **Recomendado**: `us-central` (Estados Unidos Central)
   - O la ubicación más cercana a tus usuarios
3. Haz clic en **"Done"** o **"Listo"**

---

## PASO 3: Configurar Reglas de Seguridad

### 3.1. Ir a Rules
1. En Storage, ve a la pestaña **"Rules"** o **"Reglas"**
2. Verás las reglas por defecto en modo test

### 3.2. Actualizar Reglas
Reemplaza el código con:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Permitir lectura pública de todas las imágenes
    match /{allPaths=**} {
      allow read: if true;
      // Permitir escritura (por ahora sin autenticación para pruebas)
      // En producción, cambiar a: allow write: if request.auth != null;
      allow write: if true;
    }
  }
}
```

### 3.3. Publicar Reglas
1. Haz clic en **"Publish"** o **"Publicar"**
2. Espera a que se publiquen (puede tardar unos segundos)

---

## PASO 4: Verificar que Storage Esté Habilitado

### 4.1. Verificar en Firebase Console
1. En Storage, deberías ver:
   - Una lista vacía (porque aún no hay archivos)
   - Un botón **"Upload file"** o **"Subir archivo"**
   - Las pestañas: **"Files"**, **"Rules"**, **"Usage"**

### 4.2. Probar Subida (Opcional)
1. Haz clic en **"Upload file"**
2. Selecciona una imagen de prueba
3. Debería subirse correctamente
4. Puedes eliminarla después

---

## 💰 Información sobre Costos

### Tier Gratuito (Siempre disponible)
- **Almacenamiento**: 5 GB
- **Transferencia de descarga**: 1 GB/día
- **Operaciones**: 20,000 operaciones/día

### Costos Adicionales (Solo si superas el tier gratuito)
- **Almacenamiento**: $0.026 USD por GB/mes
- **Transferencia**: $0.12 USD por GB
- **Operaciones**: $0.05 USD por 100,000 operaciones

### Ejemplo Real
- Si subes 100 imágenes de 1 MB cada una = 100 MB
- Esto está **muy por debajo** del límite gratuito de 5 GB
- **Costo**: $0 USD

---

## 🔒 Configurar Límites de Presupuesto (Recomendado)

### Para Evitar Cargos Inesperados:

1. Ve a Firebase Console → ⚙️ → **Usage and billing**
2. Haz clic en **"Set budget alert"** o **"Configurar alerta de presupuesto"**
3. Configura:
   - **Presupuesto**: $1 USD (o el que prefieras)
   - **Alertas**: Te avisará cuando llegues al 50%, 90%, 100%
4. Guarda la configuración

Esto te protegerá de cargos inesperados.

---

## ✅ Checklist

- [ ] Plan Blaze seleccionado
- [ ] Método de pago configurado (si es necesario)
- [ ] Storage habilitado
- [ ] Reglas de seguridad configuradas
- [ ] Reglas publicadas
- [ ] Storage funcionando (puedes ver la interfaz)

---

## 🔧 Solución de Problemas

### No veo el botón "Get started"
**Solución**: 
- Verifica que hayas actualizado el plan de facturación
- Refresca la página
- Asegúrate de estar en el proyecto correcto

### No puedo agregar método de pago
**Solución**:
- Verifica que tu cuenta de Google tenga permisos
- Intenta desde otro navegador
- Verifica que la información de facturación sea correcta

### Las reglas no se publican
**Solución**:
- Verifica que la sintaxis sea correcta
- Asegúrate de tener permisos de administrador en el proyecto
- Intenta copiar y pegar el código nuevamente

---

## 📝 Notas Importantes

1. **No hay costo inicial**: El tier gratuito es muy generoso
2. **Puedes cancelar**: Puedes volver al plan Spark en cualquier momento
3. **Límites de presupuesto**: Configúralos para estar seguro
4. **Solo pagas lo que usas**: Si no superas el límite gratuito, no pagas nada

---

## 🎯 Próximo Paso

Una vez que Storage esté habilitado, continúa con:
1. ✅ Obtener configuración de Firebase (Paso 3 de la guía anterior)
2. ✅ Configurar variables de entorno
3. ✅ Probar subida de imágenes

---

¿Necesitas ayuda con algún paso específico? Avísame y te guío. 🚀

