# 🚀 FreeMarker Documentation - Despliegue en Producción

## 📋 Requisitos previos

- **Docker Desktop**: [Descargar aquí](https://www.docker.com/products/docker-desktop/)
- **MongoDB Atlas**: Cuenta configurada con cluster
- **Git**: Para clonar el repositorio

## 🐳 Despliegue rápido con Docker

### 1. Configurar variables de entorno

1. Copia el archivo de ejemplo:
   ```bash
   cp .env.production .env
   ```

2. Edita el archivo `.env` con tus credenciales de MongoDB Atlas:
   ```bash
   MONGODB_URI=mongodb+srv://tu-usuario:tu-password@tu-cluster.mongodb.net/freemarker-docs
   NODE_ENV=production
   PORT=5000
   FRONTEND_URL=http://localhost:3000
   ```

### 2. Ejecutar la aplicación

**En Windows:**
```bash
./deploy.bat
```

**En Linux/Mac:**
```bash
chmod +x deploy.sh
./deploy.sh
```

### 3. Acceder a la aplicación

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health**: http://localhost:5000/api/health

## 🛠️ Comandos útiles de Docker

### Ver estado de contenedores
```bash
docker-compose ps
```

### Ver logs en tiempo real
```bash
docker-compose logs -f
```

### Ver logs de un servicio específico
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Reiniciar servicios
```bash
docker-compose restart
```

### Detener la aplicación
```bash
docker-compose down
```

### Reconstruir imágenes (después de cambios)
```bash
docker-compose build --no-cache
docker-compose up -d
```

### Limpiar contenedores e imágenes no utilizadas
```bash
docker system prune -a
```

## 🏗️ Arquitectura de la aplicación

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   Frontend      │────│     Nginx       │────│    Backend      │
│   (HTML/JS/CSS) │    │   (Proxy/Cache) │    │   (Node.js)     │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                                               │
        │                                               │
        └─────────────── Puerto 3000 ───────────────────┘
                                │
                                ▼
                    ┌─────────────────┐
                    │                 │
                    │  MongoDB Atlas  │
                    │   (Cloud DB)    │
                    │                 │
                    └─────────────────┘
```

## 🔧 Configuración de producción

### Backend optimizado
- ✅ Node.js en imagen Alpine (menor tamaño)
- ✅ Usuario no-root para seguridad
- ✅ Variables de entorno configurables
- ✅ Health checks integrados
- ✅ Reinicio automático

### Frontend optimizado
- ✅ Nginx como servidor web estático
- ✅ Proxy reverso para API
- ✅ Cache de archivos estáticos
- ✅ Headers de seguridad
- ✅ Compresión gzip automática

### Base de datos
- ✅ MongoDB Atlas (cloud)
- ✅ SSL/TLS habilitado
- ✅ Backup automático
- ✅ Escalabilidad automática

## 🔍 Monitoreo y troubleshooting

### Verificar salud de la aplicación
```bash
# Backend
curl http://localhost:5000/api/health

# Frontend
curl http://localhost:3000
```

### Ver uso de recursos
```bash
docker stats
```

### Acceder al contenedor (debugging)
```bash
# Backend
docker-compose exec backend sh

# Frontend
docker-compose exec frontend sh
```

### Backup de la base de datos
Si usas MongoDB local (opcional):
```bash
docker-compose exec mongodb mongodump --out /backup
```

## 🚀 Despliegue en servidores

### Para servidores Linux (Ubuntu/CentOS)

1. **Instalar Docker**:
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   sudo usermod -aG docker $USER
   ```

2. **Instalar Docker Compose**:
   ```bash
   sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

3. **Clonar y ejecutar**:
   ```bash
   git clone <tu-repositorio>
   cd freemarker-docs
   chmod +x deploy.sh
   ./deploy.sh
   ```

### Para Cloud Providers (AWS, Google Cloud, Azure)

El proyecto está listo para desplegarse en:
- **AWS ECS/Fargate**
- **Google Cloud Run**
- **Azure Container Instances**
- **DigitalOcean App Platform**
- **Heroku Container Registry**

## 📊 Métricas de producción

- **Tamaño de imágenes**:
  - Backend: ~150MB
  - Frontend: ~25MB
  - Total: ~175MB

- **Tiempo de arranque**:
  - Backend: ~5-10 segundos
  - Frontend: ~2-3 segundos

- **Uso de memoria**:
  - Backend: ~100-200MB
  - Frontend: ~10-20MB

## 🔐 Seguridad

- ✅ Contenedores ejecutan como usuario no-root
- ✅ Headers de seguridad configurados
- ✅ Variables de entorno para credenciales
- ✅ MongoDB con SSL/TLS
- ✅ CORS configurado correctamente
- ✅ Rate limiting en API

## 🆘 Soporte

Si tienes problemas:

1. **Verifica Docker**: `docker --version`
2. **Verifica logs**: `docker-compose logs -f`
3. **Verifica variables**: `cat .env`
4. **Reinicia servicios**: `docker-compose restart`

---

**¡Tu aplicación FreeMarker Docs está lista para producción! 🎉**
