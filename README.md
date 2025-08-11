# Volá Barato - Agencia de Turismo

Aplicación web completa para la agencia de turismo "Volá Barato" desarrollada con React, TypeScript y tecnologías modernas.

## 🚀 Características

- **Página de inicio** con presentación de la empresa y carrusel de imágenes
- **Catálogo de viajes** con búsquedas y filtros por destino, fechas y precios
- **Formulario de contacto** con validaciones
- **Suscripción a newsletter** con almacenamiento de datos
- **Panel de administración** con CRUD completo para viajes, reservas y suscriptores
- **Autenticación** con Firebase y JWT
- **Diseño responsivo** para móvil y escritorio
- **Formularios validados** con React Hook Form y Joi

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18** con TypeScript
- **Vite** como bundler
- **Redux Toolkit** para manejo de estado
- **React Router DOM** para navegación
- **React Hook Form** para formularios
- **Joi** para validaciones
- **Firebase** para autenticación
- **CSS3** con variables CSS y Flexbox/Grid
- **React Icons** para iconografía

### Backend (Próximamente)
- **Node.js** con Express
- **MongoDB** con Mongoose
- **JWT** para autenticación
- **Joi** para validaciones

## 📱 Funcionalidades Principales

### Página Pública
- Hero section con presentación de la empresa
- Carrusel de imágenes de destinos turísticos
- Sección de características y beneficios
- Próximas propuestas de viajes
- Formulario de suscripción a newsletter
- Información de contacto y redes sociales

### Catálogo de Viajes
- Listado de viajes disponibles
- Búsqueda por texto libre
- Filtros por categoría y rango de precios
- Vista detallada de cada viaje

### Panel de Administración
- **Gestión de Viajes**: Crear, editar, eliminar y listar viajes
- **Gestión de Reservas**: Administrar reservas de clientes
- **Gestión de Suscriptores**: Lista de suscriptores al newsletter
- **Estadísticas**: Resumen de datos importantes
- **Autenticación**: Login/logout seguro

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 16+ 
- npm o yarn

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd volabarato_frontend
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crear un archivo `.env` en la raíz del proyecto:

```env
VITE_FIREBASE_API_KEY=tu_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain_aqui
VITE_FIREBASE_PROJECT_ID=tu_project_id_aqui
VITE_FIREBASE_STORAGE_BUCKET=tu_storage_bucket_aqui
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id_aqui
VITE_FIREBASE_APP_ID=tu_app_id_aqui
VITE_API_URL=http://localhost:5000/api
```

### 4. Configurar Firebase
1. Crear un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilitar Authentication con Email/Password
3. Obtener las credenciales de configuración
4. Agregar las credenciales al archivo `.env`

### 5. Ejecutar en desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### 6. Construir para producción
```bash
npm run build
```

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── admin/          # Componentes del panel de administración
│   ├── auth/           # Componentes de autenticación
│   ├── common/         # Componentes comunes (modales, etc.)
│   ├── forms/          # Formularios reutilizables
│   └── layout/         # Componentes de layout (Navbar, Footer)
├── pages/              # Páginas principales de la aplicación
├── store/              # Configuración de Redux
│   └── slices/         # Slices de Redux para cada funcionalidad
├── firebase/           # Configuración de Firebase
├── App.tsx             # Componente principal de la aplicación
├── main.tsx            # Punto de entrada
└── index.css           # Estilos globales
```

## 🔐 Autenticación

La aplicación utiliza Firebase Authentication para el manejo de usuarios:

- **Login**: Formulario de acceso con validaciones
- **Protección de rutas**: Rutas privadas protegidas por autenticación
- **JWT**: Tokens para mantener la sesión del usuario
- **Logout**: Cierre de sesión seguro

## 📊 Estado de la Aplicación

El estado se maneja con Redux Toolkit:

- **Auth Slice**: Estado de autenticación del usuario
- **Travel Slice**: Gestión de viajes
- **Booking Slice**: Gestión de reservas
- **Subscriber Slice**: Gestión de suscriptores

## 🎨 Diseño y UX

- **Diseño responsivo** que se adapta a todos los dispositivos
- **Sistema de colores** consistente con variables CSS
- **Animaciones** suaves y transiciones
- **Iconografía** clara y accesible
- **Tipografía** legible y jerárquica

## 📱 Responsividad

La aplicación está optimizada para:
- **Móviles**: Diseño adaptativo con navegación hamburguesa
- **Tablets**: Layout intermedio optimizado
- **Desktop**: Vista completa con todas las funcionalidades

## 🚀 Despliegue

### Vercel (Recomendado)
1. Conectar el repositorio a Vercel
2. Configurar las variables de entorno
3. Desplegar automáticamente

### Otros proveedores
La aplicación se puede desplegar en cualquier proveedor que soporte aplicaciones React estáticas.

## 🔧 Scripts Disponibles

- `npm run dev` - Ejecutar en modo desarrollo
- `npm run build` - Construir para producción
- `npm run preview` - Previsualizar la build de producción
- `npm run lint` - Ejecutar linter

## 📝 Próximas Funcionalidades

- [ ] Integración con backend Node.js
- [ ] Base de datos MongoDB
- [ ] Sistema de reservas online
- [ ] Notificaciones por email
- [ ] Panel de estadísticas avanzado
- [ ] Sistema de pagos
- [ ] Aplicación móvil nativa

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Contacto

- **Email**: info@volabarato.com.ar
- **WhatsApp**: +54 9 341 216-3431
- **Instagram**: [@volabaratooficial](https://instagram.com/volabaratooficial)
- **Facebook**: [Volá Barato](https://www.facebook.com/profile.php?id=61577465587884)

## 🙏 Agradecimientos

- Equipo de desarrollo
- Comunidad de React y TypeScript
- Contribuidores de código abierto
- Clientes de Volá Barato

---

**Volá Barato** - Para quienes viajan con el cuerpo y también con la imaginación ✈️
