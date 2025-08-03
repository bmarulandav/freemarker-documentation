#!/bin/bash

echo "🚀 Iniciando FreeMarker Docs en modo producción..."

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js no está instalado"
    echo "📥 Instala Node.js desde: https://nodejs.org/"
    exit 1
fi

# Ir al directorio del backend
cd backend

# Instalar dependencias si no existen
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias del backend..."
    npm install
fi

# Configurar variables de entorno
export NODE_ENV=production
export PORT=5000

echo "🗄️ Configuración:"
echo "   - Modo: $NODE_ENV"
echo "   - Puerto: $PORT"
echo "   - MongoDB: Atlas (configurado en .env)"

# Verificar si existe .env
if [ ! -f ".env" ]; then
    echo "⚠️  Archivo .env no encontrado"
    echo "📝 Creando .env desde .env.example..."
    if [ -f ".env.example" ]; then
        cp ".env.example" ".env"
    else
        cat > .env << EOF
MONGODB_URI=mongodb+srv://tu-usuario:tu-password@tu-cluster.mongodb.net/freemarker-docs
NODE_ENV=production
PORT=5000
FRONTEND_URL=http://localhost:3000
EOF
    fi
    echo "✏️  Por favor edita el archivo backend/.env con tus credenciales de MongoDB"
    read -p "Presiona Enter para continuar..."
fi

echo "🎯 Iniciando servidor backend..."
echo "📍 Backend disponible en: http://localhost:5000"
echo "📍 API Health: http://localhost:5000/api/health"
echo "📍 Frontend: Abre index.html en el navegador desde frontend-new/public/"
echo ""
echo "🛑 Para detener el servidor, presiona Ctrl+C"
echo ""

# Iniciar aplicación
node src/app.js
