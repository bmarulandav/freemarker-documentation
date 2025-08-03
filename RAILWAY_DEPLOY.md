# Railway - FreeMarker Documentation Backend

## Configuración para Railway.app

### 1. Configuración del proyecto
- **Root Directory**: `backend/`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 2. Variables de entorno requeridas
```
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://freemarker:gfIg1FrFYk3vxUgm@cluster0.vqdaj.mongodb.net/FreemarkerDocs
```

### 3. Configuración automática
Railway detectará automáticamente:
- Node.js
- package.json en backend/
- Puerto 3000

### 4. Deploy
1. Conectar con GitHub: bmarulandav/freemarker-documentation
2. Seleccionar carpeta: backend/
3. Configurar variables de entorno
4. Deploy automático
