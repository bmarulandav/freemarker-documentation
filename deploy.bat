@echo off
REM Script para construir y ejecutar la aplicación con Docker en Windows

echo 🐳 Iniciando despliegue de FreeMarker Docs...

REM Detener contenedores existentes
echo 🛑 Deteniendo contenedores existentes...
docker-compose down

REM Construir imágenes
echo 🔨 Construyendo imágenes Docker...
docker-compose build --no-cache

REM Ejecutar contenedores
echo 🚀 Iniciando contenedores...
docker-compose up -d

REM Mostrar estado
echo 📊 Estado de los contenedores:
docker-compose ps

echo ✅ Despliegue completado!
echo.
echo 🌐 Aplicación disponible en:
echo    Frontend: http://localhost:3000
echo    Backend API: http://localhost:5000
echo.
echo 📝 Para ver logs en tiempo real:
echo    docker-compose logs -f
echo.
echo 🛑 Para detener la aplicación:
echo    docker-compose down

pause
