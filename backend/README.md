# FreeMarker Documentation Backend

Backend API para la plataforma de documentación de FreeMarker en Liferay. Una API REST completa para gestionar ejemplos, categorías y usuarios.

## 🚀 Características

- **API REST completa** para ejemplos de FreeMarker
- **Autenticación JWT** con registro y login
- **Gestión de categorías** organizadas y configurables
- **Búsqueda avanzada** con filtros y paginación
- **Sistema de likes** y estadísticas de vistas
- **Middleware de seguridad** con rate limiting
- **Base de datos MongoDB** con Mongoose
- **Validación de datos** robusta
- **Datos de ejemplo** para desarrollo

## 📋 Prerequisitos

- Node.js 16+
- MongoDB 4.4+
- npm o yarn

## 🛠️ Instalación

1. **Clonar e instalar dependencias:**
```bash
npm install
```

2. **Configurar variables de entorno:**
```bash
cp backend/.env.example backend/.env
```

Editar `backend/.env` con tus configuraciones:
```env
MONGODB_URI=mongodb://localhost:27017/freemarker-docs
JWT_SECRET=tu-jwt-secret-super-seguro
PORT=5000
FRONTEND_URL=http://localhost:3000
```

3. **Inicializar base de datos con datos de ejemplo:**
```bash
npm run seed
```

4. **Iniciar servidor de desarrollo:**
```bash
npm run dev
```

La API estará disponible en `http://localhost:5000`

## 📚 API Endpoints

### 🔐 Autenticación
```
POST   /api/auth/register          # Registrar usuario
POST   /api/auth/login             # Iniciar sesión
GET    /api/auth/me                # Perfil actual
PUT    /api/auth/profile           # Actualizar perfil
PUT    /api/auth/change-password   # Cambiar contraseña
POST   /api/auth/forgot-password   # Recuperar contraseña
PUT    /api/auth/reset-password/:token # Restablecer contraseña
```

### 📄 Ejemplos
```
GET    /api/examples               # Listar ejemplos (con filtros)
GET    /api/examples/popular       # Ejemplos populares
GET    /api/examples/featured      # Ejemplos destacados
GET    /api/examples/search        # Buscar ejemplos
GET    /api/examples/:slug         # Obtener ejemplo por slug
POST   /api/examples               # Crear ejemplo (Auth)
PUT    /api/examples/:id           # Actualizar ejemplo (Auth)
DELETE /api/examples/:id           # Eliminar ejemplo (Auth)
POST   /api/examples/:id/like      # Dar like a ejemplo
```

### 📁 Categorías
```
GET    /api/categories             # Listar categorías
GET    /api/categories/stats       # Estadísticas de categorías
GET    /api/categories/:slug       # Obtener categoría por slug
POST   /api/categories             # Crear categoría (Admin)
PUT    /api/categories/:id         # Actualizar categoría (Admin)
DELETE /api/categories/:id         # Eliminar categoría (Admin)
PUT    /api/categories/reorder     # Reordenar categorías (Admin)
```

## 🎯 Filtros y Búsqueda

### Filtros disponibles para ejemplos:
- `category`: Filtrar por categoría (slug)
- `difficulty`: principiante, intermedio, avanzado
- `liferayVersion`: Versión de Liferay
- `context`: template, fragment, theme, adt, web-content
- `search`: Búsqueda de texto completo
- `featured`: Solo ejemplos destacados
- `popular`: Ordenar por popularidad
- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 12)

### Ejemplo de uso:
```
GET /api/examples?category=variables-utiles&difficulty=principiante&page=1&limit=10
```

## 🏗️ Estructura del Proyecto

```
backend/
├── src/
│   ├── controllers/         # Controladores de rutas
│   │   ├── authController.js
│   │   ├── exampleController.js
│   │   └── categoryController.js
│   ├── models/              # Modelos de MongoDB
│   │   ├── User.js
│   │   ├── Example.js
│   │   └── Category.js
│   ├── routes/              # Definición de rutas
│   │   ├── auth.js
│   │   ├── examples.js
│   │   └── categories.js
│   ├── middleware/          # Middleware personalizado
│   │   └── auth.js
│   ├── config/              # Configuraciones
│   │   └── database.js
│   ├── app.js               # Aplicación principal
│   └── seedDatabase.js      # Script de inicialización
├── .env                     # Variables de entorno
└── package.json
```

