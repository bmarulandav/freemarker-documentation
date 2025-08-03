# 🌐 Despliegue en Hosting Gratuito

## 🎯 Opción 1: Vercel + Railway (Recomendado)

### **Frontend en Vercel (Gratis)**

1. **Crear cuenta en Vercel**: https://vercel.com
2. **Conectar repositorio GitHub**
3. **Configurar build**:
   ```json
   {
     "buildCommand": "echo 'No build needed'",
     "outputDirectory": "frontend-new/public",
     "installCommand": "echo 'No install needed'"
   }
   ```

### **Backend en Railway (Gratis)**

1. **Crear cuenta en Railway**: https://railway.app
2. **Conectar repositorio GitHub**
3. **Configurar variables de entorno**:
   - `MONGODB_URI`: Tu string de MongoDB Atlas
   - `NODE_ENV`: production
   - `PORT`: 5000
   - `FRONTEND_URL`: https://tu-app.vercel.app

4. **Configurar build**:
   - Root Directory: `backend`
   - Start Command: `node src/app.js`

## 🎯 Opción 2: Netlify + Render

### **Frontend en Netlify (Gratis)**

1. **Crear cuenta en Netlify**: https://netlify.com
2. **Drag & drop** la carpeta `frontend-new/public`
3. **Configurar redirects** (crear archivo `_redirects`):
   ```
   /api/* https://tu-backend.render.com/api/:splat 200
   /* /index.html 200
   ```

### **Backend en Render (Gratis)**

1. **Crear cuenta en Render**: https://render.com
2. **Conectar repositorio GitHub**
3. **Configurar servicio**:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `node src/app.js`

## 🎯 Opción 3: GitHub Pages + Heroku alternativas

### **Frontend en GitHub Pages**

1. **Subir código a GitHub**
2. **Ir a Settings > Pages**
3. **Seleccionar carpeta**: `frontend-new/public`

### **Backend en Fly.io (Gratuito)**

1. **Instalar Fly CLI**: https://fly.io/docs/hands-on/install-flyctl/
2. **Login**: `fly auth login`
3. **Crear app**: `fly launch`
4. **Deploy**: `fly deploy`

## 🔧 Configurar URLs para producción

Actualizar `frontend-new/public/config.js`:

```javascript
class ApiConfig {
    constructor() {
        // URLs de producción
        this.isDevelopment = window.location.hostname === 'localhost';
        
        if (this.isDevelopment) {
            this.baseURL = 'http://localhost:5000';
        } else {
            // URL de tu backend en producción
            this.baseURL = 'https://tu-backend.railway.app'; // o render.com, fly.io, etc.
        }
    }
    // ... resto del código
}
```

## 📊 Costos y límites

### **Vercel (Frontend)**
- ✅ Gratis para proyectos personales
- ✅ 100GB bandwidth/mes
- ✅ SSL automático
- ✅ CDN global

### **Railway (Backend)**
- ✅ $5/mes de crédito gratuito
- ✅ ~500 horas/mes gratuitas
- ✅ Base de datos incluida
- ✅ SSL automático

### **Render (Backend)**
- ✅ Plan gratuito disponible
- ⚠️ Se "duerme" después de 15 min inactivo
- ✅ SSL automático

### **Fly.io (Backend)**
- ✅ 2,340 horas gratuitas/mes
- ✅ 160GB bandwidth
- ✅ Mejor rendimiento

## 🚀 Pasos rápidos de despliegue

1. **Sube tu código a GitHub**
2. **Elige combinación**:
   - Vercel (frontend) + Railway (backend)
   - Netlify (frontend) + Render (backend)
3. **Conecta repositorios**
4. **Configura variables de entorno**
5. **¡Listo!**

**Tu aplicación estará disponible en:**
- Frontend: `https://tu-app.vercel.app`
- Backend: `https://tu-backend.railway.app`

## 💡 Ventajas del despliegue sin Docker

- ✅ **Gratis**: Sin costos de Docker Desktop
- ✅ **Simple**: Menos complejidad
- ✅ **Rápido**: Deploy directo
- ✅ **Escalable**: Providers manejan la escala
- ✅ **SSL automático**: HTTPS incluido
- ✅ **CDN**: Distribución global
