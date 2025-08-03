# 🚀 FreeMarker Documentation - Producción Simple

## 📋 Cómo ejecutar en producción (SIN Docker)

### 🎯 Opción 1: Ejecutar localmente

1. **Usar el script automático**:
   ```bash
   # En Windows
   start-production.bat
   
   # En Linux/Mac
   chmod +x start-production.sh
   ./start-production.sh
   ```

2. **O ejecutar manualmente**:
   ```bash
   # Ir al backend
   cd backend
   
   # Instalar dependencias
   npm install
   
   # Configurar variables de entorno
   set NODE_ENV=production
   set PORT=5000
   
   # Ejecutar
   node src/app.js
   ```

### 🎯 Opción 2: Usar PM2 (Recomendado para servidores)

PM2 mantiene tu aplicación funcionando y la reinicia si hay errores.

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Iniciar aplicación
pm2 start ecosystem.config.js

# Ver estado
pm2 status

# Ver logs
pm2 logs

# Reiniciar
pm2 restart all

# Parar
pm2 stop all
```

### 🌐 Hosting gratuito online (opcional)

Si quieres publicar tu aplicación en internet gratis:

#### **Frontend (archivos estáticos)**
- **Netlify**: Sube la carpeta `frontend-new/public`
- **Vercel**: Conecta tu repositorio GitHub
- **GitHub Pages**: Publica desde tu repositorio

#### **Backend (Node.js)**  
- **Railway**: 500 horas gratis/mes
- **Render**: Plan gratuito disponible
- **Fly.io**: 2,340 horas gratuitas/mes

## ✅ Lo que YA tienes funcionando

1. ✅ **Backend Node.js** completo en puerto 5000
2. ✅ **Frontend** listo en `frontend-new/public/`
3. ✅ **Base de datos** MongoDB Atlas configurada
4. ✅ **8 ejemplos** de FreeMarker funcionando
5. ✅ **Playground** para probar código
6. ✅ **API REST** completa

## � Pasos para usar ahora mismo

1. **Abrir terminal** en `c:\Users\Oconer\Desktop\Liferay\`
2. **Ejecutar**: `start-production.bat`
3. **Abrir navegador**: `http://localhost:3000` (frontend)
4. **API disponible**: `http://localhost:5000` (backend)

**¡Tu aplicación ya está lista para producción!** 🎉