## 🔒 Autenticación y Autorización

### Niveles de acceso:
- **Público**: Ver ejemplos y categorías
- **Usuario autenticado**: Crear, editar y eliminar sus propios ejemplos
- **Administrador**: Gestión completa de categorías y todos los ejemplos

### Headers requeridos para rutas protegidas:
```
Authorization: Bearer <token-jwt>
```

## 💾 Modelos de Datos

### Example
```javascript
{
  title: String,              // Título del ejemplo
  slug: String,               // URL amigable (auto-generado)
  description: String,        // Descripción breve
  code: String,               // Código FreeMarker
  htmlOutput: String,         // Salida HTML esperada
  explanation: String,        // Explicación detallada
  category: ObjectId,         // Referencia a categoría
  tags: [String],             // Etiquetas
  difficulty: String,         // principiante|intermedio|avanzado
  liferayVersion: String,     // Versión de Liferay
  author: {                   // Información del autor
    name: String,
    email: String,
    avatar: String
  },
  usage: {                    // Contexto de uso
    context: String,          // template|fragment|theme|adt|web-content
    variables: [{            // Variables necesarias
      name: String,
      type: String,
      description: String,
      required: Boolean
    }]
  },
  views: Number,              // Número de visualizaciones
  likes: Number,              // Número de likes
  isPublished: Boolean,       // Estado de publicación
  isFeatured: Boolean         // Destacado en home
}
```

### Category
```javascript
{
  name: String,               // Nombre de la categoría
  slug: String,               // URL amigable (auto-generado)
  description: String,        // Descripción
  icon: String,               // Icono (nombre)
  color: String,              // Color hex
  order: Number,              // Orden de visualización
  isActive: Boolean,          // Estado activo
  exampleCount: Number        // Contador de ejemplos
}
```

## 🧪 Datos de Ejemplo

El comando `npm run seed` crea:
- 9 categorías predefinidas de FreeMarker
- 3 ejemplos de muestra
- Usuario administrador: `admin` / `admin123`

## 🛡️ Seguridad

- **Rate limiting**: 100 requests por IP cada 15 minutos
- **Helmet**: Headers de seguridad
- **CORS**: Configurado para frontend específico
- **Validación**: Mongoose schemas con validaciones
- **JWT**: Tokens seguros con expiración
- **Bcrypt**: Hash de contraseñas con salt 12

## 📊 Funcionalidades Avanzadas

### Búsqueda de texto completo
- Índices de texto en MongoDB
- Búsqueda en título, descripción, explicación y tags
- Ordenamiento por relevancia

### Sistema de estadísticas
- Contador de vistas automático
- Sistema de likes
- Estadísticas por categoría

### Paginación inteligente
- Plugin mongoose-paginate-v2
- Metadatos de paginación incluidos
- Límites configurables

## 🚀 Scripts Disponibles

```bash
npm start          # Producción
npm run dev        # Desarrollo con nodemon
npm run seed       # Inicializar base de datos
```

## 🔧 Variables de Entorno

| Variable | Descripción | Default |
|----------|-------------|---------|
| `MONGODB_URI` | URL de conexión MongoDB | `mongodb://localhost:27017/freemarker-docs` |
| `JWT_SECRET` | Clave secreta para JWT | `freemarker-docs-secret` |
| `JWT_EXPIRE` | Expiración del token | `30d` |
| `PORT` | Puerto del servidor | `5000` |
| `NODE_ENV` | Entorno de ejecución | `development` |
| `FRONTEND_URL` | URL del frontend para CORS | `http://localhost:3000` |

## 📝 Notas de Desarrollo

- Los slugs se generan automáticamente basados en el título
- El contador de ejemplos por categoría se actualiza automáticamente
- Los timestamps se manejan automáticamente con Mongoose
- Las contraseñas se hashean automáticamente antes de guardar
- Los tokens JWT incluyen solo el ID del usuario

---

🔗 **Próximo paso**: [Configurar Frontend React](../frontend/README.md)
