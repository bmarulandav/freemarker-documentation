@echo off
echo 🚀 Iniciando FreeMarker Docs en modo producción...

REM Verificar Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Node.js no está instalado
    echo 📥 Descarga Node.js desde: https://nodejs.org/
    pause
    exit /b 1
)

REM Ir al directorio del backend
cd backend

REM Instalar dependencias si no existen
if not exist "node_modules" (
    echo 📦 Instalando dependencias del backend...
    npm install
)

REM Configurar variables de entorno
set NODE_ENV=production
set PORT=5000

echo 🗄️ Configuración:
echo    - Modo: %NODE_ENV%
echo    - Puerto: %PORT%
echo    - MongoDB: Atlas (configurado en .env)

REM Verificar si existe .env
if not exist ".env" (
    echo ⚠️  Archivo .env no encontrado
    echo 📝 Creando .env desde .env.example...
    if exist ".env.example" (
        copy ".env.example" ".env"
    ) else (
        echo MONGODB_URI=mongodb+srv://tu-usuario:tu-password@tu-cluster.mongodb.net/freemarker-docs > .env
        echo NODE_ENV=production >> .env
        echo PORT=5000 >> .env
        echo FRONTEND_URL=http://localhost:3000 >> .env
    )
    echo ✏️  Por favor edita el archivo backend\.env con tus credenciales de MongoDB
    pause
)

echo 🎯 Iniciando servidor backend...
echo 📍 Backend disponible en: http://localhost:5000
echo 📍 API Health: http://localhost:5000/api/health
echo 📍 Frontend: Abre index.html en el navegador desde frontend-new/public/
echo.
echo 🛑 Para detener el servidor, presiona Ctrl+C
echo.

REM Iniciar aplicación
node src/app.js

pause
