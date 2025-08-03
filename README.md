# 🚀 FreeMarker Documentation

> Documentación completa y ejemplos prácticos de FreeMarker para Liferay DXP

## ✨ Características

- 📚 **8 ejemplos prácticos** organizados por dificultad
- 🎮 **Playground interactivo** para probar código FreeMarker
- 📝 **Documentación completa** de sintaxis, variables, directivas y funciones
- 🏢 **Integración con Liferay DXP** - objetos y contextos específicos
- 🌐 **API REST completa** para gestionar ejemplos
- 📱 **Interfaz responsive** y moderna

## 🚀 Inicio rápido

### Opción 1: Script automático (Recomendado)

```bash
# En Windows
start-production.bat

# En Linux/Mac  
chmod +x start-production.sh
./start-production.sh
```

### Opción 2: Manual

```bash
# 1. Ir al backend
cd backend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno en .env
MONGODB_URI=tu-connection-string-de-mongodb-atlas
NODE_ENV=production
PORT=5000

# 4. Iniciar servidor
node src/app.js
```

### Acceder a la aplicación

- **Frontend**: Abre `frontend-new/public/index.html` en tu navegador
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## 📁 Estructura del proyecto

```
📦 freemarker-docs/
├── 📂 backend/              # Servidor Node.js + Express
│   ├── 📂 src/
│   │   ├── app.js          # Aplicación principal
│   │   ├── 📂 models/      # Modelos MongoDB
│   │   └── 📂 routes/      # Rutas de la API
│   └── package.json
├── 📂 frontend-new/public/  # Frontend (HTML/CSS/JS)
│   ├── index.html          # Página principal
│   ├── app.js             # Aplicación SPA
│   ├── styles.css         # Estilos
│   └── config.js          # Configuración API
├── ecosystem.config.js     # Configuración PM2
├── start-production.bat    # Script Windows
└── start-production.sh     # Script Linux/Mac
```

## 🛠️ Stack tecnológico

### Backend
- **Node.js** + Express.js
- **MongoDB Atlas** (base de datos en la nube)
- **Mongoose** (ODM)
- **Procesador FreeMarker** personalizado

### Frontend  
- **Vanilla JavaScript** (SPA)
- **CSS moderno** con Grid y Flexbox
- **Router personalizado** para navegación
- **Fetch API** para comunicación con backend

## 📚 Ejemplos incluidos

### Básicos (4 ejemplos)
- Variables simples
- Listas y bucles  
- Mensajes personalizados
- Tarjetas de usuario

### Avanzados (2 ejemplos)
- Funciones de texto avanzadas
- Macros y funciones personalizadas

### Liferay (2 ejemplos)
- Variables de theme_display
- Web Content Templates

## 🎮 Playground

El playground permite:
- ✅ Escribir código FreeMarker en tiempo real
- ✅ Proporcionar datos JSON personalizados
- ✅ Ver el resultado procesado instantáneamente
- ✅ Cargar ejemplos predefinidos con un clic

## 🔧 API Endpoints

```bash
GET  /api/health           # Estado del servidor
GET  /api/examples         # Obtener todos los ejemplos
GET  /api/categories       # Obtener categorías
POST /api/process-template # Procesar template FreeMarker
```

## 🌐 Despliegue en producción

### Local con PM2 (Recomendado)
```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 status
```

### Hosting gratuito
- **Frontend**: Netlify, Vercel, GitHub Pages
- **Backend**: Railway, Render, Fly.io

Ver `PRODUCCION_SIN_DOCKER.md` para detalles completos.

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 🎯 Próximas funcionalidades

- [ ] Más ejemplos de FreeMarker
- [ ] Sistema de favoritos
- [ ] Buscador de ejemplos
- [ ] Exportar ejemplos como archivos
- [ ] Tema oscuro/claro
- [ ] Autocompletado en el playground

---

**¡Desarrollado con ❤️ para la comunidad de Liferay!**
